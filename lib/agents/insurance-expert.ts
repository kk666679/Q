import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

export const insuranceExpertAgent: AgentConfig = {
  id: 'insurance-expert',
  role: AgentRole.QUALITY_MANAGER,
  name: 'Insurance Expert',
  capabilities: [
    'Policy Administration Systems',
    'Claims Management',
    'Underwriting & Risk Assessment',
    'Actuarial Analysis',
    'Fraud Detection',
    'Regulatory Compliance',
    'InsurTech Solutions',
  ],
  systemPrompt: `You are an Insurance Expert specializing in insurance systems, underwriting, claims processing, actuarial analysis, and insurtech solutions.

Your expertise includes:
- Policy administration and management
- Claims processing and investigation
- Underwriting and risk assessment
- Actuarial modeling and loss ratio analysis
- Fraud detection and prevention
- Regulatory compliance (NAIC, ACORD, state regulations)
- Insurance types: P&C, Life, Health, Auto, Commercial

Provide expert guidance on insurance operations, risk management, and technology implementation.`,
  tools: [
    {
      name: 'generate_insurance_quote',
      description: 'Generate insurance quote with risk assessment',
      parameters: z.object({
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
      }),
      execute: async (params) => {
        let baseRate = 500;
        let riskScore = 50;
        
        // Age factor
        if (params.applicant.age < 25) riskScore += 20;
        else if (params.applicant.age > 65) riskScore += 5;
        else riskScore -= 10;
        
        // Credit score factor
        if (params.applicant.creditScore < 600) riskScore += 15;
        else if (params.applicant.creditScore > 750) riskScore -= 10;
        
        // Risk factors
        if (params.riskFactors) {
          riskScore += (params.riskFactors.accidents || 0) * 10;
          riskScore += (params.riskFactors.violations || 0) * 5;
          riskScore += (params.riskFactors.claims || 0) * 8;
        }
        
        const riskMultiplier = 1 + (riskScore / 100);
        let totalPremium = baseRate * riskMultiplier;
        
        // Coverage adjustments
        if (params.coverage.collision) totalPremium += 300;
        if (params.coverage.comprehensive) totalPremium += 150;
        
        // Discounts
        const discounts: Record<string, number> = {};
        if (params.applicant.creditScore > 750) discounts.goodCredit = 10;
        if (!params.riskFactors?.accidents && !params.riskFactors?.violations) {
          discounts.goodDriver = 15;
        }
        
        const discountAmount = Object.values(discounts).reduce((a, b) => a + b, 0);
        totalPremium = totalPremium * (1 - discountAmount / 100);
        
        return {
          quoteId: `QT-${Date.now().toString(36).toUpperCase()}`,
          policyType: params.policyType,
          annualPremium: totalPremium.toFixed(2),
          monthlyPremium: (totalPremium / 12).toFixed(2),
          riskScore: riskScore.toFixed(1),
          riskClass: riskScore < 40 ? 'preferred' : riskScore < 60 ? 'standard' : 'substandard',
          discounts,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      },
    },
    {
      name: 'process_claim',
      description: 'Process insurance claim with fraud detection',
      parameters: z.object({
        policyNumber: z.string(),
        claimType: z.enum(['collision', 'theft', 'liability', 'comprehensive', 'medical']),
        dateOfLoss: z.string(),
        estimatedLoss: z.number(),
        description: z.string(),
      }),
      execute: async (params) => {
        const claimNumber = `CLM-${Date.now().toString(36).toUpperCase()}`;
        
        // Fraud detection
        const daysToReport = Math.floor((Date.now() - new Date(params.dateOfLoss).getTime()) / (1000 * 60 * 60 * 24));
        let fraudScore = 0;
        const fraudIndicators = [];
        
        if (daysToReport > 30) {
          fraudScore += 0.2;
          fraudIndicators.push('Late reporting');
        }
        if (params.estimatedLoss > 50000) {
          fraudScore += 0.15;
          fraudIndicators.push('High loss amount');
        }
        
        const status = fraudScore > 0.5 ? 'investigating' : 'reported';
        const reserveAmount = params.estimatedLoss * 1.5;
        
        return {
          claimNumber,
          policyNumber: params.policyNumber,
          status,
          dateReported: new Date().toISOString(),
          estimatedLoss: params.estimatedLoss,
          reserveAmount: reserveAmount.toFixed(2),
          fraudScore: fraudScore.toFixed(2),
          fraudIndicators,
          adjusterAssigned: 'ADJ-001',
          nextSteps: fraudScore > 0.5 ? [
            'Special Investigation Unit review',
            'Verify loss details',
            'Interview claimant',
          ] : [
            'Inspect damage',
            'Obtain repair estimates',
            'Process payment',
          ],
        };
      },
    },
    {
      name: 'calculate_loss_ratio',
      description: 'Calculate loss ratio and profitability metrics',
      parameters: z.object({
        claimsPaid: z.number(),
        premiumsEarned: z.number(),
        expenseRatio: z.number().optional(),
      }),
      execute: async (params) => {
        const lossRatio = (params.claimsPaid / params.premiumsEarned) * 100;
        const expenseRatio = params.expenseRatio || 25;
        const combinedRatio = lossRatio + expenseRatio;
        
        let assessment = 'Profitable';
        if (lossRatio >= 75) assessment = 'Unprofitable';
        else if (lossRatio >= 60) assessment = 'Target range';
        
        return {
          lossRatio: lossRatio.toFixed(2),
          expenseRatio: expenseRatio.toFixed(2),
          combinedRatio: combinedRatio.toFixed(2),
          profitable: combinedRatio < 100,
          underwritingGainLoss: (100 - combinedRatio).toFixed(2),
          assessment,
          recommendations: combinedRatio >= 100 ? [
            'Review underwriting guidelines',
            'Increase premium rates',
            'Reduce expenses',
            'Improve claims management',
          ] : ['Maintain current strategy'],
        };
      },
    },
    {
      name: 'assess_underwriting_risk',
      description: 'Assess underwriting risk for policy application',
      parameters: z.object({
        applicantData: z.object({
          age: z.number(),
          occupation: z.string(),
          healthStatus: z.string().optional(),
          creditScore: z.number(),
          claimsHistory: z.number(),
        }),
        coverageAmount: z.number(),
      }),
      execute: async (params) => {
        let riskScore = 50;
        const riskFactors = [];
        
        // Age assessment
        if (params.applicantData.age < 25 || params.applicantData.age > 70) {
          riskScore += 15;
          riskFactors.push('Age outside preferred range');
        }
        
        // Credit score
        if (params.applicantData.creditScore < 650) {
          riskScore += 20;
          riskFactors.push('Below average credit score');
        }
        
        // Claims history
        if (params.applicantData.claimsHistory > 2) {
          riskScore += 25;
          riskFactors.push('Multiple claims in history');
        }
        
        // Coverage amount
        if (params.coverageAmount > 500000) {
          riskScore += 10;
          riskFactors.push('High coverage amount');
        }
        
        const decision = riskScore < 50 ? 'approve' : riskScore < 70 ? 'approve_with_conditions' : 'decline';
        
        return {
          riskScore: riskScore.toFixed(1),
          riskClass: riskScore < 40 ? 'preferred' : riskScore < 60 ? 'standard' : 'substandard',
          decision,
          riskFactors,
          recommendedPremium: decision !== 'decline' ? (params.coverageAmount * 0.01 * (riskScore / 50)).toFixed(2) : null,
          conditions: decision === 'approve_with_conditions' ? [
            'Higher deductible required',
            'Annual policy review',
            'Premium surcharge applied',
          ] : [],
        };
      },
    },
    {
      name: 'detect_fraud_patterns',
      description: 'Detect fraud patterns in claims data',
      parameters: z.object({
        claimData: z.array(z.object({
          claimId: z.string(),
          amount: z.number(),
          dateOfLoss: z.string(),
          reportDate: z.string(),
          claimant: z.string(),
        })),
      }),
      execute: async (params) => {
        const suspiciousClaims = [];
        
        for (const claim of params.claimData) {
          let suspicionScore = 0;
          const indicators = [];
          
          const daysToReport = Math.floor(
            (new Date(claim.reportDate).getTime() - new Date(claim.dateOfLoss).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysToReport > 30) {
            suspicionScore += 30;
            indicators.push('Delayed reporting');
          }
          if (claim.amount > 25000) {
            suspicionScore += 25;
            indicators.push('High claim amount');
          }
          
          // Check for duplicate claimants
          const duplicates = params.claimData.filter(c => c.claimant === claim.claimant && c.claimId !== claim.claimId);
          if (duplicates.length > 1) {
            suspicionScore += 35;
            indicators.push('Multiple claims by same claimant');
          }
          
          if (suspicionScore >= 50) {
            suspiciousClaims.push({
              claimId: claim.claimId,
              suspicionScore,
              indicators,
              recommendation: suspicionScore >= 70 ? 'Refer to SIU' : 'Enhanced investigation',
            });
          }
        }
        
        return {
          totalClaims: params.claimData.length,
          suspiciousClaims: suspiciousClaims.length,
          fraudRate: ((suspiciousClaims.length / params.claimData.length) * 100).toFixed(2),
          flaggedClaims: suspiciousClaims,
          recommendations: [
            'Implement automated fraud scoring',
            'Cross-reference with industry databases',
            'Enhanced verification for high-risk claims',
          ],
        };
      },
    },
  ],
};
