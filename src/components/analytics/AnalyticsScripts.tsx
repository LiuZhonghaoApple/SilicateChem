import { GA4_MEASUREMENT_ID } from "@/lib/analytics";
import Script from "next/script";

/** Loads GA4 gtag.js after hydration (afterInteractive). Page views via PageViewTracker. */
export function AnalyticsScripts() {
  if (!GA4_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:false});`}
      </Script>
    </>
  );
}
