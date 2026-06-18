import { SITE } from "@/lib/constants";
import { REAL_ASSETS, FACTORY_IMAGE_BASE } from "@/lib/trust/image-strategy";

export type FactoryTrustItem = {
  title: string;
  description: string;
};

export type FactoryTrustSectionContent = {
  id: string;
  title: string;
  subtitle: string;
  items: readonly FactoryTrustItem[];
};

export const manufacturingCapability: FactoryTrustSectionContent = {
  id: "manufacturing-capability",
  title: "Manufacturing Capability",
  subtitle: `${SITE.capacity} annual output with stable granulation, drying, and batch release for recurring FCL contracts.`,
  items: [
    {
      title: "100,000+ Tons Annual Capacity",
      description:
        "Industrial-scale sodium metasilicate production at our Shandong site supports multi-container contracts for detergent manufacturers and chemical distributors worldwide.",
    },
    {
      title: "Production Stability",
      description:
        "Dedicated lines for granules, anhydrous, and pentahydrate with scheduled output allocation for repeat volume buyers to reduce supply interruption risk.",
    },
    {
      title: "Batch Consistency System",
      description:
        "Batch-to-batch control for SiO₂, Na₂O, iron content, and color. Production parameters logged and reviewed before each export release.",
    },
  ],
};

export const factoryInfrastructure: FactoryTrustSectionContent = {
  id: "factory-infrastructure",
  title: "Factory Infrastructure",
  subtitle: "On-site production, storage, packaging, and laboratory facilities at a single manufacturing campus.",
  items: [
    {
      title: "Production Lines",
      description:
        "Fusion furnaces, granulation and spray-drying equipment, and anhydrous drying systems for continuous bulk output.",
    },
    {
      title: "Warehouse System",
      description:
        "Climate-controlled raw material storage and finished-goods warehousing with batch segregation and FIFO dispatch.",
    },
    {
      title: "Packaging Facility",
      description:
        "25 kg / 50 kg woven bags with PE liner and 1,000 kg FIBC jumbo bags. Automated bagging, palletizing, and export labeling.",
    },
    {
      title: "QC Laboratory",
      description:
        "On-site laboratory for composition analysis, particle size screening, iron content, and color verification before shipment.",
    },
  ],
};

export const exportCapability: FactoryTrustSectionContent = {
  id: "export-capability",
  title: "Export Capability",
  subtitle: "Factory-prepared export documentation and logistics coordination for international B2B buyers.",
  items: [
    {
      title: "Global Shipping Regions",
      description:
        "Export experience to Asia, Middle East, Africa, South America, and selected European markets. FOB Shandong or CIF to destination port.",
    },
    {
      title: "Documentation Support",
      description:
        "Certificate of Analysis (COA) per batch/shipment. Technical Data Sheets (TDS) and Material Safety Data Sheets (MSDS) provided per product grade on request.",
    },
    {
      title: "Container Loading",
      description:
        "FCL container loading supervised at factory warehouse. Commercial invoice, packing list, and Bill of Lading prepared per shipment.",
    },
  ],
};

export const qualityControlSystem: FactoryTrustSectionContent = {
  id: "quality-control-system",
  title: "Quality Control System",
  subtitle: "In-process and final-release testing before any export batch leaves the facility.",
  items: [
    {
      title: "Lab Testing Process",
      description:
        "Each production batch tested for chemical composition, moisture, iron content, and color consistency against buyer specifications.",
    },
    {
      title: "Raw Material Inspection",
      description:
        "Sodium carbonate and silica sand received, sampled, and approved before entering fusion and reaction stages.",
    },
    {
      title: "Final Product QA",
      description:
        "Screening, bag weight checks, and COA issuance before palletizing. Batch traceability from raw material lot to finished bag.",
    },
  ],
};

export const factoryTrustSections = [
  manufacturingCapability,
  factoryInfrastructure,
  exportCapability,
  qualityControlSystem,
] as const;

export const factoryGalleryImages = REAL_ASSETS.map((asset) => ({
  category: asset.sectionLabel,
  filename: asset.filename,
  alt: asset.alt,
  caption: asset.caption,
  description: asset.description,
}));

export const FACTORY_IMAGE_PATH = FACTORY_IMAGE_BASE;
