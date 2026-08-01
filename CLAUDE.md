# SilicateChem 运营与开发说明（CLAUDE.md）

面向：接管 silicatechem.com 仓库与线上后台的 AI/运维。
最近更新：2026-07-30。
仓库：`LiuZhonghaoApple/SilicateChem`　部署：Vercel `chem1/silicate-chem`（push `main` 自动部署）。
详细技术手册见 [`docs/ADMIN.md`](docs/ADMIN.md)，本文件是"运营职责 + 待办 + 待修"的活文档。

---

## 1. 后台（/admin）运营职责

后台入口：`https://www.silicatechem.com/admin`（未登录跳 `/admin/login`）。
账号在 Vercel 环境变量：`ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET`（不硬编码、不入库）。

六个模块（均为真实功能，非占位）：

| 模块 | 路由 | 作用 |
|---|---|---|
| 数据总览 | `/admin` | 读真实库，询盘/转化概览 |
| 询盘管理 | `/admin/inquiries` | 列表、筛选、状态、优先级、负责人、跟进、备注、详情；详情页含商业信息（吨位/报价/成交/交期/回款）与「该客户浏览轨迹」询盘360 |
| 访客行为 | `/admin/visitors` | 按访客聚合的匿名行为面板（近30天动作序列/来源/落地页/是否转化） |
| SEO 与流量 | `/admin/analytics` | GA4/GSC 同步、询盘漏斗、GEO/AI 引用观察 |
| 外链管理 | `/admin/backlinks` | 基线、候选台账、状态、归因（当前 30 条） |
| AI 物料工作台 | `/admin/media-ai` | 任务、上传、草稿、审核（Blob 存储 `silicatechem-media` 已开通，上传可用） |

## 2. 询盘链路（务必理解）

前台表单 → `/api/inquiry` → 校验/限流/蜜罐 → 写 Neon `crm_leads`（同事务写 `crm_lead_status_history`、`admin_audit_logs`）→ Resend 发通知邮件 → 回写 `email_delivery_status`。
后台询盘为 Server Component 直读 `src/lib/crm/repository.ts`，无单独读取 API。

### 邮件通知（2026-07-30 定案）

- **收件人：只发 `padelonesource@gmail.com`（Gmail）。** 日常盯 Gmail 即不漏询盘。
- 发件人：`inquiry@silicatechem.com`；回信地址：`info@silicatechem.com`。
- 收件人/发件人由 Vercel 变量 `INQUIRY_TO_EMAIL` / `INQUIRY_FROM_EMAIL` 控制；代码按逗号拆分支持多收件人（`src/app/api/inquiry/route.ts`）。
- **为何不发 info@**：阿里企业邮箱有"本域反仿冒"规则，会拦掉一切"外部系统寄来、却声称来自 @silicatechem.com"的邮件（notify@ / inquiry@ 均被拦，Gmail 无此规则）。若日后要让 info@ 也收，需在阿里企业邮箱后台把发信来源加白名单，属人工操作。

### 询盘人工录入 + 附件（2026-07-30 新增）

`/admin/inquiries` 右上角"+ 人工录入"，把 WhatsApp/邮件/展会/电话等站外渠道询盘统一收进 CRM。

- 字段：录入日期（自动=submitted_at）、国家、来源渠道、产品、跟进人（默认当前账号）、备注、附件。
- 走与网站表单同一套 `buildStructuredLead` + `createLeadRecord`；name/company/email 以占位值满足 NOT NULL，客户细节写进备注/附件；来源记在 `source/utm`，录入人+渠道+附件链接写入 `crm_lead_notes` 审计备注。
- 附件：服务端 `put()` 上传到 Blob（`src/app/api/admin/inquiries/attachment/route.ts`），登录 cookie 鉴权，**单个≤4MB**（Vercel 无服务器请求体上限）。支持 Word/Excel/PDF/图片/CSV/TXT。附件 URL 存进 lead message 与备注。
- 注意：曾尝试 `@vercel/blob/client` 客户端直传，因完成回调不带 cookie 被鉴权挡住导致卡住，已改回服务端 `put()`。如需 >4MB 大文件需另行实现客户端直传（鉴权放在 onBeforeGenerateToken）。

### 总览页 GEO/AI 面板（2026-07-30 优化）

总览页"近30天 GEO / AI 来源"面板原先只统计 `crm_leads` 里带 `geo_source` 的**已提交询盘**，leads=0 时一片空白，会误以为 AI 渠道无动静。已改为两层：

- **AI 来源询盘**：已提交的 AI 渠道询盘（`getGeoInquiryStats`，lead 维度）。
- **AI 来源访客活跃**（新增）：`getGeoSourceActivity`，从 `conversion_events` 按 `geo_source` 统计近30天访客数与 RFQ 发起数，即使尚未转化为 lead 也能显示（如 `chatgpt — N 访客 · M 次 RFQ`）。

