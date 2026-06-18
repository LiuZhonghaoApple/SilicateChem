import type { IntentGuide } from "@/types";

/** Layer 3 — commercial-intent guides only. Each page pushes to /products/sodium-metasilicate */
export const intentGuides: IntentGuide[] = [
  {
    slug: "supplier-selection",
    title: "How to Select a Sodium Metasilicate Supplier",
    metaTitle: "Sodium Metasilicate Supplier Selection — B2B Procurement Guide",
    metaDescription:
      "Procurement checklist for choosing a sodium metasilicate supplier: verify manufacturer, capacity, COA, samples, and export support before FCL orders.",
    primaryKeyword: "sodium metasilicate supplier selection",
    intro:
      "B2B buyers evaluating sodium metasilicate suppliers must verify manufacturing capability, specification consistency, and export documentation — not only compare quoted prices. This guide covers the procurement decisions that affect long-term supply reliability.",
    sections: [
      {
        heading: "Manufacturer vs Trading Company",
        paragraphs: [
          "Request production license, factory photos, and video inspection. Manufacturers explain granulation capacity, lead times, and batch QC from production schedules. Trading companies resell without controlling quality.",
          "Factory-direct supply from Shandong Zhongzhi Chemical eliminates intermediary markup and gives buyers direct access to specification control.",
        ],
      },
      {
        heading: "Pre-Order Verification Checklist",
        paragraphs: [
          "Before volume contracts: request TDS, MSDS, sample COA, and test samples in your application. Confirm iron content, particle size, and color stability match your formulation requirements.",
          "For recurring FCL orders, confirm annual capacity supports your volume — 100,000+ tons indicates scale for detergent and chemical distributor contracts.",
        ],
      },
    ],
    faq: [
      {
        question: "What documents should I request before ordering?",
        answer: "TDS, MSDS, sample COA, and a test sample. Verify iron content and particle size for your grade.",
      },
      {
        question: "What is typical MOQ from a Chinese manufacturer?",
        answer: "One FCL (approximately 20–25 MT) is standard. Samples available for pre-order testing.",
      },
    ],
  },
  {
    slug: "price-factors",
    title: "Sodium Metasilicate Price Factors — Factory Quotation Guide",
    metaTitle: "Sodium Metasilicate Price Factors — What Affects Factory Quotations",
    metaDescription:
      "Industrial factors affecting sodium metasilicate pricing: grade, volume, packaging, shipping terms, and factory-direct vs trader supply.",
    primaryKeyword: "sodium metasilicate price factors",
    intro:
      "Sodium metasilicate quotations vary by grade, order volume, packaging, and shipping terms. Understanding factory pricing structure helps procurement teams compare offers accurately and avoid hidden trader margins.",
    sections: [
      {
        heading: "What Drives Factory-Direct Pricing",
        paragraphs: [
          "Grade selection (granules, anhydrous, pentahydrate) affects raw material processing and production allocation. Granules account for highest output and typically offer the most competitive per-ton pricing at FCL volume.",
          "Order volume is the primary cost driver: single FCL vs multi-container annual contracts. Packaging (25 kg bags vs FIBC jumbo bags) and destination port (FOB vs CIF) also affect landed cost.",
        ],
      },
      {
        heading: "Factory vs Trader Pricing",
        paragraphs: [
          "Trading companies add intermediary margin without controlling batch quality. Factory-direct quotations from Shandong include production cost, packaging, and export documentation — without trader markup.",
          "Request quotations with identical specifications (grade, packaging, Incoterms, destination) when comparing suppliers.",
        ],
      },
    ],
    faq: [
      {
        question: "Why do sodium metasilicate prices vary between suppliers?",
        answer: "Grade, volume, packaging, shipping terms, and whether the supplier is a manufacturer or trader all affect quoted price.",
      },
    ],
  },
  {
    slug: "uses-detergent",
    title: "Sodium Metasilicate Uses in Detergent Manufacturing",
    metaTitle: "Sodium Metasilicate Uses in Detergent Industry — Buyer Guide",
    metaDescription:
      "How detergent manufacturers use sodium metasilicate as an alkaline builder. Grade selection, procurement volume, and factory-direct supply from China.",
    primaryKeyword: "sodium metasilicate uses detergent industry",
    intro:
      "Detergent manufacturers are the largest buyers of sodium metasilicate globally. Granule grade is standard for powder detergent blending lines — providing alkalinity, oil emulsification, and soil deflocculation in phosphate-free formulations.",
    sections: [
      {
        heading: "Builder Function in Powder Detergents",
        paragraphs: [
          "Sodium metasilicate provides buffering alkalinity that boosts surfactant performance. It emulsifies greasy soils and prevents redeposition during wash cycles — critical in institutional and laundry powder formulations.",
          "Granule grade offers uniform particle size, controlled dust levels, and predictable dissolution for automated blending equipment.",
        ],
      },
      {
        heading: "Procurement for Detergent Plants",
        paragraphs: [
          "Verify iron content ≤ 0.02% for white powder compatibility. Confirm batch color consistency and COA per shipment before volume contracts.",
          "Factory-direct FCL supply from a Chinese manufacturer reduces cost versus EU/US distribution channels at equivalent specifications.",
        ],
      },
    ],
    faq: [
      {
        question: "Which grade do detergent manufacturers use most?",
        answer: "Granules are the standard export grade for powder detergent production.",
      },
    ],
  },
  {
    slug: "sodium-metasilicate-vs-soda-ash",
    title: "Sodium Metasilicate vs Soda Ash — Procurement Comparison",
    metaTitle: "Sodium Metasilicate vs Soda Ash (Sodium Carbonate) — Buyer Comparison",
    metaDescription:
      "Compare sodium metasilicate and soda ash as alkaline builders for detergents and industrial cleaning. When to choose metasilicate for B2B procurement.",
    primaryKeyword: "sodium metasilicate vs soda ash",
    intro:
      "Procurement teams comparing alkaline builders evaluate sodium metasilicate against soda ash (sodium carbonate). Both raise pH, but metasilicate adds silicate activity for emulsification and anti-redeposition beyond simple alkalinity.",
    sections: [
      {
        heading: "Performance Differences",
        paragraphs: [
          "Soda ash provides carbonate alkalinity. Sodium metasilicate combines alkalinity with silicate effects — stronger cleaning performance in heavy-duty and institutional detergent systems.",
          "Metasilicate typically delivers higher builder performance per unit in phosphate-free formulations, though total formulation cost must be evaluated.",
        ],
      },
      {
        heading: "When to Procure Metasilicate",
        paragraphs: [
          "Choose sodium metasilicate when emulsification, silicate buffering, and builder performance beyond carbonate alkalinity are required — standard in powder detergents and industrial degreasers.",
        ],
      },
    ],
    faq: [
      {
        question: "Can metasilicate replace soda ash in detergents?",
        answer: "Partial or full replacement depends on formulation targets. Many phosphate-free detergents use metasilicate as the primary builder.",
      },
    ],
  },
  {
    slug: "how-to-choose-china-factory",
    title: "How to Choose a Sodium Metasilicate Factory in China",
    metaTitle: "How to Choose a Sodium Metasilicate Factory in China — Verification Guide",
    metaDescription:
      "Verify a Chinese sodium metasilicate factory: production capacity, QC system, export documentation, and factory-direct supply vs trading companies.",
    primaryKeyword: "how to choose sodium metasilicate factory china",
    intro:
      "Selecting a reliable Chinese sodium metasilicate factory requires on-site or video verification of production capability, QC processes, and export experience — not just comparing email quotations.",
    sections: [
      {
        heading: "Factory Verification Steps",
        paragraphs: [
          "Confirm the supplier operates the production site: request business license, production photos, and video walkthrough of granulation and packaging lines.",
          "Evaluate QC capability: batch testing for SiO₂, Na₂O, iron, and color. Request historical COA samples for specification consistency review.",
        ],
      },
      {
        heading: "Export and Volume Capability",
        paragraphs: [
          "For FCL contracts, confirm annual capacity (100,000+ tons supports volume buyers). Verify export documentation experience to your destination market.",
          "Factory-direct orders from Shandong Zhongzhi Chemical include COA, TDS, and MSDS per shipment with combined multi-grade FCL options.",
        ],
      },
    ],
    faq: [
      {
        question: "How do I verify a manufacturer vs trader?",
        answer: "Request factory photos, production license, video inspection, and batch COA with production traceability.",
      },
    ],
  },
];

export function getIntentGuideBySlug(slug: string): IntentGuide | undefined {
  return intentGuides.find((g) => g.slug === slug);
}
