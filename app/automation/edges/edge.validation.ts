import { z } from "zod";
import type { ExtendedEdge, WorkflowEdge } from "./edge.types";
import { WorkflowEdgeSchema } from "./edge.schemas";


export type EdgeValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: z.ZodIssue[]; value?: unknown };

export function validateEdge(input: unknown): EdgeValidationResult<WorkflowEdge> {
  const parsed = WorkflowEdgeSchema.safeParse(input);
  if (parsed.success) return { ok: true, value: parsed.data };
  return { ok: false, issues: parsed.error.issues, value: input };
}

export function assertValidEdge(input: unknown): WorkflowEdge {
  const res = validateEdge(input);
  if (!res.ok) {
    const msg = res.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid edge: ${msg}`);
  }
  return res.value;
}

export function migrateEdgeToLatest(edge: unknown): WorkflowEdge {
  // For now, schema transform handles attaching defaults and version.
  return assertValidEdge(edge);
}

export function normalizeExtendedEdge(edge: WorkflowEdge): ExtendedEdge {
  // Ensure optional objects exist only when present.
  return {
    ...edge,
    metadata: edge.metadata,
    execution: edge.execution,
    routing: edge.routing,
  };
}

