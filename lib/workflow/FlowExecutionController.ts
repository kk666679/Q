/**
 * Flow Execution Controller
 * 
 * Workflow execution engine for running workflows created in the FlowDesigner.
 * This provides the single source of truth for workflow execution.
 */

import type { Node, Edge } from "@xyflow/react";
import { logger } from '../../sdk/utils/logger';

export interface WorkflowExecutionContext {
  nodes: Node[];
  edges: Edge[];
  variables: Record<string, unknown>;
  results: Map<string, NodeExecutionResult>;
}

export interface NodeExecutionResult {
  nodeId: string;
  nodeType: string;
  status: "pending" | "running" | "success" | "error";
  output?: unknown;
  error?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

export interface ExecutionResult {
  success: boolean;
  results: NodeExecutionResult[];
  totalDuration: number;
  output?: unknown;
}

export type NodeExecutor = (
  node: Node,
  context: WorkflowExecutionContext
) => Promise<NodeExecutionResult>;

// Node executor registry
const nodeExecutors: Record<string, NodeExecutor> = {};

/**
 * Register a custom node executor
 */
export function registerNodeExecutor(
  nodeType: string,
  executor: NodeExecutor
): void {
  nodeExecutors[nodeType] = executor;
}

// Default trigger executor
async function executeTrigger(
  node: Node,
  _context: WorkflowExecutionContext
): Promise<NodeExecutionResult> {
  const startTime = new Date();
  logger.info('Trigger: starting workflow', { event: String(node.data?.event ?? '') });

  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    nodeId: node.id,
    nodeType: "trigger",
    status: "success",
    output: { event: node.data?.event, source: node.data?.source },
    startTime,
    endTime: new Date(),
    duration: Date.now() - startTime.getTime(),
  };
}

// Default task executor
async function executeTask(
  node: Node,
  _context: WorkflowExecutionContext
): Promise<NodeExecutionResult> {
  const startTime = new Date();
  logger.info('Task: executing', { title: String(node.data?.title ?? '') });

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    nodeId: node.id,
    nodeType: "task",
    status: "success",
    output: { title: node.data?.title, result: "Task completed" },
    startTime,
    endTime: new Date(),
    duration: Date.now() - startTime.getTime(),
  };
}

// Default condition executor
async function executeCondition(
  node: Node,
  _context: WorkflowExecutionContext
): Promise<NodeExecutionResult> {
  const startTime = new Date();
  logger.info('Condition: evaluating', { condition: String(node.data?.condition ?? '') });

  await new Promise((resolve) => setTimeout(resolve, 100));

  const result = Math.random() > 0.5;

  return {
    nodeId: node.id,
    nodeType: "condition",
    status: "success",
    output: { condition: node.data?.condition, result },
    startTime,
    endTime: new Date(),
    duration: Date.now() - startTime.getTime(),
  };
}

// Default action executor
async function executeAction(
  node: Node,
  _context: WorkflowExecutionContext
): Promise<NodeExecutionResult> {
  const startTime = new Date();
  logger.info('Action: executing', { action: String(node.data?.action ?? '') });

  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    nodeId: node.id,
    nodeType: "action",
    status: "success",
    output: { action: node.data?.action, provider: node.data?.provider },
    startTime,
    endTime: new Date(),
    duration: Date.now() - startTime.getTime(),
  };
}

// Default wait executor
async function executeWait(
  node: Node,
  _context: WorkflowExecutionContext
): Promise<NodeExecutionResult> {
  const startTime = new Date();
  logger.info('Wait: pausing', { duration: String(node.data?.duration ?? ''), unit: String(node.data?.unit ?? '') });

  // For demo, don't actually wait
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    nodeId: node.id,
    nodeType: "wait",
    status: "success",
    output: { waited: true, duration: node.data?.duration, unit: node.data?.unit },
    startTime,
    endTime: new Date(),
    duration: Date.now() - startTime.getTime(),
  };
}

