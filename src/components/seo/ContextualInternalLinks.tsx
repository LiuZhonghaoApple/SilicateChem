import Link from "next/link";
import { getContextualInternalLinks } from "@/lib/seo/internal-link-graph";

type Props = {
  currentPath: string;
  title?: string;
};

export function ContextualInternalLinks({
  currentPath,
  title = "Related Buyer Resources",
}: Props) {
  const links = getContextualInternalLinks(currentPath);

  return (
    <aside className="rounded-xl border border-[#D7E6EF] bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-[#0B2D5B]">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
        Context-matched specifications, applications and procurement evidence.
      </p>
      <ul className="mt-4 divide-y divide-[#E2E8F0]">
        {links.map((link) => (
          <li key={link.href} className="py-3 first:pt-0 last:pb-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#2E7D9A]">
              {link.kind}
            </span>
            <Link
              href={link.href}
              className="mt-1 block text-sm font-semibold leading-snug text-[#0B2D5B] hover:text-[#2E7D9A] hover:underline"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

