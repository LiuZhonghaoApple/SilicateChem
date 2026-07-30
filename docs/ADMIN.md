# SilicateChem 后台管理说明书

生成日期：2026-07-30（Asia/Shanghai）

适用仓库：`LiuZhonghaoApple/SilicateChem`

项目路径：`/Users/ai/Desktop/SilicateChem_RECOVERY/SilicateChem_RESTORED`

当前分支：`main`

交接基线 HEAD（本文档提交前）：`cec6c527c48b6b2ce658b44136c0bd3e9ce5d7cf`
部署：Vercel `chem1/silicate-chem`，push `main` 自动部署。

本文件不包含任何密码、Token、API Key、数据库连接值或哈希值。

## 1. 后台入口与页面路由

入口：`https://www.silicatechem.com/admin`。未登录时由受保护布局跳转到 `/admin/login`。

### 1.1 页面与实现状态

| 模块 | 页面路由 | 主要文件 | 状态 |
|---|---|---|---|
| 登录 | `/admin/login` | `src/app/admin/login/page.tsx`、`src/app/admin/login/actions.ts` | 已实现 |
| 数据总览 | `/admin` | `src/app/admin/(protected)/page.tsx`、`src/lib/crm/repository.ts` | 已实现，读取真实数据库 |
| 询盘管理 | `/admin/inquiries` | `src/app/admin/(protected)/inquiries/page.tsx`、`src/app/admin/(protected)/inquiries/actions.ts` | 已实现，列表、筛选、状态、优先级、负责人、跟进、备注 |
| 询盘详情 | `/admin/inquiries/[id]` | `src/app/admin/(protected)/inquiries/[id]/page.tsx` | 已实现 |
| SEO 与流量 | `/admin/analytics` | `src/app/admin/(protected)/analytics/page.tsx`、`analytics/actions.ts`、`analytics/GeoMonitoringPanel.tsx` | 已实现，依赖 GA4/GSC 同步数据 |
| 外链管理 | `/admin/backlinks` | `src/app/admin/(protected)/backlinks/page.tsx`、`backlinks/actions.ts`、`src/lib/backlinks/repository.ts` | 已实现，基线、候选台账、状态、归因 |
| AI 物料工作台 | `/admin/media-ai` | `src/app/admin/(protected)/media-ai/page.tsx`、`src/components/admin/MediaAiWorkbench.tsx` | 已实现，任务、上传、AI 草稿、预览、人工审核 |

五个截图模块均不是占位空壳。当前 Production 中 AI 物料任务为 0 条；媒体上传还缺少 `BLOB_READ_WRITE_TOKEN`，因此上传接口当前不可用，但任务和外部素材 URL 逻辑已存在。

### 1.2 API routes

| 路由 | 方法 | 鉴权 | 文件 | 用途 |
|---|---|---|---|---|
| `/api/inquiry` | POST | 公开；限流、时间/蜜罐校验，可启用 Turnstile | `src/app/api/inquiry/route.ts` | 接收询盘、写库、发邮件 |
| `/api/conversion-event` | POST | 公开；持久化限流 | `src/app/api/conversion-event/route.ts` | 保存 WhatsApp、AI、RFQ 转化事件 |
| `/api/ai-advisor` | POST | 公开；本地规则优先、持久化限流 | `src/app/api/ai-advisor/route.ts` | AI 采购顾问 |
| `/api/analytics/sync` | GET | `Authorization: Bearer CRON_SECRET` | `src/app/api/analytics/sync/route.ts` | GA4/GSC/站点每日同步 |
| `/api/geo/indexnow` | GET | `Authorization: Bearer CRON_SECRET` | `src/app/api/geo/indexnow/route.ts` | IndexNow 提交 |
| `/api/admin/media-ai/upload` | POST | `getAdminSession()` | `src/app/api/admin/media-ai/upload/route.ts` | Vercel Blob 图片/视频上传 |
| `/api/admin/media-ai/tasks` | POST | `getAdminSession()` | `src/app/api/admin/media-ai/tasks/route.ts` | 创建物料任务 |
| `/api/admin/media-ai/tasks/[id]` | PATCH | `getAdminSession()` | `src/app/api/admin/media-ai/tasks/[id]/route.ts` | 更新草稿与审核状态 |
| `/api/admin/media-ai/tasks/[id]/assets` | POST | `getAdminSession()` | `src/app/api/admin/media-ai/tasks/[id]/assets/route.ts` | 为任务挂接素材 |
| `/api/admin/media-ai/generate` | POST | `getAdminSession()` | `src/app/api/admin/media-ai/generate/route.ts` | 调用 OpenAI 生成待审核文案 |

