"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E6EA] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full items-center justify-between px-3 py-3 sm:px-4 lg:pl-6 lg:pr-6 xl:pl-8 2xl:pl-12 min-[1560px]:max-w-[1720px]">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/assets/images/zhongzhi-logo-nav.png"
            alt="Zhongzhi logo"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded object-contain"
            priority
          />
          <div className="flex w-[224px] shrink-0 flex-col justify-center leading-tight">
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

        <nav className="hidden items-center gap-2 min-[1560px]:flex 2xl:gap-3">
          <div className="flex items-center gap-1 2xl:gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="origin-center transform-gpu whitespace-nowrap rounded-full px-2 py-1.5 text-[15px] font-semibold text-[#5A6570] transition-all duration-300 ease-out hover:scale-[1.15] hover:bg-[#EAF4FA] hover:text-[#0B2D5B] hover:shadow-sm 2xl:px-2.5 2xl:text-[16px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact?type=quote"
            className="whitespace-nowrap rounded bg-[#0B2D5B] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#071F3F] 2xl:px-6 2xl:text-sm"
          >
            Request Quote
          </Link>
        </nav>

        <button
          type="button"
          className="p-2 text-[#0B2D5B] min-[1560px]:hidden"
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
        <nav className="border-t border-[#E2E6EA] bg-white px-4 py-4 min-[1560px]:hidden">
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
