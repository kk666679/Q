import { z } from 'zod';
import { router, publicProcedure } from './trpc';

const BASE_RATES: Record<string, number> = { auto: 800, home: 1200, life: 600, health: 2400 };

export const insuranceRouter = router({
  generateQuote: publicProcedure
    .input(z.object({
      policyType: z.enum(['auto', 'home', 'life', 'health']),
      applicant: z.object({
        age: z.number().min(18).max(99),
        creditScore: z.number().min(300).max(850),
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
      const base = BASE_RATES[input.policyType];
      const ageFactor = input.applicant.age < 25 ? 1.5 : input.applicant.age > 65 ? 1.2 : 1.0;
      const creditFactor = input.applicant.creditScore >= 750 ? 0.85 : input.applicant.creditScore >= 650 ? 1.0 : 1.25;
      const riskFactor = 1 +
        ((input.riskFactors?.accidents ?? 0) * 0.15) +
        ((input.riskFactors?.violations ?? 0) * 0.10) +
        ((input.riskFactors?.claims ?? 0) * 0.20);
      const premium = base * ageFactor * creditFactor * riskFactor;
      return {
        quoteId: `QT-${Date.now()}`,
        policyType: input.policyType,
        annualPremium: parseFloat(premium.toFixed(2)),
        monthlyPremium: parseFloat((premium / 12).toFixed(2)),
        riskClass: creditFactor <= 0.9 ? 'preferred' : creditFactor <= 1.0 ? 'standard' : 'non-standard',
        factors: { ageFactor, creditFactor, riskFactor: parseFloat(riskFactor.toFixed(2)) },
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }),

  processClaim: publicProcedure
    .input(z.object({
      policyNumber: z.string(),
      claimType: z.enum(['collision', 'theft', 'liability', 'comprehensive', 'medical']),
      dateOfLoss: z.string(),
      estimatedLoss: z.number().positive(),
      description: z.string(),
    }))
    .mutation(async ({ input }) => {
      const fraudScore = input.estimatedLoss > 80000 ? 45 : input.estimatedLoss > 40000 ? 22 : 8;
      const status = fraudScore > 40 ? 'investigating' : input.estimatedLoss > 50000 ? 'pending-review' : 'approved';
      return {
        claimId: `CLM-${Date.now()}`,
        policyNumber: input.policyNumber,
        claimType: input.claimType,
        estimatedLoss: input.estimatedLoss,
        reserveAmount: parseFloat((input.estimatedLoss * 1.15).toFixed(2)),
        fraudScore,
        fraudRisk: fraudScore > 40 ? 'high' : fraudScore > 20 ? 'medium' : 'low',
        status,
        nextSteps: status === 'approved'
          ? ['Assign adjuster', 'Schedule inspection']
          : status === 'investigating'
          ? ['Assign SIU', 'Request documentation', 'Interview claimant']
          : ['Senior review required', 'Request additional documentation'],
        processedAt: new Date().toISOString(),
      };
    }),

  calculateLossRatio: publicProcedure
    .input(z.object({
      claimsPaid: z.number().min(0),
      premiumsEarned: z.number().positive(),
      expenseRatio: z.number().min(0).max(100).optional(),
    }))
    .query(async ({ input }) => {
      const lossRatio = (input.claimsPaid / input.premiumsEarned) * 100;
      const expenseRatio = input.expenseRatio ?? 28;
      const combinedRatio = lossRatio + expenseRatio;
      return {
        lossRatio: parseFloat(lossRatio.toFixed(2)),
        expenseRatio,
        combinedRatio: parseFloat(combinedRatio.toFixed(2)),
        profitable: combinedRatio < 100,
        underwritingResult: combinedRatio < 100
          ? parseFloat(((100 - combinedRatio) / 100 * input.premiumsEarned).toFixed(2))
          : parseFloat(((combinedRatio - 100) / 100 * input.premiumsEarned * -1).toFixed(2)),
        benchmark: { excellent: 85, good: 95, acceptable: 100 },
        rating: lossRatio < 70 ? 'excellent' : lossRatio < 85 ? 'good' : lossRatio < 100 ? 'acceptable' : 'unprofitable',
      };
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
      coverageAmount: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      const { age, creditScore, claimsHistory } = input.applicantData;
      const ageRisk = age < 25 || age > 70 ? 'elevated' : 'standard';
      const creditRisk = creditScore < 600 ? 'high' : creditScore < 720 ? 'medium' : 'low';
      const claimsRisk = claimsHistory > 3 ? 'high' : claimsHistory > 1 ? 'medium' : 'low';
      const scores = { high: 3, medium: 2, low: 1, elevated: 2, standard: 1 } as Record<string, number>;
      const totalRisk = scores[ageRisk] + scores[creditRisk] + scores[claimsRisk];
      const overallRisk = totalRisk >= 7 ? 'high' : totalRisk >= 5 ? 'medium' : 'low';
      return {
        riskAssessmentId: `RA-${Date.now()}`,
        overallRisk,
        factors: { ageRisk, creditRisk, claimsRisk },
        riskScore: totalRisk,
        recommendedPremiumMultiplier: totalRisk >= 7 ? 1.5 : totalRisk >= 5 ? 1.2 : 1.0,
        maxRecommendedCoverage: overallRisk === 'high' ? input.coverageAmount * 0.7 : input.coverageAmount,
        underwritingDecision: overallRisk === 'high' ? 'refer-to-senior' : 'approve',
        assessedAt: new Date().toISOString(),
      };
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
      const flagged = input.claimData.map(claim => {
        const reportDelay = Math.abs(
          new Date(claim.reportDate).getTime() - new Date(claim.dateOfLoss).getTime()
        ) / (1000 * 60 * 60 * 24);
        const indicators = [
          ...(claim.amount > 75000 ? ['High claim amount'] : []),
          ...(reportDelay > 30 ? ['Late reporting (>30 days)'] : []),
          ...(reportDelay < 0.5 ? ['Unusually fast reporting (<12h)'] : []),
        ];
        const score = Math.min(100, indicators.length * 25 + (claim.amount > 100000 ? 20 : 0));
        return {
          claimId: claim.claimId,
          claimant: claim.claimant,
          amount: claim.amount,
          fraudScore: score,
          risk: score > 60 ? 'high' : score > 30 ? 'medium' : 'low',
          indicators,
          recommendation: score > 60 ? 'Refer to SIU' : score > 30 ? 'Additional verification' : 'Standard processing',
        };
      });
      return {
        totalClaims: input.claimData.length,
        flaggedClaims: flagged.filter(f => f.risk !== 'low').length,
        highRiskClaims: flagged.filter(f => f.risk === 'high').length,
        results: flagged,
        analysedAt: new Date().toISOString(),
      };
    }),
});
