import { SectionHeader } from "@/components/ui/Section";
import { CertificatePlaceholder } from "@/components/trust/CertificatePlaceholder";
import { CERTIFICATE_IMAGE_NOTE } from "@/content/trust/certifications";

const FUTURE_UPLOAD_SLOTS = [
  { id: "iso-qms", title: "ISO / QMS Certificate", subtitle: "Upload slot reserved" },
  { id: "export-license", title: "Export License", subtitle: "Upload slot reserved" },
  { id: "industry-honor-scan", title: "Industry Honor Scan", subtitle: "Upload slot reserved" },
];

export function CertificateSection({ className = "" }: { className?: string }) {
  return (
    <div className={className} id="certificate-trust-gallery">
      <SectionHeader
        title="Certificate Trust Gallery"
        subtitle="Placeholder slots for verified certificate scans — assets will bind here when uploaded."
      />
      <p className="text-sm text-[#5A6570] mb-6">{CERTIFICATE_IMAGE_NOTE}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FUTURE_UPLOAD_SLOTS.map((slot) => (
          <div key={slot.id}>
            <CertificatePlaceholder title={slot.title} subtitle={slot.subtitle} />
            <p className="mt-2 text-[10px] uppercase tracking-wide text-[#2E7D9A] text-center">
              Future upload · /images/certifications/
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
