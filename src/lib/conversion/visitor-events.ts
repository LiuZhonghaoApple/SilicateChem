import { getDatabase } from "@/lib/db";
import { hashIdentifier } from "@/lib/attribution/visitor-hash";

export type VisitorEvent = {
  eventName: string;
  pagePath: string;
  pageSource: string | null;
  productInterest: string | null;
  geoSource: string | null;
  referrerHost: string | null;
  utmSource: string | null;
  occurredAt: string;
};

export type VisitorSession = {
  visitorHash: string;
  firstSeen: string;
  lastSeen: string;
  eventCount: number;
  actions: string[];
  geoSource: string | null;
  referrerHost: string | null;
  utmSource: string | null;
  landingPage: string | null;
  submittedRfq: boolean;
  convertedToLead: boolean;
};

/**
 * The browsing trail of a single visitor, for the inquiry 360 view.
 * Takes the RAW visitorId stored on crm_leads, re-hashes it with the canonical
 * HMAC, and matches conversion_events.visitor_id_hash. Returns [] when the lead
 * has no visitorId (e.g. manual entry) or nothing was tracked for that session.
 */
export async function getVisitorTimelineByVisitorId(
  visitorId: string | null
): Promise<VisitorEvent[]> {
  const hash = hashIdentifier(visitorId);
  if (!hash) return [];
  const sql = getDatabase();
  const rows = await sql`SELECT
    event_name AS "eventName",
    page_path AS "pagePath",
    page_source AS "pageSource",
    product_interest AS "productInterest",
    geo_source AS "geoSource",
    referrer_host AS "referrerHost",
    utm_source AS "utmSource",
    occurred_at AS "occurredAt"
  FROM conversion_events
  WHERE visitor_id_hash = ${hash}
  ORDER BY occurred_at ASC
  LIMIT 200`;
  return rows as unknown as VisitorEvent[];
}

/**
 * Anonymous-visitor behaviour panel: one row per visitor (grouped by
 * visitor_id_hash), newest activity first, with the ordered action sequence.
 * `convertedToLead` is resolved in JS by hashing every crm_leads.visitor_id and
 * matching — a direct SQL join is impossible because leads store the raw UUID
 * while events store the HMAC, and pgcrypto's hmac() is not guaranteed present.
 */
export async function listVisitorSessions(
  days = 30,
  limit = 200
): Promise<VisitorSession[]> {
  const sql = getDatabase();
  const rows = (await sql`SELECT
    visitor_id_hash AS "visitorHash",
    MIN(occurred_at) AS "firstSeen",
    MAX(occurred_at) AS "lastSeen",
    COUNT(*)::int AS "eventCount",
    array_agg(event_name ORDER BY occurred_at) AS actions,
    (array_agg(geo_source ORDER BY occurred_at) FILTER (WHERE geo_source IS NOT NULL))[1] AS "geoSource",
    (array_agg(referrer_host ORDER BY occurred_at) FILTER (WHERE referrer_host IS NOT NULL))[1] AS "referrerHost",
    (array_agg(utm_source ORDER BY occurred_at) FILTER (WHERE utm_source IS NOT NULL))[1] AS "utmSource",
    (array_agg(landing_page ORDER BY occurred_at) FILTER (WHERE landing_page IS NOT NULL))[1] AS "landingPage",
    bool_or(event_name = 'rfq_submit') AS "submittedRfq"
  FROM conversion_events
  WHERE visitor_id_hash IS NOT NULL
    AND occurred_at >= NOW() - make_interval(days => ${days})
  GROUP BY visitor_id_hash
  ORDER BY MAX(occurred_at) DESC
  LIMIT ${limit}`) as unknown as Array<
    Omit<VisitorSession, "convertedToLead">
  >;

  // Build the set of lead visitor hashes so we can flag which anonymous
  // sessions eventually became a CRM lead.
  const leadRows = (await sql`SELECT DISTINCT visitor_id
    FROM crm_leads
    WHERE visitor_id IS NOT NULL`) as unknown as Array<{ visitor_id: string }>;
  const leadHashes = new Set<string>();
  for (const row of leadRows) {
    const h = hashIdentifier(row.visitor_id);
    if (h) leadHashes.add(h);
  }

  return rows.map((row) => ({
    ...row,
    convertedToLead: row.submittedRfq || leadHashes.has(row.visitorHash),
  }));
}
