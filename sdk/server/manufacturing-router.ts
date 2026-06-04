import { z } from 'zod';
import { router, publicProcedure } from './trpc';

export const manufacturingRouter = router({
  calculateOEE: publicProcedure
    .input(z.object({
      machineId: z.string(),
      availability: z.number().min(0).max(100),
      performance: z.number().min(0).max(100),
      quality: z.number().min(0).max(100),
    }))
    .mutation(async ({ input }) => {
      const oee = (input.availability / 100) * (input.performance / 100) * (input.quality / 100) * 100;
      return {
        machineId: input.machineId,
        availability: input.availability,
        performance: input.performance,
        quality: input.quality,
        oee: parseFloat(oee.toFixed(2)),
        status: oee >= 85 ? 'world-class' : oee >= 65 ? 'good' : oee >= 50 ? 'acceptable' : 'poor',
        benchmark: { worldClass: 85, good: 65, acceptable: 50 },
        recommendations: oee < 65 ? [
          'Review unplanned downtime causes',
          'Analyse speed losses on critical equipment',
          'Improve first-pass quality rates',
        ] : ['Maintain current performance', 'Target world-class OEE ≥ 85%'],
      };
    }),

  analyzeSPC: publicProcedure
    .input(z.object({
      measurements: z.array(z.number()).min(2),
      sigmaLevel: z.number().optional().default(3),
      lsl: z.number().optional(),
      usl: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const n = input.measurements.length;
      const mean = input.measurements.reduce((a, b) => a + b, 0) / n;
      const variance = input.measurements.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1);
      const stdDev = Math.sqrt(variance);
      const sigma = input.sigmaLevel ?? 3;
      const ucl = mean + sigma * stdDev;
      const lcl = mean - sigma * stdDev;
      const outOfControl = input.measurements.filter(x => x > ucl || x < lcl);
      const cpk = (input.usl != null && input.lsl != null)
        ? Math.min((input.usl - mean) / (3 * stdDev), (mean - input.lsl) / (3 * stdDev))
        : null;
      return {
        mean: parseFloat(mean.toFixed(4)),
        stdDev: parseFloat(stdDev.toFixed(4)),
        ucl: parseFloat(ucl.toFixed(4)),
        lcl: parseFloat(lcl.toFixed(4)),
        cpk: cpk != null ? parseFloat(cpk.toFixed(3)) : null,
        outOfControlCount: outOfControl.length,
        inControl: outOfControl.length === 0,
        sigmaLevel: sigma,
        processCapability: cpk != null ? (cpk >= 1.33 ? 'capable' : cpk >= 1.0 ? 'marginal' : 'incapable') : 'unknown',
      };
    }),

  scheduleProduction: publicProcedure
    .input(z.object({
      orders: z.array(z.object({
        orderId: z.string(),
        quantity: z.number(),
        priority: z.number().min(1).max(10),
        dueDate: z.string(),
      })),
      machines: z.array(z.object({
        machineId: z.string(),
        productionRate: z.number(),
        availability: z.number().min(0).max(100),
      })),
    }))
    .mutation(async ({ input }) => {
      const sorted = [...input.orders].sort((a, b) => b.priority - a.priority);
      const schedule = sorted.map((order, i) => {
        const machine = input.machines[i % input.machines.length];
        const hoursNeeded = machine ? order.quantity / machine.productionRate : 0;
        return {
          orderId: order.orderId,
          machineId: machine?.machineId ?? 'unassigned',
          startHour: i * 8,
          durationHours: parseFloat(hoursNeeded.toFixed(1)),
          dueDate: order.dueDate,
          onTime: hoursNeeded <= 8,
        };
      });
      return { schedule, totalOrders: sorted.length, scheduledAt: new Date().toISOString() };
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
      const { vibration, temperature, current, operatingHours } = input.sensorData;
      const riskScore = (vibration / 10) * 0.4 + ((temperature - 60) / 40) * 0.3 + (current / 20) * 0.3;
      const failureProbability = Math.min(100, Math.max(0, riskScore * 100));
      const rul = Math.max(0, Math.round(720 - operatingHours * 0.1 - failureProbability * 5));
      const priority = failureProbability > 70 ? 'critical' : failureProbability > 40 ? 'high' : failureProbability > 20 ? 'medium' : 'low';
      return {
        machineId: input.machineId,
        failureProbability: parseFloat(failureProbability.toFixed(1)),
        remainingUsefulLifeHours: rul,
        priority,
        anomalies: [
          ...(vibration > 7 ? ['High vibration detected'] : []),
          ...(temperature > 85 ? ['Over-temperature condition'] : []),
          ...(current > 15 ? ['Elevated current draw'] : []),
        ],
        recommendation: priority === 'critical'
          ? 'Schedule immediate maintenance'
          : priority === 'high'
          ? 'Plan maintenance within 48 hours'
          : 'Continue monitoring — next scheduled check in 7 days',
      };
    }),

  createDigitalTwin: publicProcedure
    .input(z.object({
      assetId: z.string(),
      currentState: z.record(z.string(), z.unknown()),
      scenario: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ input }) => {
      const simulated = input.scenario
        ? Object.fromEntries(
            Object.entries(input.currentState).map(([k, v]) => [
              k,
              typeof v === 'number' && input.scenario![k] != null
                ? (v as number) * (input.scenario![k] as number)
                : v,
            ])
          )
        : input.currentState;
      return {
        twinId: `twin-${input.assetId}-${Date.now()}`,
        assetId: input.assetId,
        currentState: input.currentState,
        simulatedState: simulated,
        delta: Object.fromEntries(
          Object.entries(input.currentState).map(([k, v]) => [
            k,
            typeof v === 'number' && typeof simulated[k] === 'number'
              ? parseFloat(((simulated[k] as number) - v).toFixed(3))
              : 0,
          ])
        ),
        createdAt: new Date().toISOString(),
      };
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
      const { produced, defective, downtime, cycleTime } = input.metrics;
      const yieldRate = produced > 0 ? ((produced - defective) / produced * 100) : 0;
      const defectRate = produced > 0 ? (defective / produced * 100) : 0;
      const efficiency = Math.max(0, 100 - (downtime / (produced * cycleTime + downtime)) * 100);
      return {
        lineId: input.lineId,
        period: input.period,
        yieldRate: parseFloat(yieldRate.toFixed(2)),
        defectRate: parseFloat(defectRate.toFixed(2)),
        efficiency: parseFloat(efficiency.toFixed(2)),
        downtimePercent: parseFloat((downtime / (produced * cycleTime + downtime) * 100).toFixed(2)),
        recommendations: [
          ...(defectRate > 5 ? ['Investigate top defect causes with SPC'] : []),
          ...(efficiency < 80 ? ['Reduce unplanned downtime with TPM program'] : []),
          ...(yieldRate > 95 ? ['Maintain first-pass yield — document best practices'] : []),
        ],
      };
    }),
});
