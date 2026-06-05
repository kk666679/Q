# Enterprise Architecture Analysis — MyQMS Platform
**Version:** 0.2.0 → Target: 1.0.0-enterprise  
**Date:** 2026-05-28  
**Analyst:** Senior Enterprise Architect / ISO Lead Auditor / AI Systems Engineer

---

## EXECUTIVE SUMMARY

The MyQMS platform is a **well-structured, feature-rich foundation** for an Enterprise AI-Powered IMS/QMS platform. The core architecture (Next.js App Router, tRPC, Prisma, multi-agent SDK) is sound. However, **20 critical gaps** prevent it from operating as a fully integrated enterprise system. This document maps every gap, provides an integration map, and defines the remediation roadmap.

**Current Maturity:** Level 2 (Managed) — Documented, partially integrated  
**Target Maturity:** Level 4 (Quantitatively Managed) — Measured, automated, AI-governed

---

## SECTION 1 — SYSTEM ARCHITECTURE VALIDATION

### ✅ What Is Working

| Layer | Status | Evidence |
|-------|--------|----------|
| Next.js App Router | ✅ Operational | `app/` routes wired, layout correct |
| tRPC type-safe APIs | ✅ Operational | 14 routers registered in `appRouter` |
| Zod validation | ✅ Operational | All inputs validated via `schemas.ts` |
| Rate limiting middleware | ✅ Operational | `trpc.ts` — 60 req/min per userId |
| ISO service engines | ✅ Operational | audit, risk, climate, CAPA, compliance-scoring |
| Agent registry | ✅ Operational | `AgentRegistry` + singleton |
| Orchestrator RAG | ✅ Operational | `AgentOrchestrator.ragQuery()` |
| Manufacturing module | ✅ Operational | OEE, SPC, predictive maintenance, digital twin |
| Climate risk engine | ✅ Operational | ISO 14001 AMD.1:2024 aligned |
| Risk matrix (5×5) | ✅ Operational | Full inherent/residual calculation |
| UI component library | ✅ Operational | Radix UI + Tailwind + 80+ components |
| Dashboard widgets | ✅ Operational | AI-enhanced charts, insights, KPIs |
| Sidebar navigation | ✅ Operational | Full multi-module navigation |
| Malaysian Standards | ✅ Operational | `ms-router.ts` + knowledge base |

### ❌ Critical Gaps Identified

| # | Gap | Impact | Priority |
|---|-----|--------|----------|
| 1 | **Prisma schema missing 15 core enterprise entities** | No DB persistence for CAPA, Risk, Training, Supplier, KPI, etc. | CRITICAL |
| 2 | **Agent registry never populated** — agents registered nowhere in the app | All AI agent calls return empty | CRITICAL |
| 3 | **Event bus exists but is not connected to tRPC mutations** | No automated cross-module triggers | HIGH |
| 4 | **No RBAC/ABAC implementation** — all procedures are `publicProcedure` | Zero authorization enforcement | CRITICAL |
| 5 | **No audit trail on mutations** — tool executions logged, mutations not | ISO 27001 non-compliant | HIGH |
| 6 | **Dashboard uses 100% mock data** — no live tRPC queries for KPIs | Dashboard is decorative, not functional | HIGH |
| 7 | **No KPI calculation engine** — no auto-calc of compliance rate, CAPA closure rate, etc. | Section 14 requirement unmet | HIGH |
| 8 | **CAPA workflow is standalone** — not connected to Audit findings or Risk register | No traceability chain | HIGH |
| 9 | **Document model lacks version history** — one record, no `DocumentVersion` table | ISO document control non-compliant | HIGH |
| 10 | **Workflow engine exists but has no event subscriptions** | No event-driven automation firing | MEDIUM |
| 11 | **No Notification model or router** — events fire but nothing delivers them | Users never notified | MEDIUM |
| 12 | **Training/Competency module has no backend** — UI only, no router | Section 9 unmet | MEDIUM |
| 13 | **Supplier module has no backend** — portals UI only | Section 10 unmet | MEDIUM |
| 14 | **Management Review has no router** — ISO 9.3 requirement | Section 9.3 unmet | MEDIUM |
| 15 | **No health check / telemetry endpoint** | Operations/DevOps blind | MEDIUM |
| 16 | **Two competing `next.config` files** (`next.config.mjs` + `next.config.ts`) | Build ambiguity | LOW |
| 17 | **Two `trpc` client references** (`lib/sdk/trpc.ts` vs `lib/trpc-client.ts`) | Potential hydration issues | LOW |
| 18 | **Agent type enum missing ISO agent roles** (iso9001, iso14001, etc. not in AgentSchema) | Agent routing broken for ISO agents | HIGH |
| 19 | **No cross-agent collaboration protocol** — orchestrator routes to all agents serially | No specialised routing/consensus | MEDIUM |
| 20 | **No tenant isolation** — tenantId hardcoded as 'default' | Not multi-tenant ready | MEDIUM |

