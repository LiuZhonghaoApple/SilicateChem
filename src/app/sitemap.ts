import type { MetadataRoute } from "next";
import { intentGuides } from "@/content/guides/intent-pages";
import { products } from "@/content/products";
import { SITE } from "@/lib/constants";
import { SEO_KEYWORDS } from "@/lib/seo-keywords";
import { MONEY_PAGES } from "@/lib/seo-funnel";

/** Indexable static pages only — applications/blog/factory excluded (noindex or not priority). */
const INDEXABLE_STATIC = ["", "/about", "/contact", "/faq", "/products", "/guides"] as const;

function priorityForPath(path: string): number {
  if (path === "") return 1;
  if (path === SEO_KEYWORDS.sodiumMetasilicate.path) return 0.95;
  if ((MONEY_PAGES as readonly string[]).includes(path)) return 0.9;
  if (path === "/products") return 0.85;
  if (path === "/about" || path === "/contact" || path === "/faq") return 0.7;
  if (path === "/guides") return 0.75;
  if (path.startsWith("/guides/")) return 0.7;
  return 0.6;
}

function changeFrequencyForPath(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "" || path === SEO_KEYWORDS.sodiumMetasilicate.path) return "weekly";
  if ((MONEY_PAGES as readonly string[]).includes(path) || path === "/products") return "weekly";
  return "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const productPages = products.map((p) => `/products/${p.slug}`);
  const categoryPage = SEO_KEYWORDS.sodiumMetasilicate.path;
  const guidePages = intentGuides.map((g) => `/guides/${g.slug}`);

  const allPages = [
    ...INDEXABLE_STATIC,
    categoryPage,
    ...productPages.filter((p) => p !== categoryPage),
    ...guidePages,
  ];

  const unique = [...new Set(allPages)];

  return unique.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFrequencyForPath(path),
    priority: priorityForPath(path),
  }));
}
