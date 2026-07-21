export type ContextualLinkKind = "Product" | "Application" | "Guide" | "Article" | "Document";

export type ContextualLink = {
  href: string;
  label: string;
  kind: ContextualLinkKind;
};

const hub: ContextualLink = {
  href: "/products/sodium-metasilicate",
  label: "Sodium Metasilicate Grades & Specifications",
  kind: "Product",
};

const granules: ContextualLink = {
  href: "/products/sodium-metasilicate-granules",
  label: "Sodium Metasilicate Granules Specifications",
  kind: "Product",
};

const anhydrous: ContextualLink = {
  href: "/products/sodium-metasilicate-anhydrous",
  label: "Anhydrous Sodium Metasilicate Specifications",
  kind: "Product",
};

const pentahydrate: ContextualLink = {
  href: "/products/sodium-metasilicate-pentahydrate",
  label: "Sodium Metasilicate Pentahydrate Specifications",
  kind: "Product",
};

const documents: ContextualLink = {
  href: "/downloads",
  label: "MSDS, Certificates & Buyer Documents",
  kind: "Document",
};

const certifications: ContextualLink = {
  href: "/certifications",
  label: "Certificates & Compliance Evidence",
  kind: "Document",
};

const detergentApplication: ContextualLink = {
  href: "/applications/detergent-industry",
  label: "Sodium Metasilicate for Detergent Manufacturing",
  kind: "Application",
};

const waterApplication: ContextualLink = {
  href: "/applications/water-treatment",
  label: "Sodium Metasilicate for Water Treatment",
  kind: "Application",
};

const textileApplication: ContextualLink = {
  href: "/applications/textile-industry",
  label: "Sodium Metasilicate for Textile Processing",
  kind: "Application",
};

const paperApplication: ContextualLink = {
  href: "/applications/paper-industry",
  label: "Sodium Metasilicate for Paper & Pulp Processing",
  kind: "Application",
};

const supplierGuide: ContextualLink = {
  href: "/guides/supplier-selection",
  label: "Sodium Metasilicate Supplier Selection Checklist",
  kind: "Guide",
};

const priceGuide: ContextualLink = {
  href: "/guides/price-factors",
  label: "Sodium Metasilicate Factory Quotation Factors",
  kind: "Guide",
};

const detergentGuide: ContextualLink = {
  href: "/guides/uses-detergent",
  label: "Sodium Metasilicate Uses in Detergent Manufacturing",
  kind: "Guide",
};

const comparisonGuide: ContextualLink = {
  href: "/guides/sodium-metasilicate-vs-soda-ash",
  label: "Sodium Metasilicate vs Soda Ash",
  kind: "Guide",
};

const factoryGuide: ContextualLink = {
  href: "/guides/how-to-choose-china-factory",
  label: "How to Verify a Sodium Metasilicate Factory in China",
  kind: "Guide",
};

const detergentArticle: ContextualLink = {
  href: "/blog/detergent-industry-metasilicate",
  label: "Detergent Manufacturing Procurement Notes",
  kind: "Article",
};

const waterArticle: ContextualLink = {
  href: "/blog/water-treatment-metasilicate",
  label: "Water Treatment Sourcing Notes",
  kind: "Article",
};

const procurementArticle: ContextualLink = {
  href: "/blog/china-metasilicate-procurement",
  label: "China Sodium Metasilicate Procurement Guide",
  kind: "Article",
};

const distributorArticle: ContextualLink = {
  href: "/blog/sodium-metasilicate-distributor-guide",
  label: "Sodium Metasilicate Distributor Sourcing Guide",
  kind: "Article",
};

const pentahydrateMarketArticle: ContextualLink = {
  href: "/blog/sodium-metasilicate-pentahydrate-market-buyers",
  label: "Sodium Metasilicate Pentahydrate Market Buyer Guide",
  kind: "Article",
};

