"use client";

import { useState } from "react";
import { LazyImage } from "@/components/ui/LazyImage";
import type { ImageEntry } from "@/content/site-images";

type Props = {
  images: ImageEntry[];
  className?: string;
  priority?: boolean;
};

/** Rotates through hero banner images without changing page copy. */
export function HomepageHeroBackground({ images, className = "" }: Props) {
  const [index] = useState(0);
  const entry = images[index] ?? images[0];

  if (!entry) return null;

  return (
    <LazyImage
      src={entry.src}
      alt={entry.alt}
      priority
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}

export function HomepageImageStrip({
  images,
  className = "",
}: Omit<Props, "priority">) {
  if (images.length === 0) return null;

  return (
    <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {images.map((entry) => (
        <LazyImage
          key={entry.src}
          src={entry.src}
          alt={entry.alt}
          aspect="video"
          className="rounded-lg border border-[#E2E6EA]"
        />
      ))}
    </div>
  );
}

export function DeploymentImageGrid({
  images,
  className = "",
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  images: ImageEntry[];
  className?: string;
  columns?: string;
}) {
  if (images.length === 0) return null;

  return (
    <div className={`grid gap-4 ${columns} ${className}`}>
      {images.map((entry) => (
        <LazyImage
          key={entry.src}
          src={entry.src}
          alt={entry.alt}
          aspect="video"
          className="rounded-lg border border-[#E2E6EA]"
        />
      ))}
    </div>
  );
}
