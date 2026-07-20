type ApplicationIconProps = {
  slug: string;
  className?: string;
};

const iconClass = "h-full w-full";

export function ApplicationIcon({ slug, className = "" }: ApplicationIconProps) {
  const commonProps = {
    viewBox: "0 0 96 96",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: iconClass,
    "aria-hidden": true,
  };

  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4FA] p-3 text-[#0B2D5B] ${className}`}
    >
      {slug === "detergent-industry" && (
        <svg {...commonProps}>
          <rect x="28" y="22" width="32" height="52" rx="8" fill="white" stroke="#0B2D5B" strokeWidth="2" />
          <path d="M36 22v-8h16v8" stroke="#0B2D5B" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 43h18" stroke="#2E7D9A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="63" cy="30" r="5" fill="#D7E6EF" stroke="#2E7D9A" strokeWidth="1.8" />
          <circle cx="69" cy="45" r="4" fill="#D7E6EF" stroke="#2E7D9A" strokeWidth="1.8" />
          <circle cx="60" cy="58" r="3" fill="#D7E6EF" stroke="#2E7D9A" strokeWidth="1.8" />
          <path d="M35 54h13" stroke="#2E7D9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {slug === "water-treatment" && (
        <svg {...commonProps}>
          <path d="M48 14c10 13 21 27 21 41a21 21 0 0 1-42 0c0-14 11-28 21-41Z" fill="white" stroke="#0B2D5B" strokeWidth="2" />
          <path d="M34 57c8 6 20 6 28 0" stroke="#2E7D9A" strokeWidth="2" strokeLinecap="round" />
          <path d="M35 48h26" stroke="#D7E6EF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="37" cy="68" r="3" fill="#2E7D9A" />
          <circle cx="48" cy="70" r="3" fill="#2E7D9A" />
          <circle cx="59" cy="68" r="3" fill="#2E7D9A" />
        </svg>
      )}

      {slug === "textile-industry" && (
        <svg {...commonProps}>
          <rect x="22" y="24" width="52" height="48" rx="8" fill="white" stroke="#0B2D5B" strokeWidth="2" />
          <path d="M29 34h38M29 45h38M29 56h38" stroke="#D7E6EF" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 24c0 16 24 16 24 0" stroke="#2E7D9A" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 72c0-16 24-16 24 0" stroke="#2E7D9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {slug === "paper-industry" && (
        <svg {...commonProps}>
          <rect x="24" y="20" width="34" height="48" rx="3" fill="white" stroke="#0B2D5B" strokeWidth="2" />
          <rect x="34" y="28" width="34" height="48" rx="3" fill="white" stroke="#2E7D9A" strokeWidth="2" />
          <path d="M42 40h18M42 50h18M42 60h12" stroke="#D7E6EF" strokeWidth="2" strokeLinecap="round" />
          <path d="M57 28v13h11" stroke="#2E7D9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {!["detergent-industry", "water-treatment", "textile-industry", "paper-industry"].includes(slug) && (
        <svg {...commonProps}>
          <rect x="22" y="28" width="52" height="40" rx="6" fill="white" stroke="#0B2D5B" strokeWidth="2" />
          <path d="M30 56h36M34 44h28" stroke="#2E7D9A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
