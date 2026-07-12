import Link from "next/link";
import Image from "next/image";

const proofCards = [
  {
    label: "100,000 MT",
    title: "Factory-Direct Supply",
    description:
      "Registered manufacturing site in Changyi, Shandong, supporting stable sodium metasilicate supply.",
    cta: "About Us",
    href: "/about",
    icon: "factory",
  },
  {
    label: "4 Product Forms",
    title: "Focused Product Supply",
    description:
      "Pentahydrate, nonahydrate, anhydrous, and granules for major industrial applications.",
    cta: "View Products",
    href: "/products/sodium-metasilicate",
    icon: "product",
  },
  {
    label: "COA / TDS / SDS",
    title: "Buyer Documents Available",
    description:
      "Batch specifications, packing details, and shipment documents can be provided according to order requirements.",
    cta: "Request Documents",
    href: "/contact?type=quote&product=Sodium%20Metasilicate",
    icon: "docs",
  },
] as const;

const ctaAdvantages = ["Quick Response", "Reliable Quality", "Stable Supply", "Long-term Partner"];

function ProofIcon({ type }: { type: (typeof proofCards)[number]["icon"] }) {
  const paths = {
    factory: (
      <>
        <path d="M4 19V8l4 2.8V8l4 2.8V6h8v13" />
        <path d="M3 19h18" />
        <path d="M8 15h2M13 15h2M17 10h1" />
      </>
    ),
    product: (
      <>
        <path d="M12 3 4.8 7.2v8.4L12 20l7.2-4.4V7.2L12 3Z" />
        <path d="M4.8 7.2 12 11.5l7.2-4.3" />
        <path d="M12 11.5V20" />
      </>
    ),
    docs: (
      <>
        <path d="M7 3h7l3 3v15H7V3Z" />
        <path d="M14 3v4h4" />
        <path d="M9.5 12h5M9.5 16h5" />
      </>
    ),
  };

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF4F8] text-[#2E7D9A]">
      <svg
        aria-hidden="true"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {paths[type]}
      </svg>
    </span>
  );
}

function EnvironmentIcon() {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#2E7D9A] shadow-sm ring-1 ring-[#BFDDEB]">
      <svg
        aria-hidden="true"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M5.5 15.5c4.7.3 8.2-2.2 10.5-7.5 1.6 3.2 1.3 6.2-.8 8.8-2.2 2.7-5.6 3.4-9.7 1.9" />
        <path d="M4 20c2.5-4.5 6.4-7.5 11.8-9" />
        <path d="M18.5 4.5c1.2 2.1 1.7 4.2 1.5 6.2" />
      </svg>
    </span>
  );
}

export function HomepageWhyChooseSection() {
  return (
    <div>
      <div className="mx-auto mb-11 max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[#0B2D5B] md:text-4xl">
          Why Choose Zhongzhi?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#5A6570] md:text-lg">
          Factory-direct sodium metasilicate supply backed by production capacity, export
          experience, buyer-ready documents, and responsible chemical manufacturing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
        <article className="relative overflow-hidden rounded-2xl bg-[#0B2D5B] p-7 text-white shadow-sm md:p-8">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/40" />
            <div className="absolute bottom-10 right-10 h-28 w-28 rounded-full border border-white/25" />
            <div className="absolute left-8 top-24 h-px w-4/5 bg-white/20" />
            <div className="absolute left-16 top-36 h-px w-2/3 bg-white/15" />
          </div>
          <div className="relative flex min-h-[440px] flex-col">
            <div>
              <div className="flex items-end gap-3">
                <span className="text-7xl font-bold leading-none tracking-tight md:text-8xl">20+</span>
                <span className="mb-2 text-lg font-semibold text-blue-100">Years</span>
              </div>
              <h3 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
                Export Experience
              </h3>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-100">
                Serving overseas buyers with practical export know-how — from grade confirmation
                and packing selection to loading quantity, documents, and shipment coordination.
              </p>
            </div>
            <div className="mt-auto pt-8">
              <Link
                href="/export"
                className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded bg-white px-5 py-3 text-sm font-bold text-[#0B2D5B] transition-colors hover:bg-[#EAF4F8]"
              >
                Export Support →
              </Link>
            </div>
          </div>
        </article>

        <div className="grid gap-4">
          {proofCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col gap-4 rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start"
            >
              <ProofIcon type={card.icon} />
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-full bg-[#EAF4F8] px-3 py-1 text-xs font-bold text-[#0B2D5B]">
                  {card.label}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-tight text-[#0B2D5B]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">{card.description}</p>
              </div>
              <Link
                href={card.href}
                className="inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded border border-[#0B2D5B] px-4 py-2 text-sm font-bold text-[#0B2D5B] transition-colors hover:bg-[#0B2D5B] hover:text-white sm:mt-auto"
              >
                {card.cta} →
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[#BFDDEB] bg-gradient-to-r from-[#EEF8F7] to-white p-6 shadow-sm md:flex md:items-center md:gap-6 md:p-7">
        <EnvironmentIcon />
        <div className="mt-5 min-w-0 flex-1 md:mt-0">
          <h3 className="text-xl font-bold text-[#0B2D5B]">Responsible Chemical Manufacturing</h3>
          <p className="mt-1 text-sm font-semibold text-[#2E7D9A]">
            Wastewater ・ Exhaust Gas ・ Hazardous Material Treatment
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5A6570]">
            Zhongzhi invests in environmental treatment and responsible production management to
            support safer, cleaner, and more sustainable chemical manufacturing.
          </p>
        </div>
        <Link
          href="/about"
          className="mt-6 inline-flex w-fit items-center justify-center whitespace-nowrap rounded border border-[#0B2D5B] px-5 py-2.5 text-sm font-bold text-[#0B2D5B] transition-colors hover:bg-[#0B2D5B] hover:text-white md:mt-0"
        >
          Learn More →
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-[#D7E6EF] bg-white shadow-sm">
        <Image
          src="/assets/images/trust/global-buyer-distribution-aligned.png"
          alt="Global buyer distribution map showing Zhongzhi export experience and overseas buyer markets"
          width={1640}
          height={899}
          className="h-auto w-full"
          sizes="(min-width: 1024px) 1200px, 100vw"
        />
      </div>

      <div className="mt-6 rounded-2xl bg-[#0B2D5B] p-6 text-white shadow-sm md:p-7 lg:flex lg:items-center lg:gap-8">
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-bold leading-tight">
            Need sodium metasilicate supply for your market?
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-blue-100">
            Send grade, packing, quantity, and destination — our factory team will prepare a
            practical quotation within 1–2 business days.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center lg:mt-0 lg:min-w-[420px]">
          <Link
            href="/contact?type=quote&product=Sodium%20Metasilicate"
            className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded bg-white px-5 py-3 text-sm font-bold text-[#0B2D5B] transition-colors hover:bg-[#EAF4F8]"
          >
            Request Quote →
          </Link>
          <div className="grid gap-2 sm:grid-cols-2">
            {ctaAdvantages.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-50"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
