import { getDatabase } from "@/lib/db";

export const backlinkPriorities = ["S", "A", "B"] as const;
export const backlinkStatuses = [
  "candidate",
  "qualified",
  "contact-ready",
  "contacted",
  "accepted",
  "live",
  "rejected",
  "lost",
] as const;
export const backlinkChannels = [
  "association",
  "trade-media",
  "industry-directory",
  "marketplace",
  "partner",
] as const;
export const backlinkRelValues = ["unknown", "follow", "nofollow", "sponsored", "ugc"] as const;
export const backlinkProviders = ["gsc", "bing"] as const;

// Baseline states are deliberately terminal: every value answers "do we have
// backlinks?" outright. There is no in-progress value, because nothing in the
// system would ever advance it — the old "processing" sat on the dashboard for
// ten days claiming data was still being generated.
export const backlinkConnectionStatuses = [
  "has_data",
  "confirmed_zero",
  "unknown",
  "not_configured",
  "error",
] as const;

/** A baseline observation older than this is treated as due for re-checking. */
export const BASELINE_STALE_AFTER_DAYS = 7;

export type BacklinkPriority = (typeof backlinkPriorities)[number];
export type BacklinkStatus = (typeof backlinkStatuses)[number];
export type BacklinkChannel = (typeof backlinkChannels)[number];
export type BacklinkRel = (typeof backlinkRelValues)[number];
export type BacklinkProvider = (typeof backlinkProviders)[number];
export type BacklinkConnectionStatus = (typeof backlinkConnectionStatuses)[number];

export type BacklinkBaseline = {
  id: number;
  provider: BacklinkProvider;
  observedOn: string;
  connectionStatus: BacklinkConnectionStatus;
  referringDomains: number | null;
  linkingPages: number | null;
  sampleLinks: number | null;
  anchorCount: number | null;
  evidenceUrl: string;
  note: string;
  observedBy: string;
  updatedAt: string;
};

export type BacklinkOpportunity = {
  id: number;
  sourceDomain: string;
  sourceName: string;
  channel: BacklinkChannel;
  industryFocus: string;
  region: string;
  fitScore: number;
  priority: BacklinkPriority;
  status: BacklinkStatus;
  accessModel: string;
  costNote: string | null;
  evidenceUrl: string;
  verificationNote: string;
  plannedTargetPath: string | null;
  suggestedAsset: string | null;
  nextAction: string | null;
  owner: string | null;
  // Editor contact captured at outreach time so follow-ups don't require
  // re-hunting the publication's contact page.
  contactEmail: string | null;
  contactName: string | null;
  contactPageUrl: string | null;
  sourcePageUrl: string | null;
  anchorText: string | null;
  linkRel: BacklinkRel;
  nextReviewAt: string | null;
  notes: string | null;
  sessions: number;
  users: number;
  keyEvents: number;
  inquiries: number;
};

export type BacklinkSummary = {
  /** Every row, including the ones excluded by the free-only policy. */
  total: number;
  /** Rows still in play — this is what the dashboard list actually shows. */
  activeTotal: number;
  excluded: number;
  highPriority: number;
  /** Anything we have actually reached out about (contacted / accepted / live). */
  outreachStarted: number;
  accepted: number;
  live: number;
  sessions: number;
  users: number;
  keyEvents: number;
  inquiries: number;
};

/**
 * Maps retired status values onto the current set at read time.
 *
 * Keeps the dashboard correct regardless of whether the database migration has
 * run yet, so deploy order doesn't matter. `processing` becomes `unknown` and
 * never `confirmed_zero`: nobody looked, which is not the same as "there are none".
 */
function normalizeConnectionStatus(value: string, hasCounts: boolean): BacklinkConnectionStatus {
  if ((backlinkConnectionStatuses as readonly string[]).includes(value)) {
    return value as BacklinkConnectionStatus;
  }
  if (value === "ready") return hasCounts ? "has_data" : "unknown";
  if (value === "not_authenticated") return "not_configured";
  return "unknown";
}

