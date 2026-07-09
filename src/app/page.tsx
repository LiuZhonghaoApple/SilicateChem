import Image from "next/image";
import Link from "next/link";
import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { TrustLayer } from "@/components/trust/TrustLayer";
import { TrustStack } from "@/components/trust/TrustStack";
import { SiteExploreSection } from "@/components/seo/SiteExploreSection";
import { HomepageFactoryProofSection } from "@/components/home/HomepageFactoryProofSection";
import { HomepageHero } from "@/components/home/HomepageHero";
import { products } from "@/content/products";
import { industryApplications } from "@/content/applications/industries";
import { intentGuides } from "@/content/guides/intent-pages";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";
import { createMetadata } from "@/lib/metadata";
import { SEO_KEYWORDS } from "@/lib/seo-keywords";

export const metadata = createMetadata({
  title: SEO_KEYWORDS.homepage.title,
  description: SEO_KEYWORDS.homepage.description,
  path: "/",
  primaryKeyword: SEO_KEYWORDS.homepage.primary,
  keywords: ["factory direct sodium metasilicate export"],
});

const cat = sodiumMetasilicateCategory;

type HomepageProductCard = {
  englishName: string;
  chineseName: string;
  label: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  quoteProduct: string;
  temporaryImage?: boolean;
};

