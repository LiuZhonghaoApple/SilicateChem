"use client";

import Link from "next/link";
import { useState } from "react";
import { TrackedCtaLink } from "@/components/analytics/TrackedLinks";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E6EA] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#0B2D5B] text-white text-xs font-bold">
            SC
          </div>
          <div>
            <span className="text-lg font-bold text-[#0B2D5B]">{SITE.name}</span>
            <span className="hidden sm:block text-xs text-[#5A6570]">
              Sodium Metasilicate Manufacturer
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#5A6570] hover:text-[#0B2D5B] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <TrackedCtaLink
            href="/contact?type=quote"
            ctaType="quote"
            location="header"
            className="rounded bg-[#0B2D5B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#071F3F] transition-colors"
          >
            Request Quote
          </TrackedCtaLink>
        </nav>

        <button
          type="button"
          className="lg:hidden p-2 text-[#0B2D5B]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[#E2E6EA] bg-white px-4 py-4">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#5A6570] hover:text-[#0B2D5B] py-1"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <TrackedCtaLink
              href="/contact?type=quote"
              ctaType="quote"
              location="header_mobile"
              className="mt-2 rounded bg-[#0B2D5B] px-4 py-2.5 text-sm font-semibold text-white text-center"
              onClick={() => setOpen(false)}
            >
              Request Quote
            </TrackedCtaLink>
          </div>
        </nav>
      )}
    </header>
  );
}
