import manifest from "./site-images.manifest.json";
import { products } from "@/content/products";

export type SiteImages = typeof manifest;

export const siteImages: SiteImages = manifest;

export function getHeroImage(): string {
  return siteImages.hero[0] ?? siteImages.homeProduction[0];
}

export function getHomeFactoryImage(): string {
  return siteImages.homeFactory[0] ?? siteImages.factoryGallery[0];
}

export function getHomeProductionImages(): string[] {
  return siteImages.homeProduction;
}

export function getFactoryGalleryImages(): string[] {
  return siteImages.factoryGallery;
}

export function getGalleryImageForCategory(
  category: keyof SiteImages["galleryByCategory"]
): string {
  return siteImages.galleryByCategory[category];
}

export function getProductImageForSlug(slug: string): string {
  const index = products.findIndex((p) => p.slug === slug);
  const images = siteImages.products;
  if (index >= 0 && index < images.length) {
    return images[index];
  }
  return images[0] ?? "/images/products/product-01.webp";
}

export function getCategoryPageProductImage(): string {
  return siteImages.products[0] ?? "/images/products/product-01.webp";
}
