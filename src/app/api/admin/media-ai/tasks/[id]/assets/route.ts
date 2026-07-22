import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { addMediaAiAsset, getMediaAiTask, mediaAiAssetKinds } from "@/lib/media-ai/repository";

export const runtime = "nodejs";

const assetSchema = z.object({
  kind: z.enum(mediaAiAssetKinds),
  storageUrl: z.string().url().max(2_000),
  fileName: z.string().max(255).nullable().optional(),
  contentType: z.string().max(120).nullable().optional(),
  sizeBytes: z.number().int().min(0).max(250 * 1024 * 1024).nullable().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  if (!(await getMediaAiTask(id))) return NextResponse.json({ error: "任务不存在" }, { status: 404 });
  const parsed = assetSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "素材信息无效。" }, { status: 400 });
  try {
    await addMediaAiAsset({
      id: `media-asset-${crypto.randomUUID()}`,
      taskId: id,
      kind: parsed.data.kind,
      storageUrl: parsed.data.storageUrl,
      fileName: parsed.data.fileName ?? null,
      contentType: parsed.data.contentType ?? null,
      sizeBytes: parsed.data.sizeBytes ?? null,
      actor: session.username,
    });
    return NextResponse.json({ task: await getMediaAiTask(id) }, { status: 201 });
  } catch (error) {
    console.error("[MEDIA_AI_ASSET_CREATE]", error);
    return NextResponse.json({ error: "素材保存失败，请重试。" }, { status: 503 });
  }
}
