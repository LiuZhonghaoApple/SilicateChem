import { SITE } from "@/lib/constants";

export const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "542189602";
export const GSC_SITE_URL = process.env.GSC_SITE_URL || `${SITE.url}/`;
export const GSC_SITEMAP_URL = `${SITE.url}/sitemap.xml`;

export type GoogleServiceAccount = {
  clientEmail: string;
  privateKey: string;
};

export type GoogleReportingConfiguration = {
  ga4PropertyId: string;
  gscSiteUrl: string;
  credentials: GoogleServiceAccount | null;
  configured: boolean;
  reason?: string;
};

function normalizePrivateKey(value: string): string {
  return value.replace(/\\n/g, "\n").trim();
}

export function getGoogleReportingConfiguration(): GoogleReportingConfiguration {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      const parsed = JSON.parse(json) as {
        client_email?: string;
        private_key?: string;
      };
      if (parsed.client_email && parsed.private_key) {
        return {
          ga4PropertyId: GA4_PROPERTY_ID,
          gscSiteUrl: GSC_SITE_URL,
          configured: true,
          credentials: {
            clientEmail: parsed.client_email,
            privateKey: normalizePrivateKey(parsed.private_key),
          },
        };
      }
      return {
        ga4PropertyId: GA4_PROPERTY_ID,
        gscSiteUrl: GSC_SITE_URL,
        configured: false,
        credentials: null,
        reason: "GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email or private_key",
      };
    } catch {
      return {
        ga4PropertyId: GA4_PROPERTY_ID,
        gscSiteUrl: GSC_SITE_URL,
        configured: false,
        credentials: null,
        reason: "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON",
      };
    }
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    return {
      ga4PropertyId: GA4_PROPERTY_ID,
      gscSiteUrl: GSC_SITE_URL,
      configured: true,
      credentials: {
        clientEmail,
        privateKey: normalizePrivateKey(privateKey),
      },
    };
  }

  return {
    ga4PropertyId: GA4_PROPERTY_ID,
    gscSiteUrl: GSC_SITE_URL,
    configured: false,
    credentials: null,
    reason: "Google service account credentials are not configured",
  };
}

