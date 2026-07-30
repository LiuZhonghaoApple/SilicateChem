import Image from "next/image";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About Zhongzhi | Sodium Metasilicate Manufacturer",
  description:
    "About Shandong Zhongzhi Chemical Technology, a sodium metasilicate manufacturer in Changyi, Shandong. Review company history, quality controls and industrial supply capabilities.",
  path: "/about",
});

const companyFacts = [
  {
    title: "Since 2011",
    description: "Inorganic Silicate Manufacturing",
  },
  {
    title: "Changyi, Shandong",
    description: "Manufacturing Base",
  },
  {
    title: "Sodium Metasilicate Focus",
    description: "Industrial Supply",
  },
];

const evolutionSteps = [
  {
    period: "2011-2016",
    title: "Foundation Stage",
    description:
      "Built the foundation for sodium metasilicate and inorganic silicate production.",
  },
  {
    period: "2017-2021",
    title: "Technology Upgrade",
    description:
      "Expanded innovation platforms, patents, industry-standard participation, and production infrastructure.",
  },
  {
    period: "2022-2025",
    title: "Brand Growth",
    description: "Expanded silicate-based product lines and strengthened market channels.",
  },
  {
    period: "2026-Present",
    title: "Zhongzhi Chemical Technology",
    description:
      "Completed the company name update and continued development as a specialized silicate-based chemical manufacturer.",
  },
];

const qualityPoints = [
  {
    title: "Raw Material Check",
    description:
      "Incoming materials are checked before production to support batch stability.",
  },
  {
    title: "Process Monitoring",
    description:
      "Production parameters are monitored to reduce quality fluctuation.",
  },
  {
    title: "Laboratory Testing",
    description:
      "Laboratory equipment supports product testing and specification review.",
  },
  {
    title: "Batch Consistency",
    description:
      "Quality control is designed to support stable supply for industrial buyers.",
  },
];

// Real on-site facility photos (A-park-exterior). One main image + gallery.
const facilityMainImage = {
  src: "/assets/images/facility/facility-park-main.webp",
  alt: "Shandong Zhongzhi Chemical plant buildings, grounds and storage tanks",
  caption: "Plant buildings and landscaped grounds at the Changyi, Shandong facility.",
};

const facilityGallery = [
  {
    src: "/assets/images/facility/facility-storage-tanks.webp",
    alt: "Row of on-site storage tanks along the plant road at the Zhongzhi facility",
    caption: "On-site storage tanks along the plant road.",
  },
  {
    src: "/assets/images/facility/facility-park-grounds.webp",
    alt: "Landscaped entrance grounds and workshop building at the Zhongzhi facility",
    caption: "Entrance grounds and workshop building.",
  },
] as const;

// Industrial park master plan — architectural RENDERINGS, not completed facilities.
const masterPlanRenderings = [
  {
    src: "/assets/images/masterplan/masterplan-rendering-aerial.webp",
    alt: "Aerial architectural rendering of the planned industrial park layout",
    caption: "Aerial rendering of the planned industrial park layout.",
  },
  {
    src: "/assets/images/masterplan/masterplan-rendering-blue-roof.webp",
    alt: "Architectural rendering of planned workshop buildings in the industrial park",
    caption: "Rendering of planned workshop buildings and site layout.",
  },
] as const;

// In-stock finished-goods inventory (G-warehouse-inventory).
const inventoryMainImage = {
  src: "/assets/images/warehouse/inventory-main.webp",
  alt: "Branded warehouse filled with palletized bags of finished sodium metasilicate",
  caption: "Finished-goods warehouse with palletized sodium metasilicate in stock.",
};

const inventoryGallery = [
  {
    src: "/assets/images/warehouse/inventory-jumbo-bags.webp",
    alt: "FIBC jumbo bags printed Sodium Metasilicate, Net WT 1000KG, Made in China, with palletized 25 kg bags",
    caption: "1,000 kg FIBC jumbo bags and palletized 25 kg bags in storage.",
  },
  {
    src: "/assets/images/warehouse/inventory-labeled-bags.webp",
    alt: "Close-up of export bags printed Sodium Metasilicate Pentahydrate, UN 3253, Class 8, Made in China",
    caption: "Export bag marking: Sodium Metasilicate Pentahydrate, UN 3253, Class 8.",
  },
  {
    src: "/assets/images/warehouse/inventory-forklift.webp",
    alt: "Forklift and palletized sodium metasilicate pentahydrate bags in the packing and staging area",
    caption: "Palletizing and stretch-wrap staging area.",
  },
] as const;

