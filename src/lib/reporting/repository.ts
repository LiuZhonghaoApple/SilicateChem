import { getDatabase } from "@/lib/db";
import type {
  Ga4DailyRow,
  Ga4PageRow,
  Ga4SourceRow,
  GscDailyRow,
  GscPageRow,
  GscQueryRow,
  GscSitemapSnapshot,
  ReportingProvider,
  ReportingSyncStatus,
} from "@/lib/reporting/types";

export async function recordReportingSyncRun(params: {
  provider: ReportingProvider;
  status: ReportingSyncStatus;
  trigger: string;
  startDate: string;
  endDate: string;
  rowCount: number;
  error?: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql`INSERT INTO reporting_sync_runs (
    provider, status, trigger, window_start, window_end, row_count, error
  ) VALUES (
    ${params.provider}, ${params.status}, ${params.trigger}, ${params.startDate},
    ${params.endDate}, ${params.rowCount}, ${params.error?.slice(0, 2_000) ?? null}
  )`;
}

export async function upsertGa4Data(params: {
  daily: Ga4DailyRow[];
  sources: Ga4SourceRow[];
  pages: Ga4PageRow[];
}): Promise<number> {
  const sql = getDatabase();
  const queries = [
    ...params.daily.map((row) => sql`INSERT INTO ga4_daily_metrics (
      metric_date, sessions, total_users, new_users, engaged_sessions,
      screen_page_views, engagement_rate, key_events, synced_at
    ) VALUES (
      ${row.date}, ${row.sessions}, ${row.totalUsers}, ${row.newUsers},
      ${row.engagedSessions}, ${row.screenPageViews}, ${row.engagementRate},
      ${row.keyEvents}, NOW()
    ) ON CONFLICT (metric_date) DO UPDATE SET
      sessions = EXCLUDED.sessions,
      total_users = EXCLUDED.total_users,
      new_users = EXCLUDED.new_users,
      engaged_sessions = EXCLUDED.engaged_sessions,
      screen_page_views = EXCLUDED.screen_page_views,
      engagement_rate = EXCLUDED.engagement_rate,
      key_events = EXCLUDED.key_events,
      synced_at = NOW()`),
    ...params.sources.map((row) => sql`INSERT INTO ga4_source_daily (
      metric_date, source, medium, channel_group, sessions, total_users,
      key_events, synced_at
    ) VALUES (
      ${row.date}, ${row.source}, ${row.medium}, ${row.channelGroup},
      ${row.sessions}, ${row.totalUsers}, ${row.keyEvents}, NOW()
    ) ON CONFLICT (metric_date, source, medium, channel_group) DO UPDATE SET
      sessions = EXCLUDED.sessions,
      total_users = EXCLUDED.total_users,
      key_events = EXCLUDED.key_events,
      synced_at = NOW()`),
    ...params.pages.map((row) => sql`INSERT INTO ga4_page_daily (
      metric_date, page_path, sessions, total_users, screen_page_views,
      key_events, synced_at
    ) VALUES (
      ${row.date}, ${row.pagePath}, ${row.sessions}, ${row.totalUsers},
      ${row.screenPageViews}, ${row.keyEvents}, NOW()
    ) ON CONFLICT (metric_date, page_path) DO UPDATE SET
      sessions = EXCLUDED.sessions,
      total_users = EXCLUDED.total_users,
      screen_page_views = EXCLUDED.screen_page_views,
      key_events = EXCLUDED.key_events,
      synced_at = NOW()`),
  ];

  if (queries.length > 0) await sql.transaction(queries);
  return queries.length;
}

export async function upsertGscData(params: {
  daily: GscDailyRow[];
  queries: GscQueryRow[];
  pages: GscPageRow[];
  sitemap: GscSitemapSnapshot;
  snapshotDate: string;
}): Promise<number> {
  const sql = getDatabase();
  const queries = [
    ...params.daily.map((row) => sql`INSERT INTO gsc_daily_metrics (
      metric_date, clicks, impressions, ctr, position, synced_at
    ) VALUES (
      ${row.date}, ${row.clicks}, ${row.impressions}, ${row.ctr},
      ${row.position}, NOW()
    ) ON CONFLICT (metric_date) DO UPDATE SET
      clicks = EXCLUDED.clicks,
      impressions = EXCLUDED.impressions,
      ctr = EXCLUDED.ctr,
      position = EXCLUDED.position,
      synced_at = NOW()`),
    ...params.queries.map((row) => sql`INSERT INTO gsc_query_daily (
      metric_date, query, clicks, impressions, ctr, position, synced_at
    ) VALUES (
      ${row.date}, ${row.query}, ${row.clicks}, ${row.impressions},
      ${row.ctr}, ${row.position}, NOW()
    ) ON CONFLICT (metric_date, query) DO UPDATE SET
      clicks = EXCLUDED.clicks,
      impressions = EXCLUDED.impressions,
      ctr = EXCLUDED.ctr,
      position = EXCLUDED.position,
      synced_at = NOW()`),
    ...params.pages.map((row) => sql`INSERT INTO gsc_page_daily (
      metric_date, page, clicks, impressions, ctr, position, synced_at
    ) VALUES (
      ${row.date}, ${row.page}, ${row.clicks}, ${row.impressions},
      ${row.ctr}, ${row.position}, NOW()
    ) ON CONFLICT (metric_date, page) DO UPDATE SET
      clicks = EXCLUDED.clicks,
      impressions = EXCLUDED.impressions,
      ctr = EXCLUDED.ctr,
      position = EXCLUDED.position,
      synced_at = NOW()`),
    sql`INSERT INTO gsc_site_snapshots (
      snapshot_date, sitemap_submitted, sitemap_indexed,
      sitemap_errors, sitemap_warnings, checked_at
    ) VALUES (
      ${params.snapshotDate}, ${params.sitemap.submitted}, ${params.sitemap.indexed},
      ${params.sitemap.errors}, ${params.sitemap.warnings}, NOW()
    ) ON CONFLICT (snapshot_date) DO UPDATE SET
      sitemap_submitted = EXCLUDED.sitemap_submitted,
      sitemap_indexed = EXCLUDED.sitemap_indexed,
      sitemap_errors = EXCLUDED.sitemap_errors,
      sitemap_warnings = EXCLUDED.sitemap_warnings,
      checked_at = NOW()`,
  ];

  if (queries.length > 0) await sql.transaction(queries);
  return queries.length;
}

export async function upsertSiteSnapshot(params: {
  snapshotDate: string;
  publicPageCount: number;
  updatedPageCount: number;
}): Promise<void> {
  const sql = getDatabase();
  await sql`INSERT INTO site_daily_snapshots (
    snapshot_date, public_page_count, updated_page_count, checked_at
  ) VALUES (
    ${params.snapshotDate}, ${params.publicPageCount}, ${params.updatedPageCount}, NOW()
  ) ON CONFLICT (snapshot_date) DO UPDATE SET
    public_page_count = EXCLUDED.public_page_count,
    updated_page_count = EXCLUDED.updated_page_count,
    checked_at = NOW()`;
}

export type ReportingOverview = {
  sessions: number;
  users: number;
  newUsers: number;
  pageViews: number;
  engagementRate: number;
  keyEvents: number;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function getReportingOverview(days = 30): Promise<ReportingOverview> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH ga4 AS (
      SELECT
        COALESCE(SUM(sessions), 0)::int AS sessions,
        COALESCE(SUM(total_users), 0)::int AS users,
        COALESCE(SUM(new_users), 0)::int AS "newUsers",
        COALESCE(SUM(screen_page_views), 0)::int AS "pageViews",
        COALESCE(SUM(engagement_rate * sessions) / NULLIF(SUM(sessions), 0), 0)::float8 AS "engagementRate",
        COALESCE(SUM(key_events), 0)::float8 AS "keyEvents"
      FROM ga4_daily_metrics
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    ), gsc AS (
      SELECT
        COALESCE(SUM(clicks), 0)::float8 AS clicks,
        COALESCE(SUM(impressions), 0)::float8 AS impressions,
        COALESCE(SUM(clicks) / NULLIF(SUM(impressions), 0), 0)::float8 AS ctr,
        COALESCE(SUM(position * impressions) / NULLIF(SUM(impressions), 0), 0)::float8 AS position
      FROM gsc_daily_metrics
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    ) SELECT * FROM ga4 CROSS JOIN gsc`,
    [days]
  );
  const result = rows as unknown as ReportingOverview[];
  return result[0] ?? {
    sessions: 0,
    users: 0,
    newUsers: 0,
    pageViews: 0,
    engagementRate: 0,
    keyEvents: 0,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };
}

export type ReportingTrendRow = {
  date: string;
  sessions: number;
  users: number;
  pageViews: number;
  clicks: number;
  impressions: number;
};

export async function getReportingTrend(days = 14): Promise<ReportingTrendRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT
      COALESCE(ga4.metric_date, gsc.metric_date)::text AS date,
      COALESCE(ga4.sessions, 0)::int AS sessions,
      COALESCE(ga4.total_users, 0)::int AS users,
      COALESCE(ga4.screen_page_views, 0)::int AS "pageViews",
      COALESCE(gsc.clicks, 0)::float8 AS clicks,
      COALESCE(gsc.impressions, 0)::float8 AS impressions
    FROM ga4_daily_metrics ga4
    FULL OUTER JOIN gsc_daily_metrics gsc ON gsc.metric_date = ga4.metric_date
    WHERE COALESCE(ga4.metric_date, gsc.metric_date) >= CURRENT_DATE - ($1::int - 1)
    ORDER BY date DESC`,
    [days]
  );
  return rows as unknown as ReportingTrendRow[];
}

