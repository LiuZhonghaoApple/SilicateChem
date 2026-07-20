export type ProductMainImage = {
  src: string;
  alt: string;
};

const genericMetasilicateImage: ProductMainImage = {
  src: "/assets/images/product-cards/anhydrous-Granular.png",
  alt: "Sodium metasilicate series product sample",
};

export const PRODUCT_MAIN_IMAGES: Record<string, ProductMainImage> = {
  "sodium-metasilicate": genericMetasilicateImage,
  "sodium-metasilicate-granules": {
    src: "/assets/images/product-cards/anhydrous-Granular.png",
    alt: "Granular sodium metasilicate product sample",
  },
  "sodium-metasilicate-pentahydrate": {
    src: "/assets/images/product-cards/sodium-metasilicate-pentahydrate.png",
    alt: "Sodium metasilicate pentahydrate product sample",
  },
  "sodium-metasilicate-anhydrous": {
    src: "/assets/images/product-cards/sodium-metasilicate-anhydrous.png",
    alt: "Anhydrous sodium metasilicate product sample",
  },
  "sodium-silicate": {
    src: "/assets/images/product-cards/liquid-01.png",
    alt: "Liquid sodium silicate related product line",
  },
};

export function getProductMainImage(slug: string): ProductMainImage {
  return PRODUCT_MAIN_IMAGES[slug] ?? genericMetasilicateImage;
}