---

## SECTION 2 — ENTERPRISE DATA MODEL GAP ANALYSIS

### Current Schema Entities (12)
`Agent`, `Message`, `Document`, `Process`, `ComplianceCheck`, `Audit`, `ManufacturingMetrics`, `TestCase`, `Project`, `Claim`, `VectorDocument`, `ToolExecution`, `ChatSession`

### Missing Enterprise Entities (15 required)

```
Risk             — risk register with inherent/residual scores
CAPA             — corrective/preventive action with timeline
AuditFinding     — finding linked to Audit + CAPA
DocumentVersion  — version history for Document
Training         — training record linked to User + Competency
Competency       — competency matrix entry
Supplier         — supplier master with evaluation data
SupplierAudit    — audit linked to Supplier
KPI              — KPI definition + calculated value
Objective        — quality/environmental/safety objective
ManagementReview — management review record
Notification     — notification queue
AuditTrail       — immutable action log (ISO 27001)
WorkflowState    — durable workflow execution state
Organization     — multi-tenant root entity
```

---

## SECTION 3 — INTEGRATION MAP

```
User Action
    │
    ▼
tRPC Mutation (validated, rate-limited)
    │
    ├─► DB Write (Prisma)
    │       │
    │       └─► AuditTrail entry (every write)
    │
    ├─► Event Bus publish (EventBus.emit)
    │       │
    │       ├─► Notification service → User
    │       ├─► Dashboard KPI recalculation
    │       ├─► Workflow state machine trigger
    │       └─► Agent orchestrator (AI action)
    │               │
    │               ├─► ISO 9001 Agent
    │               ├─► Risk Agent
    │               ├─► CAPA Agent
    │               └─► Compliance Agent
    │
    └─► Response → React Query cache invalidation
```

### Key Integration Chains

**Chain 1: Audit → Finding → CAPA → Risk → Dashboard**
```
audit.create → AuditFinding.create → capa.create → risk.update → kpi.recalculate → dashboard.invalidate
```

**Chain 2: Document Approved → Compliance → Agent Review**
```
document.approve → compliance.check → iso9001Agent.review → notification.send → management.review
```

**Chain 3: KPI Threshold Breach → Escalation**
```
kpi.calculate → threshold.check → escalation.trigger → notification.send → management.alert
```

---

## SECTION 4 — AGENT ARCHITECTURE GAP ANALYSIS

### Problem
`AgentRegistry` is defined and exported as a singleton, but **no agent definitions are ever registered**. The `agentRouter.list` procedure returns `[]`. All agent capability routing is broken.

### Required Agent Registrations (14 agents)

| Agent ID | Role | Missing From Registry |
|----------|------|-----------------------|
| `iso9001-agent` | ISO 9001 QMS | ❌ Not registered |
| `iso14001-agent` | ISO 14001 EMS | ❌ Not registered |
| `iso45001-agent` | ISO 45001 OH&S | ❌ Not registered |
| `iso17025-agent` | ISO 17025 Testing | ❌ Not registered |
| `iso27001-agent` | ISO 27001 Security | ❌ Not registered |
| `quality-manager` | Quality Manager | ❌ Not registered |
| `qa-expert` | QA Expert | ❌ Not registered |
| `manufacturing-expert` | Manufacturing | ❌ Not registered |
| `construction-expert` | Construction | ❌ Not registered |
| `insurance-expert` | Insurance | ❌ Not registered |
| `documentation-manager` | Document Control | ❌ Not registered |
| `risk-manager` | Risk Management | ❌ Not registered |
| `audit-manager` | Audit Management | ❌ Not registered |
| `ims-integrator` | IMS Orchestrator | ❌ Not registered |

---

## SECTION 5 — REMEDIATION ROADMAP

### Phase 1 — Foundation (Immediate)
1. Extend Prisma schema with 15 missing entities
2. Populate agent registry with all 14 agents
3. Implement protected procedures (RBAC middleware)
4. Wire audit trail to all mutations

