/**
 * Shared types and Zod schemas for QMS DevTools.
 * These schemas validate the structure of `.devtools/*.json` generation logs.
 */

import { z } from 'zod';

// ─── Metadata ───────────────────────────────────────────────────────────────

export const MetadataSchema = z.object({
  system: z.string(),
  environment: z.string(),
  version: z.string(),
  framework: z.string(),
  generated_at: z.string().datetime(),
  providers: z.array(z.string()),
  expertise_domains: z.array(z.string()).optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;

// ─── Request ────────────────────────────────────────────────────────────────

export const RequestSchema = z.object({
  query: z.string(),
  domain: z.string(),
  standards: z.array(z.string()),
  input_tokens_estimate: z.number().int().nonnegative(),
});

export type Request = z.infer<typeof RequestSchema>;

// ─── User ───────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.string(),
  role: z.string(),
  org: z.string(),
  certifications: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserSchema>;

// ─── Pipeline ───────────────────────────────────────────────────────────────

export const PipelineSchema = z.object({
  architecture: z.string(),
  stages: z.array(z.string()),
});

export type Pipeline = z.infer<PipelineSchema>;

// ─── Metrics ────────────────────────────────────────────────────────────────

export const MetricsSchema = z.object({
  duration_ms: z.number().nonnegative().optional(),
  tokens_input: z.number().int().nonnegative().optional(),
  tokens_output: z.number().int().nonnegative().optional(),
  tokens: z.object({
    input: z.number().int().nonnegative(),
    output: z.number().int().nonnegative(),
  }).optional(),
});

export type Metrics = z.infer<MetricsSchema>;

// ─── Step ───────────────────────────────────────────────────────────────────

export const StepSchema = z.object({
  step_id: z.number().int(),
  type: z.string(),
  model: z.string().optional(),
  tool: z.string().optional(),
  agent: z.string().optional(),
  evaluator: z.string().optional(),
  status: z.string().optional(),
  input: z.record(z.string(), z.unknown()),
  output: z.record(z.string(), z.unknown()),
  metrics: MetricsSchema,
});

export type Step = z.infer<StepSchema>;

// ─── Cache ──────────────────────────────────────────────────────────────────

export const CacheSchema = z.object({
  enabled: z.boolean(),
  hit: z.boolean(),
  cache_key: z.string(),
});

export type Cache = z.infer<CacheSchema>;

// ─── Safety ─────────────────────────────────────────────────────────────────

export const SafetySchema = z.object({
  moderation_checked: z.boolean(),
  status: z.string(),
  flags: z.array(z.string()),
});

export type Safety = z.infer<SafetySchema>;

// ─── Cost ───────────────────────────────────────────────────────────────────

export const CostEstimateSchema = z.object({
  total_usd: z.number().nonnegative(),
  breakdown: z.record(z.string(), z.number().nonnegative()),
});

export type CostEstimate = z.infer<CostEstimateSchema>;

// ─── Performance ────────────────────────────────────────────────────────────

export const PerformanceSchema = z.object({
  total_duration_ms: z.number().nonnegative(),
  kg_lookup_ms: z.number().nonnegative().optional(),
  vector_search_ms: z.number().nonnegative().optional(),
  agent_reasoning_ms: z.number().nonnegative().optional(),
  llm_synthesis_ms: z.number().nonnegative().optional(),
  flow_generator_ms: z.number().nonnegative().optional(),
  expert_review_ms: z.number().nonnegative().optional(),
  other_ms: z.number().nonnegative().optional(),
});

export type Performance = z.infer<PerformanceSchema>;

// ─── UI Render ──────────────────────────────────────────────────────────────

export const UIRenderSchema = z.object({
  components: z.array(z.string()),
  interactive: z.boolean(),
  flow_data_used: z.boolean().optional(),
  swimlanes_rendered: z.boolean().optional(),
  document_links_available: z.boolean().optional(),
});

export type UIRender = z.infer<UIRenderSchema>;

// ─── Run ────────────────────────────────────────────────────────────────────

export const RunSchema = z.object({
  run_id: z.string(),
  session_id: z.string(),
  user: UserSchema,
  request: RequestSchema,
  pipeline: PipelineSchema,
  steps: z.array(StepSchema),
  cache: CacheSchema,
  safety: SafetySchema,
  cost_estimate: CostEstimateSchema,
  performance: PerformanceSchema,
  ui_render: UIRenderSchema,
});

export type Run = z.infer<RunSchema>;

// ─── Log File ───────────────────────────────────────────────────────────────

export const GenerationLogSchema = z.object({
  metadata: MetadataSchema,
  runs: z.array(RunSchema),
});

export type GenerationLog = z.infer<GenerationLogSchema>;

// ─── Validation Result ──────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  file: string;
  errors: string[];
  warnings: string[];
  summary: {
    runCount: number;
    systems: string[];
    dateRange: { from: string; to: string } | null;
  };
}

// ─── Analysis Result ────────────────────────────────────────────────────────

export interface AnalysisResult {
  file: string;
  metadata: Metadata;
  runs: Run[];
  summary: {
    totalRuns: number;
    totalCostUsd: number;
    totalDurationMs: number;
    avgDurationMs: number;
    avgCostUsd: number;
    providers: Record<string, number>;
    domains: Record<string, number>;
    standards: Record<string, number>;
    roles: Record<string, number>;
    cacheHitRate: number;
    safetyPassRate: number;
    stepTypeCounts: Record<string, number>;
    dateRange: { from: string; to: string } | null;
    performanceBreakdown: Record<string, number>;
    costBreakdown: Record<string, number>;
  };
}

// ─── Report Options ─────────────────────────────────────────────────────────

export interface ReportOptions {
  output?: string;
  format?: 'html' | 'json';
  title?: string;
}