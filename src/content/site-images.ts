import manifest from "./site-images.manifest.json";
import { assertImageDeployment } from "@/lib/trust/image-deployment";

export type ImageEntry = {
  src: string;
  alt: string;
  section: string;
  block: string;
  source: string;
  deployPath?: string;
  page?: string;
};

/** Product slug → hero/gallery bindings (manifest bySlug section). */
export type SlugImageBinding = {
  hero?: ImageEntry;
  gallery?: ImageEntry;
};

export type GalleryCategoryKey =
  | "production"
  | "lab"
  | "warehouse"
  | "packaging"
  | "shipping";

export type SiteImages = {
  home: {
    hero: ImageEntry[];
    factoryPreview: ImageEntry | null;
    production: ImageEntry[];
  };
  about: ImageEntry[];
  factory: ImageEntry[];
  products: ImageEntry[];
  export: {
    packaging: ImageEntry[];
    shipping: ImageEntry[];
  };
  certifications: ImageEntry[];
  bySlug: Record<string, SlugImageBinding>;
  galleryByCategory: Record<GalleryCategoryKey, string>;
};

export const siteImages = manifest as unknown as SiteImages;

if (typeof window === "undefined") {
  assertImageDeployment();
}

export function getHeroImages(): ImageEntry[] {
  return siteImages.home.hero;
}

export function getHomeFactoryImage(): ImageEntry {
  const image =
    siteImages.home.factoryPreview ??
    siteImages.home.production[0] ??
    siteImages.factory[0];
  if (!image) {
    throw new Error("[site-images] No home factory image configured");
  }
  return image;
}

export function getHomeProductionImages(): ImageEntry[] {
  return siteImages.home.production;
}

export function getAboutImages(): ImageEntry[] {
  return siteImages.about;
}

export function getFactoryGalleryImages(): ImageEntry[] {
  return siteImages.factory;
}

export function getExportImages(): ImageEntry[] {
  return [...siteImages.export.packaging, ...siteImages.export.shipping];
}

export function getExportPackagingImages(): ImageEntry[] {
  return siteImages.export.packaging;
}

export function getExportShippingImages(): ImageEntry[] {
  return siteImages.export.shipping;
}

export function getProductImages(): ImageEntry[] {
  return siteImages.products;
}

export function getCertificationImages(): ImageEntry[] {
  return siteImages.certifications;
}

export function getGalleryImageForCategory(category: GalleryCategoryKey): string {
  return siteImages.galleryByCategory[category];
}

export function getProductImageForSlug(slug: string): ImageEntry {
  const mapped = siteImages.bySlug[slug]?.hero;
  if (mapped) return mapped;
  const index = ["sodium-metasilicate-granules", "sodium-metasilicate-anhydrous", "sodium-metasilicate-pentahydrate", "sodium-silicate"].indexOf(slug);
  const fallback = siteImages.products[index + 1] ?? siteImages.products[0];
  if (!fallback) {
    throw new Error(`[site-images] No product image for slug: ${slug}`);
  }
  return fallback;
}

export function getProductGalleryForSlug(slug: string): ImageEntry | undefined {
  return siteImages.bySlug[slug]?.gallery;
}

export function getCategoryPageProductImage(): ImageEntry {
  const image =
    siteImages.bySlug["sodium-metasilicate"]?.hero ?? siteImages.products[0];
  if (!image) {
    throw new Error("[site-images] No category page product image configured");
  }
  return image;
}

/** @deprecated Use getHeroImages()[0] */
export function getHeroImage(): string {
  return getHeroImages()[0]?.src ?? "/images/home/hero-01.webp";
}

export { ENABLE_IMAGE_VISUAL_DEBUG } from "@/lib/trust/image-deployment";
