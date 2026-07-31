import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { SEO_KEYWORDS } from "@/lib/seo-keywords";
import { MONEY_PAGES } from "@/lib/seo-funnel";
import {
  assertContentFreshnessCoverage,
  getContentLastModifiedDate,
  getIndexablePaths,
} from "@/lib/content-freshness";
import { assertInternalLinkGraph } from "@/lib/seo/internal-link-graph";

function priorityForPath(path: string): number {
  if (path === SEO_KEYWORDS.sodiumMetasilicate.path) return 1.0;
  if (path === "") return 0.95;
  if ((MONEY_PAGES as readonly string[]).includes(path)) return 0.9;
  if (path === "/products") return 0.85;
  if (path.startsWith("/guides/")) return 0.8;
  if (path === "/guides") return 0.75;
  if (path.startsWith("/blog/")) return 0.7;
  if (path === "/blog") return 0.7;
  if (path.startsWith("/applications/")) return 0.6;
  if (path === "/applications") return 0.65;
  if (
    path === "/about" ||
    path === "/contact" ||
    path === "/faq" ||
    path === "/export" ||
    path === "/certifications" ||
    path === "/downloads" ||
    path === "/blog"
  )
    return 0.7;
  return 0.6;
}

function changeFrequencyForPath(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "" || path === SEO_KEYWORDS.sodiumMetasilicate.path) return "weekly";
  if ((MONEY_PAGES as readonly string[]).includes(path) || path === "/products") return "weekly";
  if (path.startsWith("/guides/") || path.startsWith("/applications/") || path.startsWith("/blog/")) return "monthly";
  return "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const unique = getIndexablePaths();
  assertContentFreshnessCoverage(unique);
  assertInternalLinkGraph(unique);

  return unique.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: getContentLastModifiedDate(path),
    changeFrequency: changeFrequencyForPath(path),
    priority: priorityForPath(path),
  }));
}
