# Implementation Plan: automation-node-catalog

## Notes

The implementation proceeds in strict dependency order: domain constants → domain node components → node library/registry → catalog UI → barrel export → demo page → tests. Each task group is independently completable but later groups depend on earlier ones.

Key design decisions already captured in `design.md`:
- `automationNodeTypes` overrides `workflowNodeTypes` for shared keys (`action`, `end`, `wait`) — intentional, richer variants win.
- Domain accent colours: MS = `#0ea5e9` (sky-500), IM = `#10b981` (emerald-500).
- `nodeLibrary.ts` only imports components, never imports from `NodeCatalog.tsx`, preventing circular dependencies.

## Overview

This plan implements the Node Catalog and Node Library for the automation flow designer. It proceeds in nine ordered groups, from amending domain constants through to verification and property-based testing.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1.1", "1.2"] },
    { "wave": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "3.1", "3.2", "3.3", "3.4"] },
    { "wave": 3, "tasks": ["2.5", "3.5"] },
    { "wave": 4, "tasks": ["4.1"] },
    { "wave": 5, "tasks": ["4.2", "4.3"] },
    { "wave": 6, "tasks": ["4.4"] },
    { "wave": 7, "tasks": ["5.1", "5.2", "5.3"] },
    { "wave": 8, "tasks": ["6.1"] },
    { "wave": 9, "tasks": ["7.1", "7.2", "7.3", "8.1", "8.2", "8.3"] },
    { "wave": 10, "tasks": ["9.1", "9.2", "9.3"] },
    { "wave": 11, "tasks": ["10.1", "10.2", "10.3", "10.4"] },
    { "wave": 12, "tasks": ["11.1", "12.1", "13.1", "14.1", "15.1", "16.1", "17.1"] },
    { "wave": 13, "tasks": ["11.2", "11.3", "12.2", "12.3", "13.2", "13.3", "14.2", "14.3", "15.2", "15.3", "16.2", "16.3", "17.2", "17.3", "17.4"] },
    { "wave": 14, "tasks": ["18.1"] },
    { "wave": 15, "tasks": ["18.2", "18.3"] },
    { "wave": 16, "tasks": ["19.1", "19.2"] },
    { "wave": 17, "tasks": ["20.1", "20.2"] }
  ]
}
```

## Tasks

### 1. Domain Package Amendments

- [ ] 1.1 Add `MS_ACCENT` constant to `components/my-standards/constants.ts`
  - Append `export const MS_ACCENT = '#0ea5e9';` to the file
  - Verify `DOMAIN_KEY`, `DOMAIN_NAME`, and `DOMAIN_SCOPE` remain unchanged
  - Validates: Requirement 1.4, Design § Proposed Domain Accent Colors

- [ ] 1.2 Add `IM_ACCENT` constant to `components/islamic-manufacturing-process/constants.ts`
  - Append `export const IM_ACCENT = '#10b981';` to the file
  - Verify `DOMAIN_KEY`, `DOMAIN_NAME`, and `DOMAIN_SCOPE` remain unchanged
  - Validates: Requirement 1.5, Design § Proposed Domain Accent Colors

### 2. MS Domain Node Components

- [ ] 2.1 Create `components/my-standards/nodes.tsx` with `MSComplianceCheckNode`
  - Export `MSComplianceCheckNode` as a `React.memo` component
  - Accept `data: { label, standardCode?, status?: 'compliant' | 'non-compliant' | 'pending' }` prop
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Apply `MS_ACCENT` at 15% opacity for card header background and as border colour
  - Render `label`, a compliance-status `Badge`, and a `standardCode` field
  - Apply `ring-2` in `MS_ACCENT` colour when `selected` prop is `true`
  - Validates: Requirements 4.1, 4.6, 4.7

- [ ] 2.2 Add `MSAuditNode` to `components/my-standards/nodes.tsx`
  - Export `MSAuditNode` as a `React.memo` component
  - Accept `data: { label, auditType?, scheduledDate? }` prop
  - Follow same Handle, accent, and selection ring pattern as 2.1
  - Render `label`, an `auditType` indicator, and a `scheduledDate` field
  - Validates: Requirements 4.2, 4.6, 4.7

- [ ] 2.3 Add `MSCertificationNode` to `components/my-standards/nodes.tsx`
  - Export `MSCertificationNode` as a `React.memo` component
  - Accept `data: { label, certificateNumber?, expiryDate?, certificationBody? }` prop
  - Follow same Handle, accent, and selection ring pattern as 2.1
  - Render `label`, `certificateNumber`, `expiryDate`, and `certificationBody` fields
  - Validates: Requirements 4.3, 4.6, 4.7

- [ ] 2.4 Add `MSStandardsBrowserNode` to `components/my-standards/nodes.tsx`
  - Export `MSStandardsBrowserNode` as a `React.memo` component
  - Accept `data: { label, standardCode?, scopeDescription? }` prop
  - Follow same Handle, accent, and selection ring pattern as 2.1
  - Render `label`, a `standardCode` display input, and a `scopeDescription` field
  - When the `standardCode` input receives user input, filter a static list of MS standard codes and display matching codes in a dropdown within the node card
  - Validates: Requirements 4.4, 4.5, 4.6, 4.7

- [ ] 2.5 Export all four MS nodes from `components/my-standards/index.ts`
  - Add `export { MSComplianceCheckNode, MSAuditNode, MSCertificationNode, MSStandardsBrowserNode } from './nodes';`
  - Verify no import conflicts with existing exports
  - Validates: Requirement 3.1

### 3. Islamic Manufacturing Domain Node Components

- [ ] 3.1 Create `components/islamic-manufacturing-process/nodes.tsx` with `HalalAuditNode`
  - Export `HalalAuditNode` as a `React.memo` component
  - Accept `data: { label, auditScope?, auditorName?, halalStatus?: 'certified' | 'pending' | 'rejected' }` prop
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Apply `IM_ACCENT` at 15% opacity for header background and as border colour
  - Render `label`, `auditScope`, `auditorName`, and a `halalStatus` badge
  - Apply `ring-2` in `IM_ACCENT` colour when `selected` prop is `true`
  - Validates: Requirements 5.1, 5.5, 5.6

- [ ] 3.2 Add `JAKIMCertificateNode` to `components/islamic-manufacturing-process/nodes.tsx`
  - Export `JAKIMCertificateNode` as a `React.memo` component
  - Accept `data: { label, certificateNumber?, validityPeriod?, productCategory? }` prop
  - Follow same Handle, accent, and selection ring pattern as 3.1
  - Render `label`, `certificateNumber`, `validityPeriod`, and `productCategory` fields
  - Validates: Requirements 5.2, 5.5, 5.6

- [ ] 3.3 Add `HalalRiskNode` to `components/islamic-manufacturing-process/nodes.tsx`
  - Export `HalalRiskNode` as a `React.memo` component
  - Accept `data: { label, riskLevel?: 'low' | 'medium' | 'high' | 'critical', riskDescription?, mitigationAction? }` prop
  - Follow same Handle, accent, and selection ring pattern as 3.1
  - Render `label`, a `riskLevel` badge, `riskDescription`, and `mitigationAction` fields
  - Validates: Requirements 5.3, 5.5, 5.6

- [ ] 3.4 Add `HaramIngredientCheckNode` to `components/islamic-manufacturing-process/nodes.tsx`
  - Export `HaramIngredientCheckNode` as a `React.memo` component
  - Accept `data: { label, ingredientName?, detectionMethod?, result?: 'pass' | 'fail' }` prop
  - Follow same Handle, accent, and selection ring pattern as 3.1
  - Render `label`, `ingredientName`, `detectionMethod`, and a pass/fail status indicator
  - Validates: Requirements 5.4, 5.5, 5.6

- [ ] 3.5 Export all four IM nodes from `components/islamic-manufacturing-process/index.ts`
  - Add `export { HalalAuditNode, JAKIMCertificateNode, HalalRiskNode, HaramIngredientCheckNode } from './nodes';`
  - Verify no import conflicts with existing exports
  - Validates: Requirement 3.2

### 4. Node Library Registry

- [ ] 4.1 Create `components/automation/node-catalog/nodeLibrary.ts` — types and domain configs
  - Create the directory `components/automation/node-catalog/`
  - Define and export the `NodeDefinition` TypeScript interface with fields: `id`, `type`, `label`, `category` (`'core-workflow' | 'my-standards' | 'islamic-manufacturing'`), `description`, `icon` (`LucideIcon`), `color`, `defaultData` (`Record<string, unknown>`), and optional `domain` (string)
  - Import `DomainConfig` from `@/components/domain-fullset/types` and `makeDomainConfig` from `@/components/domain-fullset/mock-data`
  - Export `myStandardsDomainConfig` and `islamicManufacturingDomainConfig` built via `makeDomainConfig`
  - Validates: Requirement 1.1, Design § NodeDefinition Interface

- [ ] 4.2 Add `myStandardsNodeTypes` and `islamicManufacturingNodeTypes` maps to `nodeLibrary.ts`
  - Import the four MS node components from `@/components/my-standards/nodes`
  - Import the four IM node components from `@/components/islamic-manufacturing-process/nodes`
  - Export `myStandardsNodeTypes: Record<string, React.ComponentType<any>>` keyed as `'ms-compliance-check'`, `'ms-audit'`, `'ms-certification'`, `'ms-standards-browser'`
  - Export `islamicManufacturingNodeTypes: Record<string, React.ComponentType<any>>` keyed as `'halal-audit'`, `'jakim-certificate'`, `'halal-risk'`, `'haram-ingredient-check'`
  - Validates: Requirements 2.3, 2.4, 3.1, 3.2, 3.3, 3.4

- [ ] 4.3 Add `nodeTypeRegistry` unified map to `nodeLibrary.ts`
  - Import `automationNodeTypes` from `@/components/automation/node/AutomationNodes`
  - Import custom node components from `@/components/automation/node/CustomNodes`
  - Import workflow node types from `@/components/automation/node/WorkflowNodes`
  - Export `nodeTypeRegistry: Record<string, React.ComponentType<any>>` as spread in order: `workflowNodeTypes`, `automationNodeTypes`, `customNodeTypes`, `myStandardsNodeTypes`, `islamicManufacturingNodeTypes`
  - Validates: Requirements 2.1, 2.2, 2.5, Design § nodeTypeRegistry Assembly Algorithm

- [ ] 4.4 Add `nodeCatalog` array (25 entries) to `nodeLibrary.ts`
  - Add all 17 Core_Nodes entries: 9 WorkflowNodes (`wf-start`, `wf-end`, `wf-action`, `wf-decision`, `wf-approval`, `wf-wait`, `wf-notification`, `wf-parallel`, `wf-error`) and 8 AutomationNodes (`auto-task`, `auto-condition`, `auto-trigger`, `auto-group`, `auto-subworkflow`, `custom-employee`, `custom-metric`, `custom-annotation`)
  - Add 4 MS_Nodes entries (`ms-compliance-check`, `ms-audit`, `ms-certification`, `ms-standards-browser`) with `domain: 'my_standards'` and `color: MS_ACCENT`
  - Add 4 IM_Nodes entries (`im-halal-audit`, `im-jakim-cert`, `im-halal-risk`, `im-haram-check`) with `domain: 'islamic_manufacturing_process'` and `color: IM_ACCENT`
  - Ensure all `id` values are unique and all `type` values match keys in `nodeTypeRegistry`
  - Export `nodeCatalog: NodeDefinition[]`
  - Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6, Design § nodeCatalog Array

### 5. Node Catalog UI Component

- [ ] 5.1 Create `components/automation/node-catalog/NodeCatalog.tsx` — structure and search
  - Create a `'use client'` React component file
  - Define and export `NodeCatalogProps` interface with `draggable?: boolean`, `onNodeSelect?: (node: NodeDefinition) => void`, `className?: string`
  - Render a `shadcn/ui` `Input` for live search with controlled `searchTerm` state
  - Render `shadcn/ui` `Tabs` with four `TabsTrigger` values: `all`, `core-workflow`, `my-standards`, `islamic-manufacturing`
  - Wire `searchTerm` and `activeTab` state to drive `filterCatalog` via `useMemo`
  - Validates: Requirements 6.1, 6.2, 6.3, 6.6

- [ ] 5.2 Implement `filterCatalog` helper and node tile rendering in `NodeCatalog.tsx`
  - Implement `filterCatalog(catalog, searchTerm, activeTab)` as a pure function (case-insensitive match on `label` and `description`)
  - Render each `NodeDefinition` as a `shadcn/ui` `Card` / `CardContent` inside a `ScrollArea`
  - Display icon (Lucide component), `label`, `description`, `Badge` with category, and a colour swatch `div` for each tile
  - When `searchTerm` is cleared, restore the full grouped category view
  - Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, Design § Search & Filter Algorithm

- [ ] 5.3 Implement drag-and-drop support in `NodeCatalog.tsx`
  - When `draggable` prop is `true`, set the `draggable` HTML attribute on each node tile
  - Attach `onDragStart` handler that calls `event.dataTransfer.setData('application/automation-node', JSON.stringify({ type, defaultData }))` and sets `effectAllowed = 'move'`
  - When `draggable` prop is `false` or omitted, omit the `draggable` attribute and do not attach drag handlers
  - Invoke `onNodeSelect(def)` on tile click when the prop is supplied; allow click to complete silently when not provided
  - Validates: Requirements 6.7, 7.3, Design § buildDragHandler

### 6. Barrel Export

- [ ] 6.1 Create `components/automation/node-catalog/index.ts`
  - Export `NodeDefinition` type from `./nodeLibrary`
  - Export `nodeCatalog`, `nodeTypeRegistry`, `myStandardsNodeTypes`, `islamicManufacturingNodeTypes`, `myStandardsDomainConfig`, `islamicManufacturingDomainConfig` from `./nodeLibrary`
  - Export `NodeCatalog` component and `NodeCatalogProps` type from `./NodeCatalog`
  - Verify no circular imports: `index.ts` → `NodeCatalog.tsx` → `nodeLibrary.ts` → domain nodes (no back-reference to catalog or index)
  - Validates: Requirements 7.1, 7.4, Design § Barrel Export

### 7. Demo Page

- [ ] 7.1 Create `app/automation/node-catalog/page.tsx` — layout and canvas setup
  - Create a `'use client'` Next.js page file
  - Wrap the layout with `SidebarProvider` + `SidebarInset` + `AppSidebar` + `AppHeader` to match the `app/automation/malaysia/page.tsx` pattern
  - Implement a two-column layout: left column for `NodeCatalog` (with `draggable` prop), right column for the XYFlow `ReactFlow` canvas
  - Import and pass `nodeTypeRegistry` as the `nodeTypes` prop to `ReactFlow`
  - Wrap `ReactFlow` in `ReactFlowProvider`
  - Validates: Requirements 8.1, 8.2, 8.4

- [ ] 7.2 Add drag-and-drop integration to `app/automation/node-catalog/page.tsx`
  - Implement `onDrop` handler: parse `application/automation-node` from `dataTransfer`, call `reactFlowInstance.screenToFlowPosition`, append the new node to `useNodesState`
  - Implement `onDragOver` handler: call `event.preventDefault()` and set `dropEffect = 'move'`
  - Wrap canvas `div` with `onDrop` and `onDragOver` handlers
  - Wrap the `onDrop` JSON parse in a `try/catch`; return early (no state mutation) when payload is empty or malformed
  - Validates: Requirements 8.3, Design § onDrop Node Placement Algorithm, Design § Error Handling

- [ ] 7.3 Add initial example nodes to the demo canvas
  - Define an `initialNodes` array with at least one node from each category: one Core_Node (e.g. `trigger`), one MS_Node (e.g. `ms-audit`), and one IM_Node (e.g. `halal-audit`)
  - Pass `initialNodes` to `useNodesState` so the canvas is non-empty on first load
  - Validates: Requirement 8.5

### 8. Property-Based Tests

- [ ] 8.1 Write property test — `nodeCatalog` uniqueness and registry completeness (PBT)
  - Verify `nodeCatalog.length >= 25`
  - Verify `new Set(nodeCatalog.map(n => n.id)).size === nodeCatalog.length` (no duplicate IDs)
  - Verify every `def.type` in `nodeCatalog` is a key in `nodeTypeRegistry` (registry completeness)
  - Validates: Requirements 1.2, 1.3, Design § Correctness Properties 1 and 2

- [ ] 8.2 Write property test — `filterCatalog` soundness and completeness (PBT)
  - Use `fast-check` to generate arbitrary non-empty search terms
  - Soundness: every entry returned by `filterCatalog(nodeCatalog, term, 'all')` passes `matchesSearch(entry, term)`
  - Completeness: every entry in `nodeCatalog` where `matchesSearch(entry, term)` is `true` appears in the filtered result
  - Empty term: `filterCatalog(nodeCatalog, '', 'all')` returns all 25 entries
  - Validates: Requirements 6.2, 6.3, Design § Correctness Properties 3

- [ ] 8.3 Write property test — `filterCatalog` category filter correctness (PBT)
  - Use `fast-check` to sample from `['core-workflow', 'my-standards', 'islamic-manufacturing']`
  - For any non-`'all'` tab, every entry in the result has `category === tab`
  - `filterCatalog(nodeCatalog, '', 'my-standards')` returns exactly 4 entries
  - `filterCatalog(nodeCatalog, '', 'islamic-manufacturing')` returns exactly 4 entries
  - Validates: Requirements 6.1, 6.5, Design § Correctness Properties 4

### 9. Verification

- [ ] 9.1 Run TypeScript compiler check and resolve any type errors
  - Run `tsc --noEmit` from the project root
  - Verify `nodeTypeRegistry` passes to `ReactFlow nodeTypes` prop without TypeScript errors
  - Verify no circular import errors reported in `node-catalog/index.ts`
  - Validates: Requirements 2.2, 7.2, 7.4

- [ ] 9.2 Run existing test suite and confirm no regressions
  - Run `npm test` (or `pnpm test`) and verify existing `flow-process`, `automation`, and component tests still pass
  - Validates: Requirements 7.1, 7.2 (no existing breakage)

- [ ] 9.3 Manual smoke test of the demo page
  - Navigate to `app/automation/node-catalog` in the dev server
  - Verify the page renders without console errors
  - Verify all three category tabs display the correct node counts (17 core, 4 MS, 4 IM)
  - Verify search filtering works in real time
  - Verify drag-and-drop from catalog tiles to the canvas places a node at the correct position
  - Verify no "Unknown node type" browser console warning for any dragged node
  - Validates: Requirements 6.1–6.7, 8.1–8.5

### 10. Domain Accent Constant Additions

- [ ] 10.1 Add `GMP_ACCENT` constant to `components/GMP/constants.ts`
  - Append `export const GMP_ACCENT = '#dc2626';` to the file
  - Verify existing constants remain unchanged
  - _Validates: Requirement 9.4, Design § Domain Accent Colors (Extended)_

- [ ] 10.2 Add `LSS_ACCENT` constant to `components/Lean-six-sigma/constants.ts`
  - Append `export const LSS_ACCENT = '#14b8a6';` to the file
  - Verify existing constants remain unchanged
  - _Validates: Requirement 10.4, Design § Domain Accent Colors (Extended)_

- [ ] 10.3 Add `HR_ACCENT` constant to `components/human-resources/constants.ts`
  - Append `export const HR_ACCENT = '#8b5cf6';` to the file
  - Verify existing constants remain unchanged
  - _Validates: Requirement 11.4, Design § Domain Accent Colors (Extended)_

- [ ] 10.4 Add `SS_ACCENT` constant to `components/six-sigma/constants.ts`
  - Append `export const SS_ACCENT = '#ef4444';` to the file
  - Verify existing constants remain unchanged
  - _Validates: Requirement 12.4, Design § Domain Accent Colors (Extended)_

### 11. GMP XYFlow Node Components

- [ ] 11.1 Create `components/automation/node-catalog/domain-nodes/gmp-nodes.tsx` with `GMPWorkflowNode`
  - Export `GMPWorkflowNode` as `React.memo`, accept XYFlow `NodeProps`
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Render: `label`, a compliance-status `Badge` with values `'compliant' | 'non-compliant' | 'pending'`, and a KPI summary field
  - Apply `GMP_ACCENT` (`#dc2626`) for header background at 15% opacity and as border colour
  - Apply `ring-2` in `#dc2626` when `selected` is `true`
  - Only import from `@xyflow/react` and `@/components/GMP/constants.ts`
  - _Validates: Requirements 9.1, 9.4, 9.5, 9.6, 9.7_

