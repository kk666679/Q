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

