import { industryApplications } from "@/content/applications/industries";
import { blogPosts } from "@/content/blog/posts";
import { intentGuides } from "@/content/guides/intent-pages";
import { products } from "@/content/products";
import { SEO_KEYWORDS } from "@/lib/seo-keywords";
import freshnessData from "./content-freshness.data.json";

/**
 * Per-page "last updated" dates are DERIVED, not hand-maintained.
 *
 * `content-freshness.data.json` is regenerated on every build by
 * `scripts/generate-content-freshness.mjs`, which records the most recent git
 * commit time for each source file. Here we map each indexable URL to the
 * source file(s) that render it and take their newest commit time. That value
 * feeds the sitemap `lastmod`, JSON-LD `dateModified`, and the /admin/analytics
 * freshness card — so publishing new content updates every date automatically,
 * with no registry to keep in sync.
 *
 * Fallback: if git history is unavailable at build time (empty data file) or a
 * path resolves to files not yet in history, we use GEO_BASELINE_LAST_MODIFIED.
 */
export const GEO_BASELINE_LAST_MODIFIED = "2026-07-22T00:00:00+08:00";

const FILE_DATES = freshnessData as Readonly<Record<string, string>>;

const APP_DIR = "src/app";

// Shared content-data files that back each collection. When any of these change,
// the collection's pages are considered updated.
const PRODUCT_DATA = [
  "src/content/products/index.ts",
  "src/content/product-main-images.ts",
  "src/content/sodium-metasilicate-category.ts",
];
const GUIDE_DATA = ["src/content/guides/intent-pages.ts"];
const APPLICATION_DATA = ["src/content/applications/industries.ts"];
const BLOG_DATA = ["src/content/blog/posts.ts"];

const CATEGORY_PATH = SEO_KEYWORDS.sodiumMetasilicate.path;

/** Repo-relative source files whose git history defines a path's freshness. */
function sourceFilesForPath(path: string): string[] {
  if (path === "") return [`${APP_DIR}/page.tsx`];

  // The metasilicate category has its own dedicated route folder.
  if (path === CATEGORY_PATH) {
    return [`${APP_DIR}/products/sodium-metasilicate/page.tsx`, ...PRODUCT_DATA];
  }

  if (path.startsWith("/products/")) return [`${APP_DIR}/products/[slug]/page.tsx`, ...PRODUCT_DATA];
  if (path.startsWith("/guides/")) return [`${APP_DIR}/guides/[slug]/page.tsx`, ...GUIDE_DATA];
  if (path.startsWith("/applications/")) return [`${APP_DIR}/applications/[slug]/page.tsx`, ...APPLICATION_DATA];
  if (path.startsWith("/blog/")) return [`${APP_DIR}/blog/[slug]/page.tsx`, ...BLOG_DATA];

  if (path === "/products") return [`${APP_DIR}/products/page.tsx`, ...PRODUCT_DATA];
  if (path === "/guides") return [`${APP_DIR}/guides/page.tsx`, ...GUIDE_DATA];
  if (path === "/applications") return [`${APP_DIR}/applications/page.tsx`, ...APPLICATION_DATA];
  if (path === "/blog") return [`${APP_DIR}/blog/page.tsx`, ...BLOG_DATA];

  // Remaining simple static pages: /about, /manufacturing, /contact, /faq,
  // /export, /certifications, /downloads.
  return [`${APP_DIR}${path}/page.tsx`];
}

/** Indexable static pages (no dynamic slug). */
const INDEXABLE_STATIC = [
  "",
  "/about",
  "/manufacturing",
  "/contact",
  "/faq",
  "/export",
  "/certifications",
  "/downloads",
  "/products",
  "/guides",
  "/applications",
  "/blog",
] as const;

/** The full set of indexable URLs — the single source of truth for the sitemap. */
export function getIndexablePaths(): string[] {
  const productPages = products.map((p) => `/products/${p.slug}`);
  const guidePages = intentGuides.map((g) => `/guides/${g.slug}`);
  const applicationPages = industryApplications.map((a) => `/applications/${a.slug}`);
  const blogPages = blogPosts.map((p) => `/blog/${p.slug}`);

  return [
    ...new Set([
      ...INDEXABLE_STATIC,
      CATEGORY_PATH,
      ...productPages,
      ...guidePages,
      ...applicationPages,
      ...blogPages,
    ]),
  ];
}

export function getContentLastModified(path: string): string {
  let best: string | null = null;
  let bestMs = -Infinity;

  for (const file of sourceFilesForPath(path)) {
    const iso = FILE_DATES[file];
    if (!iso) continue;
    const ms = new Date(iso).getTime();
    if (ms > bestMs) {
      bestMs = ms;
      best = iso;
    }
  }

  return best ?? GEO_BASELINE_LAST_MODIFIED;
}

export function getContentLastModifiedDate(path: string): Date {
  return new Date(getContentLastModified(path));
}

export function formatContentDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

/** Guards that every indexable path resolves to a valid, parseable date. */
export function assertContentFreshnessCoverage(paths: readonly string[]): void {
  for (const path of paths) {
    const value = new Date(getContentLastModified(path));
    if (Number.isNaN(value.getTime())) {
      throw new Error(`Invalid derived content date for ${path || "/"}`);
    }
  }
}

export function getContentReleaseTimeline(): Array<{
  date: string;
  count: number;
  paths: string[];
}> {
  const groups = new Map<string, string[]>();

  for (const path of getIndexablePaths()) {
    // Shanghai calendar day: derived dates carry the +08:00 offset, so the
    // leading 10 chars are already the local date.
    const date = getContentLastModified(path).slice(0, 10);
    const paths = groups.get(date) ?? [];
    paths.push(path || "/");
    groups.set(date, paths);
  }

  return [...groups.entries()]
    .map(([date, paths]) => ({ date, count: paths.length, paths: paths.sort() }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
