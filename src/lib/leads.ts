import type { InquiryInput } from "@/lib/validation";

export type InquiryClassification = "quote" | "sample" | "msds_tds" | "contact";

export type FunnelLayer = "money" | "guide" | "application" | "blog" | "homepage" | "other";

export interface StructuredLead {
  id: string;
  submittedAt: string;
  contact: {
    name: string;
    email: string;
    company: string;
    country: string;
  };
  interest: {
    product: string | null;
    quantity: string | null;
  };
  classification: {
    inquiryType: InquiryClassification;
    sourcePage: string | null;
    sourcePath: string | null;
    funnelLayer: FunnelLayer;
  };
  attribution: {
    landingPage: string | null;
    referrer: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    utmTerm: string | null;
    utmContent: string | null;
    visitorId: string | null;
    geoSource: string | null;
    geoReferrerHost: string | null;
    geoLandingPath: string | null;
  };
  message: string;
  meta: {
    userAgent: string | null;
    ipHash: string | null;
    referer: string | null;
    siteUrl: string;
  };
}

function classifyInquiryType(requestType?: string): InquiryClassification {
  switch (requestType) {
    case "sample":
      return "sample";
    case "tds":
      return "msds_tds";
    case "contact":
      return "contact";
    default:
      return "quote";
  }
}

function inferFunnelLayer(source?: string | null): FunnelLayer {
  if (!source) return "other";
  if (source === "homepage" || source === "money-page") return source === "money-page" ? "money" : "homepage";
  if (source.startsWith("guide-")) return "guide";
  if (source.startsWith("application-")) return "application";
  if (source.startsWith("blog-")) return "blog";
  if (source === "product-page") return "money";
  return "other";
}

export function buildStructuredLead(
  data: InquiryInput,
  meta: {
    userAgent?: string | null;
    ipHash?: string | null;
    referer?: string | null;
    siteUrl: string;
  }
): StructuredLead {
  return {
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    submittedAt: new Date().toISOString(),
    contact: {
      name: data.name,
      email: data.email,
      company: data.company,
      country: data.country,
    },
    interest: {
      product: data.product ?? null,
      quantity: data.quantity ?? null,
    },
    classification: {
      inquiryType: classifyInquiryType(data.requestType),
      sourcePage: data.source ?? null,
      sourcePath: data.sourcePath ?? null,
      funnelLayer: inferFunnelLayer(data.source),
    },
    attribution: {
      landingPage: data.landingPage ?? null,
      referrer: data.referrer ?? meta.referer ?? null,
      utmSource: data.utmSource ?? null,
      utmMedium: data.utmMedium ?? null,
      utmCampaign: data.utmCampaign ?? null,
      utmTerm: data.utmTerm ?? null,
      utmContent: data.utmContent ?? null,
      visitorId: data.visitorId ?? null,
      geoSource: data.geoSource ?? null,
      geoReferrerHost: data.geoReferrerHost ?? null,
      geoLandingPath: data.geoLandingPath ?? null,
    },
    message: data.message,
    meta: {
      userAgent: meta.userAgent ?? null,
      ipHash: meta.ipHash ?? null,
      referer: meta.referer ?? null,
      siteUrl: meta.siteUrl,
    },
  };
}
