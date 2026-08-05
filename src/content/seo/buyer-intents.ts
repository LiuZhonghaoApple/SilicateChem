import type { PageType } from "./topic-clusters";

/**
 * Buyer Intent Library — the canonical set of questions industrial buyers ask
 * before, during and after a silicate purchase.
 *
 * This is not copy and not UI. It is the specification every future page is
 * written against: a page exists to resolve a named set of intents, with a
 * named CTA and named evidence. Anything that resolves no intent is not built.
 *
 * `coverage` is deliberately honest — the `gap` and `partial` entries are the
 * content backlog, ordered by `priority`.
 */

export type IntentStage =
  | "research"
  | "comparison"
  | "technical_validation"
  | "supplier_evaluation"
  | "logistics"
  | "sampling"
  | "rfq"
  | "repeat_purchase";

/** What the searcher wants back from the SERP. */
export type SearchIntent =
  | "definition"
  | "selection"
  | "specification"
  | "comparison"
  | "verification"
  | "procedure"
  | "commercial_terms"
  | "problem_resolution";

export type RecommendedCta =
  | "request_quotation"
  | "request_sample"
  | "request_coa_tds_sds"
  | "download_documents"
  | "contact_technical"
  | "no_cta";

/** Whether the site answers this intent today. */
export type IntentCoverage = "covered" | "partial" | "gap";

/** 1 = answer first; 3 = answer when the higher tiers are complete. */
export type IntentPriority = 1 | 2 | 3;

export type BuyerIntent = {
  id: string;
  stage: IntentStage;
  /** Short label for the decision being made. */
  intent: string;
  /** The question in the buyer's own words. */
  buyerQuestion: string;
  searchIntent: SearchIntent;
  recommendedPageType: PageType;
  recommendedCta: RecommendedCta;
  /** Evidence ids from evidence-library.ts. */
  recommendedEvidence: readonly string[];
  /** Topic ids from topic-clusters.ts. */
  recommendedInternalLinks: readonly string[];
  coverage: IntentCoverage;
  priority: IntentPriority;
};

