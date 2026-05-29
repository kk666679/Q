import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from './trpc';
import type { Project, Document, Process, ComplianceReport } from '@/lib/types';
import {
  ChatInputSchema,
  ExecuteToolInputSchema,
  CreateDocumentSchema,
  UpdateDocumentSchema,
  CreateProcessSchema,
  ComplianceCheckInputSchema,
  GenerateChecklistSchema,
  CreateAuditSchema,
  RecordMetricsSchema,
  OEEQuerySchema,
  CreateProjectSchema,
  GenerateQuoteSchema,
  CreateClaimSchema,
  AgentIdSchema,
  DocumentIdSchema,
  ComplianceStandardSchema,
} from '../validation/schemas';

const sampleProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Global Quality Management System',
    description: 'ISO 9001 implementation for manufacturing and compliance operations.',
    organizationType: 'Manufacturing',
    industry: 'Electronics',
    scope: 'Design, production, and delivery of safety-critical electronics components.',
    status: 'active',
    metadata: { region: 'APAC', country: 'Malaysia' },
    createdAt: new Date('2025-09-12').toISOString(),
    updatedAt: new Date('2026-05-15').toISOString(),
    documentsCount: 18,
    processesCount: 12,
    complianceScore: 87,
  },
  {
    id: 'proj-2',
    name: 'Halal Certification Program',
    description: 'JAKIM halal certification and audit readiness for food and beverage operations.',
    organizationType: 'Food & Beverage',
    industry: 'Halal',
    scope: 'Procurement, manufacturing, labelling, and halal compliance monitoring.',
    status: 'draft',
    metadata: { region: 'APAC', country: 'Malaysia' },
    createdAt: new Date('2025-11-03').toISOString(),
    updatedAt: new Date('2026-04-22').toISOString(),
    documentsCount: 11,
    processesCount: 9,
    complianceScore: 82,
  },
];

const sampleDocuments: Document[] = [
  {
    id: 'doc-1',
    projectId: 'proj-1',
    title: 'ISO 9001 Quality Manual',
    content: 'Defines the scope, policies, and structure of the QMS.',
    type: 'quality-manual',
    version: 2,
    status: 'approved',
    createdBy: 'Alice Quality',
    metadata: {
      isoClauses: ['4.1', '5.1', '7.5'],
      keywords: ['Quality', 'ISO 9001', 'Manual'],
      wordCount: 5230,
    },
    createdAt: new Date('2025-10-12').toISOString(),
    updatedAt: new Date('2026-05-20').toISOString(),
    approvedAt: new Date('2026-05-20').toISOString(),
  },
  {
    id: 'doc-2',
    projectId: 'proj-1',
    title: 'Supplier Approval Procedure',
    content: 'Procedure for qualifying and monitoring supplier performance.',
    type: 'procedure',
    version: 1,
    status: 'draft',
    createdBy: 'Bob Procurement',
    metadata: {
      isoClauses: ['8.4', '9.1'],
      keywords: ['Supplier', 'Procurement', 'Procedure'],
      wordCount: 2860,
    },
    createdAt: new Date('2026-02-14').toISOString(),
    updatedAt: new Date('2026-05-18').toISOString(),
  },
  {
    id: 'doc-3',
    projectId: 'proj-1',
    title: 'Compliance Scan Report',
    content: 'Automated compliance scan summary for ISO 9001 requirements.',
    type: 'compliance-report',
    version: 1,
    status: 'review',
    createdBy: 'Charlie Auditor',
    metadata: {
      isoClauses: ['6.1', '8.3', '9.2'],
      keywords: ['Compliance', 'Audit', 'Report'],
      wordCount: 1890,
    },
    createdAt: new Date('2026-05-28').toISOString(),
    updatedAt: new Date('2026-05-28').toISOString(),
  },
  {
    id: 'doc-4',
    projectId: 'proj-2',
    title: 'Halal Audit Checklist',
    content: 'Checklist used to verify halal production controls and documentation.',
    type: 'procedure',
    version: 1,
    status: 'approved',
    createdBy: 'Dana Compliance',
    metadata: {
      keywords: ['Halal', 'Checklist', 'JAKIM'],
      wordCount: 1320,
    },
    createdAt: new Date('2026-01-09').toISOString(),
    updatedAt: new Date('2026-04-10').toISOString(),
    approvedAt: new Date('2026-04-10').toISOString(),
  },
  {
    id: 'doc-5',
    projectId: 'proj-1',
    title: 'Training Record Template',
    content: 'Template for capturing employee competence and training evidence.',
    type: 'form',
    version: 1,
    status: 'draft',
    createdBy: 'Eve HR',
    metadata: {
      isoClauses: ['7.2', '7.3'],
      keywords: ['Training', 'HR', 'Records'],
      wordCount: 740,
    },
    createdAt: new Date('2026-03-05').toISOString(),
    updatedAt: new Date('2026-05-12').toISOString(),
  },
];

