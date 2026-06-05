# Component Catalog — MyQMS Frontend

This catalog is derived from the existing repository structure under:
- `components/**`
- `app/**` (route surface)

It is intentionally pragmatic: it captures component-purpose, typical dependencies (internal hooks/services), and where these components are used by current pages.

> Note: This repo already has substantial “domain fullsets” and per-standard dashboards (ISO, GMP, Lean/Six-Sigma, HACC P, Human Resources, etc.). This catalog maps each subtree to a domain “category” and highlights shared abstractions.

---

## Component Index (by top-level component subtree)

### AI Elements (low-level UI primitives)
- **components/ai-elements/**
  - **Purpose:** Reusable AI UI building blocks (chat UI, tool cards, sources, message renderers, streaming visuals, node/edge primitives, etc.)
  - **Category:** widget / ai (shared primitives)
  - **Typical dependencies:**
    - `components/ui/*`
    - `components/theme-provider.tsx` (theme)
    - `hooks/useAIChat.ts`, `hooks/use-ai.ts` (when used)
  - **Inputs/Outputs/Events (typical):**
    - Inputs: messages, streaming state, selected model/provider, tool call payloads
    - Outputs: message/tool-call events (often via callbacks or store updates)
  - **SDK bindings:** Often downstream to the SDK via hooks (`lib/sdk/*`, `hooks/useAIChat.ts`, etc.)
  - **Routes:** Used by pages under `app/ai-components/*` and `app/agents/*` (and any AI-centric pages)

  - **Representative files:**
    - `conversation.tsx`, `message.tsx`, `tool.tsx`, `sources.tsx`, `prompt-input.tsx`, `model-selector.tsx`, `mic-selector.tsx`

### AI Enterprise (assembled AI workspaces)
- **components/ai-enterprise/**
  - **Purpose:** Higher-level AI workspaces and shells (dashboard + insight sidebar + compliance copilot)
  - **Category:** ai / page
  - **Typical dependencies:**
    - AI elements
    - AI hooks/services for chat/insights
  - **Representative files:**
    - `AIDashboardShell.tsx`, `AIComplianceCopilot.tsx`, `AIInsightSidebar.tsx`
  - **Routes:** Likely used by `app/ai-components/page.tsx` and/or `/agents` experiences

### Dashboard (shared dashboards)
- **components/dashboard/**
  - **Purpose:** Dashboard widgets and overview sections
  - **Category:** dashboard / analytics
  - **Representative files:** `stats-cards.tsx`, `projects-list.tsx`, `activity-feed.tsx`, `compliance-overview.tsx`

### Domain Fullsets / Domain-specific dashboards
These are “assembled domain experiences” built from multiple widgets.

- **components/GMP/**
  - **Purpose:** GMP domain dashboard, analytics, compliance monitoring, workflow builder, approvals, checklists, and live monitoring
  - **Category:** dashboard / workflow / form / analytics
  - **Representative files:**
    - `dashboard.tsx`, `overview.tsx`, `analytics.tsx`, `approval-form.tsx`, `workflow-builder.tsx`, `workflow-canvas.tsx`, `ai-*` integrations
  - **Internal dependencies:**
    - `components/GMP/hooks.ts`, `components/GMP/utils.ts`, `components/GMP/constants.ts`
    - shadcn/ui / Radix components
    - AI elements and enterprise copilot panels
  - **Routes:** Mapped to future `/gmp/*` routes; current repo already includes many ISO-ish and workflow pages. (Actual wiring may be in dedicated pages or via reusable composition.)

- **components/Lean-six-sigma/**
  - **Purpose:** DMAIC-ish dashboards, risk matrices, forms, compliance monitoring, and AI panels
  - **Category:** dashboard / form / workflow / analytics
  - **Representative files:** `dashboard.tsx`, `analytics.tsx`, `risk-matrix.tsx`, `workflow-builder.tsx`, `ai-*`

- **components/iso/**
  - **Purpose:** ISO-specific UI bundles (and in some cases may provide domain implementations)
  - **Category:** page / workflow / form
  - **Representative files:** (top-level `components/iso/` subtree; route wiring lives under `app/iso/*`)

- **components/haccp/**
  - **Purpose:** HACC P forms for critical control points and corrective actions
  - **Category:** form / compliance
  - **Representative files:** `CriticalControlPointsForm.tsx`, `CorrectiveActionsForm.tsx`

- **components/human-resources/**
  - **Purpose:** HR-related UI bundles (not enumerated here due to truncated listing)
  - **Category:** form / dashboard

- **components/islamic-manufacturing-process/**
  - **Purpose:** Domain specialty UI
  - **Category:** page / compliance

- **components/my-standards/**
  - **Purpose:** Custom standards management UI
  - **Category:** dashboard / compliance

- **components/portals/**
  - **Purpose:** Supplier/portal entry points (if any), likely navigation and entry flows
  - **Category:** page / workflow

### Sidebar (layout navigation)
- **components/sidebar/**
  - **Purpose:** Application navigation shell (header/sidebar/footer/user)
  - **Category:** layout/widget
  - **Representative files:**
    - `sidebar.tsx`, `app-sidebar.tsx`, `app-header.tsx`
    - `sidebar-nav.tsx`, `sidebar-user.tsx`
  - **Routes:** Global; used by app layout pages.

### UI and Theme
- **components/ui/**
  - **Purpose:** shadcn/ui primitives (buttons, dialogs, inputs, toasts, etc.)
  - **Category:** widget
- **components/GlassmorphicCard.tsx**
  - **Purpose:** shared glass-card container for consistent UI

---

## SharedDashboardShell / SharedDashboardShell-like abstractions (detected)
Based on file naming and existing route templates, the repo strongly suggests these shared patterns:
- **GlassmorphicCard** as a styling shell for all dashboards
- **AI enterprise shells** (`AIDashboardShell.tsx`) as shared AI layout
- **Sidebar composition** via `components/sidebar/*`

---

## Duplicates (best-effort)
Because `search_files` isn’t available (ripgrep missing), duplicate detection is best-effort based on subtree names already present:
- **ISO / ISO-like**
  - `components/iso/**`
  - `components/GMP/**` and `components/Lean-six-sigma/**` each have similarly named AI panels (`ai-*`) and dashboard patterns.

When duplicate functional components exist, they appear to be domain-wrapped variations (e.g., GMP vs Lean-six-sigma dashboards) rather than exact duplicates.

---

## ComponentMap (TypeScript shape)
The requested structured map can be generated later programmatically; for now, this catalog provides the manual mapping foundation.

Example entries (representative):

```ts
type ComponentMap = {
 component: string;
 domain: string;
 category:
   | 'page' | 'widget' | 'workflow' | 'dashboard' | 'form' | 'analytics'
   | 'ai' | 'automation';
 dependencies: string[];
 routes: string[];
 sdkBindings: string[];
};
```

Representative subset:
- { component: 'components/ai-elements/*', domain: 'ai', category: 'ai', dependencies: ['components/ui/*','hooks/useAIChat'], routes: ['/ai-components','/agents'], sdkBindings: ['lib/sdk/useChat'] }
- { component: 'components/automation/processflow_designer.tsx', domain: 'workflow', category: 'workflow', dependencies: ['ReactFlow/xyflow'], routes: ['/flow-process','/automation/designer'], sdkBindings: ['lib/workflow/*','sdk workflow services (future)'] }

---

## Gaps / Next steps
- This catalog needs automated import analysis (regex or TS AST) to extract exact dependencies and route usage. Given the environment’s lack of ripgrep, this is a best-effort inventory.
- The next deliverables (`feature-map.ts`, `route-map.md`, `dependency-graph.md`) will solidify wiring and reduce drift between component inventory and actual route usage.

