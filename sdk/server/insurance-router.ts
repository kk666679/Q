import { z } from 'zod';
import { router, publicProcedure } from './router';
import { agentRegistry } from '../core/registry';

export const insuranceRouter = router({
  generateQuote: publicProcedure
    .input(z.object({
      policyType: z.enum(['auto', 'home', 'life', 'health']),
      applicant: z.object({
        age: z.number(),
        creditScore: z.number(),
        zipCode: z.string(),
      }),
      coverage: z.object({
        liability: z.number().optional(),
        collision: z.boolean().optional(),
        comprehensive: z.boolean().optional(),
      }),
      riskFactors: z.object({
        accidents: z.number().optional(),
        violations: z.number().optional(),
        claims: z.number().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('insurance-expert');
      const tool = agent?.tools.find(t => t.name === 'generate_insurance_quote');
      return tool ? await tool.execute(input) : null;
    }),

  processClaim: publicProcedure
    .input(z.object({
      policyNumber: z.string(),
      claimType: z.enum(['collision', 'theft', 'liability', 'comprehensive', 'medical']),
      dateOfLoss: z.string(),
      estimatedLoss: z.number(),
      description: z.string(),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('insurance-expert');
      const tool = agent?.tools.find(t => t.name === 'process_claim');
      return tool ? await tool.execute(input) : null;
    }),

  calculateLossRatio: publicProcedure
    .input(z.object({
      claimsPaid: z.number(),
      premiumsEarned: z.number(),
      expenseRatio: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const agent = agentRegistry.get('insurance-expert');
      const tool = agent?.tools.find(t => t.name === 'calculate_loss_ratio');
      return tool ? await tool.execute(input) : null;
    }),

  assessRisk: publicProcedure
    .input(z.object({
      applicantData: z.object({
        age: z.number(),
        occupation: z.string(),
        healthStatus: z.string().optional(),
        creditScore: z.number(),
        claimsHistory: z.number(),
      }),
      coverageAmount: z.number(),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('insurance-expert');
      const tool = agent?.tools.find(t => t.name === 'assess_underwriting_risk');
      return tool ? await tool.execute(input) : null;
    }),

  detectFraud: publicProcedure
    .input(z.object({
      claimData: z.array(z.object({
        claimId: z.string(),
        amount: z.number(),
        dateOfLoss: z.string(),
        reportDate: z.string(),
        claimant: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const agent = agentRegistry.get('insurance-expert');
      const tool = agent?.tools.find(t => t.name === 'detect_fraud_patterns');
      return tool ? await tool.execute(input) : null;
    }),
});
