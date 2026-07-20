import Image from "next/image";
import Link from "next/link";
import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { HomepageWhyChooseSection } from "@/components/trust/HomepageWhyChooseSection";
import { SiteExploreSection } from "@/components/seo/SiteExploreSection";
import { HomepageFactoryProofSection } from "@/components/home/HomepageFactoryProofSection";
import { HomepageHero } from "@/components/home/HomepageHero";
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
    description:
      "Inquiry-based hydrate grade review. Confirm specification, availability, packing and documents before quotation.",
    image: "/assets/images/product-cards/sodium-metasilicate-series.png",
    imageAlt: "Sodium metasilicate series product sample for nonahydrate inquiry",
    href: "/products/sodium-metasilicate",
    quoteProduct: "Sodium Metasilicate Nonahydrate",
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

type BuyerProfileIcon =
  | "network"
  | "handshake"
  | "factory"
  | "materials"
  | "mining"
  | "detergent";

type BuyerProfileUseCase = {
  title: string;
  description: string;
  companies: string[];
  regions: string[];
  href: string;
  icon: BuyerProfileIcon;
};

const buyerProfileUseCases: BuyerProfileUseCase[] = [
  {
    title: "Multi-country Manufacturing Groups",
    description: "Factories and production networks operating across multiple countries.",
    companies: ["Ceramic groups", "Regional factory networks"],
    regions: ["Africa", "Southeast Asia", "South Asia", "Latin America"],
    href: "/contact?type=quote&buyerProfile=Multi-country%20Manufacturing%20Groups",
    icon: "network",
  },
  {
    title: "Chemical Distributors & Importers",
    description: "Regional importers, distributors and chemical supply companies.",
    companies: ["Traders", "Stockists", "Wholesalers"],
    regions: ["North America", "Latin America", "Asia", "Africa", "Europe"],
    href: "/contact?type=quote&buyerProfile=Chemical%20Distributors%20%26%20Importers",
    icon: "handshake",
  },
  {
    title: "Industrial Manufacturers & End Users",
    description: "Factories buying directly for their own production processes.",
    companies: ["Industrial plants", "Formulation factories"],
    regions: ["Asia", "Latin America", "North America", "Europe"],
    href: "/contact?type=quote&buyerProfile=Industrial%20Manufacturers%20%26%20End%20Users",
    icon: "factory",
  },
  {
    title: "Ceramics & Building Materials Producers",
    description: "Ceramic, tile and building-material manufacturers.",
    companies: ["Ceramic plants", "Tile manufacturers"],
    regions: ["Africa", "South Asia", "Southeast Asia", "Latin America"],
    href: "/contact?type=quote&buyerProfile=Ceramics%20%26%20Building%20Materials%20Producers",
    icon: "materials",
  },
  {
    title: "Mining & Industrial Processing Companies",
    description: "Mining, underground engineering and mineral-processing buyers.",
    companies: ["Mining operators", "Processing plants"],
    regions: ["Africa", "Latin America", "North America", "Central Asia"],
    href: "/contact?type=quote&buyerProfile=Mining%20%26%20Industrial%20Processing%20Companies",
    icon: "mining",
  },
  {
    title: "Detergent & Cleaning Product Manufacturers",
    description: "Manufacturers of detergent, institutional cleaning and daily chemical products.",
    companies: ["Detergent factories", "Cleaning formulators"],
    regions: ["South Asia", "Southeast Asia", "Middle East", "Africa", "Latin America"],
    href: "/applications/detergent-industry",
    icon: "detergent",
  },
];

