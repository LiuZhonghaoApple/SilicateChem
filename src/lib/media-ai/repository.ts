import { getDatabase } from "@/lib/db";

export const mediaAiStatuses = ["draft", "in_progress", "human_review", "pass", "blocked"] as const;
export const mediaAiAssetTypes = ["image", "video", "both"] as const;
export const mediaAiPriorities = ["normal", "high", "urgent"] as const;
export const mediaAiAssetKinds = ["image", "video", "poster", "other"] as const;

export type MediaAiStatus = (typeof mediaAiStatuses)[number];
export type MediaAiAssetType = (typeof mediaAiAssetTypes)[number];
export type MediaAiPriority = (typeof mediaAiPriorities)[number];
export type MediaAiAssetKind = (typeof mediaAiAssetKinds)[number];

export type MediaAiDraft = {
  title?: string;
  caption?: string;
  altText?: string;
  seoTitle?: string;
  seoDescription?: string;
  transcript?: string;
  evidenceGaps?: string[];
  riskFlags?: string[];
};

export type MediaAiAsset = {
  id: string;
  taskId: string;
  kind: MediaAiAssetKind;
  storageUrl: string;
  fileName: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  altText: string | null;
  caption: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  transcript: string | null;
  facts: Record<string, unknown>;
  sourceStatus: "user_provided" | "verified" | "illustrative" | "conflict";
  consentStatus: "approved" | "pending" | "not_required";
  createdAt: string;
  updatedAt: string;
};

export type MediaAiTask = {
  id: string;
  title: string;
  objective: string;
  targetIcp: string;
  targetPage: string | null;
  productLine: string | null;
  primaryKeyword: string | null;
  assetType: MediaAiAssetType;
  priority: MediaAiPriority;
  brief: string;
  evidenceRefs: string[];
  aiDraft: MediaAiDraft;
  status: MediaAiStatus;
  reviewerNote: string | null;
  createdBy: string;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  assets: MediaAiAsset[];
};

export type MediaAiSummary = {
  total: number;
  draft: number;
  inProgress: number;
  humanReview: number;
  pass: number;
  blocked: number;
};

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function mapAsset(row: Record<string, unknown>): MediaAiAsset {
  return {
    id: String(row.id),
    taskId: String(row.taskId),
    kind: row.kind as MediaAiAssetKind,
    storageUrl: String(row.storageUrl),
    fileName: row.fileName == null ? null : String(row.fileName),
    contentType: row.contentType == null ? null : String(row.contentType),
    sizeBytes: row.sizeBytes == null ? null : Number(row.sizeBytes),
    altText: row.altText == null ? null : String(row.altText),
    caption: row.caption == null ? null : String(row.caption),
    seoTitle: row.seoTitle == null ? null : String(row.seoTitle),
    seoDescription: row.seoDescription == null ? null : String(row.seoDescription),
    transcript: row.transcript == null ? null : String(row.transcript),
    facts: parseJson<Record<string, unknown>>(row.facts, {}),
    sourceStatus: row.sourceStatus as MediaAiAsset["sourceStatus"],
    consentStatus: row.consentStatus as MediaAiAsset["consentStatus"],
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  };
}

function mapTask(row: Record<string, unknown>, assets: MediaAiAsset[] = []): MediaAiTask {
  return {
    id: String(row.id),
    title: String(row.title),
    objective: String(row.objective),
    targetIcp: String(row.targetIcp),
    targetPage: row.targetPage == null ? null : String(row.targetPage),
    productLine: row.productLine == null ? null : String(row.productLine),
    primaryKeyword: row.primaryKeyword == null ? null : String(row.primaryKeyword),
    assetType: row.assetType as MediaAiAssetType,
    priority: row.priority as MediaAiPriority,
    brief: String(row.brief),
    evidenceRefs: parseJson<string[]>(row.evidenceRefs, []),
    aiDraft: parseJson<MediaAiDraft>(row.aiDraft, {}),
    status: row.status as MediaAiStatus,
    reviewerNote: row.reviewerNote == null ? null : String(row.reviewerNote),
    createdBy: String(row.createdBy),
    reviewedBy: row.reviewedBy == null ? null : String(row.reviewedBy),
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
    reviewedAt: row.reviewedAt == null ? null : String(row.reviewedAt),
    assets,
  };
}

