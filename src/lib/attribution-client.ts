export type InquiryAttributionPayload = {
  sourcePath: string;
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  visitorId?: string;
  geoSource?: string;
  geoReferrerHost?: string;
  geoLandingPath?: string;
};

type StoredAttribution = Omit<InquiryAttributionPayload, "sourcePath">;

const STORAGE_KEY = "silicatechem_inquiry_attribution";

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readStored(): StoredAttribution | null {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as StoredAttribution) : null;
  } catch {
    return null;
  }
}

function currentCampaign(): Partial<StoredAttribution> {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmTerm: params.get("utm_term") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
  };
}

const GEO_SOURCE_PATTERNS: Array<{ source: string; patterns: string[] }> = [
  { source: "chatgpt", patterns: ["chatgpt.com", "chat.openai.com", "openai"] },
  { source: "perplexity", patterns: ["perplexity.ai", "perplexity"] },
  { source: "bing_copilot", patterns: ["copilot.microsoft.com", "copilot.com", "bing_copilot"] },
  { source: "claude", patterns: ["claude.ai", "anthropic"] },
  { source: "gemini", patterns: ["gemini.google.com", "google_gemini"] },
  { source: "grok", patterns: ["grok.com", "x.ai"] },
  { source: "you", patterns: ["you.com"] },
];

function getReferrerHost(referrer?: string): string | undefined {
  if (!referrer) return undefined;
  try {
    return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function detectGeoAttribution(
  referrer?: string,
  utmSource?: string
): Pick<StoredAttribution, "geoSource" | "geoReferrerHost" | "geoLandingPath"> {
  const referrerHost = getReferrerHost(referrer);
  const signals = [utmSource, referrerHost].filter(Boolean).join(" ").toLowerCase();
  const match = GEO_SOURCE_PATTERNS.find(({ patterns }) =>
    patterns.some((pattern) => signals.includes(pattern))
  );

  if (!match) return {};

  return {
    geoSource: match.source,
    geoReferrerHost: referrerHost,
    geoLandingPath: window.location.pathname,
  };
}

export function captureInquiryAttribution(): void {
  if (typeof window === "undefined" || readStored()) return;

  const campaign = currentCampaign();
  const referrer = document.referrer || undefined;

  const initial: StoredAttribution = {
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer,
    visitorId: createVisitorId(),
    ...campaign,
    ...detectGeoAttribution(referrer, campaign.utmSource),
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // Attribution is optional; form submission must continue if storage is blocked.
  }
}

export function getInquiryAttributionPayload(
  sourcePath: string
): InquiryAttributionPayload {
  captureInquiryAttribution();
  const stored = readStored() ?? {};
  const campaign = currentCampaign();
  const currentGeo = detectGeoAttribution(document.referrer || undefined, campaign.utmSource);

  return {
    sourcePath,
    landingPage: stored.landingPage,
    referrer: stored.referrer,
    visitorId: stored.visitorId,
    utmSource: campaign.utmSource ?? stored.utmSource,
    utmMedium: campaign.utmMedium ?? stored.utmMedium,
    utmCampaign: campaign.utmCampaign ?? stored.utmCampaign,
    utmTerm: campaign.utmTerm ?? stored.utmTerm,
    utmContent: campaign.utmContent ?? stored.utmContent,
    geoSource: currentGeo.geoSource ?? stored.geoSource,
    geoReferrerHost: currentGeo.geoReferrerHost ?? stored.geoReferrerHost,
    geoLandingPath: currentGeo.geoLandingPath ?? stored.geoLandingPath,
  };
}