- [ ] 11.2 Add `GMPDeviationNode` to `gmp-nodes.tsx`
  - Export `GMPDeviationNode` as `React.memo`
  - Render: `label`, a deviation-type indicator with values `'critical' | 'major' | 'minor'`, a deviation-description field, and a corrective-action-status field
  - Apply same Handle / accent / ring pattern as 11.1
  - _Validates: Requirements 9.2, 9.4, 9.5, 9.6, 9.7_

- [ ] 11.3 Add `GMPCleanlinessNode` to `gmp-nodes.tsx`
  - Export `GMPCleanlinessNode` as `React.memo`
  - Render: `label`, a cleanliness-zone field, a zone-status indicator with values `'clean' | 'at-risk' | 'contaminated'`, and a last-inspection-date field
  - Apply same Handle / accent / ring pattern as 11.1
  - _Validates: Requirements 9.3, 9.4, 9.5, 9.6, 9.7_

### 12. Lean Six Sigma XYFlow Node Components

- [ ] 12.1 Create `components/automation/node-catalog/domain-nodes/lss-nodes.tsx` with `LSSWasteAnalyzerNode`
  - Export `LSSWasteAnalyzerNode` as `React.memo`, accept XYFlow `NodeProps`
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Render: `label`, a DOWNTIME waste category selector (8 options: Defects, Overproduction, Waiting, Non-utilised talent, Transportation, Inventory, Motion, Extra-processing), and a waste-severity indicator
  - Apply `LSS_ACCENT` (`#14b8a6`) for header and border; `ring-2` when `selected`
  - Only import from `@xyflow/react` and `@/components/Lean-six-sigma/constants.ts`
  - _Validates: Requirements 10.1, 10.4, 10.5, 10.6, 10.7_

