import type { StructuredLead } from "@/lib/leads";
import { getDatabase } from "@/lib/db";

export const leadStatuses = [
  "new",
  "pending",
  "qualified",
  "quoted",
  "sample",
  "negotiating",
  "won",
  "lost",
  "spam",
] as const;

export const leadPriorities = ["low", "normal", "high", "urgent"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadPriority = (typeof leadPriorities)[number];

export type CrmLead = {
  id: string;
  submittedAt: string;
  updatedAt: string;
  name: string;
  email: string;
  company: string;
  country: string;
  product: string | null;
  quantity: string | null;
  message: string;
  inquiryType: string;
  sourcePage: string | null;
  sourcePath: string | null;
  funnelLayer: string;
  landingPage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  visitorId: string | null;
  userAgent: string | null;
  geoSource: string | null;
  geoReferrerHost: string | null;
  geoLandingPath: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  owner: string | null;
  nextFollowUpAt: string | null;
  firstContactedAt: string | null;
  quotedAt: string | null;
  closedAt: string | null;
  lostReason: string | null;
  emailDeliveryStatus: "pending" | "sent" | "failed";
  emailDeliveryError: string | null;
};

export type LeadNote = {
  id: number;
  body: string;
  author: string;
  createdAt: string;
};

export type LeadStatusHistory = {
  id: number;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  changedBy: string;
  changedAt: string;
};

const leadSelect = `
  id,
  submitted_at AS "submittedAt",
  updated_at AS "updatedAt",
  name,
  email,
  company,
  country,
  product,
  quantity,
  message,
  inquiry_type AS "inquiryType",
  source_page AS "sourcePage",
  source_path AS "sourcePath",
  funnel_layer AS "funnelLayer",
  landing_page AS "landingPage",
  referrer,
  utm_source AS "utmSource",
  utm_medium AS "utmMedium",
  utm_campaign AS "utmCampaign",
  utm_term AS "utmTerm",
  utm_content AS "utmContent",
  visitor_id AS "visitorId",
  user_agent AS "userAgent",
  geo_source AS "geoSource",
  geo_referrer_host AS "geoReferrerHost",
  geo_landing_path AS "geoLandingPath",
  status,
  priority,
  owner,
  next_follow_up_at AS "nextFollowUpAt",
  first_contacted_at AS "firstContactedAt",
  quoted_at AS "quotedAt",
  closed_at AS "closedAt",
  lost_reason AS "lostReason",
  email_delivery_status AS "emailDeliveryStatus",
  email_delivery_error AS "emailDeliveryError"
`;

export async function createLeadRecord(lead: StructuredLead): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`INSERT INTO crm_leads (
      id, submitted_at, name, email, company, country, product, quantity,
      message, inquiry_type, source_page, source_path, funnel_layer,
      landing_page, referrer, utm_source, utm_medium, utm_campaign,
      utm_term, utm_content, visitor_id, user_agent, ip_hash,
      geo_source, geo_referrer_host, geo_landing_path
    ) VALUES (
      ${lead.id}, ${lead.submittedAt}, ${lead.contact.name}, ${lead.contact.email},
      ${lead.contact.company}, ${lead.contact.country}, ${lead.interest.product},
      ${lead.interest.quantity}, ${lead.message}, ${lead.classification.inquiryType},
      ${lead.classification.sourcePage}, ${lead.classification.sourcePath},
      ${lead.classification.funnelLayer}, ${lead.attribution.landingPage},
      ${lead.attribution.referrer}, ${lead.attribution.utmSource},
      ${lead.attribution.utmMedium}, ${lead.attribution.utmCampaign},
      ${lead.attribution.utmTerm}, ${lead.attribution.utmContent},
      ${lead.attribution.visitorId}, ${lead.meta.userAgent}, ${lead.meta.ipHash},
      ${lead.attribution.geoSource}, ${lead.attribution.geoReferrerHost},
      ${lead.attribution.geoLandingPath}
    )`,
    sql`INSERT INTO crm_lead_status_history (
      lead_id, from_status, to_status, note, changed_by
    ) VALUES (${lead.id}, ${null}, ${"new"}, ${"Inquiry received"}, ${"system"})`,
    sql`INSERT INTO admin_audit_logs (
      action, entity_type, entity_id, actor, metadata
    ) VALUES (
      ${"lead_created"}, ${"lead"}, ${lead.id}, ${"system"},
      ${JSON.stringify({
        sourcePath: lead.classification.sourcePath,
        geoSource: lead.attribution.geoSource,
      })}::jsonb
    )`,
  ]);
}

