import type { IndustryApplication } from "@/types";

export const industryApplications: IndustryApplication[] = [
  {
    slug: "detergent-industry",
    title: "Sodium Metasilicate for the Detergent Industry",
    metaTitle: "Sodium Metasilicate for Detergent Manufacturing",
    metaDescription:
      "Sodium metasilicate supply for laundry and dishwashing detergent manufacturers. Granule grade, stable color, factory-direct from China.",
    primaryKeyword: "sodium metasilicate detergent industry",
    intro:
      "Detergent manufacturers are the largest buyers of sodium metasilicate globally. We supply granule, anhydrous, and pentahydrate grades factory-direct from Shandong for powder and institutional detergent production.",
    howUsed: [
      "Alkaline builder in laundry and dishwashing powder formulations",
      "Oil emulsification and soil deflocculation during wash cycles",
      "Phosphate-free and eco-label detergent builder systems",
      "Automated blending lines using free-flowing granule grade",
    ],
    benefits: [
      "Stable color and iron ≤ 0.02% for white powder detergents",
      "Uniform granule size for consistent automated dosing",
      "Factory-direct pricing without trader margin",
      "Bulk FCL supply with COA per shipment",
    ],
    productRecommendation:
      "Sodium metasilicate granules are our highest-output grade — recommended for most powder detergent lines. Anhydrous suits low-moisture dry blends.",
    recommendedGradeSlug: "sodium-metasilicate-granules",
    faq: [
      {
        question: "What grade is standard for powder detergents?",
        answer: "Granules are preferred for flow, dust control, and dissolution in automated blending equipment.",
      },
    ],
  },
  {
    slug: "water-treatment",
    title: "Sodium Metasilicate for Water Treatment",
    metaTitle: "Sodium Metasilicate for Water Treatment Chemicals",
    metaDescription:
      "Sodium metasilicate for water treatment chemical formulations. Pentahydrate and granule grades from a Chinese manufacturer.",
    primaryKeyword: "sodium metasilicate water treatment industry",
    intro:
      "Water treatment chemical producers use sodium metasilicate in pH adjustment blends, equipment cleaning formulations, and multi-component treatment packages.",
    howUsed: [
      "pH buffering in water treatment chemical blends",
      "Cleaning formulations for membranes, pipes, and equipment",
      "Dry-blend packages for field application and dosing",
      "Combined procurement with other silicate chemicals",
    ],
    benefits: [
      "Predictable dissolution with pentahydrate grade",
      "Bulk packaging: 25 kg / 50 kg bags and FIBC jumbo bags",
      "Export documentation for international distributors",
      "Single-factory supply for multiple metasilicate grades",
    ],
    productRecommendation:
      "Pentahydrate for controlled dissolution applications. Granules for dry-blend stability and bulk handling.",
    recommendedGradeSlug: "sodium-metasilicate-pentahydrate",
    faq: [
      {
        question: "Can I order multiple grades for water treatment blends?",
        answer: "Yes. Combined FCL shipments of pentahydrate, granules, and sodium silicate are supported.",
      },
    ],
  },
  {
    slug: "textile-industry",
    title: "Sodium Metasilicate for the Textile Industry",
    metaTitle: "Sodium Metasilicate for Textile Processing",
    metaDescription:
      "Sodium metasilicate for textile scouring, bleaching auxiliaries, and fabric processing. Factory supply from China.",
    primaryKeyword: "sodium metasilicate textile industry",
    intro:
      "Textile processors use sodium metasilicate in scouring, bleaching auxiliaries, and fabric preparation chemicals where controlled alkalinity supports fiber cleaning and processing.",
    howUsed: [
      "Scouring baths for natural and synthetic fibers",
      "Bleaching auxiliary formulations",
      "Degreasing and cleaning in fabric preparation",
      "Alkaline processing aids in dye house operations",
    ],
    benefits: [
      "Consistent batch specifications for process stability",
      "Multiple grades available from one manufacturer",
      "Bulk export supply for chemical distributors serving textile mills",
      "COA and TDS documentation per shipment",
    ],
    productRecommendation:
      "Pentahydrate and granule grades depending on dissolution requirements. Contact us with your process specifications.",
    recommendedGradeSlug: "sodium-metasilicate-pentahydrate",
    faq: [
      {
        question: "Do you supply distributors serving textile mills?",
        answer: "Yes. We export to chemical distributors who supply textile processing facilities in multiple regions.",
      },
    ],
  },
  {
    slug: "paper-industry",
    title: "Sodium Metasilicate for the Paper Industry",
    metaTitle: "Sodium Metasilicate for Paper & Pulp Processing",
    metaDescription:
      "Sodium metasilicate applications in paper and pulp processing. Alkaline processing aid supply from a Chinese factory.",
    primaryKeyword: "sodium metasilicate paper industry",
    intro:
      "Paper and pulp operations use sodium metasilicate as an alkaline processing aid in deinking, pulping auxiliaries, and equipment cleaning formulations within the mill chemical program.",
    howUsed: [
      "Deinking and pulping auxiliary chemicals",
      "Alkaline cleaning of paper machine equipment",
      "pH control in selected process stages",
      "Component in multi-chemical mill treatment packages",
    ],
    benefits: [
      "Industrial-scale production capacity for recurring orders",
      "Factory-direct communication on specification requirements",
      "Export packaging suitable for long-distance shipment",
      "Combined orders with detergent-grade metasilicate for distributors",
    ],
    productRecommendation:
      "Grade selection depends on your mill process. Submit your specification requirements for factory-direct quotation.",
    faq: [
      {
        question: "What is the MOQ for paper industry buyers?",
        answer: "Standard MOQ is one FCL (~20–25 MT). Volume contracts available for recurring supply.",
      },
    ],
  },
];

export function getIndustryApplicationBySlug(
  slug: string
): IndustryApplication | undefined {
  return industryApplications.find((a) => a.slug === slug);
}