const taskSelect = `
  SELECT
    id, title, objective, target_icp AS "targetIcp", target_page AS "targetPage",
    product_line AS "productLine", primary_keyword AS "primaryKeyword", asset_type AS "assetType",
    priority, brief, evidence_refs AS "evidenceRefs", ai_draft AS "aiDraft", status,
    reviewer_note AS "reviewerNote", created_by AS "createdBy", reviewed_by AS "reviewedBy",
    created_at::text AS "createdAt", updated_at::text AS "updatedAt", reviewed_at::text AS "reviewedAt"
  FROM media_ai_tasks
`;

const assetSelect = `
  SELECT
    id, task_id AS "taskId", kind, storage_url AS "storageUrl", file_name AS "fileName",
    content_type AS "contentType", size_bytes AS "sizeBytes", alt_text AS "altText",
    caption, seo_title AS "seoTitle", seo_description AS "seoDescription", transcript,
    facts, source_status AS "sourceStatus", consent_status AS "consentStatus",
    created_at::text AS "createdAt", updated_at::text AS "updatedAt"
  FROM media_ai_assets
`;

export async function getMediaAiSummary(): Promise<MediaAiSummary> {
  const sql = getDatabase();
  const rows = await sql.query(
    `SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'draft')::int AS draft,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int AS "inProgress",
      COUNT(*) FILTER (WHERE status = 'human_review')::int AS "humanReview",
      COUNT(*) FILTER (WHERE status = 'pass')::int AS pass,
      COUNT(*) FILTER (WHERE status = 'blocked')::int AS blocked
    FROM media_ai_tasks`,
    []
  );
  const resultRows = rows as unknown as Record<string, unknown>[];
  const row = resultRows[0] ?? {};
  return {
    total: Number(row.total ?? 0),
    draft: Number(row.draft ?? 0),
    inProgress: Number(row.inProgress ?? 0),
    humanReview: Number(row.humanReview ?? 0),
    pass: Number(row.pass ?? 0),
    blocked: Number(row.blocked ?? 0),
  };
}

export async function listMediaAiTasks(filters?: {
  query?: string;
  status?: MediaAiStatus | "";
}): Promise<MediaAiTask[]> {
  const sql = getDatabase();
  const query = filters?.query?.trim() ?? "";
  const status = filters?.status ?? "";
  const rows = await sql.query(
    `${taskSelect}
    WHERE ($1 = '' OR title ILIKE $2 OR target_icp ILIKE $2 OR primary_keyword ILIKE $2)
      AND ($3 = '' OR status = $3)
    ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END, updated_at DESC
    LIMIT 100`,
    [query, `%${query}%`, status]
  );
  const taskRows = rows as unknown as Record<string, unknown>[];
  if (taskRows.length === 0) return [];
  const ids = taskRows.map((row) => String(row.id));
  const assetRows = await sql.query(`${assetSelect} WHERE task_id = ANY($1::text[]) ORDER BY created_at DESC`, [ids]);
  const assetsByTask = new Map<string, MediaAiAsset[]>();
  for (const row of assetRows as unknown as Record<string, unknown>[]) {
    const asset = mapAsset(row);
    const list = assetsByTask.get(asset.taskId) ?? [];
    list.push(asset);
    assetsByTask.set(asset.taskId, list);
  }
  return taskRows.map((row) => mapTask(row, assetsByTask.get(String(row.id)) ?? []));
}

export async function getMediaAiTask(id: string): Promise<MediaAiTask | null> {
  const sql = getDatabase();
  const rows = await sql.query(`${taskSelect} WHERE id = $1 LIMIT 1`, [id]);
  const resultRows = rows as unknown as Record<string, unknown>[];
  const row = resultRows[0] ?? null;
  if (!row) return null;
  const assetRows = await sql.query(`${assetSelect} WHERE task_id = $1 ORDER BY created_at DESC`, [id]);
  return mapTask(row, (assetRows as unknown as Record<string, unknown>[]).map(mapAsset));
}

