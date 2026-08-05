import type { PageType } from "./topic-clusters";

/**
 * Internal Linking Map — the RULES, not the links.
 *
 * Nothing here generates an anchor. This file declares which page archetype
 * should link to which, why, where on the page, and how many times. Future
 * link modules read these rules so that linking is a property of the
 * architecture rather than a decision made per page.
 *
 * The objective is topical authority and buyer progression, not navigation.
 * Navigation is already handled by the header, footer and breadcrumbs; a rule
 * only belongs here if it moves authority or moves a buyer forward.
 */

/** Where in the document the link should sit. */
export type LinkPlacement =
  | "in_body"
  | "section_footer"
  | "sidebar"
  | "related_block"
  | "breadcrumb";

/** What the link is doing for the buyer or for the graph. */
export type LinkPurpose =
  | "descend_to_specificity"
  | "ascend_to_hub"
  | "lateral_comparison"
  | "supply_evidence"
  | "advance_to_conversion"
  | "resolve_objection"
  | "distribute_authority";

export type LinkRule = {
  id: string;
  from: PageType;
  to: PageType;
  purpose: LinkPurpose;
  placement: LinkPlacement;
  /** Recommended number of links of this kind per page. */
  min: number;
  max: number;
  /**
   * Anchor text guidance. Never a fixed string — repeated identical anchors
   * across a site read as templated linking.
   */
  anchorGuidance: string;
  /** Why this edge exists. */
  rationale: string;
  priority: 1 | 2 | 3;
};

