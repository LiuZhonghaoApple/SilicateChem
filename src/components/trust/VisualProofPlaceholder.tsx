type Props = {
  className?: string;
  title?: string;
  compact?: boolean;
};

export function VisualProofPlaceholder({
  className = "",
  title = "Authentic factory and product images are being updated.",
  compact = false,
}: Props) {
  return (
    <div
      className={`rounded-lg border border-dashed border-[#2E7D9A]/40 bg-white ${
        compact ? "p-4" : "p-6 md:p-8"
      } ${className}`}
    >
      <p className={`font-semibold text-[#0B2D5B] ${compact ? "text-sm" : "text-base"}`}>
        {title}
      </p>
      {!compact && (
        <p className="mt-2 text-sm leading-relaxed text-[#5A6570]">
          Verified production, warehouse, packaging, and product photos from our Changyi
          manufacturing site will appear here once approved.
        </p>
      )}
    </div>
  );
}
