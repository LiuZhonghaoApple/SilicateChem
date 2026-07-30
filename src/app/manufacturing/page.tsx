import Image from "next/image";
import Link from "next/link";
import { PageCTAs } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Sodium Metasilicate Manufacturing Process & Equipment",
  description:
    "Sodium metasilicate manufacturing at Zhongzhi: on-site mixing, milling, conveying and finished-product storage equipment, plus how raw material, quality control and packaging connect across the process.",
  path: "/manufacturing",
});

// On-site production equipment. Captions describe only what is visible in each
// photo (equipment type and process stage) — no capacities, temperatures, or
// model data are asserted.
const productionEquipment = [
  {
    src: "/assets/images/manufacturing/production-mixing-tank.webp",
    alt: "Vertical agitated mixing tank marked 搅拌罐 on the Zhongzhi production line",
    title: "Agitated Mixing Tank",
    stage: "Mixing / Dissolving",
    description:
      "Vertical agitated tank marked on site as 搅拌罐 (mixing tank), with a top-mounted drive — part of the liquid mixing / dissolving stage.",
  },
  {
    src: "/assets/images/manufacturing/production-drum-mill-01.webp",
    alt: "Horizontal rotary drum mill with girth-gear drive and overhead feed hopper",
    title: "Rotary Drum Mill",
    stage: "Grinding / Sizing",
    description:
      "Horizontal girth-gear-driven rotary drum fed by an overhead conical hopper — used in the grinding / material sizing stage.",
  },
  {
    src: "/assets/images/manufacturing/production-drum-mill-02.webp",
    alt: "Second view of the horizontal rotary drum milling equipment and feed platform",
    title: "Milling Equipment (Alternate View)",
    stage: "Grinding / Sizing",
    description:
      "Alternate view of the same rotary drum milling equipment, feed platform and drive assembly.",
  },
  {
    src: "/assets/images/manufacturing/production-blending-hoppers.webp",
    alt: "Conical-bottom hoppers feeding a belt conveyor, one bin marked 成品仓",
    title: "Hoppers & Conveying",
    stage: "Material Handling",
    description:
      "Conical-bottom hoppers (one bin marked 成品仓, finished-product bin) discharging onto belt conveyors — material handling and transfer stage.",
  },
  {
    src: "/assets/images/manufacturing/production-finished-silos.webp",
    alt: "Two large conical-bottom finished-product silos marked 成品仓 with conveyors",
    title: "Finished-Product Silos",
    stage: "Storage / Transfer",
    description:
      "Two large conical-bottom silos marked 成品仓 (finished-product silo) discharging onto conveyors — finished-product storage and transfer.",
  },
] as const;

// How the process connects to evidence shown on other pages.
const processFlow = [
  {
    title: "Raw Material Storage",
    description:
      "Bulk raw materials stored on site; different materials are handled separately.",
    href: "/about",
    linkLabel: "See raw-material storage",
  },
  {
    title: "Mixing, Milling & Conveying",
    description:
      "Mixing tanks, rotary drum milling and conveying move material through the process, shown in the equipment below.",
    href: "#equipment",
    linkLabel: "View equipment",
  },
  {
    title: "Quality Control",
    description:
      "Laboratory testing and retained samples support batch consistency before packing.",
    href: "/about",
    linkLabel: "See quality control",
  },
  {
    title: "Packaging & Palletizing",
    description:
      "Bagging line and robotic palletizing prepare finished product for storage and export.",
    href: "/about",
    linkLabel: "See packaging",
  },
] as const;

export default function ManufacturingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE.url },
          { name: "Manufacturing", url: `${SITE.url}/manufacturing` },
        ]}
      />

      <div className="border-b border-[#D7E6EF] bg-[#0B2D5B] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8ED3E8]">
            Manufacturing
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight md:text-4xl">
            Sodium Metasilicate Manufacturing Process & Equipment
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-blue-100 md:text-lg">
            On-site production equipment across the mixing, milling, conveying, and
            finished-product storage stages, and how raw material, quality control
            and packaging connect across the process.
          </p>
          <PageCTAs product="Sodium Metasilicate" className="mt-8" light size="lg" />
        </div>
      </div>

      <Section>
        <SectionHeader
          title="Process Overview"
          subtitle="From raw material to packed finished product, in four connected stages."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processFlow.map((step, index) => (
            <div
              key={step.title}
              className="flex h-full flex-col rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF4FA] text-sm font-bold text-[#2A86A5]">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-bold text-[#0B2D5B]">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5A6570]">
                {step.description}
              </p>
              <Link
                href={step.href}
                className="mt-4 text-sm font-bold text-[#2E7D9A] hover:underline"
              >
                {step.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section background="grey">
        <div id="equipment" className="scroll-mt-24" />
        <SectionHeader
          title="Production Process & Equipment"
          subtitle="On-site equipment photographed at the plant. Captions describe visible equipment and the related process stage."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productionEquipment.map((item) => (
            <figure
              key={item.src}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F6F8]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-[#0B2D5B]/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {item.stage}
                </span>
              </div>
              <figcaption className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-[#0B2D5B]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
                  {item.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[#5A6570]">
          Specific capacities and process parameters are confirmed on request.
        </p>
      </Section>

      <Section background="blue">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Discuss Your Grade & Specification
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">
            Send grade, form, quantity, packaging and destination. We will confirm
            specification, packing and document requirements for your order.
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
