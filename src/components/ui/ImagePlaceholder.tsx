type ImagePlaceholderProps = {
  label: string;
  path: string;
  aspect?: "square" | "video" | "wide";
  className?: string;
};

const aspects = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
};

export function ImagePlaceholder({
  label,
  path,
  aspect = "square",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`rounded-lg border border-dashed border-[#2E7D9A]/40 bg-[#F4F6F8] ${aspects[aspect]} flex items-center justify-center ${className}`}
    >
      <div className="text-center p-6">
        <div className="mx-auto h-14 w-14 rounded-full bg-[#0B2D5B]/10 flex items-center justify-center">
          <svg
            className="h-7 w-7 text-[#0B2D5B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="mt-3 text-sm font-semibold text-[#0B2D5B]">{label}</p>
        <p className="mt-1 text-xs text-[#5A6570] font-mono">public/images/{path}</p>
        <p className="mt-2 text-xs text-[#2E7D9A]">Replace with real photo before launch</p>
      </div>
    </div>
  );
}
