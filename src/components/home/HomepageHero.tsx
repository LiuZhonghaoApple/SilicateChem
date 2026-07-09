import Link from "next/link";
import Image from "next/image";
import { TrackedCtaLink } from "@/components/analytics/TrackedLinks";
import { SITE } from "@/lib/constants";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { sodiumMetasilicateCategory } from "@/content/sodium-metasilicate-category";

export function HomepageHero() {
  const quoteHref = `/contact?type=quote&product=${encodeURIComponent(
    sodiumMetasilicateCategory.inquiryProductName
  )}`;

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#0B2D5B] text-white md:aspect-[1916/821] md:min-h-[560px] lg:min-h-[620px]">
      <Image
        src="/assets/images/home-hero-visual-bg-clear.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-[#0B2D5B]/85 via-[#0B2D5B]/45 to-[#0B2D5B]/10"
        aria-hidden="true"
      />
      <div className="relative z-20 flex h-full w-full items-center px-4 py-16 sm:px-6 md:justify-start md:py-0 md:pl-[10vw] lg:pl-[11vw] xl:pl-[12vw]">
        <div className="max-w-[560px]">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#7FD6E8]">
            {SITE.company}
          </p>
          <h1 className="mt-4 text-[26px] font-bold leading-[1.14] tracking-tight sm:text-3xl md:text-5xl">
            Reliable Sodium
            <br />
            <span className="whitespace-nowrap">Metasilicate Manufacturer</span>
          </h1>
          <p className="mt-6 text-lg font-medium text-blue-50 md:mt-8 md:text-xl">
            Industrial Grade Sodium Metasilicate
            <br className="hidden sm:block" />
            <span className="sm:ml-0"> Verified Quality • Stable Supply • Global Export</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
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
      </div>
    </section>
  );
}