同理，总览页顶部另有"近30天客户行为"卡片（`getConversionEventFunnel`）：会话/WhatsApp点击/在线咨询/RFQ 发起，避免 leads=0 时整页显示为空。

### 在线客服 "Sales & Support"（2026-07-30 去 AI 化）

- 组件 `src/components/ai/ProcurementAdvisor.tsx`，对外统一显示 **"Sales & Support"**，以真人客服口吻接待，不再出现 "AI/Advisor" 字样；对话引擎（`src/app/api/ai-advisor/route.ts`）也被要求以销售团队身份说话、不自称 AI。
- 内部统计事件名仍为 `ai_advisor_*`（保持数据连续，勿改）。
- **留联系方式 + 人工通知**：聊天框内可留邮箱/WhatsApp，提交到 `src/app/api/support-handoff/route.ts`，即时发邮件到 Gmail 提醒人工跟进（回信到 info@）。

### 外链基线卡片（2026-08-01 重做）

`/admin/backlinks` 顶部两张 GSC / Bing 卡片曾长期停在 `2026-07-22 · 数据生成中`。根因不是故障：`processing` 是人在表单里手选的值，**系统里没有任何机制会推进它**，所以它会永久挂着。

- **GSC 侧只能人工**。Search Console API 全部接口只有 站点 / 站点地图 / 搜索表现 / URL 检查 四类，**根本没有 Links 报告端点**（已按官方 discovery 文档逐条核对）。卡片上直接写明这一点并给出 GSC 链接报告直达入口，不要再期待它自动更新。
- **Bing 侧已自动化**。`src/lib/backlinks/bing.ts` 走 Bing Webmaster API（`GetLinkCounts` + `GetUrlLinks`），由 `/api/analytics/sync` 在每日 03:15 顺带跑（不另占 Vercel cron 名额），卡片上另有「立即同步」按钮。
  - **需要人工做一次**：在 Bing Webmaster Tools → Settings → API Access 生成 API Key，作为 Vercel 环境变量 `BING_WEBMASTER_API_KEY` 加入三环境并重新部署。未配置时卡片如实显示「未接入 / 未授权」。
  - 接入后**第一件事是拿返回值和网页版数字对一遍**：已有开发者反映这两个接口对已验证站点可能返回空、与 UI 数据源不一致。
- **状态只剩终态**，不再有"进行中"：`has_data`（已有数据）/ `confirmed_zero`（已确认为 0）/ `unknown`（未知·待人工核查）/ `not_configured`（未接入）/ `error`（读取异常）。旧值 `ready`/`processing`/`not_authenticated` 已迁移，读取层另有兼容映射。
- **铁律：未知永远不写成 0。** `confirmed_zero` 只允许在接口调用成功且确实返回 0 条时写入；任何失败路径一律写 `error`/`not_configured` 且数量留 NULL。
- 卡片显示「最后登记 X · 距今 N 天」，**超过 7 天自动标黄**并提示复核（`BASELINE_STALE_AFTER_DAYS`）。

### 2026-08-01 外链基线人工核查结论（重要）

浏览器登录两个平台实测，结果已登记进 `backlink_baseline_snapshots`（`observed_by = claude-browser-audit`）：

- **Bing = 已确认为 0**。`www.silicatechem.com` 的 Backlinks 报表返回 `No data available`，引用域与锚文本均为 `-`。**关键对照**：同一视图同一时刻加入 `pqcorp.com`，立即返回 397 个引用域 / 134 个锚文本及完整来源列表 —— 证明报表功能正常，不是权限或故障问题。故判定为真实的 0。（07-22 那条"48 小时处理中"提示已不再出现。）
- **GSC = 仍然未知**。"链接数量"报表仍显示"正在处理数据，请过 1 天左右再来查看"，"导出外部链接"按钮禁用。**对照**：同资源"效果"报表健康（近3个月 18 次点击 / 1100 次曝光，10.5 小时前更新），说明资源本身正常，是 Google 拒绝给数。**Google 从未说过 0，因此不得代它写 0**，保持"未知"。
- **合并解读**：Bing 已确认 0 + GSC 拒绝给数 + 我方台账 39 条候选无一条填了上线 URL，三方互证——**目前真实外链数就是 0**。第一条外链取决于 Pulp & Paper Canada 是否刊登 08-01 已投出的稿件。

## 3. 待办队列

### 2026-08-01 外链策略复盘（含一条被推翻的建议）

完整记录见 [`seo/backlinks/2026-08-01-strategy-review.md`](seo/backlinks/2026-08-01-strategy-review.md)。要点：

