# TODO_MYQMS_INTEGRATION.md

## Phase A + B (kickoff)
- [x] Create foundational registry/runtime modules inside `components/my-standards/{registry,engine,node,edges,validators,templates,palette,workflows}/`
- [ ] Add strict shared interfaces + Zod schema validation wiring using `components/my-standards/types/foundation.ts`
- [ ] Extend `lib/workflow/FlowExecutionController.ts` to accept registry-driven executors + validator hooks (single execution backbone)
- [ ] Add `/my-standards/*` routes and sidebar reachability (at minimum: `/my-standards`, `/my-standards/library`, `/my-standards/workflows`, `/my-standards/registry`, `/my-standards/analytics`, `/my-standards/templates`)
- [ ] Integrate MY Standards dashboard to pull registry-driven KPI/compliance signals (no placeholders)
- [ ] Update `app/automation/designer/page.tsx` to run via `FlowExecutionController` instead of `components/automation/runtime/pipeline-executor.ts`
- [ ] Provide builder palette + execution mapping for the first registry-enabled node types
- [ ] Generate Feature Mapping Matrix + Reachability Report (artifacts under `docs/`)

## Remaining phases
- [ ] Phase C: enterprise node library (domain coverage)
- [ ] Phase D: edge + validation engine (rule engine + validators)
- [ ] Phase E: workflow builder integrations (debugger, replay, inspector)
- [ ] Phase F: AI regulatory intelligence orchestration + `/ai/*` routes
- [ ] Phase G: templates + marketplace integration
- [ ] Phase H: production readiness (RBAC, audit trail, versioning, import/export, schemas, tests, docs)

