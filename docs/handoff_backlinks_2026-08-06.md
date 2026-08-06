# 交接文档 — 询盘链路修复 + 外链投稿执行

会话时间：2026-07-30 ~ 2026-08-06
执行人：Claude Code（本会话）
仓库：`/Users/ai/Desktop/SilicateChem_RECOVERY/SilicateChem_RESTORED`（`LiuZhonghaoApple/SilicateChem`）
运营账号：`padelonesource@gmail.com`（所有投稿邮件均由用户本人从此账号发出）

> ⚠️ 本文件只覆盖**本会话**的工作。同期有其他会话在同一仓库并行提交（SEO 页面、访客面板、域名整合等），其成果不在此文记录，勿与本文混淆。

---

## 一、最重要的结论（先看这段）

1. **询盘表单已修好并验证通过**。此前坏了 8 天，一条询盘都进不来，根因是 Turnstile。现在客户提交 → 写库 → 邮件通知全链路正常。
2. **询盘通知只发 Gmail**（`padelonesource@gmail.com`），**不要再试图让 info@ 也收**——已实测三次，阿里企业邮箱的"本域反仿冒"规则必拦。详见第三节。
3. **外链已从 0 推进到 20 家在跑、3 家接受、3 篇正文交稿**。命中率 15%。
4. **有一个待处理风险**：两家清洁行业媒体拿到了几乎相同的选题，若都接受会违反独家承诺。详见第六节。

---

## 二、询盘链路修复（已完成）

### 根因与修复
- **根因**：Vercel Production 里 `NEXT_PUBLIC_TURNSTILE_SITE_KEY` 与 `TURNSTILE_SECRET_KEY` 一直存在（用户以为已删），客户端脚本加载不出来，表单永久卡在 `Submitting...`，`/api/inquiry` 根本不被调用。
- **临时处置**：移除这两个 Production 变量并重新部署（值已备份到 `~/.silicatechem-secrets/`，权限 600，不在仓库内）。
- **根因修复（P0，已完成）**：
  - 客户端：`InquiryForm.tsx` 增加 8 秒超时看门狗 + 单次幂等完成逻辑；`TurnstileField.tsx` 增加 `script.onerror`。加载失败即放行提交，**不再可能挂起**。
  - 服务端：`/api/inquiry` 改为非阻断——只拒绝"明确无效的 token"，缺 token（第三方故障）则放行并记日志。蜜罐 + 最短填写时长 + 限流仍是硬防线。
- **当前 Turnstile 状态**：**关闭**（环境变量保持移除）。代码已安全，随时可开回；开回只需恢复备份的两个变量并重新部署。

### 已验证
- 线上真实提交返回 `success/stored/emailDelivered` 全部正常，数据库、状态历史、归因字段、邮件状态均正确。
- 所有测试数据已按确切 lead ID 精确删除，未使用模糊条件。

---

## 三、邮件通知（定案，勿再改动）

| 项 | 值 |
|---|---|
| 收件人 `INQUIRY_TO_EMAIL` | `padelonesource@gmail.com`（**只此一个**） |
| 发件人 `INQUIRY_FROM_EMAIL` | `inquiry@silicatechem.com` |
| 回信地址 | `info@silicatechem.com` |

**为什么不发 info@**：阿里企业邮箱有"本域反仿冒"规则，会拦掉一切"从外部系统寄来、却声称来自 `@silicatechem.com`"的邮件。已实测 `info@`、`notify@`、`inquiry@` 三个发件地址，**info@ 收件端全部被拦，Gmail 全部正常**。Resend 端状态均为 `delivered`，即对方服务器收下后自行丢弃。
若日后确需 info@ 收件：只能由人工登录阿里企业邮箱后台，把发信来源加入反垃圾白名单。代码层面无解。

其他已完成：`/api/inquiry` 支持逗号分隔多收件人；Resend 发信在 429/5xx/网络错误时自动重试 3 次（指数退避）。

---

## 四、后台改动（本会话）

