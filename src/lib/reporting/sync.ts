import sitemap from "@/app/sitemap";
import { getContentReleaseTimeline } from "@/lib/content-freshness";
import { getGoogleReportingConfiguration } from "@/lib/reporting/config";
import { getGoogleAccessToken } from "@/lib/reporting/google-auth";
import { fetchGa4Data, fetchGscData } from "@/lib/reporting/google-data";
import { getGeoContentRegistry } from "@/lib/seo/geo-content-registry";
import {
  recordReportingSyncRun,
  upsertGa4Data,
  upsertGscData,
  upsertGeoContentRegistry,
  upsertSiteSnapshot,
} from "@/lib/reporting/repository";
import type { ProviderSyncResult } from "@/lib/reporting/types";

const ROLLING_WINDOW_DAYS = 30;

function dateInShanghai(value: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function shiftDate(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown reporting sync error";
}

async function finishRun(params: {
  result: ProviderSyncResult;
  trigger: string;
}): Promise<ProviderSyncResult> {
  await recordReportingSyncRun({
    provider: params.result.provider,
    status: params.result.status,
    trigger: params.trigger,
    startDate: params.result.startDate,
    endDate: params.result.endDate,
    rowCount: params.result.rowCount,
    error: params.result.error,
  });
  return params.result;
}

async function syncSiteData(trigger: string, today: string): Promise<ProviderSyncResult> {
  try {
    const entries = sitemap();
    const paths = entries.map((entry) => {
      const path = new URL(entry.url).pathname;
      return path === "/" ? "" : path;
    });
    const release = getContentReleaseTimeline().find((item) => item.date === today);
    await Promise.all([
      upsertSiteSnapshot({
        snapshotDate: today,
        publicPageCount: entries.length,
        updatedPageCount: release?.count ?? 0,
      }),
      upsertGeoContentRegistry(getGeoContentRegistry(paths)),
    ]);
    return finishRun({
      trigger,
      result: {
        provider: "site",
        status: "success",
        rowCount: entries.length,
        startDate: today,
        endDate: today,
      },
    });
  } catch (error) {
    return finishRun({
      trigger,
      result: {
        provider: "site",
        status: "failed",
        rowCount: 0,
        startDate: today,
        endDate: today,
        error: errorMessage(error),
      },
    });
  }
}

async function syncGa4(params: {
  accessToken: string;
  trigger: string;
  startDate: string;
  endDate: string;
}): Promise<ProviderSyncResult> {
  try {
    const data = await fetchGa4Data(params);
    const rowCount = await upsertGa4Data(data);
    return finishRun({
      trigger: params.trigger,
      result: {
        provider: "ga4",
        status: "success",
        rowCount,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
  } catch (error) {
    return finishRun({
      trigger: params.trigger,
      result: {
        provider: "ga4",
        status: "failed",
        rowCount: 0,
        startDate: params.startDate,
        endDate: params.endDate,
        error: errorMessage(error),
      },
    });
  }
}

async function syncGsc(params: {
  accessToken: string;
  trigger: string;
  startDate: string;
  endDate: string;
  snapshotDate: string;
  inspectionUrls: readonly string[];
}): Promise<ProviderSyncResult> {
  try {
    const data = await fetchGscData(params);
    const rowCount = await upsertGscData({ ...data, snapshotDate: params.snapshotDate });
    return finishRun({
      trigger: params.trigger,
      result: {
        provider: "gsc",
        status: "success",
        rowCount,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
  } catch (error) {
    return finishRun({
      trigger: params.trigger,
      result: {
        provider: "gsc",
        status: "failed",
        rowCount: 0,
        startDate: params.startDate,
        endDate: params.endDate,
        error: errorMessage(error),
      },
    });
  }
}

async function recordGoogleUnavailable(params: {
  trigger: string;
  ga4StartDate: string;
  gscStartDate: string;
  ga4EndDate: string;
  gscEndDate: string;
  status: "failed" | "not_configured";
  error: string;
}): Promise<[ProviderSyncResult, ProviderSyncResult]> {
  return Promise.all([
    finishRun({
      trigger: params.trigger,
      result: {
        provider: "ga4",
        status: params.status,
        rowCount: 0,
        startDate: params.ga4StartDate,
        endDate: params.ga4EndDate,
        error: params.error,
      },
    }),
    finishRun({
      trigger: params.trigger,
      result: {
        provider: "gsc",
        status: params.status,
        rowCount: 0,
        startDate: params.gscStartDate,
        endDate: params.gscEndDate,
        error: params.error,
      },
    }),
  ]);
}

export async function syncReportingData(trigger: string): Promise<{
  configured: boolean;
  results: ProviderSyncResult[];
}> {
  const today = dateInShanghai(new Date());
  const ga4EndDate = shiftDate(today, -1);
  const gscEndDate = shiftDate(today, -2);
  const ga4StartDate = shiftDate(ga4EndDate, -(ROLLING_WINDOW_DAYS - 1));
  const gscStartDate = shiftDate(gscEndDate, -(ROLLING_WINDOW_DAYS - 1));
  const inspectionUrls = sitemap().map((entry) => entry.url);
  const siteResult = await syncSiteData(trigger, today);
  const configuration = getGoogleReportingConfiguration();

  if (!configuration.configured || !configuration.credentials) {
    const googleResults = await recordGoogleUnavailable({
      trigger,
      ga4StartDate,
      gscStartDate,
      ga4EndDate,
      gscEndDate,
      status: "not_configured",
      error: configuration.reason ?? "Google reporting credentials are not configured",
    });
    return { configured: false, results: [siteResult, ...googleResults] };
  }

  let accessToken: string;
  try {
    accessToken = await getGoogleAccessToken(configuration.credentials);
  } catch (error) {
    const googleResults = await recordGoogleUnavailable({
      trigger,
      ga4StartDate,
      gscStartDate,
      ga4EndDate,
      gscEndDate,
      status: "failed",
      error: errorMessage(error),
    });
    return { configured: true, results: [siteResult, ...googleResults] };
  }

  const [ga4Result, gscResult] = await Promise.all([
    syncGa4({ accessToken, trigger, startDate: ga4StartDate, endDate: ga4EndDate }),
    syncGsc({
      accessToken,
      trigger,
      startDate: gscStartDate,
      endDate: gscEndDate,
      snapshotDate: today,
      inspectionUrls,
    }),
  ]);

  return { configured: true, results: [siteResult, ga4Result, gscResult] };
}
