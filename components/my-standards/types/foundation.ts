import { z } from 'zod';

// -----------------------------
// Core enums / primitives
// -----------------------------

export const RiskLevelSchema = z
  .enum(['low', 'medium', 'high', 'critical'])
  .default('medium');
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const WorkflowStatusSchema = z
  .enum(['draft', 'active', 'archived'])
  .default('draft');
export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;

// -----------------------------
// Domain primitives
// -----------------------------

export const AgencySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  country: z.string().default('Malaysia'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: WorkflowStatusSchema,
});
export type Agency = z.infer<typeof AgencySchema>;

export const StandardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  issuingBody: z.string().optional(),
  country: z.string().default('Malaysia'),
  category: z.string().optional(),
  versions: z.array(z.string()).default([]),
  status: WorkflowStatusSchema,
});
export type Standard = z.infer<typeof StandardSchema>;

export const RegulatoryMetadataSchema = z.object({
  agencyId: z.string().min(1).optional(),
  standardId: z.string().min(1).optional(),
  regulation: z.string().optional(),
  applicableJurisdictions: z.array(z.string()).default(['MY']),
  lastReviewedAt: z
    .coerce
    .date()
    .optional()
    .transform((d) => d?.toISOString()),
});
export type RegulatoryMetadata = z.infer<typeof RegulatoryMetadataSchema>;

export const AttachmentSchema = z.object({
  id: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().nonnegative().optional(),
  uploadedAt: z.coerce
    .date()
    .optional()
    .transform((d) => (d ? d.toISOString() : undefined)),
  storageKey: z.string().optional(),
  checksumSha256: z.string().optional(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

export const EvidenceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  attachments: z.array(AttachmentSchema).default([]),
  source: z.string().optional(),
  collectedAt: z
    .coerce
    .date()
    .optional()
    .transform((d) => (d ? d.toISOString() : undefined)),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const RiskScoreSchema = z.object({
  inherent: z.number().min(0).max(100).default(0),
  residual: z.number().min(0).max(100).default(0),
  likelihood: z.number().min(0).max(1).optional(),
  impact: z.number().min(0).max(1).optional(),
  currency: z.string().default('MYR'),
  updatedAt: z
    .coerce
    .date()
    .optional()
    .transform((d) => (d ? d.toISOString() : undefined)),
});
export type RiskScore = z.infer<typeof RiskScoreSchema>;

export const ComplianceRequirementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  agencyId: z.string().min(1).optional(),
  standardId: z.string().min(1).optional(),
  regulation: z.string().optional(),
  clauseRefs: z.array(z.string()).default([]),
  dueInDays: z.number().int().nonnegative().optional(),
  requiredArtifacts: z.array(z.string()).default([]),
});
export type ComplianceRequirement = z.infer<typeof ComplianceRequirementSchema>;

// -----------------------------
// Metadata engines
// -----------------------------

export const NodeMetadataSchema = z.object({
  // Metadata requirements from Phase 7
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),

  category: z.string().min(1),
  agency: z.string().optional(),
  standard: z.string().optional(),
  regulation: z.string().optional(),

  riskLevel: RiskLevelSchema,
  complianceScore: z.number().min(0).max(100).default(50),

  owner: z.string().optional(),
  status: WorkflowStatusSchema,

  evidence: z.array(EvidenceSchema).default([]),
  attachments: z.array(AttachmentSchema).default([]),
  dueDate: z
    .coerce
    .date()
    .optional()
    .transform((d) => (d ? d.toISOString() : undefined)),

  tags: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),

  aiRecommendations: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        confidence: z.number().min(0).max(1).optional(),
        rationale: z.string().optional(),
        recommendedNodeIds: z.array(z.string()).default([]),
      })
    )
    .default([]),

  // Inheritance metadata
  regulatoryMetadata: RegulatoryMetadataSchema.optional(),
  version: z.string().default('1.0.0'),
  createdAt: z
    .coerce
    .date()
    .optional()
    .transform((d) => (d ? d.toISOString() : undefined)),
  updatedAt: z
    .coerce
    .date()
    .optional()
    .transform((d) => (d ? d.toISOString() : undefined)),
});
export type NodeMetadata = z.infer<typeof NodeMetadataSchema>;

// -----------------------------
// Workflow definitions
// -----------------------------

export const WorkflowNodeSchema = z.object({
  metadata: NodeMetadataSchema,
  // Node type id used by registries
  nodeTypeId: z.string().min(1),
  // Custom node configuration payload
  config: z.record(z.string(), z.unknown()).default({}),
});
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;

