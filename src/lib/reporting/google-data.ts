import {
  GA4_PROPERTY_ID,
  GSC_SITE_URL,
  GSC_SITEMAP_URL,
} from "@/lib/reporting/config";
import type {
  Ga4DailyRow,
  Ga4PageRow,
  Ga4SourceRow,
  GscDailyRow,
  GscPageRow,
  GscQueryRow,
  GscSitemapSnapshot,
} from "@/lib/reporting/types";

type Ga4ApiRow = {
  dimensionValues?: Array<{ value?: string }>;
  metricValues?: Array<{ value?: string }>;
};

type Ga4ApiResponse = {
  dimensionHeaders?: Array<{ name?: string }>;
  metricHeaders?: Array<{ name?: string }>;
  rows?: Ga4ApiRow[];
  error?: { message?: string };
};

type GscApiRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type GscApiResponse = {
  rows?: GscApiRow[];
  error?: { message?: string };
};

function numberValue(value?: string | number): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function ga4Date(value?: string): string {
  if (!value || value.length !== 8) return "";
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

async function runGa4Report(params: {
  accessToken: string;
  startDate: string;
  endDate: string;
  dimensions: string[];
  metrics: string[];
  limit?: number;
}): Promise<Array<Record<string, string>>> {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(GA4_PROPERTY_ID)}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: params.startDate, endDate: params.endDate }],
        dimensions: params.dimensions.map((name) => ({ name })),
        metrics: params.metrics.map((name) => ({ name })),
        limit: String(params.limit ?? 10_000),
        keepEmptyRows: true,
      }),
      cache: "no-store",
    }
  );
  const data = (await response.json()) as Ga4ApiResponse;
  if (!response.ok) {
    throw new Error(`GA4 Data API failed (${response.status}): ${data.error?.message ?? "unknown error"}`);
  }

  const dimensionNames = (data.dimensionHeaders ?? []).map((item) => item.name ?? "");
  const metricNames = (data.metricHeaders ?? []).map((item) => item.name ?? "");
  return (data.rows ?? []).map((row) => {
    const result: Record<string, string> = {};
    dimensionNames.forEach((name, index) => {
      result[name] = row.dimensionValues?.[index]?.value ?? "";
    });
    metricNames.forEach((name, index) => {
      result[name] = row.metricValues?.[index]?.value ?? "0";
    });
    return result;
  });
}

export async function fetchGa4Data(params: {
  accessToken: string;
  startDate: string;
  endDate: string;
}): Promise<{
  daily: Ga4DailyRow[];
  sources: Ga4SourceRow[];
  pages: Ga4PageRow[];
}> {
  const [dailyRows, sourceRows, pageRows] = await Promise.all([
    runGa4Report({
      ...params,
      dimensions: ["date"],
      metrics: [
        "sessions",
        "totalUsers",
        "newUsers",
        "engagedSessions",
        "screenPageViews",
        "engagementRate",
        "keyEvents",
      ],
    }),
    runGa4Report({
      ...params,
      dimensions: ["date", "sessionSource", "sessionMedium", "sessionDefaultChannelGroup"],
      metrics: ["sessions", "totalUsers", "keyEvents"],
    }),
    runGa4Report({
      ...params,
      dimensions: ["date", "pagePath"],
      metrics: ["sessions", "totalUsers", "screenPageViews", "keyEvents"],
    }),
  ]);

  return {
    daily: dailyRows.map((row) => ({
      date: ga4Date(row.date),
      sessions: numberValue(row.sessions),
      totalUsers: numberValue(row.totalUsers),
      newUsers: numberValue(row.newUsers),
      engagedSessions: numberValue(row.engagedSessions),
      screenPageViews: numberValue(row.screenPageViews),
      engagementRate: numberValue(row.engagementRate),
      keyEvents: numberValue(row.keyEvents),
    })),
    sources: sourceRows.map((row) => ({
      date: ga4Date(row.date),
      source: row.sessionSource || "(not set)",
      medium: row.sessionMedium || "(not set)",
      channelGroup: row.sessionDefaultChannelGroup || "Unassigned",
      sessions: numberValue(row.sessions),
      totalUsers: numberValue(row.totalUsers),
      keyEvents: numberValue(row.keyEvents),
    })),
    pages: pageRows.map((row) => ({
      date: ga4Date(row.date),
      pagePath: row.pagePath || "/",
      sessions: numberValue(row.sessions),
      totalUsers: numberValue(row.totalUsers),
      screenPageViews: numberValue(row.screenPageViews),
      keyEvents: numberValue(row.keyEvents),
    })),
  };
}

