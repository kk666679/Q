import { z } from 'zod';

// Core Agent Types
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['quality-manager', 'documentation-manager', 'qa-expert', 'manufacturing-expert', 'construction-expert', 'insurance-expert']),
  description: z.string(),
  capabilities: z.array(z.string()),
  tools: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'busy']),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

// Agent Roles (for use in agent configurations)
export const AgentRole = {
  QUALITY_MANAGER: "quality-manager",
  DOCUMENTATION_MANAGER: "documentation-manager",
  QA_EXPERT: "qa-expert",
  MANUFACTURING_EXPERT: "manufacturing-expert",
  CONSTRUCTION_EXPERT: "construction-expert",
  INSURANCE_EXPERT: "insurance-expert",
} as const;

export type AgentRoleType = typeof AgentRole[keyof typeof AgentRole];

// Agent Config (for agent definitions)
export interface AgentConfig {
  id: string;
  role: AgentRoleType;
  name: string;
  capabilities: string[];
  systemPrompt: string;
  tools: Array<{
    name: string;
    description: string;
    parameters: unknown;
    execute: unknown;
  }>;
}

// Message Types
export const MessageSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  content: z.string(),
  type: z.enum(['user', 'agent', 'system']),
  timestamp: z.date(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Message = z.infer<typeof MessageSchema>;

// Document Types
export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.enum(['procedure', 'policy', 'form', 'template', 'report']),
  version: z.string(),
  status: z.enum(['draft', 'review', 'approved', 'archived']),
  tags: z.array(z.string()),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Document = z.infer<typeof DocumentSchema>;

// Process Types
export const ProcessNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['start', 'end', 'task', 'decision', 'subprocess']),
  label: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.string(), z.any()).optional(),
});

export const ProcessEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  type: z.string().optional(),
});

export const ProcessSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  nodes: z.array(ProcessNodeSchema),
  edges: z.array(ProcessEdgeSchema),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type ProcessNode = z.infer<typeof ProcessNodeSchema>;
export type ProcessEdge = z.infer<typeof ProcessEdgeSchema>;
export type Process = z.infer<typeof ProcessSchema>;

// Compliance Types
export const ComplianceCheckSchema = z.object({
  id: z.string(),
  standard: z.enum(['ISO13485', 'ISO9001', 'FDA21CFR820', 'MDSAP']),
  requirement: z.string(),
  status: z.enum(['compliant', 'non-compliant', 'partial', 'not-applicable']),
  evidence: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendations: z.array(z.string()),
  score: z.number().min(0).max(100),
});

export type ComplianceCheck = z.infer<typeof ComplianceCheckSchema>;

// Audit Types
export const AuditSchema = z.object({
  id: z.string(),
  type: z.enum(['internal', 'external', 'supplier', 'management-review']),
  scope: z.string(),
  auditor: z.string(),
  auditee: z.string(),
  date: z.date(),
  findings: z.array(z.object({
    id: z.string(),
    type: z.enum(['major', 'minor', 'observation', 'opportunity']),
    description: z.string(),
    requirement: z.string(),
    evidence: z.string(),
    corrective_action: z.string().optional(),
  })),
  status: z.enum(['planned', 'in-progress', 'completed', 'closed']),
});

export type Audit = z.infer<typeof AuditSchema>;

// Manufacturing Types
export const OEESchema = z.object({
  availability: z.number().min(0).max(100),
  performance: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
});

export const ManufacturingMetricsSchema = z.object({
  oee: OEESchema,
  throughput: z.number(),
  defectRate: z.number(),
  cycleTime: z.number(),
  downtime: z.number(),
});

export type OEE = z.infer<typeof OEESchema>;
export type ManufacturingMetrics = z.infer<typeof ManufacturingMetricsSchema>;

// Testing Types
export const TestCaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  steps: z.array(z.string()),
  expectedResult: z.string(),
  actualResult: z.string().optional(),
  status: z.enum(['pass', 'fail', 'blocked', 'not-run']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  tags: z.array(z.string()),
});

export type TestCase = z.infer<typeof TestCaseSchema>;

// Construction Types
export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.number(),
  actualCost: z.number().optional(),
  progress: z.number().min(0).max(100),
  risks: z.array(z.object({
    id: z.string(),
    description: z.string(),
    probability: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high']),
    mitigation: z.string(),
  })),
});

export type Project = z.infer<typeof ProjectSchema>;

// Insurance Types
export const ClaimSchema = z.object({
  id: z.string(),
  policyNumber: z.string(),
  claimant: z.string(),
  incidentDate: z.date(),
  reportedDate: z.date(),
  description: z.string(),
  amount: z.number(),
  status: z.enum(['reported', 'investigating', 'approved', 'denied', 'closed']),
  adjusterId: z.string().optional(),
});

export type Claim = z.infer<typeof ClaimSchema>;

// Vector Database Types
export const VectorDocumentSchema = z.object({
  id: z.string(),
  content: z.string(),
  metadata: z.record(z.string(), z.any()),
  embedding: z.array(z.number()).optional(),
});

export type VectorDocument = z.infer<typeof VectorDocumentSchema>;

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
};

// Tool Execution Types
export const ToolExecutionSchema = z.object({
  toolId: z.string(),
  agentId: z.string(),
  parameters: z.record(z.string(), z.any()),
  result: z.any().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  timestamp: z.date(),
});

export type ToolExecution = z.infer<typeof ToolExecutionSchema>;

// Chat Types
export const ChatSessionSchema = z.object({
  id: z.string(),
  participants: z.array(z.string()),
  messages: z.array(MessageSchema),
  status: z.enum(['active', 'paused', 'ended']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ChatSession = z.infer<typeof ChatSessionSchema>;

// Export all schemas for validation
export const schemas = {
  Agent: AgentSchema,
  Message: MessageSchema,
  Document: DocumentSchema,
  ProcessNode: ProcessNodeSchema,
  ProcessEdge: ProcessEdgeSchema,
  Process: ProcessSchema,
  ComplianceCheck: ComplianceCheckSchema,
  Audit: AuditSchema,
  OEE: OEESchema,
  ManufacturingMetrics: ManufacturingMetricsSchema,
  TestCase: TestCaseSchema,
  Project: ProjectSchema,
  Claim: ClaimSchema,
  VectorDocument: VectorDocumentSchema,
  ApiResponse: ApiResponseSchema,
  ToolExecution: ToolExecutionSchema,
  ChatSession: ChatSessionSchema,
};

// Export ISO types
export * from './iso';