export async function updateLeadEmailDelivery(
  leadId: string,
  status: "sent" | "failed",
  error?: string
): Promise<void> {
  const sql = getDatabase();
  await sql`UPDATE crm_leads
    SET email_delivery_status = ${status},
        email_delivery_error = ${error?.slice(0, 1_000) ?? null},
        updated_at = NOW()
    WHERE id = ${leadId}`;
}

export async function getDashboardStats(): Promise<{
  total: number;
  last30Days: number;
  newCount: number;
  qualifiedCount: number;
  quotedCount: number;
  wonCount: number;
  overdueCount: number;
  geoCount: number;
}> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE submitted_at >= NOW() - INTERVAL '30 days')::int AS "last30Days",
    COUNT(*) FILTER (WHERE status = 'new')::int AS "newCount",
    COUNT(*) FILTER (WHERE status = 'qualified')::int AS "qualifiedCount",
    COUNT(*) FILTER (WHERE status = 'quoted')::int AS "quotedCount",
    COUNT(*) FILTER (WHERE status = 'won')::int AS "wonCount",
    COUNT(*) FILTER (
      WHERE next_follow_up_at < NOW()
        AND status NOT IN ('won', 'lost', 'spam')
    )::int AS "overdueCount",
    COUNT(*) FILTER (
      WHERE submitted_at >= NOW() - INTERVAL '30 days'
        AND geo_source IS NOT NULL
    )::int AS "geoCount"
  FROM crm_leads`;
  const result = rows as unknown as Array<{
    total: number;
    last30Days: number;
    newCount: number;
    qualifiedCount: number;
    quotedCount: number;
    wonCount: number;
    overdueCount: number;
    geoCount: number;
  }>;
  return result[0] ?? {
    total: 0,
    last30Days: 0,
    newCount: 0,
    qualifiedCount: 0,
    quotedCount: 0,
    wonCount: 0,
    overdueCount: 0,
    geoCount: 0,
  };
}

export async function getGeoInquiryStats(): Promise<
  Array<{ source: string; count: number }>
> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    geo_source AS source,
    COUNT(*)::int AS count
  FROM crm_leads
  WHERE submitted_at >= NOW() - INTERVAL '30 days'
    AND geo_source IS NOT NULL
  GROUP BY geo_source
  ORDER BY count DESC`;
  return rows as unknown as Array<{ source: string; count: number }>;
}

export type IndexNowSubmissionStatus = {
  submittedAt: string;
  trigger: string;
  urlCount: number;
  responseStatus: number;
  success: boolean;
};

export async function getLatestIndexNowSubmission(): Promise<IndexNowSubmissionStatus | null> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    submitted_at AS "submittedAt",
    trigger,
    url_count AS "urlCount",
    response_status AS "responseStatus",
    success
  FROM geo_indexnow_submissions
  ORDER BY submitted_at DESC
  LIMIT 1`;
  const result = rows as unknown as IndexNowSubmissionStatus[];
  return result[0] ?? null;
}

export async function getProductInquiryStats(): Promise<
  Array<{ product: string; sourcePath: string; count: number }>
> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    COALESCE(product, 'Unspecified') AS product,
    COALESCE(source_path, source_page, 'Unknown') AS "sourcePath",
    COUNT(*)::int AS count
  FROM crm_leads
  WHERE submitted_at >= NOW() - INTERVAL '30 days'
  GROUP BY 1, 2
  ORDER BY count DESC
  LIMIT 12`;
  return rows as unknown as Array<{ product: string; sourcePath: string; count: number }>;
}