export const linkRules: readonly LinkRule[] = [
  // ─── Hub ↔ grade ─────────────────────────────────────────────────────────
  {
    id: "hub-to-grade",
    from: "product_hub",
    to: "product_grade",
    purpose: "descend_to_specificity",
    placement: "in_body",
    min: 3,
    max: 4,
    anchorGuidance:
      "Use the grade name plus the decision it settles ('pentahydrate specifications'), not 'click here'.",
    rationale:
      "The hub owns the head term; grade pages own long-tail specification terms. Descending links let the hub pass authority to the pages that convert specification searches.",
    priority: 1,
  },
  {
    id: "grade-to-hub",
    from: "product_grade",
    to: "product_hub",
    purpose: "ascend_to_hub",
    placement: "in_body",
    min: 1,
    max: 2,
    anchorGuidance: "Reference the product family, not the exact head term, to avoid over-optimised anchors.",
    rationale:
      "Consolidates authority on the page that must rank for the head term, and gives buyers who picked the wrong grade a way back.",
    priority: 1,
  },
  {
    id: "grade-to-grade",
    from: "product_grade",
    to: "product_grade",
    purpose: "lateral_comparison",
    placement: "related_block",
    min: 1,
    max: 2,
    anchorGuidance: "Name the alternative grade and the condition under which it is the better choice.",
    rationale:
      "Buyers arrive on the wrong grade constantly. Lateral links recover the session instead of losing it to a competitor SERP.",
    priority: 2,
  },

  // ─── Product ↔ application ───────────────────────────────────────────────
  {
    id: "hub-to-application",
    from: "product_hub",
    to: "application",
    purpose: "descend_to_specificity",
    placement: "in_body",
    min: 4,
    max: 8,
    anchorGuidance: "Use the industry name; state what is supplied into it.",
    rationale:
      "Builds the topical cluster around the head term and segments traffic by ICP before the RFQ.",
    priority: 1,
  },
  {
    id: "application-to-grade",
    from: "application",
    to: "product_grade",
    purpose: "advance_to_conversion",
    placement: "in_body",
    min: 1,
    max: 2,
    anchorGuidance: "Name the recommended grade for that industry, with the reason attached.",
    rationale:
      "Application pages attract commercial-investigation traffic; the recommended-grade link is the conversion path.",
    priority: 1,
  },
  {
    id: "application-to-hub",
    from: "application",
    to: "product_hub",
    purpose: "ascend_to_hub",
    placement: "section_footer",
    min: 1,
    max: 1,
    anchorGuidance: "Refer to the full grade range rather than repeating the head term.",
    rationale: "Returns authority to the hub and offers a route for buyers needing multiple grades.",
    priority: 2,
  },
  {
    id: "application-to-faq",
    from: "application",
    to: "faq",
    purpose: "resolve_objection",
    placement: "section_footer",
    min: 0,
    max: 1,
    anchorGuidance: "Point at the specific question, not the FAQ index.",
    rationale:
      "Industry pages raise objections they cannot fully answer; the FAQ absorbs them without bloating the page.",
    priority: 3,
  },

  // ─── Guides ──────────────────────────────────────────────────────────────
  {
    id: "comparison-to-grade",
    from: "comparison_guide",
    to: "product_grade",
    purpose: "advance_to_conversion",
    placement: "in_body",
    min: 2,
    max: 2,
    anchorGuidance: "Link both compared options so the guide stays neutral.",
    rationale:
      "A comparison page that links only one option reads as promotional and loses the informational ranking that made it valuable.",
    priority: 1,
  },
  {
    id: "buying-guide-to-hub",
    from: "buying_guide",
    to: "product_hub",
    purpose: "advance_to_conversion",
    placement: "section_footer",
    min: 1,
    max: 2,
    anchorGuidance: "Tie the link to the action the guide just recommended.",
    rationale:
      "Buying guides capture procedure searches; the hub is where the resulting intent is monetised.",
    priority: 1,
  },
  {
    id: "buying-guide-to-evidence",
    from: "buying_guide",
    to: "evidence",
    purpose: "supply_evidence",
    placement: "in_body",
    min: 1,
    max: 3,
    anchorGuidance: "Link to the specific proof the guide tells the buyer to demand.",
    rationale:
      "A guide that tells buyers to verify suppliers must survive its own test. Linking to the evidence page is the demonstration.",
    priority: 1,
  },
  {
    id: "guide-to-guide",
    from: "buying_guide",
    to: "comparison_guide",
    purpose: "distribute_authority",
    placement: "related_block",
    min: 1,
    max: 3,
    anchorGuidance: "Sequence links by buyer stage rather than listing all guides.",
    rationale:
      "Builds a coherent guide cluster, which is what earns topical authority rather than isolated articles.",
    priority: 2,
  },

  // ─── Articles ────────────────────────────────────────────────────────────
  {
    id: "article-to-application",
    from: "article",
    to: "application",
    purpose: "descend_to_specificity",
    placement: "in_body",
    min: 1,
    max: 2,
    anchorGuidance: "Link on the industry term where it first appears in context.",
    rationale:
      "Articles attract the widest, least-qualified traffic; the application page is the qualifying step.",
    priority: 2,
  },
  {
    id: "article-to-hub",
    from: "article",
    to: "product_hub",
    purpose: "advance_to_conversion",
    placement: "section_footer",
    min: 1,
    max: 1,
    anchorGuidance: "Single, clearly commercial link at the end rather than repeated in-body mentions.",
    rationale:
      "Keeps the article informational for ranking purposes while still providing one conversion route.",
    priority: 2,
  },

  // ─── FAQ ─────────────────────────────────────────────────────────────────
  {
    id: "faq-to-product",
    from: "faq",
    to: "product_hub",
    purpose: "advance_to_conversion",
    placement: "in_body",
    min: 1,
    max: 3,
    anchorGuidance: "Link from the answer itself, on the term the answer resolves.",
    rationale:
      "FAQ answers are frequently surfaced directly in AI summaries and rich results; the embedded link is the only conversion path from that surface.",
    priority: 1,
  },
  {
    id: "faq-to-resource",
    from: "faq",
    to: "resource",
    purpose: "supply_evidence",
    placement: "in_body",
    min: 0,
    max: 2,
    anchorGuidance: "Link the document name where an answer references a document.",
    rationale: "Converts a stated claim into a verifiable file in one click.",
    priority: 2,
  },

  // ─── Evidence & resources ────────────────────────────────────────────────
  {
    id: "product-to-evidence",
    from: "product_hub",
    to: "evidence",
    purpose: "supply_evidence",
    placement: "in_body",
    min: 1,
    max: 3,
    anchorGuidance: "Link on the capability claim being made, at the point it is made.",
    rationale:
      "Moves EEAT from assertion to citation: the claim on the product page points to the page that evidences it.",
    priority: 1,
  },
  {
    id: "product-to-resource",
    from: "product_hub",
    to: "resource",
    purpose: "supply_evidence",
    placement: "section_footer",
    min: 1,
    max: 2,
    anchorGuidance: "Name the document type sought (COA, MSDS) rather than 'downloads'.",
    rationale:
      "Document-seeking searchers convert at high rates; the link should match the document noun they searched.",
    priority: 1,
  },
  {
    id: "evidence-to-product",
    from: "evidence",
    to: "product_hub",
    purpose: "advance_to_conversion",
    placement: "section_footer",
    min: 1,
    max: 2,
    anchorGuidance: "Connect the proof just shown to the product it qualifies.",
    rationale:
      "Evidence pages rank for verification intent; without this edge, that traffic never reaches a commercial page.",
    priority: 1,
  },
  {
    id: "logistics-to-product",
    from: "logistics",
    to: "product_hub",
    purpose: "advance_to_conversion",
    placement: "section_footer",
    min: 1,
    max: 1,
    anchorGuidance: "Link on the product family, after the logistics question is answered.",
    rationale:
      "Container and packing searches are late-stage and highly commercial; they must terminate at an RFQ path.",
    priority: 1,
  },
  {
    id: "logistics-to-buying-guide",
    from: "logistics",
    to: "buying_guide",
    purpose: "distribute_authority",
    placement: "related_block",
    min: 1,
    max: 2,
    anchorGuidance: "Link to the pricing or RFQ guide the logistics answer affects.",
    rationale:
      "Loading quantity and packing choice are price inputs; connecting them builds the commercial cluster.",
    priority: 2,
  },

  // ─── Conversion ──────────────────────────────────────────────────────────
  {
    id: "any-to-conversion",
    from: "product_hub",
    to: "conversion",
    purpose: "advance_to_conversion",
    placement: "section_footer",
    min: 1,
    max: 3,
    anchorGuidance:
      "Match the CTA to the stage the section serves — sample, quotation or document request are not interchangeable.",
    rationale:
      "One conversion opportunity per major section, matched to intent, converts better than a single generic CTA.",
    priority: 1,
  },
];