// Default end executor
async function executeEnd(
  node: Node,
  _context: WorkflowExecutionContext
): Promise<NodeExecutionResult> {
  const startTime = new Date();
  logger.info('End: workflow completed', { result: String(node.data?.result ?? '') });

  return {
    nodeId: node.id,
    nodeType: "end",
    status: "success",
    output: { result: node.data?.result, summary: node.data?.summary },
    startTime,
    endTime: new Date(),
    duration: Date.now() - startTime.getTime(),
  };
}

// Register default executors
registerNodeExecutor("trigger", executeTrigger);
registerNodeExecutor("task", executeTask);
registerNodeExecutor("condition", executeCondition);
registerNodeExecutor("action", executeAction);
registerNodeExecutor("wait", executeWait);
registerNodeExecutor("end", executeEnd);

/**
 * Flow Execution Controller class
 */
export class FlowExecutionController {
  private context: WorkflowExecutionContext;
  private executionOrder: string[] = [];

  constructor(nodes: Node[], edges: Edge[]) {
    this.context = {
      nodes,
      edges,
      variables: {},
      results: new Map(),
    };
  }

  /**
   * Build execution order using topological sort
   */
  private buildExecutionOrder(): string[] {
    const { nodes, edges } = this.context;
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    // Initialize
    nodes.forEach((node) => {
      inDegree.set(node.id, 0);
      adjacency.set(node.id, []);
    });

    // Build graph
    edges.forEach((edge) => {
      const current = inDegree.get(edge.target) || 0;
      inDegree.set(edge.target, current + 1);
      adjacency.get(edge.source)?.push(edge.target);
    });

    // Topological sort (Kahn's algorithm)
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    const order: string[] = [];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      order.push(nodeId);

      const neighbors = adjacency.get(nodeId) || [];
      neighbors.forEach((neighbor) => {
        const degree = (inDegree.get(neighbor) || 1) - 1;
        inDegree.set(neighbor, degree);
        if (degree === 0) queue.push(neighbor);
      });
    }

    return order;
  }

  /**
   * Execute the workflow
   */
  async execute(): Promise<ExecutionResult> {
    const startTime = Date.now();
    this.executionOrder = this.buildExecutionOrder();

    logger.info('Workflow execution started', { nodeCount: String(this.executionOrder.length) });

    const results: NodeExecutionResult[] = [];

    for (const nodeId of this.executionOrder) {
      const node = this.context.nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      const executor = nodeExecutors[node.type || ""];
      if (!executor) {
        logger.warn('No executor for node type', { nodeType: String(node.type ?? '') });
        continue;
      }

      try {
        const result = await executor(node, this.context);
        this.context.results.set(nodeId, result);
        results.push(result);

        if (result.output) {
          this.context.variables[nodeId] = result.output;
        }
      } catch (error) {
        const errorResult: NodeExecutionResult = {
          nodeId: node.id,
          nodeType: node.type || "unknown",
          status: "error",
          error: error instanceof Error ? error.message : String(error),
          startTime: new Date(),
          endTime: new Date(),
        };
        this.context.results.set(nodeId, errorResult);
        results.push(errorResult);

        logger.error('Node execution failed', { nodeId, error: error instanceof Error ? error.message : 'unknown' });
        break;
      }
    }

    const totalDuration = Date.now() - startTime;
    const success = results.every((r) => r.status === "success");

    logger.info('Workflow execution finished', { success: String(success), durationMs: String(totalDuration) });

    return {
      success,
      results,
      totalDuration,
    };
  }

  /**
   * Get current execution status
   */
  getStatus(): Map<string, NodeExecutionResult> {
    return this.context.results;
  }

  /**
   * Get workflow variables
   */
  getVariables(): Record<string, unknown> {
    return this.context.variables;
  }
}

/**
 * Convenience function for executing a workflow
 */
export async function executeWorkflow(
  nodes: Node[],
  edges: Edge[]
): Promise<ExecutionResult> {
  const controller = new FlowExecutionController(nodes, edges);
  return controller.execute();
}

export default FlowExecutionController;