export const INTERNAL_LINK_GRAPH: Record<string, ContextualLink[]> = {
  "/products/sodium-metasilicate": [
    granules,
    anhydrous,
    pentahydrate,
    supplierGuide,
    detergentApplication,
    documents,
    distributorArticle,
    pentahydrateMarketArticle,
  ],
  "/products/sodium-metasilicate-granules": [
    hub,
    detergentApplication,
    detergentGuide,
    detergentArticle,
    priceGuide,
    documents,
    distributorArticle,
  ],
  "/products/sodium-metasilicate-anhydrous": [
    hub,
    detergentApplication,
    detergentGuide,
    priceGuide,
    procurementArticle,
    documents,
  ],
  "/products/sodium-metasilicate-pentahydrate": [
    hub,
    waterApplication,
    textileApplication,
    waterArticle,
    supplierGuide,
    documents,
    pentahydrateMarketArticle,
  ],
  "/products/sodium-silicate": [
    hub,
    waterApplication,
    paperApplication,
    priceGuide,
    documents,
  ],
  "/applications/detergent-industry": [hub, granules, detergentGuide, detergentArticle, documents],
  "/applications/water-treatment": [hub, pentahydrate, waterArticle, supplierGuide, documents],
  "/applications/textile-industry": [hub, pentahydrate, supplierGuide, certifications, documents],
  "/applications/paper-industry": [hub, priceGuide, supplierGuide, certifications, documents],
  "/guides/supplier-selection": [
    hub,
    factoryGuide,
    procurementArticle,
    distributorArticle,
    certifications,
    documents,
  ],
  "/guides/price-factors": [
    hub,
    granules,
    supplierGuide,
    procurementArticle,
    pentahydrateMarketArticle,
    documents,
  ],
  "/guides/uses-detergent": [
    hub,
    granules,
    detergentApplication,
    detergentArticle,
    comparisonGuide,
    documents,
  ],
  "/guides/sodium-metasilicate-vs-soda-ash": [hub, granules, detergentApplication, detergentGuide],
  "/guides/how-to-choose-china-factory": [hub, supplierGuide, procurementArticle, certifications, documents],
  "/blog/detergent-industry-metasilicate": [hub, granules, detergentApplication, detergentGuide, documents],
  "/blog/water-treatment-metasilicate": [hub, pentahydrate, waterApplication, supplierGuide, documents],
  "/blog/china-metasilicate-procurement": [
    hub,
    factoryGuide,
    supplierGuide,
    distributorArticle,
    certifications,
    documents,
  ],
  "/blog/sodium-metasilicate-distributor-guide": [
    hub,
    granules,
    anhydrous,
    pentahydrate,
    supplierGuide,
    documents,
  ],
  "/blog/sodium-metasilicate-pentahydrate-market-buyers": [
    hub,
    pentahydrate,
    priceGuide,
    waterApplication,
    supplierGuide,
    documents,
  ],
};

export function getContextualInternalLinks(path: string): ContextualLink[] {
  const links = INTERNAL_LINK_GRAPH[path];
  if (!links) return path === hub.href ? [documents] : [hub, documents];
  return links.filter((link) => link.href !== path);
}

export function getInternalLinkCoverage() {
  return Object.entries(INTERNAL_LINK_GRAPH).map(([path, links]) => ({
    path,
    outboundLinks: links.filter((link) => link.href !== path).length,
  }));
}

export function assertInternalLinkGraph(publicPaths: string[]): void {
  const publicPathSet = new Set(publicPaths);
  const graphPaths = new Set(Object.keys(INTERNAL_LINK_GRAPH));
  const expectedGraphPaths = publicPaths.filter(
    (path) =>
      path.startsWith("/products/") ||
      path.startsWith("/applications/") ||
      path.startsWith("/guides/") ||
      path.startsWith("/blog/")
  );
  const errors: string[] = [];

  for (const path of expectedGraphPaths) {
    if (!graphPaths.has(path)) errors.push(`Missing internal-link graph entry: ${path}`);
  }

  for (const [path, links] of Object.entries(INTERNAL_LINK_GRAPH)) {
    if (!publicPathSet.has(path)) errors.push(`Internal-link source is not public: ${path}`);
    const targets = links.map((link) => link.href);
    if (targets.includes(path)) errors.push(`Self-link found in internal-link graph: ${path}`);
    if (new Set(targets).size !== targets.length) errors.push(`Duplicate targets found for: ${path}`);
    if (targets.length < 4) errors.push(`Fewer than four contextual links for: ${path}`);
    for (const target of targets) {
      if (!publicPathSet.has(target)) errors.push(`Internal-link target is not public: ${target}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Internal-link graph validation failed:\n${errors.join("\n")}`);
  }
}
