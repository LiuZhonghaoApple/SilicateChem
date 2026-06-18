import Link from "next/link";
import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { ProductLinkGrid } from "@/components/seo/InternalProductLinks";
import { SiteExploreSection } from "@/components/seo/SiteExploreSection";
import { FactoryTrustSystem } from "@/components/trust/FactoryTrustSystem";
import { products } from "@/content/products";
import { industryApplications } from "@/content/applications/industries";
import { intentGuides } from "@/content/guides/intent-pages";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { SEO_KEYWORDS, METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export const metadata = createMetadata({
  title: SEO_KEYWORDS.homepage.title,
  description: SEO_KEYWORDS.homepage.description,
  path: "/",
  primaryKeyword: SEO_KEYWORDS.homepage.primary,
  keywords: ["factory direct sodium metasilicate export"],
});

const cat = sodiumMetasilicateCategory;

export default function HomePage() {
  return (
    <>
      <section className="relative bg-[#0B2D5B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,#2E7D9A_25%,#2E7D9A_50%,transparent_50%,transparent_75%,#2E7D9A_75%)] bg-[length:40px_40px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D9A]">
            {SITE.company}
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight max-w-4xl">
            Sodium Metasilicate Manufacturer in China
          </h1>
          <p className="mt-4 text-lg md:text-xl font-medium text-blue-50 max-w-3xl">
            Factory Direct Supply | 100,000+ Tons | RFQ for Global B2B Buyers
          </p>
          <p className="mt-5 text-base text-blue-100 max-w-2xl leading-relaxed">
            Request factory-direct quotation for sodium metasilicate granules, anhydrous, and pentahydrate.
            No trader markup. Export documentation included.
          </p>
          <PageCTAs product={cat.inquiryProductName} className="mt-8" light size="lg" />
        </div>
      </section>

      <Section>
        <SectionHeader
          title="Primary Product — Request Quotation"
          subtitle="All SEO authority flows to our sodium metasilicate manufacturer page."
        />
        <ProductLinkGrid />
        <div className="mt-6 text-center">
          <Link
            href={METASILICATE_CATEGORY_PATH}
            className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-6 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
          >
            Sodium Metasilicate — Factory Direct RFQ →
          </Link>
        </div>
      </Section>

      <Section background="grey">
        <FactoryTrustSystem product={cat.inquiryProductName} />
      </Section>

      <Section>
        <SectionHeader
          title="Industry Use Cases"
          subtitle="Mid-funnel pages — each links to factory-direct quotation."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {industryApplications.map((app) => (
            <Link
              key={app.slug}
              href={`/applications/${app.slug}`}
              className="block rounded-lg border border-[#E2E6EA] bg-white p-5 hover:shadow-sm"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{app.title}</h3>
              <p className="mt-3 text-xs font-semibold text-[#2E7D9A]">View use case → RFQ</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Buyer Intent Guides"
          subtitle="Commercial procurement guides — each leads to product quotation."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {intentGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block rounded-lg border border-[#E2E6EA] bg-white p-5 hover:shadow-sm"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{guide.title}</h3>
              <p className="mt-3 text-xs font-semibold text-[#2E7D9A]">Read guide → Request quote</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="Product Grades" />
        <div className="grid gap-6 sm:grid-cols-2">
          <Card
            title={cat.name}
            description={cat.summary}
            href={METASILICATE_CATEGORY_PATH}
            badge="Money Page"
          />
          {products.map((p) => (
            <Card key={p.slug} title={p.name} description={p.summary} href={`/products/${p.slug}`} />
          ))}
        </div>
      </Section>

      <SiteExploreSection />

      <Section background="blue">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Submit RFQ — Sodium Metasilicate
          </h2>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            Grade, quantity, packaging, destination port. Factory response within 1–2 business days.
          </p>
          <PageCTAs product={cat.inquiryProductName} className="mt-8 justify-center" light size="lg" />
        </div>
      </Section>
    </>
  );
}
