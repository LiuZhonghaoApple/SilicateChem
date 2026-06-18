import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { FactoryTrustSystem } from "@/components/trust/FactoryTrustSystem";
import { FactoryImageGallery } from "@/components/trust/FactoryImageGallery";
import {
  exportCapability,
  qualityControlSystem,
} from "@/content/factory-trust";
import { factory } from "@/content/company";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Industrial Sodium Metasilicate Manufacturer in China",
  description:
    "100,000+ ton sodium metasilicate production facility in Shandong, China. Granulation, drying, QC testing, export packaging, and global shipping.",
  path: "/factory",
  noIndex: true,
});

export default function FactoryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Factory", url: `${SITE.url}/factory` },
        ]}
      />

      <div className="border-b border-[#E2E6EA] bg-[#0B2D5B] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D9A]">
            {SITE.company}
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight max-w-4xl">
            Industrial Sodium Metasilicate Manufacturer in China
          </h1>
          <p className="mt-4 text-base md:text-lg text-blue-100 max-w-3xl leading-relaxed">
            {factory.overview}
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-2xl font-bold text-white">{factory.capacity}</p>
              <p className="text-blue-200">Annual Production Capacity</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{SITE.location}</p>
              <p className="text-blue-200">Manufacturing Location</p>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeader
          title="Factory Overview"
          subtitle="Dedicated lines for granules, anhydrous, pentahydrate, and sodium silicate with in-process quality checks."
        />
        <p className="text-[#5A6570] leading-relaxed max-w-3xl">{factory.overview}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {factory.processes.slice(0, 3).map((step) => (
            <div
              key={step.step}
              className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-5"
            >
              <span className="text-xs font-bold text-[#2E7D9A]">STEP {step.step}</span>
              <h3 className="mt-2 font-bold text-[#0B2D5B] text-sm">{step.title}</h3>
              <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <FactoryTrustSystem showHeader />
      </Section>

      <Section>
        <SectionHeader
          title="Factory Proof Layer"
          subtitle="Verified production, QC, warehouse, packaging, and export capability — real factory assets with scalable image fallback."
        />
        <FactoryImageGallery showHeader={false} />
      </Section>

      <Section background="grey">
        <SectionHeader
          title={qualityControlSystem.title}
          subtitle={qualityControlSystem.subtitle}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {qualityControlSystem.items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-[#E2E6EA] bg-white p-5"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{item.title}</h3>
              <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <ul className="mt-8 space-y-2 max-w-3xl">
          {factory.quality.map((q) => (
            <li key={q} className="flex items-start gap-2 text-sm text-[#5A6570]">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
              {q}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader
          title={exportCapability.title}
          subtitle={exportCapability.subtitle}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {exportCapability.items.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-5"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{item.title}</h3>
              <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
        <PageCTAs className="mt-10" />
      </Section>
    </>
  );
}
