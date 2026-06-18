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

  return (
    <>
      <ProductSchema
        name={cat.name}
        description={cat.summary}
        url={`${SITE.url}${path}`}
        sku="sodium-metasilicate"
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
          Shandong Zhongzhi Chemical is a sodium metasilicate manufacturer and supplier based in China.
          For company-level information see our{" "}
          <Link href="/" className="font-semibold text-[#2E7D9A] hover:underline">homepage</Link>.
        </p>
      </Section>
    </>
  );
}
