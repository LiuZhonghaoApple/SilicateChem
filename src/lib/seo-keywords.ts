import { SITE } from "./constants";

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
      `${SITE.company} — factory-direct sodium metasilicate manufacturer in China. 100,000+ tons capacity. Export supply for global B2B buyers.`,
  },
  /** Strongest product page — owns generic sodium metasilicate head terms */
  sodiumMetasilicate: {
    path: "/products/sodium-metasilicate",
    primary: "sodium metasilicate",
    title: "Sodium Metasilicate Specifications, Grades & RFQ",
    description:
      "Sodium metasilicate product information: CAS numbers, formula, anhydrous, pentahydrate, granules, specifications, applications, packing, MSDS, COA and RFQ.",
    keywords: [
      "sodium metasilicate specifications",
      "sodium metasilicate CAS",
      "sodium metasilicate MSDS",
      "sodium metasilicate COA",
    ],
  },
  /** Grade pages — specification keywords only */
  granules: {
    path: "/products/sodium-metasilicate-granules",
    primary: "sodium metasilicate granules",
    title: "Sodium Metasilicate Granules Specifications",
    description:
      "Sodium metasilicate granules specifications: CAS 6834-92-0, Na₂SiO₃, particle size, appearance, packing, MSDS, COA and quotation information.",
  },
  anhydrous: {
    path: "/products/sodium-metasilicate-anhydrous",
    primary: "sodium metasilicate anhydrous",
    title: "Anhydrous Sodium Metasilicate Specifications",
    description:
      "Sodium metasilicate anhydrous specifications: low moisture, high alkalinity Na₂SiO₃ grade. Technical data for detergent and industrial formulations.",
  },
  pentahydrate: {
    path: "/products/sodium-metasilicate-pentahydrate",
    primary: "sodium metasilicate pentahydrate",
    title: "Sodium Metasilicate Pentahydrate Specs",
    description:
      "Sodium metasilicate pentahydrate specifications: crystalline Na₂SiO₃·5H₂O grade for cleaning and water treatment applications.",
  },
  sodiumSilicate: {
    path: "/products/sodium-silicate",
    primary: "liquid sodium silicate",
    title: "Liquid Sodium Silicate — Specifications & RFQ",
    description:
      "Liquid sodium silicate product information: CAS 1344-09-8, modulus, appearance, packing options, industrial applications and RFQ details.",
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