- **大型 B2B 平台故意不给外链，与免费/付费无关。** Alibaba 实测：认证供应商主页零个指向自有官网的链接，页面无 website 字段。Europages 网址属付费项。ThomasNet 免费层不含网址且定位北美。**"免费开店就有外链"这个判断是错的，已推翻**——台账里 Alibaba 的排除理由已订正。
- **目录收录要做，但目的是获客与实体确认，不是 SEO 权重**（绝大多数是 nofollow）。选择标准是"买家会不会在这里搜"。
- **真正的快车道是记者问答平台**：HARO/Connectively 已于 2024 年底关停；当前免费可用的是 Help a B2B Writer 与 Source of Sources。拿到的是真实编辑正文链接，周期从数月压到数天。我们的稀缺性在于"愿意具名说话的中国实体工厂"。
- **编辑投稿线继续，不要加量。** 5% 冷投录用率属正常水平，问题是样本小、时间短，不是方法错。短时间群发同类提案会伤信誉。
- **红线**：不买链接包/PBN；**不得用 migoglass 系列子站互相链接**（同账号批量交叉链接是标准作弊模式）。

**活跃待办：**

- **加 `BING_WEBMASTER_API_KEY`**（人工，约 5 分钟）：Bing Webmaster Tools → Settings → API Access 生成 Key → 加进 Vercel 三环境 → 重新部署 → 到 `/admin/backlinks` 点「立即同步」。**这只是把已确认的 0 变成每日自动复查**，不影响当前结论。
- **GSC 侧下次复核**：卡片会在 2026-08-08 自动标黄提醒（超 7 天）。届时若"链接数量"仍在"处理中"，维持"未知"即可，不要改成 0。

**已关闭（2026-08-01）：**

- ~~测试询盘待降级~~ — **已完成**。`lead_1785513906037_7u9e80r`（`QA Verification (DELETE ME)`）是 2026-08-01 验证询盘链路时提交的真实记录，经运营确认**保留不删、状态降级为 `spam`**，已写入状态变更历史与 `admin_audit_logs`。已验证其被排除出新询盘/逾期跟进/有效询盘/已报价/成交/AI来源/产品页分布等全部经营指标（仅计入"全部询盘"历史总数）。**如需保留该记录，勿再改回非 spam 状态。**
- IndexNow 改进已评估为 P3 暂缓，见第 4 节表格末行。

**已关闭（2026-07-30）：**

- ~~Upstash 限流核查~~ — **不适用**。系统未使用 Upstash，限流持久化直接用 Neon 表（`security_rate_limits`）。
- ~~外链第二阶段结果待回传~~ — **已完成**。结果已在 `/admin/backlinks`（30 条），无需再回传。

## 4. 待修项登记（仅登记，先不修）