/** Whole days between an `observed_on` date and today (both `YYYY-MM-DD`). */
export function daysSinceObservation(observedOn: string, today: string): number {
  const observed = Date.parse(`${observedOn}T00:00:00Z`);
  const now = Date.parse(`${today}T00:00:00Z`);
  if (Number.isNaN(observed) || Number.isNaN(now)) return 0;
  return Math.max(0, Math.round((now - observed) / 86_400_000));
}

export async function getBacklinkBaselines(): Promise<BacklinkBaseline[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT DISTINCT ON (provider)
    id,
    provider,
    observed_on::text AS "observedOn",
    connection_status AS "connectionStatus",
    referring_domains AS "referringDomains",
    linking_pages AS "linkingPages",
    sample_links AS "sampleLinks",
    anchor_count AS "anchorCount",
    evidence_url AS "evidenceUrl",
    note,
    observed_by AS "observedBy",
    updated_at::text AS "updatedAt"
  FROM backlink_baseline_snapshots
  ORDER BY provider, observed_on DESC, updated_at DESC`;
  return (rows as unknown as BacklinkBaseline[]).map((row) => ({
    ...row,
    connectionStatus: normalizeConnectionStatus(
      row.connectionStatus,
      row.referringDomains != null ||
        row.linkingPages != null ||
        row.sampleLinks != null ||
        row.anchorCount != null
    ),
  }));
}

export async function getBacklinkSummary(days = 30): Promise<BacklinkSummary> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH opportunity AS (
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status <> 'rejected')::int AS "activeTotal",
        COUNT(*) FILTER (WHERE status = 'rejected')::int AS excluded,
        -- Excluded rows are hidden from the list, so counting them here made the
        -- headline cards disagree with the rows underneath them.
        COUNT(*) FILTER (WHERE priority IN ('S', 'A') AND status <> 'rejected')::int AS "highPriority",
        COUNT(*) FILTER (WHERE status IN ('contacted', 'accepted', 'live'))::int AS "outreachStarted",
        COUNT(*) FILTER (WHERE status = 'accepted')::int AS accepted,
        COUNT(*) FILTER (WHERE status = 'live')::int AS live
      FROM backlink_opportunities
    ), traffic AS (
      SELECT
        COALESCE(SUM(sessions), 0)::int AS sessions,
        COALESCE(SUM(total_users), 0)::int AS users,
        COALESCE(SUM(key_events), 0)::float8 AS "keyEvents"
      FROM ga4_source_daily
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
        AND channel_group = 'Referral'
    ), inquiry AS (
      SELECT COUNT(*) FILTER (WHERE status <> 'spam')::int AS inquiries
      FROM crm_leads
      WHERE submitted_at >= NOW() - ($1::text || ' days')::interval
        AND (COALESCE(referrer, '') <> '' OR COALESCE(utm_medium, '') ILIKE '%referral%')
    ) SELECT * FROM opportunity CROSS JOIN traffic CROSS JOIN inquiry`,
    [days]
  );
  const result = rows as unknown as BacklinkSummary[];
  return (
    result[0] ?? {
      total: 0,
      activeTotal: 0,
      excluded: 0,
      highPriority: 0,
      outreachStarted: 0,
      accepted: 0,
      live: 0,
      sessions: 0,
      users: 0,
      keyEvents: 0,
      inquiries: 0,
    }
  );
}

