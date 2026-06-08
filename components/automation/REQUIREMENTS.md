# Requirements Document

## Introduction

This feature adds a **Node Catalog** and **Node Library** to the automation flow designer in `app/automation`. The catalog gives users a browsable, searchable panel that surfaces every available node type — core workflow nodes (from `WorkflowNodes.tsx` and `AutomationNodes.tsx`), Malaysian Standards (MS) domain nodes derived from `@/components/my-standards`, and Islamic Manufacturing / JAKIM halal domain nodes derived from `@/components/islamic-manufacturing-process`. The library is a typed registry that the XYFlow canvas consumes directly. Together they allow users to discover, preview, and drag-drop any node onto a flow canvas without hard-coding individual node imports in every page.

## Glossary

- **Node_Catalog**: The browsable UI panel (React component) that categorises, searches, and previews all node definitions. Lives at `@/components/automation/node-catalog/NodeCatalog.tsx`.
- **Node_Library**: The typed registry file that exports `nodeCatalog`, `nodeTypeRegistry`, `myStandardsNodeTypes`, and `islamicManufacturingNodeTypes`. Lives at `@/components/automation/node-catalog/nodeLibrary.ts`.
- **NodeDefinition**: A TypeScript type describing a single entry in the catalog: `{ id, type, label, category, description, icon, color, defaultData, domain? }`.
- **Core_Nodes**: The nine base `WorkflowNodes` (Start, End, Action, Decision, Approval, Wait, Notification, Parallel, Error) plus the eight `AutomationNodes` (Task, Condition, Action, Trigger, End, Group, Wait, SubWorkflow).
- **MS_Nodes**: Four specialised React node components for the Malaysian Standards domain: `MSComplianceCheckNode`, `MSAuditNode`, `MSCertificationNode`, `MSStandardsBrowserNode`.
- **IM_Nodes**: Four specialised React node components for the Islamic Manufacturing domain: `HalalAuditNode`, `JAKIMCertificateNode`, `HalalRiskNode`, `HaramIngredientCheckNode`.
- **Domain_Accent**: The `accent` string defined in `DomainConfig` (from `@/components/domain-fullset/types`) used to colour-code domain nodes.
- **XYFlow_Canvas**: The `@xyflow/react` canvas used in `WorkFlowShowcase.tsx` and automation pages; consumes a `nodeTypes` map.
- **DomainConfig**: Type from `@/components/domain-fullset/types` with fields `key`, `name`, `accent`, `kpis`, `alerts`, `tasks`.
- **my_standards**: Domain key for the Malaysian Standards package (`@/components/my-standards`).
- **islamic_manufacturing_process**: Domain key for the Islamic Manufacturing package (`@/components/islamic-manufacturing-process`).

---

## Requirements

### Requirement 1: NodeDefinition Type and nodeCatalog Array

**User Story:** As a developer, I want a single typed registry of all node definitions, so that I can reference node metadata consistently across the catalog UI and the canvas.

#### Acceptance Criteria

