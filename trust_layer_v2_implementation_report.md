# Trust Layer V2 Implementation Report

**Date:** 2026-06-21  
**Scope:** SilicateChem Next.js website — Trust Layer V2  
**Rule compliance:** No invented ISO certs, COA data, export countries, or legal entity changes. Data sourced from KB, EMA, and existing assets only.

---

## 1. Components Created

| Component | Path | Purpose |
|-----------|------|---------|
| `TechnicalDocsBlock` | `src/components/trust/TechnicalDocsBlock.tsx` | COA/TDS/SDS on-request cards + Request Document CTA → `/contact?type=tds` |
| `ExportProofMap` | `src/components/trust/ExportProofMap.tsx` | Static map highlighting 8 customs-verified countries |
| `ExportShipmentEvidence` | `src/components/trust/ExportShipmentEvidence.tsx` | Shipment stats from partial customs records |
| `ExportPackagingProof` | `src/components/trust/ExportPackagingProof.tsx` | Verified 25 kg / bulk packaging + export photos |
| `ExportLogisticsCapability` | `src/components/trust/ExportLogisticsCapability.tsx` | Qingdao, BL, HS, CY/CY signals + loading photos |
| `FactoryProofStack` | `src/components/trust/FactoryProofStack.tsx` | 100,000 MT, 438 equipment, 83 employees, area photos |
| `ProductProofPanel` | `src/components/trust/ProductProofPanel.tsx` | Spec disclaimer, verified packaging, applications, badge, RFQ |
| `TrustStack` | `src/components/trust/TrustStack.tsx` | 4-layer global trust stack (Factory / Export / Product / Compliance) |
| `HomeProductTrustCards` | `src/components/trust/HomeTrustSection.tsx` | Homepage product trust cards |
| `HomeTrustRfqBlock` | `src/components/trust/HomeTrustSection.tsx` | Homepage RFQ CTA block |
| `CertificatePlaceholder` | `src/components/trust/CertificatePlaceholder.tsx` | Placeholder blocks for missing certificate scans |
| `RFQTrustPreflight` | `src/components/forms/RFQTrustPreflight.tsx` | Pre-submit trust checklist on inquiry form |
| `RFQForm` | `src/components/forms/RFQForm.tsx` | Re-export alias for `InquiryForm` |

---

## 2. Content Modules Created

| Module | Path |
|--------|------|
| Technical docs config | `src/content/trust/technical-docs.ts` |
| Export countries & stats | `src/content/trust/export-countries.ts` |
| Factory proof metrics | `src/content/trust/factory-proof.ts` |
| Certifications data | `src/content/trust/certifications.ts` |
| Product trust helpers | `src/content/trust/product-trust.ts` |

---

## 3. Pages Modified

| Page | Changes |
|------|---------|
| `/` (Homepage) | Replaced `FactoryTrustSystem` “Why Zhongzhi” block with FactoryProofStack, ExportProofMap preview, Product Trust Cards, TrustStack, RFQ block |
| `/export` | Restructured: Hero → Map → Shipment Evidence → Packaging → Logistics → Technical Docs + TrustStack → RFQ CTA |
| `/factory` | Added `FactoryProofStack` + `TrustStack` above existing trust gallery |
| `/products/[slug]` | Injected `ProductProofPanel`, `TechnicalDocsBlock`, `TrustStack` |
| `/products/sodium-metasilicate` | Via `MetasilicateCategoryPage`: `TechnicalDocsBlock`, `TrustStack` |
| `/certifications` | **New page** — Industry Honors, Association, Technical Certifications placeholder, R&D Recognition |

---

## 4. Other Files Modified

| File | Change |
|------|--------|
| `src/components/forms/InquiryForm.tsx` | Added `RFQTrustPreflight` before submit button |
| `src/lib/constants.ts` | Added `/certifications` to `NAV_LINKS` |
| `src/app/sitemap.ts` | Added `/certifications` to indexable routes |

