# 跟进信 — 2026-08-01 判定与草稿

**结论：今天只发 2 封。** 不是 19 封。理由见下。
**草稿状态：未发送。** 发送需人工确认，我不代发。

---

## 一、为什么只有 2 封

跟进的行业惯例是**首封投递后 7–10 天**。早于这个区间跟进，编辑的感受是被催，直接降低录用率——投出去的 20 封信是资产，催坏了就没有第二次机会。

按实际发信日期分组（今天 2026-08-01）：

| 批次 | 发信日 | 距今 | 家数 | 今天该跟进？ |
|---|---|---|---|---|
| A | 07-23 | **9 天** | 3 | ✅ 是（其中 1 家除外，见下） |
| B | 07-30 | 2 天 | 4 | ❌ 太早 |
| C | 07-31 | 1 天 | 2 | ❌ 太早 |
| D | 08-01 | **今天** | 10 | ❌ 绝对不行 |

A 批 3 家里，**Fibre2Fashion 单独排除**：其投稿页明写"回复周期 1–8 周，且仅在录用时回复"。9 天跟进违反人家公示的流程，会显得没读规则。**改为 09-17 之后再跟进**（满 8 周）。

→ **今天实发：Powder & Bulk Solids、HAPPI，共 2 封。**

---

## 二、后续跟进排期（按"发信 +10 天"推算）

| 日期 | 该跟进的对象 |
|---|---|
| **2026-08-09** | Chemical Processing、Processing Magazine、ISSA (Jeff Cross)、Chemical Engineering |
| **2026-08-10** | WaterWorld、Products Finishing |
| **2026-08-11** | Paper Advance、Water Treatment Magazine、CMM、Water Online、Cleaning & Maintenance Magazine、Textile World、Manufacturing Chemist、Cleanfax、TPO、Adhesives & Sealants |
| **2026-09-17** | Fibre2Fashion（满 8 周后） |

> 后台 `next_review_at` 目前多为 08-13/08-14，比上表晚 2–3 天。**不必改**——晚几天跟进没有坏处，早了才有。上表是"最早可发"，后台日期是"最晚别忘"。

**第二封跟进（如首封仍无回应）**：再等 14 天，且**只发一次**。两封不回就归档为 `lost`，不要发第三封。

---

## 三、草稿 1 — Powder & Bulk Solids

**收件人：** kristen.kazarian@informa.com（Kristen Kazarian, Editor-in-Chief）
**抄送：** nicole.schlosser@informa.com
**发送方式：** **在原邮件线程里回复**（让她一眼看到原提案，不用翻邮箱）
**主题：** Re: Contributed technical article idea — handling, flow & dust control of granular alkaline silicates

```
Dear Ms. Kazarian,

Following up briefly on the article idea I sent on 23 July — no urgency, I know
inboxes fill up.

To make it easier to judge, I can send a one-page outline plus the two items
your dry-bulk readers usually ask us for: measured caking behaviour of granular
sodium metasilicate across storage humidity ranges, and the container-loading
trade-offs we see between 25 kg bags and FIBCs. Both come from our own plant and
shipping records, presented vendor-neutrally.

If the topic isn't a fit for your calendar, that's completely fine — I'd just
appreciate a pointer to whoever handles contributed technical content, or a note
to stop following up.

Best regards,
Lina Tyan
General Manager, Shandong Zhongzhi Chemical Technology Co., Ltd.
info@silicatechem.com · WhatsApp +86 17685880260
```

**为什么这样写**：不重复原提案内容（她能往下翻）；给出**新的具体东西**（结块数据 + 装柜对比），把"要不要理这个人"变成"要不要看这份材料"；明确给台阶下。

---

## 四、草稿 2 — HAPPI

**收件人：** tbranna@rodmanmedia.com（Tom Branna, Editor）
**抄送：** mmeisel@rodmanmedia.com
**发送方式：** 原线程回复
**主题：** Re: Contributed article idea — a buyer's technical checklist for sodium metasilicate in detergents

```
Dear Mr. Branna,

A short follow-up on the checklist article I proposed on 23 July.

Since writing, one angle has come up repeatedly with formulators we supply: how
to read a metasilicate COA when switching suppliers — which parameters actually
predict performance in a built powder formulation, and which ones look important
but aren't. It is a narrow, practical piece and stays vendor-neutral; the point
is what to check, not who to buy from.

Happy to send an outline if that's more useful than the original pitch, or to
drop it entirely if contributed technical content isn't something HAPPI is
taking right now. Either answer is genuinely helpful.

Best regards,
Lina Tyan
General Manager, Shandong Zhongzhi Chemical Technology Co., Ltd.
info@silicatechem.com · WhatsApp +86 17685880260
```

**为什么这样写**：提供了一个**比原提案更窄、更实用**的替代选题（怎么读 COA），降低编辑的决策成本；同样给了明确的退出选项。

---

## 五、发送前检查

- [ ] 用 `padelonesource@gmail.com` 发（与首封同一发件箱，否则不在同一线程）
- [ ] **在原邮件上点"回复"**，不要新开一封
- [ ] 两封信里的技术说法（结块数据、COA 参数）**必须运营确认属实**再发——投稿包里定的规矩：不编数值
- [ ] 发出后在 `/admin/backlinks` 对应记录的 notes 里追加一行："Follow-up #1 sent 2026-08-01."
- [ ] Fibre2Fashion 不发，在 notes 里记："Follow-up deferred to 2026-09-17 per publication's stated 1–8 week response policy."

---

## 六、一个提醒

20 封信换 1 家接受（Pulp & Paper Canada），**5% 的编辑投稿录用率并不低**——行业里冷投的正常水平就在 1–5%。所以现在的问题不是方法不对，是**样本还太小、时间还太短**。B/C/D 三批信发出还不到 48 小时，绝大多数编辑连看都还没看到。

真正该做的是保护好这 20 条线索、按上面的节奏跟进，而不是因为"慢"就去加大投递量——同一个人短时间内向大量媒体群发同类提案，编辑圈子是互通的，反而会伤害信誉。