- [ ] 12.2 Add `LSSValueStreamNode` to `lss-nodes.tsx`
  - Export `LSSValueStreamNode` as `React.memo`
  - Render: `label`, a lead-time field, a cycle-time field, and a takt-time field
  - Apply same Handle / accent / ring pattern as 12.1
  - _Validates: Requirements 10.2, 10.4, 10.5, 10.6, 10.7_

- [ ] 12.3 Add `LSSControlChartNode` to `lss-nodes.tsx`
  - Export `LSSControlChartNode` as `React.memo`
  - Render: `label`, a process-name field, a control-limit-status indicator with values `'in-control' | 'out-of-control' | 'warning'`, and an SPC rule violation count field
  - Apply same Handle / accent / ring pattern as 12.1
  - _Validates: Requirements 10.3, 10.4, 10.5, 10.6, 10.7_

### 13. Human Resources XYFlow Node Components

- [ ] 13.1 Create `components/automation/node-catalog/domain-nodes/hr-nodes.tsx` with `HRApprovalNode`
  - Export `HRApprovalNode` as `React.memo`, accept XYFlow `NodeProps`
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Render: `label`, an approval-type selector with values `'leave' | 'claim' | 'promotion'`, an approver-name field, and an approval-status indicator with values `'pending' | 'approved' | 'rejected'`
  - Apply `HR_ACCENT` (`#8b5cf6`) for header and border; `ring-2` when `selected`
  - Only import from `@xyflow/react` and `@/components/human-resources/constants.ts`
  - _Validates: Requirements 11.1, 11.4, 11.5, 11.6, 11.7_

