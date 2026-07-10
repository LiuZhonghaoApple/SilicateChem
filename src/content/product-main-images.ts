export type ProductMainImage = {
  src: string;
  alt: string;
};

const genericMetasilicateImage: ProductMainImage = {
  src: "/assets/images/factory-proof/finished-goods-warehouse.png",
  alt: "Packed sodium metasilicate products in finished goods warehouse",
};

export const PRODUCT_MAIN_IMAGES: Record<string, ProductMainImage> = {
  "sodium-metasilicate": genericMetasilicateImage,
  "sodium-metasilicate-granules": genericMetasilicateImage,
  "sodium-metasilicate-pentahydrate": genericMetasilicateImage,
  "sodium-metasilicate-anhydrous": genericMetasilicateImage,
  "sodium-silicate": {
    src: "/assets/images/factory-proof/production-equipment.png",
    alt: "Silicate production equipment at Zhongzhi factory",
  },
};

export function getProductMainImage(slug: string): ProductMainImage {
  return PRODUCT_MAIN_IMAGES[slug] ?? genericMetasilicateImage;
}
