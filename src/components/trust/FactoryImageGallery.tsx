import { SectionHeader } from "@/components/ui/Section";
import { VisualProofPlaceholder } from "@/components/trust/VisualProofPlaceholder";

type Props = {
  product?: string;
  showHeader?: boolean;
  className?: string;
};

/** Factory gallery — legacy image arrays disabled; placeholder only. */
export function FactoryImageGallery({
  showHeader = true,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {showHeader && (
        <SectionHeader
          title="Factory Image Gallery"
          subtitle="Verified production, warehouse, and packaging photos."
        />
      )}
      <VisualProofPlaceholder />
    </div>
  );
}
