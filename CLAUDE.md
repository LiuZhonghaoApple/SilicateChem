# SilicateChem 运营与开发说明（CLAUDE.md）

面向：接管 silicatechem.com 仓库与线上后台的 AI/运维。
最近更新：2026-07-30。
仓库：`LiuZhonghaoApple/SilicateChem`　部署：Vercel `chem1/silicate-chem`（push `main` 自动部署）。
详细技术手册见 [`docs/ADMIN.md`](docs/ADMIN.md)，本文件是"运营职责 + 待办 + 待修"的活文档。

---

## 1. 后台（/admin）运营职责

后台入口：`https://www.silicatechem.com/admin`（未登录跳 `/admin/login`）。
账号在 Vercel 环境变量：`ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` / `ADMIN_SESSION_SECRET`（不硬编码、不入库）。

五个模块（均为真实功能，非占位）：

| 模块 | 路由 | 作用 |
|---|---|---|
| 数据总览 | `/admin` | 读真实库，询盘/转化概览 |
| 询盘管理 | `/admin/inquiries` | 列表、筛选、状态、优先级、负责人、跟进、备注、详情 |
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

### 总览页 GEO/AI 面板（2026-07-30 优化）

总览页"近30天 GEO / AI 来源"面板原先只统计 `crm_leads` 里带 `geo_source` 的**已提交询盘**，leads=0 时一片空白，会误以为 AI 渠道无动静。已改为两层：

- **AI 来源询盘**：已提交的 AI 渠道询盘（`getGeoInquiryStats`，lead 维度）。
- **AI 来源访客活跃**（新增）：`getGeoSourceActivity`，从 `conversion_events` 按 `geo_source` 统计近30天访客数与 RFQ 发起数，即使尚未转化为 lead 也能显示（如 `chatgpt — N 访客 · M 次 RFQ`）。

同理，总览页顶部另有"近30天客户行为"卡片（`getConversionEventFunnel`）：会话/WhatsApp点击/在线咨询/RFQ 发起，避免 leads=0 时整页显示为空。

### 在线客服 "Sales & Support"（2026-07-30 去 AI 化）

- 组件 `src/components/ai/ProcurementAdvisor.tsx`，对外统一显示 **"Sales & Support"**，以真人客服口吻接待，不再出现 "AI/Advisor" 字样；对话引擎（`src/app/api/ai-advisor/route.ts`）也被要求以销售团队身份说话、不自称 AI。
- 内部统计事件名仍为 `ai_advisor_*`（保持数据连续，勿改）。
- **留联系方式 + 人工通知**：聊天框内可留邮箱/WhatsApp，提交到 `src/app/api/support-handoff/route.ts`，即时发邮件到 Gmail 提醒人工跟进（回信到 info@）。

## 3. 待办队列

**活跃待办：无。**

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

## 5. 运营红线

- Git 只提交明确指定的文件，禁止 `git add -A`。保留 `seo/backlinks/` 等既有未跟踪文件。
- 密码/Key/Token 一律只存 Vercel 环境变量，禁止写入代码、文档、日志或对话。
- 不直接改/删 `crm_leads` 等业务数据；清除测试数据必须按确切 lead ID 且先经人工确认。
- 推 `main` 会触发部署；改动前先 `npm run build`。
- `NEXT_PUBLIC_` 变量为构建期注入，改动后必须重新部署才生效。
