/**
 * Stable content version used by sitemap, structured data, and IndexNow.
 * Update an individual path override when its visible content changes.
 */
export const GEO_BASELINE_LAST_MODIFIED = "2026-07-22T00:00:00+08:00";

const CONTENT_LAST_MODIFIED_OVERRIDES: Record<string, string> = {};

export function getContentLastModified(path: string): string {
  return CONTENT_LAST_MODIFIED_OVERRIDES[path] ?? GEO_BASELINE_LAST_MODIFIED;
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
