import type { IntentGuide } from "@/types";
/** Layer 3 — commercial-intent guides only. Each page pushes to /products/sodium-metasilicate */
export const intentGuides: IntentGuide[] = [
  {
    slug: "supplier-selection",
    title: "How to Select a Sodium Metasilicate Supplier or Distributor",
    metaTitle: "Sodium Metasilicate Supplier — China Factory",
    metaDescription:
      "How to verify a metasilicate supplier: COA checks (SiO₂, Na₂O, Fe ≤0.02%), manufacturer vs trader, FCL terms. ISO 9001 Shandong export factory.",
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
    metaTitle: "Sodium Metasilicate in Detergent — Dosage",
    metaDescription:
      "Which grade for powder detergent: granules vs anhydrous, alkalinity, dosing and dissolution. Specs and FCL supply from an ISO 9001 Shandong factory.",
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
  {
    slug: "pentahydrate-vs-anhydrous",
    title: "Sodium Metasilicate Pentahydrate vs Anhydrous — Which Grade to Buy",
    metaTitle: "Pentahydrate vs Anhydrous Sodium Metasilicate for Buyers",
    metaDescription:
      "Compare sodium metasilicate pentahydrate (Na₂SiO₃·5H₂O) and anhydrous (Na₂SiO₃) for procurement: active content, water of crystallization, dissolution, moisture handling, and how to choose the right grade for your formulation.",
    primaryKeyword: "sodium metasilicate pentahydrate vs anhydrous",
    keywords: [
      "anhydrous vs pentahydrate sodium metasilicate",
      "which sodium metasilicate grade to buy",
      "sodium metasilicate grade selection",
    ],
    intro:
      "Procurement teams sourcing sodium metasilicate must choose between the anhydrous grade (Na₂SiO₃, CAS 6834-92-0) and the pentahydrate grade (Na₂SiO₃·5H₂O, CAS 10213-79-3). Both are alkaline silicate builders, but they differ in active content, water of crystallization, dissolution behavior, and moisture handling. This guide explains the specification differences so buyers pick the grade that matches their formulation rather than defaulting to the cheapest quote.",
    sections: [
      {
        heading: "Key Specification Differences",
        paragraphs: [
          "The decisive difference is water of crystallization. Anhydrous sodium metasilicate carries high actives — SiO₂ ≥ 46.0% and Na₂O ≥ 50.0% — at molecular weight 122.06 g/mol. The pentahydrate binds five water molecules per unit (MW 212.14 g/mol), so on a mass basis its actives are lower: SiO₂ ≥ 28.5% and Na₂O ≥ 29.0%. Roughly half the pentahydrate's weight is bound water.",
          "Both grades share Fe ≤ 0.02%, supporting color stability in white and light-colored end products. Because the actives differ, the correct comparison between a quotation for each grade is cost per unit of active alkalinity delivered, not price per ton of material.",
        ],
      },
      {
        heading: "Handling and Dissolution",
        paragraphs: [
          "Anhydrous sodium metasilicate is a low-moisture grade (moisture ≤ 1.0%) supplied as white powder or fine granules, selected for dry-blend systems where introducing water should be minimized and where high alkalinity per ton matters — high-alkalinity detergents, industrial degreasing, and dry chemical blends. Keep it sealed and dry to avoid moisture absorption.",
          "Pentahydrate is a white crystalline granule or powder whose bound water gives controlled, predictable dissolution. It is commonly specified for cleaning products, textile scouring and bleaching auxiliaries, water-treatment blends, and metal-cleaning preparations where dissolution behavior is more important than maximum actives per ton.",
        ],
      },
      {
        heading: "How to Choose Between Them",
        paragraphs: [
          "Choose anhydrous when you need maximum alkalinity per ton, a low-moisture material for dry blending, or the most freight-efficient way to ship active silicate — since you are not paying to ship bound water.",
          "Choose pentahydrate when your formulation specifies the hydrate grade, when controlled dissolution is required, or when your process was validated on crystalline material. When sending an RFQ, state the grade, CAS number, target actives, particle size or appearance, packing, and destination port so quotations are directly comparable.",
        ],
      },
    ],
    faq: [
      {
        question: "Is anhydrous or pentahydrate sodium metasilicate cheaper to use?",
        answer:
          "Compare on cost per unit of active alkalinity, not price per ton. Anhydrous carries higher actives (SiO₂ ≥ 46.0% / Na₂O ≥ 50.0%) than pentahydrate (SiO₂ ≥ 28.5% / Na₂O ≥ 29.0%), because about half the pentahydrate's mass is water of crystallization.",
      },
      {
        question: "Can I substitute one grade for the other?",
        answer:
          "Only after adjusting dosage for the active-content difference and validating dissolution in your process. Anhydrous suits low-moisture dry blends; pentahydrate suits formulations specifying controlled dissolution or the hydrate grade.",
      },
      {
        question: "Which grade ships more efficiently?",
        answer:
          "Anhydrous delivers more active silicate per ton, so you are not paying freight on bound water. Pentahydrate is preferred where the formulation or process requires the crystalline hydrate form.",
      },
    ],
  },
  {
    slug: "granular-vs-powder",
    title: "Sodium Metasilicate Granular vs Powder — Which Form to Buy",
    metaTitle: "Granular vs Powder Sodium Metasilicate for Buyers",
    metaDescription:
      "Compare granular and powder sodium metasilicate for procurement: same chemistry, different particle size. How form affects dust, dosing, dissolution, and blending — and how to specify mesh size in your RFQ.",
    primaryKeyword: "sodium metasilicate granular vs powder",
    keywords: [
      "sodium metasilicate granules vs powder",
      "sodium metasilicate particle size selection",
      "sodium metasilicate mesh size RFQ",
    ],
    intro:
      "Buyers often ask whether to order sodium metasilicate as granules or as powder. This is a physical-form decision, not a chemistry change — both forms carry the same alkaline actives — so the right choice depends on how the material is handled, dosed, and dissolved in your process. This guide explains how particle size affects handling and blending, and how to specify the form in your RFQ.",
    sections: [
      {
        heading: "Same Chemistry, Different Particle Size",
        paragraphs: [
          "Granular and powder sodium metasilicate share the same specification actives: SiO₂ ≥ 46.0%, Na₂O ≥ 50.0%, and Fe ≤ 0.02%. What differs is particle size and flow. Granules are supplied free-flowing at a defined mesh range — for example 8–40 mesh, customizable — while powder is a finer form (the anhydrous grade is supplied as white powder or fine granules).",
          "Because the chemistry is identical, quotations for the two forms should be compared on the same active specification and packing; the meaningful difference is handling behavior on your line, not builder performance per unit.",
        ],
      },
      {
        heading: "Handling, Dust and Dosing",
        paragraphs: [
          "Granular form supports cleaner handling, easier dosing, and reduced dust compared with fine powder. Uniform granules give controlled dust levels and predictable dissolution for automated blending equipment — the reason granules are the standard export form for powder-detergent blending lines.",
          "A finer powder increases surface area, which can speed dissolution, but tends to generate more dust and can be harder to meter in automated equipment. Where operators handle open material or where dust control matters, the granular form is usually preferred.",
        ],
      },
      {
        heading: "How to Specify Form in Your RFQ",
        paragraphs: [
          "State the target mesh size or particle-size range, the required actives (SiO₂, Na₂O, Fe), packing method, loading quantity, destination port, and required documents. For granules, confirm the mesh range against your dosing and blending equipment; for powder, confirm handling and dust-control requirements.",
          "Request appearance, whiteness, and Fe review before order confirmation when the material goes into white or light-colored end products, and ask for a sample in your own application before volume contracts.",
        ],
      },
    ],
    faq: [
      {
        question: "Is granular or powder sodium metasilicate better?",
        answer:
          "Neither is chemically better — they share the same actives (SiO₂ ≥ 46.0% / Na₂O ≥ 50.0% / Fe ≤ 0.02%). Granules give cleaner handling, less dust, and easier dosing for automated blending; finer powder offers more surface area for faster dissolution but more dust.",
      },
      {
        question: "Which form do powder-detergent plants use?",
        answer:
          "Granules are the standard export form for powder-detergent blending lines, because uniform particle size gives controlled dust and predictable dissolution in automated equipment.",
      },
      {
        question: "What should I specify in the RFQ for form?",
        answer:
          "Target mesh size or particle-size range (e.g. 8–40 mesh for granules), actives (SiO₂/Na₂O/Fe), packing, loading quantity, destination port, and documents. Request a sample in your application before volume orders.",
      },
    ],
  },
];

export function getIntentGuideBySlug(slug: string): IntentGuide | undefined {
  return intentGuides.find((g) => g.slug === slug);
}
