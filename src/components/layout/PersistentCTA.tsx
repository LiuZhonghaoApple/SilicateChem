"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/constants";
import { trackCtaClick } from "@/lib/analytics";
import { TrackedWhatsApp } from "@/components/analytics/TrackedLinks";
import { getRfqContext, rfqContactHref } from "@/lib/page-rfq-context";

function onCtaClick(
  type: "quote" | "sample" | "tds",
  pathname: string,
  ctx: ReturnType<typeof getRfqContext>,
  location: string
) {
  trackCtaClick({
    ctaType: type,
    pagePath: pathname,
    pageSource: ctx.source ?? pathname,
    productInterest: ctx.product,
    location,
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
          onClick={() => onCtaClick("quote", pathname, ctx, "sticky_bar")}
          className="flex-1 rounded bg-white py-2.5 text-center text-sm font-bold text-[#0B2D5B] md:flex-none md:px-6"
        >
          Request Quote
        </Link>
        <Link
          href={rfqContactHref("sample", ctx)}
          onClick={() => onCtaClick("sample", pathname, ctx, "sticky_bar")}
          className="hidden sm:block flex-1 rounded bg-[#2E7D9A] py-2.5 text-center text-sm font-bold text-white md:flex-none md:px-5"
        >
          Request Sample
        </Link>
        <Link
          href={rfqContactHref("tds", ctx)}
          onClick={() => onCtaClick("tds", pathname, ctx, "sticky_bar")}
          className="hidden md:block flex-1 rounded border border-white/80 py-2.5 text-center text-sm font-bold text-white md:flex-none md:px-5 hover:bg-white/10"
        >
          Get COA / MSDS / TDS
        </Link>
        <TrackedWhatsApp
          phone={SITE.whatsapp}
          location="sticky_bar"
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

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end md:bottom-24 md:right-6">
      {open && (
        <div
          id="whatsapp-chat-panel"
          role="dialog"
          aria-label="WhatsApp contact"
          className="mb-3 w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-[#DDE7E1] bg-white shadow-2xl"
        >
          <div className="flex items-center gap-3 rounded-t-2xl bg-[#128C7E] px-4 py-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.44L3 20.5l1.56-4.82A8.5 8.5 0 1 1 20.5 11.5Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8.6 8.2c.8 2.45 2.75 4.4 5.2 5.2l1.2-1.2 2.2.7v2.1c0 .55-.45 1-1 1A8.2 8.2 0 0 1 8 7.8c0-.55.45-1 1-1h2.1l.7 2.2-1.2 1.2"
                />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold">WhatsApp</p>
              <p className="text-xs text-white/80">Online sales support</p>
            </div>
          </div>
          <div className="p-4">
            <div className="rounded-xl bg-[#F0F2F5] px-4 py-3 text-sm leading-6 text-[#334155]">
              Hello! How can we help with your sodium metasilicate inquiry?
            </div>
            <p className="mt-3 text-xs font-medium text-[#5A6570]">WhatsApp: {SITE.whatsapp}</p>
            <TrackedWhatsApp
              phone={SITE.whatsapp}
              location="floating_widget"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1FBD59]"
            >
              Start WhatsApp Chat
            </TrackedWhatsApp>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#1FBD59]"
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        aria-expanded={open}
        aria-controls="whatsapp-chat-panel"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.44L3 20.5l1.56-4.82A8.5 8.5 0 1 1 20.5 11.5Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8.6 8.2c.8 2.45 2.75 4.4 5.2 5.2l1.2-1.2 2.2.7v2.1c0 .55-.45 1-1 1A8.2 8.2 0 0 1 8 7.8c0-.55.45-1 1-1h2.1l.7 2.2-1.2 1.2"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
