import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FastContactBar } from "@/components/layout/FastContactBar";
import { StickyQuoteBar, FloatingContactWidget } from "@/components/layout/PersistentCTA";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { ClarityScript } from "@/components/analytics/ClarityScript";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { OrganizationSchema } from "@/components/seo/JsonLd";
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
      <body className="min-h-screen flex flex-col bg-white pb-20">
        <AnalyticsScripts />
        <ClarityScript />
        <OrganizationSchema />
        <Header />
        <FastContactBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyQuoteBar />
        <FloatingContactWidget />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
      </body>
    </html>
  );
}
