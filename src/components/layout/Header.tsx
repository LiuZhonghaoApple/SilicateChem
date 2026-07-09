"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E6EA] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-3 py-3 sm:px-4 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-4">
          <Image
            src="/assets/images/zhongzhi-logo-nav.png"
            alt="Zhongzhi logo"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded object-contain"
            priority
          />
          <div className="flex w-[260px] shrink-0 flex-col justify-center leading-tight">
            <span className="flex w-full justify-between whitespace-nowrap text-lg font-bold text-[#0B2D5B]">
              <span>Zhongzhi</span>
              <span>Chemical</span>
              <span>Technology</span>
            </span>
            <span className="whitespace-nowrap text-sm font-medium tracking-[0.01em] text-[#5A6570]">
              Sodium Metasilicate Manufacturer
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex 2xl:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[13px] font-semibold text-[#5A6570] transition-colors hover:text-[#0B2D5B] 2xl:text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact?type=quote"
            className="whitespace-nowrap rounded bg-[#0B2D5B] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#071F3F] 2xl:px-6 2xl:text-sm"
          >
            Request Quote
          </Link>
        </nav>

        <button
          type="button"
          className="p-2 text-[#0B2D5B] xl:hidden"
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
        <nav className="border-t border-[#E2E6EA] bg-white px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap py-1 text-sm font-semibold text-[#5A6570] hover:text-[#0B2D5B]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact?type=quote"
              className="mt-2 whitespace-nowrap rounded bg-[#0B2D5B] px-4 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Request Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
