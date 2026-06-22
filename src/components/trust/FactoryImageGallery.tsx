import { SectionHeader } from "@/components/ui/Section";
import { VisualAssetPendingNotice } from "@/components/trust/VisualAssetPendingNotice";

type Props = {
  product?: string;
  showHeader?: boolean;
  className?: string;
};

/** Factory gallery — image system PENDING; layout shell only. */
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
      <VisualAssetPendingNotice />
    </div>
  );
}