const sampleComplianceReport: ComplianceReport = {
  id: 'report-1',
  documentId: 'doc-3',
  projectId: 'proj-1',
  findings: [
    {
      id: 'finding-1',
      documentId: 'doc-2',
      clause: '5.1',
      status: 'partial',
      severity: 'major',
      explanation: 'Leadership commitment is referenced but not formally documented for the management review cycle.',
      suggestion: 'Capture the management review schedule and attendees in the quality manual.',
      reference: '5.1',
      confidence: 0.91,
    },
    {
      id: 'finding-2',
      documentId: 'doc-5',
      clause: '7.2',
      status: 'compliant',
      severity: 'observation',
      explanation: 'Training records exist but are not linked to the competence matrix.',
      suggestion: 'Add a traceability link from employee training records to the competence matrix.',
      reference: '7.2',
      confidence: 0.84,
    },
    {
      id: 'finding-3',
      documentId: 'doc-2',
      clause: '8.3',
      status: 'non-compliant',
      severity: 'critical',
      explanation: 'Design change control records are missing approval evidence for a recent process update.',
      suggestion: 'Implement a change control log with approval sign-off and revision history.',
      reference: '8.3',
      confidence: 0.95,
    },
  ],
  score: 87,
  passed: false,
  summary: 'The latest compliance scan found 3 findings across leadership, training, and design control.',
  recommendations: ['Document management review evidence', 'Link training records to competence requirements', 'Formalize change control approvals.'],
  scannedAt: new Date('2026-05-28T08:30:00.000Z').toISOString(),
  metadata: {
    documentsScanned: 14,
    clausesChecked: ['4.1', '5.1', '6.1', '7.2', '8.3', '9.2'],
    processingTime: 120,
    modelUsed: 'compliance-ai-v1',
  },
};

const sampleDashboardStats = {
  totalProjects: 2,
  activeProjects: 1,
  totalDocuments: sampleDocuments.length,
  approvedDocuments: sampleDocuments.filter((doc) => doc.status === 'approved').length,
  totalProcesses: 12,
  complianceScore: 87,
  recentActivity: [
    { id: 'act-1', title: 'Compliance scan completed', description: 'ISO 9001 compliance scan completed for Project 1.', timestamp: new Date('2026-05-28T08:30:00.000Z').toISOString() },
    { id: 'act-2', title: 'Supplier approval updated', description: 'Supplier approval procedure draft updated.', timestamp: new Date('2026-05-25T16:12:00.000Z').toISOString() },
    { id: 'act-3', title: 'Halal audit checklist approved', description: 'Halal audit checklist approved and published.', timestamp: new Date('2026-04-10T10:20:00.000Z').toISOString() },
  ] as unknown[],
};

// ── Agent ─────────────────────────────────────────────────────────────────────
export const agentRouter = router({
  list: publicProcedure.query(async () => [] as unknown[]),

  get: publicProcedure
    .input(z.object({ id: AgentIdSchema }))
    .query(async ({ input }) => {
      void input;
      return null;
    }),

  chat: publicProcedure
    .input(ChatInputSchema)
    .mutation(async ({ input, ctx }) => {
      return {
        userMessage: {
          id: `msg-${Date.now()}`, agentId: input.agentId,
          content: input.message, type: 'user' as const, timestamp: new Date(),
        },
        agentResponse: {
          id: `msg-${Date.now() + 1}`, agentId: input.agentId,
          content: 'Response', type: 'agent' as const, timestamp: new Date(),
        },
        sessionId: input.sessionId ?? `session-${Date.now()}`,
        userId:    ctx.userId,
      };
    }),

  executeTool: publicProcedure
    .input(ExecuteToolInputSchema)
    .mutation(async ({ input }) => ({
      executionId: `exec-${Date.now()}`,
      result:      { success: true, toolId: input.toolId },
    })),
});

