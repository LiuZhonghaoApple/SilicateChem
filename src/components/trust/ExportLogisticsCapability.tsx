import { SectionHeader } from "@/components/ui/Section";
import { DeploymentImageGrid } from "@/components/trust/HomepageRealImages";
import { LOGISTICS_SIGNALS } from "@/content/trust/export-countries";
import { siteImages } from "@/content/site-images";

export function ExportLogisticsCapability({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <SectionHeader
        title="Logistics Capability"
        subtitle="Port departures, container loading, and export documentation trail from available records."
      />
      <ul className="mb-6 space-y-2 max-w-3xl">
        {LOGISTICS_SIGNALS.map((signal) => (
          <li key={signal} className="flex items-start gap-2 text-sm text-[#5A6570]">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E7D9A] shrink-0" />
            {signal}
          </li>
        ))}
      </ul>
      <DeploymentImageGrid images={siteImages.export.shipping} />
    </div>
  );
}
