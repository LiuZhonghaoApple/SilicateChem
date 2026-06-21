import { SITE } from "@/lib/constants";

const TRUST_PREFLIGHT_ITEMS = [
  "Factory Direct Manufacturer",
  "Export Experience Verified (Customs Data)",
  "Technical Documents Available (COA/TDS/SDS)",
  "Response within 12 hours",
] as const;

export function RFQTrustPreflight({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-[#2E7D9A]/30 bg-[#2E7D9A]/5 p-4 ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[#2E7D9A] mb-3">
        Verified before you submit
      </p>
      <ul className="space-y-2">
        {TRUST_PREFLIGHT_ITEMS.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-[#0B2D5B]">
            <span className="text-[#2E7D9A] font-bold shrink-0" aria-hidden="true">
              ✔
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[#5A6570]">{SITE.company}</p>
    </div>
  );
}
