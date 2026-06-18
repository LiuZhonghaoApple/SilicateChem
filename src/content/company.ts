import { SITE } from "@/lib/constants";

export const company = {
  intro: `${SITE.company} is a sodium metasilicate manufacturer based in Shandong, China. We supply granules, anhydrous, and pentahydrate grades to detergent manufacturers, industrial chemical distributors, and water treatment companies worldwide.`,
  history: [
    `The company operates under ${SITE.company}, continuing production experience from ${SITE.formerCompany}. The rebrand reflects expanded export operations and upgraded production capacity while maintaining the same manufacturing site and technical team.`,
    "Our focus is factory-direct supply of sodium metasilicate with consistent purity, stable color, and documented batch quality. We do not operate as a trading company — all products listed on this site are manufactured at our Shandong facility.",
    `Current annual production capacity exceeds ${SITE.capacity}, with sodium metasilicate granules as the primary output line.`,
  ],
  mission:
    "Provide reliable, specification-consistent sodium metasilicate to global B2B buyers who require stable supply, transparent factory communication, and export-ready documentation.",
  values: [
    {
      title: "Production Control",
      description:
        "In-house manufacturing from raw material to finished packaging. No subcontract blending.",
    },
    {
      title: "Specification Consistency",
      description:
        "Batch testing for SiO₂, Na₂O, iron content, and color stability. COA provided per shipment.",
    },
    {
      title: "Export Reliability",
      description:
        "Experience shipping to distributors and end manufacturers in Asia, Middle East, Africa, and South America.",
    },
    {
      title: "Direct Factory Access",
      description:
        "Buyers communicate directly with production and sales teams. No intermediary markup.",
    },
  ],
  industries: [
    "Laundry and dishwashing detergent manufacturers",
    "Industrial cleaning compound producers",
    "Water treatment chemical companies",
    "Ceramic and refractory material processors",
    "Global chemical importers and distributors",
  ],
};

export const factory = {
  overview:
    "Our Shandong production facility operates dedicated lines for sodium metasilicate granules, anhydrous, pentahydrate, and sodium silicate. The site is built for continuous bulk output with in-process quality checks at granulation, drying, and packaging stages.",
  capacity: SITE.capacity,
  processes: [
    {
      step: "01",
      title: "Raw Material Intake",
      description:
        "Sodium carbonate and silica sand are received, tested, and stored under controlled conditions before entering production.",
    },
    {
      step: "02",
      title: "Fusion & Reaction",
      description:
        "High-temperature fusion produces sodium silicate melt, which is converted to metasilicate through controlled reaction parameters.",
    },
    {
      step: "03",
      title: "Granulation & Drying",
      description:
        "Granule lines produce uniform particle size with moisture control. Anhydrous grades pass through dedicated drying equipment.",
    },
    {
      step: "04",
      title: "Screening & QC Testing",
      description:
        "Each batch is screened for particle size distribution and tested for chemical composition, iron content, and color consistency.",
    },
    {
      step: "05",
      title: "Packaging & Export Prep",
      description:
        "Products are packed in export-standard bags with PE liners. Palletizing, labeling, and documentation prepared per buyer requirements.",
    },
  ],
  quality: [
    "In-process testing at each production stage",
    "Certificate of Analysis (COA) per batch/shipment",
    "Iron content control for white detergent compatibility",
    "Particle size screening with customizable mesh ranges",
    "Batch traceability from raw material lot to finished bag",
  ],
  equipment: [
    "Fusion furnaces for silicate melt production",
    "Granulation and spray-drying lines",
    "Anhydrous drying systems",
    "Pentahydrate crystallization units",
    "Automated bagging and palletizing equipment",
    "On-site laboratory for composition analysis",
  ],
};
