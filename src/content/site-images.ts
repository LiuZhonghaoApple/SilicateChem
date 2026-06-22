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

export function getProductImageForSlug(_slug: string): never {
  throw new Error(
    "[site-images] getProductImageForSlug is disabled — use ProductVisualProof (text only)."
  );
}

export function getProductGalleryForSlug(_slug: string): undefined {
  return undefined;
}

export function getCategoryPageProductImage(): never {
  throw new Error(
    "[site-images] getCategoryPageProductImage is disabled — use ProductVisualProof (text only)."
  );
}

/** @deprecated Use getHeroImages()[0] */
export function getHeroImage(): string {
  return getHeroImages()[0]?.src ?? "/images/home/hero-lab-sodium-metasilicate.webp";
}

export { ENABLE_IMAGE_VISUAL_DEBUG } from "@/lib/trust/image-deployment";
