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
  `CREATE INDEX IF NOT EXISTS crm_leads_submitted_at_idx ON crm_leads (submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_status_idx ON crm_leads (status, submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_product_idx ON crm_leads (product, submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_source_path_idx ON crm_leads (source_path, submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_leads_follow_up_idx ON crm_leads (next_follow_up_at) WHERE next_follow_up_at IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS crm_leads_email_idx ON crm_leads (LOWER(email))`,
  `CREATE INDEX IF NOT EXISTS crm_lead_notes_lead_idx ON crm_lead_notes (lead_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS crm_lead_history_lead_idx ON crm_lead_status_history (lead_id, changed_at DESC)`,
  `CREATE INDEX IF NOT EXISTS admin_audit_created_idx ON admin_audit_logs (created_at DESC)`,
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`CRM migration complete (${statements.length} statements).`);
