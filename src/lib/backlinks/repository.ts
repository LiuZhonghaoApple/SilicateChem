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
export const backlinkConnectionStatuses = ["ready", "processing", "not_authenticated", "error"] as const;

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
  total: number;
  highPriority: number;
  live: number;
  sessions: number;
  users: number;
  keyEvents: number;
  inquiries: number;
};

export async function getBacklinkBaselines(): Promise<BacklinkBaseline[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT DISTINCT ON (provider)
    id,
    provider,
    observed_on AS "observedOn",
    connection_status AS "connectionStatus",
    referring_domains AS "referringDomains",
    linking_pages AS "linkingPages",
    sample_links AS "sampleLinks",
    anchor_count AS "anchorCount",
    evidence_url AS "evidenceUrl",
    note,
    observed_by AS "observedBy",
    updated_at AS "updatedAt"
  FROM backlink_baseline_snapshots
  ORDER BY provider, observed_on DESC, updated_at DESC`;
  return rows as unknown as BacklinkBaseline[];
}

export async function getBacklinkSummary(days = 30): Promise<BacklinkSummary> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH opportunity AS (
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE priority IN ('S', 'A'))::int AS "highPriority",
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
  return result[0] ?? { total: 0, highPriority: 0, live: 0, sessions: 0, users: 0, keyEvents: 0, inquiries: 0 };
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
      b.source_page_url AS "sourcePageUrl",
      b.anchor_text AS "anchorText",
      b.link_rel AS "linkRel",
      b.next_review_at AS "nextReviewAt",
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
      AND ($6 = '' OR b.channel = $6)
    ORDER BY CASE b.priority WHEN 'S' THEN 1 WHEN 'A' THEN 2 ELSE 3 END, b.fit_score DESC, b.source_domain`,
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
  actor: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`UPDATE backlink_opportunities SET
      status = ${params.status},
      planned_target_path = ${params.plannedTargetPath},
      owner = ${params.owner},
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