export type TrafficSourceRow = {
  source: string;
  medium: string;
  channelGroup: string;
  sessions: number;
  users: number;
  keyEvents: number;
};

export async function getTrafficSources(days = 30, limit = 15): Promise<TrafficSourceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT source, medium, channel_group AS "channelGroup",
      SUM(sessions)::int AS sessions,
      SUM(total_users)::int AS users,
      SUM(key_events)::float8 AS "keyEvents"
    FROM ga4_source_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    GROUP BY source, medium, channel_group
    ORDER BY sessions DESC, users DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as TrafficSourceRow[];
}

export async function getGeoTrafficSources(days = 30): Promise<TrafficSourceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT source, medium, channel_group AS "channelGroup",
      SUM(sessions)::int AS sessions,
      SUM(total_users)::int AS users,
      SUM(key_events)::float8 AS "keyEvents"
    FROM ga4_source_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
      AND LOWER(source || ' ' || medium || ' ' || channel_group) ~
        '(chatgpt|openai|perplexity|claude|anthropic|gemini|copilot|grok|ai.assistant)'
    GROUP BY source, medium, channel_group
    ORDER BY sessions DESC`,
    [days]
  );
  return rows as unknown as TrafficSourceRow[];
}

export type PagePerformanceRow = {
  pagePath: string;
  sessions: number;
  users: number;
  pageViews: number;
  keyEvents: number;
  inquiries: number;
};

export async function getPagePerformance(days = 30, limit = 20): Promise<PagePerformanceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH traffic AS (
      SELECT page_path,
        SUM(sessions)::int AS sessions,
        SUM(total_users)::int AS users,
        SUM(screen_page_views)::int AS "pageViews",
        SUM(key_events)::float8 AS "keyEvents"
      FROM ga4_page_daily
      WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
      GROUP BY page_path
    ), inquiries AS (
      SELECT COALESCE(
          NULLIF(source_path, ''),
          NULLIF(split_part(landing_page, '?', 1), ''),
          NULLIF(source_page, ''),
          'unknown'
        ) AS page_path,
        COUNT(*) FILTER (WHERE status <> 'spam')::int AS inquiries
      FROM crm_leads
      WHERE submitted_at >= NOW() - ($1::int * INTERVAL '1 day')
      GROUP BY 1
    ) SELECT
      COALESCE(traffic.page_path, inquiries.page_path) AS "pagePath",
      COALESCE(traffic.sessions, 0)::int AS sessions,
      COALESCE(traffic.users, 0)::int AS users,
      COALESCE(traffic."pageViews", 0)::int AS "pageViews",
      COALESCE(traffic."keyEvents", 0)::float8 AS "keyEvents",
      COALESCE(inquiries.inquiries, 0)::int AS inquiries
    FROM traffic
    FULL OUTER JOIN inquiries ON inquiries.page_path = traffic.page_path
    ORDER BY "pageViews" DESC, inquiries DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as PagePerformanceRow[];
}

export type SearchPerformanceRow = {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export async function getTopGscQueries(days = 30, limit = 20): Promise<SearchPerformanceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT query AS label,
      SUM(clicks)::float8 AS clicks,
      SUM(impressions)::float8 AS impressions,
      (SUM(clicks) / NULLIF(SUM(impressions), 0))::float8 AS ctr,
      (SUM(position * impressions) / NULLIF(SUM(impressions), 0))::float8 AS position
    FROM gsc_query_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    GROUP BY query
    ORDER BY impressions DESC, clicks DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as SearchPerformanceRow[];
}

export async function getTopGscPages(days = 30, limit = 20): Promise<SearchPerformanceRow[]> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT page AS label,
      SUM(clicks)::float8 AS clicks,
      SUM(impressions)::float8 AS impressions,
      (SUM(clicks) / NULLIF(SUM(impressions), 0))::float8 AS ctr,
      (SUM(position * impressions) / NULLIF(SUM(impressions), 0))::float8 AS position
    FROM gsc_page_daily
    WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
    GROUP BY page
    ORDER BY impressions DESC, clicks DESC
    LIMIT $2`,
    [days, limit]
  );
  return rows as unknown as SearchPerformanceRow[];
}

