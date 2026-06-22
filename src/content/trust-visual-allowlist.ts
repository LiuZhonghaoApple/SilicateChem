/** Images permitted to render in buyer-facing visual proof UI. */
export const ALLOWED_VISUAL_PROOF_SRCS = new Set([
  "/images/home/hero-lab-sodium-metasilicate.webp",
  "/images/home/factory-preview.webp",
  "/images/home/production-01.webp",
  "/images/home/production-02.webp",
  "/images/about/facility-exterior.webp",
  "/images/products/product-11.webp",
]);

export type VisualImageCategory =
  | "factory"
  | "production"
  | "packaging"
  | "warehouse"
  | "loading"
  | "laboratory"
  | "product"
  | "award"
  | "tourism"
  | "group"
  | "festival"
  | "people"
  | "office"
  | "certificate"
  | "stock"
  | "forbidden";

export type VisualImageRecord = {
  src: string;
  category: VisualImageCategory;
  reason: string;
};

/** Semantic classification for audit report and runtime filtering. */
export const VISUAL_IMAGE_REGISTRY: VisualImageRecord[] = [
  { src: "/images/home/hero-lab-sodium-metasilicate.webp", category: "laboratory", reason: "Approved lab hero — sodium metasilicate QC" },
  { src: "/images/home/hero-01.webp", category: "stock", reason: "Generic stock keyboard texture" },
  { src: "/images/home/hero-02.webp", category: "stock", reason: "Generic stock corporate tower" },
  { src: "/images/home/hero-03.webp", category: "stock", reason: "Generic stock newspaper texture" },
  { src: "/images/home/factory-preview.webp", category: "factory", reason: "Factory main gate exterior" },
  { src: "/images/home/production-01.webp", category: "factory", reason: "Factory gate exterior panoramic" },
  { src: "/images/home/production-02.webp", category: "factory", reason: "Aerial industrial campus" },
  { src: "/images/home/production-03.webp", category: "festival", reason: "Chinese New Year corporate banner" },
  { src: "/images/home/production-04.webp", category: "festival", reason: "Women's Day corporate graphic" },
  { src: "/images/home/production-05.webp", category: "award", reason: "Certificate / award plaque" },
  { src: "/images/home/production-06.webp", category: "award", reason: "Certificate / honor plaque" },
  { src: "/images/home/production-07.webp", category: "award", reason: "Certificate / honor plaque" },
  { src: "/images/home/production-08.webp", category: "award", reason: "Certificate / award plaque" },
  { src: "/images/about/facility-exterior.webp", category: "factory", reason: "Factory main gate exterior" },
  { src: "/images/about/production-line.webp", category: "office", reason: "Showroom tour with people — not production line" },
  { src: "/images/about/plant-operations.webp", category: "tourism", reason: "Real estate event entrance" },
  { src: "/images/factory/line-01.webp", category: "group", reason: "Outdoor corporate team rally" },
  { src: "/images/factory/line-02.webp", category: "group", reason: "Formal group photo in reception room" },
  { src: "/images/factory/line-03.webp", category: "festival", reason: "Corporate gala performance" },
  { src: "/images/factory/line-04.webp", category: "festival", reason: "Fireworks / real estate celebration" },
  { src: "/images/factory/line-05.webp", category: "certificate", reason: "Government notice screenshot" },
  { src: "/images/factory/line-06.webp", category: "group", reason: "Formal meeting with people" },
  { src: "/images/factory/line-07.webp", category: "group", reason: "Large formal meeting with people" },
  { src: "/images/factory/line-08.webp", category: "award", reason: "Labor Day awards ceremony" },
  { src: "/images/factory/line-09.webp", category: "group", reason: "Cultural gala group photo" },
  { src: "/images/factory/warehouse-staging.webp", category: "office", reason: "Real estate showroom display" },
  { src: "/images/products/product-01.webp", category: "group", reason: "Lab tour group photo" },
  { src: "/images/products/product-02.webp", category: "award", reason: "Awards ceremony on stage" },
  { src: "/images/products/product-03.webp", category: "tourism", reason: "Team-building excursion" },
  { src: "/images/products/product-04.webp", category: "group", reason: "Community visit with people" },
  { src: "/images/products/product-05.webp", category: "festival", reason: "Outdoor drum-dance community event" },
  { src: "/images/products/product-06.webp", category: "group", reason: "Teachers' Day ceremony assembly" },
  { src: "/images/products/product-07.webp", category: "group", reason: "Teachers' Day meeting with people" },
  { src: "/images/products/product-08.webp", category: "office", reason: "Showroom tour with visitors" },
  { src: "/images/products/product-09.webp", category: "festival", reason: "Cultural dance performance" },
  { src: "/images/products/product-10.webp", category: "office", reason: "Swimming pool construction site" },
  { src: "/images/products/product-11.webp", category: "factory", reason: "Aerial factory campus" },
  { src: "/images/products/product-12.webp", category: "tourism", reason: "Real estate development render" },
  { src: "/images/products/product-13.webp", category: "award", reason: "Certificate / honor plaque" },
  { src: "/images/products/product-14.webp", category: "festival", reason: "Women's Day greeting graphic" },
  { src: "/images/export/export-loading-01.webp", category: "office", reason: "Showroom tour with people" },
  { src: "/images/export/export-loading-02.webp", category: "certificate", reason: "Patent award screenshot" },
  { src: "/images/export/export-loading-03.webp", category: "people", reason: "Warehouse walkthrough with people — not product proof" },
  { src: "/images/export/bagged-product-01.webp", category: "festival", reason: "Community drum-dance event" },
  { src: "/images/export/bagged-product-02.webp", category: "group", reason: "Conference room meeting" },
  { src: "/images/export/warehouse-staging.webp", category: "office", reason: "Showroom with sample jars and visitors" },
];

const registryBySrc = new Map(VISUAL_IMAGE_REGISTRY.map((r) => [r.src, r]));

export function isAllowedVisualProofSrc(src: string): boolean {
  const normalized = src.replace(/^https?:\/\/[^/]+/, "");
  return ALLOWED_VISUAL_PROOF_SRCS.has(normalized);
}

export function getVisualImageRecord(src: string): VisualImageRecord | undefined {
  const normalized = src.replace(/^https?:\/\/[^/]+/, "");
  return registryBySrc.get(normalized);
}

export function filterAllowedVisualProofImages<T extends { src: string }>(images: T[]): T[] {
  return images.filter((img) => isAllowedVisualProofSrc(img.src));
}

const FORBIDDEN_CATEGORIES = new Set<VisualImageCategory>([
  "award",
  "tourism",
  "group",
  "festival",
  "people",
  "office",
  "certificate",
  "stock",
  "forbidden",
]);

export function countImagesByCategory(): Record<string, number> {
  const counts: Record<string, number> = {
    factory: 0,
    production: 0,
    packaging: 0,
    warehouse: 0,
    loading: 0,
    laboratory: 0,
    product: 0,
    award: 0,
    tourism: 0,
    group: 0,
    festival: 0,
    people: 0,
  };

  for (const record of VISUAL_IMAGE_REGISTRY) {
    if (isAllowedVisualProofSrc(record.src)) {
      counts[record.category] = (counts[record.category] ?? 0) + 1;
    } else if (FORBIDDEN_CATEGORIES.has(record.category)) {
      counts[record.category] = (counts[record.category] ?? 0) + 1;
    }
  }

  return counts;
}
