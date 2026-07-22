import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run CRM migrations.");
}

const sql = neon(databaseUrl);

const statements = [
  `CREATE TABLE IF NOT EXISTS crm_leads (
    id TEXT PRIMARY KEY,
    submitted_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    country TEXT NOT NULL,
    product TEXT,
    quantity TEXT,
    message TEXT NOT NULL,
    inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('quote', 'sample', 'msds_tds', 'contact')),
    source_page TEXT,
    source_path TEXT,
    funnel_layer TEXT NOT NULL,
    landing_page TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    visitor_id TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    geo_source TEXT,
    geo_referrer_host TEXT,
    geo_landing_path TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'qualified', 'quoted', 'sample', 'negotiating', 'won', 'lost', 'spam')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    owner TEXT,
    next_follow_up_at TIMESTAMPTZ,
    first_contacted_at TIMESTAMPTZ,
    quoted_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    lost_reason TEXT,
    email_delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_delivery_status IN ('pending', 'sent', 'failed')),
    email_delivery_error TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS crm_lead_notes (
    id BIGSERIAL PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS crm_lead_status_history (
    id BIGSERIAL PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    note TEXT,
    changed_by TEXT NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    actor TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS security_rate_limits (
    namespace TEXT NOT NULL,
    identifier_hash TEXT NOT NULL,
    bucket_start TIMESTAMPTZ NOT NULL,
    bucket_end TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (namespace, identifier_hash, bucket_start)
  )`,
  `CREATE TABLE IF NOT EXISTS conversion_events (
    id BIGSERIAL PRIMARY KEY,
    event_id TEXT NOT NULL UNIQUE,
    event_name TEXT NOT NULL CHECK (event_name IN (
      'whatsapp_click', 'ai_advisor_open', 'ai_advisor_question',
      'ai_advisor_answer', 'ai_advisor_handoff', 'rfq_start', 'rfq_submit'
    )),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    page_path TEXT NOT NULL,
    page_source TEXT,
    product_interest TEXT,
    inquiry_type TEXT,
    event_label TEXT,
    visitor_id_hash TEXT,
    landing_page TEXT,
    referrer_host TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    geo_source TEXT,
    client_ip_hash TEXT
  )`,
  `ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS geo_source TEXT`,
  `ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS geo_referrer_host TEXT`,
  `ALTER TABLE crm_leads ADD COLUMN IF NOT EXISTS geo_landing_path TEXT`,
  `CREATE TABLE IF NOT EXISTS geo_indexnow_submissions (
    id BIGSERIAL PRIMARY KEY,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    trigger TEXT NOT NULL,
    content_fingerprint TEXT NOT NULL,
    url_count INTEGER NOT NULL,
    urls JSONB NOT NULL,
    response_status INTEGER NOT NULL,
    response_body TEXT,
    success BOOLEAN NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reporting_sync_runs (
    id BIGSERIAL PRIMARY KEY,
    provider TEXT NOT NULL CHECK (provider IN ('site', 'ga4', 'gsc')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'not_configured')),
    trigger TEXT NOT NULL,
    window_start DATE NOT NULL,
    window_end DATE NOT NULL,
    row_count INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS ga4_daily_metrics (
    metric_date DATE PRIMARY KEY,
    sessions INTEGER NOT NULL DEFAULT 0,
    total_users INTEGER NOT NULL DEFAULT 0,
    new_users INTEGER NOT NULL DEFAULT 0,
    engaged_sessions INTEGER NOT NULL DEFAULT 0,
    screen_page_views INTEGER NOT NULL DEFAULT 0,
    engagement_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
    key_events DOUBLE PRECISION NOT NULL DEFAULT 0,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS ga4_source_daily (
    metric_date DATE NOT NULL,
    source TEXT NOT NULL,
    medium TEXT NOT NULL,
    channel_group TEXT NOT NULL,
    sessions INTEGER NOT NULL DEFAULT 0,
    total_users INTEGER NOT NULL DEFAULT 0,
    key_events DOUBLE PRECISION NOT NULL DEFAULT 0,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (metric_date, source, medium, channel_group)
  )`,
  `CREATE TABLE IF NOT EXISTS ga4_page_daily (
    metric_date DATE NOT NULL,
    page_path TEXT NOT NULL,
    sessions INTEGER NOT NULL DEFAULT 0,
    total_users INTEGER NOT NULL DEFAULT 0,
    screen_page_views INTEGER NOT NULL DEFAULT 0,
    key_events DOUBLE PRECISION NOT NULL DEFAULT 0,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (metric_date, page_path)
  )`,
  `CREATE TABLE IF NOT EXISTS ga4_landing_source_daily (
    metric_date DATE NOT NULL,
    source TEXT NOT NULL,
    medium TEXT NOT NULL,
    channel_group TEXT NOT NULL,
    landing_page TEXT NOT NULL,
    sessions INTEGER NOT NULL DEFAULT 0,
    total_users INTEGER NOT NULL DEFAULT 0,
    key_events DOUBLE PRECISION NOT NULL DEFAULT 0,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (metric_date, source, medium, channel_group, landing_page)
  )`,
  `CREATE TABLE IF NOT EXISTS gsc_daily_metrics (
    metric_date DATE PRIMARY KEY,
    clicks DOUBLE PRECISION NOT NULL DEFAULT 0,
    impressions DOUBLE PRECISION NOT NULL DEFAULT 0,
    ctr DOUBLE PRECISION NOT NULL DEFAULT 0,
    position DOUBLE PRECISION NOT NULL DEFAULT 0,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsc_query_daily (
    metric_date DATE NOT NULL,
    query TEXT NOT NULL,
    clicks DOUBLE PRECISION NOT NULL DEFAULT 0,
    impressions DOUBLE PRECISION NOT NULL DEFAULT 0,
    ctr DOUBLE PRECISION NOT NULL DEFAULT 0,
    position DOUBLE PRECISION NOT NULL DEFAULT 0,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (metric_date, query)
  )`,
  `CREATE TABLE IF NOT EXISTS gsc_page_daily (
    metric_date DATE NOT NULL,
    page TEXT NOT NULL,
    clicks DOUBLE PRECISION NOT NULL DEFAULT 0,
    impressions DOUBLE PRECISION NOT NULL DEFAULT 0,
    ctr DOUBLE PRECISION NOT NULL DEFAULT 0,
    position DOUBLE PRECISION NOT NULL DEFAULT 0,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (metric_date, page)
  )`,
  `CREATE TABLE IF NOT EXISTS gsc_site_snapshots (
    snapshot_date DATE PRIMARY KEY,
    sitemap_submitted INTEGER NOT NULL DEFAULT 0,
    sitemap_indexed INTEGER NOT NULL DEFAULT 0,
    sitemap_errors INTEGER NOT NULL DEFAULT 0,
    sitemap_warnings INTEGER NOT NULL DEFAULT 0,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS gsc_url_inspection_snapshots (
    snapshot_date DATE NOT NULL,
    inspected_url TEXT NOT NULL,
    verdict TEXT NOT NULL,
    coverage_state TEXT NOT NULL,
    robots_txt_state TEXT NOT NULL,
    indexing_state TEXT NOT NULL,
    last_crawl_time TIMESTAMPTZ,
    page_fetch_state TEXT NOT NULL,
    google_canonical TEXT,
    user_canonical TEXT,
    crawled_as TEXT NOT NULL,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_date, inspected_url)
  )`,
  `CREATE TABLE IF NOT EXISTS site_daily_snapshots (
    snapshot_date DATE PRIMARY KEY,
    public_page_count INTEGER NOT NULL DEFAULT 0,
    updated_page_count INTEGER NOT NULL DEFAULT 0,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS geo_citation_observations (
    id BIGSERIAL PRIMARY KEY,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    provider TEXT NOT NULL CHECK (provider IN ('chatgpt', 'copilot', 'perplexity', 'claude', 'gemini', 'other')),
    question TEXT NOT NULL,
    cited_url TEXT,
    cited_page_path TEXT,
    result_status TEXT NOT NULL CHECK (result_status IN ('cited', 'not_cited', 'incorrect')),
    answer_note TEXT,
    created_by TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS geo_content_reviews (
    page_path TEXT PRIMARY KEY,
    content_version TEXT NOT NULL,
    evidence_source TEXT NOT NULL,
    review_status TEXT NOT NULL DEFAULT 'source_linked' CHECK (review_status IN ('source_linked', 'reviewed', 'needs_update')),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS backlink_baseline_snapshots (
    id BIGSERIAL PRIMARY KEY,
    provider TEXT NOT NULL CHECK (provider IN ('gsc', 'bing')),
    observed_on DATE NOT NULL,
    connection_status TEXT NOT NULL CHECK (connection_status IN ('ready', 'processing', 'not_authenticated', 'error')),
    referring_domains INTEGER,
    linking_pages INTEGER,
    sample_links INTEGER,
    anchor_count INTEGER,
    evidence_url TEXT NOT NULL,
    note TEXT NOT NULL,
    observed_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, observed_on)
  )`,
  `CREATE TABLE IF NOT EXISTS backlink_opportunities (
    id BIGSERIAL PRIMARY KEY,
    source_domain TEXT NOT NULL UNIQUE,
    source_name TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('association', 'trade-media', 'industry-directory', 'marketplace', 'partner')),
    industry_focus TEXT NOT NULL,
    region TEXT NOT NULL,
    fit_score INTEGER NOT NULL CHECK (fit_score BETWEEN 0 AND 100),
    priority TEXT NOT NULL CHECK (priority IN ('S', 'A', 'B')),
    status TEXT NOT NULL DEFAULT 'qualified' CHECK (status IN ('candidate', 'qualified', 'contact-ready', 'contacted', 'accepted', 'live', 'rejected', 'lost')),
    access_model TEXT NOT NULL,
    cost_note TEXT,
    evidence_url TEXT NOT NULL,
    verification_note TEXT NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    planned_target_path TEXT,
    suggested_asset TEXT,
    next_action TEXT,
    utm_source_key TEXT,
    owner TEXT,
    source_page_url TEXT,
    anchor_text TEXT,
    link_rel TEXT NOT NULL DEFAULT 'unknown' CHECK (link_rel IN ('unknown', 'follow', 'nofollow', 'sponsored', 'ugc')),
    first_live_at TIMESTAMPTZ,
    last_checked_at TIMESTAMPTZ,
    next_review_at DATE,
    http_status INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS crm_leads_submitted_at_idx ON crm_leads (submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_status_idx ON crm_leads (status, submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_product_idx ON crm_leads (product, submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_source_path_idx ON crm_leads (source_path, submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_geo_source_idx ON crm_leads (geo_source, submitted_at DESC) WHERE geo_source IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS crm_leads_follow_up_idx ON crm_leads (next_follow_up_at) WHERE next_follow_up_at IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS crm_leads_email_idx ON crm_leads (LOWER(email))`,
  `CREATE INDEX IF NOT EXISTS crm_lead_notes_lead_idx ON crm_lead_notes (lead_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_lead_history_lead_idx ON crm_lead_status_history (lead_id, changed_at DESC)`,
  `CREATE INDEX IF NOT EXISTS admin_audit_created_idx ON admin_audit_logs (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS security_rate_limits_expiry_idx ON security_rate_limits (bucket_end)`,
  `CREATE INDEX IF NOT EXISTS security_rate_limits_namespace_idx ON security_rate_limits (namespace, updated_at DESC)`,
  `CREATE INDEX IF NOT EXISTS conversion_events_name_time_idx ON conversion_events (event_name, occurred_at DESC)`,
  `CREATE INDEX IF NOT EXISTS conversion_events_page_time_idx ON conversion_events (page_path, occurred_at DESC)`,
  `CREATE INDEX IF NOT EXISTS conversion_events_source_time_idx ON conversion_events (utm_source, geo_source, occurred_at DESC)`,
  `CREATE INDEX IF NOT EXISTS geo_indexnow_submitted_idx ON geo_indexnow_submissions (submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS geo_indexnow_fingerprint_idx ON geo_indexnow_submissions (content_fingerprint, success)`,
  `CREATE INDEX IF NOT EXISTS reporting_sync_provider_idx ON reporting_sync_runs (provider, completed_at DESC)`,
  `CREATE INDEX IF NOT EXISTS ga4_source_daily_date_idx ON ga4_source_daily (metric_date DESC, sessions DESC)`,
  `CREATE INDEX IF NOT EXISTS ga4_page_daily_date_idx ON ga4_page_daily (metric_date DESC, screen_page_views DESC)`,
  `CREATE INDEX IF NOT EXISTS ga4_landing_source_date_idx ON ga4_landing_source_daily (metric_date DESC, sessions DESC)`,
  `CREATE INDEX IF NOT EXISTS gsc_query_daily_date_idx ON gsc_query_daily (metric_date DESC, impressions DESC)`,
  `CREATE INDEX IF NOT EXISTS gsc_page_daily_date_idx ON gsc_page_daily (metric_date DESC, impressions DESC)`,
  `CREATE INDEX IF NOT EXISTS gsc_inspection_date_idx ON gsc_url_inspection_snapshots (snapshot_date DESC, verdict)`,
  `CREATE INDEX IF NOT EXISTS geo_citation_observed_idx ON geo_citation_observations (observed_at DESC)`,
  `CREATE INDEX IF NOT EXISTS geo_citation_provider_idx ON geo_citation_observations (provider, result_status, observed_at DESC)`,
  `CREATE INDEX IF NOT EXISTS backlink_baseline_provider_idx ON backlink_baseline_snapshots (provider, observed_on DESC)`,
  `CREATE INDEX IF NOT EXISTS backlink_opportunity_status_idx ON backlink_opportunities (status, priority, fit_score DESC)`,
  `CREATE INDEX IF NOT EXISTS backlink_opportunity_target_idx ON backlink_opportunities (planned_target_path, status)`,
];

