import { z } from 'zod';
import { router, publicProcedure } from './trpc';

const RATE_PER_SQFT: Record<string, number> = {
  residential_basic: 150,
  residential_luxury: 280,
  commercial_office: 220,
  industrial_warehouse: 85,
};

export const constructionRouter = router({
  estimateCost: publicProcedure
    .input(z.object({
      projectType: z.enum(['residential_basic', 'residential_luxury', 'commercial_office', 'industrial_warehouse']),
      squareFootage: z.number().positive(),
      specifications: z.object({
        customDesign: z.boolean().optional(),
        sustainableMaterials: z.boolean().optional(),
        complexSite: z.boolean().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const base = RATE_PER_SQFT[input.projectType] * input.squareFootage;
      const multiplier =
        1 +
        (input.specifications.customDesign ? 0.15 : 0) +
        (input.specifications.sustainableMaterials ? 0.10 : 0) +
        (input.specifications.complexSite ? 0.12 : 0);
      const total = base * multiplier;
      return {
        projectType: input.projectType,
        squareFootage: input.squareFootage,
        baseRate: RATE_PER_SQFT[input.projectType],
        totalEstimate: parseFloat(total.toFixed(2)),
        breakdown: {
          site: parseFloat((total * 0.08).toFixed(2)),
          foundation: parseFloat((total * 0.12).toFixed(2)),
          structure: parseFloat((total * 0.25).toFixed(2)),
          mechanical: parseFloat((total * 0.15).toFixed(2)),
          interior: parseFloat((total * 0.20).toFixed(2)),
          contingency: parseFloat((total * 0.10).toFixed(2)),
          other: parseFloat((total * 0.10).toFixed(2)),
        },
        currency: 'MYR',
        estimatedAt: new Date().toISOString(),
      };
    }),

  calculateSchedule: publicProcedure
    .input(z.object({
      projectId: z.string(),
      tasks: z.array(z.object({
        name: z.string(),
        duration: z.number().positive(),
        predecessors: z.array(z.string()).optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const starts: Record<string, number> = {};
      const finishes: Record<string, number> = {};
      for (const task of input.tasks) {
        const predFinish = (task.predecessors ?? []).reduce(
          (max, p) => Math.max(max, finishes[p] ?? 0), 0
        );
        starts[task.name] = predFinish;
        finishes[task.name] = predFinish + task.duration;
      }
      const projectDuration = Math.max(...Object.values(finishes), 0);
      const criticalPath = input.tasks
        .filter(t => finishes[t.name] === projectDuration)
        .map(t => t.name);
      return {
        projectId: input.projectId,
        schedule: input.tasks.map(t => ({
          name: t.name,
          startDay: starts[t.name],
          finishDay: finishes[t.name],
          duration: t.duration,
          isCritical: criticalPath.includes(t.name),
        })),
        projectDurationDays: projectDuration,
        criticalPath,
        calculatedAt: new Date().toISOString(),
      };
    }),

  assessSafety: publicProcedure
    .input(z.object({
      projectId: z.string(),
      inspector: z.string(),
      areas: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const areas = input.areas ?? ['scaffolding', 'electrical', 'excavation', 'fire-safety', 'ppe'];
      const scores = areas.map(area => ({
        area,
        score: Math.floor(70 + Math.random() * 30),
        status: Math.random() > 0.2 ? 'pass' : 'fail',
        findings: Math.random() > 0.6 ? [`${area}: minor deficiency noted`] : [],
      }));
      const avgScore = Math.round(scores.reduce((s, a) => s + a.score, 0) / scores.length);
      return {
        projectId: input.projectId,
        inspector: input.inspector,
        overallScore: avgScore,
        status: avgScore >= 80 ? 'pass' : 'fail',
        areaResults: scores,
        violations: scores.filter(s => s.status === 'fail').length,
        recommendations: scores.filter(s => s.findings.length > 0).flatMap(s => s.findings),
        inspectedAt: new Date().toISOString(),
      };
    }),

  detectClashes: publicProcedure
    .input(z.object({
      modelIds: z.array(z.string()),
      disciplines: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const pairs = input.disciplines.flatMap((d, i) =>
        input.disciplines.slice(i + 1).map(d2 => ({ a: d, b: d2 }))
      );
      const clashes = pairs
        .filter(() => Math.random() > 0.5)
        .map((p, i) => ({
          clashId: `CLH-${String(i + 1).padStart(3, '0')}`,
          disciplineA: p.a,
          disciplineB: p.b,
          severity: ['hard', 'soft', 'clearance'][Math.floor(Math.random() * 3)],
          location: `Level ${Math.floor(Math.random() * 10) + 1}, Grid ${String.fromCharCode(65 + i)}`,
        }));
      return {
        modelIds: input.modelIds,
        totalClashes: clashes.length,
        hardClashes: clashes.filter(c => c.severity === 'hard').length,
        softClashes: clashes.filter(c => c.severity === 'soft').length,
        clashes,
        detectedAt: new Date().toISOString(),
      };
    }),

  trackProgress: publicProcedure
    .input(z.object({
      projectId: z.string(),
      currentPhase: z.string(),
      completedTasks: z.number().min(0),
      totalTasks: z.number().min(1),
      budgetSpent: z.number().min(0),
      totalBudget: z.number().min(1),
    }))
    .query(async ({ input }) => {
      const scheduleProgress = (input.completedTasks / input.totalTasks) * 100;
      const budgetProgress = (input.budgetSpent / input.totalBudget) * 100;
      const spi = scheduleProgress / Math.max(1, budgetProgress);
      const cpi = budgetProgress > 0 ? scheduleProgress / budgetProgress : 1;
      return {
        projectId: input.projectId,
        currentPhase: input.currentPhase,
        scheduleProgress: parseFloat(scheduleProgress.toFixed(1)),
        budgetProgress: parseFloat(budgetProgress.toFixed(1)),
        schedulePerformanceIndex: parseFloat(spi.toFixed(2)),
        costPerformanceIndex: parseFloat(cpi.toFixed(2)),
        status: spi >= 0.95 && cpi >= 0.95 ? 'on-track' : spi < 0.85 || cpi < 0.85 ? 'at-risk' : 'warning',
        remainingBudget: input.totalBudget - input.budgetSpent,
        remainingTasks: input.totalTasks - input.completedTasks,
      };
    }),

  manageChangeOrder: publicProcedure
    .input(z.object({
      projectId: z.string(),
      description: z.string(),
      costImpact: z.number(),
      scheduleImpact: z.number(),
      reason: z.string(),
    }))
    .mutation(async ({ input }) => {
      const severity = Math.abs(input.costImpact) > 50000 || Math.abs(input.scheduleImpact) > 14
        ? 'major' : 'minor';
      return {
        changeOrderId: `CO-${Date.now()}`,
        projectId: input.projectId,
        description: input.description,
        reason: input.reason,
        costImpact: input.costImpact,
        scheduleImpactDays: input.scheduleImpact,
        severity,
        status: 'pending-approval',
        requiresClientApproval: severity === 'major',
        createdAt: new Date().toISOString(),
      };
    }),
});
