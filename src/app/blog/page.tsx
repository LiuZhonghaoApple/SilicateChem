import Image from "next/image";
import Link from "next/link";
import { PageHeader, PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { blogPosts } from "@/content/blog/posts";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

const newestBlogPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

export const metadata = createMetadata({
  title: "Sodium Metasilicate Procurement Blog",
  description:
    "Sodium metasilicate blog for distributors, importers, formulators and procurement teams reviewing grades, markets, applications, documents, packing, and RFQs.",
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
        title="Sodium Metasilicate Procurement Blog"
        description="Buyer guides for chemical distributors, importers, detergent manufacturers, formulators and procurement teams reviewing sodium metasilicate grades, markets, documents, packing, and RFQ details."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <Section>
        <SectionHeader
          title="Buyer-Focused Articles"
          subtitle="Use these articles to clarify application fit, grade selection, document requirements, packing questions, and quotation details before sending an RFQ."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {newestBlogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex h-full flex-col rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2A86A5] hover:shadow-[0_16px_34px_rgba(42,134,165,0.12)]"
            >
              {post.heroImage ? (
                <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden rounded-t-2xl bg-[#F4F6F8]">
                  <Image
                    src={post.heroImage.src}
                    alt={post.heroImage.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className={post.heroImage.fit === "contain" ? "object-contain" : "object-cover"}
                  />
                </div>
              ) : null}
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