export const buyerIntents: readonly BuyerIntent[] = [
  // ─── Research ────────────────────────────────────────────────────────────
  {
    id: "res-what-is",
    stage: "research",
    intent: "Identify the material",
    buyerQuestion: "What is sodium metasilicate and what does it do in a formulation?",
    searchIntent: "definition",
    recommendedPageType: "product_hub",
    recommendedCta: "download_documents",
    recommendedEvidence: [],
    recommendedInternalLinks: ["sodium-metasilicate", "app-detergent"],
    coverage: "covered",
    priority: 2,
  },
  {
    id: "res-cas-identity",
    stage: "research",
    intent: "Confirm chemical identity",
    buyerQuestion:
      "Which CAS number applies — 6834-92-0 or 10213-79-3 — and does it change what I receive?",
    searchIntent: "specification",
    recommendedPageType: "product_hub",
    recommendedCta: "request_coa_tds_sds",
    recommendedEvidence: ["qc-published-coa-samples"],
    recommendedInternalLinks: ["grade-anhydrous", "grade-pentahydrate"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "res-which-industries",
    stage: "research",
    intent: "Match material to own industry",
    buyerQuestion: "Is this used in my industry, and for what function?",
    searchIntent: "selection",
    recommendedPageType: "application",
    recommendedCta: "contact_technical",
    recommendedEvidence: ["engineering-support"],
    recommendedInternalLinks: ["app-detergent", "app-textile", "app-metal-cleaning"],
    coverage: "partial",
    priority: 1,
  },
  {
    id: "res-regulatory",
    stage: "research",
    intent: "Check regulatory acceptability",
    buyerQuestion: "Is this material REACH registered for shipment into my market?",
    searchIntent: "verification",
    recommendedPageType: "evidence",
    recommendedCta: "download_documents",
    recommendedEvidence: ["cert-reach", "doc-msds"],
    recommendedInternalLinks: ["evidence-certificates", "resource-downloads"],
    coverage: "covered",
    priority: 2,
  },

  // ─── Comparison ──────────────────────────────────────────────────────────
  {
    id: "cmp-hydrate-grade",
    stage: "comparison",
    intent: "Choose hydrate grade",
    buyerQuestion: "Should I buy pentahydrate or anhydrous for my process?",
    searchIntent: "comparison",
    recommendedPageType: "comparison_guide",
    recommendedCta: "request_sample",
    recommendedEvidence: ["qc-batch-parameters"],
    recommendedInternalLinks: ["cmp-penta-vs-anhydrous", "grade-anhydrous", "grade-pentahydrate"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "cmp-physical-form",
    stage: "comparison",
    intent: "Choose physical form",
    buyerQuestion: "Granules or powder — which suits my dosing and handling equipment?",
    searchIntent: "comparison",
    recommendedPageType: "comparison_guide",
    recommendedCta: "request_sample",
    recommendedEvidence: [],
    recommendedInternalLinks: ["cmp-granular-vs-powder", "grade-granules"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "cmp-vs-alternatives",
    stage: "comparison",
    intent: "Evaluate substitute chemistries",
    buyerQuestion: "Could soda ash or STPP do the same job more cheaply?",
    searchIntent: "comparison",
    recommendedPageType: "comparison_guide",
    recommendedCta: "contact_technical",
    recommendedEvidence: ["engineering-support"],
    recommendedInternalLinks: ["cmp-soda-ash", "cmp-vs-stpp", "app-detergent"],
    coverage: "partial",
    priority: 2,
  },
  {
    id: "cmp-metasilicate-vs-silicate",
    stage: "comparison",
    intent: "Distinguish product lines",
    buyerQuestion: "What is the difference between sodium metasilicate and sodium silicate?",
    searchIntent: "comparison",
    recommendedPageType: "comparison_guide",
    recommendedCta: "request_quotation",
    recommendedEvidence: [],
    recommendedInternalLinks: ["cmp-vs-sodium-silicate", "product-sodium-silicate"],
    coverage: "gap",
    priority: 1,
  },

  // ─── Technical validation ────────────────────────────────────────────────
  {
    id: "tech-spec-limits",
    stage: "technical_validation",
    intent: "Verify specification fit",
    buyerQuestion:
      "What are the guaranteed Na₂O, SiO₂, Fe and water-insoluble limits, not the typical values?",
    searchIntent: "specification",
    recommendedPageType: "product_grade",
    recommendedCta: "request_coa_tds_sds",
    recommendedEvidence: ["qc-iron-control", "qc-batch-parameters", "qc-coa-per-shipment"],
    recommendedInternalLinks: ["grade-granules", "grade-anhydrous", "grade-pentahydrate"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "tech-iron-colour",
    stage: "technical_validation",
    intent: "Protect finished-product appearance",
    buyerQuestion:
      "Will the iron content discolour my white powder, and how is that controlled batch to batch?",
    searchIntent: "specification",
    recommendedPageType: "application",
    recommendedCta: "request_sample",
    recommendedEvidence: ["qc-iron-control", "qc-in-house-lab"],
    recommendedInternalLinks: ["app-detergent", "grade-granules"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "tech-particle-size",
    stage: "technical_validation",
    intent: "Match particle size to equipment",
    buyerQuestion: "What mesh sizes are available and can they be screened to my range?",
    searchIntent: "specification",
    recommendedPageType: "product_grade",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["production-equipment"],
    recommendedInternalLinks: ["grade-granules", "cmp-granular-vs-powder"],
    coverage: "covered",
    priority: 2,
  },
  {
    id: "tech-test-methods",
    stage: "technical_validation",
    intent: "Audit the numbers",
    buyerQuestion: "By what method is each value on the COA measured?",
    searchIntent: "procedure",
    recommendedPageType: "evidence",
    recommendedCta: "request_coa_tds_sds",
    recommendedEvidence: ["testing-methods", "qc-in-house-lab"],
    recommendedInternalLinks: ["topic-testing-methods", "guide-coa-reading"],
    coverage: "gap",
    priority: 1,
  },
  {
    id: "tech-read-coa",
    stage: "technical_validation",
    intent: "Interpret supplier documents",
    buyerQuestion: "How do I tell a genuine COA from a retyped one, and how does it differ from a TDS?",
    searchIntent: "procedure",
    recommendedPageType: "buying_guide",
    recommendedCta: "download_documents",
    recommendedEvidence: ["qc-published-coa-samples", "qc-coa-per-shipment"],
    recommendedInternalLinks: ["guide-coa-reading", "resource-downloads"],
    coverage: "gap",
    priority: 1,
  },
  {
    id: "tech-shelf-life",
    stage: "technical_validation",
    intent: "Plan inventory holding",
    buyerQuestion: "How long does it hold specification in my warehouse before it cakes?",
    searchIntent: "specification",
    recommendedPageType: "buying_guide",
    recommendedCta: "contact_technical",
    recommendedEvidence: ["product-shelf-life", "packaging-formats"],
    recommendedInternalLinks: ["guide-storage-handling", "topic-troubleshooting"],
    coverage: "gap",
    priority: 2,
  },

  // ─── Supplier evaluation ─────────────────────────────────────────────────
  {
    id: "sup-manufacturer-check",
    stage: "supplier_evaluation",
    intent: "Confirm this is a producer",
    buyerQuestion: "Is this an actual factory or a trading company reselling someone else's output?",
    searchIntent: "verification",
    recommendedPageType: "evidence",
    recommendedCta: "contact_technical",
    recommendedEvidence: [
      "facility-site",
      "facility-photography",
      "production-equipment",
      "cert-legal-entity",
    ],
    recommendedInternalLinks: ["evidence-hub", "guide-china-factory"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "sup-capacity",
    stage: "supplier_evaluation",
    intent: "Confirm supply security",
    buyerQuestion: "Can they sustain my annual volume without allocation problems?",
    searchIntent: "verification",
    recommendedPageType: "evidence",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["facility-capacity", "production-process-stages"],
    recommendedInternalLinks: ["evidence-hub", "sodium-metasilicate"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "sup-certificates",
    stage: "supplier_evaluation",
    intent: "Clear internal vendor approval",
    buyerQuestion: "What certificates can I put in front of my QA department?",
    searchIntent: "verification",
    recommendedPageType: "resource",
    recommendedCta: "download_documents",
    recommendedEvidence: ["cert-iso-9001", "cert-iso-14001", "cert-reach", "cert-legal-entity"],
    recommendedInternalLinks: ["evidence-certificates", "resource-downloads"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "sup-qc-system",
    stage: "supplier_evaluation",
    intent: "Assess quality system",
    buyerQuestion: "What happens between production and release, and who signs it off?",
    searchIntent: "procedure",
    recommendedPageType: "evidence",
    recommendedCta: "request_coa_tds_sds",
    recommendedEvidence: ["qc-in-house-lab", "qc-batch-parameters", "production-process-stages"],
    recommendedInternalLinks: ["evidence-hub", "topic-testing-methods"],
    coverage: "partial",
    priority: 1,
  },
  {
    id: "sup-traceability",
    stage: "supplier_evaluation",
    intent: "Plan for a quality dispute",
    buyerQuestion: "If a batch fails on arrival, can it be traced back to its production record?",
    searchIntent: "procedure",
    recommendedPageType: "evidence",
    recommendedCta: "contact_technical",
    recommendedEvidence: ["traceability-batch", "qc-coa-per-shipment"],
    recommendedInternalLinks: ["evidence-hub", "guide-supplier-selection"],
    coverage: "gap",
    priority: 2,
  },
  {
    id: "sup-compare-suppliers",
    stage: "supplier_evaluation",
    intent: "Compare quotations fairly",
    buyerQuestion: "How do I compare three offers that all claim the same specification?",
    searchIntent: "procedure",
    recommendedPageType: "buying_guide",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["qc-published-coa-samples", "cert-legal-entity"],
    recommendedInternalLinks: ["guide-supplier-selection", "guide-price-factors"],
    coverage: "covered",
    priority: 1,
  },

  // ─── Logistics ───────────────────────────────────────────────────────────
  {
    id: "log-container-quantity",
    stage: "logistics",
    intent: "Plan container economics",
    buyerQuestion: "How many tons fit in a 20ft container with my chosen packing?",
    searchIntent: "commercial_terms",
    recommendedPageType: "logistics",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["logistics-loading-quantity", "packaging-formats"],
    recommendedInternalLinks: ["guide-container-loading", "topic-packaging"],
    coverage: "gap",
    priority: 1,
  },
  {
    id: "log-packing-choice",
    stage: "logistics",
    intent: "Select packing format",
    buyerQuestion: "Bags or FIBC — which is right for my unloading equipment and storage?",
    searchIntent: "selection",
    recommendedPageType: "logistics",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["packaging-formats", "packaging-line"],
    recommendedInternalLinks: ["topic-packaging", "sodium-metasilicate"],
    coverage: "partial",
    priority: 2,
  },
  {
    id: "log-moisture-protection",
    stage: "logistics",
    intent: "Prevent transit degradation",
    buyerQuestion: "How is the material protected from moisture during a long sea voyage?",
    searchIntent: "procedure",
    recommendedPageType: "logistics",
    recommendedCta: "contact_technical",
    recommendedEvidence: ["packaging-formats", "export-loading-supervision"],
    recommendedInternalLinks: ["evidence-export", "guide-storage-handling"],
    coverage: "partial",
    priority: 2,
  },
  {
    id: "log-incoterms",
    stage: "logistics",
    intent: "Establish price basis",
    buyerQuestion: "Is the quote FOB or CIF, and what is included in each?",
    searchIntent: "commercial_terms",
    recommendedPageType: "buying_guide",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["export-incoterms", "export-documents"],
    recommendedInternalLinks: ["guide-price-factors", "evidence-export"],
    coverage: "covered",
    priority: 2,
  },
  {
    id: "log-customs-docs",
    stage: "logistics",
    intent: "Clear customs without delay",
    buyerQuestion: "Which documents arrive with the container, and what HS code is declared?",
    searchIntent: "commercial_terms",
    recommendedPageType: "logistics",
    recommendedCta: "download_documents",
    recommendedEvidence: ["export-documents", "logistics-hs-code", "doc-msds"],
    recommendedInternalLinks: ["evidence-export", "resource-downloads"],
    coverage: "partial",
    priority: 1,
  },
  {
    id: "log-lead-time",
    stage: "logistics",
    intent: "Schedule against production plan",
    buyerQuestion: "How long from order confirmation to the container leaving port?",
    searchIntent: "commercial_terms",
    recommendedPageType: "logistics",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["logistics-lead-time"],
    recommendedInternalLinks: ["guide-rfq-checklist"],
    coverage: "gap",
    priority: 1,
  },

  // ─── Sampling ────────────────────────────────────────────────────────────
  {
    id: "smp-request",
    stage: "sampling",
    intent: "Obtain material for trial",
    buyerQuestion: "Can I get a sample before committing to a container, and on what terms?",
    searchIntent: "procedure",
    recommendedPageType: "conversion",
    recommendedCta: "request_sample",
    recommendedEvidence: ["sampling-programme", "commercial-moq"],
    recommendedInternalLinks: ["guide-sampling", "sodium-metasilicate"],
    coverage: "partial",
    priority: 1,
  },
  {
    id: "smp-what-to-test",
    stage: "sampling",
    intent: "Design the acceptance trial",
    buyerQuestion: "What should I test on the sample so it predicts bulk performance?",
    searchIntent: "procedure",
    recommendedPageType: "buying_guide",
    recommendedCta: "contact_technical",
    recommendedEvidence: ["testing-methods", "engineering-support"],
    recommendedInternalLinks: ["guide-sampling", "topic-testing-methods"],
    coverage: "gap",
    priority: 2,
  },
  {
    id: "smp-representativeness",
    stage: "sampling",
    intent: "Trust the sample",
    buyerQuestion: "Will bulk production match the sample I approved?",
    searchIntent: "verification",
    recommendedPageType: "evidence",
    recommendedCta: "request_coa_tds_sds",
    recommendedEvidence: ["qc-batch-parameters", "traceability-batch", "qc-coa-per-shipment"],
    recommendedInternalLinks: ["evidence-hub", "guide-supplier-selection"],
    coverage: "partial",
    priority: 1,
  },

  // ─── RFQ ─────────────────────────────────────────────────────────────────
  {
    id: "rfq-what-to-send",
    stage: "rfq",
    intent: "Submit a quotable inquiry",
    buyerQuestion: "What information do you need from me to quote accurately the first time?",
    searchIntent: "procedure",
    recommendedPageType: "conversion",
    recommendedCta: "request_quotation",
    recommendedEvidence: [],
    recommendedInternalLinks: ["guide-rfq-checklist", "sodium-metasilicate"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "rfq-price-drivers",
    stage: "rfq",
    intent: "Understand the quotation",
    buyerQuestion: "Why do two quotes for the same product differ, and which variables can I change?",
    searchIntent: "commercial_terms",
    recommendedPageType: "buying_guide",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["export-incoterms", "packaging-formats"],
    recommendedInternalLinks: ["guide-price-factors", "guide-container-loading"],
    coverage: "covered",
    priority: 1,
  },
  {
    id: "rfq-moq",
    stage: "rfq",
    intent: "Check order-size feasibility",
    buyerQuestion: "What is the minimum I can order, and can I mix grades in one container?",
    searchIntent: "commercial_terms",
    recommendedPageType: "conversion",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["commercial-moq"],
    recommendedInternalLinks: ["sodium-metasilicate", "guide-rfq-checklist"],
    coverage: "partial",
    priority: 1,
  },
  {
    id: "rfq-private-label",
    stage: "rfq",
    intent: "Arrange own-brand supply",
    buyerQuestion: "Can you supply in neutral or my own printed bags?",
    searchIntent: "commercial_terms",
    recommendedPageType: "application",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["packaging-private-label", "oem-scope"],
    recommendedInternalLinks: ["app-distribution", "topic-packaging"],
    coverage: "partial",
    priority: 2,
  },

  // ─── Repeat purchase ─────────────────────────────────────────────────────
  {
    id: "rep-consistency",
    stage: "repeat_purchase",
    intent: "Confirm ongoing consistency",
    buyerQuestion: "Will shipment five match shipment one?",
    searchIntent: "verification",
    recommendedPageType: "evidence",
    recommendedCta: "request_coa_tds_sds",
    recommendedEvidence: ["qc-batch-parameters", "qc-coa-per-shipment", "traceability-batch"],
    recommendedInternalLinks: ["evidence-hub", "sodium-metasilicate"],
    coverage: "partial",
    priority: 1,
  },
  {
    id: "rep-troubleshooting",
    stage: "repeat_purchase",
    intent: "Resolve an in-use problem",
    buyerQuestion: "The material caked in storage / dissolves too slowly — what changed?",
    searchIntent: "problem_resolution",
    recommendedPageType: "article",
    recommendedCta: "contact_technical",
    recommendedEvidence: ["packaging-formats", "engineering-support", "product-shelf-life"],
    recommendedInternalLinks: ["topic-troubleshooting", "guide-storage-handling"],
    coverage: "gap",
    priority: 1,
  },
  {
    id: "rep-contract-supply",
    stage: "repeat_purchase",
    intent: "Move to contract supply",
    buyerQuestion: "Can we fix price and allocation for an annual volume?",
    searchIntent: "commercial_terms",
    recommendedPageType: "conversion",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["facility-capacity", "commercial-moq"],
    recommendedInternalLinks: ["guide-price-factors", "sodium-metasilicate"],
    coverage: "partial",
    priority: 2,
  },
  {
    id: "rep-multi-grade",
    stage: "repeat_purchase",
    intent: "Consolidate suppliers",
    buyerQuestion: "Can I source other silicate grades from the same contact?",
    searchIntent: "selection",
    recommendedPageType: "product_hub",
    recommendedCta: "request_quotation",
    recommendedEvidence: ["doc-catalogue", "facility-capacity"],
    recommendedInternalLinks: ["product-sodium-silicate", "sodium-metasilicate"],
    coverage: "covered",
    priority: 2,
  },
];

/** Intents the site does not answer at all — highest-value content backlog. */
export const uncoveredIntents = buyerIntents.filter((i) => i.coverage === "gap");

/** Intents answered only in passing — enhancement backlog. */
export const partiallyCoveredIntents = buyerIntents.filter(
  (i) => i.coverage === "partial"
);

export function getIntentsByStage(stage: IntentStage): readonly BuyerIntent[] {
  return buyerIntents.filter((i) => i.stage === stage);
}
