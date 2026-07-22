# SilicateChem WhatsApp / AI / RFQ 转化监测闭环

- 验收日期：2026-07-22
- 数据范围：功能部署后产生的新事件；不回填历史点击

## 已接入事件

| 事件 | 业务含义 |
| --- | --- |
| `whatsapp_click` | 用户实际点击 WhatsApp 链接 |
| `ai_advisor_open` | 打开 AI 采购顾问 |
| `ai_advisor_question` | 提交一次 AI 问题，不保存问题内容 |
| `ai_advisor_answer` | 完成一次回答，仅记录 local / ai / fallback 模式 |
| `ai_advisor_handoff` | 从 AI 转入 WhatsApp 或 RFQ |
| `rfq_start` | 点击 RFQ CTA 或首次进入询盘表单交互 |
| `rfq_submit` | 询盘接口成功接收后记录 |

所有事件同时发送 GA4/GTM 镜像，并写入自有数据库，避免仅依赖第三方统计。

## 数据与防刷边界

- IP 和 visitor ID 使用 HMAC 哈希，数据库不保存原值。
- 不保存 AI 问题、回答、姓名、邮箱、电话或询盘正文。
- 页面与落地页只保存 pathname，服务端强制移除查询参数。
- 事件 ID 唯一，重试不会重复落库。
- 每 IP 每小时最多 240 条；全站每天最多 25,000 条；限流使用数据库持久化。

## 后台观测

`/admin/analytics` 新增：

- 近30天 WhatsApp、AI、RFQ 与 CRM 询盘触点卡片。
- AI 开启、提问、回答、转人工的阶段比率。
- WhatsApp 点击、RFQ 启动、RFQ 提交与 CRM 入库对照。
- 按页面和 GEO / UTM / referrer host 汇总的来源表。
- 明确标注“从部署后累计”，避免把无历史数据误显示为历史零转化。

## 验收证据

- Next.js 生产构建通过，42 个路由生成完成。
- Development 与 Production 数据库幂等迁移均完成：54 条语句。
- Production 环境本地服务写入测试事件返回 HTTP 202，`stored: true`。
- 数据库核验：页面路径和落地页查询参数已移除，visitor / IP 哈希均存在。
- Production 后台漏斗与页面分组查询执行成功。
- 测试事件与测试限流记录已删除，残留测试事件为 0。
