"use client";

import { TrackedCtaLink } from "@/components/analytics/TrackedLinks";
import type { Product } from "@/types";

type StrongCTAProps = {
  product?: string;
  light?: boolean;
  className?: string;
};

export function StrongCTA({ product, light = false, className = "" }: StrongCTAProps) {
  const q = product ? `&product=${encodeURIComponent(product)}` : "";
  const base = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded transition-colors";

  const quote = light
    ? `${base} bg-white text-[#0B2D5B] hover:bg-blue-50 border border-white`
    : `${base} bg-[#0B2D5B] text-white hover:bg-[#071F3F]`;
  const sample = light
    ? `${base} bg-[#2E7D9A] text-white hover:bg-[#256880] border border-[#2E7D9A]`
    : `${base} bg-[#2E7D9A] text-white hover:bg-[#256880]`;
  const docs = light
    ? `${base} bg-transparent text-white border-2 border-white/80 hover:bg-white/10`
    : `${base} bg-white text-[#0B2D5B] border border-[#0B2D5B] hover:bg-[#F4F6F8]`;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <TrackedCtaLink
        href={`/contact?type=quote${q}`}
        ctaType="quote"
        location="strong_cta"
        product={product}
        className={quote}
      >
        Request Quotation
      </TrackedCtaLink>
      <TrackedCtaLink
        href={`/contact?type=sample${q}`}
        ctaType="sample"
        location="strong_cta"
        product={product}
        className={sample}
      >
        Request Sample
      </TrackedCtaLink>
      <TrackedCtaLink
        href={`/contact?type=tds${q}`}
        ctaType="tds"
        location="strong_cta"
        product={product}
        className={docs}
      >
        Get COA / MSDS / TDS
      </TrackedCtaLink>
    </div>
  );
}

type ComparisonRow = {
  factor: string;
  chinaFactory: string;
  traders: string;
  overseas: string;
};

const DEFAULT_COMPARISON_ROWS: ComparisonRow[] = [
  { factor: "Pricing", chinaFactory: "Factory-direct — no trader margin", traders: "Intermediary markup", overseas: "Higher regional premiums" },
  { factor: "Production capacity", chinaFactory: "100,000+ tons/year", traders: "No production control", overseas: "Limited regional capacity" },
  { factor: "Bulk FCL supply", chinaFactory: "Standard MOQ ~20 MT", traders: "Same source, higher price", overseas: "Higher per-ton cost" },
  { factor: "Specification control", chinaFactory: "In-house QC, batch COA", traders: "Depends on upstream", overseas: "Premium for equivalent spec" },
  { factor: "Export documentation", chinaFactory: "COA, TDS, MSDS per shipment", traders: "Documentation fees common", overseas: "Import documentation costs" },
  { factor: "Combined grade orders", chinaFactory: "Granules + anhydrous + pentahydrate + silicate", traders: "Often single-SKU", overseas: "Limited grade range" },
];

export function SupplyComparisonTable({ rows = DEFAULT_COMPARISON_ROWS }: { rows?: ComparisonRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#E2E6EA]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0B2D5B] text-white">
            <th className="px-4 py-3 text-left font-semibold">Factor</th>
            <th className="px-4 py-3 text-left font-semibold">China Factory Direct</th>
            <th className="px-4 py-3 text-left font-semibold">Trading Companies</th>
            <th className="px-4 py-3 text-left font-semibold">Overseas Suppliers</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.factor} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F6F8]"}>
              <td className="px-4 py-3 font-medium text-[#0B2D5B]">{row.factor}</td>
              <td className="px-4 py-3 text-[#5A6570]">{row.chinaFactory}</td>
              <td className="px-4 py-3 text-[#5A6570]">{row.traders}</td>
              <td className="px-4 py-3 text-[#5A6570]">{row.overseas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductConversionSections({ product }: { product: Product }) {
  return (
    <>
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2D5B]">
            Why Global Buyers Source {product.shortName} from China
          </h2>
          <p className="mt-3 text-[#5A6570] max-w-3xl leading-relaxed">
            Procurement teams choose Chinese manufacturers for bulk sodium metasilicate when
            factory-direct pricing, production scale, and export reliability outweigh regional
            sourcing premiums from EU or US distributors.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Price Advantage",
                text: "Factory-direct supply from Shandong eliminates trader margins common in EU/US distribution channels. Bulk FCL orders achieve lower per-ton cost at equivalent purity specifications.",
              },
              {
                title: "Production Scale",
                text: "100,000+ tons annual capacity supports recurring volume contracts. Granule production is our highest-output line — suitable for detergent manufacturers with continuous demand.",
              },
              {
                title: "Export Quality Stability",
                text: "Batch-controlled SiO₂, Na₂O, iron content, and color consistency. COA issued per shipment. Specifications maintained across production runs for long-term supply agreements.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-[#E2E6EA] p-5">
                <h3 className="font-bold text-[#0B2D5B]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#F4F6F8]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2D5B]">Trust Signals</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "100,000+ Tons", label: "Annual production capacity" },
              { value: "Factory Direct", label: "Manufacturer — not a trading company" },
              { value: "Fe ≤ 0.02%", label: "Color & purity consistency" },
              { value: "Global Export", label: "Asia, Middle East, Africa, South America" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-[#E2E6EA] bg-white p-5 text-center">
                <p className="text-xl font-bold text-[#0B2D5B]">{s.value}</p>
                <p className="mt-1 text-xs text-[#5A6570]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B2D5B]">
            China vs Other Countries — Supply Comparison
          </h2>
          <p className="mt-3 text-[#5A6570] max-w-3xl">
            Practical factors B2B buyers evaluate when comparing Chinese factory-direct supply
            against EU, US, or intermediary distributors.
          </p>
          <div className="mt-8">
            <SupplyComparisonTable />
          </div>
          <StrongCTA product={product.name} className="mt-8" />
        </div>
      </section>
    </>
  );
}
