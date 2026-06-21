# System Validation Snapshot (V1)

**Project:** SilicateChem  
**Date:** 2026-06-21  
**Scope:** Conversion funnel architecture — RFQ intent, trust injection, RFQ bridge, funnel optimization  
**Document type:** Architecture validation (read-only audit)

---

## 1. Data Flow Chain

```
User Context (pageType, trust views, scroll, product)
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ RFQ Intent Score                                              │
│ calculateRfqIntentScore()                                     │
│ → src/lib/rfq/rfq-intent-score.ts                             │
│ Output: { score: 0–100, level: low | medium | high }         │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ Auto RFQ Trigger                                              │
│ useAutoRFQTrigger()                                           │
│ → src/hooks/useAutoRFQTrigger.ts                              │
│ Input: score, pageType, product?                            │
│ Output: { showRFQBanner, mode?: high-intent | soft-intent }   │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ Trust Layer                                                   │
│ TrustLayer.tsx → src/components/trust/TrustLayer.tsx          │
│                                                               │
│ Injects (layout wrapper only):                                │
│   • ExportProofMap      → src/components/trust/ExportProofMap│
│   • ProductProofPanel   → src/components/trust/ProductProofPa│
│   • TechnicalDocsBlock  → src/components/trust/TechnicalDocsB│
│                                                               │
│ Data binding:                                                 │
│   • ExportProofMap ← src/content/trust/export-countries.ts    │
│   • ProductProofPanel ← src/content/trust/product-trust.ts    │
│   • TechnicalDocsBlock ← src/content/trust/technical-docs.ts  │
│                                                               │
│ Live pages: / (homepage), /products/[slug]                    │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ RFQ Bridge                                                    │
│ RFQTrustBridge.tsx → src/components/rfq/RFQTrustBridge.tsx    │
│                                                               │
│ Routes (query prefill only):                                  │
│   • Request Technical Document → /contact?type=coa|tds|sds    │
│   • Request Quote (RFQ)        → /contact?type=quote          │
│   • Get Export Documentation   → /contact?type=export         │
│   • Optional product param     → &product={encoded name}      │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ Funnel Engine                                                 │
│ calculateFunnelState()                                        │
│ → src/lib/funnel/funnel-optimizer.ts                          │
│ Types → src/types/funnel.ts                                   │
│ Input: rfqScore, rfqLevel, trustSignals, pageType,            │
│        hasProductView                                         │
│ Output: funnelStage, rfqIntent, recommendedAction,            │
│         bannerPriority                                        │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│ FINAL OUTPUT — UI Decision Layer (logical mapping)            │
│                                                               │
│ recommendedAction → UI flag                                   │
│   show_trust      → showTrust                                 │
│   show_quote_cta  → showQuoteCTA                              │
│   show_rfq        → showRFQ                                   │
│                                                               │
│ bannerPriority → banner intensity                             │
│   none → no auto banner                                       │
│   low  → soft-intent banner (useAutoRFQTrigger)               │
│   high → high-intent banner (useAutoRFQTrigger)               │
└───────────────────────────────────────────────────────────────┘
```

### Live integration map (V1)

| Link | Status |
|------|--------|
| `calculateRfqIntentScore` → `TrustLayer.tsx` | **Connected** |
| `useAutoRFQTrigger` → `TrustLayer.tsx` | **Connected** |
| `TrustLayer` → trust child components | **Connected** |
| `TrustLayer` → `RFQTrustBridge` | **Connected** |
| `RFQTrustBridge` → `/contact?type=` | **Connected** |
| `export-countries.ts` → `ExportProofMap` | **Connected** |
| `calculateFunnelState` → UI components | **Module ready** (pure logic; consumer wiring optional in V2) |

---

## 2. System Status Table

| Module | Path | Status |
|--------|------|--------|
| RFQ Intent Engine | `src/lib/rfq/rfq-intent-score.ts` | **DONE** |
| Trust Layer Injection | `src/components/trust/TrustLayer.tsx` | **DONE** |
| Export Proof Map Binding | `src/content/trust/export-countries.ts` → `ExportProofMap.tsx` | **DONE** |
| RFQ Bridge | `src/components/rfq/RFQTrustBridge.tsx` | **DONE** |
| Funnel Optimization Layer | `src/lib/funnel/funnel-optimizer.ts` + `src/types/funnel.ts` | **DONE** |
| Auto RFQ Trigger | `src/hooks/useAutoRFQTrigger.ts` | **DONE** |

