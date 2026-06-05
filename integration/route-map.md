# Route Map — Existing Next.js App Router

This route map reflects the current `app/**` directory structure found in the repository.

## Current top-level routes
- `/` → landing page (`app/page.tsx`)
- `/agents` → multi-agent chat UI (`app/agents/page.tsx`)
- `/ai-components` → AI components showcase (`app/ai-components/page.tsx`)

## AI / Chat streaming
- `/api/ai/chat-stream` → SSE/streaming endpoint (`app/api/ai/chat-stream/route.ts`)

## tRPC endpoint surface
- `/api/trpc/*` → tRPC HTTP handler (`app/api/trpc/[trpc]/route.ts`)

## Automation routes
- `/automation/aaos` → automation AAOS (`app/automation/aaos/page.tsx`)
- `/automation/administration` → admin automation
- `/automation/analytics` → automation analytics
- `/automation/catalog` → automation catalog
- `/automation/collaboration` → collaboration
- `/automation/datalocker` → data locker
- `/automation/designer` → workflow/process designer entry
- `/automation/governance` → governance
- `/automation/integrations` → integrations
- `/automation/malaysia` → malaysia automation
- `/automation/marketplace` → marketplace
- `/automation/models` → models
- `/automation/operations` → operations
- `/automation/templates` → templates

## Compliance routes
- `/compliance` → compliance entry (`app/compliance/page.tsx`)
- `/compliance/rag` → RAG compliance entry (`app/compliance/rag/page.tsx`)

## Dashboard routes
- `/dashboard` → dashboard entry (`app/dashboard/page.tsx`)

## Document routes
- `/documents` → documents entry (`app/documents/page.tsx`)

## Process & workflow designer routes
- `/flow-process` → flow/process designer (`app/flow-process/page.tsx`)
- `/processes` → processes listing (`app/processes/page.tsx`)
- `/processes/[id]` → process detail (`app/processes/[id]/page.tsx`)

## Generator
- `/generator` → QMS generator (`app/generator/page.tsx`)

## Industry routes
- `/industry/*`
  - `/industry/construction`
  - `/industry/electronics`
  - `/industry/financial`
  - `/industry/halal`
  - `/industry/insurance`
  - `/industry/manufacturing`
  - `/industry/medical`

## ISO routes
- `/iso` → ISO entry (`app/iso/page.tsx`)
- `/iso/audit/createPlan`
- `/iso/audit/generate`
- `/iso/capa/create`
- `/iso/capa/fishbone`
- `/iso/capa/fiveWhys`
- `/iso/compliance/check`
- `/iso/compliance/gapAnalysis`
- `/iso/compliance/score`
- `/iso/risk/assess`
- `/iso/risk/climate`
- `/iso/risk/matrix`

## Landing route
- `/landing` → landing variant (`app/landing/page.tsx`)

## Projects routes
- `/projects` → projects list
- `/projects/[id]` → project detail

## Standards routes
- `/standards` → standards index

---

## Mapping to modules (initial, best-effort)
These modules are aligned with the existing feature map in `integration/feature-map.ts`.

- **AI**: `/agents`, `/ai-components`
- **Automation**: `/automation/*`
- **Compliance**: `/compliance`, `/compliance/rag`, `/iso/*` (ISO-specific compliance pages)
- **Dashboard**: `/dashboard`
- **Documents**: `/documents`
- **Workflow**: `/flow-process`, `/processes/*`, `/automation/designer`
- **Generator**: `/generator`
- **Industry**: `/industry/*`
- **Standards**: `/standards`

> Next deliverable: `dependency-graph.md` and `integration-report.md` to connect pages to component subtrees and SDK hooks.

