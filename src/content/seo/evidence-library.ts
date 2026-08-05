import type { PageType } from "./topic-clusters";

/**
 * Evidence Library — the single definition of every EEAT signal on this site.
 *
 * Rules this file enforces by construction:
 *
 *  1. An evidence claim is written ONCE. Pages reference it by id. When a fact
 *     changes, it changes here and nowhere else.
 *  2. Nothing is invented. `verification` records whether the claim is already
 *     substantiated by a file, an asset or a live page in this repository.
 *     Items marked `verification_required` MUST NOT be rendered until the
 *     business confirms them and a `source` is recorded.
 *  3. `schemaRelevance` states which structured-data property the item can
 *     legitimately populate — so schema stays evidence-backed, not decorative.
 */

export type EvidenceType =
  | "facility"
  | "production"
  | "quality_control"
  | "inspection"
  | "certificate"
  | "packaging"
  | "export"
  | "engineering"
  | "testing"
  | "sampling"
  | "documentation"
  | "traceability";

/**
 * `published`             — already stated on a live page or backed by a file
 *                           in this repo; `source` lists where.
 * `asset_available`       — a real photo/document exists but the claim around
 *                           it is not yet written anywhere.
 * `verification_required` — NOT substantiated. Do not render. Do not infer
 *                           from industry norms.
 */
export type VerificationStatus =
  | "published"
  | "asset_available"
  | "verification_required";

/** What buyer doubt this evidence is meant to remove. */
export type TrustPurpose =
  | "proves_manufacturer_not_trader"
  | "proves_capacity"
  | "proves_specification_control"
  | "proves_batch_consistency"
  | "proves_compliance"
  | "proves_export_capability"
  | "proves_handling_competence"
  | "reduces_first_order_risk";

export type EvidenceItem = {
  id: string;
  title: string;
  description: string;
  evidenceType: EvidenceType;
  /** Page archetypes where this evidence belongs. */
  appearsOn: readonly PageType[];
  /** Structured-data property this item can legitimately support. */
  schemaRelevance: readonly string[];
  trustPurpose: TrustPurpose;
  verification: VerificationStatus;
  /** Repo paths / live routes substantiating the claim. Empty when unverified. */
  source: readonly string[];
  /** What the business must confirm before this can be published. */
  verificationNote?: string;
};

