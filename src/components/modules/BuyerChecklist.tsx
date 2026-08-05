import { publishedList } from "@/lib/content-status";
import type { Publishable } from "@/types";

/**
 * Ordered verification checklist, with an optional secondary group.
 *
 * Content-agnostic: every string comes from the caller. The secondary group is
 * a labelled list (used for "Typical RFQ Information", but the component does
 * not know or care what the label says).
 */
export function BuyerChecklist({
  block,
  secondary,
  note,
}: {
  block: Publishable<readonly string[]>;
  secondary?: {
    title: string;
    block: Publishable<readonly string[]>;
  };
  note?: string;
}) {
  const items = publishedList(block);
  const secondaryItems = secondary ? publishedList(secondary.block) : [];

  if (items.length === 0 && secondaryItems.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#D7E6EF] bg-white p-6 shadow-sm md:p-8">
      {items.length > 0 && (
        <ol className="grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF4FA] text-xs font-bold text-[#2E7D9A]"
              >
                {index + 1}
              </span>
              <span className="text-sm leading-relaxed text-[#5A6570]">
                {item}
              </span>
            </li>
          ))}
        </ol>
      )}

      {secondary && secondaryItems.length > 0 && (
        <div
          className={
            items.length > 0
              ? "mt-8 border-t border-[#E2E6EA] pt-6"
              : undefined
          }
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#2E7D9A]">
            {secondary.title}
          </h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {secondaryItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-[#5A6570]"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E7D9A]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {note && (
        <p className="mt-6 border-t border-[#E2E6EA] pt-4 text-sm leading-relaxed text-[#5A6570]">
          {note}
        </p>
      )}
    </div>
  );
}
