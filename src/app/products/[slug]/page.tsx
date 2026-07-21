import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SpecTable } from "@/components/ui/SpecTable";
import { BreadcrumbSchema, ProductSchema } from "@/components/seo/JsonLd";
import { products, getProductBySlug } from "@/content/products";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { InternalProductLinks } from "@/components/seo/InternalProductLinks";
import { ContextualInternalLinks } from "@/components/seo/ContextualInternalLinks";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
import { ProductMainImage } from "@/components/products/ProductMainImage";
import { getProductMainImage } from "@/content/product-main-images";
import { getContentLastModified } from "@/lib/content-freshness";
import {
  productBreadcrumbs,
  productBreadcrumbSchemaItems,
} from "@/lib/breadcrumbs";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { isMetasilicateGrade } from "@/lib/internal-links";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return createMetadata({
    title: product.metaTitle,
    description: product.metaDescription,
    path: `/products/${product.slug}`,
    primaryKeyword: product.primaryKeyword,
    keywords: product.keywords,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const isGrade = isMetasilicateGrade(slug);
  const productPath = `/products/${product.slug}`;
  const productImage = getProductMainImage(product.slug);
  const related = products.filter((p) => p.slug !== product.slug);
  const quoteHref = `/contact?type=quote&product=${encodeURIComponent(product.name)}`;
  const rfqItems = [
    "Target grade or chemical form",
    "Order quantity or annual demand",
    "Packing preference",
    "Destination port or country",
    "Application or formulation use",
    "Required documents: COA, TDS, SDS or certificates",
  ];

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.summary}
        url={`${SITE.url}${productPath}`}
        sku={product.slug}
        image={`${SITE.url}${productImage.src}`}
        cas={product.cas}
        formula={product.formula}
        dateModified={getContentLastModified(productPath)}
      />
      <BreadcrumbSchema
        items={productBreadcrumbSchemaItems(
          product.name,
          productPath,
          SITE.url,
          { categoryParent: isGrade }
        )}
      />

      <PageHeader
        title={product.name}
        description={product.summary}
        breadcrumbs={productBreadcrumbs(product.name, { categoryParent: isGrade })}
      />

      {isGrade && (
        <div className="bg-[#F4F6F8] border-b border-[#E2E6EA]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 text-sm text-[#5A6570]">
            Grade specification page.{" "}
            <Link href={METASILICATE_CATEGORY_PATH} className="font-semibold text-[#2E7D9A] hover:underline">
              View sodium metasilicate product overview →
            </Link>
          </div>
        </div>
      )}

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="lg:hidden">
              <ProductMainImage productSlug={product.slug} compact className="mb-6" />
            </div>
            <div>
              <SectionHeader title="Product Overview" />
              {product.description.map((p, i) => (
                <p key={i} className="mb-3 text-[#5A6570] leading-relaxed">
                  {p}
                </p>
              ))}
              {product.cas && (
                <p className="mt-4 text-sm font-semibold text-[#0B2D5B]">
                  CAS {product.cas} · {product.formula}
                </p>
              )}
            </div>

            <div>
              <SectionHeader
                title="Key Specifications"
                subtitle="Confirm final values against your target grade and order specification before quotation."
              />
              <SpecTable specs={product.specs} />
            </div>

            <div>
              <SectionHeader
                title="Applications"
                subtitle="Common industrial uses for this product grade or product line."
              />
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.applications.map((app) => (
                  <li key={app} className="flex items-start gap-2 text-sm text-[#5A6570]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                    {app}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader
                title="Packaging Options"
                subtitle="Select packing according to handling method, container loading plan, and storage conditions."
              />
              <ul className="space-y-2">
                {product.packaging.map((pkg) => (
                  <li key={pkg} className="flex items-start gap-2 text-sm text-[#5A6570]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                    {pkg}
                  </li>
                ))}
              </ul>
            </div>

            {product.features.length > 0 && (
              <div>
                <SectionHeader title="Grade Features" />
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#5A6570]">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D9A]">
                    Documents & RFQ
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0B2D5B]">
                    Product documents for buyer review
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
                    Download available MSDS, certificates, product brochure and company
                    documents, or request batch-specific COA / TDS / SDS for your order.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/downloads"
                      className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
                    >
                      Download Documents
                    </Link>
                    <Link
                      href={quoteHref}
                      className="inline-flex items-center justify-center rounded border border-[#0B2D5B] px-5 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-[#EAF4FA]"
                    >
                      Request COA / TDS / SDS
                    </Link>
                  </div>
                </div>
                <div className="rounded-xl border border-[#D7E6EF] bg-[#F4F8FB] p-5">
                  <h3 className="text-sm font-bold text-[#0B2D5B]">
                    RFQ information needed
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {rfqItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="hidden lg:block">
              <ProductMainImage productSlug={product.slug} compact />
            </div>
            <InternalProductLinks />
            <ContextualInternalLinks currentPath={productPath} />
            <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
              <h3 className="font-bold text-[#0B2D5B] text-sm">Quick Inquiry</h3>
              <InquiryFormWrapper
                defaultProduct={product.name}
                defaultRequestType="quote"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader title="Related Products" />
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="block rounded-lg border border-[#E2E6EA] bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-bold text-[#0B2D5B] text-sm">{p.name}</h3>
                  <p className="mt-1 text-xs text-[#5A6570]">{p.summary}</p>
                </Link>
              ))}
            </div>
            {isGrade && (
              <p className="mt-6 text-sm text-[#5A6570]">
                All grades overview:{" "}
                <Link href={METASILICATE_CATEGORY_PATH} className="font-semibold text-[#2E7D9A] hover:underline">
                  Sodium Metasilicate product overview →
                </Link>
              </p>
            )}
            <div className="mt-8 rounded-2xl border border-[#D7E6EF] bg-white p-6">
              <h2 className="text-xl font-bold text-[#0B2D5B]">
                Need a confirmed quotation for {product.shortName}?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
                Send grade, quantity, packing, destination port and document requirements.
                We will confirm specification fit and practical quotation details.
              </p>
              <Link
                href={quoteHref}
                className="mt-5 inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
              >
                Request Quotation
              </Link>
            </div>
          </div>
          <ContextualInternalLinks
            currentPath={productPath}
            title="Applications, Guides & Documents"
          />
        </div>
      </Section>
    </>
  );
}
