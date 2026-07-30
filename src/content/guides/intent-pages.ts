import type { IntentGuide } from "@/types";
/** Layer 3 — commercial-intent guides only. Each page pushes to /products/sodium-metasilicate */
export const intentGuides: IntentGuide[] = [
  {
    slug: "supplier-selection",
    title: "How to Select a Sodium Metasilicate Supplier or Distributor",
    metaTitle: "Sodium Metasilicate Supplier & Distributor Selection Guide",
    metaDescription:
      "Buyer's decision framework for choosing a sodium metasilicate supplier or distributor: how to read the COA, match grade specification to your application, verify manufacturer vs trader, and compare quotations before FCL orders.",
    primaryKeyword: "sodium metasilicate supplier selection",
    keywords: [
      "sodium metasilicate supplier",
      "sodium metasilicate distributor",
      "sodium metasilicate supplier China",
      "sodium metasilicate factory",
      "sodium metasilicate RFQ",
    ],
    intro:
      "B2B buyers evaluating a sodium metasilicate supplier or distributor should assess grade specification, COA readiness, document control, packing, and shipment reliability before comparing prices. This guide gives procurement teams a repeatable decision framework — what to verify, which COA indicators matter, and how to match grade to application — so the lowest quote is not mistaken for the best-value supply.",
    sections: [
      {
        heading: "Supplier Evaluation Framework",
        paragraphs: [
          "Score every candidate on five dimensions before price: (1) specification control — can they commit to a written spec per grade; (2) document readiness — MSDS/SDS, ISO and REACH certificates, TDS and batch-specific COA; (3) grade availability — granules, anhydrous, and pentahydrate from one source simplifies multi-grade FCL; (4) packing and loading options; and (5) shipment communication and repeatability across orders.",
          "A supplier that scores well on specification and documents but is slightly higher on unit price is usually the lower total-cost choice, because rejected batches, re-testing, and formulation adjustments cost more than the quote gap. Rank candidates on these dimensions first, then compare price among the qualified shortlist only.",
        ],
      },
      {
        heading: "How to Read the COA Before You Order",
        paragraphs: [
          "The certificate of analysis is where specification claims become verifiable. For sodium metasilicate, check these indicators against your application: SiO₂ and Na₂O content (the alkaline builder actives), Fe content, water-insoluble matter, appearance, and — for hydrate grades — the correct CAS number.",
          "Anhydrous and granular sodium metasilicate typically carry SiO₂ ≥ 46.0% and Na₂O ≥ 50.0% with Fe ≤ 0.02%; the pentahydrate grade (Na₂SiO₃·5H₂O, CAS 10213-79-3) carries lower actives — SiO₂ ≥ 28.5% and Na₂O ≥ 29.0% — because roughly half its mass is water of crystallization. Comparing a pentahydrate COA against an anhydrous spec sheet without normalizing for this difference is the most common buyer error.",
          "Iron is the indicator to watch for any white or light-colored end product: Fe ≤ 0.02% supports color stability in white detergent powders. For granular grades, confirm the particle-size range (for example 8–40 mesh, customizable) suits your dosing equipment, and for anhydrous grades confirm moisture ≤ 1.0% for dry-blend stability.",
        ],
      },
      {
        heading: "Match Grade Specification to Your Application",
        paragraphs: [
          "Powder-detergent and dry-blend lines usually specify anhydrous or granular metasilicate for high alkalinity and low moisture; granules add cleaner handling, controlled dust, and predictable dissolution for automated blending. Cleaning products, textile auxiliaries, and water-treatment blends more often specify the pentahydrate crystalline grade where controlled dissolution is preferred.",
          "Confirm the grade against the same specification, packing method, Incoterms, destination port, and required documents when you send an RFQ, so quotations from different suppliers are directly comparable rather than superficially cheaper.",
        ],
      },
      {
        heading: "Verify Manufacturer vs Trader",
        paragraphs: [
          "Ask whether the supplier controls batch testing for SiO₂, Na₂O, iron, and color, and request historical COA samples to check specification consistency across batches — a genuine manufacturer can supply these; a pure trader often cannot. Confirm whether batch COA records can be provided across recurring shipments, not just for the first order.",
          "For recurring FCL contracts, confirm grade availability, lead time, packing and loading method, loading quantity, export-document experience to your destination market, and whether combined multi-grade FCL loading is possible.",
        ],
      },
    ],
    faq: [
      {
        question: "What documents should I request before ordering?",
        answer:
          "TDS, MSDS/SDS, ISO and REACH certificates, a sample batch COA, and a test sample in your own application. Verify SiO₂, Na₂O, iron content, and particle size for your selected grade.",
      },
      {
        question: "Which COA indicators matter most for sodium metasilicate?",
        answer:
          "SiO₂ and Na₂O content (the alkaline actives), Fe content (≤ 0.02% supports white-product color stability), water-insoluble matter, appearance, and the correct CAS number for the grade. Normalize actives when comparing an anhydrous grade against pentahydrate.",
      },
      {
        question: "How do I tell a manufacturer from a trader?",
        answer:
          "Request business credentials, in-house batch-testing evidence for SiO₂/Na₂O/Fe/color, and historical COA samples across batches. A manufacturer can commit to a written per-grade specification and repeat batch COA across shipments.",
      },
      {
        question: "What is typical MOQ from a Chinese manufacturer?",
        answer: "One FCL (approximately 20–25 MT) is standard. Samples are available for pre-order testing.",
      },
    ],
  },
  {
    slug: "price-factors",
    title: "Sodium Metasilicate Price Factors — Factory Quotation Guide",
    metaTitle: "Sodium Metasilicate Price & Quotation Factors",
    metaDescription:
      "Industrial factors affecting sodium metasilicate pricing: grade, volume, packaging, loading method, shipping terms, documents, and destination port.",
    primaryKeyword: "sodium metasilicate price factors",
    keywords: [
      "sodium metasilicate price",
      "sodium metasilicate quotation",
      "sodium metasilicate supplier quote",
    ],
    intro:
      "Sodium metasilicate quotations vary by grade, order volume, packaging, loading method, required documents, and shipping terms. Understanding these variables helps procurement teams compare offers accurately.",
    sections: [
      {
        heading: "What Drives Sodium Metasilicate Pricing",
        paragraphs: [
          "Grade selection (granules, anhydrous, pentahydrate) affects raw material processing and production allocation. Granules account for highest output and typically offer the most competitive per-ton pricing at FCL volume.",
          "Order volume is the primary cost driver: single FCL vs multi-container annual contracts. Packaging (25 kg bags vs FIBC jumbo bags) and destination port (FOB vs CIF) also affect landed cost.",
        ],
      },
      {
        heading: "How to Compare Quotations",
        paragraphs: [
          "Request quotations with identical grade, specification, packaging, Incoterms, destination port, loading plan, and document requirements when comparing suppliers.",
          "A lower price may not be comparable if it excludes certificate files, batch COA, pallet requirements, inland cost, export handling, or the preferred loading method.",
        ],
      },
    ],
    faq: [
      {
        question: "Why do sodium metasilicate prices vary between suppliers?",
        answer: "Grade, volume, packaging, shipping terms, loading method, document requirements, and destination port all affect quoted price.",
      },
    ],
  },
  {
    slug: "uses-detergent",
    title: "Sodium Metasilicate Uses in Detergent Manufacturing",
    metaTitle: "Sodium Metasilicate for Detergent Buyers",
    metaDescription:
      "How detergent manufacturers use sodium metasilicate as an alkaline builder. Grade selection, granules, specifications, packing, and RFQ information.",
    primaryKeyword: "sodium metasilicate uses detergent industry",
    keywords: [
      "sodium metasilicate detergent supplier",
      "sodium metasilicate granules quote",
      "detergent grade sodium metasilicate",
    ],
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
          "For FCL procurement, compare suppliers using the same grade, particle size, packing method, destination port, and required documents.",
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
    metaTitle: "Sodium Metasilicate vs Soda Ash for Buyers",
    metaDescription:
      "Compare sodium metasilicate and soda ash as alkaline builders for detergents and industrial cleaning. When to choose metasilicate for B2B procurement.",
    primaryKeyword: "sodium metasilicate vs soda ash",
    keywords: [
      "buy sodium metasilicate for detergent",
      "sodium metasilicate supplier comparison",
    ],
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
    metaTitle: "Choose a Sodium Metasilicate Factory in China",
    metaDescription:
      "Review a Chinese sodium metasilicate supply source: grade specification, QC documents, packing, loading, export documents, and quotation requirements.",
    primaryKeyword: "how to choose sodium metasilicate factory china",
    keywords: [
      "sodium metasilicate manufacturer China",
      "sodium metasilicate exporter China",
      "sodium metasilicate factory quotation",
    ],
    intro:
      "Selecting a reliable Chinese sodium metasilicate supply source requires more than comparing email quotations. Buyers should verify product specification control, document readiness, packing options, and shipment communication before FCL orders.",
    sections: [
      {
        heading: "Supplier Verification Steps",
        paragraphs: [
          "Request business license, company credentials, product photos, packing references, and a video or photo review when needed.",
          "Evaluate QC capability: batch testing for SiO₂, Na₂O, iron, and color. Request historical COA samples for specification consistency review.",
        ],
      },
      {
        heading: "Shipment and Document Review",
        paragraphs: [
          "For FCL contracts, confirm lead time, packing method, container loading plan, and export documentation experience to your destination market.",
          "Ask whether COA, TDS, MSDS, certificate files, and combined multi-grade FCL options can be confirmed before order placement.",
        ],
      },
    ],
    faq: [
      {
        question: "How do I verify a manufacturer vs trader?",
        answer: "Request business credentials, production or packing evidence, sample COA, MSDS, TDS, and a clear explanation of grade specification and loading plan.",
      },
    ],
  },
];

export function getIntentGuideBySlug(slug: string): IntentGuide | undefined {
  return intentGuides.find((g) => g.slug === slug);
}
