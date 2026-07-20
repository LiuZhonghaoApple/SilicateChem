import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { InternalProductLinks } from "@/components/seo/InternalProductLinks";
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo/JsonLd";
import { blogPosts, getBlogPostBySlug } from "@/content/blog/posts";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        url={`${SITE.url}/blog/${post.slug}`}
        datePublished={post.date}
      />
      <FAQSchema items={post.faq} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Blog", url: `${SITE.url}/blog` },
          { name: post.title, url: `${SITE.url}/blog/${post.slug}` },
        ]}
      />

      <PageHeader
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />

      <Section>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#5A6570] mb-8">
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

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {post.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-bold text-[#0B2D5B]">{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-[#5A6570] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}

            {post.productLinks.length > 0 && (
              <div className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-6">
                <h3 className="font-bold text-[#0B2D5B]">Related Products</h3>
                <ul className="mt-3 space-y-2">
                  {post.productLinks.map((link) => (
                    <li key={link.slug}>
                      <Link
                        href={`/products/${link.slug}`}
                        className="text-sm font-semibold text-[#2E7D9A] hover:underline"
                      >
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {post.faq.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#0B2D5B] mb-4">FAQ</h2>
                <div className="space-y-3">
                  {post.faq.map((item) => (
                    <details
                      key={item.question}
                      className="group rounded-lg border border-[#E2E6EA] bg-white"
                    >
                      <summary className="cursor-pointer px-5 py-3 font-semibold text-[#0B2D5B] text-sm list-none">
                        {item.question}
                      </summary>
                      <div className="px-5 pb-3 text-sm text-[#5A6570] border-t border-[#E2E6EA] pt-2">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <InternalProductLinks showFunnel />
        </div>

        <ProductFunnelBanner className="mt-10" />
        <div className="mt-6 rounded-2xl border border-[#D7E6EF] bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#0B2D5B]">
            Need sodium metasilicate quotation details?
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#5A6570]">
            Send grade, quantity, packing, destination port and document requirements
            for practical quotation review.
          </p>
          <Link
            href="/contact?type=quote&product=Sodium%20Metasilicate"
            className="mt-5 inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
          >
            Request Quote
          </Link>
        </div>
      </Section>
    </>
  );
}
