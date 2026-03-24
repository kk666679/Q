import { z } from 'zod';
import { router, publicProcedure } from './router';
import { agentRegistry } from '../core/registry';

export const manufacturingRouter = router({
  calculateOEE: publicProcedure
    .input(z.object({
      machineId: z.string(),
      availability: z.number(),
      performance: z.number(),
      quality: z.number(),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('manufacturing-expert');
      const tool = agent?.tools.find(t => t.name === 'calculate_oee');
      return tool ? await tool.execute(input) : null;
    }),

  analyzeSPC: publicProcedure
    .input(z.object({
      measurements: z.array(z.number()),
      sigmaLevel: z.number().optional(),
      lsl: z.number().optional(),
      usl: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('manufacturing-expert');
      const tool = agent?.tools.find(t => t.name === 'analyze_spc');
      return tool ? await tool.execute(input) : null;
    }),

  scheduleProduction: publicProcedure
    .input(z.object({
      orders: z.array(z.object({
        orderId: z.string(),
        quantity: z.number(),
        priority: z.number(),
        dueDate: z.string(),
      })),
      machines: z.array(z.object({
        machineId: z.string(),
        productionRate: z.number(),
        availability: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('manufacturing-expert');
      const tool = agent?.tools.find(t => t.name === 'schedule_production');
      return tool ? await tool.execute(input) : null;
    }),

  predictMaintenance: publicProcedure
    .input(z.object({
      machineId: z.string(),
      sensorData: z.object({
        vibration: z.number(),
        temperature: z.number(),
        current: z.number(),
        operatingHours: z.number(),
      }),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('manufacturing-expert');
      const tool = agent?.tools.find(t => t.name === 'predict_maintenance');
      return tool ? await tool.execute(input) : null;
    }),

  createDigitalTwin: publicProcedure
    .input(z.object({
      assetId: z.string(),
      currentState: z.record(z.any()),
      scenario: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('manufacturing-expert');
      const tool = agent?.tools.find(t => t.name === 'create_digital_twin');
      return tool ? await tool.execute(input) : null;
    }),

  analyzeMetrics: publicProcedure
    .input(z.object({
      lineId: z.string(),
      period: z.string(),
      metrics: z.object({
        produced: z.number(),
        defective: z.number(),
        downtime: z.number(),
        cycleTime: z.number(),
      }),
    }))
    .query(async ({ input }) => {
      const agent = agentRegistry.get('manufacturing-expert');
      const tool = agent?.tools.find(t => t.name === 'analyze_production_metrics');
      return tool ? await tool.execute(input) : null;
    }),
});
