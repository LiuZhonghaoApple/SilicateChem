import Link from "next/link";
import { TRUST_PRIMARY_MESSAGE } from "@/content/trust";
import { METASILICATE_CATEGORY_PATH } from "@/lib/seo-keywords";
import { SITE } from "@/lib/constants";

/** Compact trust reinforcement for guides — placed before CTA */
export function TrustReinforcementBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-[#E2E6EA] bg-[#F4F6F8] p-6 ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[#2E7D9A]">
        Factory verification
      </p>
      <p className="mt-2 text-sm font-semibold text-[#0B2D5B]">{TRUST_PRIMARY_MESSAGE}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-[#5A6570]">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
          {SITE.capacity} annual capacity at Shandong manufacturing site
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
          Factory direct — manufacturer, not trading company
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
          COA, TDS, MSDS per shipment · samples available before FCL
        </li>
      </ul>
      <Link
        href={METASILICATE_CATEGORY_PATH}
        className="mt-4 inline-block text-sm font-semibold text-[#2E7D9A] hover:underline"
      >
        Verify factory & request quotation →
      </Link>
    </div>
  );
}
