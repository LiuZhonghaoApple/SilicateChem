import Link from "next/link";
import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { blogPosts } from "@/content/blog/posts";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Technical Notes — Sodium Metasilicate",
  description:
    "Supporting sodium metasilicate notes for detergent, water treatment, and China procurement research. Continue to product specifications and RFQ when ready.",
  path: "/blog",
  noIndex: true,
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
        title="Technical Notes"
        description="Short supporting notes for sodium metasilicate applications and procurement research. These pages support product evaluation but are not the main quotation pages."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <Section>
        <SectionHeader
          title="Supporting Reading"
          subtitle="Use these short notes to clarify application context, then continue to product specifications, documents, or quotation."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2A86A5] hover:shadow-[0_16px_34px_rgba(42,134,165,0.12)]"
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
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5A6570]">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 border-t border-[#E2E6EA] pt-4 text-sm font-bold text-[#2E7D9A] hover:underline"
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