export async function listLeads(filters?: {
  status?: string;
  query?: string;
  limit?: number;
}): Promise<CrmLead[]> {
  const sql = getDatabase();
  const status = filters?.status ?? "";
  const query = filters?.query?.trim() ?? "";
  const search = `%${query}%`;
  const limit = Math.min(Math.max(filters?.limit ?? 100, 1), 200);
  const rows = await sql.query(
    `SELECT ${leadSelect}
     FROM crm_leads
     WHERE ($1 = '' OR status = $1)
       AND ($2 = '' OR name ILIKE $3 OR email ILIKE $3 OR company ILIKE $3 OR product ILIKE $3)
     ORDER BY submitted_at DESC
     LIMIT $4`,
    [status, query, search, limit]
  );
  return rows as unknown as CrmLead[];
}

export async function getLeadById(id: string): Promise<CrmLead | null> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT ${leadSelect} FROM crm_leads WHERE id = $1 LIMIT 1`,
    [id]
  );
  const result = rows as unknown as CrmLead[];
  return result[0] ?? null;
}

export async function getLeadNotes(id: string): Promise<LeadNote[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    id, body, author, created_at AS "createdAt"
  FROM crm_lead_notes
  WHERE lead_id = ${id}
  ORDER BY created_at DESC`;
  return rows as unknown as LeadNote[];
}

export async function getLeadStatusHistory(id: string): Promise<LeadStatusHistory[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    id,
    from_status AS "fromStatus",
    to_status AS "toStatus",
    note,
    changed_by AS "changedBy",
    changed_at AS "changedAt"
  FROM crm_lead_status_history
  WHERE lead_id = ${id}
  ORDER BY changed_at DESC`;
  return rows as unknown as LeadStatusHistory[];
}

export async function updateLeadRecord(params: {
  id: string;
  status: LeadStatus;
  priority: LeadPriority;
  owner: string | null;
  nextFollowUpAt: string | null;
  lostReason: string | null;
  actor: string;
}): Promise<void> {
  const existing = await getLeadById(params.id);
  if (!existing) throw new Error("Lead not found");

  const sql = getDatabase();
  const queries = [
    sql`UPDATE crm_leads SET
      status = ${params.status},
      priority = ${params.priority},
      owner = ${params.owner},
      next_follow_up_at = ${params.nextFollowUpAt},
      lost_reason = ${params.status === "lost" ? params.lostReason : null},
      first_contacted_at = CASE
        WHEN first_contacted_at IS NULL AND ${params.status} <> 'new' THEN NOW()
        ELSE first_contacted_at
      END,
      quoted_at = CASE
        WHEN quoted_at IS NULL AND ${params.status} = 'quoted' THEN NOW()
        ELSE quoted_at
      END,
      closed_at = CASE
        WHEN ${params.status} IN ('won', 'lost', 'spam') THEN NOW()
        ELSE NULL
      END,
      updated_at = NOW()
    WHERE id = ${params.id}`,
    sql`INSERT INTO admin_audit_logs (
      action, entity_type, entity_id, actor, metadata
    ) VALUES (
      ${"lead_updated"}, ${"lead"}, ${params.id}, ${params.actor},
      ${JSON.stringify({ status: params.status, priority: params.priority })}::jsonb
    )`,
  ];

  if (existing.status !== params.status) {
    queries.push(sql`INSERT INTO crm_lead_status_history (
      lead_id, from_status, to_status, changed_by
    ) VALUES (${params.id}, ${existing.status}, ${params.status}, ${params.actor})`);
  }

  await sql.transaction(queries);
}

export async function addLeadNote(params: {
  id: string;
  body: string;
  actor: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`INSERT INTO crm_lead_notes (lead_id, body, author)
      VALUES (${params.id}, ${params.body}, ${params.actor})`,
    sql`INSERT INTO admin_audit_logs (
      action, entity_type, entity_id, actor, metadata
    ) VALUES (${"lead_note_added"}, ${"lead"}, ${params.id}, ${params.actor}, ${"{}"}::jsonb)`,
  ]);
}
