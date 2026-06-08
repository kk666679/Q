import { z } from "zod";
import type { ExtendedEdge, WorkflowEdge } from "./edge.types";
import { EDGE_DOMAIN_VERSION } from "./edge.constants";


// ---- Small helpers ----
const JsonRecordSchema = z.record(z.string(), z.any()).optional();





// MarkerType in @xyflow/react is a string union; we keep it permissive.
const MarkerEndSchema = z.any().optional();

// ---- Metadata (optional) ----
export const EdgeMetadataSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.string().optional(),

    status: z
      .enum(["idle", "queued", "running", "paused", "success", "failed", "cancelled"])
      .optional(),

    cost: z.number().optional(),
    latencyMs: z.number().optional(),
    tokens: z.number().optional(),

    // Enterprise extensions
  })
  .passthrough();

export const EdgeExecutionStateSchema = z
  .object({
    state: z
      .enum(["idle", "queued", "running", "paused", "success", "failed", "cancelled"])
      .optional(),
    runtime: z
      .object({
        startedAt: z.string().optional(),
        endedAt: z.string().optional(),
        durationMs: z.number().optional(),
      })
      .optional(),
    metrics: z
      .object({
        cost: z.number().optional(),
        latencyMs: z.number().optional(),
        tokens: z.number().optional(),
      })
      .passthrough()
      .optional(),
    error: z
      .object({
        message: z.string().optional(),
        code: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const EdgeRoutingConfigSchema = z
  .object({
    strategy: z.enum(["direct", "orthogonal", "manhattan", "smart", "ai"]).optional(),
  })
  .passthrough();

// ---- Legacy edge schema (must preserve unknown fields) ----
// We only validate the fields we must understand for routing + rendering.
export const LegacyEdgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    type: z.string().optional(),
    sourceHandle: z.string().nullable().optional(),
    targetHandle: z.string().nullable().optional(),
    markerEnd: MarkerEndSchema,
    style: JsonRecordSchema,
    data: z.any().optional(),
  })
  .passthrough();


export const ExtendedEdgeSchemaV1 = z
  .object({
    // Legacy required/optional
    id: z.string(),
    source: z.string(),
    target: z.string(),
    type: z.string().optional(),
    sourceHandle: z.string().nullable().optional(),
    targetHandle: z.string().nullable().optional(),
    markerEnd: MarkerEndSchema,
    style: JsonRecordSchema,
    data: z.any().optional(),

    // Extended
    version: z.number().optional().default(EDGE_DOMAIN_VERSION),
    metadata: EdgeMetadataSchema.optional(),
    execution: EdgeExecutionStateSchema.optional(),
    routing: EdgeRoutingConfigSchema.optional(),
  })
  .passthrough() as unknown as z.ZodType<ExtendedEdge>;


// ---- Versioned migrations ----
export const WorkflowEdgeSchema = z
  .union([ExtendedEdgeSchemaV1, LegacyEdgeSchema])
  .transform((edge): WorkflowEdge => {
    // If it matches legacy, attach defaults in-memory.
    const e = edge as Record<string, unknown>;
    const version = typeof e.version === "number" ? e.version : EDGE_DOMAIN_VERSION;

    const extended: WorkflowEdge = {
      ...(e as any),
      version,
    };

    // metadata/execution/routing are optional and already passthrough-safe.
    return extended;
  });

export type LegacyEdgeSchemaType = z.infer<typeof LegacyEdgeSchema>;
export type ExtendedEdgeSchemaType = z.infer<typeof ExtendedEdgeSchemaV1>;

