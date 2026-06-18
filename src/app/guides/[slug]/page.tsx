import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FAQSchema, BreadcrumbSchema, ArticleSchema } from "@/components/seo/JsonLd";
import { FAQBlock, ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { FunnelLinksSidebar } from "@/components/seo/FunnelLinks";
import { StrongCTA } from "@/components/conversion/ProductConversionSections";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { FactoryTrustSystem } from "@/components/trust/FactoryTrustSystem";
import { intentGuides, getIntentGuideBySlug } from "@/content/guides/intent-pages";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return intentGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getIntentGuideBySlug(slug);
  if (!guide) return {};
  return createMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    primaryKeyword: guide.primaryKeyword,
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getIntentGuideBySlug(slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;

  const product = sodiumMetasilicateCategory.inquiryProductName;

  return (
    <>
      <ArticleSchema
        title={guide.title}
        description={guide.intro}
        url={`${SITE.url}${path}`}
        datePublished="2026-01-01"
      />
      <FAQSchema items={guide.faq} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Guides", url: `${SITE.url}/guides` },
          { name: guide.title, url: `${SITE.url}${path}` },
        ]}
      />
      <PageHeader
        title={guide.title}
        description={guide.intro}
        breadcrumbs={[
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {guide.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-bold text-[#0B2D5B]">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-[#5A6570] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
            <div>
              <h2 className="text-xl font-bold text-[#0B2D5B] mb-4">FAQ</h2>
              <FAQBlock items={guide.faq} />
            </div>
            <FactoryTrustSystem variant="light" product={product} showHeader={false} />
            <ProductFunnelBanner />
            <StrongCTA product={product} />
          </div>
          <FunnelLinksSidebar />
        </div>
      </Section>
      <Section background="grey">
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-[#0B2D5B] mb-4">Request Factory-Direct Quotation</h2>
          <InquiryFormWrapper defaultProduct={product} defaultRequestType="quote" />
        </div>
      </Section>
    </>
  );
}
