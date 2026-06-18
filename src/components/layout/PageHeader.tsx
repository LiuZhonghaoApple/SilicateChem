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

export { PageCTAs } from "@/components/layout/PageCTAs";
