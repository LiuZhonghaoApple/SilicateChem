import Image from "next/image";
import Link from "next/link";
import { TrackedCtaLink } from "@/components/analytics/TrackedLinks";
import { SITE } from "@/lib/constants";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";

const HERO_IMAGE = "/images/home/hero-lab-sodium-metasilicate.webp";
const HERO_ALT =
  "White sodium metasilicate granules in laboratory QC testing — Shandong Zhongzhi Chemical";

export function HomepageHero() {
  const quoteHref = `/contact?type=quote&product=${encodeURIComponent(
    sodiumMetasilicateCategory.inquiryProductName
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#0B2D5B] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center md:py-20">
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D9A]">
            {SITE.company}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Reliable Sodium Metasilicate Manufacturer
          </h1>
          <p className="mt-4 text-lg font-medium text-blue-50 md:text-xl">
            Industrial Grade Sodium Metasilicate
            <br className="hidden sm:block" />
            <span className="sm:ml-0"> Verified Quality • Stable Supply • Global Export</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedCtaLink
              href={quoteHref}
              ctaType="quote"
              location="homepage_hero"
              product={sodiumMetasilicateCategory.inquiryProductName}
              className="inline-flex items-center justify-center rounded bg-white px-7 py-3.5 text-base font-bold text-[#0B2D5B] shadow-sm transition-colors hover:bg-blue-50"
            >
              Request a Quote
            </TrackedCtaLink>
            <Link
              href={METASILICATE_CATEGORY_PATH}
              className="inline-flex items-center justify-center rounded border-2 border-white/90 bg-transparent px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10"
            >
              View Products
            </Link>
          </div>
        </div>

        <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/15 shadow-2xl md:aspect-[5/4]">
          <Image
            src={HERO_IMAGE}
            alt={HERO_ALT}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B2D5B]/25 to-transparent" />
        </div>
      </div>
    </section>
  );
}
