function CertificatePlaceholder({
  title,
  subtitle,
  className = "",
}: {
  title: string;
  subtitle?: string | null;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-dashed border-[#E2E6EA] bg-[#F4F6F8] aspect-[4/3] flex flex-col items-center justify-center p-6 text-center ${className}`}
    >
      <div className="h-12 w-12 rounded-full bg-[#0B2D5B]/10 flex items-center justify-center mb-3">
        <svg
          className="h-6 w-6 text-[#0B2D5B]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      </div>
      <p className="text-sm font-bold text-[#0B2D5B]">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-[#5A6570]">{subtitle}</p>}
      <p className="mt-3 text-[10px] uppercase tracking-wide text-[#2E7D9A]">
        Image pending
      </p>
    </div>
  );
}

export { CertificatePlaceholder };
