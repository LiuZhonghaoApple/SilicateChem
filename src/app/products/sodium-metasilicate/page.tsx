import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { BreadcrumbSchema, ProductSchema } from "@/components/seo/JsonLd";
import { MetasilicateCategoryPage } from "@/components/products/MetasilicateCategoryPage";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { metasilicateCategoryBreadcrumbs, productBreadcrumbSchemaItems } from "@/lib/breadcrumbs";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { SEO_KEYWORDS } from "@/lib/seo-keywords";
import { getProductMainImage } from "@/content/product-main-images";
import { getContentLastModified } from "@/lib/content-freshness";

export const metadata = createMetadata({
  title: SEO_KEYWORDS.sodiumMetasilicate.title,
  description: SEO_KEYWORDS.sodiumMetasilicate.description,
  path: SEO_KEYWORDS.sodiumMetasilicate.path,
  primaryKeyword: SEO_KEYWORDS.sodiumMetasilicate.primary,
  keywords: SEO_KEYWORDS.sodiumMetasilicate.keywords,
});

export default function SodiumMetasilicatePage() {
  const cat = sodiumMetasilicateCategory;
  const path = cat.path;
  const productImage = getProductMainImage("sodium-metasilicate");

  return (
    <>
      <ProductSchema
        name={cat.name}
        description={cat.summary}
        url={`${SITE.url}${path}`}
        sku="sodium-metasilicate"
        image={`${SITE.url}${productImage.src}`}
        cas="6834-92-0"
        formula="Na₂SiO₃"
        dateModified={getContentLastModified(path)}
      />
      <BreadcrumbSchema
        items={productBreadcrumbSchemaItems(cat.name, path, SITE.url)}
      />
      <PageHeader
        title={cat.name}
        description={cat.summary}
        breadcrumbs={metasilicateCategoryBreadcrumbs()}
      />
      <MetasilicateCategoryPage />
      <Section background="grey">
        <p className="mx-auto max-w-6xl px-4 sm:px-6 text-sm text-[#5A6570]">
          {SITE.company} is a sodium metasilicate manufacturer and supplier based in China.
          For company-level information see our{" "}
          <Link href="/" className="font-semibold text-[#2E7D9A] hover:underline">homepage</Link>.
        </p>
      </Section>
    </>
  );
}
