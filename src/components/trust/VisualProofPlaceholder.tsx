import { VisualAssetPendingNotice } from "@/components/trust/VisualAssetPendingNotice";

type Props = {
  className?: string;
  title?: string;
  compact?: boolean;
  variant?: "default" | "light";
};

/** @deprecated Use VisualAssetPendingNotice — kept for layout compatibility during image shutdown. */
export function VisualProofPlaceholder({
  className = "",
  compact = false,
  variant = "default",
}: Props) {
  return (
    <VisualAssetPendingNotice
      className={className}
      compact={compact}
      variant={variant}
    />
  );
}