export type InquiryFunnel = {
  sessions: number;
  productSessions: number;
  inquiries: number;
  qualified: number;
  quoted: number;
  won: number;
};

export async function getInquiryFunnel(days = 30): Promise<InquiryFunnel> {
  const sql = getDatabase();
  const rows = await sql.query(
    `WITH traffic AS (
      SELECT
        COALESCE((SELECT SUM(sessions) FROM ga4_daily_metrics
          WHERE metric_date >= CURRENT_DATE - ($1::int - 1)), 0)::int AS sessions,
        COALESCE((SELECT SUM(sessions) FROM ga4_page_daily
          WHERE metric_date >= CURRENT_DATE - ($1::int - 1)
            AND page_path LIKE '/products/%'), 0)::int AS "productSessions"
    ), leads AS (
      SELECT
        COUNT(*) FILTER (WHERE status <> 'spam')::int AS inquiries,
        COUNT(*) FILTER (WHERE status IN ('qualified','quoted','sample','negotiating','won'))::int AS qualified,
        COUNT(*) FILTER (WHERE status IN ('quoted','negotiating','won'))::int AS quoted,
        COUNT(*) FILTER (WHERE status = 'won')::int AS won
      FROM crm_leads
      WHERE submitted_at >= NOW() - ($1::int * INTERVAL '1 day')
    ) SELECT * FROM traffic CROSS JOIN leads`,
    [days]
  );
  const result = rows as unknown as InquiryFunnel[];
  return result[0] ?? {
    sessions: 0,
    productSessions: 0,
    inquiries: 0,
    qualified: 0,
    quoted: 0,
    won: 0,
  };
}

