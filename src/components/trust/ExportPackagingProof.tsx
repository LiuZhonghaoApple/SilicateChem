import { SectionHeader } from "@/components/ui/Section";
import { VisualProofPlaceholder } from "@/components/trust/VisualProofPlaceholder";
import { VERIFIED_PACKAGING } from "@/content/trust/export-countries";

export function ExportPackagingProof({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <SectionHeader
        title="Packaging Proof"
        subtitle="Documented 25 kg bag packing and bulk consignment patterns from customs goods descriptions."
      />
      <ul className="mb-6 space-y-2 max-w-3xl">
        {VERIFIED_PACKAGING.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-[#5A6570]">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <VisualProofPlaceholder compact />
    </div>
  );
}
