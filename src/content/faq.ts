import type { FAQItem } from "@/types";
import { SITE } from "@/lib/constants";

export const faqItems: FAQItem[] = [
  {
    question: "What is your main sodium metasilicate product?",
    answer:
      "We supply sodium metasilicate grades for industrial procurement, including granules, anhydrous sodium metasilicate, sodium metasilicate pentahydrate, and nonahydrate by inquiry. Buyers normally confirm grade, form, packing, documents, and destination before quotation.",
  },
  {
    question: "Which specifications should buyers confirm before quotation?",
    answer:
      "Key items include Na₂O, SiO₂, Fe, appearance, particle size or bulk density where applicable, whiteness, water-insoluble matter, packing, loading quantity, required documents, and destination port.",
  },
  {
    question: "Which sodium metasilicate form should I choose?",
    answer:
      "Powder is commonly reviewed for dry blending, granules are easier for handling and dosing, and crystalline hydrate forms are selected when dissolution behavior or hydrate grade is important. Final selection should match the application and grade specification.",
  },
  {
    question: "What packaging options are available?",
    answer:
      "Common options include 25 kg PP woven bags and jumbo bags. Printed bags, neutral bags, palletized loading, non-palletized loading, buyer labels, batch numbers, and handling marks can be confirmed before order.",
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer:
      "MOQ depends on product grade, packing method, destination, and shipment plan. For accurate review, send the product grade, quantity, packing preference, destination port, and whether sample or full-container shipment is required.",
  },
  {
    question: "Can you provide TDS and MSDS documents?",
    answer:
      `Yes. MSDS/SDS, representative COA by grade, the product catalogue, company credentials, and ISO/REACH certificates can be downloaded directly from the Downloads page. Batch-specific COA for your shipment lot can be requested through the contact form or by email at ${SITE.email}.`,
  },
  {
    question: "Can you provide batch-specific COA?",
    answer:
      "Batch-specific COA can be prepared according to order requirements. Buyers should confirm the required specification items before quotation so the correct document format and testing points can be reviewed.",
  },
  {
    question: "What export documents may be needed?",
    answer:
      "Common shipment documents include commercial invoice, packing list, bill of lading, COA, MSDS/SDS, certificate files where applicable, and any buyer-specific document requirements confirmed before shipment.",
  },
  {
    question: "How do I request a quotation?",
    answer:
      "Use the inquiry form on any product page or the Contact page. Include product grade, quantity, packing preference, destination port, application, and required documents. Our team normally responds within 1–2 business days.",
  },
  {
    question: "What is the difference between anhydrous and pentahydrate?",
    answer:
      "Anhydrous sodium metasilicate has the lowest moisture content and highest alkalinity per unit weight, suitable for dry blends where moisture must be minimized. Pentahydrate is a crystalline hydrate with predictable dissolution behavior, commonly used in cleaning and water treatment formulations.",
  },
  {
    question: "Can I order multiple grades in one shipment?",
    answer:
      "Combined shipment review is possible depending on grade availability, packing, loading method, and destination. Send the requested grade list and quantities so the loading plan can be checked before quotation.",
  },
  {
    question: "How should sodium metasilicate be stored?",
    answer:
      "Sodium metasilicate should be stored in a dry, ventilated warehouse and protected from moisture. Storage requirements may vary by grade and packing, so buyers should review the MSDS/SDS and shipment documents before use.",
  },
];
