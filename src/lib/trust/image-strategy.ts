export type ImageSourceType = "real" | "ai_placeholder" | "future_real";

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
  priority: 1 | 2 | 3;
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
    filename: "sodium-metasilicate-factory-production.jpg",
    source: "real",
    priority: 1,
    alt: "Sodium metasilicate factory China — production line at Shandong manufacturing facility",
    caption: "Production Line",
    description:
      "Granulation and drying equipment for sodium metasilicate grades at our Shandong factory.",
  },
  {
    id: "real-lab",
    category: "lab",
    sectionLabel: "Laboratory QC",
    filename: "sodium-metasilicate-factory-lab.jpg",
    source: "real",
    priority: 1,
    alt: "Sodium metasilicate factory China — laboratory QC batch testing",
    caption: "Laboratory QC",
    description:
      "In-house batch testing for SiO₂, Na₂O, iron content, and color before export release.",
  },
  {
    id: "real-warehouse",
    category: "warehouse",
    sectionLabel: "Warehouse Storage",
    filename: "sodium-metasilicate-factory-warehouse.jpg",
    source: "real",
    priority: 1,
    alt: "Sodium metasilicate factory China — warehouse storage and inventory",
    caption: "Warehouse Storage",
    description:
      "Bagged and palletized sodium metasilicate stock staged for container loading.",
  },
  {
    id: "real-packaging",
    category: "packaging",
    sectionLabel: "Packaging",
    filename: "sodium-metasilicate-factory-packaging.jpg",
    source: "real",
    priority: 1,
    alt: "Sodium metasilicate factory China — packaging area bagging and palletizing",
    caption: "Packaging",
    description:
      "25 kg and 50 kg woven bags with PE liner prepared for export shipment.",
  },
  {
    id: "real-shipping",
    category: "shipping",
    sectionLabel: "Export Loading",
    filename: "sodium-metasilicate-factory-shipping.jpg",
    source: "real",
    priority: 1,
    alt: "Sodium metasilicate factory China — export loading and logistics",
    caption: "Export Loading",
    description:
      "FCL container loading with export documentation for international B2B buyers.",
  },
];

export const AI_PLACEHOLDERS: TrustImageAsset[] = [
  {
    id: "ai-production",
    category: "production",
    sectionLabel: "Production Line",
    filename: "sodium-metasilicate-ai-production.jpg",
    source: "ai_placeholder",
    priority: 2,
    alt: "Illustrative sodium metasilicate production facility — industrial chemical plant China",
    caption: "Production Line",
    description:
      "Industrial-scale granulation and drying capability for sodium metasilicate manufacturing.",
  },
  {
    id: "ai-lab",
    category: "lab",
    sectionLabel: "Laboratory QC",
    filename: "sodium-metasilicate-ai-lab.jpg",
    source: "ai_placeholder",
    priority: 2,
    alt: "Illustrative QC laboratory for sodium metasilicate batch testing China factory",
    caption: "Laboratory QC",
    description:
      "In-house specification testing for SiO₂, Na₂O, iron, and color parameters.",
  },
  {
    id: "ai-warehouse",
    category: "warehouse",
    sectionLabel: "Warehouse Storage",
    filename: "sodium-metasilicate-ai-warehouse.jpg",
    source: "ai_placeholder",
    priority: 2,
    alt: "Illustrative sodium metasilicate warehouse storage at China chemical factory",
    caption: "Warehouse Storage",
    description:
      "Palletized bag stock staged for export orders and recurring FCL contracts.",
  },
  {
    id: "ai-packaging",
    category: "packaging",
    sectionLabel: "Packaging",
    filename: "sodium-metasilicate-ai-packaging.jpg",
    source: "ai_placeholder",
    priority: 2,
    alt: "Illustrative sodium metasilicate packaging area at China manufacturing facility",
    caption: "Packaging",
    description:
      "Woven bags and FIBC jumbo bag filling for global distributor shipments.",
  },
  {
    id: "ai-shipping",
    category: "shipping",
    sectionLabel: "Export Loading",
    filename: "sodium-metasilicate-ai-shipping.jpg",
    source: "ai_placeholder",
    priority: 2,
    alt: "Illustrative sodium metasilicate export container loading China logistics",
    caption: "Export Loading",
    description:
      "Container loading workflow for FOB Shandong and CIF export shipments.",
  },
];

/** Reserved slots for future on-site photography — drop files in when available. */
export const FUTURE_REAL: TrustImageAsset[] = [
  {
    id: "future-aerial",
    category: "production",
    sectionLabel: "Factory Overview",
    filename: "sodium-metasilicate-factory-aerial.jpg",
    source: "future_real",
    priority: 3,
    alt: "Sodium metasilicate factory aerial overview Shandong China manufacturing site",
    caption: "Factory Overview",
    description:
      "Aerial view of the Shandong production site — replace with on-site photography.",
  },
];

export const IMAGE_STRATEGY_LAYERS = {
  REAL_ASSETS,
  AI_PLACEHOLDERS,
  FUTURE_REAL,
} as const;

export const GALLERY_CATEGORIES: TrustImageCategory[] = [
  "production",
  "lab",
  "warehouse",
  "packaging",
  "shipping",
];

const ALL_LAYERS = [...REAL_ASSETS, ...AI_PLACEHOLDERS, ...FUTURE_REAL];

export function getAssetsForCategory(category: TrustImageCategory): TrustImageAsset[] {
  return ALL_LAYERS.filter((a) => a.category === category).sort(
    (a, b) => a.priority - b.priority
  );
}

export function getTrustImageForCategory(category: TrustImageCategory): TrustImageAsset {
  const assets = getAssetsForCategory(category);
  const preferred = assets.find((a) => a.source === "real") ?? assets.find((a) => a.source === "ai_placeholder");
  if (!preferred) {
    throw new Error(`No trust image configured for category: ${category}`);
  }
  return preferred;
}

export function getTrustImageSrc(filename: string): string {
  return `${FACTORY_IMAGE_BASE}/${filename}`;
}
