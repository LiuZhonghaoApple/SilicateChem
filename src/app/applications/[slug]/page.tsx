import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import { FAQBlock } from "@/components/seo/FunnelSections";
import { FunnelLinksSidebar } from "@/components/seo/FunnelLinks";
import { ApplicationIcon } from "@/components/applications/ApplicationIcon";
import {
  industryApplications,
  getIndustryApplicationBySlug,
} from "@/content/applications/industries";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
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
  const rfqItems = [
    "Application or formulation type",
    "Recommended grade to review",
    "Target specification or current material standard",
    "Order quantity and packing preference",
    "Destination port and required documents",
  ];

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
            <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <ApplicationIcon slug={app.slug} className="shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D9A]">
                    Application Brief
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B2D5B]">
                    Sodium metasilicate selection for this industry
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
                    This page focuses on product use, grade selection, buying notes,
                    and quotation details for the application. Company background and
                    manufacturing overview are covered on the About page.
                  </p>
                </div>
              </div>
            </div>

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
                  Sodium metasilicate specifications page →
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
            <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0B2D5B]">
                RFQ Details for This Application
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
                Application-based quotations should confirm grade, usage conditions,
                packing and documentation before price comparison.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {rfqItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0B2D5B] mb-4">FAQ</h2>
              <FAQBlock items={app.faq} />
            </div>
          </div>
          <FunnelLinksSidebar currentPath={path} />
        </div>
      </Section>
      <Section background="grey">
        <div className="max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-[#0B2D5B] mb-4">
            Request Application-Based Quotation
          </h2>
          <InquiryFormWrapper defaultProduct={product} defaultRequestType="quote" />
        </div>
      </Section>
    </>
  );
}