export type SyncStatusRow = {
  provider: ReportingProvider;
  status: ReportingSyncStatus;
  trigger: string;
  startDate: string;
  endDate: string;
  rowCount: number;
  error: string | null;
  completedAt: string;
};

export async function getLatestSyncStatuses(): Promise<SyncStatusRow[]> {
  const sql = getDatabase();
  const rows = await sql`SELECT DISTINCT ON (provider)
    provider,
    status,
    trigger,
    window_start::text AS "startDate",
    window_end::text AS "endDate",
    row_count AS "rowCount",
    error,
    completed_at AS "completedAt"
  FROM reporting_sync_runs
  ORDER BY provider, completed_at DESC`;
  return rows as unknown as SyncStatusRow[];
}

export type SiteSnapshotRow = {
  snapshotDate: string;
  publicPageCount: number;
  updatedPageCount: number;
  sitemapSubmitted: number | null;
  sitemapIndexed: number | null;
  sitemapErrors: number | null;
  sitemapWarnings: number | null;
};

export async function getLatestSiteSnapshot(): Promise<SiteSnapshotRow | null> {
  const sql = getDatabase();
  const rows = await sql`SELECT
    site.snapshot_date::text AS "snapshotDate",
    site.public_page_count AS "publicPageCount",
    site.updated_page_count AS "updatedPageCount",
    gsc.sitemap_submitted AS "sitemapSubmitted",
    gsc.sitemap_indexed AS "sitemapIndexed",
    gsc.sitemap_errors AS "sitemapErrors",
    gsc.sitemap_warnings AS "sitemapWarnings"
  FROM site_daily_snapshots site
  LEFT JOIN gsc_site_snapshots gsc ON gsc.snapshot_date = site.snapshot_date
  ORDER BY site.snapshot_date DESC
  LIMIT 1`;
  const result = rows as unknown as SiteSnapshotRow[];
  return result[0] ?? null;
}

