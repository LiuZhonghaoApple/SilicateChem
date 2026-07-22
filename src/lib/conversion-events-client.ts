import { getInquiryAttributionPayload } from "@/lib/attribution-client";

export type PersistedConversionEvent =
  | "whatsapp_click"
  | "ai_advisor_open"
  | "ai_advisor_question"
  | "ai_advisor_answer"
  | "ai_advisor_handoff"
  | "rfq_start"
  | "rfq_submit";

const PERSISTED_EVENTS = new Set<PersistedConversionEvent>([
  "whatsapp_click",
  "ai_advisor_open",
  "ai_advisor_question",
  "ai_advisor_answer",
  "ai_advisor_handoff",
  "rfq_start",
  "rfq_submit",
]);

type ConversionPayload = {
  page_path?: string;
  page_source?: string;
  product_interest?: string;
  inquiry_type?: string;
  event_label?: string;
};

function createEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function referrerHost(referrer?: string): string | undefined {
  if (!referrer) return undefined;
  try {
    return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function landingPath(landingPage?: string): string | undefined {
  if (!landingPage) return undefined;
  try {
    return new URL(landingPage, window.location.origin).pathname;
  } catch {
    return undefined;
  }
}

export function persistConversionEvent(
  eventName: string,
  payload: ConversionPayload
): void {
  if (
    typeof window === "undefined" ||
    !PERSISTED_EVENTS.has(eventName as PersistedConversionEvent)
  ) {
    return;
  }

  const pagePath = payload.page_path ?? window.location.pathname;
  const attribution = getInquiryAttributionPayload(pagePath);

  void fetch("/api/conversion-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventId: createEventId(),
      eventName,
      pagePath,
      pageSource: payload.page_source,
      productInterest: payload.product_interest,
      inquiryType: payload.inquiry_type,
      eventLabel: payload.event_label,
      visitorId: attribution.visitorId,
      landingPage: landingPath(attribution.landingPage),
      referrerHost: referrerHost(attribution.referrer),
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      geoSource: attribution.geoSource,
    }),
  }).catch(() => {
    // Analytics must never interrupt WhatsApp, AI or RFQ user actions.
  });
}
