import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { getMediaAiTask, mediaAiStatuses, updateMediaAiTask } from "@/lib/media-ai/repository";

export const runtime = "nodejs";

const updateSchema = z.object({
  status: z.enum(mediaAiStatuses),
  reviewerNote: z.string().trim().max(2_000).nullable().optional(),
  aiDraft: z
    .object({
      title: z.string().max(300).optional(),
      caption: z.string().max(3_000).optional(),
      altText: z.string().max(500).optional(),
      seoTitle: z.string().max(300).optional(),
      seoDescription: z.string().max(500).optional(),
      transcript: z.string().max(8_000).optional(),
      evidenceGaps: z.array(z.string().max(500)).max(30).optional(),
      riskFlags: z.array(z.string().max(500)).max(30).optional(),
    })
    .default({}),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  if (!/^media-task-[0-9a-f-]{20,}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid task id" }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "审核状态或文案格式无效。" }, { status: 400 });

  try {
    if (!(await getMediaAiTask(id))) return NextResponse.json({ error: "任务不存在" }, { status: 404 });
    await updateMediaAiTask({
      id,
      status: parsed.data.status,
      reviewerNote: parsed.data.reviewerNote || null,
      aiDraft: parsed.data.aiDraft,
      actor: session.username,
    });
    return NextResponse.json({ task: await getMediaAiTask(id) });
  } catch (error) {
    console.error("[MEDIA_AI_TASK_UPDATE]", error);
    return NextResponse.json({ error: "审核状态保存失败，请重试。" }, { status: 503 });
  }
}
