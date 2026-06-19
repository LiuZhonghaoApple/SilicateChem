"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/constants";
import { ctaNameForType, trackCtaClick } from "@/lib/analytics";
import { TrackedMailto, TrackedWhatsApp } from "@/components/analytics/TrackedLinks";
import { getRfqContext, rfqContactHref } from "@/lib/page-rfq-context";

function onCtaClick(
  type: "quote" | "sample" | "tds",
  pathname: string,
  location: string
) {
  trackCtaClick({
    page: pathname,
    cta_name: ctaNameForType(type, location),
  });
}

export function StickyQuoteBar() {
  const pathname = usePathname();
  const ctx = getRfqContext(pathname);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#0B2D5B] bg-[#0B2D5B] px-4 py-3">
      <div className="mx-auto flex max-w-6xl gap-2 md:gap-3">
        <Link
          href={rfqContactHref("quote", ctx)}
          onClick={() => onCtaClick("quote", pathname, "sticky_bar")}
          className="flex-1 rounded bg-white py-2.5 text-center text-sm font-bold text-[#0B2D5B] md:flex-none md:px-6"
        >
          Request Quote
        </Link>
        <Link
          href={rfqContactHref("sample", ctx)}
          onClick={() => onCtaClick("sample", pathname, "sticky_bar")}
          className="hidden sm:block flex-1 rounded bg-[#2E7D9A] py-2.5 text-center text-sm font-bold text-white md:flex-none md:px-5"
        >
          Request Sample
        </Link>
        <Link
          href={rfqContactHref("tds", ctx)}
          onClick={() => onCtaClick("tds", pathname, "sticky_bar")}
          className="hidden md:block flex-1 rounded border border-white/80 py-2.5 text-center text-sm font-bold text-white md:flex-none md:px-5 hover:bg-white/10"
        >
          Get COA / MSDS / TDS
        </Link>
        <TrackedWhatsApp
          phone={SITE.whatsapp}
          className="flex-1 rounded bg-[#2E7D9A] py-2.5 text-center text-sm font-bold text-white sm:hidden"
        >
          WhatsApp
        </TrackedWhatsApp>
      </div>
    </div>
  );
}

export function FloatingContactWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ctx = getRfqContext(pathname);

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-24 md:right-6">
      {open && (
        <div className="mb-3 w-56 rounded-lg border border-[#E2E6EA] bg-white p-4 shadow-lg">
          <p className="text-sm font-bold text-[#0B2D5B]">RFQ — Contact Factory</p>
          <p className="mt-1 text-xs text-[#5A6570]">{ctx.product}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href={rfqContactHref("quote", ctx)}
                onClick={() => onCtaClick("quote", pathname, "floating_widget")}
                className="text-[#2E7D9A] hover:underline font-medium"
              >
                Request Quotation →
              </Link>
            </li>
            <li>
              <Link
                href={rfqContactHref("sample", ctx)}
                onClick={() => onCtaClick("sample", pathname, "floating_widget")}
                className="text-[#2E7D9A] hover:underline font-medium"
              >
                Request Sample →
              </Link>
            </li>
            <li>
              <Link
                href={rfqContactHref("tds", ctx)}
                onClick={() => onCtaClick("tds", pathname, "floating_widget")}
                className="text-[#2E7D9A] hover:underline font-medium"
              >
                Get COA / MSDS / TDS →
              </Link>
            </li>
            <li>
              <TrackedMailto email={SITE.email} className="text-[#5A6570] hover:underline">
                {SITE.email}
              </TrackedMailto>
            </li>
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2E7D9A] text-white shadow-lg hover:bg-[#256880] transition-colors"
        aria-label="Open RFQ contact options"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
