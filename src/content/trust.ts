import { SITE } from "@/lib/constants";

export const TRUST_PRIMARY_MESSAGE =
  "We are a real sodium metasilicate manufacturer in China with stable production and export capability.";

export const factoryTrustPillars = [
  {
    title: "100,000+ Tons Annual Capacity",
    description:
      "Industrial-scale granulation and drying lines at our Shandong facility support recurring FCL contracts for detergent and chemical distributors.",
  },
  {
    title: "Factory Direct Manufacturer",
    description:
      "Shandong Zhongzhi Chemical operates the production site. No trading layer — buyers communicate with the manufacturer for specifications, COA, and shipment scheduling.",
  },
  {
    title: "Export Experience",
    description:
      "Export shipments to Asia, Middle East, Africa, and South America. Commercial invoice, packing list, COA, and Bill of Lading prepared per container.",
  },
  {
    title: "Production Stability",
    description:
      "Batch-to-batch consistency for SiO₂, Na₂O, iron content, and color. Production schedules allocated for repeat volume buyers to reduce supply interruption risk.",
  },
  {
    title: "Quality Control System",
    description:
      "In-house laboratory testing before release. Each export batch tested for key specifications; Certificate of Analysis issued per shipment.",
  },
  {
    title: "Packaging & Logistics",
    description:
      "25 kg / 50 kg woven bags with PE liner or 1,000 kg FIBC jumbo bags. FOB Shandong or CIF to destination port. Container loading supervised at factory warehouse.",
  },
] as const;

export const factoryProofImages = [
  {
    filename: "production-line.jpg",
    alt: "Sodium metasilicate production line at Shandong manufacturing facility",
    caption: "Production Line",
    description: "Granulation and drying equipment for sodium metasilicate grades.",
  },
  {
    filename: "lab-qc.jpg",
    alt: "Laboratory QC testing for sodium metasilicate batch specifications",
    caption: "Laboratory QC",
    description: "Batch testing for SiO₂, Na₂O, iron, and color before export release.",
  },
  {
    filename: "packaging.jpg",
    alt: "Sodium metasilicate packaging and warehouse storage at China factory",
    caption: "Packaging & Warehouse",
    description: "Bagged and palletized stock ready for container loading.",
  },
  {
    filename: "export-loading.jpg",
    alt: "Sodium metasilicate export container loading at Shandong port logistics",
    caption: "Export Loading",
    description: "FCL container loading with export documentation for international buyers.",
  },
] as const;

export const buyerConfidencePoints = [
  {
    title: "Why Global Buyers Source from Chinese Manufacturers",
    description:
      "China accounts for the majority of global sodium metasilicate production capacity. Factory-direct supply from Shandong offers lower per-ton cost at equivalent specifications versus EU or US distribution channels.",
  },
  {
    title: "Stable Quality Across Batches",
    description:
      "Detergent and chemical buyers require consistent iron content and color for white powder formulations. Our QC process monitors these parameters on every production run before release.",
  },
  {
    title: "Bulk Supply Reliability",
    description:
      `${SITE.capacity} annual output supports multi-container contracts. Granules, anhydrous, and pentahydrate available from one manufacturing contact for simplified procurement.`,
  },
  {
    title: "Export Documentation",
    description:
      "COA per batch/shipment. TDS and MSDS provided per product grade on request. Documentation package prepared for customs clearance at destination port.",
  },
  {
    title: "MOQ & Sample Flexibility",
    description:
      "Standard MOQ: one FCL (approximately 20–25 MT). Test samples available for specification verification in your formulation before volume commitment.",
  },
] as const;
