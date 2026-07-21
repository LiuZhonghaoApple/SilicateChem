import { neon } from "@neondatabase/serverless";

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
  `CREATE TABLE IF NOT EXISTS site_daily_snapshots (
    snapshot_date DATE PRIMARY KEY,
    public_page_count INTEGER NOT NULL DEFAULT 0,
    updated_page_count INTEGER NOT NULL DEFAULT 0,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  `CREATE INDEX IF NOT EXISTS geo_indexnow_submitted_idx ON geo_indexnow_submissions (submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS geo_indexnow_fingerprint_idx ON geo_indexnow_submissions (content_fingerprint, success)`,
  `CREATE INDEX IF NOT EXISTS reporting_sync_provider_idx ON reporting_sync_runs (provider, completed_at DESC)`,
  `CREATE INDEX IF NOT EXISTS ga4_source_daily_date_idx ON ga4_source_daily (metric_date DESC, sessions DESC)`,
  `CREATE INDEX IF NOT EXISTS ga4_page_daily_date_idx ON ga4_page_daily (metric_date DESC, screen_page_views DESC)`,
  `CREATE INDEX IF NOT EXISTS gsc_query_daily_date_idx ON gsc_query_daily (metric_date DESC, impressions DESC)`,
  `CREATE INDEX IF NOT EXISTS gsc_page_daily_date_idx ON gsc_page_daily (metric_date DESC, impressions DESC)`,
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`CRM migration complete (${statements.length} statements).`);