---

## 5. Trust Systems Injected

| System | Injection Points |
|--------|------------------|
| COA/TDS/SDS | All product slug pages, sodium metasilicate category page, export page |
| Export map (8 countries) | Export page (full), Homepage (preview) |
| Factory proof stack | Factory page, Homepage |
| Product proof panel | All product slug pages |
| Trust stack (4 layers) | Homepage, Factory, Export, all product slug pages, category page, Certifications |
| RFQ pre-flight | All forms using `InquiryForm` / `InquiryFormWrapper` |

---

## 6. Verified Data Used

| Claim | Source |
|-------|--------|
| 100,000 MT capacity | INV/KB (`company_knowledge_base_v1.md`) |
| 438 equipment sets | INV/KB |
| 83 employees | QCC 2025 (KB) |
| 8 export countries | `export_marketing_assets.md` customs data |
| 25 kg bag / bulk loads | EMA packaging evidence |
| COA/TDS/SDS on request | KB gap note — status `available_on_request`, not invented files |
| Industry honors list | KB §08 Quality & Certifications |
| CAS 6834-92-0, 10213-79-3 | Verified in customs trade descriptions |

---

## 7. Missing Assets List

| Asset | Status | Placeholder Used |
|-------|--------|------------------|
| Certificate scans (12+ honor images on tec.asp) | 0 in `site-images.manifest.json` | `CertificatePlaceholder` on `/certifications` |
| ISO 9001 / 14001 / QMS files | Not in any verified source | Amber warning block + placeholder |
| COA/TDS/SDS downloadable PDFs | Not in repo | On-request CTA only |
| Lab / QC photography | Not in asset pack | Factory line images used as production proxy |
| High-res honor certificate gallery | Pending export from lgwjg | Per-honor placeholder blocks |

---

## 8. Risk Notes

1. **Product specifications** — All spec tables show “Typical industry specification (for reference only)” disclaimer; KB confirms no official published specs in source materials.
2. **Export reach** — Map and stats use partial customs disclaimer on every block; no implied total export volume.
3. **“Response within 12 hours”** — Included in RFQ pre-flight per task spec; not independently verified in KB (sales SLA — confirm internally).
4. **Legacy export capability text** — `factory-trust.ts` `exportCapability` section still references corporate-stated regions (Asia, Middle East, etc.) on factory page; V2 export map uses customs-only 8 countries. Consider aligning legacy copy in a future pass.
5. **Longgang name** — Not added in V2 components; Zhongzhi used throughout per naming rules.
6. **Build verification** — `npm run build` could not be executed in this environment (Node/npm unavailable). Recommend local build before deploy.

---

## 9. RFQ Impact Expectation

| Factor | Expected Effect |
|--------|-----------------|
| Pre-flight trust checklist | Reduces perceived risk before form submit; aligns expectations on docs and response time |
| Product spec disclaimer | Sets honest expectation — may reduce unqualified RFQs expecting published COA |
| Export map with disclaimer | Strengthens export credibility for buyers in 8 documented countries |
| Technical docs CTA | Routes document requests to `type=tds` inquiry flow |
| Certifications page | Supports due-diligence path; placeholders may limit conversion until scans added |
| Homepage trust rebuild | Surfaces factory + export + product proof earlier in funnel |

**Net expectation:** Improved trust signal density for qualified B2B buyers; modest increase in RFQ quality; certificate image gaps remain a conversion blocker until P0 assets are added.

---

## 10. Success Criteria Checklist

- [x] Product pages contain trust proof block (`ProductProofPanel` + `TechnicalDocsBlock` + `TrustStack`)
- [x] Export page contains map + shipment evidence
- [x] Factory page contains structured proof stack
- [x] RFQ form contains trust pre-flight layer
- [x] No fake ISO certs, COA data, or invented export countries
- [x] `/certifications` page created and linked in navigation
- [x] Homepage “Why Zhongzhi” rebuilt per spec
