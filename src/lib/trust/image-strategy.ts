export type ImageSourceType = "real";

export type TrustImageCategory =
  | "production"
  | "lab"
  | "warehouse"
  | "packaging"
  | "shipping";

export type TrustImageAsset = {
  id: string;
  category: TrustImageCategory;
  sectionLabel: string;
  source: ImageSourceType;
  alt: string;
  caption: string;
  description: string;
};

export const REAL_ASSETS: TrustImageAsset[] = [
  {
    id: "real-production",
    category: "production",
    sectionLabel: "Production Line",
    source: "real",
    alt: "Sodium metasilicate production line at Changyi Shandong manufacturing facility",
    caption: "Production Line",
    description:
      "Granulation and drying equipment for sodium metasilicate grades at our Shandong factory.",
  },
  {
    id: "real-lab",
    category: "lab",
    sectionLabel: "Manufacturing Equipment",
    source: "real",
    alt: "Inorganic silicate manufacturing equipment at Shandong production facility",
    caption: "Manufacturing Equipment",
    description:
      "In-house production equipment for sodium metasilicate and silicate product lines.",
  },
  {
    id: "real-warehouse",
    category: "warehouse",
    sectionLabel: "Warehouse Storage",
    source: "real",
    alt: "Sodium metasilicate warehouse staging area at Changyi Shandong plant",
    caption: "Warehouse Storage",
    description:
      "Bagged sodium metasilicate stock staged for container loading.",
  },
  {
    id: "real-packaging",
    category: "packaging",
    sectionLabel: "Export Packaging",
    source: "real",
    alt: "Sodium metasilicate export bagging and packaging area Shandong China",
    caption: "Export Packaging",
    description:
      "25 kg woven bags prepared for export shipment.",
  },
  {
    id: "real-shipping",
    category: "shipping",
    sectionLabel: "Export Loading",
    source: "real",
    alt: "Sodium metasilicate export loading and logistics at Qingdao port corridor",
    caption: "Export Loading",
    description:
      "Container loading with export documentation for international B2B buyers.",
  },
];

export const GALLERY_CATEGORIES: TrustImageCategory[] = [
  "production",
  "lab",
  "warehouse",
  "packaging",
  "shipping",
];

export function getAssetsForCategory(category: TrustImageCategory): TrustImageAsset[] {
  return REAL_ASSETS.filter((a) => a.category === category);
}

export function getTrustImageForCategory(category: TrustImageCategory): TrustImageAsset {
  const asset = REAL_ASSETS.find((a) => a.category === category);
  if (!asset) {
    throw new Error(`No trust image configured for category: ${category}`);
  }
  return asset;
}

import { getGalleryImageForCategory } from "@/content/site-images";

export function getTrustImageSrc(category: TrustImageCategory): string {
  return getGalleryImageForCategory(category);
}
