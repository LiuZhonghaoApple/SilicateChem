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
