"use client";

import { TrackedCtaLink } from "@/components/analytics/TrackedLinks";

export function PageCTAs({
  product,
  className = "",
  light = false,
  size = "default",
}: {
  product?: string;
  className?: string;
  light?: boolean;
  size?: "default" | "lg";
}) {
  const quoteHref = product
    ? `/contact?type=quote&product=${encodeURIComponent(product)}`
    : "/contact?type=quote";
  const tdsHref = product
    ? `/contact?type=tds&product=${encodeURIComponent(product)}`
    : "/contact?type=tds";

  const sizeClass =
    size === "lg"
      ? "px-7 py-3.5 text-base"
      : "px-5 py-2.5 text-sm";

  const quoteClass = light
    ? "bg-white text-[#0B2D5B] hover:bg-blue-50 border border-white shadow-sm"
    : "bg-[#0B2D5B] text-white hover:bg-[#071F3F] shadow-sm";
  const contactClass = light
    ? "bg-[#2E7D9A] text-white hover:bg-[#3a9bb8] border border-[#2E7D9A] shadow-sm"
    : "bg-[#2E7D9A] text-white hover:bg-[#256880] shadow-sm";
  const tdsClass = light
    ? "bg-transparent text-white border-2 border-white/90 hover:bg-white/10"
    : "bg-white text-[#0B2D5B] border border-[#0B2D5B] hover:bg-[#F4F6F8]";

  const linkBase = `inline-flex items-center justify-center font-bold rounded transition-colors ${sizeClass}`;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <TrackedCtaLink
        href={quoteHref}
        ctaType="quote"
        location="page_ctas"
        className={`${linkBase} ${quoteClass}`}
      >
        Request Quote
      </TrackedCtaLink>
      <TrackedCtaLink
        href="/contact?type=contact"
        ctaType="contact"
        location="page_ctas"
        className={`${linkBase} ${contactClass}`}
      >
        Contact Factory
      </TrackedCtaLink>
      <TrackedCtaLink
        href={tdsHref}
        ctaType="tds"
        location="page_ctas"
        className={`${linkBase} ${tdsClass}`}
      >
        Get TDS / MSDS
      </TrackedCtaLink>
    </div>
  );
}
