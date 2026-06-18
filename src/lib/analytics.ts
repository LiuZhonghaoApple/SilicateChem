/**
 * GA4 + GTM-ready analytics helpers.
 * Set NEXT_PUBLIC_GA4_ID and/or NEXT_PUBLIC_GTM_ID in production.
 */

export type AnalyticsEvent =
  | "rfq_submit"
  | "sample_request"
  | "tds_download"
  | "page_view_by_source"
  | "whatsapp_click"
  | "email_click"
  | "cta_click";

export type CtaType = "quote" | "sample" | "tds" | "contact";

export type InquiryType = "quote" | "sample" | "tds" | "contact";

export type DataLayerPayload = {
  event: AnalyticsEvent | string;
  page_path?: string;
  page_source?: string;
  product_interest?: string;
  inquiry_type?: InquiryType | string;
  funnel_layer?: "money" | "guide" | "application" | "blog" | "other";
  /** GTM custom event name mirror */
  event_category?: string;
  event_label?: string;
};

declare global {
  interface Window {
    dataLayer?: DataLayerPayload[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const IS_DEV = process.env.NODE_ENV === "development";

function logDev(event: string, payload: Record<string, unknown>): void {
  if (IS_DEV) {
    console.log(`[analytics] ${event}`, payload);
  }
}

export function pushDataLayer(payload: DataLayerPayload): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export function trackGa4Event(
  eventName: string,
  params?: Record<string, string | number | undefined>
): void {
  if (typeof window === "undefined" || !window.gtag || !GA4_ID) return;
  window.gtag("event", eventName, params);
}

function emit(event: AnalyticsEvent, payload: Omit<DataLayerPayload, "event">): void {
  const full: DataLayerPayload = { event, ...payload };
  pushDataLayer(full);
  trackGa4Event(event, {
    page_path: payload.page_path,
    page_source: payload.page_source,
    product_interest: payload.product_interest,
    inquiry_type: payload.inquiry_type,
    funnel_layer: payload.funnel_layer,
    event_category: payload.event_category,
    event_label: payload.event_label,
  });
  logDev(event, full as unknown as Record<string, unknown>);
}

export type ContactTrackingParams = {
  pagePath: string;
  pageSource?: string;
  productInterest?: string;
  location?: string;
};

export function inferFunnelLayer(path: string): DataLayerPayload["funnel_layer"] {
  if (path === "/products/sodium-metasilicate" || path.startsWith("/products/")) {
    return path === "/products/sodium-metasilicate" ? "money" : "money";
  }
  if (path.startsWith("/guides")) return "guide";
  if (path.startsWith("/applications")) return "application";
  if (path.startsWith("/blog")) return "blog";
  return "other";
}

export function trackPageViewBySource(pagePath: string, pageSource?: string): void {
  emit("page_view_by_source", {
    page_path: pagePath,
    page_source: pageSource ?? pagePath,
    funnel_layer: inferFunnelLayer(pagePath),
    event_category: "engagement",
    event_label: pageSource ?? pagePath,
  });
}

export function trackRfqSubmit(params: {
  pagePath: string;
  pageSource?: string;
  productInterest?: string;
  inquiryType?: InquiryType | string;
}): void {
  emit("rfq_submit", {
    page_path: params.pagePath,
    page_source: params.pageSource,
    product_interest: params.productInterest,
    inquiry_type: params.inquiryType ?? "quote",
    funnel_layer: inferFunnelLayer(params.pagePath),
    event_category: "conversion",
    event_label: params.productInterest ?? "sodium metasilicate",
  });
}

export function trackSampleRequest(params: {
  pagePath: string;
  pageSource?: string;
  productInterest?: string;
}): void {
  emit("sample_request", {
    page_path: params.pagePath,
    page_source: params.pageSource,
    product_interest: params.productInterest,
    inquiry_type: "sample",
    funnel_layer: inferFunnelLayer(params.pagePath),
    event_category: "conversion",
    event_label: "sample",
  });
}

export function trackTdsDownload(params: {
  pagePath: string;
  pageSource?: string;
  productInterest?: string;
}): void {
  emit("tds_download", {
    page_path: params.pagePath,
    page_source: params.pageSource,
    product_interest: params.productInterest,
    inquiry_type: "tds",
    funnel_layer: inferFunnelLayer(params.pagePath),
    event_category: "conversion",
    event_label: "tds_msds_coa",
  });
}

export function trackWhatsAppClick(params: ContactTrackingParams): void {
  emit("whatsapp_click", {
    page_path: params.pagePath,
    page_source: params.pageSource ?? params.pagePath,
    product_interest: params.productInterest,
    funnel_layer: inferFunnelLayer(params.pagePath),
    event_category: "engagement",
    event_label: params.location ?? "whatsapp",
  });
}

export function trackEmailClick(params: ContactTrackingParams): void {
  emit("email_click", {
    page_path: params.pagePath,
    page_source: params.pageSource ?? params.pagePath,
    product_interest: params.productInterest,
    funnel_layer: inferFunnelLayer(params.pagePath),
    event_category: "engagement",
    event_label: params.location ?? "mailto",
  });
}

/** Track CTA button clicks (quote, sample, TDS, contact) and mirror conversion events */
export function trackCtaClick(params: ContactTrackingParams & { ctaType: CtaType }): void {
  const { ctaType, pagePath, pageSource, productInterest, location } = params;
  const tracking = { pagePath, pageSource, productInterest };

  emit("cta_click", {
    page_path: pagePath,
    page_source: pageSource ?? pagePath,
    product_interest: productInterest,
    inquiry_type: ctaType,
    funnel_layer: inferFunnelLayer(pagePath),
    event_category: "conversion",
    event_label: location ? `${ctaType}:${location}` : ctaType,
  });

  if (ctaType === "sample") {
    trackSampleRequest(tracking);
    return;
  }
  if (ctaType === "tds") {
    trackTdsDownload(tracking);
    return;
  }
  trackRfqSubmit({
    ...tracking,
    inquiryType: ctaType === "contact" ? "contact" : "quote",
  });
}

export function inquiryTypeFromRequestType(requestType?: string): string {
  if (!requestType) return "quote";

  const normalized = requestType.toLowerCase();

  if (normalized.includes("sample")) return "sample";
  if (normalized.includes("tds")) return "tds";
  if (normalized.includes("msds")) return "msds";
  if (normalized.includes("coa")) return "coa";
  if (normalized.includes("document")) return "document";

  return "quote";
}

/** Map inquiry form requestType to analytics event */
export function trackInquiryByType(params: {
  requestType: string;
  pagePath: string;
  pageSource?: string;
  productInterest?: string;
}): void {
  const { requestType, pagePath, pageSource, productInterest } = params;
  if (requestType === "sample") {
    trackSampleRequest({ pagePath, pageSource, productInterest });
    return;
  }
  if (requestType === "tds") {
    trackTdsDownload({ pagePath, pageSource, productInterest });
    return;
  }
  trackRfqSubmit({
    pagePath,
    pageSource,
    productInterest,
    inquiryType: requestType === "contact" ? "contact" : "quote",
  });
}
