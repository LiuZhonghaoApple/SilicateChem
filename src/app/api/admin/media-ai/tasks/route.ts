import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import {
  createMediaAiTask,
  getMediaAiTask,
  mediaAiAssetKinds,
  mediaAiAssetTypes,
  mediaAiPriorities,
} from "@/lib/media-ai/repository";

export const runtime = "nodejs";

const assetSchema = z.object({
  kind: z.enum(mediaAiAssetKinds),
  storageUrl: z.string().url().max(2_000),
  fileName: z.string().max(255).nullable().optional(),
  contentType: z.string().max(120).nullable().optional(),
  sizeBytes: z.number().int().min(0).max(250 * 1024 * 1024).nullable().optional(),
});

const taskSchema = z.object({
  title: z.string().trim().min(2).max(180),
  objective: z.string().trim().min(2).max(500),
  targetIcp: z.string().trim().min(2).max(240),
  targetPage: z.string().trim().max(1_000).nullable().optional(),
  productLine: z.string().trim().max(180).nullable().optional(),
  primaryKeyword: z.string().trim().max(180).nullable().optional(),
  assetType: z.enum(mediaAiAssetTypes),
  priority: z.enum(mediaAiPriorities),
  brief: z.string().trim().min(10).max(5_000),
  evidenceRefs: z.array(z.string().trim().min(1).max(1_000)).max(20).default([]),
  asset: assetSchema.nullable().optional(),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = taskSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "请完整填写任务目标、ICP、素材说明和事实证据。" }, { status: 400 });
  }

  const input = parsed.data;
  const id = `media-task-${crypto.randomUUID()}`;
  try {
    await createMediaAiTask({
      id,
      title: input.title,
      objective: input.objective,
      targetIcp: input.targetIcp,
      targetPage: input.targetPage || null,
      productLine: input.productLine || null,
      primaryKeyword: input.primaryKeyword || null,
      assetType: input.assetType,
      priority: input.priority,
      brief: input.brief,
      evidenceRefs: input.evidenceRefs,
      aiDraft: {},
      createdBy: session.username,
      asset: input.asset
        ? {
            id: `media-asset-${crypto.randomUUID()}`,
            kind: input.asset.kind,
            storageUrl: input.asset.storageUrl,
            fileName: input.asset.fileName ?? null,
            contentType: input.asset.contentType ?? null,
            sizeBytes: input.asset.sizeBytes ?? null,
          }
        : undefined,
    });
    const task = await getMediaAiTask(id);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("[MEDIA_AI_TASK_CREATE]", error);
    return NextResponse.json({ error: "任务保存失败，请检查数据库配置后重试。" }, { status: 503 });
  }
}
