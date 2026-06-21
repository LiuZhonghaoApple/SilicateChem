import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { DeploymentImageGrid } from "@/components/trust/HomepageRealImages";
import { siteImages } from "@/content/site-images";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Export Markets & Packaging — Sodium Metasilicate",
  description:
    "Export packaging, logistics, and shipping from Changyi, Shandong. 25 kg bags, Qingdao port departures, factory-direct sodium metasilicate export.",
  path: "/export",
});

export default function ExportPage() {
  const { packaging, shipping } = siteImages.export;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Export", url: `${SITE.url}/export` },
        ]}
      />

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
            routing, and international shipment support.
          </p>
        </div>
      </div>

      <Section id="packaging">
        <SectionHeader
          title="Packaging & Logistics"
          subtitle="Documented export packing patterns from Changyi manufacturing site."
        />
        <DeploymentImageGrid images={packaging} />
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Port & Shipping"
          subtitle="Export loading and container staging for international B2B buyers."
        />
        <DeploymentImageGrid images={shipping} />
        <PageCTAs className="mt-10" />
      </Section>
    </>
  );
}