type HomepageFormCard = {
  englishName: string;
  chineseName: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

const metasilicateGradeCards: HomepageProductCard[] = [
  {
    englishName: "Anhydrous Sodium Metasilicate",
    chineseName: "无水偏硅酸钠",
    label: "Factory Advantage",
    description: "Factory-direct anhydrous grade specifications and quotation support.",
    image: "/assets/images/product-cards/sodium-metasilicate-anhydrous.png",
    imageAlt: "Anhydrous sodium metasilicate product sample",
    href: "/products/sodium-metasilicate-anhydrous",
    quoteProduct: "Anhydrous Sodium Metasilicate",
  },
  {
    englishName: "Sodium Metasilicate Pentahydrate",
    chineseName: "五水偏硅酸钠",
    label: "Hot Export Grade",
    description: "Common export grade for industrial cleaning and detergent applications.",
    image: "/assets/images/product-cards/sodium-metasilicate-pentahydrate.png",
    imageAlt: "Sodium metasilicate pentahydrate product sample",
    href: "/products/sodium-metasilicate-pentahydrate",
    quoteProduct: "Sodium Metasilicate Pentahydrate",
  },
  {
    englishName: "Sodium Metasilicate Nonahydrate",
    chineseName: "九水偏硅酸钠",
    label: "Available by Inquiry",
    description: "Inquiry-based supply using the metasilicate series page until the grade page is ready.",
    image: "/assets/images/product-cards/sodium-metasilicate-nonahydrate-placeholder.png",
    imageAlt: "Temporary sodium metasilicate series image for nonahydrate inquiry",
    // TODO: replace placeholder image and link after creating real nonahydrate product page.
    href: "/products/sodium-metasilicate",
    quoteProduct: "Sodium Metasilicate Nonahydrate",
    temporaryImage: true,
  },
];

const availableFormCards: HomepageFormCard[] = [
  {
    englishName: "Powder",
    chineseName: "粉末",
    description: "Available for selected sodium metasilicate grades.",
    image: "/assets/images/product-cards/instant-powder.png",
    imageAlt: "Powder form sodium metasilicate option",
    href: "/products/sodium-metasilicate",
  },
  {
    englishName: "Granules",
    chineseName: "颗粒",
    description: "Granular form for easier handling and dosing.",
    image: "/assets/images/product-cards/anhydrous-Granular.png",
    imageAlt: "Granular sodium metasilicate form option",
    href: "/products/sodium-metasilicate",
  },
  {
    englishName: "Crystal",
    chineseName: "晶体状",
    description: "Crystalline form available for selected sodium metasilicate grades.",
    image: "/assets/images/product-cards/product-form-crystal.png",
    imageAlt: "Crystal form sodium metasilicate option",
    href: "/products/sodium-metasilicate",
  },
];

const sodiumSilicateCard = {
  englishName: "Liquid Sodium Silicate",
  chineseName: "液体硅酸钠",
  label: "Related Product Line",
  description:
    "Related silicate product line, commonly supplied in liquid form for industrial applications.",
  chineseDescription: "相关硅酸盐产品线，常以液体形态用于工业应用。",
  image: "/assets/images/product-cards/liquid-01.png",
  imageAlt: "Liquid sodium silicate related product line",
  href: "/products/sodium-silicate",
  quoteProduct: "Liquid Sodium Silicate",
};

export default function HomePage() {
  return (
    <>
      <HomepageHero />

      <Section background="grey">
        <HomepageFactoryProofSection />
      </Section>

      <Section>
        <SectionHeader
          title="Primary Product — Request Quotation"
          subtitle="Scientific product grouping for sodium metasilicate grades, available forms, and the related sodium silicate line."
        />
        <div className="space-y-12">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0B2D5B]">
                Sodium Metasilicate Series
                <span className="ml-2 text-base font-semibold text-[#5A6570]">/ 偏硅酸钠系列</span>
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5A6570]">
                Factory supply for anhydrous, pentahydrate and nonahydrate sodium metasilicate
                grades.
                <span className="block">工厂供应无水、五水、九水偏硅酸钠规格。</span>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {metasilicateGradeCards.map((card) => (
                <article
                  key={card.englishName}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E2E6EA] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <Link href={card.href} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F6F8]">
                      <Image
                        src={card.image}
                        alt={card.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="mb-3 inline-flex w-fit rounded-full bg-[#2E7D9A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2E7D9A]">
                      {card.label}
                    </span>
                    <h4 className="text-lg font-bold leading-tight text-[#0B2D5B] transition-colors group-hover:text-[#2E7D9A]">
                      <Link href={card.href}>
                        {card.englishName}
                        <span className="mt-1 block text-sm font-semibold text-[#5A6570]">
                          {card.chineseName}
                        </span>
                      </Link>
                    </h4>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5A6570]">
                      {card.description}
                    </p>
                    {card.temporaryImage && (
                      <p className="mt-3 text-xs font-semibold text-[#8A6D1D]">
                        Temporary series image pending real nonahydrate product photo.
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href={card.href}
                        className="text-sm font-bold text-[#2E7D9A] hover:underline"
                      >
                        Specifications →
                      </Link>
                      <Link
                        href={`/contact?type=quote&product=${encodeURIComponent(card.quoteProduct)}`}
                        className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-4 py-2 text-sm font-bold text-white hover:bg-[#071F3F]"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0B2D5B]">
                Available Forms
                <span className="ml-2 text-base font-semibold text-[#5A6570]">/ 可供形态</span>
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5A6570]">
                Powder, granules and crystal forms are available for selected sodium metasilicate
                grades.
                <span className="block">粉末、颗粒、晶体状适用于部分偏硅酸钠规格。</span>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availableFormCards.map((card) => (
                <article
                  key={card.englishName}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#D9E2EA] bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <Link href={card.href} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F6F8]">
                      <Image
                        src={card.image}
                        alt={card.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="mb-3 inline-flex w-fit rounded-full bg-[#F4F6F8] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#5A6570]">
                      Product Form
                    </span>
                    <h4 className="text-lg font-bold leading-tight text-[#0B2D5B] transition-colors group-hover:text-[#2E7D9A]">
                      <Link href={card.href}>
                        {card.englishName}
                        <span className="mt-1 block text-sm font-semibold text-[#5A6570]">
                          {card.chineseName}
                        </span>
                      </Link>
                    </h4>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5A6570]">
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      className="mt-5 text-sm font-bold text-[#2E7D9A] hover:underline"
                    >
                      View Options →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#0B2D5B]">
                Sodium Silicate
                <span className="ml-2 text-base font-semibold text-[#5A6570]">/ 硅酸钠</span>
              </h3>
            </div>
            <article className="grid overflow-hidden rounded-xl border border-[#E2E6EA] bg-white shadow-sm md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <Link href={sodiumSilicateCard.href} className="block">
                <div className="relative aspect-[4/3] h-full min-h-[260px] overflow-hidden bg-[#F4F6F8]">
                  <Image
                    src={sodiumSilicateCard.image}
                    alt={sodiumSilicateCard.imageAlt}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <span className="mb-4 inline-flex w-fit rounded-full bg-[#2E7D9A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#2E7D9A]">
                  {sodiumSilicateCard.label}
                </span>
                <h4 className="text-2xl font-bold leading-tight text-[#0B2D5B]">
                  <Link href={sodiumSilicateCard.href}>
                    {sodiumSilicateCard.englishName}
                    <span className="mt-1 block text-base font-semibold text-[#5A6570]">
                      {sodiumSilicateCard.chineseName}
                    </span>
                  </Link>
                </h4>
                <p className="mt-4 text-sm leading-relaxed text-[#5A6570]">
                  {sodiumSilicateCard.description}
                  <span className="block">{sodiumSilicateCard.chineseDescription}</span>
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={sodiumSilicateCard.href}
                    className="text-sm font-bold text-[#2E7D9A] hover:underline"
                  >
                    View Product Line →
                  </Link>
                  <Link
                    href={`/contact?type=quote&product=${encodeURIComponent(sodiumSilicateCard.quoteProduct)}`}
                    className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-4 py-2 text-sm font-bold text-white hover:bg-[#071F3F]"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Why Zhongzhi"
          subtitle="Verified factory scale, partial export customs data, and product trust — factory-direct manufacturer in Changyi, Shandong."
        />
        <div className="space-y-12">
          <TrustLayer
            variant="homepage"
            product={products.find((p) => p.slug === "sodium-metasilicate-granules")}
            inquiryProductName={cat.inquiryProductName}
          />
          <TrustStack compact />
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Industry Use Cases"
          subtitle="Mid-funnel pages — each links to factory-direct quotation."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {industryApplications.map((app) => (
            <Link
              key={app.slug}
              href={`/applications/${app.slug}`}
              className="block rounded-lg border border-[#E2E6EA] bg-white p-5 hover:shadow-sm"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{app.title}</h3>
              <p className="mt-3 text-xs font-semibold text-[#2E7D9A]">View use case → RFQ</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Buyer Intent Guides"
          subtitle="Commercial procurement guides — each leads to product quotation."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {intentGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block rounded-lg border border-[#E2E6EA] bg-white p-5 hover:shadow-sm"
            >
              <h3 className="font-bold text-[#0B2D5B] text-sm">{guide.title}</h3>
              <p className="mt-3 text-xs font-semibold text-[#2E7D9A]">Read guide → Request quote</p>
            </Link>
          ))}
        </div>
      </Section>

      <SiteExploreSection />

      <Section background="blue">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Submit RFQ — Sodium Metasilicate
          </h2>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            Grade, quantity, packaging, destination port. Factory response within 1–2 business days.
          </p>
          <PageCTAs product={cat.inquiryProductName} className="mt-8 justify-center" light size="lg" />
        </div>
      </Section>
    </>
  );
}