后台询盘读取没有单独 API route：Server Component 直接调用 `src/lib/crm/repository.ts`。

### 1.3 鉴权入口文件

- `src/app/admin/layout.tsx`：后台 metadata，`noindex/nofollow/nocache`。
- `src/app/admin/(protected)/layout.tsx`：所有受保护页面统一检查 `getAdminSession()`。
- `src/lib/admin-auth.ts`：账号校验、会话签发/解析/清除。
- `src/app/admin/login/actions.ts`：登录动作和登录限流。
- `src/app/admin/(protected)/actions.ts`：退出登录。
- 没有 `middleware.ts`；鉴权由受保护 layout 和各个 admin API route 自行执行。

## 2. 鉴权与账号

### 2.1 存放位置

Production 账号只使用 Vercel 环境变量：

- 用户名：`ADMIN_USERNAME`
- 密码哈希：`ADMIN_PASSWORD_HASH`
- 会话密钥：`ADMIN_SESSION_SECRET`

代码没有硬编码账号密码，数据库没有管理员账号表。密码哈希格式在 `src/lib/admin-auth.ts:52-68` 校验为 `pbkdf2-sha256$迭代次数$盐$哈希`，不应把明文密码写入任何文件。

### 2.2 会话机制

- 不是 JWT，也不是数据库 session；是 HMAC-SHA256 签名的无状态 cookie。
- Cookie 名：`silicatechem_admin_session`。
- 载荷含用户名和过期时间；密钥为 `ADMIN_SESSION_SECRET`。
- `httpOnly: true`、Production `secure: true`、`sameSite: strict`、`path: /`。
- 有效期：7 天（`src/lib/admin-auth.ts:11`、`83-96`）。

### 2.3 账号数量与后门检查

- 代码只读取一个 `ADMIN_USERNAME` 和一个 `ADMIN_PASSWORD_HASH`。
- 未发现第二个管理员账号、硬编码账号、测试后门或未鉴权的后台页面入口。
- `CRON_SECRET` 是定时任务的独立 Bearer 鉴权，不是第二个后台登录入口。
- 登录失败限流：每个来源 IP 15 分钟 5 次，持久化到 `security_rate_limits`；数据库不可用时降级为实例内存限流（`src/lib/rate-limit.ts:75-137`）。

### 2.4 修改账号密码

1. 在本地安全环境生成符合现有 PBKDF2 格式的 `ADMIN_PASSWORD_HASH`，不要把明文或哈希写入仓库。
2. 在 Vercel 项目 Settings → Environment Variables 修改 `ADMIN_USERNAME` 或 `ADMIN_PASSWORD_HASH`。
3. 如果同时修改 `ADMIN_SESSION_SECRET`，所有既有后台会话都会失效；保存后重新登录。
4. 由 Vercel 自动生成新部署并验证 `/admin/login`。

## 3. 询盘数据链路

```text
产品页 / Contact / 首页等
  → src/components/forms/InquiryFormWrapper.tsx
  → src/components/forms/InquiryForm.tsx
  → src/lib/attribution-client.ts
     （sessionStorage: silicatechem_inquiry_attribution；UTM、referrer、visitorId、GEO）
  → POST /api/inquiry
  → src/lib/validation.ts 校验
  → src/lib/rate-limit.ts 限流
  → src/lib/turnstile.ts（仅当两项 Turnstile 环境变量均存在时）
  → src/lib/leads.ts 生成 StructuredLead
  → src/lib/crm/repository.ts:createLeadRecord()
  → Neon/Postgres: crm_leads
       同一事务写入 crm_lead_status_history 和 admin_audit_logs
  → src/app/api/inquiry/route.ts 调用 Resend 发通知
  → updateLeadEmailDelivery() 回写 crm_leads.email_delivery_status
  → /admin → src/app/admin/(protected)/page.tsx
  → /admin/inquiries → src/app/admin/(protected)/inquiries/page.tsx
  → /admin/inquiries/[id] → 详情、备注、状态历史和跟进
```

### 3.1 存储

