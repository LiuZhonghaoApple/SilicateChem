# SilicateChem AI 物料员工资产登记基线

## 权威文字资料

- 产品资料：`src/content/products/index.ts`
- 偏硅酸钠产品中心：`src/content/sodium-metasilicate-category.ts`
- 工厂指标：`src/content/trust/factory-proof.ts`
- 信任与出口资料：`src/content/trust.ts`
- AI 采购顾问知识库：`src/lib/ai-advisor/knowledge.ts`
- 下载文件：`public/downloads/documents/`

## 视觉资料

- 图片总清单：`src/content/site-images.manifest.json`
- 已绑定页面和用途：`src/content/trust-image-bindings.json`
- 视觉证据白名单和禁用分类：`src/content/trust-visual-allowlist.ts`
- 工厂和产品图片：`public/images/`
- 早期素材归档：`public/assets/images/`

## 员工使用规则

1. 先从清单读取图片用途，不根据文件名猜测内容。
2. 白名单外图片必须进入 `HUMAN REVIEW`。
3. 被标记为 stock、tourism、festival、group、office、people、certificate 的图片不能作为生产或客户证据。
4. 新上传的真实图片或视频必须记录原始文件、拍摄日期、来源、授权状态和拟使用页面。
5. 视频素材不得提交到 Git；后续接入网站时应使用对象存储和受控发布流程。

## 新素材登记格式

```json
{
  "asset_id": "media-YYYYMMDD-001",
  "type": "image|video|poster|transcript",
  "source_file": "原始文件路径",
  "derived_file": "网页文件路径",
  "category": "production|quality|packing|shipment|visit|illustrative",
  "product": "产品或 grade",
  "icp": "目标 ICP",
  "filmed_at": "YYYY-MM-DD",
  "location": "地点",
  "evidence_status": "verified|user_provided|illustrative|conflict",
  "consent_status": "approved|pending|not_required",
  "target_page": "/目标页面",
  "cta": "目标 CTA",
  "review_status": "draft|human_review|approved|blocked"
}
```

## 新素材登记：silicatechem-factory-assets（2026-07-30）

来源：用户提供的 `silicatechem-factory-assets.zip`（用户上传，company-owned，多张带“众智化工科技 / Zhongzhi Tech”水印）。
拍摄日期与授权状态用户未提供，`filmed_at` 记为 unknown，`consent_status` 记为 user_provided。

> **重要：文件名不可信。** 处理时按图片实际内容归类，发现多处文件名与内容不符（见下方“文件名与内容不符记录”）。

| derived_file（网页路径） | source_file（原始，按实际内容） | category | evidence_status | target_page | review_status |
|---|---|---|---|---|---|
| /assets/images/facility/facility-park-main.webp | A-park-exterior/park-exterior-02-signboard-walkway.jpg | visit（厂区实景） | user_provided | /about | draft |
| /assets/images/facility/facility-storage-tanks.webp | A-park-exterior/park-exterior-03-storage-tanks.jpg | visit | user_provided | /about | draft |
| /assets/images/facility/facility-park-grounds.webp | A-park-exterior/park-exterior-01-entrance-rockery.jpg | visit | user_provided | /about | draft |
| /assets/images/manufacturing/production-mixing-tank.webp | D-showroom-boards/showroom-02-product-intro-panels.jpg（实为搅拌罐设备） | production | user_provided | /about | draft |
| /assets/images/manufacturing/production-drum-mill-01.webp | B-production-equipment/production-03-conical-tanks-overview.jpg（实为卧式回转筒磨机） | production | user_provided | /about | draft |
| /assets/images/manufacturing/production-drum-mill-02.webp | B-production-equipment/production-04-rotary-kiln-angle2.jpg（实为同一磨机另一角度） | production | user_provided | /about | draft |
| /assets/images/manufacturing/production-blending-hoppers.webp | B-production-equipment/production-02-mixer-tank.jpg（锥底料仓+皮带,标注成品仓） | production | user_provided | /about | draft |
| /assets/images/manufacturing/production-finished-silos.webp | B-production-equipment/production-05-conical-tanks-closeup.jpg（两座成品仓） | production | user_provided | /about | draft |
| /assets/images/masterplan/masterplan-rendering-aerial.webp | C-masterplan-renderings/masterplan-01-aerial-with-pool.jpg | illustrative（规划效果图，非实景） | illustrative | /about | draft |
| /assets/images/masterplan/masterplan-rendering-blue-roof.webp | C-masterplan-renderings/masterplan-02-blue-roof-buildings.jpg | illustrative | illustrative | /about | draft |
| /assets/images/export-loading/export-container-loading-forklift.webp | F-export-loading/export-02-container-truck-warehouse.png | shipment（装柜实拍） | user_provided | /export | draft |
| /assets/images/export-loading/export-container-loading-dock.webp | F-export-loading/export-01-forklift-container-loading.png | shipment | user_provided | /export | draft |

