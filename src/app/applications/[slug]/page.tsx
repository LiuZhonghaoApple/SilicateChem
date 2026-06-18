import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import { FAQBlock } from "@/components/seo/FunnelSections";
import { FunnelLinksSidebar } from "@/components/seo/FunnelLinks";
import {
  industryApplications,
  getIndustryApplicationBySlug,
} from "@/content/applications/industries";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { StrongCTA } from "@/components/conversion/ProductConversionSections";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { FactoryTrustSystem } from "@/components/trust/FactoryTrustSystem";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return industryApplications.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const app = getIndustryApplicationBySlug(slug);
  if (!app) return {};
  return createMetadata({
    title: app.metaTitle,
    description: app.metaDescription,
    path: `/applications/${app.slug}`,
  });
}

export default async function ApplicationPage({ params }: Props) {
  const { slug } = await params;
  const app = getIndustryApplicationBySlug(slug);
  if (!app) notFound();

  const path = `/applications/${app.slug}`;
  const product = sodiumMetasilicateCategory.inquiryProductName;

  return (
    <>
      <FAQSchema items={app.faq} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Applications", url: `${SITE.url}/applications` },
          { name: app.title, url: `${SITE.url}${path}` },
        ]}
      />
      <PageHeader
        title={app.title}
        description={app.intro}
        breadcrumbs={[
          { label: "Applications", href: "/applications" },
          { label: app.title },
        ]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <SectionHeader title="How Sodium Metasilicate Is Used" />
              <ul className="space-y-2">
                {app.howUsed.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader title="Benefits for This Industry" />
              <ul className="space-y-2">
                {app.benefits.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[#2E7D9A] bg-[#2E7D9A]/5 p-6">
              <h3 className="font-bold text-[#0B2D5B]">Product Recommendation</h3>
              <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">
                {app.productRecommendation}
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link
                  href={METASILICATE_CATEGORY_PATH}
                  className="text-sm font-semibold text-[#2E7D9A] hover:underline"
                >
                  Sodium metasilicate manufacturer page →
                </Link>
                {app.recommendedGradeSlug && (
                  <Link
                    href={`/products/${app.recommendedGradeSlug}`}
                    className="text-sm font-semibold text-[#0B2D5B] hover:underline"
                  >
                    View grade specifications →
                  </Link>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B2D5B] mb-4">FAQ</h2>
              <FAQBlock items={app.faq} />
            </div>
            <StrongCTA product={product} />
          </div>
          <FunnelLinksSidebar />
        </div>
      </Section>
      <Section background="grey">
        <FactoryTrustSystem variant="full" product={product} />
      </Section>
      <Section background="grey">
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-[#0B2D5B] mb-4">Request Quotation</h2>
          <InquiryFormWrapper defaultProduct={product} defaultRequestType="quote" />
        </div>
      </Section>
    </>
  );
}