- 数据库类型：Neon Serverless Postgres，客户端 `@neondatabase/serverless`，连接变量 `DATABASE_URL`；实现位置 `src/lib/db.ts`。
- 主表：`crm_leads`。
- 关联表：`crm_lead_notes`、`crm_lead_status_history`、`admin_audit_logs`。
- 限流表：`security_rate_limits`。
- 转化事件表：`conversion_events`。
- 建表和索引：`scripts/migrate-crm.mjs`。
- 没有使用 Supabase；没有使用 Upstash。当前限流的持久化实现直接使用 Neon 表。

### 3.2 第三方服务

- Resend：`src/app/api/inquiry/route.ts:75-88`。
- Cloudflare Turnstile：`src/lib/turnstile.ts`，变量 `NEXT_PUBLIC_TURNSTILE_SITE_KEY`、`TURNSTILE_SECRET_KEY`。
- Neon/Postgres：`DATABASE_URL`。
- AI 物料生成：OpenAI Responses API，变量 `OPENAI_API_KEY`；仅后台媒体草稿生成使用。
- Vercel Blob：变量 `BLOB_READ_WRITE_TOKEN`；Production 当前未配置，上传接口返回 503。

## 4. 通知

- 服务商：Resend，不是 SendGrid，也不是 SMTP。
- 代码：`src/app/api/inquiry/route.ts:26-97`。
- 收件地址：Production `INQUIRY_TO_EMAIL = padelonesource@gmail.com`。
- 发件地址：Production `INQUIRY_FROM_EMAIL = info@Silicatechem.com`。
- 配置状态：`RESEND_API_KEY`、收件和发件变量均已配置；但尚未执行阶段三测试，因此没有本阶段新的发送成功证据。
- 每条询盘在 `crm_leads.email_delivery_status` 记录 `pending/sent/failed`；失败详情在 `email_delivery_error`。
- 当前没有 Slack、Teams、短信或 WhatsApp 自动通知。
- 代码行为：先尝试数据库写入，再调用 Resend；数据库已写入但邮件失败时，询盘仍保留，后台邮件状态为 `failed`。

## 5. 指标定义

### 5.1 “有效询盘”

后台“数据总览”卡片的定义是：

```sql
COUNT(*) FILTER (WHERE status = 'qualified')
```

位置：`src/lib/crm/repository.ts:165-211`，渲染位置：`src/app/admin/(protected)/page.tsx`。

注意：`/admin/analytics` 的“询盘漏斗”使用另一套口径，把 `qualified、quoted、sample、negotiating、won` 都计入漏斗阶段“有效询盘”，位置：`src/lib/reporting/repository.ts:540-570`。两处口径目前不一致，这是待修项，不要把两个数字直接比较。

### 5.2 “AI来源询盘（30天）”

数据总览使用：

```sql
submitted_at >= NOW() - INTERVAL '30 days'
AND geo_source IS NOT NULL
```

位置：`src/lib/crm/repository.ts:176-191`；分来源列表位置：`src/lib/crm/repository.ts:214-226`。

`geo_source` 由 `src/lib/attribution-client.ts:47-83` 根据 UTM source 或 referrer host 匹配 ChatGPT、Perplexity、Bing Copilot、Claude、Gemini、Grok、You.com 等模式写入。

当前逻辑没有额外排除 `spam` 状态；若产生垃圾询盘，该指标可能被计入，这是待修项。

### 5.3 “归因”

前台首次访问时，`src/lib/attribution-client.ts:85-104` 将以下信息写入 sessionStorage，提交时由 `InquiryForm.tsx:137-149` 带入 API：

- `sourcePath`
- `landingPage`
- `referrer`
- `utm_source / utm_medium / utm_campaign / utm_term / utm_content`
- `visitorId`
- `geoSource / geoReferrerHost / geoLandingPath`

服务器在 `src/lib/leads.ts:71-119` 组装结构化询盘，在 `src/lib/crm/repository.ts:115-150` 写入 `crm_leads`。IP 和转化 visitor ID 以哈希方式保存，不保存原始 IP。

转化事件来源展示位置：`src/lib/reporting/repository.ts:501-529`，优先级为 `geo_source → utm_source → referrer_host → direct / unknown`。这是一套来源归因，不等同于 GA4 的 session source。

## 6. Production 数据现状

查询时间：2026-07-30；使用 Vercel Production `DATABASE_URL` 只读 COUNT 查询，没有执行 INSERT、UPDATE、DELETE。

