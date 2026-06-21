import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SpecTable } from "@/components/ui/SpecTable";
import { LazyImage } from "@/components/ui/LazyImage";
import { getProductImageForSlug } from "@/content/site-images";
import { BreadcrumbSchema, ProductSchema } from "@/components/seo/JsonLd";
import { products, getProductBySlug } from "@/content/products";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { ProductConversionSections, StrongCTA } from "@/components/conversion/ProductConversionSections";
import { InternalProductLinks } from "@/components/seo/InternalProductLinks";
import { InquiryFormWrapper } from "@/components/forms/InquiryFormWrapper";
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
  const related = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.summary}
        url={`${SITE.url}${productPath}`}
        sku={product.slug}
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
              View sodium metasilicate manufacturer & supplier overview →
            </Link>
          </div>
        </div>
      )}

      <Section>
        <StrongCTA product={product.name} className="mb-8" />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
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
              <SectionHeader title="Key Specifications" />
              <SpecTable specs={product.specs} />
            </div>

            <div>
              <SectionHeader title="Applications" />
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
              <SectionHeader title="Packaging Options" />
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
          </div>

          <div className="space-y-6">
            <LazyImage
              src={getProductImageForSlug(product.slug)}
              alt={`${product.name} — factory direct sodium metasilicate from Shandong`}
              aspect="square"
              className="rounded-lg border border-[#E2E6EA]"
            />
            <InternalProductLinks />
            <div className="rounded-lg border border-[#E2E6EA] p-5">
              <h3 className="font-bold text-[#0B2D5B] text-sm">Quick Inquiry</h3>
              <InquiryFormWrapper
                defaultProduct={product.name}
                defaultRequestType="quote"
              />
            </div>
          </div>
        </div>
      </Section>

      {isGrade && <ProductConversionSections product={product} />}

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
                  Sodium Metasilicate manufacturer & supplier →
                </Link>
              </p>
            )}
            <StrongCTA product={product.name} className="mt-8" />
          </div>
          <InternalProductLinks />
        </div>
      </Section>
    </>
  );
}
