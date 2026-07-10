import Link from "next/link";
import Image from "next/image";
import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { products } from "@/content/products";
import type { Product } from "@/types";
import { getProductMainImage } from "@/content/product-main-images";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { metasilicateGradeLinks, sodiumSilicateLink } from "@/lib/internal-links";
import { TechnicalDocsBlock } from "@/components/trust/TechnicalDocsBlock";

function ProductCatalogCard({
  product,
  href,
}: {
  product: Product;
  href: string;
}) {
  const image = getProductMainImage(product.slug);

  return (
    <Link
      href={href}
      className="group block h-full overflow-hidden rounded-lg border border-[#E2E6EA] bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative h-44">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0B2D5B] transition-colors group-hover:text-[#2E7D9A]">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">{product.summary}</p>
        <p className="mt-4 text-sm font-semibold text-[#2E7D9A] group-hover:underline">
          View specifications →
        </p>
      </div>
    </Link>
  );
}

export const metadata = createMetadata({
  title: "Products — Sodium Metasilicate & Sodium Silicate",
  description:
    "Product catalog: sodium metasilicate granules, anhydrous, pentahydrate, and sodium silicate. Factory-direct from Shandong, China.",
  path: "/products",
  keywords: ["sodium metasilicate products", "chemical product catalog"],
});

export default function ProductsPage() {
  const cat = sodiumMetasilicateCategory;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Products", url: `${SITE.url}/products` },
        ]}
      />
      <PageHeader
        title="Products"
        description="All grades manufactured at our Shandong facility. Sodium metasilicate is our main product category."
        breadcrumbs={[{ label: "Products" }]}
      />

      <Section>
        <div className="mb-10 overflow-hidden rounded-lg border-2 border-[#2E7D9A] bg-[#2E7D9A]/5">
          <div className="grid gap-0 md:grid-cols-[300px_1fr]">
            <div className="relative h-56 md:h-full">
              <Image
                src={getProductMainImage("sodium-metasilicate").src}
                alt={getProductMainImage("sodium-metasilicate").alt}
                fill
                sizes="(min-width: 768px) 300px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D9A]">
                Main Product Category
              </span>
              <h2 className="mt-2 text-xl md:text-2xl font-bold text-[#0B2D5B]">
                <Link href={METASILICATE_CATEGORY_PATH} className="hover:text-[#2E7D9A]">
                  {cat.name}
                </Link>
              </h2>
              <p className="mt-2 text-[#5A6570] leading-relaxed max-w-3xl">{cat.summary}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link href={METASILICATE_CATEGORY_PATH} className="text-sm font-semibold text-[#2E7D9A] hover:underline">
                  Manufacturer & supplier overview →
                </Link>
                <Link
                  href={`/contact?type=quote&product=${encodeURIComponent(cat.inquiryProductName)}`}
                  className="text-sm font-semibold text-[#0B2D5B] hover:underline"
                >
                  Request quote →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <SectionHeader title="Sodium Metasilicate Grades" subtitle="Specification pages for each grade." />
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {metasilicateGradeLinks.map((link) => {
            const p = products.find((x) => link.href.endsWith(x.slug))!;
            return (
              <ProductCatalogCard key={link.href} product={p} href={link.href} />
            );
          })}
        </div>

        <SectionHeader title="Supporting Products" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(() => {
            const sodiumSilicate = products.find((p) => p.slug === "sodium-silicate")!;
            return (
              <ProductCatalogCard
                product={sodiumSilicate}
                href={sodiumSilicateLink.href}
              />
            );
          })()}
        </div>

        <div className="mt-10">
          <TechnicalDocsBlock product={cat.inquiryProductName} />
        </div>

        <PageCTAs product={cat.inquiryProductName} className="mt-10" />
      </Section>
    </>
  );
}