| 表 | 实际记录数 |
|---|---:|
| `crm_leads` | 0 |
| `crm_lead_notes` | 0 |
| `crm_lead_status_history` | 0 |
| `admin_audit_logs` | 5 |
| `security_rate_limits` | 4 |
| `conversion_events` | 16 |
| `reporting_sync_runs` | 53 |
| `backlink_opportunities` | 30 |
| `media_ai_tasks` | 0 |
| `media_ai_assets` | 0 |

结论：询盘存储是情况 **(a) 确实 0 条**，不是情况 **(b) 被后台查询条件过滤**。`crm_leads` 没有任何 status，因此后台询盘列表为空是数据真实为空。

当前其他可验证状态：

- 最近一次 Production site/GA4/GSC cron 同步均为 `success`；最近记录时间为 2026-07-30，row count 分别为 30、290、566。
- GSC 与 Bing 外链基线均为 `processing`，引用域、链接页、样本链接、锚文本字段为空值（未知），不是 0。
- `BLOB_READ_WRITE_TOKEN` 未配置；AI 物料任务表当前为空。

## 7. 阶段三执行结果（2026-07-30）

### 7.1 前置校验

- `git fetch origin` 已执行。
- 本地 `main...origin/main`：ahead 1、behind 0。
- 当前检出分支：`fix/header-logo-nav-gap`；当前 HEAD 与 `origin/main` 完全一致。
- 当前 HEAD 与 `origin/main` 的差异文件：无。
- 当前目录是带完整 `.git` 和正确 `origin` 的恢复副本，不是新鲜 clone；远程为 `https://github.com/LiuZhonghaoApple/SilicateChem.git`。
- 当前工作区存在既有未提交 `src/components/layout/Header.tsx` 改动和 `seo/backlinks/` 未跟踪文件，均未修改、未暂存。

### 7.2 Turnstile

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`：已配置（仅记录存在性）。
- `TURNSTILE_SECRET_KEY`：已配置（仅记录存在性）。
- `/api/inquiry` 服务端 Turnstile 校验：生效。
- 代码依据：`src/lib/turnstile.ts:17-46`；服务端校验入口：`src/app/api/inquiry/route.ts:141-157`。

### 7.3 Production `conversion_events` 全部 16 条

以下 `visitor` 是数据库中的哈希值，不是原始访客标识。

| 时间（UTC） | 事件 | 来源页 | `geo_source` | `utm_source` | visitor 哈希 |
|---|---|---|---|---|---|
| 2026-07-22 04:25:23 | `ai_advisor_open` | `/contact` | — | — | `44ea70e62cbc7a8dacac0e3215e8c8731cb0d67ddf5c5e9d97ec89deb4eaf7f0` |
| 2026-07-23 05:18:11 | `rfq_start` | `/` | `chatgpt` | `chatgpt.com` | `b8326619a1a1ee2046068a899dd1ab37c67cf3c6e6b39dccf9dcdd6f64ed56ef` |
| 2026-07-23 22:10:59 | `rfq_start` | `/contact` | — | — | `68a621400f52cf70dfe50e7e69060caefeecfc9300ffb17a11f861e08ac80678` |
| 2026-07-23 22:11:04 | `rfq_start` | `/contact` | — | — | `68a621400f52cf70dfe50e7e69060caefeecfc9300ffb17a11f861e08ac80678` |
| 2026-07-23 22:11:10 | `ai_advisor_open` | `/contact` | — | — | `68a621400f52cf70dfe50e7e69060caefeecfc9300ffb17a11f861e08ac80678` |
| 2026-07-24 05:06:47 | `whatsapp_click` | `/` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 05:11:33 | `ai_advisor_open` | `/` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 05:11:37 | `whatsapp_click` | `/` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 05:11:37 | `ai_advisor_handoff` | `/` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 05:20:26 | `ai_advisor_open` | `/` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 05:20:35 | `rfq_start` | `/` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 05:38:14 | `ai_advisor_open` | `/about` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 06:18:25 | `whatsapp_click` | `/contact` | — | — | `b725f0641736885dfde451a6405008d7ad1a1016042f30923a7d251012007afe` |
| 2026-07-24 08:00:00 | `ai_advisor_open` | `/` | — | — | `6db056060620acde40190848876e908cb24bd0359c40723fc21c3826c96e6bb8` |
| 2026-07-29 11:45:14 | `rfq_start` | `/contact` | `chatgpt` | `chatgpt.com` | `2e89290e2a3e316385b043fc0ad2d0f36cd757a9384706c76ed99c9e9328a446` |
| 2026-07-30 06:16:12 | `whatsapp_click` | `/` | — | — | `8ff80d2788766b3408ddadb5b0f6af8fed166f405694bf03adf64f644995aadc` |

判断：这些是已经到达 Production 的客户端事件，不是本地代码模拟写入；但数据库没有 user-agent、登录身份或内部测试标记，无法仅凭这 16 条记录证明是外部买家还是内部/验收访问。带 `google.com` 或 `chatgpt.com` referrer 只能证明浏览器提交了该来源信号，不能证明访客身份。统一标记为“Production 客户端行为，访客真实性未验证”。

### 7.4 Resend 域名与 DNS

通过 Resend API 只读查询：

- `silicatechem.com`：`verified`
- DKIM：`verified`
- SPF MX：`verified`
- SPF TXT：`verified`

未发送邮件，未修改 Resend 或 DNS 配置。

### 7.5 线上真实表单端到端测试

测试页面：`https://www.silicatechem.com/contact?type=quote&source=stage3-test`

