import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-[#5A6570]">
        <li>
          <Link href="/" className="hover:text-[#2E7D9A]">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-[#2E7D9A]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#0B2D5B] font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <div className="border-b border-[#E2E6EA] bg-[#F4F6F8]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B2D5B] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-base md:text-lg text-[#5A6570] max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function PageCTAs({
  product,
  className = "",
  light = false,
  size = "default",
}: {
  product?: string;
  className?: string;
  light?: boolean;
  size?: "default" | "lg";
}) {
  const quoteHref = product
    ? `/contact?type=quote&product=${encodeURIComponent(product)}`
    : "/contact?type=quote";
  const tdsHref = product
    ? `/contact?type=tds&product=${encodeURIComponent(product)}`
    : "/contact?type=tds";

  const sizeClass =
    size === "lg"
      ? "px-7 py-3.5 text-base"
      : "px-5 py-2.5 text-sm";

  const quoteClass = light
    ? "bg-white text-[#0B2D5B] hover:bg-blue-50 border border-white shadow-sm"
    : "bg-[#0B2D5B] text-white hover:bg-[#071F3F] shadow-sm";
  const contactClass = light
    ? "bg-[#2E7D9A] text-white hover:bg-[#3a9bb8] border border-[#2E7D9A] shadow-sm"
    : "bg-[#2E7D9A] text-white hover:bg-[#256880] shadow-sm";
  const tdsClass = light
    ? "bg-transparent text-white border-2 border-white/90 hover:bg-white/10"
    : "bg-white text-[#0B2D5B] border border-[#0B2D5B] hover:bg-[#F4F6F8]";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Link
        href={quoteHref}
        className={`inline-flex items-center justify-center font-bold rounded transition-colors ${sizeClass} ${quoteClass}`}
      >
        Request Quote
      </Link>
      <Link
        href="/contact?type=contact"
        className={`inline-flex items-center justify-center font-bold rounded transition-colors ${sizeClass} ${contactClass}`}
      >
        Contact Factory
      </Link>
      <Link
        href={tdsHref}
        className={`inline-flex items-center justify-center font-bold rounded transition-colors ${sizeClass} ${tdsClass}`}
      >
        Get TDS / MSDS
      </Link>
    </div>
  );
}
