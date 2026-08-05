/**
 * Topic Cluster Map — the site's topical graph.
 *
 * This file contains NO copy and renders nothing. It declares which topics the
 * site owns, which it has not built yet, and how they relate. Future pages are
 * planned against this map so that:
 *
 *  - every primary keyword has exactly one owning page (anti-cannibalization);
 *  - a new page's parent, children and link targets are decided before it is
 *    written, not after;
 *  - the gap between `published` and `planned` IS the content roadmap.
 *
 * Rule: a `planned` topic may not reuse a `primaryKeyword` already owned by a
 * `published` topic. Supporting keywords may overlap; primaries may not.
 */

/** Page archetypes. `application` covers industry-segment intent on this site. */
export type PageType =
  | "home"
  | "product_hub"
  | "product_grade"
  | "product_adjacent"
  | "application"
  | "comparison_guide"
  | "buying_guide"
  | "article"
  | "faq"
  | "evidence"
  | "resource"
  | "logistics"
  | "conversion";

/** Where the buyer sits commercially when this topic satisfies them. */
export type CommercialIntent =
  | "transactional"
  | "commercial_investigation"
  | "informational"
  | "trust_verification";

export type TopicStatus = "published" | "planned";

export type TopicNode = {
  id: string;
  /** Live path. Present only when status is "published". */
  path?: string;
  status: TopicStatus;
  pageType: PageType;
  /** Owned head term. Exactly one topic may own a given primary keyword. */
  primaryKeyword: string;
  supportingKeywords: readonly string[];
  /** Parent topic id, or null for the graph root. */
  parent: string | null;
  children: readonly string[];
  /** Topic ids this page should link to for authority flow. */
  internalLinkTargets: readonly string[];
  commercialIntent: CommercialIntent;
  /**
   * The specific thing this page can say that competitor pages do not.
   * For planned topics this is the reason to build it at all.
   */
  informationGainOpportunity: string;
};

