import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { ProductFunnelBanner } from "@/components/seo/FunnelSections";
import { ContextualInternalLinks } from "@/components/seo/ContextualInternalLinks";
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo/JsonLd";
import { blogPosts, getBlogPostBySlug } from "@/content/blog/posts";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";
import { formatContentDate, getContentLastModified } from "@/lib/content-freshness";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return createMetadata({
    title: post.metaTitle ?? post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    primaryKeyword: post.primaryKeyword,
    keywords: post.keywords,
    image: post.heroImage ? `${SITE.url}${post.heroImage.src}` : undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const dateModified = getContentLastModified(path);

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        url={`${SITE.url}${path}`}
        datePublished={post.date}
        dateModified={dateModified}
        image={post.heroImage ? `${SITE.url}${post.heroImage.src}` : undefined}
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
          <span>·</span>
          <time dateTime={dateModified}>Updated {formatContentDate(dateModified)}</time>
        </div>

        {post.heroImage ? (
          <figure className="mb-10 overflow-hidden rounded-2xl border border-[#D7E6EF] bg-[#F4F6F8] shadow-sm">
            <div className="relative aspect-[16/9]">
              <Image
                src={post.heroImage.src}
                alt={post.heroImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 1100px, 100vw"
                className={post.heroImage.fit === "contain" ? "object-contain" : "object-cover"}
              />
            </div>
            <figcaption className="border-t border-[#D7E6EF] bg-white px-5 py-3 text-sm text-[#64748B]">
              {post.heroImage.caption}
            </figcaption>
          </figure>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {post.keyTakeaways?.length ? (
              <aside className="rounded-2xl border border-[#B8DCE8] bg-[#F4FBFD] p-6">
                <h2 className="text-xl font-bold text-[#0B2D5B]">Buyer Takeaways</h2>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#475569]">
                  {post.keyTakeaways.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            {post.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-bold text-[#0B2D5B]">{section.heading}</h2>
                {section.image ? (
                  <figure className="mt-5 overflow-hidden rounded-xl border border-[#D7E6EF] bg-[#F4F6F8]">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={section.image.src}
                        alt={section.image.alt}
                        fill
                        sizes="(min-width: 1024px) 760px, 100vw"
                        className={section.image.fit === "contain" ? "object-contain" : "object-cover"}
                      />
                    </div>
                    <figcaption className="border-t border-[#D7E6EF] bg-white px-4 py-2.5 text-xs text-[#64748B]">
                      {section.image.caption}
                    </figcaption>
                  </figure>
                ) : null}
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-[#5A6570] leading-relaxed">
                    {p}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="mt-4 space-y-2 rounded-xl border border-[#E2E6EA] bg-[#F8FAFC] p-5 text-sm leading-relaxed text-[#475569]">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
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

          <ContextualInternalLinks currentPath={path} />
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
