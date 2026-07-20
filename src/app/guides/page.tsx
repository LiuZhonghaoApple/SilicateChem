import Link from "next/link";
import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { intentGuides } from "@/content/guides/intent-pages";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Procurement Guides",
  description:
    "Commercial buyer guides for sodium metasilicate supplier selection, pricing, applications, comparison, documents, and RFQ preparation.",
  path: "/guides",
  keywords: ["sodium metasilicate procurement"],
});

const guideCards = [
  {
    title: "Export Compliance Documents Download",
    intro:
      "Download MSDS, certificates, company credentials, and product documents for supplier review.",
    href: "/downloads",
    cta: "Download documents →",
    icon: "M7 4.75h6l4 4v10.5H7V4.75Zm6 0v4h4M10 13h4m-4 3h7m-7 3h5",
  },
  ...intentGuides.map((guide) => ({
    title: guide.title,
    intro: guide.intro,
    href: `/guides/${guide.slug}`,
    cta: "Read guide →",
    icon: "M6 5.5h12M6 9.5h12M6 13.5h8M6 17.5h6M4.5 4.5h15v15h-15z",
  })),
];

export default function GuidesIndexPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Guides", url: `${SITE.url}/guides` },
        ]}
      />
      <PageHeader
        title="Procurement Guides"
        description="Commercial procurement guides for sodium metasilicate buyers. Use them to review specifications, documents, applications, packing, and quotation requirements."
        breadcrumbs={[{ label: "Guides" }]}
      />
      <Section>
        <SectionHeader
          title="Buyer Intent Guides"
          subtitle="Start from the question closest to your sourcing stage, then continue to product specifications, documents, or RFQ."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guideCards.map((guide) => (
            <article
              key={guide.title}
              className="group flex h-full flex-col rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2A86A5] hover:bg-[#F7FBFD] hover:shadow-[0_16px_34px_rgba(42,134,165,0.14)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FA] text-[#0B2D5B] transition-transform duration-300 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                >
                  <path d={guide.icon} />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#0B2D5B]">
                <Link href={guide.href} className="hover:text-[#2E7D9A]">
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5A6570]">{guide.intro}</p>
              <Link
                href={guide.href}
                className="mt-6 border-t border-[#E2E6EA] pt-4 text-sm font-bold text-[#2E7D9A] hover:underline"
              >
                {guide.cta}
              </Link>
            </article>
          ))}
        </div>
        <ProductFunnelBanner className="mt-10" />
        <PageCTAs className="mt-8" />
      </Section>
    </>
  );
}