- [ ] 13.2 Add `HRComplianceNode` to `hr-nodes.tsx`
  - Export `HRComplianceNode` as `React.memo`
  - Render: `label`, a statutory-body selector with values `'SOCSO' | 'EPF' | 'PCB'`, a compliance-period field, and a compliance-status indicator
  - Apply same Handle / accent / ring pattern as 13.1
  - _Validates: Requirements 11.2, 11.4, 11.5, 11.6, 11.7_

- [ ] 13.3 Add `HROnboardingNode` to `hr-nodes.tsx`
  - Export `HROnboardingNode` as `React.memo`
  - Render: `label`, an employee-name field, an onboarding-stage indicator with values `'documentation' | 'orientation' | 'training' | 'probation' | 'confirmed'`, and a completion-percentage field
  - Apply same Handle / accent / ring pattern as 13.1
  - _Validates: Requirements 11.3, 11.4, 11.5, 11.6, 11.7_

### 14. Six Sigma XYFlow Node Components

- [ ] 14.1 Create `components/automation/node-catalog/domain-nodes/six-sigma-nodes.tsx` with `DMAICPhaseNode`
  - Export `DMAICPhaseNode` as `React.memo`, accept XYFlow `NodeProps`
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Render: `label`, a DMAIC phase selector with values `'Define' | 'Measure' | 'Analyze' | 'Improve' | 'Control'`, a phase-owner field, and a phase-completion-percentage field
  - Apply `SS_ACCENT` (`#ef4444`) for header and border; `ring-2` when `selected`
  - Only import from `@xyflow/react` and `@/components/six-sigma/constants.ts`
  - _Validates: Requirements 12.1, 12.4, 12.5, 12.6, 12.7_

