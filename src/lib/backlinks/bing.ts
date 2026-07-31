import { SITE } from "@/lib/constants";

// Bing Webmaster Tools is the only one of the two search consoles that exposes
// backlink data over an API. Google Search Console does NOT: its entire public
// surface is sites / sitemaps / searchAnalytics / urlInspection — there is no
// links endpoint at all, which is why the GSC baseline stays a manual entry.
//
// Key: Bing Webmaster Tools -> Settings -> API Access -> API Key (free, self-serve).
// Stored only as the Vercel env var BING_WEBMASTER_API_KEY.
const BING_API_BASE = "https://ssl.bing.com/webmaster/api.svc/json";

// The site must be spelled exactly as the verified property in Bing.
export const BING_SITE_URL = process.env.BING_SITE_URL?.trim() || `${SITE.url}/`;

// Hard request budget. Enumerating every inbound link is cheap when the graph is
// small (the expected case today) but must never be able to hang the daily cron.
const MAX_REQUESTS = 60;
const REQUEST_TIMEOUT_MS = 15_000;

export type BingBaseline = {
  /** Distinct hosts that link to us. null when enumeration was cut short. */
  referringDomains: number | null;
  /** Distinct source pages that link to us. null when enumeration was cut short. */
  linkingPages: number | null;
  /** Source URLs actually retrieved — always a real observed count. */
  sampleLinks: number;
  /** Distinct non-empty anchor texts observed. */
  anchorCount: number;
  /** False when the request budget ran out before every link was walked. */
  complete: boolean;
  /** Our own pages Bing reports as having at least one inbound link. */
  pagesWithInboundLinks: number;
  requestCount: number;
};

export type BingBaselineResult =
  | { kind: "not_configured"; message: string }
  | { kind: "error"; message: string }
  | { kind: "ok"; data: BingBaseline };

type LinkCountsResponse = {
  d?: {
    Links?: Array<{ Url?: string; Count?: number }>;
    TotalPages?: number;
  };
};

type LinkDetailsResponse = {
  d?: {
    Details?: Array<{ Url?: string; AnchorText?: string }>;
    TotalPages?: number;
  };
};

export function isBingConfigured(): boolean {
  return Boolean(process.env.BING_WEBMASTER_API_KEY?.trim());
}

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

class BingApiError extends Error {}

async function callBing<T>(method: string, params: Record<string, string>): Promise<T> {
  const apiKey = process.env.BING_WEBMASTER_API_KEY?.trim();
  if (!apiKey) throw new BingApiError("BING_WEBMASTER_API_KEY is not configured");

  const query = new URLSearchParams({ ...params, apikey: apiKey });
  const response = await fetch(`${BING_API_BASE}/${method}?${query.toString()}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const body = await response.text();
  if (!response.ok) {
    // Never leak the key if Bing echoes the request back in an error payload.
    const safe = body.replace(new RegExp(apiKey, "g"), "***").slice(0, 300);
    throw new BingApiError(`${method} returned HTTP ${response.status}: ${safe}`);
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new BingApiError(`${method} returned a non-JSON body (first 120 chars: ${body.slice(0, 120)})`);
  }
}

/**
 * Walks the full inbound-link graph for the verified Bing property.
 *
 * Deliberately conservative: an empty result is only ever reported as a real
 * zero when Bing answered successfully. Anything else surfaces as `error` so the
 * dashboard can say "unknown" instead of quietly recording 0.
 */
export async function fetchBingBaseline(): Promise<BingBaselineResult> {
  if (!isBingConfigured()) {
    return {
      kind: "not_configured",
      message:
        "BING_WEBMASTER_API_KEY 未配置。请在 Bing Webmaster Tools → Settings → API Access 生成 Key，并作为 Vercel 环境变量加入。",
    };
  }

  let requestCount = 0;
  const sourceUrls = new Set<string>();
  const domains = new Set<string>();
  const anchors = new Set<string>();
  let complete = true;

  try {
    // Step 1: which of OUR pages have inbound links, and how many each.
    const ourPages: string[] = [];
    let page = 0;
    let totalPages = 1;
    do {
      requestCount += 1;
      const data = await callBing<LinkCountsResponse>("GetLinkCounts", {
        siteUrl: BING_SITE_URL,
        page: String(page),
      });
      for (const link of data.d?.Links ?? []) {
        if (link.Url) ourPages.push(link.Url);
      }
      totalPages = Number(data.d?.TotalPages ?? 1) || 1;
      page += 1;
    } while (page < totalPages && requestCount < MAX_REQUESTS);

    if (page < totalPages) complete = false;

    // Step 2: for each of our pages, walk the actual referring pages.
    for (const target of ourPages) {
      if (requestCount >= MAX_REQUESTS) {
        complete = false;
        break;
      }
      let detailPage = 0;
      let detailTotal = 1;
      do {
        requestCount += 1;
        const data = await callBing<LinkDetailsResponse>("GetUrlLinks", {
          siteUrl: BING_SITE_URL,
          link: target,
          page: String(detailPage),
        });
        for (const detail of data.d?.Details ?? []) {
          if (!detail.Url) continue;
          sourceUrls.add(detail.Url);
          const host = hostOf(detail.Url);
          if (host) domains.add(host);
          const anchor = detail.AnchorText?.trim();
          if (anchor) anchors.add(anchor);
        }
        detailTotal = Number(data.d?.TotalPages ?? 1) || 1;
        detailPage += 1;
      } while (detailPage < detailTotal && requestCount < MAX_REQUESTS);
      if (detailPage < detailTotal) complete = false;
    }

    return {
      kind: "ok",
      data: {
        // A partial walk cannot honestly report a total, so those stay unknown.
        referringDomains: complete ? domains.size : null,
        linkingPages: complete ? sourceUrls.size : null,
        sampleLinks: sourceUrls.size,
        anchorCount: anchors.size,
        complete,
        pagesWithInboundLinks: ourPages.length,
        requestCount,
      },
    };
  } catch (error) {
    return {
      kind: "error",
      message: error instanceof Error ? error.message : "Unknown Bing Webmaster API error",
    };
  }
}