export const WorkflowEdgeSchema = z.object({
  id: z.string().min(1),
  sourceNodeId: z.string().min(1),
  targetNodeId: z.string().min(1),
  edgeTypeId: z.string().min(1),
  // Per-edge config / constraints
  connectionRules: z
    .array(
      z.object({
        ruleId: z.string().min(1),
        action: z.enum(['allow', 'block']).default('allow'),
        reason: z.string().optional(),
      })
    )
    .default([]),
});
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;

export const ConnectionRuleSchema = z.object({
  id: z.string().min(1),
  fromNodeTypeIds: z.array(z.string().min(1)).default([]),
  toNodeTypeIds: z.array(z.string().min(1)).default([]),
  action: z.enum(['allow', 'block']).default('allow'),
  severity: z.enum(['info', 'warning', 'error']).default('error'),
  rationale: z.string().optional(),
});
export type ConnectionRule = z.infer<typeof ConnectionRuleSchema>;

export const ValidationRuleSchema = z.object({
  id: z.string().min(1),
  scopeNodeTypeIds: z.array(z.string().min(1)).default([]),
  scopeEdgeTypeIds: z.array(z.string().min(1)).default([]),
  // rule kind determines how it is evaluated
  kind: z
    .enum(['requiredFields', 'metadataThreshold', 'connectionRule', 'custom'])
    .default('custom'),
  // JSONLogic-like conditions or a description of evaluation parameters
  params: z.record(z.string(), z.unknown()).default({}),
  severity: z.enum(['info', 'warning', 'error']).default('error'),
  message: z.string().min(1),
  when: z.record(z.string(), z.unknown()).optional(),
});
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;

export const ValidationResultSchema = z.object({
  ruleId: z.string().min(1),
  ok: z.boolean(),
  severity: z.enum(['info', 'warning', 'error']).default('error'),
  message: z.string(),
  path: z.array(z.string()).default([]),
});
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// ─────────────────────────────────────────────────────────────────────────
// Registry-Driven Execution Types (Phase A+B)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Validator hook - runs before/after node execution
 */
export const ValidatorHookSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['pre', 'post', 'condition']),
  name: z.string().min(1),
  description: z.string().optional(),
  // Function stored as string reference for serialization
  functionRef: z.string().min(1),
});
export type ValidatorHook = z.infer<typeof ValidatorHookSchema>;

/**
 * KPI signal - metrics emitted by nodes
 */
export const KPISignalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['compliance', 'performance', 'quality', 'security', 'risk', 'operational']),
  value: z.number(),
  unit: z.string().optional(),
  threshold: z.number().optional(),
  status: z.enum(['green', 'yellow', 'red']).optional(),
  timestamp: z.date().optional(),
  nodeId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});
export type KPISignal = z.infer<typeof KPISignalSchema>;

/**
 * Registry node executor configuration
 */
export const RegistryNodeExecutorSchema = z.object({
  nodeTypeId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['trigger', 'processor', 'validator', 'decision', 'output']),
  inputSchema: z.record(z.any()).optional(),
  outputSchema: z.record(z.any()).optional(),
  // Function stored as string reference for serialization
  executorRef: z.string().min(1),
  validators: z.array(ValidatorHookSchema).optional().default([]),
  kpiSignals: z.array(KPISignalSchema).optional().default([]),
  metadata: z.record(z.any()).optional(),
});
export type RegistryNodeExecutor = z.infer<typeof RegistryNodeExecutorSchema>;

/**
 * MY Standards specific node types
 */
export const MyStandardsNodeTypeSchema = z.enum([
  'registry-trigger',
  'compliance-check',
  'standard-validator',
  'audit-node',
  'capa-generator',
  'kpi-aggregator',
  'risk-assessor',
  'workflow-orchestrator',
  'document-processor',
  'notification-hub',
  'data-processor',
  'custom',
]);
export type MyStandardsNodeType = z.infer<typeof MyStandardsNodeTypeSchema>;

/**
 * Execution context - passed through workflow execution
 */
