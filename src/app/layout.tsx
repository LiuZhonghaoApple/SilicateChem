import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FastContactBar } from "@/components/layout/FastContactBar";
import { StickyQuoteBar, FloatingContactWidget } from "@/components/layout/PersistentCTA";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { ClarityScript } from "@/components/analytics/ClarityScript";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { AttributionTracker } from "@/components/analytics/AttributionTracker";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/JsonLd";
import { ProcurementAdvisor } from "@/components/ai/ProcurementAdvisor";
import { RouteShell } from "@/components/layout/RouteShell";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.tagline} | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <RouteShell
          publicBefore={
            <>
              <AnalyticsScripts />
              <ClarityScript />
              <OrganizationSchema />
              <WebSiteSchema />
              <Header />
              <FastContactBar />
            </>
          }
          publicAfter={
            <>
              <Footer />
              <StickyQuoteBar />
              <FloatingContactWidget />
              <ProcurementAdvisor />
              <Suspense fallback={null}>
                <AttributionTracker />
                <PageViewTracker />
              </Suspense>
            </>
          }
        >
          {children}
        </RouteShell>
      </body>
    </html>
  );
}