function BuyerProfileIcon({ type }: { type: BuyerProfileIcon }) {
  const paths = {
    network: (
      <>
        <circle cx="48" cy="47" r="22" fill="white" />
        <circle cx="48" cy="47" r="22" />
        <path d="M48 25c6 6.2 9 13.5 9 22s-3 15.8-9 22M48 25c-6 6.2-9 13.5-9 22s3 15.8 9 22M27 47h42" />
        <path d="M31 34c4.8 2.1 10.4 3.2 17 3.2S60.2 36.1 65 34M31 60c4.8-2.1 10.4-3.2 17-3.2S60.2 57.9 65 60" stroke="#2A86A5" />
        <path d="M23 67c6 5.2 14.3 8.4 25 8.4S67 72.2 73 67M23 27c6-5.2 14.3-8.4 25-8.4S67 21.8 73 27" stroke="#2A86A5" strokeDasharray="3 4" />
        <path d="M12 63h18v15H12zM66 63h18v15H66zM39 7h18v15H39z" fill="#EAF4FA" />
        <path d="M12 63h18v15H12zM66 63h18v15H66zM39 7h18v15H39z" />
        <path d="M16 63V53l6 5v-5l8 6M70 63V53l6 5v-5l8 6M43 7V2l6 5V2l8 6" />
        <path d="M17 72h3M23 72h3M71 72h3M77 72h3M44 16h3M50 16h3" stroke="#2A86A5" />
      </>
    ),
    handshake: (
      <>
        <path d="M10 51h36v22H10z" fill="#EAF4FA" />
        <path d="M10 51h36v22H10zM16 51v22M24 51v22M32 51v22M40 51v22" />
        <path d="M16 45h27l5 6H16z" fill="white" />
        <path d="M16 45h27l5 6H16z" />
        <path d="M54 33h15l10 10-9 9-16-15z" fill="#EAF4FA" />
        <path d="M42 37 54 25l8 8-13 13" fill="#EAF4FA" />
        <path d="M54 33h15l10 10-9 9-16-15zM42 37 54 25l8 8-13 13" />
        <path d="m45 44 10-8a6 6 0 0 1 7.4.2l5.6 4.5" />
        <path d="m43 49 17 16a4 4 0 0 0 6-5.2L55 49" />
        <path d="m36 54 12 11.5a4 4 0 0 0 6-5.2M50 22l-4-4M62 21l2-5M72 29l5-3" stroke="#2A86A5" />
      </>
    ),
    factory: (
      <>
        <path d="M11 68V32l13 8V30l14 9V23h16v45" fill="#EAF4FA" />
        <path d="M11 68V32l13 8V30l14 9V23h16v45M7 68h82" />
        <path d="M20 56h8M35 56h8M20 47h8M35 47h8M60 31h7M60 40h7" stroke="#2A86A5" />
        <path d="M16 76h44" />
        <path d="M18 72h8l5 4h24l5-4h8" fill="white" />
        <path d="M18 72h8l5 4h24l5-4h8" />
        <circle cx="72" cy="52" r="10" fill="white" />
        <path d="M72 38v5M72 61v5M58 52h5M81 52h5M62.2 42.2l3.6 3.6M78.2 58.2l3.6 3.6M81.8 42.2l-3.6 3.6M65.8 58.2l-3.6 3.6" stroke="#2A86A5" />
        <circle cx="72" cy="52" r="10" />
        <circle cx="72" cy="52" r="4" />
      </>
    ),
    materials: (
      <>
        <path d="M16 23h34v24H16z" fill="white" />
        <path d="M24 15h34v24H24zM34 31h34v24H34zM44 43h34v24H44z" fill="#EAF4FA" />
        <path d="M16 23h34v24H16zM24 15h34v24H24zM34 31h34v24H34zM44 43h34v24H44z" />
        <path d="M16 35h34M33 23v24M24 15v24M41 15v24M34 43h34M51 31v24M44 55h34M61 43v24" stroke="#2A86A5" />
        <path d="m60 48 8 8-8 8-8-8z" fill="white" />
        <path d="m60 48 8 8-8 8-8-8z" />
      </>
    ),
    mining: (
      <>
        <path d="M8 74 28 39l15 19 9-13 24 29H8Z" fill="#EAF4FA" />
        <path d="M8 74 28 39l15 19 9-13 24 29H8Z" />
        <path d="m28 39 3 20M43 58l-6 16M52 45l4 29" stroke="#2A86A5" />
        <path d="M18 31 32 19l7 7-16 17" fill="white" />
        <path d="M18 31 32 19l7 7-16 17M31 20l20 20" />
        <path d="M61 38h17v36H61z" fill="white" />
        <path d="M61 38h17v36H61zM64 47h11M64 56h11M58 74h23" />
        <path d="M65 32h9l4 6H61z" fill="#EAF4FA" />
        <path d="M65 32h9l4 6H61z" />
      </>
    ),
    detergent: (
      <>
        <path d="M18 32h28l7 11v34H15V43l3-11Z" fill="#EAF4FA" />
        <path d="M18 32h28l7 11v34H15V43l3-11Z" />
        <path d="M25 17h15v15H25z" fill="white" />
        <path d="M25 17h15v15H25zM24 51h20M24 58h14" />
        <path d="M60 56h18v21H60z" fill="white" />
        <path d="M60 56h18v21H60zM64 50h10v6H64z" />
        <circle cx="66" cy="26" r="4" fill="white" />
        <circle cx="76" cy="36" r="5" fill="white" />
        <circle cx="62" cy="43" r="3" fill="white" />
        <path d="M66 26h.1M76 36h.1M62 43h.1" />
        <path d="M50 70c7-1.4 12-5.1 15-11M52 44c5 .8 9.3 3.4 12.8 7.8" stroke="#2A86A5" />
      </>
    ),
  };

  return (
    <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-[#D7E6EF] bg-[#EAF4FA] text-[#0B2D5B] shadow-[inset_0_0_0_8px_rgba(255,255,255,0.72)] transition duration-300 group-hover:scale-105 group-hover:border-[#2A86A5] group-hover:bg-[#DFF2F7] group-hover:text-[#2A86A5]">
      <svg
        aria-hidden="true"
        className="h-24 w-24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 96 96"
      >
        {paths[type]}
      </svg>
    </span>
  );
}

type BuyerIntentGuideIcon =
  | "supplier"
  | "price"
  | "detergent"
  | "comparison"
  | "factory"
  | "download";

type BuyerIntentGuideCard = {
  title: string;
  href: string;
  cta: string;
  icon: BuyerIntentGuideIcon;
};

const buyerIntentGuideCards: BuyerIntentGuideCard[] = [
  {
    title: "Export Compliance Documents Download",
    href: "/downloads",
    cta: "Download files → Request quote",
    icon: "download",
  },
  {
    title: "How to Select a Sodium Metasilicate Supplier",
    href: "/guides/supplier-selection",
    cta: "Read guide → Request quote",
    icon: "supplier",
  },
  {
    title: "Sodium Metasilicate Price Factors — Factory Quotation Guide",
    href: "/guides/price-factors",
    cta: "Read guide → Request quote",
    icon: "price",
  },
  {
    title: "Sodium Metasilicate Uses in Detergent Manufacturing",
    href: "/guides/uses-detergent",
    cta: "Read guide → Request quote",
    icon: "detergent",
  },
  {
    title: "Sodium Metasilicate vs Soda Ash — Procurement Comparison",
    href: "/guides/sodium-metasilicate-vs-soda-ash",
    cta: "Read guide → Request quote",
    icon: "comparison",
  },
  {
    title: "How to Choose a Sodium Metasilicate Factory in China",
    href: "/guides/how-to-choose-china-factory",
    cta: "Read guide → Request quote",
    icon: "factory",
  },
];

function BuyerIntentGuideIcon({ type }: { type: BuyerIntentGuideIcon }) {
  const paths = {
    supplier: (
      <>
        <circle cx="20" cy="22" r="5.5" fill="white" />
        <circle cx="32" cy="18" r="6.5" fill="white" />
        <circle cx="44" cy="22" r="5.5" fill="white" />
        <path d="M12 43c1.4-6.8 6.2-10.2 14.2-10.2M23 43c1.2-8 7.2-12 9-12s7.8 4 9 12M37.8 32.8c8 0 12.8 3.4 14.2 10.2" />
        <path d="M20 27.5a5.5 5.5 0 1 1 0-11M32 24.5a6.5 6.5 0 1 1 0-13M44 27.5a5.5 5.5 0 1 0 0-11" />
        <path d="M15 49h34" stroke="#2A86A5" />
      </>
    ),
    price: (
      <>
        <path d="M15 17h25l11 11-25 25-11-11V17Z" fill="white" />
        <path d="M15 17h25l11 11-25 25-11-11V17Z" />
        <circle cx="24" cy="26" r="3" fill="#EAF4FA" />
        <path d="M33 28c-1.2-2-5.8-1.6-6.2 1-.6 4 8.8 2.2 8.2 6.5-.4 3-5.6 3.4-7.5.8M31.5 24v16" stroke="#2A86A5" />
        <path d="M41 20 52 9M45 22l8-8" />
      </>
    ),
    detergent: (
      <>
        <path d="M19 24h17l5 8v20H15V32l4-8Z" fill="white" />
        <path d="M19 24h17l5 8v20H15V32l4-8ZM22 14h11v10H22z" />
        <path d="M21 38h13M21 44h9" stroke="#2A86A5" />
        <path d="M43 37h10v15H43z" fill="#EAF4FA" />
        <path d="M43 37h10v15H43zM45 32h6v5" />
        <circle cx="48" cy="17" r="3" fill="white" />
        <circle cx="53" cy="25" r="2.5" fill="white" />
        <path d="M48 17h.1M53 25h.1" />
      </>
    ),
    comparison: (
      <>
        <path d="M32 13v38M18 21h28M32 21l-11 19M32 21l11 19" />
        <path d="M13 40h16c-.8 5.2-3.8 8-8 8s-7.2-2.8-8-8ZM35 40h16c-.8 5.2-3.8 8-8 8s-7.2-2.8-8-8Z" fill="#EAF4FA" />
        <path d="M13 40h16c-.8 5.2-3.8 8-8 8s-7.2-2.8-8-8ZM35 40h16c-.8 5.2-3.8 8-8 8s-7.2-2.8-8-8ZM23 55h18" />
        <path d="M17 34h8M39 34h8" stroke="#2A86A5" />
      </>
    ),
    factory: (
      <>
        <path d="M12 51V25l10 6v-6l11 7V20h13v31" fill="#EAF4FA" />
        <path d="M12 51V25l10 6v-6l11 7V20h13v31M9 51h46" />
        <path d="M19 42h6M31 42h6M19 36h6M31 36h6M40 27h5M40 33h5" stroke="#2A86A5" />
        <path d="M17 57h30" />
      </>
    ),
    download: (
      <>
        <path d="M18 10h22l8 8v36H18V10Z" fill="white" />
        <path d="M18 10h22l8 8v36H18V10ZM40 10v10h8" />
        <path d="M32 24v18M24 34l8 8 8-8" stroke="#2A86A5" />
        <path d="M24 48h16M24 18h8" />
      </>
    ),
  };

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#D7E6EF] bg-[#EAF4FA] text-[#0B2D5B] transition duration-300 group-hover:scale-105 group-hover:border-[#2A86A5] group-hover:bg-[#DFF2F7] group-hover:text-[#2A86A5]">
      <svg
        aria-hidden="true"
        className="h-9 w-9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
        viewBox="0 0 64 64"
      >
        {paths[type]}
      </svg>
    </span>
  );
}

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
        <HomepageWhyChooseSection />
      </Section>

      <Section>
        <SectionHeader
          title="Who We Serve"
          subtitle="Explore the buyer profiles and industries Zhongzhi supports with sodium metasilicate grades, documents, packing guidance, and RFQ preparation."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buyerProfileUseCases.map((useCase) => (
            <article
              key={useCase.title}
              className="group relative flex h-full min-h-[320px] overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2A86A5] hover:shadow-[0_18px_45px_rgba(42,134,165,0.16)]"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#EAF7FB]/70 to-transparent opacity-0 transition duration-700 group-hover:left-full group-hover:opacity-100" />
              <div className="relative flex h-full w-full flex-col gap-5">
                <div className="flex items-start gap-4">
                  <BuyerProfileIcon type={useCase.icon} />
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold leading-tight text-[#0B2D5B] transition-colors duration-300 group-hover:text-[#2A86A5]">
                      {useCase.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
                      {useCase.description}
                    </p>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#5A6570]">
                      Typical Companies
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {useCase.companies.map((company) => (
                        <span
                          key={company}
                          className="rounded border border-[#D7E6EF] bg-[#F2F8FB] px-3 py-1 text-xs font-bold text-[#1D6680]"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#5A6570]">
                      Common Regions
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {useCase.regions.map((region) => (
                        <span
                          key={region}
                          className="rounded border border-[#D7E6EF] bg-[#F7FAFC] px-3 py-1 text-xs font-bold text-[#1D6680]"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={useCase.href}
                    className="inline-flex w-fit items-center justify-center whitespace-nowrap text-sm font-bold text-[#1D6680] transition-colors hover:text-[#0B2D5B] hover:underline"
                  >
                    View Use Case → RFQ
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#D7E6EF] bg-gradient-to-r from-[#F2F8FB] to-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D7E6EF] bg-white text-[#0B2D5B]">
              <svg
                aria-hidden="true"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 4a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h1v-6H6v-1a6 6 0 0 1 12 0v1h-3v6h1a3 3 0 0 0 3-3v-4a7 7 0 0 0-7-7Z" />
                <path d="M13 20h2" />
              </svg>
            </span>
            <p className="text-sm leading-relaxed text-[#5A6570] sm:text-base">
              See your company profile here? Tell us your application, quantity and destination.
            </p>
          </div>
          <Link
            href="/contact?type=quote&product=Sodium%20Metasilicate"
            className="mt-5 inline-flex w-full items-center justify-center whitespace-nowrap rounded bg-[#1D7795] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0B2D5B] sm:mt-0 sm:w-auto"
          >
            Discuss Your Requirement →
          </Link>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Buyer Intent Guides"
          subtitle="Commercial procurement guides — each leads to product quotation."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buyerIntentGuideCards.map((guide) => (
            <article
              key={guide.title}
              className="group flex min-h-[260px] flex-col rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#2A86A5] hover:bg-[#F8FCFE] hover:shadow-[0_18px_45px_rgba(42,134,165,0.14)]"
            >
              <BuyerIntentGuideIcon type={guide.icon} />
              <h3 className="mt-6 text-lg font-bold leading-snug text-[#0B2D5B] transition-colors duration-300 group-hover:text-[#2A86A5]">
                {guide.title}
              </h3>
              <div className="mt-auto pt-6">
                <div className="mb-4 h-px w-full bg-[#D7E6EF]" />
                <Link
                  href={guide.href}
                  className="inline-flex w-fit items-center justify-center whitespace-nowrap text-sm font-bold text-[#1D6680] transition-colors hover:text-[#0B2D5B] hover:underline"
                >
                  {guide.cta}
                </Link>
              </div>
            </article>
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
