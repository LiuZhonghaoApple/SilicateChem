"use client";

import type { ReactNode } from "react";
import { ENABLE_IMAGE_VISUAL_DEBUG } from "@/lib/trust/image-deployment";

type Props = {
  src: string;
  component: string;
  page?: string;
  children: ReactNode;
  className?: string;
};

export function ImageDebugWrapper({
  src,
  component,
  page,
  children,
  className = "",
}: Props) {
  if (!ENABLE_IMAGE_VISUAL_DEBUG) {
    return <>{children}</>;
  }

  const label = src.replace("/images/", "").replace(".webp", "");

  return (
    <div
      className={`relative group ${className}`}
      data-image-src={src}
      data-image-component={component}
      data-image-page={page}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded ring-2 ring-fuchsia-500/80 ring-inset"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute left-1 top-1 z-20 max-w-[calc(100%-0.5rem)] rounded bg-fuchsia-600/90 px-1.5 py-0.5 text-[9px] font-mono leading-tight text-white shadow">
        <span className="block truncate">{label}</span>
        <span className="block truncate opacity-90">{component}</span>
      </div>
    </div>
  );
}

export function logImageMount(src: string, component: string, page?: string) {
  if (!ENABLE_IMAGE_VISUAL_DEBUG || typeof window === "undefined") return;
  console.debug(`[image-debug] ${src} → ${component}${page ? ` (${page})` : ""}`);
}
