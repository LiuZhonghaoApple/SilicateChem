import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import {
  applicationLinks,
  guideLinks,
  metasilicateCategoryLink,
  metasilicateGradeLinks,
  sodiumSilicateLink,
} from "@/lib/internal-links";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/factory", label: "Factory" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

const linkClass =
  "text-sm text-[#5A6570] hover:text-[#2E7D9A] hover:underline";

/** Crawler-friendly internal link hub — supports discovery without disrupting RFQ funnel. */
export function SiteExploreSection() {
  return (
    <Section background="grey">
      <SectionHeader
        title="Explore SilicateChem"
        subtitle="Full site map for buyers and search engines — all product, guide, and industry pages."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <h3 className="font-bold text-[#0B2D5B] text-sm">Products</h3>
          <ul className="mt-3 space-y-1.5">
            <li>
              <Link href="/products" className={linkClass}>
                Product Catalog
              </Link>
            </li>
            <li>
              <Link href={metasilicateCategoryLink.href} className="text-sm font-semibold text-[#0B2D5B] hover:text-[#2E7D9A] hover:underline">
                {metasilicateCategoryLink.label} ★
              </Link>
            </li>
            {metasilicateGradeLinks.map((link) => (
              <li key={link.href} className="pl-2">
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-1 border-t border-[#E2E6EA]">
              <Link href={sodiumSilicateLink.href} className={linkClass}>
                {sodiumSilicateLink.label}
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <h3 className="font-bold text-[#0B2D5B] text-sm">Buyer Guides</h3>
          <ul className="mt-3 space-y-1.5">
            <li>
              <Link href="/guides" className={linkClass}>
                All Procurement Guides
              </Link>
            </li>
            {guideLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <h3 className="font-bold text-[#0B2D5B] text-sm">Industry Applications</h3>
          <ul className="mt-3 space-y-1.5">
            <li>
              <Link href="/applications" className={linkClass}>
                All Industry Use Cases
              </Link>
            </li>
            {applicationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
          <h3 className="font-bold text-[#0B2D5B] text-sm">Company</h3>
          <ul className="mt-3 space-y-1.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
