# Islamic Manufacturing Process — Component-to-Page Mapping Matrix

This document maps every exported component from `components/islamic-manufacturing-process/` to the frontend route(s) that render it.

> Note: Each feature component in this module is a thin wrapper around `@/components/domain-fullset/*` components, wired using `useDomainConfig()`.

## Base Pages / Overview

| Component | Route | User Journey Role |
|---|---|---|
| `Dashboard` | `/islamic-manufacturing-process/dashboard` | Main entry KPI overview |
| `Overview` | `/islamic-manufacturing-process/overview` | Entry dashboard + at-a-glance status |
| `Analytics` | `/islamic-manufacturing-process/analytics` | Reporting + trend exploration |
| `Metrics` | `/islamic-manufacturing-process/metrics` | KPI breakdowns |
| `ActivityFeed` | `/islamic-manufacturing-process/activity-feed` | Audit/activity chronology |
| `Timeline` | `/islamic-manufacturing-process/timeline` | Temporal view of key events |

## AI Pages

| Component | Route(s) | User Journey Role |
|---|---|---|
| `AiCopilot` | `/islamic-manufacturing-process/ai/copilot` | Assist operators with halal/JAKIM-related tasks |
| `AiInsights` | `/islamic-manufacturing-process/ai/insights` | Summarize AI-generated findings |
| `AiRecommendations` | `/islamic-manufacturing-process/ai/recommendations` | Actionable recommendations |
| `AiAgentPanel` | `/islamic-manufacturing-process/ai/agent-panel` | Manage/inspect domain AI agents |
| `AiRiskEngine` | `/islamic-manufacturing-process/ai/risk-engine` | Risk scoring & risk-based prioritization |
| `AiOrchestrator` | `/islamic-manufacturing-process/ai/orchestrator` | Coordinate workflows/agents for end-to-end journeys |

## Workflow Pages

| Component | Route(s) | User Journey Role |
|---|---|---|
| `WorkflowBuilder` | `/islamic-manufacturing-process/workflow-builder` | Build halal integrity workflows |
| `WorkflowCanvas` | `/islamic-manufacturing-process/workflow-canvas` | Visual workflow authoring |
| `WorkflowSidebar` | `/islamic-manufacturing-process/workflow-sidebar` | Node library / controls |
| `WorkflowNode` | (not implemented as a standalone route) | Node visualization in canvas |
| `WorkflowEdge` | (not implemented as a standalone route) | Edge visualization in canvas |

## Forms & Approvals

| Component | Route | User Journey Role |
|---|---|---|
| `CreateForm` | `/islamic-manufacturing-process/forms/create` | Create new process/compliance records |
| `EditForm` | `/islamic-manufacturing-process/forms/edit` | Edit existing records |
| `ApprovalForm` | `/islamic-manufacturing-process/forms/approval` | Compliance approval workflow |
| `Checklist` | `/islamic-manufacturing-process/checklist` | Guided checklist completion |
| `Wizard` | `/islamic-manufacturing-process/wizard` | Step-by-step onboarding / guided setup |

## Monitoring, Compliance, Notifications

| Component | Route(s) | User Journey Role |
|---|---|---|
| `LiveMonitor` | `/islamic-manufacturing-process/live-monitor` | Real-time monitoring of halal integrity |
| `ComplianceMonitor` | `/islamic-manufacturing-process/compliance-monitor` | Compliance monitoring view |
| `AlertCenter` | `/islamic-manufacturing-process/alerts/center` and `/islamic-manufacturing-process/alerts/page` | Alert triage hub |
| `Notifications` | `/islamic-manufacturing-process/alerts/notifications` and `/islamic-manufacturing-process/alerts/page` | Notification list |
| `Heatmap` | `/islamic-manufacturing-process/heatmap` | Compliance/workflow heatmap |
| `RiskMatrix` | `/islamic-manufacturing-process/risk-matrix` | Risk matrix view |
| `Sankey` | `/islamic-manufacturing-process/sankey` | Flow relationships visualization |
| `Radar` | `/islamic-manufacturing-process/radar` | Maturity/coverage radar |

## Charts / Aggregated Visuals

| Component | Route | User Journey Role |
|---|---|---|
| `Charts` | `/islamic-manufacturing-process/charts` | Aggregated chart view |

---

## Orphan / Unused Component Check

The module exports `WorkflowNode` and `WorkflowEdge` but they are primarily meant to be internal canvas primitives.

- **Not mapped to standalone routes**: `WorkflowNode`, `WorkflowEdge` (they should be used by `WorkflowCanvas` / `WorkflowBuilder` composition).

All other exported components now have at least one route backing them.

