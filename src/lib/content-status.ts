import type { Publishable, PublishStatus, StatusedItem } from "@/types";

/**
 * Editorial gate for content blocks.
 *
 * Blocks authored but not yet cleared for publication carry `status` in the
 * data layer instead of a code comment, so operations can flip a block live
 * without touching components. Components render approved content only.
 */

export function isApproved(status: PublishStatus | undefined): boolean {
  // Items without an explicit status inherit their block's approval.
  return status === undefined || status === "approved";
}

/** Returns the block's value when approved, otherwise `null`. */
export function published<T>(block: Publishable<T>): T | null {
  return block.status === "approved" ? block.value : null;
}

/**
 * Returns an approved block's approved items. Yields an empty array when the
 * block itself is withheld, so callers can render unconditionally.
 */
export function publishedItems<T extends StatusedItem>(
  block: Publishable<readonly T[]>
): readonly T[] {
  if (block.status !== "approved") return [];
  return block.value.filter((item) => isApproved(item.status));
}

/** Same gate for blocks whose items are plain strings and carry no status. */
export function publishedList(
  block: Publishable<readonly string[]>
): readonly string[] {
  return block.status === "approved" ? block.value : [];
}
