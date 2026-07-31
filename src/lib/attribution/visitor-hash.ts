import { createHmac } from "node:crypto";

/**
 * Canonical visitor/identifier hashing.
 *
 * A front-end `visitorId` (a per-session UUID from sessionStorage) is stored on
 * `conversion_events` ONLY as this HMAC digest (`visitor_id_hash`), never raw.
 * `crm_leads.visitor_id`, by contrast, stores the RAW UUID. To reconnect a lead
 * to its anonymous browsing trail you must re-hash the lead's raw visitor_id
 * with this exact same function/secret and match it against `visitor_id_hash`.
 *
 * Both the writer (`/api/conversion-event`) and every reader (visitor 360 view,
 * anonymous-behaviour panel) MUST import this single helper so the algorithm and
 * secret can never drift apart.
 */
export function hashIdentifier(value: string | undefined | null): string | null {
  if (!value || value === "unknown") return null;
  const secret =
    process.env.ATTRIBUTION_HASH_SECRET ??
    process.env.ADMIN_SESSION_SECRET ??
    "silicatechem-conversion-v1";
  return createHmac("sha256", secret).update(value).digest("hex");
}
