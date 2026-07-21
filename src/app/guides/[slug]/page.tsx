import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { FAQSchema, BreadcrumbSchema, ArticleSchema } from "@/components/seo/JsonLd";
import { FAQBlock } from "@/components/seo/FunnelSections";
import { FunnelLinksSidebar } from "@/components/seo/FunnelLinks";
import Link from "next/link";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { intentGuides, getIntentGuideBySlug } from "@/content/guides/intent-pages";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { formatContentDate, getContentLastModified } from "@/lib/content-freshness";

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
  const datePublished = "2026-06-18";
  const dateModified = getContentLastModified(path);

  const product = sodiumMetasilicateCategory.inquiryProductName;
  const quoteHref = `/contact?type=quote&product=${encodeURIComponent(product)}`;
  const rfqItems = [
    "Product grade or application",
    "Target specification",
    "Order quantity",
    "Packing preference",
    "Destination port",
    "Required documents",
  ];

  return (
    <>
      <ArticleSchema
        title={guide.title}
        description={guide.intro}
        url={`${SITE.url}${path}`}
        datePublished={datePublished}
        dateModified={dateModified}
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
            <p className="text-sm text-[#5A6570]">
              Published <time dateTime={datePublished}>June 18, 2026</time>
              {" · "}
              Updated <time dateTime={dateModified}>{formatContentDate(dateModified)}</time>
            </p>
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
            <div className="rounded-2xl border border-[#D7E6EF] bg-[#F4F8FB] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D9A]">
                Next Step
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0B2D5B]">
                Turn this guide into a practical quotation
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
                Use the guide to define grade, packing, volume and documents. Then
                continue to product specifications or send an RFQ for factory review.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products/sodium-metasilicate"
                  className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
                >
                  View Product Specifications
                </Link>
                <Link
                  href={quoteHref}
                  className="inline-flex items-center justify-center rounded border border-[#0B2D5B] px-5 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-white"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </div>
          <FunnelLinksSidebar />
        </div>
      </Section>
      <Section background="grey">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0B2D5B]">
              RFQ Checklist
            </h2>
            <ul className="mt-4 space-y-2">
              {rfqItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/downloads"
              className="mt-5 inline-flex text-sm font-bold text-[#2E7D9A] hover:underline"
            >
              Download available documents →
            </Link>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-bold text-[#0B2D5B]">
              Request Quotation
            </h2>
          <InquiryFormWrapper defaultProduct={product} defaultRequestType="quote" />
          </div>
        </div>
      </Section>
    </>
  );
}
