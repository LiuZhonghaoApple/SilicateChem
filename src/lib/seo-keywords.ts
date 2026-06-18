/**
 * Keyword-to-page mapping. Each primary keyword targets ONE dedicated landing page.
 * Avoid reusing head terms across routes (anti-cannibalization).
 */
export const SEO_KEYWORDS = {
  homepage: {
    path: "/",
    primary: "sodium metasilicate manufacturer china",
    title: "Sodium Metasilicate Manufacturer in China",
    description:
      "Shandong Zhongzhi Chemical — factory-direct sodium metasilicate manufacturer in China. 100,000+ tons capacity. Export supply for global B2B buyers.",
  },
  /** Strongest product page — owns generic sodium metasilicate head terms */
  sodiumMetasilicate: {
    path: "/products/sodium-metasilicate",
    primary: "sodium metasilicate",
    title: "Sodium Metasilicate Manufacturer & Supplier — Factory Direct China",
    description:
      "Factory-direct sodium metasilicate from Shandong, China. Manufacturer and supplier of granules, anhydrous, and pentahydrate grades. 100,000+ tons capacity. Request quotation.",
    keywords: [
      "sodium metasilicate manufacturer",
      "sodium metasilicate supplier",
      "sodium metasilicate factory",
      "sodium metasilicate china",
    ],
  },
  /** Grade pages — specification keywords only */
  granules: {
    path: "/products/sodium-metasilicate-granules",
    primary: "sodium metasilicate granules",
    title: "Sodium Metasilicate Granules — Specifications & Export Grade",
    description:
      "Sodium metasilicate granules specifications: CAS 6834-92-0, SiO₂ ≥ 46%, uniform particle size. Bulk export grade from Chinese manufacturer.",
  },
  anhydrous: {
    path: "/products/sodium-metasilicate-anhydrous",
    primary: "sodium metasilicate anhydrous",
    title: "Sodium Metasilicate Anhydrous — Specifications & Technical Data",
    description:
      "Sodium metasilicate anhydrous specifications: low moisture, high alkalinity Na₂SiO₃ grade. Technical data for detergent and industrial formulations.",
  },
  pentahydrate: {
    path: "/products/sodium-metasilicate-pentahydrate",
    primary: "sodium metasilicate pentahydrate",
    title: "Sodium Metasilicate Pentahydrate — Specifications & Technical Data",
    description:
      "Sodium metasilicate pentahydrate specifications: crystalline Na₂SiO₃·5H₂O grade for cleaning and water treatment applications.",
  },
  sodiumSilicate: {
    path: "/products/sodium-silicate",
    primary: "sodium silicate manufacturer",
    title: "Sodium Silicate Manufacturer — China Factory Direct",
    description:
      "Sodium silicate manufacturer in Shandong, China. Liquid and solid grades. Combined shipment with sodium metasilicate.",
  },
} as const;

export const METASILICATE_CATEGORY_PATH = SEO_KEYWORDS.sodiumMetasilicate.path;

export const METASILICATE_GRADE_SLUGS = [
  "sodium-metasilicate-granules",
  "sodium-metasilicate-anhydrous",
  "sodium-metasilicate-pentahydrate",
] as const;

export type MetasilicateGradeSlug = (typeof METASILICATE_GRADE_SLUGS)[number];

export type ProductSlug = MetasilicateGradeSlug | "sodium-silicate";

export const PRODUCT_KEYWORD_MAP: Record<ProductSlug, keyof typeof SEO_KEYWORDS> = {
  "sodium-metasilicate-granules": "granules",
  "sodium-metasilicate-anhydrous": "anhydrous",
  "sodium-metasilicate-pentahydrate": "pentahydrate",
  "sodium-silicate": "sodiumSilicate",
};