| 优先级 | 待修项 | 说明 | 涉及文件 |
|---|---|---|---|
| ~~P0~~ 已修 | ~~Turnstile 客户端加载失败的根因修复~~ | **已完成（2026-07-30）**：客户端加 8s 超时看门狗 + 幂等完成逻辑 + script.onerror，加载失败即放行不再挂起；服务端改非阻断（仅拒明确无效 token，缺 token 则放行+记日志）。Turnstile 环境变量当前仍按运营决定保持移除（关闭），代码已可安全随时开回。 | `src/components/forms/TurnstileField.tsx`、`src/components/forms/InquiryForm.tsx`、`src/app/api/inquiry/route.ts`、`src/lib/validation.ts` |
| ~~P1~~ 已修 | ~~两套"有效询盘"口径不一致~~ | **已完成（2026-07-30）**：总览 `qualifiedCount` 改用与漏斗一致的 `status IN ('qualified','quoted','sample','negotiating','won')`，两处数字统一。 | `src/lib/crm/repository.ts` |
| ~~P1~~ 已修 | ~~AI 来源询盘未排除 spam~~ | **已完成（2026-07-30）**：`geoCount` 与 `getGeoInquiryStats` 均加 `AND status <> 'spam'`。 | `src/lib/crm/repository.ts` |
| ~~P1~~ 已修 | ~~`BLOB_READ_WRITE_TOKEN` 缺失致物料上传 503~~ | **已完成（2026-07-30）**：创建 public Blob 存储 `silicatechem-media` 并连到项目，`BLOB_READ_WRITE_TOKEN` 已注入三环境，重新部署后上传可用。 | Vercel 环境变量、`src/app/api/admin/media-ai/upload/route.ts` |
| ~~P2~~ 已修 | ~~Resend 邮件失败无自动重试~~ | **已完成（2026-07-30）**：发信在 429/5xx/网络错误时自动重试 3 次（指数退避）。 | `src/app/api/inquiry/route.ts` |
| ~~P1~~ 已做 | ~~缺商业字段（吨位/报价/成交/交期/回款）~~ | **已完成（2026-08-01）**：`crm_leads` 增 5 个可空列（`inquiry_tonnage`/`quote_amount`/`deal_amount`/`expected_delivery_date`/`payment_status`），详情页可录入与展示。迁移已在 Production 执行。 | `scripts/migrate-crm.mjs`、`src/lib/crm/repository.ts`、`inquiries/[id]/page.tsx`、`inquiries/actions.ts` |
| ~~P1~~ 已做 | ~~匿名访客行为无界面~~ | **已完成（2026-08-01）**：新增 `/admin/visitors`，按访客聚合近30天行为（动作序列/来源/落地页/是否转化）。 | `src/app/admin/(protected)/visitors/page.tsx`、`src/lib/conversion/visitor-events.ts` |
| ~~P1~~ 已做 | ~~visitorId 无法关联浏览轨迹~~ | **已完成（2026-08-01）**：根因是 `crm_leads.visitor_id` 存明文 UUID、`conversion_events.visitor_id_hash` 存 HMAC，无法直接 JOIN。抽出唯一哈希模块供读写两端共用，详情页新增「该客户浏览轨迹」。**线上实测关联成功**。 | `src/lib/attribution/visitor-hash.ts`、`api/conversion-event/route.ts`、`inquiries/[id]/page.tsx` |
| ~~P1~~ 已修 | ~~`rfq_submit` 埋点是死代码~~ | **已完成（2026-08-01）**：`trackRfqSubmit` 定义了但全仓库从未调用，导致漏斗"提交"环节恒为 0、无法算 start→submit 转化率。已在提交成功后调用。 | `src/components/forms/InquiryForm.tsx` |
| ~~P2~~ 已修 | ~~两套"已报价"口径不一致~~ | **已完成（2026-08-01）**：总览只数 `status='quoted'`、漏斗数累计，客户推进到谈判中就从卡片消失。两处统一为累计口径，并补上此前遗漏的 `sample`（**已与运营确认：寄样在报价之后**）。 | `src/lib/crm/repository.ts`、`src/lib/reporting/repository.ts` |
| ~~P2~~ 已修 | ~~产品页询盘分布未排除 spam~~ | **已完成（2026-08-01）**：`getProductInquiryStats` 加 `status <> 'spam'`。 | `src/lib/crm/repository.ts` |
| ~~P2~~ 已修 | ~~GEO 内容审核被批量误重置~~ | **已完成（2026-08-01）**：`content_version` 取自共享数据文件的 git 时间，改一个产品会让全部产品页版本跳变、复核状态与复核人被一起清空。改为按单页真实内容算指纹（`geo_content_reviews.content_fingerprint`），仅当该页自身内容变化才重置；静态页无指纹时回退比时间戳；首次同步只回填不重置。 | `src/lib/seo/content-fingerprint.ts`、`src/lib/seo/geo-content-registry.ts`、`src/lib/reporting/repository.ts`、`scripts/migrate-crm.mjs` |
| ~~P2~~ 已修 | ~~外链基线卡片永远停在"数据生成中"~~ | **已完成（2026-08-01）**：`processing` 是人工手选值且无任何机制推进，卡片停在 `2026-07-22` 十天。状态改为五个终态（已有数据 / 已确认为 0 / 未知待查 / 未接入 / 读取异常），卡片显示"距今 N 天"并超 7 天标黄；Bing 接 API 每日自动同步 + 「立即同步」按钮；GSC 明确标注只能人工登记（官方 API 无 Links 端点）。顶部黄框与"候选域名"计数改为实时读库（原写死"30个域名、未对外联系"，实际已联系 20 家）。 | `src/lib/backlinks/bing.ts`、`src/lib/backlinks/baseline-sync.ts`、`src/lib/backlinks/repository.ts`、`backlinks/page.tsx`、`backlinks/actions.ts`、`api/analytics/sync/route.ts`、`scripts/migrate-crm.mjs` |
| P3 未做 | IndexNow 覆盖窄 + 无手动按钮 | 仅每日 03:00 cron 触发（发布后最长等 24h），且只提交"时间戳最新的那一批"URL，其他改动页可能一直不被提交；后台无"立即提交"。**经评估性价比低（"已接收"≠已收录，Bing 流量占比小），运营决定暂缓。** | `src/lib/geo/indexnow.ts`、`vercel.json` |

## 5. 运营红线

- Git 只提交明确指定的文件，禁止 `git add -A`。保留 `seo/backlinks/` 等既有未跟踪文件。
- 密码/Key/Token 一律只存 Vercel 环境变量，禁止写入代码、文档、日志或对话。
- 不直接改/删 `crm_leads` 等业务数据；清除测试数据必须按确切 lead ID 且先经人工确认。
- 推 `main` 会触发部署；改动前先 `npm run build`。
- `NEXT_PUBLIC_` 变量为构建期注入，改动后必须重新部署才生效。