export const evidenceLibrary: readonly EvidenceItem[] = [
  // ─── Facility ────────────────────────────────────────────────────────────
  {
    id: "facility-site",
    title: "Owned production site in Changyi, Shandong",
    description:
      "Production is carried out at the company's own Shandong site rather than sourced from a third-party plant.",
    evidenceType: "facility",
    appearsOn: ["home", "product_hub", "evidence", "buying_guide"],
    schemaRelevance: ["Organization.address", "Organization.manufacturer"],
    trustPurpose: "proves_manufacturer_not_trader",
    verification: "published",
    source: [
      "src/components/seo/JsonLd.tsx (PostalAddress: Changyi, Shandong, CN)",
      "src/content/trust.ts (factoryTrustPillars)",
      "/manufacturing",
    ],
  },
  {
    id: "facility-photography",
    title: "Facility, warehouse and raw-material photography",
    description:
      "Photographs of the plant grounds, storage tanks, finished-goods warehouse and raw material handling areas.",
    evidenceType: "facility",
    appearsOn: ["evidence", "home", "product_hub"],
    schemaRelevance: ["Organization.image", "ImageObject"],
    trustPurpose: "proves_manufacturer_not_trader",
    verification: "published",
    source: [
      "public/assets/images/facility/",
      "public/assets/images/warehouse/",
      "public/assets/images/raw-materials/",
      "public/assets/images/factory-proof/",
    ],
  },
  {
    id: "facility-capacity",
    title: "100,000+ tons annual production capacity",
    description:
      "Stated annual output supporting recurring full-container contracts and multi-container annual agreements.",
    evidenceType: "production",
    appearsOn: ["home", "product_hub", "evidence"],
    schemaRelevance: ["Organization.additionalProperty (productionCapacity)"],
    trustPurpose: "proves_capacity",
    verification: "published",
    source: [
      "src/lib/constants.ts (SITE.capacity)",
      "src/components/seo/JsonLd.tsx (productionCapacity)",
      "src/content/trust.ts",
    ],
  },
  {
    id: "company-founding",
    title: "Operating since 2011",
    description: "Company founding year as declared in site-wide organization data.",
    evidenceType: "facility",
    appearsOn: ["home", "evidence"],
    schemaRelevance: ["Organization.foundingDate"],
    trustPurpose: "proves_manufacturer_not_trader",
    verification: "published",
    source: ["src/components/seo/JsonLd.tsx (foundingDate: 2011)"],
  },

  // ─── Production ──────────────────────────────────────────────────────────
  {
    id: "production-equipment",
    title: "Production line equipment — mixing, milling, conveying, silos",
    description:
      "Agitated mixing tanks, rotary drum mills, hoppers and conveying systems, and finished-product silos, each photographed in operation.",
    evidenceType: "production",
    appearsOn: ["evidence", "product_hub", "product_grade"],
    schemaRelevance: ["Organization.image", "ImageObject.caption"],
    trustPurpose: "proves_manufacturer_not_trader",
    verification: "published",
    source: ["/manufacturing", "public/assets/images/manufacturing/"],
  },
  {
    id: "production-process-stages",
    title: "Documented process sequence from raw material to packing",
    description:
      "Raw material storage, mixing and milling, quality control, then packaging and palletizing, presented as an ordered process.",
    evidenceType: "production",
    appearsOn: ["evidence", "product_hub"],
    schemaRelevance: ["HowTo (process steps)", "Organization.knowsAbout"],
    trustPurpose: "proves_specification_control",
    verification: "published",
    source: ["/manufacturing"],
  },

  // ─── Quality control / testing ───────────────────────────────────────────
  {
    id: "qc-in-house-lab",
    title: "In-house laboratory with batch release testing",
    description:
      "Laboratory testing is performed before batch release, with photographs of titration and instrumental analysis stations.",
    evidenceType: "quality_control",
    appearsOn: ["evidence", "product_hub", "product_grade", "buying_guide"],
    schemaRelevance: ["Organization.knowsAbout", "ImageObject"],
    trustPurpose: "proves_specification_control",
    verification: "published",
    source: ["src/content/trust.ts (Quality Control System)", "public/assets/images/lab/"],
  },
  {
    id: "qc-iron-control",
    title: "Iron content controlled at ≤ 0.02%",
    description:
      "Iron limit maintained for white-powder detergent compatibility, stated consistently across grade specifications.",
    evidenceType: "quality_control",
    appearsOn: ["product_hub", "product_grade", "application"],
    schemaRelevance: ["Product.additionalProperty"],
    trustPurpose: "proves_batch_consistency",
    verification: "published",
    source: ["src/content/products/index.ts (Fe Content ≤ 0.02%)"],
  },
  {
    id: "qc-batch-parameters",
    title: "Batch monitoring of SiO₂, Na₂O, iron and colour",
    description:
      "Key specification parameters checked on every production run before release, supporting long-term supply agreements.",
    evidenceType: "quality_control",
    appearsOn: ["product_hub", "product_grade", "evidence"],
    schemaRelevance: ["Product.additionalProperty"],
    trustPurpose: "proves_batch_consistency",
    verification: "published",
    source: ["src/content/trust.ts (Production Stability, buyerConfidencePoints)"],
  },
  {
    id: "qc-coa-per-shipment",
    title: "Certificate of Analysis issued per shipment",
    description:
      "Each export batch is tested and a COA is issued with the shipment document package.",
    evidenceType: "documentation",
    appearsOn: ["product_hub", "product_grade", "resource", "logistics"],
    schemaRelevance: ["Product.additionalProperty", "Offer.availableDeliveryMethod"],
    trustPurpose: "proves_specification_control",
    verification: "published",
    source: ["src/content/trust.ts", "public/downloads/documents/ (8 real COA files)"],
  },
  {
    id: "qc-published-coa-samples",
    title: "Eight real COA files published for inspection",
    description:
      "Grade-specific certificates of analysis are downloadable without a form, covering anhydrous and pentahydrate in several particle sizes.",
    evidenceType: "documentation",
    appearsOn: ["resource", "product_hub", "buying_guide"],
    schemaRelevance: ["Product.subjectOf (DigitalDocument)"],
    trustPurpose: "proves_specification_control",
    verification: "published",
    source: [
      "public/downloads/documents/coa-anhydrous-sodium-metasilicate-*.pdf",
      "public/downloads/documents/coa-sodium-metasilicate-pentahydrate-*.pdf",
    ],
  },
  {
    id: "testing-methods",
    title: "Analytical methods used for each specification line",
    description:
      "The test method behind every value on the specification sheet — titration procedures, iron determination, water-insoluble matter.",
    evidenceType: "testing",
    appearsOn: ["evidence", "buying_guide", "product_grade"],
    schemaRelevance: ["Organization.knowsAbout", "HowTo"],
    trustPurpose: "proves_specification_control",
    verification: "verification_required",
    source: [],
    verificationNote:
      "Named standards (GB/ISO/ASTM numbers) and instrument models are not stated anywhere in the repo. Do not infer from industry norms — obtain the actual method list from the lab.",
  },
  {
    id: "testing-third-party",
    title: "Third-party laboratory verification",
    description:
      "Independent laboratory confirmation of specifications, where a buyer requires it.",
    evidenceType: "testing",
    appearsOn: ["evidence", "buying_guide"],
    schemaRelevance: ["Organization.hasCredential"],
    trustPurpose: "proves_specification_control",
    verification: "verification_required",
    source: [],
    verificationNote:
      "No evidence of third-party testing arrangements exists in the repo. Confirm whether SGS/BV/Intertek testing is offered and on what terms before any claim is made.",
  },
  {
    id: "traceability-batch",
    title: "Batch number traceability from COA to delivered bags",
    description:
      "Ability to trace a delivered batch back to its production run and release test record.",
    evidenceType: "traceability",
    appearsOn: ["evidence", "product_hub", "buying_guide"],
    schemaRelevance: ["Product.additionalProperty"],
    trustPurpose: "proves_batch_consistency",
    verification: "verification_required",
    source: [
      "src/content/products/index.ts (granules packaging mentions custom batch number marking)",
    ],
    verificationNote:
      "Batch marking on bags is referenced in packaging copy, but the retention period and the record-keeping mechanism are undocumented. Confirm before describing a traceability system.",
  },

  // ─── Certificates & compliance ───────────────────────────────────────────
  {
    id: "cert-iso-9001",
    title: "ISO 9001 quality management certificate",
    description: "Quality management system certificate, published as a downloadable file.",
    evidenceType: "certificate",
    appearsOn: ["evidence", "resource", "product_hub", "buying_guide"],
    schemaRelevance: ["Organization.hasCredential"],
    trustPurpose: "proves_compliance",
    verification: "published",
    source: [
      "public/downloads/documents/iso-9001-certificate.pdf",
      "src/components/seo/JsonLd.tsx (hasCredential)",
    ],
  },
  {
    id: "cert-iso-14001",
    title: "ISO 14001 environmental management certificate",
    description:
      "Environmental management system certificate, published in English and Chinese.",
    evidenceType: "certificate",
    appearsOn: ["evidence", "resource"],
    schemaRelevance: ["Organization.hasCredential"],
    trustPurpose: "proves_compliance",
    verification: "published",
    source: [
      "public/downloads/documents/iso-14001-certificate-en.pdf",
      "public/downloads/documents/iso-14001-certificate-cn.pdf",
    ],
  },
  {
    id: "cert-reach",
    title: "REACH registration certificate",
    description: "REACH registration file supporting shipments into EU markets.",
    evidenceType: "certificate",
    appearsOn: ["evidence", "resource", "logistics"],
    schemaRelevance: ["Organization.hasCredential"],
    trustPurpose: "proves_compliance",
    verification: "published",
    source: ["public/downloads/documents/reach-certificate.pdf"],
  },
  {
    id: "cert-legal-entity",
    title: "Business licence and customs registration",
    description:
      "Legal entity registration and customs registration documents, available for buyer due diligence.",
    evidenceType: "certificate",
    appearsOn: ["evidence", "resource", "buying_guide"],
    schemaRelevance: ["Organization.identifier", "Organization.legalName"],
    trustPurpose: "proves_manufacturer_not_trader",
    verification: "published",
    source: [
      "public/downloads/documents/business-license.jpg",
      "public/downloads/documents/customs-registration.pdf",
    ],
  },
  {
    id: "doc-msds",
    title: "MSDS / SDS files per grade",
    description:
      "Safety data sheets for anhydrous and pentahydrate grades, published in English and Chinese.",
    evidenceType: "documentation",
    appearsOn: ["resource", "product_hub", "product_grade"],
    schemaRelevance: ["Product.subjectOf (DigitalDocument)"],
    trustPurpose: "proves_compliance",
    verification: "published",
    source: ["public/downloads/documents/msds-*.pdf"],
  },
  {
    id: "doc-catalogue",
    title: "Product catalogue",
    description: "Bilingual and English product catalogue covering the silicate product range.",
    evidenceType: "documentation",
    appearsOn: ["resource", "home"],
    schemaRelevance: ["Organization.subjectOf"],
    trustPurpose: "proves_capacity",
    verification: "published",
    source: [
      "public/downloads/documents/zhongzhi-product-catalogue-en.pdf",
      "public/downloads/documents/zhongzhi-product-catalogue-bilingual.pdf",
    ],
  },

  // ─── Packaging & handling ────────────────────────────────────────────────
  {
    id: "packaging-formats",
    title: "25 kg / 50 kg PE-lined woven bags and 1,000 kg FIBC",
    description:
      "Standard export packing formats, with PE liner specified for moisture protection.",
    evidenceType: "packaging",
    appearsOn: ["product_hub", "product_grade", "logistics"],
    schemaRelevance: ["Product.additionalProperty", "Offer.eligibleQuantity"],
    trustPurpose: "proves_handling_competence",
    verification: "published",
    source: ["src/content/products/index.ts (packaging)", "src/content/trust.ts"],
  },
  {
    id: "packaging-line",
    title: "Bagging and palletizing line photography",
    description:
      "Photographs of the packing line including robotic palletizing and bagging stations.",
    evidenceType: "packaging",
    appearsOn: ["evidence", "logistics"],
    schemaRelevance: ["ImageObject"],
    trustPurpose: "proves_handling_competence",
    verification: "published",
    source: ["public/assets/images/packaging/", "public/assets/images/factory-proof/packing-line.jpg"],
  },
  {
    id: "packaging-private-label",
    title: "Neutral and printed bag options",
    description:
      "Neutral packaging, printed bags and custom label/marking options reviewable at RFQ stage.",
    evidenceType: "packaging",
    appearsOn: ["product_hub", "application", "logistics"],
    schemaRelevance: ["Offer.itemOffered"],
    trustPurpose: "reduces_first_order_risk",
    verification: "published",
    source: ["src/content/products/index.ts (neutral / printed bag, custom label)"],
  },
  {
    id: "oem-scope",
    title: "OEM / private-label programme scope",
    description:
      "The full extent of private-label service: artwork handling, minimum quantities per label, and who owns the label design.",
    evidenceType: "packaging",
    appearsOn: ["application", "logistics"],
    schemaRelevance: ["Offer"],
    trustPurpose: "reduces_first_order_risk",
    verification: "verification_required",
    source: [],
    verificationNote:
      "Bag printing is mentioned, but OEM terms (artwork approval, per-label MOQ, cost) are undocumented. Confirm before describing an OEM programme.",
  },

  // ─── Export & logistics ──────────────────────────────────────────────────
  {
    id: "export-regions",
    title: "Export shipments to Asia, Middle East, Africa and South America",
    description:
      "Regional export coverage as stated in trust content and reflected in homepage market data.",
    evidenceType: "export",
    appearsOn: ["home", "logistics", "evidence", "product_hub"],
    schemaRelevance: ["Organization.areaServed"],
    trustPurpose: "proves_export_capability",
    verification: "published",
    source: ["src/content/trust.ts", "src/app/page.tsx (regions)"],
  },
  {
    id: "export-country-list",
    title: "Named destination countries",
    description:
      "A specific list of countries shipped to, rather than regional groupings.",
    evidenceType: "export",
    appearsOn: ["logistics", "evidence"],
    schemaRelevance: ["Organization.areaServed"],
    trustPurpose: "proves_export_capability",
    verification: "verification_required",
    source: [],
    verificationNote:
      "Only regions are substantiated. A country-level list must come from actual customs/shipment records — do not derive it from the region groupings.",
  },
  {
    id: "export-documents",
    title: "Per-container export document package",
    description:
      "Commercial invoice, packing list, COA and Bill of Lading prepared for each container.",
    evidenceType: "export",
    appearsOn: ["logistics", "product_hub", "buying_guide"],
    schemaRelevance: ["Offer.availableDeliveryMethod"],
    trustPurpose: "proves_export_capability",
    verification: "published",
    source: ["src/content/trust.ts (Export Experience)"],
  },
  {
    id: "export-incoterms",
    title: "FOB Shandong or CIF destination port",
    description: "Quotation terms offered, to be specified in the inquiry.",
    evidenceType: "export",
    appearsOn: ["product_hub", "logistics", "buying_guide"],
    schemaRelevance: ["Offer.priceSpecification"],
    trustPurpose: "proves_export_capability",
    verification: "published",
    source: ["src/content/trust.ts", "src/content/guides/intent-pages.ts"],
  },
  {
    id: "export-loading-supervision",
    title: "Container loading supervised at the factory warehouse",
    description:
      "Container stuffing carried out and supervised on site, with photographs of actual loading operations.",
    evidenceType: "export",
    appearsOn: ["logistics", "evidence"],
    schemaRelevance: ["ImageObject", "Organization.knowsAbout"],
    trustPurpose: "proves_handling_competence",
    verification: "published",
    source: ["/export", "public/assets/images/export-loading/"],
  },
  {
    id: "logistics-loading-quantity",
    title: "Loading quantity per container by packing type",
    description:
      "Tonnage achievable per 20ft/40ft container for bagged, palletized and FIBC configurations.",
    evidenceType: "export",
    appearsOn: ["logistics", "buying_guide", "product_hub"],
    schemaRelevance: ["Offer.eligibleQuantity"],
    trustPurpose: "reduces_first_order_risk",
    verification: "verification_required",
    source: ["/export (a loading reference section exists; figures not confirmed here)"],
    verificationNote:
      "High-value buyer question. Figures must come from actual loading records, not from bag-weight arithmetic.",
  },
  {
    id: "logistics-lead-time",
    title: "Production and shipping lead time",
    description: "Time from order confirmation to container departure.",
    evidenceType: "export",
    appearsOn: ["product_hub", "logistics", "conversion"],
    schemaRelevance: ["Offer.deliveryLeadTime"],
    trustPurpose: "reduces_first_order_risk",
    verification: "verification_required",
    source: [],
    verificationNote:
      "A '2–4 weeks' figure exists in the category data file but appears nowhere else in the repo or on any live page. Held at status 'hidden' pending business confirmation.",
  },
  {
    id: "logistics-hs-code",
    title: "HS code for customs classification",
    description: "Customs tariff classification used for this product on export documents.",
    evidenceType: "documentation",
    appearsOn: ["logistics", "product_hub", "resource"],
    schemaRelevance: ["Product.additionalProperty"],
    trustPurpose: "reduces_first_order_risk",
    verification: "verification_required",
    source: [],
    verificationNote:
      "Not stated anywhere in the repo. Must be taken from actual export declarations — an incorrect HS code creates real customs liability for the buyer.",
  },
  {
    id: "product-shelf-life",
    title: "Shelf life and storage life under sealed conditions",
    description: "Period for which specification is maintained under stated storage conditions.",
    evidenceType: "quality_control",
    appearsOn: ["product_hub", "product_grade", "buying_guide"],
    schemaRelevance: ["Product.additionalProperty"],
    trustPurpose: "reduces_first_order_risk",
    verification: "verification_required",
    source: [
      "src/content/products/index.ts (storage instruction exists: keep sealed and dry)",
    ],
    verificationNote:
      "Storage conditions are published; a shelf-life duration is not. Do not infer one.",
  },

  // ─── Commercial terms ────────────────────────────────────────────────────
  {
    id: "commercial-moq",
    title: "Minimum order quantity — one full container load",
    description:
      "Standard minimum of one FCL, approximately 20–25 metric tons, with samples available beforehand.",
    evidenceType: "sampling",
    appearsOn: ["product_hub", "conversion", "buying_guide"],
    schemaRelevance: ["Offer.eligibleQuantity"],
    trustPurpose: "reduces_first_order_risk",
    verification: "published",
    source: [
      "src/content/trust.ts (MOQ & Sample Flexibility)",
      "src/content/guides/intent-pages.ts",
      "src/content/applications/industries.ts",
    ],
  },
  {
    id: "sampling-programme",
    title: "Sample terms — quantity, cost and freight",
    description:
      "What a buyer receives as a sample, at what cost, and who pays freight.",
    evidenceType: "sampling",
    appearsOn: ["conversion", "buying_guide", "product_hub"],
    schemaRelevance: ["Offer"],
    trustPurpose: "reduces_first_order_risk",
    verification: "verification_required",
    source: ["src/content/trust.ts (samples are offered; terms unstated)"],
    verificationNote:
      "The existence of samples is published; quantity, cost and freight responsibility are not. Confirm before publishing sample terms.",
  },
  {
    id: "engineering-support",
    title: "Technical support for formulation questions",
    description:
      "Access to production and technical staff for specification and formulation questions during evaluation.",
    evidenceType: "engineering",
    appearsOn: ["product_hub", "application", "conversion"],
    schemaRelevance: ["Organization.contactPoint"],
    trustPurpose: "proves_specification_control",
    verification: "published",
    source: [
      "src/content/sodium-metasilicate-category.ts (direct contact with production and sales teams)",
      "src/components/seo/JsonLd.tsx (ContactPoint, availableLanguage)",
    ],
  },
  {
    id: "customer-references",
    title: "Named customer references or case studies",
    description: "Identifiable buyers or documented supply cases.",
    evidenceType: "inspection",
    appearsOn: ["evidence", "application"],
    schemaRelevance: ["Organization.review", "CaseStudy"],
    trustPurpose: "proves_export_capability",
    verification: "verification_required",
    source: [],
    verificationNote:
      "No customer names or case studies exist in the repo. Requires customer consent before any reference is published — do not create illustrative or anonymised examples.",
  },
];

/** Evidence safe to render today. */
export const publishedEvidence = evidenceLibrary.filter(
  (e) => e.verification === "published"
);

/** Blocked pending business confirmation — the EEAT gap list. */
export const evidenceGaps = evidenceLibrary.filter(
  (e) => e.verification === "verification_required"
);

export function getEvidence(id: string): EvidenceItem | undefined {
  return evidenceLibrary.find((e) => e.id === id);
}