for (const statement of statements) {
  await sql.query(statement);
}

const candidateFile = new URL("../src/data/backlink-candidates.json", import.meta.url);
const candidates = JSON.parse(await readFile(candidateFile, "utf8"));

if (!Array.isArray(candidates) || candidates.length !== 30) {
  throw new Error("Backlink candidate seed must contain exactly 30 records.");
}

const uniqueDomains = new Set(candidates.map((candidate) => candidate.sourceDomain));
if (uniqueDomains.size !== candidates.length) {
  throw new Error("Backlink candidate source domains must be unique.");
}

const seedQueries = candidates.map((candidate) => sql`INSERT INTO backlink_opportunities (
  source_domain, source_name, channel, industry_focus, region, fit_score,
  priority, status, access_model, cost_note, evidence_url, verification_note,
  planned_target_path, suggested_asset, next_action, utm_source_key
) VALUES (
  ${candidate.sourceDomain}, ${candidate.sourceName}, ${candidate.channel},
  ${candidate.industryFocus}, ${candidate.region}, ${candidate.fitScore},
  ${candidate.priority}, 'qualified', ${candidate.accessModel}, ${candidate.costNote},
  ${candidate.evidenceUrl}, ${candidate.verificationNote},
  ${candidate.plannedTargetPath}, ${candidate.suggestedAsset}, ${candidate.nextAction},
  ${candidate.sourceDomain}
) ON CONFLICT (source_domain) DO UPDATE SET
  source_name = EXCLUDED.source_name,
  channel = EXCLUDED.channel,
  industry_focus = EXCLUDED.industry_focus,
  region = EXCLUDED.region,
  fit_score = EXCLUDED.fit_score,
  priority = EXCLUDED.priority,
  access_model = EXCLUDED.access_model,
  cost_note = EXCLUDED.cost_note,
  evidence_url = EXCLUDED.evidence_url,
  verification_note = EXCLUDED.verification_note,
  verified_at = NOW(),
  planned_target_path = COALESCE(backlink_opportunities.planned_target_path, EXCLUDED.planned_target_path),
  suggested_asset = EXCLUDED.suggested_asset,
  next_action = EXCLUDED.next_action,
  utm_source_key = COALESCE(backlink_opportunities.utm_source_key, EXCLUDED.utm_source_key),
  updated_at = NOW()`);

seedQueries.push(
  sql`INSERT INTO backlink_baseline_snapshots (
    provider, observed_on, connection_status, evidence_url, note, observed_by
  ) VALUES (
    'gsc', '2026-07-22', 'processing',
    'https://search.google.com/search-console/links?resource_id=https%3A%2F%2Fwww.silicatechem.com%2F',
    'Verified property is available. The Links report is still processing data and the external-link export is disabled; counts must remain unknown instead of being recorded as zero.',
    'codex-readonly-audit'
  ) ON CONFLICT (provider, observed_on) DO NOTHING`,
  sql`INSERT INTO backlink_baseline_snapshots (
    provider, observed_on, connection_status, evidence_url, note, observed_by
  ) VALUES (
    'bing', '2026-07-22', 'not_authenticated',
    'https://www.bing.com/webmasters/about?from=home',
    'The current browser session is not authenticated in Bing Webmaster Tools. No account was created or connected because external registration is outside the approved scope.',
    'codex-readonly-audit'
  ) ON CONFLICT (provider, observed_on) DO NOTHING`
);

await sql.transaction(seedQueries);

console.log(
  `CRM migration complete (${statements.length} statements, ${candidates.length} backlink candidates).`
);