- [ ] 14.2 Add `SixSigmaRiskNode` to `six-sigma-nodes.tsx`
  - Export `SixSigmaRiskNode` as `React.memo`
  - Render: `label`, a defect-type field, an RPN field, and a defect-rate field (PPM)
  - Apply same Handle / accent / ring pattern as 14.1
  - _Validates: Requirements 12.2, 12.4, 12.5, 12.6, 12.7_

- [ ] 14.3 Add `SixSigmaMeasurementNode` to `six-sigma-nodes.tsx`
  - Export `SixSigmaMeasurementNode` as `React.memo`
  - Render: `label`, a measurement-system-name field, a Gauge R&R percentage field, and an acceptability indicator with values `'acceptable' | 'marginal' | 'unacceptable'`
  - Apply same Handle / accent / ring pattern as 14.1
  - _Validates: Requirements 12.3, 12.4, 12.5, 12.6, 12.7_

### 15. ISO XYFlow Node Components

- [ ] 15.1 Create `components/automation/node-catalog/domain-nodes/iso-nodes.tsx` with `ISOAuditPlanNode`
  - Export `ISOAuditPlanNode` as `React.memo`, accept XYFlow `NodeProps`
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Render: `label`, an audit-scope field, an audit-schedule-date field, and an audit-status indicator with values `'planned' | 'in-progress' | 'completed' | 'overdue'`
  - Apply `#06b6d4` as the ISO_ACCENT literal for header and border (no constants.ts file for ISO — hardcode value); `ring-2` when `selected`
  - Only import from `@xyflow/react`
  - _Validates: Requirements 13.1, 13.4, 13.5, 13.6, 13.7_

