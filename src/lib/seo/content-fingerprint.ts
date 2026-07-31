import { createHash } from "node:crypto";
import { getProductBySlug } from "@/content/products";
import { getIntentGuideBySlug } from "@/content/guides/intent-pages";
import { getIndustryApplicationBySlug } from "@/content/applications/industries";
import { getBlogPostBySlug } from "@/content/blog/posts";

/**
 * Per-page content fingerprint.
 *
 * Page "freshness" timestamps come from the git history of SHARED data files
 * (e.g. src/content/products/index.ts backs every /products/* page), so editing
 * one product used to bump the content_version of ALL product pages and reset
 * every page's GEO review status — wiping reviewer stamps for pages whose
 * content never changed.
 *
 * This hashes only the content actually belonging to a single path, so the GEO
 * review reset fires when THAT page's content really changed. Paths with no
 * collection-backed content (static pages) fall back to null, in which case the
 * caller keeps using the timestamp.
 */
export function getContentFingerprint(path: string): string | null {
  const normalized = path || "/";
  const slugOf = (prefix: string) =>
    normalized.startsWith(prefix) ? normalized.slice(prefix.length) : null;

  let payload: unknown;

  const productSlug = slugOf("/products/");
  if (productSlug) payload = getProductBySlug(productSlug);

  const guideSlug = slugOf("/guides/");
  if (guideSlug) payload = getIntentGuideBySlug(guideSlug);

  const applicationSlug = slugOf("/applications/");
  if (applicationSlug) payload = getIndustryApplicationBySlug(applicationSlug);

  const blogSlug = slugOf("/blog/");
  if (blogSlug) payload = getBlogPostBySlug(blogSlug);

  if (payload === undefined || payload === null) return null;

  return createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex")
    .slice(0, 32);
}
