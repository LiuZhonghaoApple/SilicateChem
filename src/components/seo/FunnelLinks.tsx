import Link from "next/link";
import { industryApplications } from "@/content/applications/industries";
import { intentGuides } from "@/content/guides/intent-pages";
import { AUTHORITY_SINK } from "@/lib/seo-funnel";

/** Sidebar funnel: Guides → Applications → authority sink (money page) */
export function FunnelLinksSidebar() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-[#2E7D9A] bg-[#2E7D9A]/5 p-5">
        <p className="text-xs font-bold uppercase text-[#2E7D9A]">Authority sink</p>
        <Link
          href={AUTHORITY_SINK}
          className="mt-2 block text-sm font-bold text-[#0B2D5B] hover:text-[#2E7D9A] hover:underline"
        >
          Sodium Metasilicate — Request Quotation ★
        </Link>
      </div>
      <div className="rounded-lg border border-[#E2E6EA] bg-white p-5">
        <h3 className="font-bold text-[#0B2D5B] text-sm">Buyer guides</h3>
        <ul className="mt-2 space-y-1">
          {intentGuides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="text-sm text-[#5A6570] hover:text-[#2E7D9A] hover:underline"
              >
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-5">
        <h3 className="font-bold text-[#0B2D5B] text-sm">Industry use cases</h3>
        <ul className="mt-2 space-y-1">
          {industryApplications.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/applications/${a.slug}`}
                className="text-sm text-[#5A6570] hover:text-[#2E7D9A] hover:underline"
              >
                {a.title.replace("Sodium Metasilicate for the ", "").replace("Sodium Metasilicate for ", "")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
