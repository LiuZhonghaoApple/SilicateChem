import { SEO_KEYWORDS, METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { SITE } from "@/lib/constants";
import type { FAQItem, ProductAdvantage } from "@/types";

export const sodiumMetasilicateCategory = {
  name: "Sodium Metasilicate",
  path: METASILICATE_CATEGORY_PATH,
  summary:
    "Factory-direct sodium metasilicate manufacturer and supplier in Shandong, China. Granules, anhydrous, and pentahydrate grades for detergent, cleaning, and industrial chemical buyers worldwide.",
  description: [
    "Sodium metasilicate (Na₂SiO₃) is our core product line. We manufacture all grades at our Shandong facility — not through traders — with annual output exceeding 100,000 tons.",
    "Global B2B buyers source factory-direct for bulk FCL supply, consistent batch specifications, stable color, and export documentation including COA, TDS, and MSDS per shipment.",
    "Request quotation with your grade, quantity, packaging, and destination port. Response within 1–2 business days.",
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
      "Factory-direct pricing without trader intermediary margin",
      "100,000+ tons annual capacity supports recurring FCL contracts",
      "Iron content controlled at ≤ 0.02% for white detergent compatibility",
      "Export documentation (COA, TDS, MSDS) issued per shipment",
      "Combined multi-grade FCL from single manufacturer contact",
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
    { label: "Production capacity", value: SITE.capacity },
    { label: "Supply model", value: "Factory direct — manufacturer, not trader" },
    { label: "Export capability", value: "Asia, Middle East, Africa, South America" },
    { label: "QC system", value: "Batch COA — SiO₂, Na₂O, Fe ≤ 0.02%, color" },
  ],
  comparisonRows: [
    {
      factor: "Pricing",
      chinaFactory: "Factory-direct — no trader margin",
      traders: "Intermediary markup on factory cost",
      overseas: "Higher regional distribution premiums",
    },
    {
      factor: "Production capacity",
      chinaFactory: "100,000+ tons/year at single site",
      traders: "No production control",
      overseas: "Limited regional capacity",
    },
    {
      factor: "Specification control",
      chinaFactory: "In-house QC, batch COA per shipment",
      traders: "Depends on upstream factory",
      overseas: "Varies; premium for equivalent spec",
    },
    {
      factor: "Bulk FCL supply",
      chinaFactory: "Standard MOQ ~20–25 MT",
      traders: "Same source, higher price",
      overseas: "Higher per-ton cost at same volume",
    },
    {
      factor: "Export documentation",
      chinaFactory: "COA, TDS, MSDS included",
      traders: "Documentation fees common",
      overseas: "Full import documentation costs",
    },
    {
      factor: "Multi-grade orders",
      chinaFactory: "Granules + anhydrous + pentahydrate + silicate",
      traders: "Often single-SKU resellers",
      overseas: "Limited grade range per supplier",
    },
  ],
  factoryAdvantages: [
    "100,000+ tons annual production capacity across all metasilicate grades",
    "Factory-direct supply — manufacturer, not a trading company",
    "Iron content controlled at ≤ 0.02% for white detergent compatibility",
    "Batch COA, TDS, and MSDS provided per export shipment",
    "Combined FCL orders: granules + anhydrous + pentahydrate + sodium silicate",
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
      question: "Are you a manufacturer or trading company?",
      answer:
        "We are the manufacturer. Shandong Zhongzhi Chemical operates the production site and sells factory-direct to global B2B buyers.",
    },
    {
      question: "What is the MOQ for sodium metasilicate?",
      answer:
        "Typical minimum is one FCL (approximately 20–25 MT). Samples available for specification testing before volume orders.",
    },
    {
      question: "Can you provide COA and TDS?",
      answer:
        "Yes. Certificate of Analysis per batch/shipment. TDS and MSDS available on request via our contact form or at info@silicatechem.com.",
    },
  ] as FAQItem[],
  seo: SEO_KEYWORDS.sodiumMetasilicate,
  inquiryProductName: "Sodium Metasilicate",
};