### 文件名与内容不符记录（按实际内容归类，未按文件名）

- `B-production-equipment/production-01-rotary-kiln-clean.png` 与 `F-export-loading/export-01-forklift-container-loading.png` **md5 完全相同**（同一张图，内容是仓库内集装箱装柜，非回转窑）→ 仅作为出口装柜图使用，未计入设备图。
- `B-production-equipment/production-06-mill-equipment.jpg` 实为展厅“产品介绍区”文字展板（非磨机设备）→ 归入 D 文字提取，不作设备图上站。
- `D-showroom-boards/showroom-02-product-intro-panels.jpg` 实为“搅拌罐”设备实拍 → 归入生产设备图。
- `production-03`/`production-04` 文件名写“conical-tanks/rotary-kiln”，实为卧式回转筒磨机；`production-02` 文件名写“mixer-tank”，实为锥底料仓+皮带输送。设备图说明按图中可见内容和可见铭牌（搅拌罐 / 成品仓）撰写，未编造容量、温度、型号等参数。

### 未使用 / 待确认

- `E-needs-confirmation/UNCONFIRMED-flame-retardant-line.jpg`：本次不使用，等待用户确认后再处理。
- D 类展板原图（showroom-01 下游应用领域、产品介绍区展板）不上站，仅提取文字（下游应用分类、分子式/性状/相对分子量/熔点/堆积密度）用于 `/applications` 文案补充。
- C 类效果图严格标注为“Industrial Park Master Plan (Rendering) / 产业园规划效果图”，页面加“Master Plan Rendering”角标并注明非已完工实景。

## 新素材登记：全量 92 张 A–K（2026-07-30，第二批）

来源：用户上传 `silicatechemassetspart1(ABCDEFH).zip` + `part2(GIJK).zip`，共 92 张，分类 A–K。A–F 与第一批相同（已登记）。以下为新增 G/H/I/J/K 的上站图；其余为备选/未使用。`filmed_at` unknown，`consent_status` user_provided。

| derived_file（网页路径） | source_file | category | target_page | 备注 |
|---|---|---|---|---|
| /assets/images/warehouse/inventory-main.webp | G/warehouse-27-branded-panoramic-BEST.jpg | packing/现货 | /about | 现货板块主图 |
| /assets/images/warehouse/inventory-jumbo-bags.webp | G/warehouse-03-jumbo-bags-sodium-metasilicate.jpg | packing | /about | 印字 SODIUM METASILICATE / 1000KG / MADE IN CHINA |
| /assets/images/warehouse/inventory-labeled-bags.webp | G/warehouse-08-bag-labels-closeup-un3253.jpg | packing | /about | 印字 UN 3253 / CLASS 8 / PENTAHYDRATE |
| /assets/images/lab/lab-main.webp | H/lab-15-branded-technician-BEST.jpg | quality | /about | 质检板块主图（众智品牌） |
| /assets/images/lab/lab-analyzer.webp | H/lab-10-element-analyzer-technician.jpg | quality | /about | 元素分析仪+留样 |
| /assets/images/raw-materials/raw-pile-main.webp | I/raw-01-bulk-pile-warehouse-wide.jpg | production/原料 | /about | 白色料堆 |
| /assets/images/raw-materials/raw-mixed-colors.webp | I/raw-03-mixed-color-piles.jpg | production/原料 | /about | 颜色不同的两堆料，文案已注明按不同物料处理 |
| /assets/images/packaging/packaging-main.webp | K/packaging-04-branded-robot-palletizing-BEST.jpg | packing | /about | 自动化板块主图 |
| /assets/images/packaging/packaging-bagging.webp | K/packaging-05-workers-bagging-conveyor.jpg | packing | /about | 人工装袋线 |
| /assets/images/packaging/packaging-robot.webp | K/packaging-02-nachi-robot-arm.jpg | packing | /about | NACHI 机械臂 |
| /assets/images/products-real/sample-powder.webp | J/product-01-powder-hero-shot.jpg | product | /products | 粉料样品 |
| /assets/images/products-real/sample-grade-comparison.webp | J/product-04-grade-comparison-4bowls.jpg | product | /products | 4 碗对比（0水粒/0水粉/五水粒/五水粉） |
| /assets/images/products-real/sample-anhydrous-compare.webp | J/product-05-anhydrous-granule-vs-powder.jpg | product | /products | 0水粒 vs 0水粉 |
| /assets/images/products-real/sample-pentahydrate-compare.webp | J/product-14-pentahydrate-granule-vs-powder.jpg | product | /products | 五水粒 vs 五水粉 |