export async function listBacklinkOpportunities(
  filters?: { query?: string; priority?: string; status?: string; channel?: string },
  days = 30
): Promise<BacklinkOpportunity[]> {
  const sql = getDatabase();
  const query = filters?.query?.trim() ?? "";
  const search = `%${query}%`;
  const priority = filters?.priority ?? "";
  const status = filters?.status ?? "";
  const channel = filters?.channel ?? "";
  const rows = await sql.query(
    `SELECT
      b.id,
      b.source_domain AS "sourceDomain",
      b.source_name AS "sourceName",
      b.channel,
      b.industry_focus AS "industryFocus",
      b.region,
      b.fit_score AS "fitScore",
      b.priority,
      b.status,
      b.access_model AS "accessModel",
      b.cost_note AS "costNote",
      b.evidence_url AS "evidenceUrl",
      b.verification_note AS "verificationNote",
      b.planned_target_path AS "plannedTargetPath",
      b.suggested_asset AS "suggestedAsset",
      b.next_action AS "nextAction",
      b.owner,
      b.contact_email AS "contactEmail",
      b.contact_name AS "contactName",
      b.contact_page_url AS "contactPageUrl",
      b.source_page_url AS "sourcePageUrl",
      b.anchor_text AS "anchorText",
      b.link_rel AS "linkRel",
      b.next_review_at::text AS "nextReviewAt",
      b.notes,
      COALESCE(traffic.sessions, 0)::int AS sessions,
      COALESCE(traffic.users, 0)::int AS users,
      COALESCE(traffic.key_events, 0)::float8 AS "keyEvents",
      COALESCE(inquiry.inquiries, 0)::int AS inquiries
    FROM backlink_opportunities b
    LEFT JOIN LATERAL (
      SELECT
        SUM(g.sessions)::int AS sessions,
        SUM(g.total_users)::int AS users,
        SUM(g.key_events)::float8 AS key_events
      FROM ga4_source_daily g
      WHERE g.metric_date >= CURRENT_DATE - ($5::int - 1)
        AND (
          regexp_replace(lower(g.source), '^www\\.', '') = b.source_domain
          OR regexp_replace(lower(g.source), '^www\\.', '') LIKE '%.' || b.source_domain
        )
    ) traffic ON TRUE
    LEFT JOIN LATERAL (
      SELECT COUNT(*) FILTER (WHERE l.status <> 'spam')::int AS inquiries
      FROM crm_leads l
      WHERE l.submitted_at >= NOW() - ($5::text || ' days')::interval
        AND (
          position(b.source_domain IN lower(COALESCE(l.referrer, ''))) > 0
          OR lower(COALESCE(l.utm_source, '')) = lower(COALESCE(b.utm_source_key, ''))
        )
    ) inquiry ON TRUE
    WHERE ($1 = '' OR b.source_name ILIKE $2 OR b.source_domain ILIKE $2 OR b.industry_focus ILIKE $2)
      AND ($3 = '' OR b.priority = $3)
      AND ($4 = '' OR b.status = $4)
      -- Hide excluded (paid/rejected) opportunities from the default list so they
      -- don't clutter the page. Still viewable by explicitly filtering status='rejected'.
      AND ($4 <> '' OR b.status <> 'rejected')
      AND ($6 = '' OR b.channel = $6)
    ORDER BY
      -- Progress first: the opportunities that actually moved (live/accepted/
      -- contacted) belong at the top of the page; untouched candidates below.
      CASE b.status
        WHEN 'live' THEN 1
        WHEN 'accepted' THEN 2
        WHEN 'contacted' THEN 3
        WHEN 'contact-ready' THEN 4
        WHEN 'qualified' THEN 5
        WHEN 'candidate' THEN 6
        WHEN 'lost' THEN 7
        ELSE 8
      END,
      CASE b.priority WHEN 'S' THEN 1 WHEN 'A' THEN 2 ELSE 3 END,
      b.fit_score DESC,
      b.source_domain`,
    [query, search, priority, status, days, channel]
  );
  return rows as unknown as BacklinkOpportunity[];
}

