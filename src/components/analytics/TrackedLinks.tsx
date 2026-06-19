"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  trackCtaClick,
  trackEmailClick,
  trackWhatsAppClick,
  type CtaType,
} from "@/lib/analytics";
import { getRfqContext } from "@/lib/page-rfq-context";

function usePageTracking(location?: string) {
  const pathname = usePathname();
  const ctx = getRfqContext(pathname);
  return {
    pathname,
    pageSource: ctx.source ?? pathname,
    productInterest: ctx.product,
    location,
  };
}

export function TrackedMailto({
  email,
  children,
  className,
  location = "mailto",
}: {
  email: string;
  children: ReactNode;
  className?: string;
  location?: string;
}) {
  const { pathname, pageSource, productInterest } = usePageTracking(location);

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={() =>
        trackEmailClick({
          pagePath: pathname,
          pageSource,
          productInterest,
          location,
        })
      }
    >
      {children}
    </a>
  );
}

export function TrackedWhatsApp({
  phone,
  children,
  className,
  location = "whatsapp",
}: {
  phone: string;
  children: ReactNode;
  className?: string;
  location?: string;
}) {
  const { pathname, pageSource, productInterest } = usePageTracking(location);
  const digits = phone.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackWhatsAppClick({
          pagePath: pathname,
          pageSource,
          productInterest,
          location,
        })
      }
    >
      {children}
    </a>
  );
}

export function TrackedCtaLink({
  href,
  ctaType,
  children,
  className,
  location,
  product,
}: {
  href: string;
  ctaType: CtaType;
  children: ReactNode;
  className?: string;
  location?: string;
  product?: string;
}) {
  const pathname = usePathname();
  const ctx = getRfqContext(pathname);

  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackCtaClick({
          ctaType,
          pagePath: pathname,
          pageSource: ctx.source ?? pathname,
          productInterest: product ?? ctx.product,
          location,
        })
      }
    >
      {children}
    </Link>
  );
}