测试公司：`TEST-20260730`
测试邮箱：`padelonesource@gmail.com`

结果：提交在 Turnstile 客户端阶段阻断，未进入 `/api/inquiry`。

| 环节 | 结果 |
|---|---|
| a. 表单提交 HTTP 响应 | 未产生；按钮持续显示原文 `Submitting...` |
| b. `crm_leads` | 未新增；Production 总数仍为 0；无 lead ID |
| c. status history / audit | 未写入测试记录 |
| d. 归因字段 | 未生成；未进入 API |
| e. Resend 调用 | 未到达；未发送邮件 |
| f. `email_delivery_status` | 无测试记录 |
| g. 收件箱/垃圾箱 | 不适用；没有邮件发送 |
| h. `/admin` 与 `/admin/inquiries` | 总览全部询盘为 0，询盘列表显示“没有符合条件的询盘” |

失败原文与证据：

- 页面可见状态原文：`Submitting...`。
- 页面运行时：`window.turnstile` 为 `undefined`，Turnstile iframe 数量为 0；未观察到 `/api/inquiry` 响应。
- `src/components/forms/InquiryForm.tsx:143-146`：配置了 site key 后进入 `turnstileRef.current?.execute()`，未继续调用 `submitInquiry()`。
- `src/components/forms/TurnstileField.tsx:63-95`：负责加载 `https://challenges.cloudflare.com/turnstile/v0/api.js` 并创建 widget；本次浏览器中 API 未加载。
- `src/components/forms/TurnstileField.tsx:48-55`：widget 或 API 不存在时才调用错误回调；本次 ref 没有产生可见错误，页面保持提交中。
- `src/app/api/inquiry/route.ts:141-157`：服务端 Turnstile 校验代码未被本次请求触发。

本次失败只做诊断，未修复代码、未修改环境变量、未重试绕过 Turnstile。

### 7.6 测试数据清除

本次没有生成 lead ID，没有执行任何 DELETE。不得按公司名、时间范围或模糊条件删除。若后续修复后测试成功，必须先报告确切 lead ID，再单独确认删除。

### 7.7 待修项优先级

| 优先级 | 待修项 | 影响 | 涉及文件 | 复杂度 | 需要改数据库 |
|---|---|---|---|---|---|
| P0 | Turnstile 客户端未加载导致真实表单停在 `Submitting...` | 所有生产询盘可能无法提交 | `src/components/forms/TurnstileField.tsx`、`src/components/forms/InquiryForm.tsx`、Turnstile Vercel 配置 | 中 | 否 |
| P1 | 统一“有效询盘”两套统计口径 | 后台总览与漏斗数字不可直接比较 | `src/lib/crm/repository.ts`、`src/lib/reporting/repository.ts` | 低 | 否 |
| P1 | AI 来源询盘排除 `spam` 或明确指标名称 | 垃圾询盘可能进入 AI 来源统计 | `src/lib/crm/repository.ts` | 低 | 否 |
| P1 | 补齐 Vercel Blob 配置 | AI 物料上传接口当前 503 | Vercel 环境变量、`src/app/api/admin/media-ai/upload/route.ts` | 低 | 否 |
| P2 | 邮件失败自动重试/告警 | Resend 失败依赖人工查看状态 | `src/app/api/inquiry/route.ts`、后台 reporting | 中 | 可选 |

