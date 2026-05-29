/**
 * SDK Types
 * 
 * Shared type definitions for the SDK layer.
 */

// Re-export types from the SDK
export type {
  ModelProvider,
  ModelCapabilities,
  ModelDefinition,
  ModelConfig,
  ProviderInfo,
  StructuredRAGOutput,
} from '@/sdk/types';

/**
 * AI Configuration
 */
export interface AIConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  system?: string;
}

/**
 * AI Message type — simple role/content shape compatible with AI SDK ModelMessage
 */
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  id?: string;
  timestamp?: Date;
}

/**
 * Options for text generation
 */
export interface AIGenerateOptions extends AIConfig {
  messages: AIMessage[];
}

/**
 * Options for streaming text generation
 */
export interface AIStreamOptions extends AIGenerateOptions {
  onFinish?: (event: {
    text: string;
    finishReason: string;
    usage: { promptTokens: number; completionTokens: number };
  }) => void;
}

/**
 * Document types
 */
export interface Document {
  id: string;
  title: string;
  content: string;
  type: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  tags: string[];
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Process types
 */
export interface Process {
  id: string;
  name: string;
  description: string;
  type: string;
  projectId: string;
  flowData: {
    nodes: ProcessNode[];
    edges: ProcessEdge[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

/**
 * Agent types
 */
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  capabilities: string[];
  systemPrompt: string;
}

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Compliance check result
 */
export interface ComplianceResult {
  standard: string;
  clause: string;
  status: 'compliant' | 'partial' | 'gap';
  description: string;
  recommendations: string[];
}

/**
 * Risk assessment
 */
export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number;
  impact: number;
  riskScore: number;
  mitigation: string;
  owner: string;
  status: 'identified' | 'mitigating' | 'resolved' | 'accepted';
}

/**
 * Audit finding
 */
export interface AuditFinding {
  id: string;
  type: 'observation' | 'minor' | 'major' | 'critical';
  clause: string;
  description: string;
  evidence: string;
  correctiveAction?: string;
  status: 'open' | 'in-progress' | 'closed';
}
