"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ctaNameForType,
  trackCtaClick,
  trackEmailClick,
  trackWhatsappClick,
  type CtaType,
} from "@/lib/analytics";

export function TrackedMailto({
  email,
  children,
  className,
}: {
  email: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={() => trackEmailClick({ page: pathname })}
    >
      {children}
    </a>
  );
}

export function TrackedWhatsApp({
  phone,
  children,
  className,
}: {
  phone: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const digits = phone.replace(/[^0-9]/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsappClick({ page: pathname })}
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
  onClick,
}: {
  href: string;
  ctaType: CtaType;
  children: ReactNode;
  className?: string;
  location?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackCtaClick({
          page: pathname,
          cta_name: ctaNameForType(ctaType, location),
        });
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}
