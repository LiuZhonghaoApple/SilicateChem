import { industryApplications } from "@/content/applications/industries";
import { intentGuides } from "@/content/guides/intent-pages";
import { products } from "@/content/products";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

/**
 * Single source of truth for "does this internal path actually exist?".
 *
 * Content files carry link targets as plain strings, so a renamed slug would
 * otherwise ship a silent 404. Every module that renders a caller-supplied
 * href should gate it through `hasRoute()` and degrade to unlinked text.
 */

export type RouteKind =
  | "static"
  | "product"
  | "application"
  | "guide";

export type ResolvedRoute = {
  path: string;
  kind: RouteKind;
};

/** App-router pages that exist without a dynamic segment. */
const STATIC_ROUTES = [
  "/",
  "/about",
  "/applications",
  "/blog",
  "/certifications",
  "/contact",
  "/downloads",
  "/export",
  "/factory",
  "/faq",
  "/guides",
  "/manufacturing",
  "/products",
] as const;

/** Strips query, hash and trailing slash so lookups are comparable. */
function normalize(path: string): string {
  return path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
}

/**
 * Resolves a path to its route entry, or `null` when no such page is built.
 */
export function getRoute(path: string): ResolvedRoute | null {
  const clean = normalize(path);

  if ((STATIC_ROUTES as readonly string[]).includes(clean)) {
    return { path: clean, kind: "static" };
  }
  // Category hub owns its own route folder, outside the product collection.
  if (clean === METASILICATE_CATEGORY_PATH) {
    return { path: clean, kind: "product" };
  }
  if (products.some((p) => `/products/${p.slug}` === clean)) {
    return { path: clean, kind: "product" };
  }
  if (industryApplications.some((a) => `/applications/${a.slug}` === clean)) {
    return { path: clean, kind: "application" };
  }
  if (intentGuides.some((g) => `/guides/${g.slug}` === clean)) {
    return { path: clean, kind: "guide" };
  }

  return null;
}

/** True when the path resolves to a real, built page. */
export function hasRoute(path: string): boolean {
  return getRoute(path) !== null;
}

/** Alias of `hasRoute` for call sites that read better as a predicate. */
export function isKnownRoute(path: string): boolean {
  return hasRoute(path);
}
