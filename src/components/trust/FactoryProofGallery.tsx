"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/Section";
import { factoryProofImages } from "@/content/trust";
import Link from "next/link";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";

function ProofImage({
  filename,
  alt,
  caption,
  description,
}: {
  filename: string;
  alt: string;
  caption: string;
  description: string;
}) {
  const src = `/images/trust/${filename}`;
  const [failed, setFailed] = useState(false);

  return (
    <figure className="rounded-lg border border-[#E2E6EA] overflow-hidden bg-[#F4F6F8]">
      <div className="aspect-video relative">
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center border border-dashed border-[#2E7D9A]/40">
            <p className="text-sm font-semibold text-[#0B2D5B]">{caption}</p>
            <p className="mt-1 text-xs text-[#5A6570] font-mono">public/images/trust/{filename}</p>
            <p className="mt-2 text-xs text-[#2E7D9A]">Replace with real photo before launch</p>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <figcaption className="p-4 bg-white">
        <p className="font-bold text-[#0B2D5B] text-sm">{caption}</p>
        <p className="mt-1 text-xs text-[#5A6570] leading-relaxed">{description}</p>
      </figcaption>
    </figure>
  );
}

type Props = {
  showHeader?: boolean;
  showMoneyPageLink?: boolean;
  className?: string;
};

export function FactoryProofGallery({
  showHeader = true,
  showMoneyPageLink = true,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Factory Proof — Production & Export"
          subtitle="On-site production, QC laboratory, packaging warehouse, and container loading."
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {factoryProofImages.map((img) => (
          <ProofImage key={img.filename} {...img} />
        ))}
      </div>
      {showMoneyPageLink && (
        <p className="mt-6 text-sm text-[#5A6570]">
          Factory inspection and video walkthrough available on request.{" "}
          <Link href={METASILICATE_CATEGORY_PATH} className="font-semibold text-[#2E7D9A] hover:underline">
            Request verification on manufacturer page →
          </Link>
        </p>
      )}
    </div>
  );
}