export const topicClusters: readonly TopicNode[] = [
  // ─── Root ────────────────────────────────────────────────────────────────
  {
    id: "sodium-metasilicate",
    path: "/products/sodium-metasilicate",
    status: "published",
    pageType: "product_hub",
    primaryKeyword: "sodium metasilicate",
    supportingKeywords: [
      "sodium metasilicate specifications",
      "sodium metasilicate CAS",
      "sodium metasilicate supplier",
      "Na2SiO3",
    ],
    parent: null,
    children: [
      "grade-granules",
      "grade-anhydrous",
      "grade-pentahydrate",
      "app-detergent",
      "app-water-treatment",
      "app-textile",
      "app-paper",
      "app-ceramics",
      "app-metal-cleaning",
      "app-construction",
      "app-foundry",
      "app-distribution",
      "cmp-soda-ash",
      "cmp-penta-vs-anhydrous",
      "cmp-granular-vs-powder",
      "cmp-vs-sodium-silicate",
      "cmp-vs-stpp",
      "guide-supplier-selection",
      "guide-price-factors",
      "guide-china-factory",
      "guide-container-loading",
      "guide-storage-handling",
      "guide-coa-reading",
      "guide-rfq-checklist",
      "guide-sampling",
      "topic-testing-methods",
      "topic-packaging",
      "topic-troubleshooting",
      "product-sodium-silicate",
    ],
    internalLinkTargets: [
      "grade-granules",
      "grade-anhydrous",
      "grade-pentahydrate",
      "app-detergent",
      "app-water-treatment",
      "app-textile",
      "app-paper",
    ],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Single page that resolves hydrate-grade selection, form selection and document availability together, instead of forcing buyers to compare three separate supplier pages.",
  },

  // ─── Grades ──────────────────────────────────────────────────────────────
  {
    id: "grade-granules",
    path: "/products/sodium-metasilicate-granules",
    status: "published",
    pageType: "product_grade",
    primaryKeyword: "sodium metasilicate granules",
    supportingKeywords: [
      "granular sodium metasilicate",
      "sodium metasilicate mesh size",
      "free flowing sodium metasilicate",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: [
      "sodium-metasilicate",
      "cmp-granular-vs-powder",
      "app-detergent",
    ],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Mesh-size ranges tied to dosing equipment behaviour, which generic supplier listings omit.",
  },
  {
    id: "grade-anhydrous",
    path: "/products/sodium-metasilicate-anhydrous",
    status: "published",
    pageType: "product_grade",
    primaryKeyword: "sodium metasilicate anhydrous",
    supportingKeywords: [
      "anhydrous Na2SiO3",
      "low moisture sodium metasilicate",
      "CAS 6834-92-0",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: [
      "sodium-metasilicate",
      "cmp-penta-vs-anhydrous",
      "app-metal-cleaning",
    ],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Moisture specification explained against dry-blend stability, not just quoted as a number.",
  },
  {
    id: "grade-pentahydrate",
    path: "/products/sodium-metasilicate-pentahydrate",
    status: "published",
    pageType: "product_grade",
    primaryKeyword: "sodium metasilicate pentahydrate",
    supportingKeywords: [
      "Na2SiO3·5H2O",
      "CAS 10213-79-3",
      "crystalline sodium metasilicate",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: [
      "sodium-metasilicate",
      "cmp-penta-vs-anhydrous",
      "app-water-treatment",
    ],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Dissolution behaviour of the hydrate form described for formulation planning rather than listed as appearance only.",
  },
  {
    id: "product-sodium-silicate",
    path: "/products/sodium-silicate",
    status: "published",
    pageType: "product_adjacent",
    primaryKeyword: "liquid sodium silicate",
    supportingKeywords: ["water glass", "sodium silicate modulus", "CAS 1344-09-8"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "cmp-vs-sodium-silicate"],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Modulus selection framed as a purchasing decision, letting buyers combine silicate lines in one RFQ.",
  },

  // ─── Applications / industries ───────────────────────────────────────────
  {
    id: "app-detergent",
    path: "/applications/detergent-industry",
    status: "published",
    pageType: "application",
    primaryKeyword: "sodium metasilicate detergent industry",
    supportingKeywords: [
      "detergent builder sodium metasilicate",
      "phosphate free builder",
      "laundry powder alkaline builder",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["grade-granules", "sodium-metasilicate", "guide-coa-reading"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Links iron content and whiteness limits to finished-powder appearance defects — the actual reason detergent plants reject batches.",
  },
  {
    id: "app-water-treatment",
    path: "/applications/water-treatment",
    status: "published",
    pageType: "application",
    primaryKeyword: "sodium metasilicate water treatment industry",
    supportingKeywords: [
      "silicate corrosion inhibitor",
      "pH buffering silicate",
      "membrane cleaning silicate",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["grade-pentahydrate", "sodium-metasilicate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Distinguishes dosing-blend use from equipment-cleaning use, which drives different grade choices.",
  },
  {
    id: "app-textile",
    path: "/applications/textile-industry",
    status: "published",
    pageType: "application",
    primaryKeyword: "sodium metasilicate textile industry",
    supportingKeywords: [
      "textile scouring agent",
      "peroxide bleaching stabilizer",
      "alkaline scouring silicate",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "grade-pentahydrate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Peroxide-stabilisation role explained against bleaching-bath conditions rather than listed as a generic 'textile use'.",
  },
  {
    id: "app-paper",
    path: "/applications/paper-industry",
    status: "published",
    pageType: "application",
    primaryKeyword: "sodium metasilicate paper industry",
    supportingKeywords: [
      "deinking silicate",
      "pulp bleaching silicate",
      "paper mill silicate supplier",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "grade-granules"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Deinking and peroxide-bleaching functions separated, with the silicate ratio question addressed directly.",
  },
  {
    id: "app-ceramics",
    status: "planned",
    pageType: "application",
    primaryKeyword: "sodium metasilicate ceramics",
    supportingKeywords: [
      "ceramic slip deflocculant",
      "casting slip silicate",
      "ceramic body deflocculation",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "grade-anhydrous"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Deflocculant dosage behaviour and its interaction with slip viscosity — a named ICP with no page on this site today.",
  },
  {
    id: "app-metal-cleaning",
    status: "planned",
    pageType: "application",
    primaryKeyword: "sodium metasilicate metal cleaning",
    supportingKeywords: [
      "alkaline degreaser silicate",
      "metal degreasing builder",
      "aluminium safe alkaline cleaner",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "grade-anhydrous"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Silicate's role in protecting soft metals from alkaline attack — the decisive technical question for this segment, and a named ICP with no page today.",
  },
  {
    id: "app-construction",
    status: "planned",
    pageType: "application",
    primaryKeyword: "sodium metasilicate construction chemicals",
    supportingKeywords: ["concrete admixture silicate", "soil stabilisation silicate"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "product-sodium-silicate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Where metasilicate is and is not appropriate versus liquid silicate in construction systems.",
  },
  {
    id: "app-foundry",
    status: "planned",
    pageType: "application",
    primaryKeyword: "sodium metasilicate foundry binder",
    supportingKeywords: ["silicate sand binder", "CO2 process silicate"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["product-sodium-silicate", "sodium-metasilicate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Routes foundry buyers to the correct silicate product instead of the metasilicate hub, reducing mismatched inquiries.",
  },
  {
    id: "app-distribution",
    status: "planned",
    pageType: "application",
    primaryKeyword: "sodium metasilicate for chemical distributors",
    supportingKeywords: [
      "bulk sodium metasilicate resale",
      "repacking silicate distributor",
      "private label sodium metasilicate",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: [
      "sodium-metasilicate",
      "guide-container-loading",
      "guide-supplier-selection",
    ],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Distributor-specific concerns — repacking, neutral packaging, multi-grade consolidation, document pass-through — which no product page currently addresses as a segment.",
  },

  // ─── Comparisons ─────────────────────────────────────────────────────────
  {
    id: "cmp-soda-ash",
    path: "/guides/sodium-metasilicate-vs-soda-ash",
    status: "published",
    pageType: "comparison_guide",
    primaryKeyword: "sodium metasilicate vs soda ash",
    supportingKeywords: ["silicate vs carbonate builder", "alkalinity comparison"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "app-detergent"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Substitution economics per unit of delivered alkalinity, not a feature table.",
  },
  {
    id: "cmp-penta-vs-anhydrous",
    path: "/guides/pentahydrate-vs-anhydrous",
    status: "published",
    pageType: "comparison_guide",
    primaryKeyword: "sodium metasilicate pentahydrate vs anhydrous",
    supportingKeywords: ["hydrate grade selection", "which sodium metasilicate to buy"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["grade-pentahydrate", "grade-anhydrous", "sodium-metasilicate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Cost-per-active-alkali comparison that exposes why the cheaper per-tonne grade is not always cheaper in use.",
  },
  {
    id: "cmp-granular-vs-powder",
    path: "/guides/granular-vs-powder",
    status: "published",
    pageType: "comparison_guide",
    primaryKeyword: "sodium metasilicate granular vs powder",
    supportingKeywords: ["dust control silicate", "form selection metasilicate"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["grade-granules", "sodium-metasilicate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Handling and dust exposure consequences of form choice on a production line.",
  },
  {
    id: "cmp-vs-sodium-silicate",
    status: "planned",
    pageType: "comparison_guide",
    primaryKeyword: "sodium metasilicate vs sodium silicate",
    supportingKeywords: ["metasilicate or water glass", "which silicate to buy"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "product-sodium-silicate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "The most common buyer confusion on this product line, currently unanswered on-site; also routes two product lines from one page.",
  },
  {
    id: "cmp-vs-stpp",
    status: "planned",
    pageType: "comparison_guide",
    primaryKeyword: "sodium metasilicate vs STPP",
    supportingKeywords: ["phosphate replacement builder", "STPP alternative detergent"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["app-detergent", "sodium-metasilicate"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Captures phosphate-regulation-driven reformulation demand, a live purchasing trigger in detergent manufacturing.",
  },

  // ─── Buying guides ───────────────────────────────────────────────────────
  {
    id: "guide-supplier-selection",
    path: "/guides/supplier-selection",
    status: "published",
    pageType: "buying_guide",
    primaryKeyword: "sodium metasilicate supplier selection",
    supportingKeywords: ["how to evaluate silicate supplier", "supplier audit checklist"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "evidence-hub"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Verification steps a buyer can perform independently, rather than claims about the seller.",
  },
  {
    id: "guide-price-factors",
    path: "/guides/price-factors",
    status: "published",
    pageType: "buying_guide",
    primaryKeyword: "sodium metasilicate price factors",
    supportingKeywords: ["sodium metasilicate price per ton", "silicate quotation structure"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "guide-container-loading"],
    commercialIntent: "commercial_investigation",
    informationGainOpportunity:
      "Explains which variables move a quotation, so buyers can compare offers on a like-for-like basis.",
  },
  {
    id: "guide-china-factory",
    path: "/guides/how-to-choose-china-factory",
    status: "published",
    pageType: "buying_guide",
    primaryKeyword: "how to choose sodium metasilicate factory china",
    supportingKeywords: ["china chemical supplier verification", "factory vs trader china"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "evidence-hub"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Concrete document and site-evidence checks, replacing generic 'choose a reliable supplier' advice.",
  },
  {
    id: "guide-uses-detergent",
    path: "/guides/uses-detergent",
    status: "published",
    pageType: "buying_guide",
    primaryKeyword: "sodium metasilicate uses detergent industry",
    supportingKeywords: ["metasilicate function in detergent"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["app-detergent", "grade-granules"],
    commercialIntent: "informational",
    informationGainOpportunity:
      "Function-level explanation that supports the detergent application page without competing for its head term.",
  },
  {
    id: "guide-container-loading",
    status: "planned",
    pageType: "logistics",
    primaryKeyword: "sodium metasilicate container loading quantity",
    supportingKeywords: [
      "how many tons in 20ft container sodium metasilicate",
      "FCL loading plan silicate",
      "palletized vs floor loaded bags",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "guide-price-factors", "app-distribution"],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Loading quantities by packing type and pallet configuration — a high-frequency procurement question with almost no supplier-published answers. Requires ops-verified loading figures before publication.",
  },
  {
    id: "guide-storage-handling",
    status: "planned",
    pageType: "buying_guide",
    primaryKeyword: "sodium metasilicate storage and handling",
    supportingKeywords: [
      "sodium metasilicate caking prevention",
      "silicate moisture absorption storage",
      "sodium metasilicate shelf life",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "topic-troubleshooting"],
    commercialIntent: "informational",
    informationGainOpportunity:
      "Caking and moisture-uptake behaviour under real warehouse conditions — the most common post-delivery complaint. Shelf-life figures require ops verification.",
  },
  {
    id: "guide-coa-reading",
    status: "planned",
    pageType: "buying_guide",
    primaryKeyword: "how to read sodium metasilicate COA",
    supportingKeywords: [
      "sodium metasilicate certificate of analysis",
      "COA vs TDS difference",
      "verify chemical COA authenticity",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "topic-testing-methods", "guide-supplier-selection"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Teaches buyers to audit a COA, directly demonstrating testing expertise; the site already hosts eight real COA files that can be referenced as worked examples.",
  },
  {
    id: "guide-rfq-checklist",
    status: "planned",
    pageType: "buying_guide",
    primaryKeyword: "sodium metasilicate RFQ checklist",
    supportingKeywords: ["what to include in chemical RFQ", "request quotation silicate"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "guide-price-factors"],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Turns the RFQ field list already on the product hub into a standalone asset that captures RFQ-stage search directly.",
  },
  {
    id: "guide-sampling",
    status: "planned",
    pageType: "buying_guide",
    primaryKeyword: "sodium metasilicate sample request",
    supportingKeywords: ["chemical sample before bulk order", "silicate trial quantity"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "guide-rfq-checklist"],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Explains what to test on a sample and how sample results map to bulk acceptance criteria. Sample quantity and cost terms require ops verification.",
  },

  // ─── Technical topics ────────────────────────────────────────────────────
  {
    id: "topic-testing-methods",
    status: "planned",
    pageType: "evidence",
    primaryKeyword: "sodium metasilicate testing methods",
    supportingKeywords: [
      "Na2O SiO2 titration method",
      "iron content test silicate",
      "water insoluble matter test",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["guide-coa-reading", "sodium-metasilicate", "evidence-hub"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Publishes how each specification line is actually measured — the strongest available expertise signal. Named standards and instruments require ops verification.",
  },
  {
    id: "topic-packaging",
    status: "planned",
    pageType: "logistics",
    primaryKeyword: "sodium metasilicate packaging options",
    supportingKeywords: [
      "25kg bag PE liner silicate",
      "FIBC jumbo bag chemical",
      "neutral packaging private label chemical",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["guide-container-loading", "app-distribution", "sodium-metasilicate"],
    commercialIntent: "transactional",
    informationGainOpportunity:
      "Consolidates packing options scattered across four product pages into one decision asset, including moisture protection reasoning.",
  },
  {
    id: "topic-troubleshooting",
    status: "planned",
    pageType: "article",
    primaryKeyword: "sodium metasilicate caking problem",
    supportingKeywords: [
      "silicate clumping in storage",
      "slow dissolution sodium metasilicate",
      "detergent discoloration silicate",
    ],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["guide-storage-handling", "sodium-metasilicate", "app-detergent"],
    commercialIntent: "informational",
    informationGainOpportunity:
      "Problem-first entry point that captures buyers already using the product — the highest-converting informational segment, and an entirely unclaimed query space.",
  },

  // ─── Evidence & conversion ───────────────────────────────────────────────
  {
    id: "evidence-hub",
    path: "/manufacturing",
    status: "published",
    pageType: "evidence",
    primaryKeyword: "sodium metasilicate manufacturing process",
    supportingKeywords: ["silicate production equipment", "chemical factory shandong"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "guide-supplier-selection"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Process and equipment photography tied to specification outcomes rather than presented as generic factory imagery.",
  },
  {
    id: "evidence-certificates",
    path: "/certifications",
    status: "published",
    pageType: "evidence",
    primaryKeyword: "sodium metasilicate certifications",
    supportingKeywords: ["ISO 9001 chemical manufacturer", "REACH registration silicate"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["resource-downloads", "guide-supplier-selection"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Certificates published as downloadable files rather than logos, allowing independent verification.",
  },
  {
    id: "evidence-export",
    path: "/export",
    status: "published",
    pageType: "logistics",
    primaryKeyword: "sodium metasilicate export",
    supportingKeywords: ["silicate export china", "container loading operation"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["guide-container-loading", "topic-packaging", "sodium-metasilicate"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Photographic evidence of actual container stuffing, which distinguishes a shipper from a listing.",
  },
  {
    id: "resource-downloads",
    path: "/downloads",
    status: "published",
    pageType: "resource",
    primaryKeyword: "sodium metasilicate MSDS download",
    supportingKeywords: ["sodium metasilicate SDS", "silicate COA sample", "product catalogue"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "guide-coa-reading", "evidence-certificates"],
    commercialIntent: "trust_verification",
    informationGainOpportunity:
      "Real MSDS and COA files available without a form, which most competitor sites gate.",
  },
  {
    id: "faq-hub",
    path: "/faq",
    status: "published",
    pageType: "faq",
    primaryKeyword: "sodium metasilicate FAQ",
    supportingKeywords: ["sodium metasilicate buyer questions"],
    parent: "sodium-metasilicate",
    children: [],
    internalLinkTargets: ["sodium-metasilicate", "guide-rfq-checklist"],
    commercialIntent: "informational",
    informationGainOpportunity:
      "Procurement-originated questions rather than chemistry trivia; feeds FAQ structured data across the cluster.",
  },
];

/** Topics whose pages do not exist yet — the build queue, highest value first. */
export const plannedTopics = topicClusters.filter((t) => t.status === "planned");

/** Topics with a live page. */
export const publishedTopics = topicClusters.filter((t) => t.status === "published");
