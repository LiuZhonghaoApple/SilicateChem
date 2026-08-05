import Link from "next/link";
import { hasRoute } from "@/lib/routes";
import { publishedItems } from "@/lib/content-status";
import type { CardItem, Publishable } from "@/types";

/**
 * Content-agnostic card grid.
 *
 * Knows nothing about products, industries, certificates, countries or cases —
 * it renders `{ title, description, href?, badge? }` and nothing else. Any
 * collection that fits that shape can use it.
 *
 * Dead-link safety: an `href` that does not resolve to a built route renders
 * as plain text, so a renamed slug degrades to unlinked content, never a 404.
 */
export function CardGrid({
  block,
  columns = 4,
  linkLabel = "Details",
}: {
  block: Publishable<readonly CardItem[]>;
  columns?: 2 | 3 | 4;
  linkLabel?: string;
}) {
  const items = publishedItems(block);
  if (items.length === 0) return null;

  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <ul className={`grid gap-4 ${gridCols}`}>
      {items.map((item) => {
        const linkable = item.href !== undefined && hasRoute(item.href);

        return (
          <li
            key={item.title}
            className="flex flex-col rounded-2xl border border-[#D7E6EF] bg-white p-5 shadow-sm"
          >
            {item.badge && (
              <span className="mb-3 inline-block self-start rounded bg-[#EAF4FA] px-2.5 py-0.5 text-xs font-bold text-[#2E7D9A]">
                {item.badge}
              </span>
            )}
            <h3 className="text-base font-bold leading-snug text-[#0B2D5B]">
              {item.title}
            </h3>
            <p className="mt-2 grow text-sm leading-relaxed text-[#5A6570]">
              {item.description}
            </p>
            {linkable && (
              <Link
                href={item.href!}
                className="mt-4 text-sm font-bold text-[#2E7D9A] hover:underline"
              >
                {linkLabel} →
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