async function queryGsc(params: {
  accessToken: string;
  startDate: string;
  endDate: string;
  dimensions: string[];
}): Promise<GscApiRow[]> {
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: params.startDate,
        endDate: params.endDate,
        dimensions: params.dimensions,
        type: "web",
        dataState: "final",
        rowLimit: 25_000,
        startRow: 0,
      }),
      cache: "no-store",
    }
  );
  const data = (await response.json()) as GscApiResponse;
  if (!response.ok) {
    throw new Error(`GSC Search Analytics failed (${response.status}): ${data.error?.message ?? "unknown error"}`);
  }
  return data.rows ?? [];
}

function gscMetrics(row: GscApiRow): Omit<GscDailyRow, "date"> {
  return {
    clicks: numberValue(row.clicks),
    impressions: numberValue(row.impressions),
    ctr: numberValue(row.ctr),
    position: numberValue(row.position),
  };
}

export async function fetchGscData(params: {
  accessToken: string;
  startDate: string;
  endDate: string;
}): Promise<{
  daily: GscDailyRow[];
  queries: GscQueryRow[];
  pages: GscPageRow[];
  sitemap: GscSitemapSnapshot;
}> {
  const [dailyRows, queryRows, pageRows, sitemapResponse] = await Promise.all([
    queryGsc({ ...params, dimensions: ["date"] }),
    queryGsc({ ...params, dimensions: ["date", "query"] }),
    queryGsc({ ...params, dimensions: ["date", "page"] }),
    fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/sitemaps/${encodeURIComponent(GSC_SITEMAP_URL)}`,
      {
        headers: { Authorization: `Bearer ${params.accessToken}` },
        cache: "no-store",
      }
    ),
  ]);

  const sitemapData = (await sitemapResponse.json()) as {
    errors?: string;
    warnings?: string;
    contents?: Array<{ type?: string; submitted?: string; indexed?: string }>;
    error?: { message?: string };
  };
  if (!sitemapResponse.ok) {
    throw new Error(
      `GSC Sitemap API failed (${sitemapResponse.status}): ${sitemapData.error?.message ?? "unknown error"}`
    );
  }

  const webContents = (sitemapData.contents ?? []).filter((item) => item.type === "web");
  const sitemap = webContents.reduce<GscSitemapSnapshot>(
    (result, item) => ({
      ...result,
      submitted: result.submitted + numberValue(item.submitted),
      indexed: result.indexed + numberValue(item.indexed),
    }),
    {
      submitted: 0,
      indexed: 0,
      errors: numberValue(sitemapData.errors),
      warnings: numberValue(sitemapData.warnings),
    }
  );

  return {
    daily: dailyRows.map((row) => ({
      date: row.keys?.[0] ?? "",
      ...gscMetrics(row),
    })),
    queries: queryRows.map((row) => ({
      date: row.keys?.[0] ?? "",
      query: row.keys?.[1] ?? "(not set)",
      ...gscMetrics(row),
    })),
    pages: pageRows.map((row) => ({
      date: row.keys?.[0] ?? "",
      page: row.keys?.[1] ?? "",
      ...gscMetrics(row),
    })),
    sitemap,
  };
}

