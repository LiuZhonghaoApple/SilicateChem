/**
 * 4-layer SEO lead-generation funnel.
 * Authority flows: Guides → Applications → /products/sodium-metasilicate (sole sink).
 */
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

export const AUTHORITY_SINK = METASILICATE_CATEGORY_PATH;

/** Layer 1 — money pages (ranking priority) */
export const MONEY_PAGES = [
  "/products/sodium-metasilicate",
  "/products/sodium-metasilicate-granules",
  "/products/sodium-metasilicate-anhydrous",
  "/products/sodium-metasilicate-pentahydrate",
  "/products/sodium-silicate",
] as const;

/** Layer 2 — mid-funnel industry use cases (indexable; push to product hub) */
export const APPLICATION_SLUGS = [
  "detergent-industry",
  "water-treatment",
  "textile-industry",
  "paper-industry",
] as const;

/** Layer 3 — commercial-intent guides (low-cost traffic → product hub) */
export const GUIDE_SLUGS = [
  "supplier-selection",
  "price-factors",
  "uses-detergent",
  "sodium-metasilicate-vs-soda-ash",
  "how-to-choose-china-factory",
] as const;

/** Layer 4 — minimal supporting blog (not ranking priority) */
export const BLOG_SLUGS = [
  "detergent-industry-metasilicate",
  "water-treatment-metasilicate",
  "china-metasilicate-procurement",
] as const;

export type ApplicationSlug = (typeof APPLICATION_SLUGS)[number];
export type GuideSlug = (typeof GUIDE_SLUGS)[number];
export type BlogSlug = (typeof BLOG_SLUGS)[number];