- [ ] 15.2 Add `ISOCAPANode` to `iso-nodes.tsx`
  - Export `ISOCAPANode` as `React.memo`
  - Render: `label`, a CAPA-type selector with values `'corrective' | 'preventive'`, a root-cause-description field, and an action-status indicator with values `'open' | 'in-progress' | 'verified' | 'closed'`
  - Apply same Handle / accent / ring pattern as 15.1
  - _Validates: Requirements 13.2, 13.4, 13.5, 13.6, 13.7_

- [ ] 15.3 Add `ISOComplianceCheckNode` to `iso-nodes.tsx`
  - Export `ISOComplianceCheckNode` as `React.memo`
  - Render: `label`, a standard-reference field, a clause-number field, and a conformance-status indicator with values `'conforming' | 'minor-NC' | 'major-NC' | 'observation'`
  - Apply same Handle / accent / ring pattern as 15.1
  - _Validates: Requirements 13.3, 13.4, 13.5, 13.6, 13.7_

### 16. QMS XYFlow Node Components

- [ ] 16.1 Create `components/automation/node-catalog/domain-nodes/qms-nodes.tsx` with `QMSRiskAssessmentNode`
  - Export `QMSRiskAssessmentNode` as `React.memo`, accept XYFlow `NodeProps`
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Render: `label`, a failure-mode field, severity (1–10), occurrence (1–10), detection (1–10) rating fields, and a computed RPN display (derived = S × O × D)
  - Apply `#3b82f6` as the QMS_ACCENT literal for header and border; `ring-2` when `selected`
  - Only import from `@xyflow/react`
  - _Validates: Requirements 14.1, 14.4, 14.5, 14.6, 14.7_