export const ExecutionContextSchema = z.object({
  executionId: z.string().min(1),
  workflowId: z.string().optional(),
  userId: z.string().optional(),
  timestamp: z.date(),
  variables: z.record(z.any()).optional(),
  kpiSignals: z.array(KPISignalSchema).optional().default([]),
  complianceState: z.record(z.any()).optional(),
  auditTrail: z.array(z.object({
    timestamp: z.date(),
    nodeId: z.string(),
    action: z.string(),
    details: z.record(z.any()).optional(),
  })).optional().default([]),
});
export type ExecutionContext = z.infer<typeof ExecutionContextSchema>;

/**
 * Node execution result with compliance findings
 */
export const NodeExecutionResultSchema = z.object({
  nodeId: z.string(),
  nodeType: z.string(),
  status: z.enum(['pending', 'running', 'success', 'error', 'skipped', 'warning']),
  output: z.any().optional(),
  error: z.string().optional(),
  kpiSignals: z.array(KPISignalSchema).optional().default([]),
  complianceFindings: z.array(z.object({
    standard: z.string(),
    status: z.enum(['compliant', 'non-compliant', 'needs-review', 'na']),
    details: z.string().optional(),
    severity: z.enum(['critical', 'major', 'minor']).optional(),
  })).optional().default([]),
  startTime: z.date(),
  endTime: z.date().optional(),
  duration: z.number().optional(),
  validationErrors: z.array(z.object({
    validator: z.string(),
    message: z.string(),
    severity: z.enum(['error', 'warning']),
  })).optional().default([]),
});
export type NodeExecutionResult = z.infer<typeof NodeExecutionResultSchema>;

/**
 * Compliance & Standards node type definitions
 */
export const ComplianceCheckNodeSchema = z.object({
  nodeType: z.literal('compliance-check'),
  standard: z.string().min(1),
  framework: z.enum(['ISO', 'IEC', 'HACCP', 'GMP', 'REGULATORY', 'CUSTOM', 'MY_STANDARD']),
  requirements: z.array(z.string()).optional().default([]),
  severity: z.enum(['critical', 'major', 'minor']).optional(),
  emitKPIs: z.boolean().optional().default(true),
});
export type ComplianceCheckNode = z.infer<typeof ComplianceCheckNodeSchema>;

export const StandardValidatorNodeSchema = z.object({
  nodeType: z.literal('standard-validator'),
  standardId: z.string().min(1),
  validationRules: z.record(z.any()).optional(),
  emitKPIs: z.boolean().optional().default(true),
  failureMode: z.enum(['block', 'warn', 'log']).optional().default('warn'),
});
export type StandardValidatorNode = z.infer<typeof StandardValidatorNodeSchema>;

export const AuditNodeSchema = z.object({
  nodeType: z.literal('audit-node'),
  auditType: z.enum(['internal', 'external', 'self-assessment', 'compliance']),
  scope: z.array(z.string()).min(1),
  checklist: z.array(z.object({
    id: z.string().min(1),
    question: z.string().min(1),
    expectedResult: z.string().min(1),
    weight: z.number().optional(),
  })).optional(),
  generateReport: z.boolean().optional().default(true),
});
export type AuditNode = z.infer<typeof AuditNodeSchema>;

export const CapaGeneratorNodeSchema = z.object({
  nodeType: z.literal('capa-generator'),
  nonconformanceId: z.string().min(1),
  rootCauseAnalysis: z.boolean().optional().default(true),
  automatedAction: z.boolean().optional().default(false),
  riskMitigation: z.boolean().optional().default(true),
});
export type CapaGeneratorNode = z.infer<typeof CapaGeneratorNodeSchema>;

export const KPIAggregatorNodeSchema = z.object({
  nodeType: z.literal('kpi-aggregator'),
  metrics: z.array(z.string()).min(1),
  aggregationMethod: z.enum(['sum', 'avg', 'max', 'min', 'weighted', 'custom']),
  weights: z.record(z.number()).optional(),
  outputFormat: z.enum(['dashboard', 'report', 'alert', 'raw']).optional().default('dashboard'),
  thresholds: z.record(z.number()).optional(),
});
export type KPIAggregatorNode = z.infer<typeof KPIAggregatorNodeSchema>;

export const RiskAssessorNodeSchema = z.object({
  nodeType: z.literal('risk-assessor'),
  riskFramework: z.enum(['FMEA', 'HAZOP', 'CUSTOM', 'ISO_31000']),
  probability: z.number().min(0).max(1).optional(),
  impact: z.number().min(0).max(1).optional(),
  mitigation: z.string().optional(),
  treatmentPlan: z.string().optional(),
});
export type RiskAssessorNode = z.infer<typeof RiskAssessorNodeSchema>;