| 改动 | 位置 | 说明 |
|---|---|---|
| 询盘人工录入 + 附件 | `/admin/inquiries` 右上角 | 字段：日期(自动)、国家、来源渠道、产品、跟进人、备注、附件。附件走服务端 `put()` 上传 Blob，**单个 ≤4MB**（Vercel 请求体上限） |
| 总览页"近30天客户行为" | `/admin` | 会话/WhatsApp点击/在线咨询/RFQ发起，避免 leads=0 时整页空白 |
| GEO/AI 面板两层化 | `/admin` | 增加"AI来源访客活跃"（从 conversion_events 统计），即使未转化为 lead 也能看到 ChatGPT 在送客 |
| 在线客服去 AI 化 | `ProcurementAdvisor.tsx` | 对外统一显示 **"Sales & Support"**，去掉 AI 角标；对话引擎被要求以销售团队身份说话、不自称 AI。**内部统计事件名仍为 `ai_advisor_*`，勿改**（保持数据连续） |
| 留联系方式 + 人工通知 | `/api/support-handoff` | 客户在聊天框留邮箱/WhatsApp → 立即发邮件到 Gmail |
| 外链台账排序 | `/admin/backlinks` | 按进展排：live > accepted > contacted > qualified；`rejected`(收费的)默认隐藏 |
| 外链联系人字段 | `backlink_opportunities` | 新增 `contact_email` / `contact_name` / `contact_page_url`，卡片可点 mailto，表单可补填 |

**重要教训（附件上传）**：曾用 `@vercel/blob/client` 客户端直传，因**完成回调是服务器间调用、不带登录 cookie**，被顶层 `getAdminSession()` 拦成 401，导致前端永久"上传中"。已改回服务端 `put()`。若日后需要 >4MB，必须把鉴权放进 `onBeforeGenerateToken`，不能放在路由顶层。

---

## 五、外链投稿执行（本会话主要产出）

### 战果
| 状态 | 数量 |
|---|---|
| **已接受·已交稿** | **3** |
| 已联系·等回复 | 17 |
| 待推进（免费池） | 9 |
| 已排除（收费/不可达） | 10 |

**20 家敲门 → 3 家接受，命中率 15%**（行业平均 5–10%）。三家均在发出后 2–4 天内回复。

### 三家已接受的进展
| 媒体 | 编辑 | 状态 | 指向页面 |
|---|---|---|---|
| **Pulp & Paper Canada** | Peter Saunders `psaunders@annexbusinessmedia.com` | 大纲通过 → 正文+4图已交稿 | `/applications/paper-industry` |
| **Manufacturing Chemist** | Dr Kev Robinson `kevinr@hpcimedia.com` | 要稿 → 正文+1图已交稿 | `/products/sodium-metasilicate` |
| **Treatment Plant Operator** | Ted Rulseh `trulseh@tjrcommunications.com` | 大纲通过 → 正文+2图已交稿 | `/applications/water-treatment` |

### 工作原则（务必延续）
1. **只做免费编辑投稿**。付费软文、会员目录、B2B平台一律排除（已排除 10 家，含 CleanLink——其"投稿"实为付费品牌栏目）。
2. **投稿前先验证免费路径**，不要假设。CleanLink 就是靠这一步在动手前拦下的。
3. **每家选题必须不同**（各媒体要求 original & exclusive）。已覆盖：造纸漂白/脱墨、水处理防腐、金属清洗前处理、洗涤助剂、纺织前处理、胶粘剂、陶瓷解胶、供应商审核、储存处理、流动计量。
4. **文章要敢说实话**。三篇成稿都明确写了产品的局限（如"螯合≠去除"、"正磷酸盐在铅控制上记录更充分"、"ISO9001 和平台认证标识证明力有限"）。编辑最认这个，比一味说好话更容易过审。
5. **单链接、可被删**。每篇只在作者简介里放一个链接，并主动告知编辑"可自由删除或改为泛指"。
6. **落款统一**：Lina Tyan / General Manager / **www.silicatechem.com** | info@silicatechem.com | WhatsApp +86 17685880260。

### 分工边界（重要）
- **Claude 做**：选题、查编辑联系方式、写投稿信、写正文、做原创配图、生成 Word、更新台账。
- **必须用户本人做**：注册账号、填收件人、**点发送**、添加附件（浏览器安全限制，代码无法代传本地文件）。
- 实际流程：Claude 在用户本地 Chrome（`padelonesource@gmail.com`）打开预填好的 Gmail 撰写窗口 → 用户检查后点发送 → 告知结果 → Claude 更新台账。