export async function createMediaAiTask(params: {
  id: string;
  title: string;
  objective: string;
  targetIcp: string;
  targetPage: string | null;
  productLine: string | null;
  primaryKeyword: string | null;
  assetType: MediaAiAssetType;
  priority: MediaAiPriority;
  brief: string;
  evidenceRefs: string[];
  aiDraft: MediaAiDraft;
  createdBy: string;
  asset?: {
    id: string;
    kind: MediaAiAssetKind;
    storageUrl: string;
    fileName: string | null;
    contentType: string | null;
    sizeBytes: number | null;
  };
}): Promise<void> {
  const sql = getDatabase();
  const queries = [
    sql`INSERT INTO media_ai_tasks (
      id, title, objective, target_icp, target_page, product_line, primary_keyword,
      asset_type, priority, brief, evidence_refs, ai_draft, status, created_by
    ) VALUES (
      ${params.id}, ${params.title}, ${params.objective}, ${params.targetIcp}, ${params.targetPage},
      ${params.productLine}, ${params.primaryKeyword}, ${params.assetType}, ${params.priority},
      ${params.brief}, ${JSON.stringify(params.evidenceRefs)}::jsonb, ${JSON.stringify(params.aiDraft)}::jsonb,
      'draft', ${params.createdBy}
    )`,
    sql`INSERT INTO admin_audit_logs (action, entity_type, entity_id, actor, metadata)
      VALUES ('media_ai_task_created', 'media_ai_task', ${params.id}, ${params.createdBy},
      ${JSON.stringify({ assetType: params.assetType, priority: params.priority })}::jsonb)`,
  ];
  if (params.asset) {
    queries.push(sql`INSERT INTO media_ai_assets (
      id, task_id, kind, storage_url, file_name, content_type, size_bytes
    ) VALUES (
      ${params.asset.id}, ${params.id}, ${params.asset.kind}, ${params.asset.storageUrl},
      ${params.asset.fileName}, ${params.asset.contentType}, ${params.asset.sizeBytes}
    )`);
  }
  await sql.transaction(queries);
}

export async function updateMediaAiTask(params: {
  id: string;
  status: MediaAiStatus;
  reviewerNote: string | null;
  aiDraft: MediaAiDraft;
  actor: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`UPDATE media_ai_tasks SET
      status = ${params.status},
      reviewer_note = ${params.reviewerNote},
      ai_draft = ${JSON.stringify(params.aiDraft)}::jsonb,
      reviewed_by = CASE WHEN ${params.status} IN ('pass', 'blocked') THEN ${params.actor} ELSE reviewed_by END,
      reviewed_at = CASE WHEN ${params.status} IN ('pass', 'blocked') THEN NOW() ELSE reviewed_at END,
      updated_at = NOW()
    WHERE id = ${params.id}`,
    sql`INSERT INTO admin_audit_logs (action, entity_type, entity_id, actor, metadata)
      VALUES ('media_ai_task_reviewed', 'media_ai_task', ${params.id}, ${params.actor},
      ${JSON.stringify({ status: params.status })}::jsonb)`,
  ]);
}

export async function addMediaAiAsset(params: {
  id: string;
  taskId: string;
  kind: MediaAiAssetKind;
  storageUrl: string;
  fileName: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  actor: string;
}): Promise<void> {
  const sql = getDatabase();
  await sql.transaction([
    sql`INSERT INTO media_ai_assets (
      id, task_id, kind, storage_url, file_name, content_type, size_bytes
    ) VALUES (
      ${params.id}, ${params.taskId}, ${params.kind}, ${params.storageUrl},
      ${params.fileName}, ${params.contentType}, ${params.sizeBytes}
    )`,
    sql`UPDATE media_ai_tasks SET updated_at = NOW() WHERE id = ${params.taskId}`,
    sql`INSERT INTO admin_audit_logs (action, entity_type, entity_id, actor, metadata)
      VALUES ('media_ai_asset_added', 'media_ai_task', ${params.taskId}, ${params.actor},
      ${JSON.stringify({ kind: params.kind, fileName: params.fileName })}::jsonb)`,
  ]);
}
