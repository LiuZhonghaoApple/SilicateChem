import Image from "next/image";
import Link from "next/link";
import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import {
  EXPORT_COUNTRIES,
  EXPORT_DATA_DISCLAIMER,
  EXPORT_SHIPMENT_STATS,
  LOGISTICS_SIGNALS,
  VERIFIED_PACKAGING,
} from "@/content/trust/export-countries";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Export & Packaging",
  description:
    "Sodium metasilicate export support from China: packing options, container loading reference, export documents, destination markets, and RFQ information for overseas buyers.",
  path: "/export",
});

const exportImages = [
  {
    src: "/assets/images/factory-proof/finished-goods-warehouse.png",
    alt: "Packed sodium metasilicate staged on pallets in the finished-goods warehouse ready for export",
    title: "Finished Goods Warehouse",
  },
  {
    src: "/assets/images/factory-proof/packing-line.jpg",
    alt: "Workers bagging sodium metasilicate on the production and packing line",
    title: "Bagging & Packing Line",
  },
  {
    src: "/assets/images/factory-proof/facility-exterior.png",
    alt: "Zhongzhi sodium metasilicate production facility exterior with storage tanks",
    title: "Production Facility",
  },
] as const;

const packagingImages = [
  {
    src: "/assets/images/products/packing-loading/packing-red-bag.png",
    alt: "Red sodium metasilicate export packaging bag",
    title: "Printed 25 kg Bag",
  },
  {
    src: "/assets/images/products/packing-loading/packing-blue-bag.png",
    alt: "Blue sodium metasilicate export packaging bag",
    title: "Alternative Bag Design",
  },
] as const;

const loadingImages = [
  {
    src: "/assets/images/products/packing-loading/loading-small-bag.png",
    alt: "25 kg small bag container loading reference",
    title: "Small Bag Loading",
  },
  {
    src: "/assets/images/products/packing-loading/loading-jumbo-bag.png",
    alt: "Jumbo bag loading reference for sodium metasilicate shipment",
    title: "Jumbo Bag Loading",
  },
] as const;

const rfqItems = [
  "Product grade and target specification",
  "Packing preference: 25 kg bag, neutral bag, printed bag or jumbo bag",
  "Order quantity and expected shipment schedule",
  "Destination port and trade terms",
  "Required documents: MSDS, COA, certificates or customs documents",
] as const;

export default function ExportPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Export", url: `${SITE.url}/export` },
        ]}
      />

      <div className="border-b border-[#D7E6EF] bg-[#0B2D5B] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8ED3E8]">
              Export Support
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight md:text-4xl">
              Sodium Metasilicate Export, Packing & Loading Support
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-blue-100 md:text-lg">
              Practical export support for overseas sodium metasilicate buyers:
              packaging confirmation, container loading reference, destination
              market records, and document preparation before quotation.
            </p>
            <PageCTAs
              product="Sodium Metasilicate"
              className="mt-8"
              light
              size="lg"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {exportImages.map((image) => (
              <div
                key={image.src}
                className="overflow-hidden rounded-2xl border border-white/20 bg-white/10"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={800}
                  className="h-40 w-full object-cover sm:h-36 lg:h-36"
                  priority={image.src === exportImages[0].src}
                />
                <p className="px-4 py-2 text-xs font-semibold text-blue-50">
                  {image.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section>
        <SectionHeader
          title="Export Market Records"
          subtitle="Available customs records show recurring sodium metasilicate shipment activity across selected overseas markets."
        />
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-[#D7E6EF] bg-[#F4F8FB] p-6">
            <h2 className="text-lg font-bold text-[#0B2D5B]">Shipment Snapshot</h2>
            <dl className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-[#5A6570]">Customs shipment records</dt>
                <dd className="text-lg font-bold text-[#0B2D5B]">
                  {EXPORT_SHIPMENT_STATS.totalRecords.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-[#5A6570]">Documented weight</dt>
                <dd className="text-lg font-bold text-[#0B2D5B]">
                  ~{EXPORT_SHIPMENT_STATS.documentedWeightMt.toLocaleString()} MT
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-[#5A6570]">Records &gt;= 20 MT</dt>
                <dd className="text-lg font-bold text-[#0B2D5B]">
                  {EXPORT_SHIPMENT_STATS.recordsOver20Mt.toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-[#5A6570]">Qingdao port departures</dt>
                <dd className="text-lg font-bold text-[#0B2D5B]">
                  {EXPORT_SHIPMENT_STATS.qingdaoDepartures.toLocaleString()}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-[#5A6570]">
              {EXPORT_DATA_DISCLAIMER}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {EXPORT_COUNTRIES.map((country) => (
              <div
                key={country.code}
                className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2E7D9A]">
                  {country.region}
                </p>
                <h3 className="mt-2 text-lg font-bold text-[#0B2D5B]">
                  {country.name}
                </h3>
                <p className="mt-1 text-sm text-[#5A6570]">
                  {country.records} customs records in available dataset.
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Packaging Options"
          subtitle="Packaging details should be confirmed before quotation because bag type, marking, and loading method affect shipment planning."
        />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {packagingImages.map((image) => (
              <div
                key={image.src}
                className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={390}
                  height={450}
                  className="h-72 w-full object-contain p-4"
                />
                <p className="border-t border-[#D7E6EF] px-4 py-3 text-sm font-bold text-[#0B2D5B]">
                  {image.title}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B2D5B]">
              Packing Information to Confirm
            </h3>
            <ul className="mt-4 space-y-3">
              {VERIFIED_PACKAGING.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                  {item}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-[#5A6570]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                Printed bag, neutral bag, buyer label, batch number and handling
                marks can be confirmed before production.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Loading Reference"
          subtitle="Container loading plan depends on packing type, handling method, pallet requirement, and destination port."
        />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {loadingImages.map((image) => (
              <div
                key={image.src}
                className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={390}
                  height={390}
                  className="h-72 w-full object-cover"
                />
                <p className="border-t border-[#D7E6EF] px-4 py-3 text-sm font-bold text-[#0B2D5B]">
                  {image.title}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[#D7E6EF] bg-[#F4F8FB] p-6">
            <h3 className="text-lg font-bold text-[#0B2D5B]">
              Logistics Signals
            </h3>
            <ul className="mt-4 space-y-3">
              {LOGISTICS_SIGNALS.map((signal) => (
                <li key={signal} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D9A]">
              Export Documents
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0B2D5B]">
              Download available documents or request shipment-specific files
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
              MSDS, certificates, company documents and product brochure are available
              in the document center. Batch COA, TDS and shipment-specific files
              should be requested according to order requirements.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center rounded bg-[#0B2D5B] px-5 py-3 text-sm font-bold text-white hover:bg-[#071F3F]"
              >
                Download Documents
              </Link>
              <Link
                href="/contact?type=quote&product=Sodium%20Metasilicate"
                className="inline-flex items-center justify-center rounded border border-[#0B2D5B] px-5 py-3 text-sm font-bold text-[#0B2D5B] hover:bg-[#EAF4FA]"
              >
                Request Export Documents
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B2D5B]">
              RFQ Details for Export Orders
            </h3>
            <ul className="mt-4 space-y-3">
              {rfqItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section background="blue">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Request Export Quotation
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Send grade, quantity, packaging and destination port. We will confirm
            packing options, loading reference and document requirements for your order.
          </p>
          <PageCTAs
            product="Sodium Metasilicate"
            className="mt-8 justify-center"
            light
            size="lg"
          />
        </div>
      </Section>
    </>
  );
}
