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
  filename: string;
  source: ImageSourceType;
  alt: string;
  caption: string;
  description: string;
};

export const FACTORY_IMAGE_BASE = "/images/factory";

export const REAL_ASSETS: TrustImageAsset[] = [
  {
    id: "real-production",
    category: "production",
    sectionLabel: "Production Line",
    filename: "gallery-01.webp",
    source: "real",
    alt: "Sodium metasilicate factory China — production line at Shandong manufacturing facility",
    caption: "Production Line",
    description:
      "Granulation and drying equipment for sodium metasilicate grades at our Shandong factory.",
  },
  {
    id: "real-lab",
    category: "lab",
    sectionLabel: "Laboratory QC",
    filename: "gallery-02.webp",
    source: "real",
    alt: "Sodium metasilicate factory China — laboratory QC batch testing",
    caption: "Laboratory QC",
    description:
      "In-house batch testing for SiO₂, Na₂O, iron content, and color before export release.",
  },
  {
    id: "real-warehouse",
    category: "warehouse",
    sectionLabel: "Warehouse Storage",
    filename: "gallery-03.webp",
    source: "real",
    alt: "Sodium metasilicate factory China — warehouse storage and inventory",
    caption: "Warehouse Storage",
    description:
      "Bagged and palletized sodium metasilicate stock staged for container loading.",
  },
  {
    id: "real-packaging",
    category: "packaging",
    sectionLabel: "Packaging",
    filename: "gallery-04.webp",
    source: "real",
    alt: "Sodium metasilicate factory China — packaging area bagging and palletizing",
    caption: "Packaging",
    description:
      "25 kg and 50 kg woven bags with PE liner prepared for export shipment.",
  },
  {
    id: "real-shipping",
    category: "shipping",
    sectionLabel: "Export Loading",
    filename: "gallery-05.webp",
    source: "real",
    alt: "Sodium metasilicate factory China — export loading and logistics",
    caption: "Export Loading",
    description:
      "FCL container loading with export documentation for international B2B buyers.",
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

export function getTrustImageSrc(filename: string): string {
  return `${FACTORY_IMAGE_BASE}/${filename}`;
}