// ── Project ───────────────────────────────────────────────────────────────────
export const projectRouter = router({
  list: publicProcedure.query(async () => sampleProjects),

  get: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .query(async ({ input }) => sampleProjects.find((project) => project.id === input.id) ?? null),

  create: publicProcedure
    .input(z.object({
      name:             z.string().min(1).max(256).trim(),
      description:      z.string().max(2000).optional(),
      organizationType: z.string().max(128),
      industry:         z.string().max(128),
      scope:            z.string().max(2000),
    }))
    .mutation(async ({ input }) => ({
      id: `proj-${Date.now()}`, ...input,
      status: 'draft' as const, createdAt: new Date(), updatedAt: new Date(),
    })),

  update: publicProcedure
    .input(z.object({
      id:   z.string().min(1).max(128),
      data: z.object({
        name:             z.string().min(1).max(256).trim().optional(),
        description:      z.string().max(2000).optional(),
        organizationType: z.string().max(128).optional(),
        industry:         z.string().max(128).optional(),
        scope:            z.string().max(2000).optional(),
        status:           z.enum(['draft', 'active', 'archived']).optional(),
      }),
    }))
    .mutation(async () => null),

  delete: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .mutation(async () => true),
});

// ── Document ──────────────────────────────────────────────────────────────────
export const documentRouter = router({
  list: publicProcedure
    .input(z.object({
      type:   z.string().max(64).optional(),
      status: z.string().max(64).optional(),
      tags:   z.array(z.string().max(64)).max(20).optional(),
    }).optional())
    .query(async ({ input }) => sampleDocuments.filter((document) => {
      if (!input) return true;
      if (input.type && document.type !== input.type) return false;
      if (input.status && document.status !== input.status) return false;
      if (input.tags && input.tags.length > 0) {
        const keywords = document.metadata?.keywords ?? [];
        return input.tags.every((tag) => keywords.includes(tag));
      }
      return true;
    })),

  get: publicProcedure
    .input(z.object({ id: DocumentIdSchema }))
    .query(async () => null as Document | null),

  create: publicProcedure
    .input(CreateDocumentSchema)
    .mutation(async ({ input }) => ({
      id: `doc-${Date.now()}`, projectId: 'default',
      ...input, createdAt: new Date(), updatedAt: new Date(),
    })),

  update: publicProcedure
    .input(UpdateDocumentSchema)
    .mutation(async () => null),

  validate: publicProcedure
    .input(z.object({ id: DocumentIdSchema }))
    .mutation(async () => ({ valid: true, issues: [] as string[] })),
});

// ── Process ───────────────────────────────────────────────────────────────────
export const processRouter = router({
  list: publicProcedure.query(async () => [] as Process[]),

  get: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .query(async () => null as Process | null),

  create: publicProcedure
    .input(CreateProcessSchema)
    .mutation(async ({ input }) => ({
      id: `proc-${Date.now()}`, ...input,
      flowData: { nodes: [], edges: [] }, createdAt: new Date(), updatedAt: new Date(),
    })),

  update: publicProcedure
    .input(z.object({
      id:   z.string().min(1).max(128),
      data: z.object({
        name:        z.string().min(1).max(256).trim().optional(),
        description: z.string().max(2000).optional(),
        type:        z.string().max(64).optional(),
      }),
    }))
    .mutation(async () => null),

  validate: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .mutation(async () => ({ valid: true, issues: [] as string[] })),
});

// ── Compliance ────────────────────────────────────────────────────────────────
export const complianceRouter = router({
  check: publicProcedure
    .input(ComplianceCheckInputSchema)
    .mutation(async () => sampleComplianceReport.findings.map((finding) => ({
      clause: finding.clause,
      severity: finding.severity,
      status: finding.status,
      explanation: finding.explanation,
    }))),

  getReport: publicProcedure
    .input(z.object({ standard: ComplianceStandardSchema.optional(), id: z.string().max(128).optional() }))
    .query(async ({ input }) => {
      if (input?.id) {
        return sampleComplianceReport.id === input.id ? sampleComplianceReport : null;
      }
      return sampleComplianceReport;
    }),
});

// ── Audit ─────────────────────────────────────────────────────────────────────
export const auditRouter = router({
  generateChecklist: publicProcedure
    .input(GenerateChecklistSchema)
    .mutation(async ({ input }) => ({
      auditType: input.auditType, scope: input.scope, checklist: [] as unknown[],
    })),

  create: publicProcedure
    .input(CreateAuditSchema)
    .mutation(async ({ input }) => ({ id: `audit-${Date.now()}`, ...input })),

  list: publicProcedure.query(async () => [] as unknown[]),
});

// ── Testing ───────────────────────────────────────────────────────────────────
const TestCaseInputSchema = z.object({
  title:          z.string().min(1).max(256).trim(),
  description:    z.string().max(2000),
  steps:          z.array(z.string().max(1000)).max(100),
  expectedResult: z.string().max(2000),
  priority:       z.enum(['low', 'medium', 'high', 'critical']),
  tags:           z.array(z.string().max(64)).max(20).default([]),
});

