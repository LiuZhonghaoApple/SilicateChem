# 修复记录：后台 /admin/analytics "GSC 已收录"指标为空

- 日期：2026-07-31
- 优先级：P2
- 涉及提交：`30d073a`、`da03c34`（均已推 `main`，Vercel 已部署）
- 状态：✅ 已修复并线上验证

---

## 一、问题现象

后台 `/admin/analytics` 的"GSC 已收录"卡片长期显示空白"—"。

## 二、根因（两个毛病叠加）

1. **读错数据源**：卡片读的是 `gsc_site_snapshots.sitemap_indexed`，该值来自 Google
   Sitemaps API 的 `indexed` 字段——这个字段谷歌早已废弃、恒为 0。数据库里历史每一天
   都是 0，从未有过真实收录数。
2. **日期硬拼导致空白**：`getLatestSiteSnapshot()` 取最新"站点快照"（每日推进），再按
   **相同 snapshot_date** LEFT JOIN "GSC 快照"。GSC 一旦落后一天，JOIN 命中 NULL，卡片
   就从"0"进一步变成"—"。
3. **GSC 每日同步会超时（真正让 GSC 停更的原因）**：SITE/GA4/GSC 由同一个每日 cron
   （`/api/analytics/sync`，UTC 03:15）一起跑。GSC 分支里的"逐个 URL 检查"很慢，页面从
   30 增至 33 后整体超过函数 60s 硬上限被杀，GSC 当天连一条 `reporting_sync_runs` 记录都
   不留（07-31 只有 site/ga4 成功、无 gsc 行即为此）。

真实的收录信号在 `gsc_url_inspection_snapshots`（URL Inspection 逐页快照，含
`verdict / coverage_state` 等）。

## 三、改动内容（仅 4 个文件）

| 文件 | 改动 |
|---|---|
| `src/lib/reporting/google-data.ts` | URL 检查加 `AbortController` 单条 10s 超时；`inspectGscUrls` 增加 `budgetMs` 总时间预算（45s）+ 批量 8，超预算即返回已得结果；`fetchGscData` 剥离 inspection，只取搜索+sitemap 核心数据 |
| `src/lib/reporting/repository.ts` | `upsertGscData` 不再写 inspection；新增 `upsertUrlInspections()` 单独写；新增 `getGscIndexCoverage()`，按 `verdict='PASS'` 统计最新快照的已收录/已检查数 |
| `src/lib/reporting/sync.ts` | `syncGsc` 先写核心数据并据此判定 success，再"尽力而为 + 限时"跑 URL 检查（异常不阻断），预算 45s |
| `src/app/admin/(protected)/analytics/page.tsx` | 卡片改用 `getGscIndexCoverage()`，显示"已收录 / 已检查"，备注含 "Sitemap 共 N · GSC 延迟约 2-3 天" |

设计要点：核心 GSC 数据（搜索+sitemap 快照）先落库、先算成功；慢且易超时的 URL 检查
拆成独立、限时、不阻断的步骤——既保证 GSC 每天有数据，又能覆盖全部 sitemap URL。

## 四、线上验证结果（点"立即同步"后）

- GSC 同步：**success**，写入 627 行，来源 admin_manual。
- URL 检查覆盖：**33 / 33**（一次跑满，含新加的 3 页）。
- GSC 已收录：**29 / 33**。未收录 4 个均属正常：
  - `/export` —— Alternate page with proper canonical tag（规范指向他页）
  - `/manufacturing`、`/guides/pentahydrate-vs-anhydrous`、`/guides/granular-vs-powder`
    —— 新页，"URL is unknown to Google"，待谷歌爬取后自动转收录（印证 2-3 天延迟）。

## 五、给协作者（MIGO）的注意事项

- 本次只改了上面 4 个文件，**未触碰** `sitemap.ts`、`content-freshness.ts` 等你正在改的
  未提交文件。
- 若你在 sitemap 里继续加页面：URL 检查现按 45s 预算 + 批量 8，覆盖约 40+ 个 URL 无压力；
  若将来 sitemap 增长到几十上百个，需要考虑给 inspection 做"分轮轮转"（按 offset 轮流覆盖），
  否则再次逼近 60s 上限时尾部 URL 会被截断。
- `sitemap_indexed` 字段已弃用（恒为 0），后续判断收录一律以 URL Inspection 的 verdict 为准。
