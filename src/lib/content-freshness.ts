export const GEO_BASELINE_LAST_MODIFIED = "2026-07-22T00:00:00+08:00";

export type ContentRelease = {
  lastModified: string;
};

/**
 * Required release registry for every indexable sitemap path.
 *
 * Publishing rule:
 * 1. Add every new indexable path here before it enters the sitemap.
 * 2. Change only that path's date when buyer-visible content changes.
 * 3. Do not change dates for rebuilds, deployments, or backend-only work.
 * 4. The sitemap build fails if its paths and this registry diverge.
 */
export const CONTENT_RELEASES: Readonly<Record<string, ContentRelease>> = {
  "": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/about": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/contact": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/faq": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/export": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/certifications": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/downloads": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/products": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/guides": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/applications": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/blog": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/products/sodium-metasilicate": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/products/sodium-metasilicate-granules": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/products/sodium-metasilicate-anhydrous": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/products/sodium-metasilicate-pentahydrate": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/products/sodium-silicate": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/guides/supplier-selection": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/guides/price-factors": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/guides/uses-detergent": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/guides/sodium-metasilicate-vs-soda-ash": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/guides/how-to-choose-china-factory": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/applications/detergent-industry": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/applications/water-treatment": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/applications/textile-industry": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/applications/paper-industry": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/blog/detergent-industry-metasilicate": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/blog/water-treatment-metasilicate": { lastModified: GEO_BASELINE_LAST_MODIFIED },
  "/blog/china-metasilicate-procurement": { lastModified: GEO_BASELINE_LAST_MODIFIED },
};

export function getContentLastModified(path: string): string {
  const release = CONTENT_RELEASES[path];
  if (!release) {
    throw new Error(`Missing content release date for indexable path: ${path || "/"}`);
  }
  return release.lastModified;
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

export function assertContentFreshnessCoverage(paths: readonly string[]): void {
  const sitemapPaths = new Set(paths);
  const registeredPaths = new Set(Object.keys(CONTENT_RELEASES));
  const missing = [...sitemapPaths].filter((path) => !registeredPaths.has(path));
  const stale = [...registeredPaths].filter((path) => !sitemapPaths.has(path));

  if (missing.length > 0 || stale.length > 0) {
    throw new Error(
      `Content release registry mismatch. Missing: ${missing.join(", ") || "none"}; stale: ${stale.join(", ") || "none"}`
    );
  }

  for (const [path, release] of Object.entries(CONTENT_RELEASES)) {
    const value = new Date(release.lastModified);
    if (Number.isNaN(value.getTime())) {
      throw new Error(`Invalid content release date for ${path || "/"}: ${release.lastModified}`);
    }
  }
}

export function getContentReleaseTimeline(): Array<{
  date: string;
  count: number;
  paths: string[];
}> {
  const groups = new Map<string, string[]>();

  for (const [path, release] of Object.entries(CONTENT_RELEASES)) {
    const date = release.lastModified.slice(0, 10);
    const paths = groups.get(date) ?? [];
    paths.push(path || "/");
    groups.set(date, paths);
  }

  return [...groups.entries()]
    .map(([date, paths]) => ({ date, count: paths.length, paths: paths.sort() }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
