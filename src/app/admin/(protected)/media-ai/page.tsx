import {
  listMediaAiTasks,
  getMediaAiSummary,
  mediaAiStatuses,
  type MediaAiStatus,
} from "@/lib/media-ai/repository";
import MediaAiWorkbench from "@/components/admin/MediaAiWorkbench";

export const dynamic = "force-dynamic";

export default async function MediaAiAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const filters = await searchParams;
  const query = filters.q?.slice(0, 120) ?? "";
  const status = mediaAiStatuses.includes(filters.status as MediaAiStatus) ? (filters.status as MediaAiStatus) : "";
  const [tasks, summary] = await Promise.all([
    listMediaAiTasks({ query, status }),
    getMediaAiSummary(),
  ]);

  return <MediaAiWorkbench initialTasks={tasks} initialSummary={summary} />;
}
