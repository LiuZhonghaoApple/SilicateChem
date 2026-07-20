import { SEO_KEYWORDS, METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import type { FAQItem, ProductAdvantage } from "@/types";

export const sodiumMetasilicateCategory = {
  name: "Sodium Metasilicate",
  path: METASILICATE_CATEGORY_PATH,
  summary:
    "Sodium metasilicate product hub covering CAS numbers, formula, available grades, powder / granule / crystal forms, specifications, applications, packing, documents and RFQ details.",
  description: [
    "Sodium metasilicate is an inorganic silicate product used in detergent, cleaning, textile, ceramic, water treatment and industrial processing applications.",
    "Buyers normally compare hydrate grade, form, Na₂O, SiO₂, Fe, particle size, appearance, packing and document availability before requesting quotation.",
    "Use this page to select anhydrous, pentahydrate, granules or inquiry-based nonahydrate requirements, then request COA, TDS, SDS / MSDS and quotation details.",
  ],
  grades: [
    {
      slug: "sodium-metasilicate-granules",
      name: "Sodium Metasilicate Granules",
      note: "Highest output — preferred for powder detergents",
    },
    {
      slug: "sodium-metasilicate-anhydrous",
      name: "Sodium Metasilicate Anhydrous",
      note: "Low moisture, high alkalinity",
    },
    {
      slug: "sodium-metasilicate-pentahydrate",
      name: "Sodium Metasilicate Pentahydrate",
      note: "Crystalline hydrate grade",
    },
  ],
  buyerDecision: {
    whyChina: [
      "Compare quotations using the same grade, packing, destination port and document requirement",
      "Confirm Na₂O, SiO₂, Fe, particle size, appearance and water insoluble matter before order",
      "Iron content controlled at ≤ 0.02% for relevant detergent-grade specifications",
      "COA, TDS, SDS / MSDS and certificate files can be requested according to order needs",
      "Combined grade inquiry can be reviewed when buyers need multiple sodium metasilicate forms",
    ],
    priceStructure: [
      "Grade: granules (highest volume / best FCL pricing), anhydrous, or pentahydrate",
      "Volume: single FCL (~20–25 MT) vs multi-container annual contracts",
      "Packaging: 25 kg / 50 kg bags vs 1,000 kg FIBC jumbo bags",
      "Shipping: FOB Shandong or CIF to destination port",
      "Specifications: particle size, screening, and purity requirements",
    ],
    moqShipping: {
      moq: "Typical MOQ: one full container load (approximately 20–25 metric tons per grade)",
      packaging: "25 kg / 50 kg woven bags with PE liner; 1,000 kg FIBC jumbo bags",
      shipping: "FOB Shandong port or CIF to destination — specify in quotation request",
      leadTime: "Standard lead time 2–4 weeks after order confirmation (volume dependent)",
    },
  },
  industryProof: [
    {
      industry: "Detergent manufacturing",
      path: "/applications/detergent-industry",
      proof: "Granule grade supply for powder and institutional detergent lines — highest production volume.",
    },
    {
      industry: "Water treatment chemicals",
      path: "/applications/water-treatment",
      proof: "Pentahydrate and granule grades for pH control blends and equipment cleaning formulations.",
    },
    {
      industry: "Textile processing",
      path: "/applications/textile-industry",
      proof: "Alkaline scouring and processing aid supply for textile chemical producers.",
    },
    {
      industry: "Paper & pulp",
      path: "/applications/paper-industry",
      proof: "Processing and cleaning applications for paper industry chemical buyers.",
    },
  ],
  trustSystem: [
    { label: "Product scope", value: "Anhydrous, pentahydrate, granules, nonahydrate by inquiry" },
    { label: "Key identifiers", value: "CAS 6834-92-0 / 10213-79-3, Na₂SiO₃" },
    { label: "Spec review", value: "Na₂O, SiO₂, Fe, particle size, appearance, insoluble matter" },
    { label: "Documents", value: "MSDS, COA, TDS, certificates and product brochure" },
  ],
  comparisonRows: [
    {
      factor: "Grade identification",
      chinaFactory: "CAS, formula and hydrate form confirmed before quotation",
      traders: "May quote by generic product name only",
      overseas: "Usually clear, but often with higher regional distribution cost",
    },
    {
      factor: "Specification review",
      chinaFactory: "Na₂O, SiO₂, Fe, particle size and appearance reviewed by grade",
      traders: "Depends on upstream source data",
      overseas: "Specification data usually available, cost may differ",
    },
    {
      factor: "Document availability",
      chinaFactory: "MSDS, COA, TDS and certificates can be requested by order",
      traders: "Document source may vary",
      overseas: "Document package depends on distributor inventory",
    },
    {
      factor: "Packing confirmation",
      chinaFactory: "25 kg bag, neutral / printed bag and jumbo bag options reviewed by RFQ",
      traders: "Packing may need re-confirmation",
      overseas: "Regional packing options may be limited",
    },
    {
      factor: "RFQ comparison",
      chinaFactory: "Compare grade, packing, quantity, destination and documents together",
      traders: "Price may omit document or packing differences",
      overseas: "Compare landed cost and lead time",
    },
    {
      factor: "Multi-grade orders",
      chinaFactory: "Granules, anhydrous, pentahydrate and sodium silicate can be reviewed together",
      traders: "Grade range depends on sourcing network",
      overseas: "Grade range depends on local inventory",
    },
  ],
  factoryAdvantages: [
    "CAS and formula information available by hydrate grade",
    "Powder, granule and crystal forms available for selected specifications",
    "Iron content controlled at ≤ 0.02% for white detergent compatibility",
    "Batch COA, TDS, SDS / MSDS and certificates available by request",
    "RFQ review can cover grade, quantity, packing, destination and documents",
  ],
  whyChoose: [
    {
      title: "Manufacturer, Not Trader",
      description:
        "All sodium metasilicate grades are produced in-house at our Shandong site. Buyers communicate directly with production and sales teams.",
    },
    {
      title: "Stable Specifications",
      description:
        "Batch testing for SiO₂, Na₂O, iron, and color consistency. Suitable for long-term supply agreements with detergent and chemical distributors.",
    },
    {
      title: "Export Reliability",
      description:
        "Experience shipping to Asia, Middle East, Africa, and South America with full export documentation and export-standard packaging.",
    },
    {
      title: "Volume Capacity",
      description:
        "Industrial-scale output supports recurring container orders and multi-grade procurement from a single factory contact.",
    },
  ] as ProductAdvantage[],
  faq: [
    {
      question: "What sodium metasilicate grades do you manufacture?",
      answer:
        "We produce granules, anhydrous, and pentahydrate at our Shandong facility. Granules account for the highest production volume. See each grade page for specifications.",
    },
    {
      question: "What CAS numbers should buyers check?",
      answer:
        "Anhydrous sodium metasilicate is commonly identified by CAS 6834-92-0. Sodium metasilicate pentahydrate is identified by CAS 10213-79-3. Confirm the CAS number against the selected grade.",
    },
    {
      question: "What is the MOQ for sodium metasilicate?",
      answer:
        "Typical minimum is one FCL (approximately 20–25 MT). Samples available for specification testing before volume orders.",
    },
    {
      question: "Can you provide COA and TDS?",
      answer:
        "Yes. COA, TDS, SDS / MSDS and certificate files can be requested with grade, quantity, packing and destination details.",
    },
  ] as FAQItem[],
  seo: SEO_KEYWORDS.sodiumMetasilicate,
  inquiryProductName: "Sodium Metasilicate",
};
