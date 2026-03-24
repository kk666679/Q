import { z } from 'zod';
import { router, publicProcedure } from './router';
import { agentRegistry } from '../core/registry';

export const constructionRouter = router({
  estimateCost: publicProcedure
    .input(z.object({
      projectType: z.enum(['residential_basic', 'residential_luxury', 'commercial_office', 'industrial_warehouse']),
      squareFootage: z.number(),
      specifications: z.object({
        customDesign: z.boolean().optional(),
        sustainableMaterials: z.boolean().optional(),
        complexSite: z.boolean().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('construction-expert');
      const tool = agent?.tools.find(t => t.name === 'estimate_project_cost');
      return tool ? await tool.execute(input) : null;
    }),

  calculateSchedule: publicProcedure
    .input(z.object({
      projectId: z.string(),
      tasks: z.array(z.object({
        name: z.string(),
        duration: z.number(),
        predecessors: z.array(z.string()).optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('construction-expert');
      const tool = agent?.tools.find(t => t.name === 'calculate_project_schedule');
      return tool ? await tool.execute(input) : null;
    }),

  assessSafety: publicProcedure
    .input(z.object({
      projectId: z.string(),
      inspector: z.string(),
      areas: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('construction-expert');
      const tool = agent?.tools.find(t => t.name === 'assess_safety_compliance');
      return tool ? await tool.execute(input) : null;
    }),

  detectClashes: publicProcedure
    .input(z.object({
      modelIds: z.array(z.string()),
      disciplines: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('construction-expert');
      const tool = agent?.tools.find(t => t.name === 'detect_bim_clashes');
      return tool ? await tool.execute(input) : null;
    }),

  trackProgress: publicProcedure
    .input(z.object({
      projectId: z.string(),
      currentPhase: z.string(),
      completedTasks: z.number(),
      totalTasks: z.number(),
      budgetSpent: z.number(),
      totalBudget: z.number(),
    }))
    .query(async ({ input }) => {
      const agent = agentRegistry.get('construction-expert');
      const tool = agent?.tools.find(t => t.name === 'track_project_progress');
      return tool ? await tool.execute(input) : null;
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
      const agent = agentRegistry.get('construction-expert');
      const tool = agent?.tools.find(t => t.name === 'manage_change_order');
      return tool ? await tool.execute(input) : null;
    }),
});
