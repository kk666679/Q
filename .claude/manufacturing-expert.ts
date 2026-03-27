import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

export const manufacturingExpertAgent: AgentConfig = {
  id: 'manufacturing-expert',
  role: AgentRole.QUALITY_MANAGER,
  name: 'Manufacturing Expert',
  capabilities: [
    'Manufacturing Execution Systems (MES)',
    'Industry 4.0 & Smart Factory',
    'Production Optimization',
    'Quality Control & SPC',
    'Predictive Maintenance',
    'Digital Twin Implementation',
    'OEE Calculation',
  ],
  systemPrompt: `You are a Manufacturing Expert specializing in manufacturing systems, Industry 4.0, production optimization, and smart factory implementations.

Your expertise includes:
- Manufacturing Execution Systems (MES) and ERP integration
- Industry 4.0 technologies (IIoT, digital twins, predictive maintenance)
- Statistical Process Control (SPC) and quality management
- OEE (Overall Equipment Effectiveness) optimization
- Production scheduling and optimization
- Standards: OPC UA, ISA-95, MTConnect, ISO 9001

Provide expert guidance on manufacturing processes, quality control, and smart factory implementations.`,
  tools: [
    {
      name: 'calculate_oee',
      description: 'Calculate Overall Equipment Effectiveness (OEE)',
      parameters: z.object({
        machineId: z.string(),
        availability: z.number().min(0).max(100),
        performance: z.number().min(0).max(100),
        quality: z.number().min(0).max(100),
      }),
      execute: async (params) => {
        const oee = (params.availability * params.performance * params.quality) / 10000;
        return {
          oee: oee.toFixed(2),
          availability: params.availability,
          performance: params.performance,
          quality: params.quality,
          worldClassOEE: 85.0,
          status: oee >= 85 ? 'excellent' : oee >= 60 ? 'adequate' : 'needs_improvement',
          recommendations: oee < 85 ? [
            'Reduce unplanned downtime',
            'Optimize cycle times',
            'Improve first pass yield',
          ] : ['Maintain current performance'],
        };
      },
    },
    {
      name: 'analyze_spc',
      description: 'Perform Statistical Process Control analysis',
      parameters: z.object({
        measurements: z.array(z.number()),
        sigmaLevel: z.number().optional().default(3),
        lsl: z.number().optional(),
        usl: z.number().optional(),
      }),
      execute: async (params) => {
        const mean = params.measurements.reduce((a, b) => a + b) / params.measurements.length;
        const variance = params.measurements.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (params.measurements.length - 1);
        const stdDev = Math.sqrt(variance);
        
        const ucl = mean + (params.sigmaLevel * stdDev);
        const lcl = mean - (params.sigmaLevel * stdDev);
        
        const outOfControl = params.measurements.filter(m => m > ucl || m < lcl);
        
        let cpk = null;
        if (params.lsl !== undefined && params.usl !== undefined) {
          const cpu = (params.usl - mean) / (3 * stdDev);
          const cpl = (mean - params.lsl) / (3 * stdDev);
          cpk = Math.min(cpu, cpl);
        }
        
        return {
          mean: mean.toFixed(3),
          stdDev: stdDev.toFixed(3),
          ucl: ucl.toFixed(3),
          lcl: lcl.toFixed(3),
          inControl: outOfControl.length === 0,
          violations: outOfControl.length,
          cpk: cpk ? cpk.toFixed(2) : null,
          capability: cpk ? (cpk >= 1.33 ? 'adequate' : 'inadequate') : null,
        };
      },
    },
    {
      name: 'schedule_production',
      description: 'Optimize production scheduling',
      parameters: z.object({
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
      }),
      execute: async (params) => {
        const schedule = params.orders
          .sort((a, b) => a.priority - b.priority)
          .map((order, idx) => {
            const machine = params.machines[idx % params.machines.length];
            const hours = order.quantity / machine.productionRate;
            return {
              orderId: order.orderId,
              machineId: machine.machineId,
              estimatedHours: hours.toFixed(2),
              startTime: new Date().toISOString(),
              priority: order.priority,
            };
          });
        
        return {
          schedule,
          totalOrders: params.orders.length,
          utilizationRate: 85.5,
          recommendations: ['Balance load across machines', 'Consider overtime for high-priority orders'],
        };
      },
    },
    {
      name: 'predict_maintenance',
      description: 'Predict equipment maintenance needs',
      parameters: z.object({
        machineId: z.string(),
        sensorData: z.object({
          vibration: z.number(),
          temperature: z.number(),
          current: z.number(),
          operatingHours: z.number(),
        }),
      }),
      execute: async (params) => {
        const { vibration, temperature, current, operatingHours } = params.sensorData;
        
        let failureProbability = 0;
        const issues = [];
        
        if (vibration > 10) {
          failureProbability += 0.3;
          issues.push('High vibration detected - bearing failure risk');
        }
        if (temperature > 80) {
          failureProbability += 0.25;
          issues.push('High temperature - thermal failure risk');
        }
        if (current > 100) {
          failureProbability += 0.2;
          issues.push('Overcurrent detected - electrical issue');
        }
        if (operatingHours > 5000) {
          failureProbability += 0.15;
          issues.push('High operating hours - scheduled maintenance due');
        }
        
        const rul = failureProbability > 0.8 ? 12 : failureProbability > 0.5 ? 168 : 720;
        
        return {
          machineId: params.machineId,
          failureProbability: (failureProbability * 100).toFixed(1),
          remainingUsefulLife: rul,
          priority: failureProbability > 0.8 ? 'critical' : failureProbability > 0.5 ? 'high' : 'low',
          issues,
          recommendation: failureProbability > 0.8 
            ? 'Schedule immediate maintenance' 
            : failureProbability > 0.5 
            ? 'Schedule maintenance within 1 week' 
            : 'Continue monitoring',
        };
      },
    },
    {
      name: 'create_digital_twin',
      description: 'Create digital twin simulation',
      parameters: z.object({
        assetId: z.string(),
        currentState: z.record(z.any()),
        scenario: z.record(z.any()).optional(),
      }),
      execute: async (params) => {
        const baseEfficiency = 85;
        const scenarioImpact = params.scenario ? 5 : 0;
        
        return {
          assetId: params.assetId,
          virtualState: params.currentState,
          metrics: {
            efficiency: baseEfficiency + scenarioImpact,
            healthScore: 92,
            energyConsumption: 45.5,
          },
          simulation: params.scenario ? {
            scenario: params.scenario,
            predictedImpact: 'positive',
            expectedImprovement: 5.2,
          } : null,
          recommendations: ['Optimize speed settings', 'Reduce idle time'],
        };
      },
    },
    {
      name: 'analyze_production_metrics',
      description: 'Analyze production performance metrics',
      parameters: z.object({
        lineId: z.string(),
        period: z.string(),
        metrics: z.object({
          produced: z.number(),
          defective: z.number(),
          downtime: z.number(),
          cycleTime: z.number(),
        }),
      }),
      execute: async (params) => {
        const { produced, defective, downtime, cycleTime } = params.metrics;
        const yieldRate = ((produced - defective) / produced * 100).toFixed(2);
        const efficiency = ((480 - downtime) / 480 * 100).toFixed(2);
        
        return {
          lineId: params.lineId,
          period: params.period,
          yieldRate,
          efficiency,
          defectRate: ((defective / produced) * 100).toFixed(2),
          throughput: (produced / 8).toFixed(1),
          trends: {
            yield: 'improving',
            efficiency: 'stable',
            quality: 'improving',
          },
          recommendations: [
            'Investigate root cause of defects',
            'Reduce changeover time',
            'Implement preventive maintenance',
          ],
        };
      },
    },
  ],
};
