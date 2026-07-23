import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { buildMediaAiInput, MEDIA_AI_SYSTEM_PROMPT } from "@/lib/media-ai/prompt";

export const runtime = "nodejs";
export const maxDuration = 35;

const requestSchema = z.object({
  title: z.string().min(2).max(180),
  objective: z.string().min(2).max(500),
  targetIcp: z.string().min(2).max(240),
  targetPage: z.string().max(1_000).nullable().optional(),
  productLine: z.string().max(180).nullable().optional(),
  primaryKeyword: z.string().max(180).nullable().optional(),
  assetType: z.string().max(20),
  brief: z.string().min(10).max(5_000),
  evidenceRefs: z.array(z.string().max(1_000)).max(20),
});

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
};

function extractOutputText(payload: OpenAIResponse): string | null {
  if (payload.output_text?.trim()) return payload.output_text.trim();
  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text?.trim()) return content.text.trim();
    }
  }
  return null;
}

const draftSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    caption: { type: "string" },
    altText: { type: "string" },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    transcript: { type: "string" },
    evidenceGaps: { type: "array", items: { type: "string" } },
    riskFlags: { type: "array", items: { type: "string" } },
  },
  required: ["title", "caption", "altText", "seoTitle", "seoDescription", "transcript", "evidenceGaps", "riskFlags"],
};

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "AI任务输入不完整。" }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY 未配置，无法生成草稿。" }, { status: 503 });
  const model = process.env.MEDIA_AI_MODEL ?? process.env.AI_ADVISOR_MODEL ?? "gpt-5-nano";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        store: false,
        max_output_tokens: 900,
        reasoning: { effort: "minimal" },
        text: { format: { type: "json_schema", name: "media_ai_draft", strict: true, schema: draftSchema } },
        instructions: MEDIA_AI_SYSTEM_PROMPT,
        input: buildMediaAiInput({
          ...parsed.data,
          targetPage: parsed.data.targetPage ?? null,
          productLine: parsed.data.productLine ?? null,
          primaryKeyword: parsed.data.primaryKeyword ?? null,
        }),
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      console.error(`[MEDIA_AI_GENERATE] OpenAI response failed with ${response.status}`);
      return NextResponse.json({ error: "AI服务暂时不可用，请稍后重试或先人工填写。" }, { status: 502 });
    }
    const text = extractOutputText((await response.json()) as OpenAIResponse);
    if (!text) return NextResponse.json({ error: "AI未返回可审核内容。" }, { status: 502 });
    let draft: unknown;
    try {
      draft = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "AI返回格式无法解析，请改为人工填写。" }, { status: 502 });
    }
    return NextResponse.json({ draft, generatedBy: model, generatedFor: session.username });
  } catch (error) {
    console.error("[MEDIA_AI_GENERATE]", error);
    return NextResponse.json({ error: "AI生成超时，请稍后重试或先人工填写。" }, { status: 504 });
  }
}