## 8. 已知断点与待修项

1. `crm_leads` 当前为 0 条；没有真实端到端询盘、后台显示和通知成功证据。阶段三才允许提交测试询盘。
2. 数据总览“有效询盘”和 SEO/GEO 漏斗“有效询盘”口径不一致，需要统一或明确展示名称。
3. “AI来源询盘（30天）”目前没有排除 `spam` 状态。
4. Production 发件环境变量使用 `info@Silicatechem.com` 大小写形式；网站统一联系方式口径为 `info@silicatechem.com`，大小写通常不影响投递，但需人工决定是否统一环境变量。
5. `BLOB_READ_WRITE_TOKEN` 缺失，`/api/admin/media-ai/upload` 当前无法上传；需要在 Vercel 配置后再测。
6. AI 物料生成依赖 `OPENAI_API_KEY`；未设置 `MEDIA_AI_MODEL` 时，代码回退到 `AI_ADVISOR_MODEL` 或 `gpt-5-nano`。
7. 限流在数据库异常时会回退到实例内存，不能把该降级路径当作全局严格限流。
8. Resend 没有队列和自动重试；邮件失败依赖后台 `emailDeliveryStatus` 人工发现。
9. 当前是单管理员环境变量模型，没有角色权限、第二管理员或 MFA。
10. 外链模块当前是基线与机会台账、状态和归因管理；代码中没有自动向外部网站提交内容的 API。

## 9. 日常运维

### 可以在后台修改

- 询盘：状态、优先级、负责人、下次跟进时间、丢单原因、备注。
- SEO/GEO：手动同步、AI 引用观察、内容证据审核状态。
- 外链：候选机会、状态、承接页、来源页、锚文本、rel、复查日期、备注、基线快照。
- AI 物料：新建任务、上传素材、生成草稿、编辑文案、设置 `HUMAN REVIEW/PASS/BLOCKED`。

### 修改前必须确认

- 不直接修改或删除 `crm_leads`；业务状态应通过后台动作完成。
- 不手动改表结构或枚举值；数据库变更必须增加可审计 migration。
- 不改变 `DATABASE_URL` 指向，除非已确认目标数据库和备份。
- 不随意修改 `ADMIN_SESSION_SECRET`（会让所有会话失效）。
- 不随意修改 `ATTRIBUTION_HASH_SECRET`（会影响后续哈希归因的一致性）。
- 不修改 `CRON_SECRET` 其中一端，否则两个 Vercel Cron route 会返回 401。
- `GOOGLE_SERVICE_ACCOUNT_JSON`、`RESEND_API_KEY`、`TURNSTILE_*`、`OPENAI_API_KEY`、`BLOB_READ_WRITE_TOKEN` 只在 Vercel 环境变量中维护。
- 不把任何秘密写入代码、文档、日志、截图或 commit；不提交 `.env*`。
- 推送 `main` 会触发 Vercel 部署；修改后先运行 `npm run build`。
- Git 只暂存明确文件，禁止 `git add -A`。

## 10. Claude Code 接管顺序

1. 先读取本文件，执行 `git status --short --branch`，保留现有未跟踪文件，不要清理或覆盖。
2. 阶段一和阶段二已完成；阶段三已执行到线上表单测试，因 Turnstile 客户端未加载而阻断。
3. 当前只允许人工确认修复方案；在确认前不得修改 Turnstile、表单或其他业务代码。
4. 后续测试若成功，必须逐段记录结果、给出密码轮换步骤，并只按明确 lead ID 清除测试数据。

本次交接范围：新增并提交本文件；没有修改前台、SEO 配置、业务代码或数据库数据。

## 11. 2026-07-30 Turnstile 只读复核

### 11.1 Production 测试询盘查询

- 使用当前 Vercel Production 数据库连接，按 `company = TEST-20260730` 精确查询：`0` 条。
- 使用 `company ILIKE '%TEST-20260730%'` 复核：`0` 条。
- 因此没有 lead ID、归因字段或 `email_delivery_status` 可报告；没有执行删除，也没有按模糊条件清理任何数据。

### 11.2 Turnstile 环境状态

用户报告已在 Vercel 侧移除 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 与 `TURNSTILE_SECRET_KEY` 并重新部署；但本次从当前链接项目重新拉取 Production 环境变量时，两个变量仍显示为已配置（仅记录存在性，不记录值）。