/**
 * Edges that must NOT be created, with the reason. These prevent the two ways
 * internal linking commonly damages a site: keyword cannibalisation and
 * link-stuffing.
 */
export const linkProhibitions: readonly {
  id: string;
  rule: string;
  rationale: string;
}[] = [
  {
    id: "no-grade-to-grade-head-anchor",
    rule: "A grade page must not link to another grade page using the hub's head term as anchor text.",
    rationale:
      "The hub owns 'sodium metasilicate'. Head-term anchors pointing at grade pages tell Google the grade page is the head-term candidate, splitting the ranking signal.",
  },
  {
    id: "no-duplicate-primary-keyword",
    rule: "Two pages may not target the same primary keyword, regardless of how they are linked.",
    rationale:
      "Cannibalisation cannot be fixed by linking. It is prevented at the topic-map level, where each primary keyword has exactly one owner.",
  },
  {
    id: "no-sitewide-boilerplate-block",
    rule: "Do not add an identical related-links block to every page.",
    rationale:
      "Identical link blocks are treated as boilerplate and largely discounted. Links must be selected per page from the topic map.",
  },
  {
    id: "no-links-to-planned-topics",
    rule: "Never render a link to a topic whose status is 'planned'.",
    rationale:
      "Planned topics have no page. Emitting the link ships a 404. Route existence must be checked before rendering.",
  },
  {
    id: "no-link-stuffing-in-body",
    rule: "No more than one internal link per paragraph of body copy.",
    rationale:
      "Dense in-body linking dilutes the value of each link and degrades readability for the buyer, who is the primary audience.",
  },
  {
    id: "no-cta-mismatch",
    rule: "Do not place an RFQ CTA on a page serving research-stage intent.",
    rationale:
      "Stage-mismatched CTAs raise bounce rate on informational pages, which are ranked partly on engagement.",
  },
];

export function getRulesFrom(pageType: PageType): readonly LinkRule[] {
  return linkRules.filter((r) => r.from === pageType);
}

export function getRulesTo(pageType: PageType): readonly LinkRule[] {
  return linkRules.filter((r) => r.to === pageType);
}