### Phase 2 — Integration (Short-term)
5. Connect event bus to tRPC mutations
6. Implement KPI calculation engine
7. Build live dashboard queries
8. Wire CAPA ↔ Audit ↔ Risk traceability

### Phase 3 — Automation (Medium-term)
9. Event-driven agent triggers
10. Notification delivery system
11. Training/Competency router
12. Supplier quality router
13. Management Review router

### Phase 4 — Enterprise (Long-term)
14. Multi-tenant isolation
15. Electronic signatures
16. Full-text search
17. Advanced analytics / forecasting
18. Mobile audit app API
19. CI/CD pipeline
20. Observability stack

---

## SECTION 6 — SECURITY ARCHITECTURE ASSESSMENT

| Control | Status | Gap |
|---------|--------|-----|
| Rate limiting | ✅ Implemented | Per userId, 60/min |
| Input validation | ✅ Implemented | All procedures via Zod |
| Authentication | ❌ Missing | `publicProcedure` only, no auth check |
| Authorization (RBAC) | ❌ Missing | No role-based procedure guards |
| Audit logging | ⚠️ Partial | Tool executions only, not mutations |
| Data encryption | ❌ Not configured | No field-level encryption |
| Secret management | ⚠️ `.env.local` | No vault integration |
| CORS | ⚠️ Default Next.js | Not explicitly configured |
| CSP headers | ❌ Missing | No Content-Security-Policy |

---

## SECTION 7 — COMPLIANCE ALIGNMENT MATRIX

| ISO Standard | Clauses Covered | Key Gaps |
|-------------|-----------------|----------|
| ISO 9001:2015 | 4,5,6,7,8,9,10 | Clause 5.3 (roles) no RBAC; 7.2 training no backend |
| ISO 14001:2015 | 6.1 climate | Clause 9.3 management review router missing |
| ISO 45001:2018 | Risk assessment | Incident investigation router missing |
| ISO 17025:2017 | Testing router | Calibration management missing |
| ISO 27001:2022 | Audit trail partial | A.12.4 logging incomplete; A.9 access control missing |
| MS ISO | Malaysian Standards | ms-router connected, knowledge base loaded |

---

## SECTION 8 — DEPENDENCY MAP

```
app/dashboard → trpc.dashboard.getStats → sampleDashboardStats (MOCK — not live)
app/iso/audit → trpc.iso.audit.generate → auditEngine ✅
app/iso/compliance → trpc.iso.compliance.check → complianceScoringEngine ✅  
app/iso/risk → trpc.iso.risk.assess → riskEngine ✅
app/iso/capa → trpc.iso.capa.create → correctiveActionEngine ✅
app/agents → trpc.agent.list → [] (EMPTY — registry not populated) ❌
app/documents → trpc.document.list → sampleDocuments (MOCK) ❌
app/projects → trpc.project.list → sampleProjects (MOCK) ❌
```

---

## SECTION 9 — IMPLEMENTATION PRIORITIES (Ordered by Business Value)

### Priority 1 — Agent Registry Population (breaks core feature)
File: `sdk/core/registry.ts` + new `sdk/agents/index.ts`

### Priority 2 — Prisma Schema Enterprise Extension
File: `sdk/prisma/schema.prisma`

### Priority 3 — RBAC Middleware
File: `sdk/server/trpc.ts`

### Priority 4 — KPI Engine + Live Dashboard  
Files: `sdk/services/kpi-engine.ts` + `sdk/server/router.ts`

### Priority 5 — Event Bus → Mutation Wiring
Files: `components/automation/runtime/event-bus.ts` + `sdk/server/iso-router.ts`

### Priority 6 — Audit Trail Middleware
File: `sdk/server/trpc.ts`

### Priority 7 — Notification Router
File: `sdk/server/notification-router.ts`

### Priority 8 — Training/Competency Router
File: `sdk/server/training-router.ts`

### Priority 9 — Supplier Quality Router
File: `sdk/server/supplier-router.ts`

### Priority 10 — Management Review Router
File: `sdk/server/management-review-router.ts`

---

## CONCLUSION

The MyQMS platform is **architecturally sound and production-ready at the module level**. The primary work is:

1. **Wiring** — connecting existing services to each other
2. **Persistence** — extending the Prisma schema for missing entities  
3. **Security** — adding RBAC before any production deployment
4. **Liveness** — replacing mock data with real database queries
5. **Agents** — populating the registry so the multi-agent system actually works

The estimated effort to reach Level 4 enterprise maturity is **6–8 weeks** with focused implementation following this roadmap.
