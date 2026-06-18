import Link from "next/link";

type CardProps = {
  title: string;
  description: string;
  href?: string;
  badge?: string;
  children?: React.ReactNode;
};

export function Card({ title, description, href, badge, children }: CardProps) {
  const content = (
    <div className="group h-full rounded-lg border border-[#E2E6EA] bg-white p-6 transition-shadow hover:shadow-md">
      {badge && (
        <span className="mb-3 inline-block rounded bg-[#2E7D9A]/10 px-2.5 py-0.5 text-xs font-semibold text-[#2E7D9A]">
          {badge}
        </span>
      )}
      <h3 className="text-lg font-bold text-[#0B2D5B] group-hover:text-[#2E7D9A] transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#5A6570] leading-relaxed">{description}</p>
      {children}
      {href && (
        <p className="mt-4 text-sm font-semibold text-[#2E7D9A] group-hover:underline">
          View specifications →
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
