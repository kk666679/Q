import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import type { MLModel, MLExperiment } from '@/components/automation/shared/types';

// ── In-memory store (replace with DB in production) ───────────────────────────
const MODELS: MLModel[] = [
  { id:'m1', name:'churn-predictor',   version:'v3.1', framework:'sklearn',   status:'deployed',  accuracy:0.912, createdAt:'2025-04-10' },
  { id:'m2', name:'revenue-forecast',  version:'v1.4', framework:'prophet',   status:'deployed',  accuracy:0.887, createdAt:'2025-04-22' },
  { id:'m3', name:'anomaly-detector',  version:'v2.0', framework:'isolation', status:'validating',accuracy:0.943, createdAt:'2025-05-01' },
  { id:'m4', name:'compliance-scorer', version:'v1.0', framework:'xgboost',   status:'training',  createdAt:'2025-05-18' },
];

const EXPERIMENTS: MLExperiment[] = [
  { id:'e1', name:'churn-v3.1-run42', modelId:'m1', params:{n_estimators:200,max_depth:8}, metrics:{accuracy:0.912,f1:0.894,auc:0.961}, status:'deployed', runAt:'2025-04-10' },
  { id:'e2', name:'churn-v3.0-run38', modelId:'m1', params:{n_estimators:150,max_depth:6}, metrics:{accuracy:0.899,f1:0.881,auc:0.952}, status:'archived',  runAt:'2025-03-28' },
  { id:'e3', name:'anomaly-v2.0-run5',modelId:'m3', params:{contamination:0.05,n_estimators:100}, metrics:{accuracy:0.943,f1:0.921,auc:0.978}, status:'validating', runAt:'2025-05-01' },
];

interface DriftStatus {
  modelId: string;
  dataDrift: number;
  predictionDrift: number;
  status: 'ok' | 'warning' | 'critical';
  requestsPerDay: number;
  checkedAt: string;
}

function getDriftStatus(modelId: string): DriftStatus {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  const dataDrift = parseFloat(rand(0.01, 0.08).toFixed(3));
  const predictionDrift = parseFloat(rand(0.005, 0.06).toFixed(3));
  const status = dataDrift > 0.06 || predictionDrift > 0.05 ? 'warning' : 'ok';
  return { modelId, dataDrift, predictionDrift, status, requestsPerDay: Math.floor(rand(500, 5000)), checkedAt: new Date().toISOString() };
}

// ── Router ────────────────────────────────────────────────────────────────────
export const modelsRouter = router({

  // List all models
  list: publicProcedure
    .input(z.object({ status: z.enum(['deployed','validating','training','archived','failed']).optional() }).optional())
    .query(({ input }) => {
      if (input?.status) return MODELS.filter(m => m.status === input.status);
      return MODELS;
    }),

  // Get single model
  get: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .query(({ input }) => MODELS.find(m => m.id === input.id) ?? null),

  // Deploy a model version
  deploy: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .mutation(({ input }) => {
      const model = MODELS.find(m => m.id === input.id);
      if (!model) return { success: false, message: 'Model not found' };
      model.status = 'deployed';
      return { success: true, model };
    }),

  // Archive a model
  archive: publicProcedure
    .input(z.object({ id: z.string().min(1).max(128) }))
    .mutation(({ input }) => {
      const model = MODELS.find(m => m.id === input.id);
      if (!model) return { success: false };
      model.status = 'archived';
      return { success: true };
    }),

  // List experiments, optionally filtered by model
  experiments: router({
    list: publicProcedure
      .input(z.object({ modelId: z.string().min(1).max(128).optional() }).optional())
      .query(({ input }) => {
        if (input?.modelId) return EXPERIMENTS.filter(e => e.modelId === input.modelId);
        return EXPERIMENTS;
      }),

    // Compare two experiment runs
    compare: publicProcedure
      .input(z.object({ idA: z.string().min(1).max(128), idB: z.string().min(1).max(128) }))
      .query(({ input }) => {
        const a = EXPERIMENTS.find(e => e.id === input.idA);
        const b = EXPERIMENTS.find(e => e.id === input.idB);
        if (!a || !b) return null;
        const metricKeys = Array.from(new Set([...Object.keys(a.metrics), ...Object.keys(b.metrics)]));
        const diff = Object.fromEntries(
          metricKeys.map(k => [k, {
            a: a.metrics[k] ?? null,
            b: b.metrics[k] ?? null,
            delta: ((a.metrics[k] ?? 0) - (b.metrics[k] ?? 0)),
          }])
        );
        return { a, b, metricDiff: diff };
      }),
  }),

  // Drift monitoring
  drift: router({
    // Get drift status for a deployed model
    status: publicProcedure
      .input(z.object({ modelId: z.string().min(1).max(128) }))
      .query(({ input }) => getDriftStatus(input.modelId)),

    // Get drift for all deployed models
    all: publicProcedure
      .query(() => MODELS.filter(m => m.status === 'deployed').map(m => getDriftStatus(m.id))),

    // Trigger retraining workflow
    triggerRetrain: publicProcedure
      .input(z.object({
        modelId: z.string().min(1).max(128),
        reason:  z.enum(['drift','schedule','manual']).default('manual'),
      }))
      .mutation(({ input }) => {
        const model = MODELS.find(m => m.id === input.modelId);
        if (!model) return { success: false, message: 'Model not found' };
        model.status = 'training';
        return {
          success: true,
          jobId: `retrain-${input.modelId}-${Date.now()}`,
          estimatedDurationMin: Math.floor(Math.random() * 20) + 10,
          reason: input.reason,
        };
      }),
  }),
});
