import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { products } from "@/content/products";
import { isProductCasVerified } from "@/content/trust/product-trust";

export function HomeProductTrustCards({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <SectionHeader
        title="Product Trust Cards"
        subtitle="Factory-manufactured grades with verified CAS references in export trade data."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.slug}
            className="rounded-lg border border-[#E2E6EA] bg-white p-5 flex flex-col"
          >
            <h3 className="font-bold text-[#0B2D5B] text-sm">{product.name}</h3>
            <p className="mt-2 text-xs text-[#5A6570] flex-grow">{product.summary}</p>
            {product.cas && isProductCasVerified(product.cas) && (
              <p className="mt-2 text-xs font-semibold text-[#2E7D9A]">
                CAS {product.cas} · verified in trade data
              </p>
            )}
            <Link
              href={`/products/${product.slug}`}
              className="mt-3 text-xs font-bold text-[#2E7D9A] hover:underline"
            >
              View product proof →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Compact RFQ CTA block for homepage trust section. */
export function HomeTrustRfqBlock({
  product,
  className = "",
}: {
  product?: string;
  className?: string;
}) {
  const quoteHref = product
    ? `/contact?type=quote&product=${encodeURIComponent(product)}`
    : "/contact?type=quote";

  return (
    <div
      className={`rounded-lg border border-[#0B2D5B]/20 bg-[#0B2D5B] p-8 text-center ${className}`}
    >
      <h3 className="text-xl font-bold text-white">Ready to Verify & Quote?</h3>
      <p className="mt-2 text-sm text-blue-100 max-w-xl mx-auto">
        Submit RFQ with grade, quantity, packaging, and destination port. COA/TDS/SDS available on request.
      </p>
      <Link
        href={quoteHref}
        className="mt-5 inline-flex items-center justify-center rounded bg-white px-6 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-blue-50 transition-colors"
      >
        Submit RFQ
      </Link>
    </div>
  );
}