export const testingRouter = router({
  createTestCase: publicProcedure
    .input(TestCaseInputSchema)
    .mutation(async ({ input }) => ({ id: `tc-${Date.now()}`, ...input, status: 'not-run' as const })),

  executeTest: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .mutation(async ({ input }) => ({ id: input.id, status: 'pass' as const })),

  getCoverage: publicProcedure
    .query(async () => ({ total: 0, executed: 0, passed: 0, coverage: 0, passRate: 0 })),

  analyzeCoverage: publicProcedure
    .input(z.object({ projectId: z.string().min(1).max(128) }))
    .mutation(async () => ({
      gaps: [] as string[], recommendations: [] as string[],
      metrics: { statement: 85, branch: 78, function: 92, line: 88 },
    })),

  calculateMetrics: publicProcedure
    .input(z.object({ projectId: z.string().min(1).max(128) }))
    .query(async () => ({
      testCases: 150, passed: 142, failed: 8, coverage: 87.5, value: 85.5, trend: 'up' as const,
    })),

  analyzeDefects: publicProcedure
    .input(z.object({ projectId: z.string().min(1).max(128) }))
    .query(async () => ({
      topComponents: ['Component A', 'Component B'], recommendations: [] as string[],
      totalDefects: 47, trend: 'down' as const,
      distribution: { critical: 5, high: 12, medium: 20, low: 10 },
    })),
});

// ── Manufacturing ─────────────────────────────────────────────────────────────
export const manufacturingRouter = router({
  recordMetrics: publicProcedure
    .input(RecordMetricsSchema)
    .mutation(async ({ input }) => ({ id: `metric-${Date.now()}`, ...input })),

  getOEE: publicProcedure
    .input(OEEQuerySchema)
    .query(async () => ({ availability: 0, performance: 0, quality: 0, overall: 0 })),

  analyzeMetrics: publicProcedure
    .input(z.object({ startDate: z.coerce.date(), endDate: z.coerce.date() }))
    .query(async () => ({
      recommendations: [] as string[], yieldRate: '97.5', defectRate: '2.5', efficiency: '88.5',
    })),

  predictMaintenance: publicProcedure
    .input(z.object({ equipmentId: z.string().min(1).max(128) }))
    .mutation(async () => ({ predictions: [] as unknown[], recommendations: [] as string[] })),
});

// ── Construction ──────────────────────────────────────────────────────────────
export const constructionRouter = router({
  createProject: publicProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ input }) => ({ id: `cproj-${Date.now()}`, ...input, progress: 0 })),

  updateProgress: publicProcedure
    .input(z.object({
      id:       z.string().min(1).max(128),
      progress: z.number().min(0).max(100),
      notes:    z.string().max(2000).optional(),
    }))
    .mutation(async ({ input }) => input),

  estimateCost: publicProcedure
    .input(z.object({ projectId: z.string().min(1).max(128) }))
    .mutation(async () => ({ estimated: 0, breakdown: {} as Record<string, number> })),
});

// ── Insurance ─────────────────────────────────────────────────────────────────
export const insuranceRouter = router({
  createClaim: publicProcedure
    .input(CreateClaimSchema)
    .mutation(async ({ input }) => ({
      id: `claim-${Date.now()}`, ...input, status: 'reported' as const, reportedDate: new Date(),
    })),

  processClaim: publicProcedure
    .input(z.object({
      id:     z.string().min(1).max(128),
      action: z.enum(['approve', 'deny', 'investigate']),
      notes:  z.string().max(2000).optional(),
    }))
    .mutation(async ({ input }) => input),

  generateQuote: publicProcedure
    .input(GenerateQuoteSchema)
    .mutation(async ({ input }) => ({
      policyType: input.policyType, coverage: input.coverage,
      premium: input.coverage * 0.02, riskFactors: input.riskFactors,
    })),
});

// ── Imports ───────────────────────────────────────────────────────────────────
import { msRouter }           from './ms-router';
import { isoRouter }          from './iso-router';
import { aiRouter }           from './ai-router';

// ── App Router ────────────────────────────────────────────────────────────────
export const appRouter = router({
  agent:          agentRouter,
  project:        projectRouter,
  document:       documentRouter,
  process:        processRouter,
  compliance:     complianceRouter,
  audit:          auditRouter,
  testing:        testingRouter,
  manufacturing:  manufacturingRouter,
  construction:   constructionRouter,
  insurance:      insuranceRouter,
  ms:             msRouter,
  iso:            isoRouter,
  ai:             aiRouter,
  dashboard: router({
    getStats: publicProcedure.query(async () => sampleDashboardStats),
  }),
});

export type AppRouter = typeof appRouter;
