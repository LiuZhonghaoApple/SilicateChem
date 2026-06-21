import type { FAQItem } from "@/types";
import { SITE } from "@/lib/constants";

export const faqItems: FAQItem[] = [
  {
    question: "What is your main sodium metasilicate product?",
    answer:
      "Sodium metasilicate granules are our primary production and export grade. This product line receives the highest output volume from our Shandong factory and is supplied to detergent manufacturers and chemical distributors worldwide.",
  },
  {
    question: "What is your annual production capacity?",
    answer:
      "Our facility has an annual production capacity exceeding 100,000 tons across all sodium metasilicate and sodium silicate product lines. Granule production accounts for the largest share of output.",
  },
  {
    question: "Do you sell factory-direct or through traders?",
    answer:
      "We are the manufacturer. All products are produced at our Shandong facility and sold factory-direct. We do not source from third-party factories or operate as a trading company.",
  },
  {
    question: "What packaging options are available?",
    answer:
      "Standard packaging includes 25 kg and 50 kg woven bags with PE liners, and 1,000 kg jumbo bags (FIBC). Custom labeling and pallet configurations are available for export orders.",
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer:
      "MOQ depends on product grade and destination. For granules, we typically accept orders from one full container (approximately 20–25 tons). Sample quantities are available for specification evaluation. Contact us with your required volume for a specific quote.",
  },
  {
    question: "Can you provide TDS and MSDS documents?",
    answer:
      `Yes. Technical Data Sheets (TDS) and Material Safety Data Sheets (MSDS) are available for all product grades. Submit a request through our contact form or email ${SITE.email}.`,
  },
  {
    question: "What purity and color consistency can we expect?",
    answer:
      "Our granule and anhydrous grades are produced with iron content controlled at ≤ 0.02% to support white detergent formulations. Color is monitored batch to batch to maintain stable appearance in end products.",
  },
  {
    question: "Which countries do you export to?",
    answer:
      "We export to buyers in Asia, the Middle East, Africa, South America, and other regions. Export documentation including COA, packing list, and commercial invoice is prepared per shipment.",
  },
  {
    question: "How do I request a quotation?",
    answer:
      "Use the inquiry form on any product page or the Contact page. Include product grade, required quantity, destination country, and packaging preference. Our sales team responds within 1–2 business days.",
  },
  {
    question: "What is the difference between anhydrous and pentahydrate?",
    answer:
      "Anhydrous sodium metasilicate has the lowest moisture content and highest alkalinity per unit weight, suitable for dry blends where moisture must be minimized. Pentahydrate is a crystalline hydrate with predictable dissolution behavior, commonly used in cleaning and water treatment formulations.",
  },
  {
    question: "Can I order multiple grades in one shipment?",
    answer:
      "Yes. Combined container shipments of granules, anhydrous, pentahydrate, and sodium silicate are supported. This simplifies procurement for distributors stocking multiple grades.",
  },
  {
    question: "How long has your Shandong facility manufactured sodium metasilicate?",
    answer: `${SITE.company} produces sodium metasilicate at a Shandong manufacturing site with decades of silicate industry experience. The same production facility, technical team, and product lines support continued factory-direct export supply under our current company name.`,
  },
];
