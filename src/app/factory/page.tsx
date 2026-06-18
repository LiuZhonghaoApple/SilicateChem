import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { factory } from "@/content/company";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Factory & Production Capacity",
  description:
    "100,000+ ton sodium metasilicate production facility in Shandong, China. Granulation, drying, QC testing, and export packaging on-site.",
  path: "/factory",
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
      <PageHeader
        title="Factory & Production"
        description={factory.overview}
        breadcrumbs={[{ label: "Factory" }]}
      />

      <Section>
        <div className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] aspect-[21/9] flex items-center justify-center mb-10">
          <div className="text-center p-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#0B2D5B]/10 flex items-center justify-center">
              <svg className="h-8 w-8 text-[#0B2D5B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-medium text-[#0B2D5B]">Factory Aerial Photo Placeholder</p>
            <p className="text-xs text-[#5A6570]">Replace: /public/images/factory/aerial.jpg</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <p className="text-4xl font-bold text-[#0B2D5B]">{factory.capacity}</p>
          <p className="mt-1 text-[#5A6570]">Annual Production Capacity</p>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader title="Production Process" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {factory.processes.map((step) => (
            <div key={step.step} className="rounded-lg border border-[#E2E6EA] bg-white p-6">
              <span className="text-xs font-bold text-[#2E7D9A]">STEP {step.step}</span>
              <h3 className="mt-2 font-bold text-[#0B2D5B]">{step.title}</h3>
              <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title="Quality Control" />
            <ul className="space-y-2">
              {factory.quality.map((q) => (
                <li key={q} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader title="Production Equipment" />
            <ul className="space-y-2">
              {factory.equipment.map((e) => (
                <li key={e} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <PageCTAs className="mt-10" />
      </Section>
    </>
  );
}