结论：**“Turnstile 已在环境变量层禁用”当前未被只读证据确认；当前链接的 Vercel Production 仍是已配置状态。** 未修改 Vercel 环境变量，未重新部署。

### 11.3 CSP 检查

- `next.config.ts:13` 的 `script-src` 包含 `https://challenges.cloudflare.com`。
- `next.config.ts:17` 的 `connect-src` 包含 `https://challenges.cloudflare.com`。
- `next.config.ts:18` 的 `frame-src` 包含 `https://challenges.cloudflare.com`。
- 线上 `https://www.silicatechem.com/contact?type=quote` 返回 HTTP 200，响应 CSP 同样允许该域名。

结论：当前证据不支持“CSP 阻止 Turnstile”是根因。

### 11.4 客户端加载失败根因定位

- `src/components/forms/TurnstileField.tsx:1` 是 Client Component；脚本和 widget 在 `useEffect`（`63-103`）中异步注入/渲染，服务端渲染阶段不会访问 `window`，因此没有发现典型 SSR/hydration 直接冲突。
- 同一组件把 `window.onTurnstileLoad` 作为回调并插入异步脚本（`88-93`），但没有 `script.onerror`、超时 watchdog 或重试/失败状态。
- `src/components/forms/InquiryForm.tsx:143-146` 在存在 site key 时保存待提交 payload 后调用 `turnstileRef.current?.execute()`；当 ref/widget 尚未就绪时，optional chaining 会静默 no-op，`submitting` 状态没有恢复，页面因此无限停留在 `Submitting...`。
- 之前的线上浏览器证据为：`window.turnstile` 未定义、Turnstile iframe 数量为 0、没有 `/api/inquiry` 请求；服务端校验（`src/app/api/inquiry/route.ts:141-157`）未被触发。

结论：主要问题是第三方 Turnstile 脚本/widget 的就绪失败没有被建模和兜底，不是已证实的 CSP 或 SSR/hydration 阻断。

### 11.5 仅供后续修复的方案（本次未实施）

1. 为脚本和 widget 增加显式 `loading/ready/failed` 状态，监听 `load`、`error`，并设置有限超时与一次性重试。
2. 提交路径必须等待就绪结果；客户端加载失败时不得无限等待。按业务选择“放行提交并记录 `turnstile_unavailable`”或显示可操作的人工回退，同时保留 honeypot、表单年龄、限流和服务端风控。
3. 不使用可静默 no-op 的 optional execute；在 ref 不可用时明确结束 submitting 状态并走失败/放行分支。
4. 服务端策略与环境变量状态保持一致，并为放行/失败分支记录可审计事件。

以上仅为诊断和方案建议，未修改 Turnstile、表单、API 或任何业务代码。

### 11.6 给 Claude Code 的接管摘要

```text
仓库：/Users/ai/Desktop/SilicateChem_RECOVERY/SilicateChem_RESTORED
当前分支：main；本次复核前 HEAD 与 origin/main 均为 a766548。
当前未跟踪文件：seo/backlinks/assets/、seo/backlinks/phase2-progress-2026-07-23.md、seo/backlinks/submissions/；请保留，不要清理。
历史本地文档提交 62c5af3、c36de98 曾存在于本地对象，但在并发恢复后已不在当前 main 历史；本次将新增一个仅本地、未 push 的 docs/ADMIN.md 提交，提交后 main 将领先 origin/main 1 个 commit。

Production 只读查询：TEST-20260730 精确与模糊匹配均为 0 条，没有 lead ID，不执行删除。
Turnstile：用户报告已移除两个环境变量，但本次 vercel pull/env list 仍显示 NEXT_PUBLIC_TURNSTILE_SITE_KEY、TURNSTILE_SECRET_KEY 存在；因此“环境变量层禁用”未确认，当前链接项目仍配置 Turnstile。未改 Vercel、未 redeploy。
CSP：next.config.ts 与线上 Contact 响应均允许 challenges.cloudflare.com（script-src/connect-src/frame-src）。
根因：异步 Turnstile 脚本/widget 未就绪时没有 onerror/超时/重试；InquiryForm.tsx:143-146 的 optional ref execute 静默 no-op，导致 submitting 无限挂起。不是已证实的 CSP 或 SSR/hydration 问题。
后续：等明确授权后由 Claude Code 设计并修复“加载失败放行/人工回退+风控+审计”方案；当前不要修改代码、不要删除数据、不要 push。
```
