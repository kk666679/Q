import type { Node, Edge } from '@xyflow/react';

export type NodeRunStatus = 'pending' | 'running' | 'done' | 'error';

export interface NodeExecResult {
  nodeId: string;
  status: NodeRunStatus;
  rowCount: number;
  durationMs: number;
  error?: string;
}

export interface PipelineResult {
  status: 'completed' | 'failed';
  results: Record<string, NodeExecResult>;
  totalRows: number;
  durationMs: number;
}

/** Topological sort of nodes using edge adjacency */
function topoSort(nodes: Node[], edges: Edge[]): string[] {
  const inDegree = new Map<string, number>(nodes.map(n => [n.id, 0]));
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    adj.set(e.source, [...(adj.get(e.source) ?? []), e.target]);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  }
  const queue = [...inDegree.entries()].filter(([, d]) => d === 0).map(([id]) => id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const next of adj.get(id) ?? []) {
      const d = (inDegree.get(next) ?? 1) - 1;
      inDegree.set(next, d);
      if (d === 0) queue.push(next);
    }
  }
  return order;
}

/** Simulate per-node row counts based on category */
function simulateRowCount(category: string, upstreamRows: number): number {
  const seed = upstreamRows || Math.floor(Math.random() * 50000) + 1000;
  const ratio: Record<string, number> = {
    import: 1, preparation: 0.97, combine: 1.4, transform: 0.95,
    quality: 0.99, schema: 1, analytics: 0.5, publish: 1, control: 0.8, custom: 0.9,
  };
  return Math.floor(seed * (ratio[category] ?? 1));
}

type ProgressCallback = (result: NodeExecResult) => void;

export async function runPipeline(
  nodes: Node[],
  edges: Edge[],
  onProgress?: ProgressCallback,
): Promise<PipelineResult> {
  const order = topoSort(nodes, edges);
  const results: Record<string, NodeExecResult> = {};
  const rowCounts = new Map<string, number>();
  let failed = false;
  const start = Date.now();

  for (const nodeId of order) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) continue;

    const category = (node.data as Record<string, unknown>)?.category as string ?? 'transform';
    const upstreamEdges = edges.filter(e => e.target === nodeId);
    const upstreamRows = upstreamEdges.length
      ? Math.max(...upstreamEdges.map(e => rowCounts.get(e.source) ?? 0))
      : 0;

    onProgress?.({ nodeId, status: 'running', rowCount: 0, durationMs: 0 });

    const nodeStart = Date.now();
    // Simulate async work proportional to row count
    await new Promise(r => setTimeout(r, 80 + Math.random() * 120));

    const rowCount = simulateRowCount(category, upstreamRows);
    const durationMs = Date.now() - nodeStart;
    rowCounts.set(nodeId, rowCount);

    const result: NodeExecResult = { nodeId, status: 'done', rowCount, durationMs };
    results[nodeId] = result;
    onProgress?.(result);
  }

  const totalRows = Math.max(...Object.values(results).map(r => r.rowCount), 0);
  return {
    status: failed ? 'failed' : 'completed',
    results,
    totalRows,
    durationMs: Date.now() - start,
  };
}
