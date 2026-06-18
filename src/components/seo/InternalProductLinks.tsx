import Link from "next/link";
import {
  metasilicateCategoryLink,
  metasilicateGradeLinks,
  sodiumSilicateLink,
  applicationLinks,
  guideLinks,
} from "@/lib/internal-links";

type Props = {
  title?: string;
  showFunnel?: boolean;
};

export function InternalProductLinks({ title = "Product Pages", showFunnel = false }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-6">
        <h3 className="font-bold text-[#0B2D5B]">{title}</h3>
        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href={metasilicateCategoryLink.href}
              className="text-sm font-bold text-[#0B2D5B] hover:text-[#2E7D9A] hover:underline"
            >
              {metasilicateCategoryLink.label} ★
            </Link>
          </li>
          {metasilicateGradeLinks.map((link) => (
            <li key={link.href} className="pl-3">
              <Link
                href={link.href}
                className="text-sm text-[#5A6570] hover:text-[#2E7D9A] hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 border-t border-[#E2E6EA]">
            <Link
              href={sodiumSilicateLink.href}
              className="text-sm text-[#5A6570] hover:text-[#2E7D9A] hover:underline"
            >
              {sodiumSilicateLink.label}
            </Link>
          </li>
        </ul>
      </div>
      {showFunnel && (
        <>
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <h3 className="font-bold text-[#0B2D5B] text-sm">Applications</h3>
            <ul className="mt-2 space-y-1">
              {applicationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5A6570] hover:text-[#2E7D9A] hover:underline"
                  >
                    {link.label.replace("Sodium Metasilicate for the ", "").replace("Sodium Metasilicate for ", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
            <h3 className="font-bold text-[#0B2D5B] text-sm">Guides</h3>
            <ul className="mt-2 space-y-1">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5A6570] hover:text-[#2E7D9A] hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

/** Flat grid links for homepage */
export function ProductLinkGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link
        href={metasilicateCategoryLink.href}
        className="block rounded-lg border-2 border-[#2E7D9A] bg-[#2E7D9A]/5 p-4 ring-1 ring-[#2E7D9A]/30 transition-shadow hover:shadow-md sm:col-span-2"
      >
        <span className="text-xs font-bold uppercase text-[#2E7D9A]">Main Product</span>
        <span className="mt-1 block text-sm font-bold text-[#0B2D5B]">
          {metasilicateCategoryLink.label} ★
        </span>
        <span className="mt-1 block text-xs text-[#5A6570]">
          Manufacturer & supplier — granules, anhydrous, pentahydrate
        </span>
      </Link>
      {metasilicateGradeLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block rounded-lg border border-[#E2E6EA] bg-white p-4 transition-shadow hover:shadow-md"
        >
          <span className="text-sm font-medium text-[#0B2D5B]">{link.label}</span>
          <span className="mt-1 block text-xs text-[#5A6570]">Specifications →</span>
        </Link>
      ))}
      <Link
        href={sodiumSilicateLink.href}
        className="block rounded-lg border border-[#E2E6EA] bg-white p-4 transition-shadow hover:shadow-md"
      >
        <span className="text-sm font-medium text-[#0B2D5B]">{sodiumSilicateLink.label}</span>
      </Link>
    </div>
  );
}
