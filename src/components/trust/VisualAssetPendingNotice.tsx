import { isImageSystemPending } from "@/lib/image-system";

export const VISUAL_ASSET_PENDING_MESSAGE =
  "Visual assets are being updated. Factory and product images will be restored soon.";

type Props = {
  className?: string;
  compact?: boolean;
  /** Use on dark backgrounds (e.g. homepage hero). */
  variant?: "default" | "light";
};

export function VisualAssetPendingNotice({
  className = "",
  compact = false,
  variant = "default",
}: Props) {
  const surface =
    variant === "light"
      ? "border-white/20 bg-white/5"
      : "border-dashed border-[#2E7D9A]/40 bg-white";

  const textColor = variant === "light" ? "text-blue-50" : "text-[#0B2D5B]";

  return (
    <div
      className={`rounded-lg border ${surface} ${
        compact ? "p-4" : "p-6 md:p-8"
      } ${className}`}
      data-image-system={isImageSystemPending() ? "pending" : "active"}
    >
      <p className={`font-semibold ${textColor} ${compact ? "text-sm" : "text-base"}`}>
        {VISUAL_ASSET_PENDING_MESSAGE}
      </p>
    </div>
  );
}