export const WorkflowOrchestratorNodeSchema = z.object({
  nodeType: z.literal('workflow-orchestrator'),
  subWorkflowId: z.string().min(1),
  passthrough: z.boolean().optional().default(true),
  parallel: z.boolean().optional().default(false),
  timeout: z.number().optional(),
});
export type WorkflowOrchestratorNode = z.infer<typeof WorkflowOrchestratorNodeSchema>;

export const DocumentProcessorNodeSchema = z.object({
  nodeType: z.literal('document-processor'),
  documentType: z.enum(['standard', 'procedure', 'work-instruction', 'form', 'report']),
  action: z.enum(['generate', 'validate', 'publish', 'archive', 'review']),
  template: z.string().optional(),
});
export type DocumentProcessorNode = z.infer<typeof DocumentProcessorNodeSchema>;

export const NotificationHubNodeSchema = z.object({
  nodeType: z.literal('notification-hub'),
  channels: z.array(z.enum(['email', 'sms', 'dashboard', 'audit-log', 'webhook'])),
  recipients: z.array(z.string()).optional(),
  template: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});
export type NotificationHubNode = z.infer<typeof NotificationHubNodeSchema>;

/**
 * Union of all MY Standards node types
 */
export const MyStandardsNodeDataSchema = z.union([
  ComplianceCheckNodeSchema,
  StandardValidatorNodeSchema,
  AuditNodeSchema,
  CapaGeneratorNodeSchema,
  KPIAggregatorNodeSchema,
  RiskAssessorNodeSchema,
  WorkflowOrchestratorNodeSchema,
  DocumentProcessorNodeSchema,
  NotificationHubNodeSchema,
]);
export type MyStandardsNodeData = z.infer<typeof MyStandardsNodeDataSchema>;

/**
 * Dashboard & Reporting Types
 */
export const ComplianceDashboardStateSchema = z.object({
  overallStatus: z.enum(['compliant', 'non-compliant', 'needs-review', 'unknown']),
  complianceScore: z.number().min(0).max(100),
  kpis: z.array(KPISignalSchema).default([]),
  nonconformances: z.array(z.object({
    id: z.string().min(1),
    standard: z.string().min(1),
    severity: z.enum(['critical', 'major', 'minor']),
    status: z.enum(['open', 'in-progress', 'closed', 'deferred']),
    dueDays: z.number().optional(),
    owner: z.string().optional(),
  })).optional().default([]),
  lastAudit: z.date().optional(),
  nextAudit: z.date().optional(),
  updatedAt: z.date(),
});
export type ComplianceDashboardState = z.infer<typeof ComplianceDashboardStateSchema>;

/**
 * Safe validator wrapper
 */
export function createValidator<T>(
  schema: z.ZodSchema<T>,
  name: string = 'validator'
): (data: unknown) => { valid: boolean; error?: string; data?: T } {
  return (data: unknown) => {
    try {
      const result = schema.parse(data);
      return { valid: true, data: result };
    } catch (error) {
      const message = error instanceof z.ZodError 
        ? error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
        : String(error);
      return { valid: false, error: `${name}: ${message}` };
    }
  };
}

/**
 * Export validators for each node type
 */
export const validators = {
  complianceCheck: createValidator(ComplianceCheckNodeSchema, 'ComplianceCheckNode'),
  standardValidator: createValidator(StandardValidatorNodeSchema, 'StandardValidatorNode'),
  audit: createValidator(AuditNodeSchema, 'AuditNode'),
  capaGenerator: createValidator(CapaGeneratorNodeSchema, 'CapaGeneratorNode'),
  kpiAggregator: createValidator(KPIAggregatorNodeSchema, 'KPIAggregatorNode'),
  riskAssessor: createValidator(RiskAssessorNodeSchema, 'RiskAssessorNode'),
  workflowOrchestrator: createValidator(WorkflowOrchestratorNodeSchema, 'WorkflowOrchestratorNode'),
  documentProcessor: createValidator(DocumentProcessorNodeSchema, 'DocumentProcessorNode'),
  notificationHub: createValidator(NotificationHubNodeSchema, 'NotificationHubNode'),
  myStandardsNodeData: createValidator(MyStandardsNodeDataSchema, 'MyStandardsNodeData'),
  executionContext: createValidator(ExecutionContextSchema, 'ExecutionContext'),
  kpiSignal: createValidator(KPISignalSchema, 'KPISignal'),
};