// Wide warehouse hall showing storage scale.
const inventoryWideImage = {
  src: "/assets/images/warehouse/inventory-scale-hall.webp",
  alt: "Wide view of the warehouse hall with rows of palletized and tarped sodium metasilicate stacks",
  caption: "Warehouse hall with palletized and bulk-wrapped finished-goods stacks.",
};

// Raw-material storage (I-raw-material-storage). Different piles are NOT assumed to
// be the same material — colors differ between piles.
const rawMaterialImages = [
  {
    src: "/assets/images/raw-materials/raw-pile-main.webp",
    alt: "Large white bulk raw-material pile stored inside the plant warehouse",
    caption: "Bulk raw material stored inside the plant.",
  },
  {
    src: "/assets/images/raw-materials/raw-mixed-colors.webp",
    alt: "Two separate bulk piles of differing color stored in the raw-material warehouse",
    caption:
      "Separate bulk piles of differing color — stored apart as distinct materials, not one uniform stock.",
  },
] as const;

// Automated packaging & palletizing (K-packaging-automation).
const packagingMainImage = {
  src: "/assets/images/packaging/packaging-main.webp",
  alt: "Branded robotic palletizing cell stacking bagged sodium metasilicate onto pallets",
  caption: "Robotic palletizing cell stacking bagged product onto pallets.",
};