- [ ] 16.2 Add `QMSDocumentControlNode` to `qms-nodes.tsx`
  - Export `QMSDocumentControlNode` as `React.memo`
  - Render: `label`, a document-title field, a revision-number field, an approver-name field, and a document-status indicator with values `'draft' | 'under-review' | 'approved' | 'obsolete'`
  - Apply same Handle / accent / ring pattern as 16.1
  - _Validates: Requirements 14.2, 14.4, 14.5, 14.6, 14.7_

- [ ] 16.3 Add `QMSSPCChartNode` to `qms-nodes.tsx`
  - Export `QMSSPCChartNode` as `React.memo`
  - Render: `label`, a process-parameter field, a control-chart-type selector with values `'X-bar R' | 'X-bar S' | 'p-chart' | 'c-chart'`, and a Cpk display field
  - Apply same Handle / accent / ring pattern as 16.1
  - _Validates: Requirements 14.3, 14.4, 14.5, 14.6, 14.7_

### 17. Integration Connector XYFlow Nodes

- [ ] 17.1 Create `components/automation/node-catalog/domain-nodes/integration-connector-nodes.tsx` with `SlackConnectorNode`
  - Export `SlackConnectorNode` as `React.memo`, accept XYFlow `NodeProps`
  - Render `Handle` type `target` at `Position.Top` and `Handle` type `source` at `Position.Bottom`
  - Render: `label`, a Slack channel field, a message-template field, and a delivery-status indicator with values `'pending' | 'sent' | 'failed'`
  - Apply `#6b7280` for header and border; `ring-2` when `selected`
  - Do NOT import from `@/components/automation/integrations/slack-node.tsx`
  - _Validates: Requirements 15.1, 15.5, 15.6, 15.7, 15.8_

- [ ] 17.2 Add `TeamsConnectorNode` to `integration-connector-nodes.tsx`
  - Export `TeamsConnectorNode` as `React.memo`
  - Render: `label`, a Teams channel/chat field, a message-type selector with values `'notification' | 'approval-request'`, and a delivery-status indicator
  - Apply same Handle / accent / ring pattern as 17.1
  - _Validates: Requirements 15.2, 15.5, 15.6, 15.7, 15.8_

- [ ] 17.3 Add `WebhookConnectorNode` to `integration-connector-nodes.tsx`
  - Export `WebhookConnectorNode` as `React.memo`
  - Render: `label`, an endpoint-URL field, an HTTP-method selector with values `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`, and a last-response-status field
  - Apply same Handle / accent / ring pattern as 17.1
  - _Validates: Requirements 15.3, 15.5, 15.6, 15.7, 15.8_

- [ ] 17.4 Add `EmailConnectorNode` to `integration-connector-nodes.tsx`
  - Export `EmailConnectorNode` as `React.memo`
  - Render: `label`, a recipient-address field, a subject-line field, and a delivery-status indicator
  - Apply same Handle / accent / ring pattern as 17.1
  - _Validates: Requirements 15.4, 15.5, 15.6, 15.7, 15.8_

### 18. Extended Node Library Registry

- [ ] 18.1 Add domain node type maps for new domains to `nodeLibrary.ts`
  - Import all nodes from `./domain-nodes/gmp-nodes`, `./domain-nodes/lss-nodes`, `./domain-nodes/hr-nodes`, `./domain-nodes/six-sigma-nodes`, `./domain-nodes/iso-nodes`, `./domain-nodes/qms-nodes`, `./domain-nodes/integration-connector-nodes`
  - Export `gmpNodeTypes` keyed as `'gmp-workflow'`, `'gmp-deviation'`, `'gmp-cleanliness'`
  - Export `lssNodeTypes` keyed as `'lss-waste-analyzer'`, `'lss-value-stream'`, `'lss-control-chart'`
  - Export `hrNodeTypes` keyed as `'hr-approval'`, `'hr-compliance'`, `'hr-onboarding'`
  - Export `sixSigmaNodeTypes` keyed as `'dmaic-phase'`, `'six-sigma-risk'`, `'six-sigma-measurement'`
  - Export `isoNodeTypes` keyed as `'iso-audit-plan'`, `'iso-capa'`, `'iso-compliance-check'`
  - Export `qmsNodeTypes` keyed as `'qms-risk-assessment'`, `'qms-document-control'`, `'qms-spc-chart'`
  - Export `integrationConnectorNodeTypes` keyed as `'slack-connector'`, `'teams-connector'`, `'webhook-connector'`, `'email-connector'`
  - _Validates: Requirements 17.1–17.7, Design § nodeLibrary.ts exports_