### 产出物位置
- 投稿包与成稿：`seo/backlinks/submissions/01~14*.md`（已提交仓库）
- Word 稿与配图：桌面 `PPC投稿附件/`、`MC投稿附件/`、`TPO投稿附件/`（**未入库**，属临时交付物）
- 台账：Production 数据库 `backlink_opportunities`，后台 `/admin/backlinks` 可视

---

## 六、⚠️ 待处理风险与遗留项

### 1. 独家条款冲突（需要盯）
`Cleaning & Maintenance Management`（美，ISSA 旗下）与 `Cleaning & Maintenance Magazine`（英，Quartz）拿到了**几乎相同的选题**（碱性助剂在清洁配方中的作用），同日发出。两家都要求 original & exclusive。
**若两家都接受**：不可同时交付相同内容。处置方式——对后回复的一家**立刻坦白说明该选题已另有归属，并当场提供替代选题**（如"清洁化学品的采购规格与文件核查"）。宁可当场讲清楚，不可交付重复内容；清洁行业媒体圈子小，编辑互相认识，一次失信两家都会失去。

### 2. Cleanfax 编辑邮箱未记录
台账里 `cleanfax.com` 的 `contact_email` 仍为空。该封已发出，收件人在 Gmail「已发送」里可查，补进台账即可。

### 3. Processing Magazine 邮箱曾为推测
`josborne@endeavorb2b.com` 最初是按同集团 `mcrispin@` 规律推测的。台账现已是该值，**如与实际发送地址不符请更正**。

### 4. 网络不可达的目标
- `ceramicindustry.com`：本机网络完全连不通（HTTP 000，DNS 异常解析到 198.18.x），投稿包已写好（`11-ceramicindustry.md`）但未发。网络恢复后可发。
- `pollutionengineering.com`、`watertodayindia.com`：同样不可达。
- `wwdmag.com`：返回 403（挡爬虫，人工浏览器可能正常）。

### 5. 跟进时间表
| 日期 | 事项 |
|---|---|
| 08-06 | 7-23 那批（Powder&Bulk Solids、Fibre2Fashion、HAPPI）满两周，无回复应发跟进 |
| 08-10 | Pulp & Paper Canada 复查（文章是否排期/刊登） |
| 08-12 | Manufacturing Chemist、TPO 复查 |
| 08-13~14 | 其余各家陆续到期 |

跟进信通常比首封回复率更高，属行业惯例，到期务必发。

### 6. 文章刊登后必做
拿到刊登链接后：在 `/admin/backlinks` 把该条改为 `live`，填入 **来源页 URL、锚文本、rel 属性**，然后在 GA4 追踪该来源带来的会话与询盘（每篇都配了专属 UTM，见各投稿包）。**外链的价值要用询盘验证，不是拿到链接就算成功。**

---

## 七、运营红线（继续遵守）

- Git 只提交明确指定的文件，**禁止 `git add -A`**（本仓库有并行会话在改，尤其重要）。
- 密码/Key/Token 只存 Vercel 环境变量，禁止写入代码、文档、日志或对话。
- 不直接改删 `crm_leads` 业务数据；清除测试数据必须按**确切 lead ID** 且先经人工确认。
- 推 `main` 触发部署；改动前先 `npm run build`。
- `NEXT_PUBLIC_` 变量为构建期注入，改动后必须重新部署。
- 外链只走白帽：不买链接、不参与付费软文、不做目录批量提交。

---

## 八、给下一位接手者的建议

1. **优先深耕已接受的 3 家**，而不是急着敲新的。已交稿的三篇若顺利刊登，就是三条来自权威行业媒体的高质量外链，比再敲 10 家门更有价值。
2. **回复来了就快速响应**。三家都是 2–4 天内回复，编辑在活跃期，拖延会掉温度。
3. **敲门继续，但节奏可放缓**。免费池还有 9 家，加上可再筛选补充。建议每周一批 5 家，而不是集中猛发——避免选题撞车，也留出写正文的时间。
4. **写正文时保持"敢说实话"的调性**。这是三家快速接受的关键原因。
