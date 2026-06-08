import type { MarkerType } from "@xyflow/react";

export type EdgeId = string;

// ---- Domain metadata (optional) ----
export type EdgeMetadata = {
  title?: string;
  subtitle?: string;
  badge?: string;

  // Enterprise metrics
  status?: "idle" | "queued" | "running" | "paused" | "success" | "failed" | "cancelled";
  cost?: number;
  latencyMs?: number;
  tokens?: number;

  // Freeform extension point for enterprise use cases
  [k: string]: unknown;
};

export type EdgeExecutionState = {
  state?:
    | "idle"
    | "queued"
    | "running"
    | "paused"
    | "success"
    | "failed"
    | "cancelled";
  runtime?: {
    startedAt?: string;
    endedAt?: string;
    durationMs?: number;
  };
  metrics?: {
    cost?: number;
    latencyMs?: number;
    tokens?: number;
    [k: string]: unknown;
  };
  error?: {
    message?: string;
    code?: string;
    [k: string]: unknown;
  };
};

export type EdgeRoutingConfig = {
  strategy?: "direct" | "orthogonal" | "manhattan" | "smart" | "ai";
  // Placeholder for future enterprise routing params
  [k: string]: unknown;
};

export type LegacyEdge = {
  id: EdgeId;
  source: string;
  target: string;
  type?: string;

  // React Flow fields (optional)
  sourceHandle?: string | null;
  targetHandle?: string | null;
  markerEnd?: MarkerType | { type: MarkerType } | unknown;
  style?: Record<string, unknown>;
  data?: unknown;

  // Must allow passthrough of arbitrary legacy fields
  [k: string]: unknown;
};

export type ExtendedEdge = LegacyEdge & {
  version?: number;
  metadata?: EdgeMetadata;
  execution?: EdgeExecutionState;
  routing?: EdgeRoutingConfig;
};

export type WorkflowEdge = ExtendedEdge;

