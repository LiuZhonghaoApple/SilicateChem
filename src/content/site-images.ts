import manifest from "./site-images.manifest.json";
import { assertImageDeployment } from "@/lib/trust/image-deployment";
import { isImageSystemPending } from "@/lib/image-system";

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

if (typeof window === "undefined" && !isImageSystemPending()) {
  assertImageDeployment();
}

const EMPTY_EXPORT = { packaging: [] as ImageEntry[], shipping: [] as ImageEntry[] };

export function getHeroImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return siteImages.home.hero;
}

export function getHomeFactoryImage(): ImageEntry {
  if (isImageSystemPending()) {
    throw new Error("[site-images] Image system PENDING — no factory image available");
  }
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
  if (isImageSystemPending()) return [];
  return siteImages.home.production;
}

export function getAboutImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return siteImages.about;
}

export function getFactoryGalleryImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return siteImages.factory;
}

export function getExportImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return [...siteImages.export.packaging, ...siteImages.export.shipping];
}

export function getExportPackagingImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return siteImages.export.packaging;
}

export function getExportShippingImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return siteImages.export.shipping;
}

export function getProductImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return siteImages.products;
}

export function getCertificationImages(): ImageEntry[] {
  if (isImageSystemPending()) return [];
  return siteImages.certifications;
}

export function getGalleryImageForCategory(_category: GalleryCategoryKey): string {
  if (isImageSystemPending()) return "";
  return siteImages.galleryByCategory[_category];
}

export function getProductImageForSlug(_slug: string): never {
  throw new Error(
    "[site-images] getProductImageForSlug is disabled — image system PENDING."
  );
}

export function getProductGalleryForSlug(_slug: string): undefined {
  return undefined;
}

export function getCategoryPageProductImage(): never {
  throw new Error(
    "[site-images] getCategoryPageProductImage is disabled — image system PENDING."
  );
}

/** @deprecated Use getHeroImages()[0] */
export function getHeroImage(): string {
  if (isImageSystemPending()) return "";
  return getHeroImages()[0]?.src ?? "";
}

/** Frozen empty export slice while image system is pending (prevents RSC payload leakage). */
export function getSiteExportImages(): SiteImages["export"] {
  if (isImageSystemPending()) return EMPTY_EXPORT;
  return siteImages.export;
}

export { ENABLE_IMAGE_VISUAL_DEBUG } from "@/lib/trust/image-deployment";