### 第二批发现与红线处理

- **H/lab-06-retained-samples-archive.jpg 留样标签印“青岛嘉润化工有限公司”**（与“众智化工科技”不同的公司名）→ **未使用**，需用户确认该留样归属，避免误标为众智自有。
- G/H/I/J/K 均逐张核对内容；BEST 主图（G-27、H-15、K-04）已核对确为对应品牌实景。
- I 类 raw-03 两堆料颜色明显不同 → 文案明确“按不同物料分开存放”，未默认同一物料。
- J 规格英文命名（Anhydrous Granular/Powder、Pentahydrate Granular/Powder）**待用户二次确认**，页面仅用中文样品标注（0水粒/0水粉/五水粒/五水粉）+ 待定说明，未把英文当定稿。
- **E-needs-confirmation（5 张，含固体阻燃产线/粘胶纤维/机械臂/工人装袋）全部未使用**，等待用户确认是否属同一工厂/同一偏硅酸钠产线。
- 品牌水印：多张图带“众智化工科技 / Zhongzhi Tech”水印（保留原图，未改图内容）。是否统一/去除水印待用户确认。

## 用户确认后的处理（2026-07-30，第三批）

用户逐项确认，已按下述执行：

1. **规格英文命名已定稿** → 0水粒/0水粉/五水粒/五水粉 = Anhydrous Granular / Anhydrous Powder / Pentahydrate Granular / Pentahydrate Powder；`/products` 规格对比模块已用英文定稿（中文作副标注保留）。
2. **他司标签留样图不使用** → `H/lab-06`（青岛嘉润标签）确认不用，从未进入 `public/`，无需删除；登记标记为 blocked。
3. **统一去除水印** → 对带“众智化工科技”角标的 6 张实景（facility 3 张 + inventory-main + lab-main + packaging-main）用 cv2 inpaint / 逐行插值 / 邻域补丁去除水印，仅处理水印区域，未改动其余画面内容；已覆盖 `public/` 对应文件。
4. **统一工厂、统一产线** → 用户确认为同一工厂同一产线，各板块跨页引用一致。
5. **独立路由** → 新建 `/manufacturing`（工艺流程页）：B 设备内容从 `/about` 迁入，含 Process Overview + 设备图；已接入导航 `NAV_LINKS`、`sitemap` INDEXABLE_STATIC、`content-freshness` 登记；`/about` 保留跳转入口。
6. **画廊补充** → 新增 3 张：`warehouse-18`（叉车/缠膜区）、`warehouse-22`（仓库全景规模）入现货板块；`lab-01`（滴定台+马弗炉）入质检板块。

> 注：`E-needs-confirmation` 用户确认为同一工厂同一产线“可以使用”，但本批未新增使用 E 图（E 内容偏固体阻燃产线，与当前偏硅酸钠页面主题关联度低）。如需将 E 用于特定板块，请指明目标页面与用途。

## P0 证据链 + 结构化数据（2026-07-30）

目标：把已上站图片转成“可核验证据”，提升买家信任与 SEO/GEO 可信度。

- **ImageObject 结构化数据**：新增 `ImageEvidenceSchema`（`components/seo/JsonLd.tsx`），为 `/about`、`/manufacturing`、`/export`、`/products` 的真实图输出 `ImageObject`（contentUrl + caption + `creditText`/`copyrightHolder`/`author` = 众智）。**去水印后用元数据补回图片归属**，且把可核验事实写进 caption（GEO 读文字不读像素）。
- **Organization schema 增强**：加 `image[]`（厂区/现货/实验室/包装实景）、`foundingDate=2011`、`addressLocality=Changyi`、`hasCredential`（ISO 9001 / ISO 14001 / REACH，链到 `downloads/documents` 真实 PDF）。
- **Product schema**：`image` 支持数组（string | string[]），为后续按 grade 挂多图预留。
- **可见证据链**：`/about` 现货板块加“UN 3253 / Class 8 / PG III / Made in China”声明 + 链 MSDS/COA 与 export 页；质检板块加 ISO 证书 + 批次 COA/TDS 链接。
- 验证：`npm run build`（48 页）通过，ESLint 无警告，已在构建产物中确认 ImageObject/Organization JSON-LD 正确输出。

### P0 之后可继续（待用户排期）
- P1：image sitemap（`sitemap.ts` 每页 `images[]`）、每页真实 OG 图、FAQ/QAPage schema、实体一致性统一。
- P2：启用 `/factory` 或建“Evidence”聚合页；收敛 PENDING 的 trust-image 系统。
