# Feature Map — MyQMS (initial mapping)

Source: `integration/feature-map.ts`

This feature map groups repository “capabilities” into modules/domains aligned with:
- existing `app/**` routes
- existing component subtrees in `components/**`

## Module breakdown
- dashboard: overview/stats/activity-feed/compliance/projects-list
- qms: dashboard/processes/projects/documents/risk
- compliance: iso compliance/gap analysis/score/rag/audit checklists
- audit: internal audit/capa/findings/audit plans
- standards: iso standards/my-standards/clause viewer
- workflow: process designer/workflow builder/canvas/execution/debug
- automation: aaos/designer/runtime/templates/operations/integrations
- ai: agents/ai copilot/insights/recommendations/risk assessment/ai workspace
- manufacturing: industry manufacturing/metrics/oee/live monitoring
- hr: human resources domain items
- gmp: gmp dashboard/approvals/checklists/monitoring/risk matrix
- haccp: forms for critical control points + corrective actions
- lean & sigma: dashboards/analytics/risk/charts
- malaysia: malaysia compliance center pages
- document: document builder/preview/control/versioning/annotations
- analytics: charts/heatmaps/radar/sankey
- portal: portals domain

> This is an initial scaffolding map. In later steps, route-level wrappers will be implemented so the map becomes “enforced wiring” rather than documentation.

