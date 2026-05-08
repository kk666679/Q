import { z } from 'zod';

// ── Primitives ────────────────────────────────────────────────────────────────
export const AgentIdSchema    = z.string().regex(/^[a-z0-9-]+$/, 'Invalid agent id').max(64);
export const SessionIdSchema  = z.string().uuid().optional();
export const MessageSchema    = z.string().min(1).max(32_000).trim();
export const DocumentIdSchema = z.string().min(1).max(128);
export const TenantIdSchema   = z.string().min(1).max(128);

// ── Agent ─────────────────────────────────────────────────────────────────────
export const ChatInputSchema = z.object({
  agentId:   AgentIdSchema,
  message:   MessageSchema,
  sessionId: SessionIdSchema,
});

export const ExecuteToolInputSchema = z.object({
  agentId:    AgentIdSchema,
  toolId:     z.string().regex(/^[a-z0-9_-]+$/).max(64),
  parameters: z.record(z.string(), z.unknown()),
});

// ── Document ──────────────────────────────────────────────────────────────────
export const DocumentTypeSchema   = z.enum(['procedure', 'policy', 'form', 'template', 'report']);
export const DocumentStatusSchema = z.enum(['draft', 'review', 'approved', 'archived']);

export const CreateDocumentSchema = z.object({
  title:   z.string().min(1).max(256).trim(),
  content: z.string().min(1).max(500_000),
  type:    DocumentTypeSchema,
  version: z.string().regex(/^\d+\.\d+(\.\d+)?$/).default('1.0'),
  status:  DocumentStatusSchema.default('draft'),
  tags:    z.array(z.string().max(64)).max(20).default([]),
});

export const UpdateDocumentSchema = z.object({
  id:   DocumentIdSchema,
  data: z.object({
    title:   z.string().min(1).max(256).trim().optional(),
    content: z.string().max(500_000).optional(),
    type:    DocumentTypeSchema.optional(),
    version: z.string().regex(/^\d+\.\d+(\.\d+)?$/).optional(),
    status:  DocumentStatusSchema.optional(),
    tags:    z.array(z.string().max(64)).max(20).optional(),
  }),
});

// ── Process ───────────────────────────────────────────────────────────────────
export const CreateProcessSchema = z.object({
  name:        z.string().min(1).max(256).trim(),
  description: z.string().max(2000).trim(),
  type:        z.string().max(64),
  projectId:   z.string().min(1).max(128),
});

// ── Compliance ────────────────────────────────────────────────────────────────
export const ComplianceStandardSchema = z.enum([
  'ISO9001', 'ISO14001', 'ISO45001', 'ISO17025', 'ISO17020', 'ISO27001',
]);

export const ComplianceCheckInputSchema = z.object({
  standard:     ComplianceStandardSchema.optional(),
  documentId:   DocumentIdSchema.optional(),
  requirements: z.array(z.string().max(1000)).max(100).optional(),
});

// ── Audit ─────────────────────────────────────────────────────────────────────
export const AuditTypeSchema = z.enum(['internal', 'external', 'supplier', 'management-review']);

export const GenerateChecklistSchema = z.object({
  auditType: AuditTypeSchema,
  scope:     z.string().min(1).max(2000).trim(),
  standard:  ComplianceStandardSchema.optional(),
});

export const CreateAuditSchema = z.object({
  type:     AuditTypeSchema,
  scope:    z.string().min(1).max(2000).trim(),
  auditor:  z.string().min(1).max(256).trim(),
  auditee:  z.string().min(1).max(256).trim(),
  date:     z.coerce.date(),
  standard: ComplianceStandardSchema.optional(),
});

// ── Manufacturing ─────────────────────────────────────────────────────────────
export const RecordMetricsSchema = z.object({
  availability: z.number().min(0).max(100),
  performance:  z.number().min(0).max(100),
  quality:      z.number().min(0).max(100),
  throughput:   z.number().min(0).optional(),
  defectRate:   z.number().min(0).max(100).optional(),
  cycleTime:    z.number().min(0).optional(),
  downtime:     z.number().min(0).optional(),
});

export const OEEQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate:   z.coerce.date(),
}).refine(d => d.endDate > d.startDate, { message: 'endDate must be after startDate' });

// ── Construction ──────────────────────────────────────────────────────────────
export const CreateProjectSchema = z.object({
  name:        z.string().min(1).max(256).trim(),
  description: z.string().max(2000).trim(),
  budget:      z.number().min(0),
  startDate:   z.coerce.date(),
  endDate:     z.coerce.date(),
}).refine(d => d.endDate > d.startDate, { message: 'endDate must be after startDate' });

// ── Insurance ─────────────────────────────────────────────────────────────────
export const PolicyTypeSchema = z.enum(['property', 'liability', 'workers-comp', 'professional']);

export const GenerateQuoteSchema = z.object({
  policyType:  PolicyTypeSchema,
  coverage:    z.number().min(0),
  riskFactors: z.array(z.string().max(256)).max(50).default([]),
});

export const CreateClaimSchema = z.object({
  policyNumber:  z.string().min(1).max(64).trim(),
  claimant:      z.string().min(1).max(256).trim(),
  incidentDate:  z.coerce.date(),
  description:   z.string().min(1).max(5000).trim(),
  amount:        z.number().min(0),
});

// ── Vector / RAG ──────────────────────────────────────────────────────────────
export const RAGQuerySchema = z.object({
  query:  z.string().min(1).max(4000).trim(),
  domain: z.string().max(64).default('ISO'),
  topK:   z.number().int().min(1).max(50).default(10),
});