- [ ] 18.2 Extend `nodeTypeRegistry` in `nodeLibrary.ts` with the 7 new domain maps
  - Spread all 7 new maps into `nodeTypeRegistry` after existing spreads
  - Verify no key collisions — all new keys are kebab-case and distinct from existing entries
  - _Validates: Requirements 17.8, 17.9_

- [ ] 18.3 Extend `nodeCatalog` array with 25 new entries
  - Add 3 GMP entries (`gmp-workflow`, `gmp-deviation`, `gmp-cleanliness`) with `color: '#dc2626'` and `domain: 'gmp'`
  - Add 3 LSS entries (`lss-waste-analyzer`, `lss-value-stream`, `lss-control-chart`) with `color: '#14b8a6'` and `domain: 'lean_six_sigma'`
  - Add 3 HR entries (`hr-approval`, `hr-compliance`, `hr-onboarding`) with `color: '#8b5cf6'` and `domain: 'human_resources'`
  - Add 3 Six Sigma entries (`dmaic-phase`, `six-sigma-risk`, `six-sigma-measurement`) with `color: '#ef4444'` and `domain: 'six_sigma'`
  - Add 3 ISO entries (`iso-audit-plan`, `iso-capa`, `iso-compliance-check`) with `color: '#06b6d4'` and `domain: 'iso'`
  - Add 3 QMS entries (`qms-risk-assessment`, `qms-document-control`, `qms-spc-chart`) with `color: '#3b82f6'` and `domain: 'qms'`
  - Add 4 Integration entries (`slack-connector`, `teams-connector`, `webhook-connector`, `email-connector`) with `color: '#6b7280'` and `category: 'integrations'`
  - Ensure `nodeCatalog.length >= 50` and all `id` values are unique
  - Ensure all `type` values match keys in the updated `nodeTypeRegistry`
  - _Validates: Requirements 16.1, 16.3, 17.1–17.7, Design § nodeCatalog Array_

### 19. Extended Node Catalog UI

- [ ] 19.1 Update `NodeCatalog.tsx` category type and tabs
  - Update `NodeDefinition.category` union type to include all 10 values: `'core-workflow' | 'my-standards' | 'islamic-manufacturing' | 'gmp' | 'lean-six-sigma' | 'human-resources' | 'six-sigma' | 'iso' | 'qms' | 'integrations'`
  - Add 7 new `TabsTrigger` items: `gmp`, `lean-six-sigma`, `human-resources`, `six-sigma`, `iso`, `qms`, `integrations`
  - Implement hide-if-empty logic: only render a tab trigger when `nodeCatalog.filter(d => d.category === tab).length > 0`
  - Update `filterCatalog` activeTab type parameter to include all 10 values
  - _Validates: Requirements 16.1, 16.2, 16.5_

- [ ] 19.2 Update barrel `index.ts` with new exports
  - Add exports for all 7 new domain node type maps (`gmpNodeTypes`, `lssNodeTypes`, `hrNodeTypes`, `sixSigmaNodeTypes`, `isoNodeTypes`, `qmsNodeTypes`, `integrationConnectorNodeTypes`) from `./nodeLibrary`
  - Verify the circular-import graph remains acyclic: `index.ts` → `NodeCatalog.tsx` → `nodeLibrary.ts` → `domain-nodes/` (no back-reference)
  - _Validates: Requirements 7.1, 7.4, 16.1_

### 20. Extended Property-Based Tests

- [ ]* 20.1 Extend property tests for extended registry completeness (PBT)
  - Add assertion: all 50+ catalog entries satisfy `def.type ∈ keys(nodeTypeRegistry)` (Property 7)
  - Add assertion: `nodeCatalog.length >= 50`
  - _Validates: Requirement 16.3, Design Correctness Property 7_

- [ ]* 20.2 Add category filter tests for all 7 new categories (PBT)
  - For each new category tab (`gmp`, `lean-six-sigma`, `human-resources`, `six-sigma`, `iso`, `qms`, `integrations`), assert `filterCatalog(nodeCatalog, '', category)` returns exactly the expected count (3 for domain categories, 4 for integrations)
  - Use `fast-check` to generate arbitrary search terms; assert soundness/completeness holds across all 50+ entries
  - _Validates: Requirements 16.1, 16.2, Design Correctness Property 8_