export async function createBacklinkOpportunity(params: {
  sourceDomain: string;
  sourceName: string;
  channel: BacklinkChannel;
  industryFocus: string;
  region: string;
  fitScore: number;
  priority: BacklinkPriority;
  accessModel: string;
  evidenceUrl: string;
  verificationNote: string;
  plannedTargetPath: string | null;
  actor: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`INSERT INTO backlink_opportunities (
      source_domain, source_name, channel, industry_focus, region, fit_score,
      priority, access_model, evidence_url, verification_note, planned_target_path,
      utm_source_key
    ) VALUES (
      ${params.sourceDomain}, ${params.sourceName}, ${params.channel}, ${params.industryFocus},
      ${params.region}, ${params.fitScore}, ${params.priority}, ${params.accessModel},
      ${params.evidenceUrl}, ${params.verificationNote}, ${params.plannedTargetPath}, ${params.sourceDomain}
    )`,
    sql`INSERT INTO admin_audit_logs (action, entity_type, entity_id, actor, metadata)
      VALUES ('backlink_created', 'backlink', ${params.sourceDomain}, ${params.actor},
      ${JSON.stringify({ priority: params.priority, channel: params.channel })}::jsonb)`,
  ]);
}

export async function updateBacklinkOpportunity(params: {
  id: number;
  status: BacklinkStatus;
  plannedTargetPath: string | null;
  owner: string | null;
  sourcePageUrl: string | null;
  anchorText: string | null;
  linkRel: BacklinkRel;
  nextReviewAt: string | null;
  notes: string | null;
  contactEmail?: string | null;
  contactName?: string | null;
  actor: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`UPDATE backlink_opportunities SET
      status = ${params.status},
      planned_target_path = ${params.plannedTargetPath},
      owner = ${params.owner},
      contact_email = ${params.contactEmail ?? null},
      contact_name = ${params.contactName ?? null},
      source_page_url = ${params.sourcePageUrl},
      anchor_text = ${params.anchorText},
      link_rel = ${params.linkRel},
      next_review_at = ${params.nextReviewAt},
      first_live_at = CASE WHEN ${params.status} = 'live' THEN COALESCE(first_live_at, NOW()) ELSE first_live_at END,
      last_checked_at = CASE WHEN ${params.sourcePageUrl} IS NOT NULL THEN NOW() ELSE last_checked_at END,
      notes = ${params.notes},
      updated_at = NOW()
    WHERE id = ${params.id}`,
    sql`INSERT INTO admin_audit_logs (action, entity_type, entity_id, actor, metadata)
      VALUES ('backlink_updated', 'backlink', ${String(params.id)}, ${params.actor},
      ${JSON.stringify({ status: params.status, linkRel: params.linkRel })}::jsonb)`,
  ]);
}

export async function recordBacklinkBaseline(params: {
  provider: BacklinkProvider;
  observedOn: string;
  connectionStatus: BacklinkConnectionStatus;
  referringDomains: number | null;
  linkingPages: number | null;
  sampleLinks: number | null;
  anchorCount: number | null;
  evidenceUrl: string;
  note: string;
  actor: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`INSERT INTO backlink_baseline_snapshots (
      provider, observed_on, connection_status, referring_domains, linking_pages,
      sample_links, anchor_count, evidence_url, note, observed_by, updated_at
    ) VALUES (
      ${params.provider}, ${params.observedOn}, ${params.connectionStatus},
      ${params.referringDomains}, ${params.linkingPages}, ${params.sampleLinks},
      ${params.anchorCount}, ${params.evidenceUrl}, ${params.note}, ${params.actor}, NOW()
    ) ON CONFLICT (provider, observed_on) DO UPDATE SET
      connection_status = EXCLUDED.connection_status,
      referring_domains = EXCLUDED.referring_domains,
      linking_pages = EXCLUDED.linking_pages,
      sample_links = EXCLUDED.sample_links,
      anchor_count = EXCLUDED.anchor_count,
      evidence_url = EXCLUDED.evidence_url,
      note = EXCLUDED.note,
      observed_by = EXCLUDED.observed_by,
      updated_at = NOW()`,
    sql`INSERT INTO admin_audit_logs (action, entity_type, entity_id, actor, metadata)
      VALUES ('backlink_baseline_recorded', 'backlink_baseline', ${params.provider}, ${params.actor},
      ${JSON.stringify({ observedOn: params.observedOn, connectionStatus: params.connectionStatus })}::jsonb)`,
  ]);
}
