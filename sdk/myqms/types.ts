import { z } from 'zod';

// ============================================
// SHARED METADATA TYPES
// ============================================

export const NodeMetadataSchema = z.object({
  // Registry key, e.g. `core:start` or `standards:iso9001:clause`.
  nodeType: z.string().min(1).max(128),

  // Human-friendly label for palettes/preview.
  label: z.string().min(1).max(256),

  // Domain tags to power filtering.
  categories: z.array(z.string().min(1).max(64)).default([]),

  // Regulatory/standard coverage (optional).
  regulatory: z
    .object({
      agencyId: z.string().min(1).max(128).optional(),
      standardId: z.string().min(1).max(128).optional(),
      jurisdiction: z.string().min(1).max(128).optional(),
    })
    .optional(),

  // UI hints.
  ui: z
    .object({
      icon: z.string().min(1).max(256).optional(),
      color: z.string().min(1).max(32).optional(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
    })
    .optional(),
});

export type NodeMetadata = z.infer<typeof NodeMetadataSchema>;

// --------------------------------------------

export const AgencySchema = z.object({
  id: z.string().min(1).max(128),
  name: z.string().min(1).max(256),
  jurisdiction: z.string().min(1).max(128).optional(),
  website: z.string().min(1).max(512).optional(),
});

export type Agency = z.infer<typeof AgencySchema>;

export const StandardSchema = z.object({
  id: z.string().min(1).max(128),
  name: z.string().min(1).max(256),
  type: z.enum(['malaysian-standard', 'iso', 'grc-framework', 'halal', 'other']),
  agencyId: z.string().min(1).max(128).optional(),
  version: z.string().min(1).max(64).optional(),
  url: z.string().min(1).max(512).optional(),
});

export type Standard = z.infer<typeof StandardSchema>;

// --------------------------------------------

export const RegulatoryMetadataSchema = z.object({
  agencyId: z.string().min(1).max(128).optional(),
  standardId: z.string().min(1).max(128).optional(),
  jurisdiction: z.string().min(1).max(128).optional(),
  complianceAreaTags: z.array(z.string().min(1).max(64)).default([]),
});

export type RegulatoryMetadata = z.infer<typeof RegulatoryMetadataSchema>;

// ============================================
// WORKFLOW GRAPH TYPES
// ============================================

export const WorkflowNodeSchema = z.object({
  id: z.string().min(1).max(128),
  type: z.string().min(1).max(128),
  position: z.object({ x: z.number().finite(), y: z.number().finite() }),
  data: z.record(z.string(), z.any()).default({}),
  metadata: NodeMetadataSchema.optional(),
});

export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;

// --------------------------------------------

export const WorkflowEdgeSchema = z.object({
  id: z.string().min(1).max(128),
  type: z.string().min(1).max(128),
  source: z.string().min(1).max(128),
  target: z.string().min(1).max(128),
  label: z.string().optional(),
  data: z.record(z.string(), z.any()).default({}),
  metadata: RegulatoryMetadataSchema.optional(),
});

export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;

// ============================================
// CONNECTION RULES & VALIDATION
// ============================================

export const ConnectionRuleSchema = z.object({
  // Edge type allowed for the connection.
  edgeTypes: z.array(z.string().min(1).max(128)).default([]),

  // Allowed node type prefixes (e.g. `core:` or `standards:`).
  fromNodeTypePrefixes: z.array(z.string().min(1).max(64)).default([]),
  toNodeTypePrefixes: z.array(z.string().min(1).max(64)).default([]),

  // Optional: hard allow/deny.
  decision: z.enum(['allow', 'deny']).optional(),
});

export type ConnectionRule = z.infer<typeof ConnectionRuleSchema>;

export const ValidationResultSchema = z.object({
  ok: z.boolean(),
  errors: z.array(
    z.object({
      code: z.string().min(1).max(128),
      message: z.string().min(1).max(1024),
      nodeId: z.string().min(1).max(128).optional(),
      edgeId: z.string().min(1).max(128).optional(),
    }),
  ),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// ============================================
// COMPLIANCE SCORE
// ============================================

export const ComplianceScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  breakdown: z
    .array(
      z.object({
        area: z.string().min(1).max(128),
        score: z.number().min(0).max(100),
      }),
    )
    .default([]),
  updatedAt: z.string().min(1).max(64).optional(),
});

export type ComplianceScore = z.infer<typeof ComplianceScoreSchema>;

// Convenience aggregates
export const MyQmsTypes = {
  NodeMetadataSchema,
  RegulatoryMetadataSchema,
  WorkflowNodeSchema,
  WorkflowEdgeSchema,
  ConnectionRuleSchema,
  ValidationResultSchema,
  AgencySchema,
  StandardSchema,
  ComplianceScoreSchema,
};

