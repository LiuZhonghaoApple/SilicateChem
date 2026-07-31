import { BING_SITE_URL, fetchBingBaseline, isBingConfigured } from "@/lib/backlinks/bing";
import { recordBacklinkBaseline, type BacklinkConnectionStatus } from "@/lib/backlinks/repository";

const BING_EVIDENCE_URL = "https://www.bing.com/webmasters/backlinks";

export type BaselineSyncResult = {
  provider: "bing";
  status: BacklinkConnectionStatus;
  observedOn: string;
  written: boolean;
  detail: string;
};

function todayInShanghai(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
}

/**
 * Pulls the Bing inbound-link baseline and records it as today's snapshot.
 *
 * The one rule this function must never break: an unknown is never written as a
 * zero. `confirmed_zero` is reserved for a successful API call that genuinely
 * returned no inbound links; every failure path writes `error`/`not_configured`
 * with the counts left NULL.
 */
export async function syncBingBaseline(actor: string): Promise<BaselineSyncResult> {
  const observedOn = todayInShanghai();
  const result = await fetchBingBaseline();

  if (result.kind === "not_configured") {
    await recordBacklinkBaseline({
      provider: "bing",
      observedOn,
      connectionStatus: "not_configured",
      referringDomains: null,
      linkingPages: null,
      sampleLinks: null,
      anchorCount: null,
      evidenceUrl: BING_EVIDENCE_URL,
      note: `${result.message} 在配置完成前，外链数量保持“未知”，不会记为 0。`,
      actor,
    });
    return { provider: "bing", status: "not_configured", observedOn, written: true, detail: result.message };
  }

  if (result.kind === "error") {
    await recordBacklinkBaseline({
      provider: "bing",
      observedOn,
      connectionStatus: "error",
      referringDomains: null,
      linkingPages: null,
      sampleLinks: null,
      anchorCount: null,
      evidenceUrl: BING_EVIDENCE_URL,
      note: `Bing Webmaster API 调用失败（${observedOn}）：${result.message} 数量保持“未知”，未记为 0。`,
      actor,
    });
    return { provider: "bing", status: "error", observedOn, written: true, detail: result.message };
  }

  const data = result.data;
  const hasLinks = data.sampleLinks > 0 || data.pagesWithInboundLinks > 0;
  const status: BacklinkConnectionStatus = hasLinks ? "has_data" : "confirmed_zero";

  const note = hasLinks
    ? data.complete
      ? `Bing Webmaster API 自动同步（${observedOn}）：站内 ${data.pagesWithInboundLinks} 个页面收到入站链接，共来自 ${data.linkingPages} 个来源页 / ${data.referringDomains} 个域名，${data.anchorCount} 种锚文本。已完整遍历（${data.requestCount} 次请求）。`
      : `Bing Webmaster API 自动同步（${observedOn}）：确认已有外链，但链接数量超出单次遍历预算（${data.requestCount} 次请求），仅取到 ${data.sampleLinks} 条样本。引用域与链接页总数保持“未知”而非写入部分值。`
    : `Bing Webmaster API 自动同步（${observedOn}）：接口调用成功，返回 0 条入站链接。这是平台确认的 0，不是未知。站点：${BING_SITE_URL}`;

  await recordBacklinkBaseline({
    provider: "bing",
    observedOn,
    connectionStatus: status,
    referringDomains: hasLinks ? data.referringDomains : 0,
    linkingPages: hasLinks ? data.linkingPages : 0,
    sampleLinks: data.sampleLinks,
    anchorCount: hasLinks ? data.anchorCount : 0,
    evidenceUrl: BING_EVIDENCE_URL,
    note,
    actor,
  });

  return {
    provider: "bing",
    status,
    observedOn,
    written: true,
    detail: `${data.sampleLinks} source links across ${data.referringDomains ?? "?"} domains`,
  };
}

export { isBingConfigured };