1. THE Node_Library SHALL export a `NodeDefinition` TypeScript interface with fields: `id` (string), `type` (string), `label` (string), `category` (`'core-workflow' | 'my-standards' | 'islamic-manufacturing'`), `description` (string), `icon` (`LucideIcon` from `lucide-react`), `color` (CSS colour string), `defaultData` (`Record<string, unknown>` holding initial node data), and an optional `domain` (string).
2. THE Node_Library SHALL export a `nodeCatalog` constant typed as `NodeDefinition[]` that contains a minimum of 25 entries — 17 Core_Nodes (9 WorkflowNodes + 8 AutomationNodes), 4 MS_Nodes, and 4 IM_Nodes — with one entry per node type.
3. THE `nodeCatalog` array SHALL have no duplicate `id` values across all entries; uniqueness is a static data invariant enforced at authoring time.
4. IF a `NodeDefinition` entry has `category` equal to `'my-standards'`, THEN the Node_Library SHALL set its `domain` field to `'my_standards'` and its `color` to the `accent` string from the Malaysian Standards `DomainConfig` object.
5. IF a `NodeDefinition` entry has `category` equal to `'islamic-manufacturing'`, THEN the Node_Library SHALL set its `domain` field to `'islamic_manufacturing_process'` and its `color` to the `accent` string from the Islamic Manufacturing `DomainConfig` object.
6. IF a `NodeDefinition` entry has `category` equal to `'core-workflow'`, THEN the Node_Library SHALL assign a meaningful `color` value (e.g. the node's primary brand colour from its existing component) and SHALL NOT set the `domain` field.

---

### Requirement 2: nodeTypeRegistry Map

**User Story:** As a developer, I want a unified `nodeTypes` map that I can pass directly to an XYFlow canvas, so that all node types — core and domain-specific — are available without manually assembling them per page.

#### Acceptance Criteria

1. THE Node_Library SHALL export a `nodeTypeRegistry` constant typed as `Record<string, React.ComponentType<any>>` where each key is the `type` string of a `NodeDefinition` and each value is the corresponding React node component.
2. THE `nodeTypeRegistry` SHALL include all entries from `automationNodeTypes` (`task`, `condition`, `action`, `trigger`, `end`, `group`, `wait`, `subWorkflow`) and all entries from `customNodeTypes` (`enhancedEmployee`, `departmentGroup`, `compactCard`, `circular`, `diamond`, `hexagon`, `stadium`, `annotation`, `metricCard`).
3. THE `nodeTypeRegistry` SHALL include all MS_Node components keyed as `'ms-compliance-check'`, `'ms-audit'`, `'ms-certification'`, and `'ms-standards-browser'`.
4. THE `nodeTypeRegistry` SHALL include all IM_Node components keyed as `'halal-audit'`, `'jakim-certificate'`, `'halal-risk'`, and `'haram-ingredient-check'`.
5. THE `nodeTypeRegistry` SHALL have no duplicate keys across the four source maps; where a key collision would occur, the Node_Library SHALL surface a TypeScript compile-time error.
6. IF `nodeTypeRegistry` is passed as the `nodeTypes` prop to an XYFlow `ReactFlow` component and a canvas node carries a `type` present in `nodeTypeRegistry`, THEN the XYFlow_Canvas SHALL render that node without logging an "Unknown node type" warning in the browser console.

---

### Requirement 3: Domain-Specific Node Component Exports

**User Story:** As a developer, I want pre-assembled domain node type maps for each domain package, so that I can selectively include only the relevant domain nodes on a given canvas.

#### Acceptance Criteria

1. THE Node_Library SHALL export a `myStandardsNodeTypes` constant typed as `Record<string, React.ComponentType<any>>` containing the four MS_Node components keyed by their respective type strings.
2. THE Node_Library SHALL export an `islamicManufacturingNodeTypes` constant typed as `Record<string, React.ComponentType<any>>` containing the four IM_Node components keyed by their respective type strings.
3. WHEN `myStandardsNodeTypes` is spread into an XYFlow `nodeTypes` prop, THE XYFlow_Canvas SHALL resolve each MS_Node type without error.
4. WHEN `islamicManufacturingNodeTypes` is spread into an XYFlow `nodeTypes` prop, THE XYFlow_Canvas SHALL resolve each IM_Node type without error.

---

### Requirement 4: MS Domain Node Components

**User Story:** As a flow designer user, I want to place Malaysian Standards-specific nodes on the canvas, so that I can model compliance-check and audit steps that visually communicate their MS domain context.

#### Acceptance Criteria

1. THE `MSComplianceCheckNode` SHALL render a card that displays the `label` from its `data` prop, a compliance-status badge with valid values `'compliant' | 'non-compliant' | 'pending'`, and an MS standard code reference field, with accent colour derived from the `my_standards` `DomainConfig.accent`.
2. THE `MSAuditNode` SHALL render a card that displays the `label` from its `data` prop, an audit-type indicator, and a scheduled-date field, with accent colour derived from the `my_standards` `DomainConfig.accent`.
3. THE `MSCertificationNode` SHALL render a card that displays the `label` from its `data` prop, a certificate-number field, an expiry-date field, and a certification-body field, with accent colour derived from the `my_standards` `DomainConfig.accent`.
4. THE `MSStandardsBrowserNode` SHALL render a card that displays the `label` from its `data` prop, a standard-code display field, and a scope-description field, with accent colour derived from the `my_standards` `DomainConfig.accent`.
5. WHEN the standard-code display field in `MSStandardsBrowserNode` receives user input, THE `MSStandardsBrowserNode` SHALL filter and display matching MS standard codes in a dropdown within the node card.
6. WHEN an MS_Node component receives a `selected` prop of `true`, THE MS_Node SHALL apply a 2px solid focus ring using the `my_standards` `DomainConfig.accent` colour.
7. EACH MS_Node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.

---

### Requirement 5: Islamic Manufacturing Domain Node Components

**User Story:** As a flow designer user, I want to place JAKIM halal-specific nodes on the canvas, so that I can model halal-audit and ingredient-check steps that visually communicate their Islamic Manufacturing domain context.

#### Acceptance Criteria

1. THE `HalalAuditNode` SHALL render a card that displays the `label` from its `data` prop, an audit-scope field, an auditor-name field, and a halal-status indicator with valid values `'certified' | 'pending' | 'rejected'`, with accent colour derived from the `islamic_manufacturing_process` `DomainConfig.accent`.
2. THE `JAKIMCertificateNode` SHALL render a card that displays the `label` from its `data` prop, a JAKIM certificate-number field, a validity-period field, and a product-category field, with accent colour derived from the `islamic_manufacturing_process` `DomainConfig.accent`.
3. THE `HalalRiskNode` SHALL render a card that displays the `label` from its `data` prop, a risk-level badge with valid values `'low' | 'medium' | 'high' | 'critical'`, a risk-description field, and a mitigation-action field, with accent colour derived from the `islamic_manufacturing_process` `DomainConfig.accent`.
4. THE `HaramIngredientCheckNode` SHALL render a card that displays the `label` from its `data` prop, an ingredient-name field, a detection-method field, and a pass/fail status indicator with valid values `'pass' | 'fail'`, with accent colour derived from the `islamic_manufacturing_process` `DomainConfig.accent`.
5. WHEN an IM_Node component receives a `selected` prop of `true`, THE IM_Node SHALL apply a 2px solid focus ring using the `islamic_manufacturing_process` `DomainConfig.accent` colour.
6. EACH IM_Node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.

---

### Requirement 6: Node Catalog UI Panel

**User Story:** As a flow designer user, I want to open a side panel that lets me browse and search all available node types grouped by category, so that I can quickly find and understand any node before adding it to my canvas.

#### Acceptance Criteria

1. THE Node_Catalog SHALL render all node definitions from `nodeCatalog` grouped under three visible category headers: "Core Workflow", "My Standards", and "Islamic Manufacturing".
2. WHEN the user types in the search input, THE Node_Catalog SHALL filter the displayed node definitions in real time to only those whose `label` or `description` contains the search term (case-insensitive).
3. WHEN the search input is cleared, THE Node_Catalog SHALL restore the grouped category view with all node definitions organised under their respective category headers.
4. THE Node_Catalog SHALL display for each node definition: its icon (rendered as a Lucide component), its `label`, its `description`, and a colour swatch matching its `color` field.
5. WHEN a category tab is selected in the Node_Catalog, THE Node_Catalog SHALL display only the node definitions belonging to that category.
6. THE Node_Catalog SHALL be implemented using `shadcn/ui` components: `Input` for the search field, `ScrollArea` for the scrollable node list, `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` for category navigation, `Badge` for the domain tag, and `Card` / `CardContent` for each node preview tile.
7. THE Node_Catalog SHALL accept a `draggable` boolean prop; WHEN `draggable` is `true`, each node tile SHALL set a `draggable` HTML attribute and populate `dataTransfer` on `dragStart` with the node's `type` and `defaultData` serialised as JSON, compatible with the XYFlow drag-and-drop pattern; WHEN `draggable` is `false`, THE Node_Catalog SHALL omit the `draggable` attribute and SHALL NOT populate `dataTransfer` on any drag event.

---

### Requirement 7: Integration with app/automation Pages

**User Story:** As a developer, I want the Node Catalog and Node Library to be directly importable and composable in existing `app/automation` pages, so that I can embed the catalog panel without breaking existing page functionality.

#### Acceptance Criteria

1. THE Node_Catalog component and Node_Library exports SHALL be re-exported from a barrel file at `@/components/automation/node-catalog/index.ts`.
2. WHEN `nodeTypeRegistry` is merged with existing `automationNodeTypes` and `customNodeTypes` maps in an `app/automation` page, THE XYFlow_Canvas SHALL not emit TypeScript type errors.
3. THE Node_Catalog component SHALL accept an optional `onNodeSelect` callback prop typed as `(node: NodeDefinition) => void`; WHEN a node tile is clicked and `onNodeSelect` is provided, THE Node_Catalog SHALL invoke `onNodeSelect` with the corresponding `NodeDefinition`; WHEN `onNodeSelect` is not provided, THE Node_Catalog SHALL allow the click event to complete silently without error.
4. THE Node_Library barrel exports SHALL not introduce circular imports with `@/components/automation/node/AutomationNodes.tsx`, `@/components/automation/node/CustomNodes.tsx`, or `@/components/automation/node/WorkflowNodes.tsx`.

---

### Requirement 8: Catalog Demo Page

**User Story:** As a developer, I want a standalone demo page at `app/automation/node-catalog/page.tsx` that renders the Node Catalog alongside a live XYFlow canvas, so that I can verify all node types render correctly and the drag-and-drop integration works end-to-end.

#### Acceptance Criteria

1. THE demo page SHALL render the Node_Catalog panel on the left side and an XYFlow `ReactFlow` canvas on the right side within a two-column layout.
2. THE demo page SHALL pass `nodeTypeRegistry` as the `nodeTypes` prop to the `ReactFlow` component.
3. WHEN a node tile is dragged from the Node_Catalog and dropped onto the XYFlow canvas, THE demo page SHALL add a new node of the dragged type to the canvas at the drop coordinates.
4. THE demo page SHALL be a `'use client'` Next.js page and SHALL wrap the layout in `SidebarProvider` + `SidebarInset` + `AppSidebar` + `AppHeader` to match the existing `app/automation/malaysia/page.tsx` layout pattern.
5. THE demo page SHALL include an initial set of example nodes on the canvas — at least one node from each category — so the canvas is not empty on first load.

---

### Requirement 9: GMP Domain Node Components

**User Story:** As a flow designer user, I want to place GMP-specific nodes on the canvas, so that I can model pharmaceutical/food-grade compliance, deviation tracking, and cleanliness monitoring steps that visually communicate their GMP domain context.

#### Acceptance Criteria

1. THE `GMPWorkflowNode` SHALL render a card that displays the `label` from its `data` prop, a GMP KPI summary section, and a compliance-status badge with valid values `'compliant' | 'non-compliant' | 'pending'`, with accent colour `#dc2626`.
2. THE `GMPDeviationNode` SHALL render a card that displays the `label` from its `data` prop, a deviation-type indicator with valid values `'critical' | 'major' | 'minor'`, a deviation-description field, and a corrective-action-status field, with accent colour `#dc2626`.
3. THE `GMPCleanlinessNode` SHALL render a card that displays the `label` from its `data` prop, a cleanliness-zone field, a zone-status indicator with valid values `'clean' | 'at-risk' | 'contaminated'`, and a last-inspection-date field, with accent colour `#dc2626`.
4. WHEN a GMP node component receives a `selected` prop of `true`, THE GMP node SHALL apply a 2px solid focus ring using colour `#dc2626`.
5. EACH GMP node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.
6. EACH GMP node SHALL accept the XYFlow `NodeProps` shape and SHALL be wrapped in `React.memo` to prevent unnecessary re-renders.
7. THE GMP node components SHALL NOT import directly from `@/components/GMP/workflow-node.tsx`; EACH GMP node SHALL be a new XYFlow-compatible component that only imports from `@xyflow/react` and `@/components/GMP/constants.ts`.

---

### Requirement 10: Lean Six Sigma Domain Node Components

**User Story:** As a flow designer user, I want to place Lean Six Sigma-specific nodes on the canvas, so that I can model waste analysis, value stream mapping, and SPC control chart steps that visually communicate their LSS domain context.

#### Acceptance Criteria

1. THE `LSSWasteAnalyzerNode` SHALL render a card that displays the `label` from its `data` prop, a DOWNTIME waste category selector (Defects, Overproduction, Waiting, Non-utilised talent, Transportation, Inventory, Motion, Extra-processing), and a waste-severity indicator, with accent colour `#14b8a6`.
2. THE `LSSValueStreamNode` SHALL render a card that displays the `label` from its `data` prop, a lead-time field, a cycle-time field, and a takt-time field, with accent colour `#14b8a6`.
3. THE `LSSControlChartNode` SHALL render a card that displays the `label` from its `data` prop, a process-name field, a control-limit-status indicator with valid values `'in-control' | 'out-of-control' | 'warning'`, and an SPC rule violation count field, with accent colour `#14b8a6`.
4. WHEN an LSS node component receives a `selected` prop of `true`, THE LSS node SHALL apply a 2px solid focus ring using colour `#14b8a6`.
5. EACH LSS node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.
6. EACH LSS node SHALL accept the XYFlow `NodeProps` shape and SHALL be wrapped in `React.memo` to prevent unnecessary re-renders.
7. THE LSS node components SHALL NOT import directly from `@/components/Lean-six-sigma/workflow-node.tsx`; EACH LSS node SHALL be a new XYFlow-compatible component that only imports from `@xyflow/react` and `@/components/Lean-six-sigma/constants.ts`.

---

### Requirement 11: Human Resources Domain Node Components

**User Story:** As a flow designer user, I want to place HR-specific nodes on the canvas, so that I can model approval workflows, Malaysian statutory compliance checks, and employee onboarding steps that visually communicate their HR domain context.

#### Acceptance Criteria

1. THE `HRApprovalNode` SHALL render a card that displays the `label` from its `data` prop, an approval-type selector with valid values `'leave' | 'claim' | 'promotion'`, an approver-name field, and an approval-status indicator with valid values `'pending' | 'approved' | 'rejected'`, with accent colour `#8b5cf6`.
2. THE `HRComplianceNode` SHALL render a card that displays the `label` from its `data` prop, a statutory-body selector with valid values `'SOCSO' | 'EPF' | 'PCB'`, a compliance-period field, and a compliance-status indicator with valid values `'compliant' | 'non-compliant' | 'pending'`, with accent colour `#8b5cf6`.
3. THE `HROnboardingNode` SHALL render a card that displays the `label` from its `data` prop, an employee-name field, an onboarding-stage indicator with valid values `'documentation' | 'orientation' | 'training' | 'probation' | 'confirmed'`, and a completion-percentage field, with accent colour `#8b5cf6`.
4. WHEN an HR node component receives a `selected` prop of `true`, THE HR node SHALL apply a 2px solid focus ring using colour `#8b5cf6`.
5. EACH HR node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.
6. EACH HR node SHALL accept the XYFlow `NodeProps` shape and SHALL be wrapped in `React.memo` to prevent unnecessary re-renders.
7. THE HR node components SHALL NOT import directly from `@/components/human-resources/workflow-node.tsx`; EACH HR node SHALL be a new XYFlow-compatible component that only imports from `@xyflow/react` and `@/components/human-resources/constants.ts`.

---

### Requirement 12: Six Sigma Domain Node Components

**User Story:** As a flow designer user, I want to place Six Sigma-specific nodes on the canvas, so that I can model DMAIC phases, risk and defect tracking, and measurement system analysis steps that visually communicate their Six Sigma domain context.

#### Acceptance Criteria

1. THE `DMAICPhaseNode` SHALL render a card that displays the `label` from its `data` prop, a DMAIC phase selector with valid values `'Define' | 'Measure' | 'Analyze' | 'Improve' | 'Control'`, a phase-owner field, and a phase-completion-percentage field, with accent colour `#ef4444`.
2. THE `SixSigmaRiskNode` SHALL render a card that displays the `label` from its `data` prop, a defect-type field, a risk-priority-number (RPN) field, and a defect-rate field expressed in parts-per-million (PPM), with accent colour `#ef4444`.
3. THE `SixSigmaMeasurementNode` SHALL render a card that displays the `label` from its `data` prop, a measurement-system-name field, a Gauge R&R percentage field, and an acceptability indicator with valid values `'acceptable' | 'marginal' | 'unacceptable'`, with accent colour `#ef4444`.
4. WHEN a Six Sigma node component receives a `selected` prop of `true`, THE Six Sigma node SHALL apply a 2px solid focus ring using colour `#ef4444`.
5. EACH Six Sigma node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.
6. EACH Six Sigma node SHALL accept the XYFlow `NodeProps` shape and SHALL be wrapped in `React.memo` to prevent unnecessary re-renders.
7. THE Six Sigma node components SHALL NOT import directly from `@/components/six-sigma/workflow-node.tsx`; EACH Six Sigma node SHALL be a new XYFlow-compatible component that only imports from `@xyflow/react` and `@/components/six-sigma/constants.ts`.

---

### Requirement 13: ISO Quality Domain Node Components

**User Story:** As a flow designer user, I want to place ISO quality-specific nodes on the canvas, so that I can model audit planning, corrective/preventive actions, and standard compliance verification steps that visually communicate their ISO domain context.

#### Acceptance Criteria

1. THE `ISOAuditPlanNode` SHALL render a card that displays the `label` from its `data` prop, an audit-scope field, an audit-schedule-date field, and an audit-status indicator with valid values `'planned' | 'in-progress' | 'completed' | 'overdue'`, with accent colour `#06b6d4`.
2. THE `ISOCAPANode` SHALL render a card that displays the `label` from its `data` prop, a CAPA-type selector with valid values `'corrective' | 'preventive'`, a root-cause-description field, and an action-status indicator with valid values `'open' | 'in-progress' | 'verified' | 'closed'`, with accent colour `#06b6d4`.
3. THE `ISOComplianceCheckNode` SHALL render a card that displays the `label` from its `data` prop, a standard-reference field (e.g. ISO 9001, ISO 14001, ISO 45001), a clause-number field, and a conformance-status indicator with valid values `'conforming' | 'minor-NC' | 'major-NC' | 'observation'`, with accent colour `#06b6d4`.
4. WHEN an ISO node component receives a `selected` prop of `true`, THE ISO node SHALL apply a 2px solid focus ring using colour `#06b6d4`.
5. EACH ISO node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.
6. EACH ISO node SHALL accept the XYFlow `NodeProps` shape and SHALL be wrapped in `React.memo` to prevent unnecessary re-renders.
7. THE ISO node components SHALL be new XYFlow-compatible components derived from the conceptual structure of `@/components/iso/` domain files (audit-checklist, capa-create, compliance-check); EACH ISO node SHALL only import from `@xyflow/react` and SHALL NOT introduce circular imports with the source domain files.

---

### Requirement 14: QMS Domain Node Components

**User Story:** As a flow designer user, I want to place QMS-specific nodes on the canvas, so that I can model FMEA risk assessments, document approval workflows, and SPC chart steps that visually communicate their QMS domain context.

#### Acceptance Criteria

1. THE `QMSRiskAssessmentNode` SHALL render a card that displays the `label` from its `data` prop, a failure-mode field, a severity-rating field (1–10), an occurrence-rating field (1–10), a detection-rating field (1–10), and a computed RPN (Risk Priority Number) display derived from severity × occurrence × detection, with accent colour `#3b82f6`.
2. THE `QMSDocumentControlNode` SHALL render a card that displays the `label` from its `data` prop, a document-title field, a revision-number field, an approver-name field, and a document-status indicator with valid values `'draft' | 'under-review' | 'approved' | 'obsolete'`, with accent colour `#3b82f6`.
3. THE `QMSSPCChartNode` SHALL render a card that displays the `label` from its `data` prop, a process-parameter field, a control-chart-type selector with valid values `'X-bar R' | 'X-bar S' | 'p-chart' | 'c-chart'`, and a process-capability index (Cpk) display field, with accent colour `#3b82f6`.
4. WHEN a QMS node component receives a `selected` prop of `true`, THE QMS node SHALL apply a 2px solid focus ring using colour `#3b82f6`.
5. EACH QMS node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.
6. EACH QMS node SHALL accept the XYFlow `NodeProps` shape and SHALL be wrapped in `React.memo` to prevent unnecessary re-renders.
7. THE QMS node components SHALL be new XYFlow-compatible components derived from the conceptual structure of `@/components/qms/` domain files (RiskAssessmentTool, QMSGenerator); EACH QMS node SHALL only import from `@xyflow/react` and SHALL NOT introduce circular imports with the source domain files.

---

### Requirement 15: Integration Connector Nodes (XYFlow-compatible)

**User Story:** As a flow designer user, I want to place messaging and webhook connector nodes on the canvas, so that I can model notification, approval-request, and HTTP-trigger steps that connect my workflow to external services.

#### Acceptance Criteria

1. THE `SlackConnectorNode` SHALL render a card that displays the `label` from its `data` prop, a Slack channel field, a message-template field, and a delivery-status indicator with valid values `'pending' | 'sent' | 'failed'`; THE `SlackConnectorNode` SHALL wrap the conceptual purpose of `@/components/automation/integrations/slack-node.tsx` while adding full XYFlow Handle compatibility.
2. THE `TeamsConnectorNode` SHALL render a card that displays the `label` from its `data` prop, a Teams channel or chat field, a message-type selector with valid values `'notification' | 'approval-request'`, and a delivery-status indicator with valid values `'pending' | 'sent' | 'failed'`; THE `TeamsConnectorNode` SHALL wrap the conceptual purpose of `@/components/automation/integrations/teams-node.tsx` while adding full XYFlow Handle compatibility.
3. THE `WebhookConnectorNode` SHALL render a card that displays the `label` from its `data` prop, an endpoint-URL field, an HTTP-method selector with valid values `'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'`, and a last-response-status field showing the HTTP response code; THE `WebhookConnectorNode` SHALL wrap the conceptual purpose of `@/components/automation/integrations/webhook-node.tsx` while adding full XYFlow Handle compatibility.
4. THE `EmailConnectorNode` SHALL render a card that displays the `label` from its `data` prop, a recipient-address field, a subject-line field, and a delivery-status indicator with valid values `'pending' | 'sent' | 'failed'`; THE `EmailConnectorNode` SHALL wrap the conceptual purpose of `@/components/automation/integrations/email-node.tsx` while adding full XYFlow Handle compatibility.
5. EACH integration connector node SHALL expose a `Handle` of type `target` at `Position.Top` and a `Handle` of type `source` at `Position.Bottom` to enable XYFlow edge connections.
6. EACH integration connector node SHALL accept the XYFlow `NodeProps` shape and SHALL be wrapped in `React.memo` to prevent unnecessary re-renders.
7. THE existing integration files (`slack-node.tsx`, `teams-node.tsx`, `webhook-node.tsx`, `email-node.tsx`) SHALL NOT be modified; the new connector nodes SHALL be separate files that reference the same domain concept without importing from the originals.
8. THE `NodeDefinition.category` union type SHALL include `'integrations'` as a valid value, and each integration connector node entry in `nodeCatalog` SHALL have its `category` set to `'integrations'`.

---

### Requirement 16: Extended Node Catalog Categories

**User Story:** As a flow designer user, I want the Node Catalog UI to expose all domain and integration categories as navigable tabs, so that I can browse and discover nodes from any of the eight domain packages without having to scroll through a single mixed list.

#### Acceptance Criteria

1. THE `NodeDefinition.category` union type SHALL include all of the following values: `'core-workflow'`, `'my-standards'`, `'islamic-manufacturing'`, `'gmp'`, `'lean-six-sigma'`, `'human-resources'`, `'six-sigma'`, `'iso'`, `'qms'`, `'integrations'`.
2. THE Node_Catalog SHALL render a visible category tab for each of the ten category values; WHEN a category contains no entries in `nodeCatalog`, THE Node_Catalog SHALL hide that tab.
3. THE `nodeCatalog` array SHALL contain a minimum of 50 entries — the original 25 entries (17 Core_Nodes, 4 MS_Nodes, 4 IM_Nodes) plus a minimum of 25 new entries from Requirements 9–15 (3 GMP + 3 LSS + 3 HR + 3 Six Sigma + 3 ISO + 3 QMS + 4 Integration nodes).
4. WHEN the user types in the search input, THE Node_Catalog SHALL filter nodes across ALL categories simultaneously and SHALL display results grouped by their category header.
5. THE Node_Catalog category tabs SHALL be implemented using `shadcn/ui` `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` and SHALL maintain the existing core-workflow, my-standards, and islamic-manufacturing tab behaviour established in Requirement 6.

---

### Requirement 17: Extended nodeTypeRegistry for New Domain Nodes

**User Story:** As a developer, I want all new domain and integration node components registered in `nodeTypeRegistry`, so that no node dropped onto the XYFlow canvas ever triggers an "Unknown node type" warning for the newly added node types.

#### Acceptance Criteria

1. THE `nodeTypeRegistry` SHALL include the three GMP node components keyed as `'gmp-workflow'`, `'gmp-deviation'`, and `'gmp-cleanliness'`.
2. THE `nodeTypeRegistry` SHALL include the three LSS node components keyed as `'lss-waste-analyzer'`, `'lss-value-stream'`, and `'lss-control-chart'`.
3. THE `nodeTypeRegistry` SHALL include the three HR node components keyed as `'hr-approval'`, `'hr-compliance'`, and `'hr-onboarding'`.
4. THE `nodeTypeRegistry` SHALL include the three Six Sigma node components keyed as `'dmaic-phase'`, `'six-sigma-risk'`, and `'six-sigma-measurement'`.
5. THE `nodeTypeRegistry` SHALL include the three ISO node components keyed as `'iso-audit-plan'`, `'iso-capa'`, and `'iso-compliance-check'`.
6. THE `nodeTypeRegistry` SHALL include the three QMS node components keyed as `'qms-risk-assessment'`, `'qms-document-control'`, and `'qms-spc-chart'`.
7. THE `nodeTypeRegistry` SHALL include the four integration connector node components keyed as `'slack-connector'`, `'teams-connector'`, `'webhook-connector'`, and `'email-connector'`.
8. THE Node_Library SHALL enforce no duplicate keys across all registered entries; WHERE a duplicate key would be introduced by the new registrations, THE Node_Library SHALL surface a TypeScript compile-time error.
9. IF `nodeTypeRegistry` (including all new keys) is passed as the `nodeTypes` prop to an XYFlow `ReactFlow` component and a canvas node carries any of the new type keys, THEN THE XYFlow_Canvas SHALL render that node without logging an "Unknown node type" warning in the browser console.
