// Minimal engine-level types to support registry-driven workflow graph construction.
// Roadmap TODO.md: Shared Types and basic workflow runtime contracts.

import type { z } from 'zod';
import type {
  NodeMetadata,
  RegulatoryMetadata,
  WorkflowNode,
  WorkflowEdge,
  ConnectionRule,
  ValidationResult,
  Agency,
  Standard,
  ComplianceScore,
} from '../types/myqms-shared';


export type {
  NodeMetadata,
  RegulatoryMetadata,
  WorkflowNode,
  WorkflowEdge,
  ConnectionRule,
  ValidationResult,
  Agency,
  Standard,
  ComplianceScore,
};

export type WorkflowRuntimeState = {
  sessionId: string;
  tenantId: string;
  userId: string;
  // Arbitrary workflow-scoped scratchpad.
  context: Record<string, unknown>;
};

export interface ExecuteNodeInput {
  nodeId: string;
  runtime: WorkflowRuntimeState;
}

export interface ExecuteNodeResult {
  nodeId: string;
  // Persisted output for downstream nodes.
  output: Record<string, unknown>;
}

export interface WorkflowExecutor {
  execute(startNodeId: string, runtime: WorkflowRuntimeState): Promise<void>;
}

