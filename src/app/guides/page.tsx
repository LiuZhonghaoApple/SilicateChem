import Link from "next/link";
import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { intentGuides } from "@/content/guides/intent-pages";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Procurement Guides",
  description:
    "Commercial buyer guides for sodium metasilicate supplier selection, pricing, and factory verification. All lead to factory-direct quotation.",
  path: "/guides",
  keywords: ["sodium metasilicate procurement"],
});

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
        description="Commercial-intent guides for B2B buyers. Each page leads to factory-direct sodium metasilicate quotation."
        breadcrumbs={[{ label: "Guides" }]}
      />
      <Section>
        <div className="space-y-6">
          {intentGuides.map((guide) => (
            <article
              key={guide.slug}
              className="rounded-lg border border-[#E2E6EA] p-6 hover:shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#0B2D5B]">
                <Link href={`/guides/${guide.slug}`} className="hover:text-[#2E7D9A]">
                  {guide.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-[#5A6570]">{guide.intro}</p>
              <Link
                href={`/guides/${guide.slug}`}
                className="mt-3 inline-block text-sm font-semibold text-[#2E7D9A] hover:underline"
              >
                Read guide →
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
