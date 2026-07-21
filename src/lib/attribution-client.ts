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

export function captureInquiryAttribution(): void {
  if (typeof window === "undefined" || readStored()) return;

  const initial: StoredAttribution = {
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
    visitorId: createVisitorId(),
    ...currentCampaign(),
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
  };
}
