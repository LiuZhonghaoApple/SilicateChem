import Link from "next/link";
import { SITE } from "@/lib/constants";

export function FastContactBar({ product }: { product?: string }) {
  const params = new URLSearchParams();
  params.set("type", "quote");
  if (product) params.set("product", product);
  const quoteHref = `/contact?${params.toString()}`;
  const contactHref = product
    ? `/contact?product=${encodeURIComponent(product)}`
    : "/contact";

  return (
    <div className="border-y border-[#E2E6EA] bg-[#F4F6F8]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-[#5A6570]">
          <span className="font-semibold text-[#0B2D5B]">Fast contact:</span>{" "}
          <a href={`mailto:${SITE.email}`} className="text-[#2E7D9A] hover:underline">
            {SITE.email}
          </a>
          {" · "}
          Factory-direct quotation within 1–2 business days
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={quoteHref}
            className="rounded bg-[#0B2D5B] px-4 py-2 text-xs font-bold text-white hover:bg-[#071F3F]"
          >
            Request Quote
          </Link>
          <Link
            href={contactHref}
            className="rounded border border-[#0B2D5B] px-4 py-2 text-xs font-bold text-[#0B2D5B] hover:bg-white"
          >
            Contact Factory
          </Link>
        </div>
      </div>
    </div>
  );
}
