import type { BlogPost } from "@/types";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

const hub = { slug: "sodium-metasilicate", label: "Sodium Metasilicate — Request Quotation" };
const granules = { slug: "sodium-metasilicate-granules", label: "Sodium Metasilicate Granules" };

/** Layer 4 — minimal supporting blog (3 articles). Not ranking priority; links to money page. */
export const blogPosts: BlogPost[] = [
  {
    slug: "detergent-industry-metasilicate",
    title: "Sodium Metasilicate for Detergent Industry Buyers",
    excerpt:
      "Brief notes for detergent procurement teams reviewing granule grade sodium metasilicate specifications, packing, and RFQ information.",
    date: "2026-01-10",
    readTime: "3 min",
    primaryKeyword: "sodium metasilicate detergent buyers",
    keywords: ["detergent chemical sourcing"],
    productLinks: [hub, granules],
    faq: [],
    sections: [
      {
        heading: "Grade and Volume",
        paragraphs: [
          "Powder detergent lines typically procure sodium metasilicate granules in FCL volumes. Verify iron content and color stability before volume contracts.",
          "For specifications, grade options, packing, documents, and quotation requirements, see our sodium metasilicate product page.",
        ],
      },
    ],
  },
  {
    slug: "water-treatment-metasilicate",
    title: "Sodium Metasilicate in Water Treatment — Sourcing Notes",
    excerpt:
      "Short guide for water treatment chemical producers evaluating sodium metasilicate grades for formulation and bulk supply.",
    date: "2026-01-08",
    readTime: "3 min",
    primaryKeyword: "sodium metasilicate water treatment sourcing",
    keywords: ["water treatment chemical supply"],
    productLinks: [hub, { slug: "sodium-metasilicate-pentahydrate", label: "Pentahydrate Grade" }],
    faq: [],
    sections: [
      {
        heading: "Grade Selection",
        paragraphs: [
          "Pentahydrate suits controlled dissolution in treatment blends. Granules work for dry-blend packages with bulk handling requirements.",
          "Request quotation with your grade, volume, packing preference, destination port, and required documents on the product page.",
        ],
      },
    ],
  },
  {
    slug: "china-metasilicate-procurement",
    title: "Procuring Sodium Metasilicate from China — Quick Reference",
    excerpt:
      "Supporting reference for importers: specification review, documents, packing, loading, and RFQ process for Chinese sodium metasilicate supply.",
    date: "2026-01-05",
    readTime: "3 min",
    primaryKeyword: "procure sodium metasilicate china",
    keywords: ["import metasilicate china"],
    productLinks: [hub],
    faq: [],
    sections: [
      {
        heading: "RFQ Process",
        paragraphs: [
          "Send grade, quantity, packaging, and destination port. Request sample COA and test sample before FCL commitment.",
          "Review supplier selection and quotation guides, then submit product grade, packing, loading, and document requirements on the product page.",
        ],
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** All blog product links should resolve; hub uses category path */
export const BLOG_HUB_PATH = METASILICATE_CATEGORY_PATH;