### Supporting trust modules (verified)

| Module | Path | Status |
|--------|------|--------|
| Technical Docs Trust | `src/content/trust/technical-docs.ts` + `TechnicalDocsBlock.tsx` | **DONE** |
| Product Trust Panel | `src/content/trust/product-trust.ts` + `ProductProofPanel.tsx` | **DONE** |
| Factory Proof (parallel) | `src/content/trust/factory-proof.ts` + `FactoryProofStack.tsx` | **DONE** |

---

## 3. Business Logic Confirmation

| Constraint | Confirmed |
|------------|-----------|
| No backend changes introduced by funnel/trust V1 layers | **Yes** |
| No email system added or modified by scoring/trust modules | **Yes** |
| No RFQ form logic modified (`InquiryForm.tsx` unchanged by funnel modules) | **Yes** |
| No external map/API dependencies in export trust UI | **Yes** |
| Export countries limited to 8 verified customs destinations | **Yes** |
| Product specs in trust panel use KB-only fields; no invented COA values | **Yes** |

Existing site backend (`/api/inquiry`, Resend, Turnstile) predates this validation snapshot and is **out of scope** for V1 funnel modules.

---

## 4. Final Output Model

### User behavior → system response

| Intent tier | RFQ score | Funnel stage | RFQ heat | System response |
|-------------|-----------|--------------|----------|-----------------|
| **LOW** | 0–39 | `awareness` | `none` | **Trust content** — emphasize `showTrust` (ExportProofMap, ProductProofPanel, TechnicalDocsBlock) |
| **MID** | 40–69 | `consideration` | `warm` | **Quote CTA** — `showQuoteCTA` + soft-intent auto banner (`useAutoRFQTrigger`: `soft-intent`) |
| **HIGH** | 70–100 | `conversion` | `hot` | **RFQ conversion** — `showRFQ` + high-intent auto banner + `RFQTrustBridge` CTAs |

### Decision mapping (`calculateFunnelState`)

| `recommendedAction` | UI flag | User-facing outcome |
|---------------------|---------|---------------------|
| `show_trust` | `showTrust` | Render / prioritize trust proof blocks |
| `show_quote_cta` | `showQuoteCTA` | Surface quote CTAs and soft RFQ banner |
| `show_rfq` | `showRFQ` | Surface RFQ bridge and high-intent banner |

### Score composition reference (`calculateRfqIntentScore`)

- Base: homepage 20 · product 50 · export 40 · about 25  
- Trust blocks viewed: export +20 · product +25 · docs +15  
- Scroll: + `scrollDepth / 5` (capped at 100)

---

## 5. Guarantee Section

This V1 conversion stack guarantees:

1. **UI-only logic layers** — All modules listed in §2 are presentation wrappers, pure functions, or client-side hooks. They do not send email, persist user data, or alter server routes.

2. **Deterministic scoring** — `calculateRfqIntentScore` and `calculateFunnelState` are pure functions with fixed inputs → fixed outputs. No randomness, no ML, no external scoring APIs.

3. **Client-side RFQ triggers** — `useAutoRFQTrigger` returns UI state flags only (`showRFQBanner`, `mode`). It does not submit forms or call `/api/inquiry`.

4. **No data leakage across modules** — Each module owns its scope:
   - Intent score: `src/lib/rfq/`
   - Funnel state: `src/lib/funnel/` + `src/types/funnel.ts`
   - Trust content: `src/content/trust/`
   - Trust UI: `src/components/trust/`
   - RFQ bridge: `src/components/rfq/`
   - Hooks: `src/hooks/`

   Modules communicate via typed inputs/outputs only. No shared mutable global state.

5. **RFQ routing is query-prefill only** — `RFQTrustBridge` links to `/contact` with `type` and optional `product` params. Existing contact form reads query params; bridge does not bypass or replace form validation.

6. **Export data integrity** — `ExportProofMap` renders constants from `export-countries.ts` only. No additional countries or shipment figures are generated at render time.

---

## Validation verdict (V1)

| Criterion | Result |
|-----------|--------|
| Architecture chain documented | **Pass** |
| All V1 modules present | **Pass** |
| Trust → RFQ bridge wired on live pages | **Pass** |
| Funnel optimizer implemented (pure logic) | **Pass** |
| Backend / form isolation confirmed | **Pass** |

**Snapshot status:** **VALIDATED (V1)** — conversion logic layers are structurally complete and correctly connected for homepage and product trust injection paths.

---

*End of system-validation-v1.md*