const packagingGallery = [
  {
    src: "/assets/images/packaging/packaging-bagging.webp",
    alt: "Workers bagging sodium metasilicate pentahydrate on the conveyor packing line",
    caption: "Bagging line for finished product.",
  },
  {
    src: "/assets/images/packaging/packaging-robot.webp",
    alt: "NACHI industrial robot arm on the palletizing conveyor inside a safety cage",
    caption: "Industrial robot arm on the palletizing conveyor.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "About Us", url: `${SITE.url}/about` },
        ]}
      />

      <Section background="grey" className="pt-12 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2A86A5]">
              About Us
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#0B2D5B] md:text-4xl">
              About Zhongzhi Chemical Technology
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5A6570]">
              A specialized inorganic silicate manufacturer focused on sodium metasilicate and
              stable industrial supply.
            </p>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#5A6570]">
              Shandong Zhongzhi Chemical Technology Co., Ltd. is located in Changyi, Shandong,
              China. Since 2011, the company has developed from an inorganic silicate producer into
              a specialized manufacturer serving sodium metasilicate and related silicate-based
              material markets.
            </p>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
            <Image
              src="/assets/images/about/about-product-sample-lab.webp"
              alt="Sodium metasilicate product sample in laboratory"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 540px, 100vw"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {companyFacts.map((fact) => (
            <div
              key={fact.title}
              className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#0B2D5B]">{fact.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">{fact.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Company Evolution"
          subtitle="A focused development path from basic inorganic silicate production to specialized chemical manufacturing."
        />
        <div className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)] lg:items-stretch">
            <div className="grid gap-4 md:grid-cols-2">
              {evolutionSteps.map((step) => (
                <div
                  key={step.period}
                  className="flex h-full flex-col rounded-xl border border-[#D7E6EF] bg-[#F8FCFE] p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FA] text-[#2A86A5]">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    </span>
                    <p className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#2A86A5] shadow-sm">
                      {step.period}
                    </p>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-[#0B2D5B]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5A6570]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex h-full flex-col lg:border-l lg:border-[#D7E6EF] lg:pl-6">
              <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
                <Image
                  src="/assets/images/about/about-production-workshop.png"
                  alt="Zhongzhi production workshop and equipment"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 360px, 100vw"
                />
              </div>
              <p className="mt-4 rounded-2xl border border-[#D7E6EF] bg-[#F8FCFE] p-4 text-sm leading-relaxed text-[#5A6570]">
                Some historical images may show the former company name. Zhongzhi continues as the
                same operating entity.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Quality Control Capability"
          subtitle="Testing standards, process control, and laboratory checks support stable sodium metasilicate quality."
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="grid gap-4">
            <figure className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                <Image
                  src="/assets/images/lab/lab-main.webp"
                  alt="Zhongzhi quality-control laboratory with a technician at the analysis bench"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 560px, 100vw"
                />
              </div>
              <figcaption className="border-t border-[#D7E6EF] px-4 py-2 text-xs text-[#5A6570]">
                Quality-control laboratory and analysis bench.
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                <Image
                  src="/assets/images/lab/lab-analyzer.webp"
                  alt="Laboratory technician operating an element analyzer beside retained-sample shelves"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 560px, 100vw"
                />
              </div>
              <figcaption className="border-t border-[#D7E6EF] px-4 py-2 text-xs text-[#5A6570]">
                Instrument analysis and retained-sample storage.
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                <Image
                  src="/assets/images/lab/lab-titration.webp"
                  alt="Titration glassware bench with a muffle furnace and temperature controller in the laboratory"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 560px, 100vw"
                />
              </div>
              <figcaption className="border-t border-[#D7E6EF] px-4 py-2 text-xs text-[#5A6570]">
                Titration glassware and muffle furnace for specification testing.
              </figcaption>
            </figure>
          </div>
          <div className="grid gap-4">
            {qualityPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-bold text-[#0B2D5B]">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Factory Facility"
          subtitle="Real photos of the Zhongzhi manufacturing base in Changyi, Shandong."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
          <figure className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
              <Image
                src={facilityMainImage.src}
                alt={facilityMainImage.alt}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-[#D7E6EF] px-4 py-3 text-sm text-[#5A6570]">
              {facilityMainImage.caption}
            </figcaption>
          </figure>
          <div className="grid gap-6">
            {facilityGallery.map((image) => (
              <figure
                key={image.src}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="border-t border-[#D7E6EF] px-4 py-2 text-xs text-[#5A6570]">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section background="grey">
        <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D9A]">
              Manufacturing
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#0B2D5B]">
              See the production process and equipment
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5A6570] md:text-base">
              Mixing, milling, conveying and finished-product storage equipment, with
              the process stages explained on the manufacturing page.
            </p>
          </div>
          <Link
            href="/manufacturing"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0B2D5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#164675] md:mt-0"
          >
            View Manufacturing →
          </Link>
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="Industrial Park Master Plan (Rendering)"
          subtitle="产业园规划效果图 — architectural renderings of the planned industrial park, not photographs of completed facilities."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {masterPlanRenderings.map((image) => (
            <figure
              key={image.src}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#0B2D5B]/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Master Plan Rendering
                </span>
              </div>
              <figcaption className="border-t border-[#D7E6EF] px-4 py-3 text-sm text-[#5A6570]">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="In-Stock Inventory & Capacity"
          subtitle="Finished sodium metasilicate held in the warehouse — palletized bags and jumbo bags ready for dispatch."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
          <figure className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
              <Image
                src={inventoryMainImage.src}
                alt={inventoryMainImage.alt}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-[#D7E6EF] px-4 py-3 text-sm text-[#5A6570]">
              {inventoryMainImage.caption}
            </figcaption>
          </figure>
          <div className="grid gap-6">
            {inventoryGallery.map((image) => (
              <figure
                key={image.src}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="border-t border-[#D7E6EF] px-4 py-2 text-xs text-[#5A6570]">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <figure className="mt-6 flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#F4F6F8]">
            <Image
              src={inventoryWideImage.src}
              alt={inventoryWideImage.alt}
              fill
              sizes="(min-width: 1024px) 1120px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="border-t border-[#D7E6EF] px-4 py-3 text-sm text-[#5A6570]">
            {inventoryWideImage.caption}
          </figcaption>
        </figure>
      </Section>

      <Section>
        <SectionHeader
          title="Raw Material Storage"
          subtitle="Bulk raw materials stored on site. Different piles are handled as distinct materials."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {rawMaterialImages.map((image) => (
            <figure
              key={image.src}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="border-t border-[#D7E6EF] px-4 py-3 text-sm text-[#5A6570]">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <SectionHeader
          title="Automated Packaging & Palletizing"
          subtitle="Bagging line and robotic palletizing support consistent packing for bulk orders."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
          <figure className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
              <Image
                src={packagingMainImage.src}
                alt={packagingMainImage.alt}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="border-t border-[#D7E6EF] px-4 py-3 text-sm text-[#5A6570]">
              {packagingMainImage.caption}
            </figcaption>
          </figure>
          <div className="grid gap-6">
            {packagingGallery.map((image) => (
              <figure
                key={image.src}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F4F6F8]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="border-t border-[#D7E6EF] px-4 py-2 text-xs text-[#5A6570]">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#0B2D5B]">
              Need to verify product grade or documents?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5A6570] md:text-base">
              Contact Zhongzhi for product specifications, MSDS, COA, TDS, packing details, and
              quotation support.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0B2D5B] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#164675] md:mt-0"
          >
            Contact Factory
          </Link>
        </div>
      </Section>
    </>
  );
}
