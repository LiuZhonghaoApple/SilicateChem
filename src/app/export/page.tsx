import Link from "next/link";
import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { ExportProofMap } from "@/components/trust/ExportProofMap";
import { ExportShipmentEvidence } from "@/components/trust/ExportShipmentEvidence";
import { ExportPackagingProof } from "@/components/trust/ExportPackagingProof";
import { ExportLogisticsCapability } from "@/components/trust/ExportLogisticsCapability";
import { PageVisualBanner, PageVisualGrid } from "@/components/trust/PageVisualBanner";
import { TechnicalDocsBlock } from "@/components/trust/TechnicalDocsBlock";
import { TrustStack } from "@/components/trust/TrustStack";
import { getExportShippingImages, getExportPackagingImages } from "@/content/site-images";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Export Markets & Packaging — Sodium Metasilicate",
  description:
    "Export packaging, logistics, and shipping from Changyi, Shandong. 25 kg bags, Qingdao port departures, factory-direct sodium metasilicate export.",
  path: "/export",
});

export default function ExportPage() {
  const shipping = getExportShippingImages();
  const packaging = getExportPackagingImages();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Export", url: `${SITE.url}/export` },
        ]}
      />

      {/* 1. Export Hero */}
      <div className="border-b border-[#E2E6EA] bg-[#0B2D5B] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D9A]">
            {SITE.company}
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight max-w-4xl">
            Export Markets & Packaging
          </h1>
          <p className="mt-4 text-base md:text-lg text-blue-100 max-w-3xl leading-relaxed">
            Factory-direct sodium metasilicate export with documented 25 kg bag packing, Qingdao port
            routing, and international shipment support. Export reach based on partial customs records.
          </p>
        </div>
      </div>

      <Section className="pt-8 pb-0">
        <PageVisualBanner
          image={shipping[0]!}
          component="ExportPageHero"
          priority
          className="mb-6"
        />
        <PageVisualGrid
          images={[...shipping.slice(1), ...packaging.slice(0, 2)]}
          component="ExportPageAboveFold"
          columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
        />
      </Section>

      {/* 2. Export Map */}
      <Section id="export-markets">
        <ExportProofMap />
      </Section>

      {/* 3. Shipment Evidence */}
      <Section background="grey" id="shipment-evidence">
        <ExportShipmentEvidence />
      </Section>

      {/* 4. Packaging Proof */}
      <Section id="packaging">
        <ExportPackagingProof />
      </Section>

      {/* 5. Logistics Capability */}
      <Section background="grey" id="logistics">
        <ExportLogisticsCapability />
      </Section>

      <Section>
        <SectionHeader
          title="Technical Documents"
          subtitle="COA, TDS, and SDS for export shipments — provided on request."
        />
        <TechnicalDocsBlock showHeader={false} />
        <div className="mt-10">
          <TrustStack />
        </div>
      </Section>

      {/* 6. RFQ CTA */}
      <Section background="blue">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Request Export Quotation
          </h2>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            Include grade, quantity, packaging, and destination port. Factory response within 1–2 business days.
          </p>
          <PageCTAs className="mt-8 justify-center" light size="lg" />
          <p className="mt-6 text-sm text-blue-200">
            <Link href="/certifications" className="underline hover:text-white">
              View certifications & honors
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
