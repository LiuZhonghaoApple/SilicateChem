import Link from "next/link";
import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { blogPosts } from "@/content/blog/posts";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Resources — Sodium Metasilicate",
  description:
    "Supporting notes for B2B buyers. Primary quotation on the sodium metasilicate manufacturer page.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Blog", url: `${SITE.url}/blog` },
        ]}
      />
      <PageHeader
        title="Resources"
        description="Minimal supporting notes. Request factory-direct quotation on the sodium metasilicate manufacturer page."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <Section>
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-lg border border-[#E2E6EA] p-6 md:p-8 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6570]">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.readTime} read</span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-[#0B2D5B]">
                <Link href={`/blog/${post.slug}`} className="hover:text-[#2E7D9A]">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-[#5A6570] leading-relaxed">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-semibold text-[#2E7D9A] hover:underline"
              >
                Read article →
              </Link>
            </article>
          ))}
        </div>
        <PageCTAs className="mt-10" />
      </Section>
    </>
  );
}
