// QMS SDK Core Types

export type ProjectStatus = 'draft' | 'active' | 'archived'

export type DocumentType =
  | 'quality-manual'
  | 'quality-policy'
  | 'procedure'
  | 'work-instruction'
  | 'form'
  | 'record'
  | 'compliance-report'

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'obsolete'

export type ProcessType = 'core' | 'support' | 'management'

export type AgentRole =
  | 'supervisor'
  | 'process-analyst'
  | 'document-drafter'
  | 'procedure-generator'
  | 'compliance-checker'

export type ComplianceSeverity = 'critical' | 'major' | 'minor' | 'observation'

export type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant' | 'not-applicable'

export interface Project {
  id: string
  name: string
  description?: string
  organizationType: string
  industry: string
  scope: string
  status: ProjectStatus
  metadata: Record<string, unknown>
  createdAt: Date | string
  updatedAt: Date | string
  documentsCount?: number
  processesCount?: number
  complianceScore?: number
}

export interface FlowNode {
  id: string
  type: 'process' | 'decision' | 'start' | 'end' | 'document'
  position: { x: number; y: number }
  data: {
    label: string
    description?: string
    responsible?: string
    documents?: string[]
    duration?: number
  }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  label?: string
  type?: string
}

export interface FlowData {
  nodes: FlowNode[]
  edges: FlowEdge[]
  viewport?: { x: number; y: number; zoom: number }
}

export interface ProcessMetric {
  name: string
  description: string
  target?: string
  unit?: string
}

export interface Process {
  id: string
  projectId: string
  name: string
  description: string
  type: ProcessType
  flowData: FlowData
  inputs: string[]
  outputs: string[]
  owner?: string
  metrics?: ProcessMetric[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface DocumentMetadata {
  isoClauses?: string[]
  references?: string[]
  keywords?: string[]
  complexity?: number
  wordCount?: number
}

export interface Document {
  id: string
  projectId: string
  title: string
  content: string
  type: DocumentType
  version: number
  status: DocumentStatus
  createdBy: string
  metadata: DocumentMetadata
  createdAt: Date | string
  updatedAt: Date | string
  approvedAt?: Date | string | string
}

export interface ComplianceFinding {
  id: string
  documentId: string
  clause: string
  status: ComplianceStatus
  severity: ComplianceSeverity
  explanation: string
  suggestion: string
  reference: string
  confidence?: number
}

export interface ComplianceReport {
  id: string
  documentId: string
  projectId: string
  findings: ComplianceFinding[]
  score: number
  passed: boolean
  summary: string
  recommendations?: string[]
  scannedAt: Date | string
  metadata?: {
    documentsScanned?: number
    clausesChecked?: string[]
    processingTime?: number
    modelUsed?: string
  }
}

export interface AgentMessage {
  id: string
  role: AgentRole | 'user' | 'assistant'
  content: string
  timestamp: Date | string
  metadata?: Record<string, unknown>
}

export interface AgentTask {
  id: string
  type: string
  input: Record<string, unknown>
  output?: Record<string, unknown>
  status: 'pending' | 'processing' | 'completed' | 'failed'
  assignedTo?: AgentRole
  projectId: string
  createdAt: Date | string
  completedAt?: Date | string | string
}

// ISO 9001 Clauses
export const ISO_CLAUSES = [
  { number: '4.1', title: 'Understanding the organization and its context' },
  { number: '4.2', title: 'Understanding the needs and expectations of interested parties' },
  { number: '4.3', title: 'Determining the scope of the quality management system' },
  { number: '4.4', title: 'Quality management system and its processes' },
  { number: '5.1', title: 'Leadership and commitment' },
  { number: '5.2', title: 'Quality policy' },
  { number: '5.3', title: 'Organizational roles, responsibilities and authorities' },
  { number: '6.1', title: 'Actions to address risks and opportunities' },
  { number: '6.2', title: 'Quality objectives and planning to achieve them' },
  { number: '6.3', title: 'Planning of changes' },
  { number: '7.1', title: 'Resources' },
  { number: '7.2', title: 'Competence' },
  { number: '7.3', title: 'Awareness' },
  { number: '7.4', title: 'Communication' },
  { number: '7.5', title: 'Documented information' },
  { number: '8.1', title: 'Operational planning and control' },
  { number: '8.2', title: 'Requirements for products and services' },
  { number: '8.3', title: 'Design and development of products and services' },
  { number: '8.4', title: 'Control of externally provided processes, products and services' },
  { number: '8.5', title: 'Production and service provision' },
  { number: '8.6', title: 'Release of products and services' },
  { number: '8.7', title: 'Control of nonconforming outputs' },
  { number: '9.1', title: 'Monitoring, measurement, analysis and evaluation' },
  { number: '9.2', title: 'Internal audit' },
  { number: '9.3', title: 'Management review' },
  { number: '10.1', title: 'General (Improvement)' },
  { number: '10.2', title: 'Nonconformity and corrective action' },
  { number: '10.3', title: 'Continual improvement' },
] as const
