import { z } from 'zod';
import { router, publicProcedure } from './trpc';

// Compliance Router
const complianceRouter = router({
  check: publicProcedure
    .input(z.object({
      standard: z.enum(['ISO9001', 'ISO14001', 'ISO45001', 'ISO17025', 'ISO27001']),
      documentId: z.string().optional(),
      content: z.string().optional(),
      clauses: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return {
        findings: [],
        compliantCount: 0,
        nonCompliantCount: 0,
        partialCount: 0,
        notApplicableCount: 0,
        overallScore: 0,
      };
    }),

  score: publicProcedure
    .input(z.object({
      standard: z.enum(['ISO9001', 'ISO14001', 'ISO45001', 'ISO17025', 'ISO27001']),
      findings: z.array(z.object({
        clause: z.string(),
        status: z.enum(['compliant', 'partial', 'non-compliant', 'not-applicable']),
        weight: z.number().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const total = input.findings.length;
      const compliant = input.findings.filter(f => f.status === 'compliant').length;
      const score = total > 0 ? (compliant / total) * 100 : 0;
      
      return {
        overallScore: score,
        complianceRate: score,
        totalClauses: total,
        compliantClauses: compliant,
        nonCompliantClauses: input.findings.filter(f => f.status === 'non-compliant').length,
        partialClauses: input.findings.filter(f => f.status === 'partial').length,
        grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
      };
    }),

  gapAnalysis: publicProcedure
    .input(z.object({
      standard: z.enum(['ISO9001', 'ISO14001', 'ISO45001', 'ISO17025', 'ISO27001']),
      currentState: z.array(z.object({
        clause: z.string(),
        status: z.enum(['compliant', 'partial', 'non-compliant', 'not-applicable']),
        evidence: z.array(z.string()).optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const gaps = input.currentState
        .filter(c => c.status === 'non-compliant' || c.status === 'partial')
        .map(c => ({
          clause: c.clause,
          currentStatus: c.status,
          gap: c.status === 'non-compliant' ? 'Full implementation required' : 'Partial implementation - improvements needed',
          priority: c.status === 'non-compliant' ? 'high' : 'medium',
          recommendations: [],
          estimatedEffort: c.status === 'non-compliant' ? 'high' : 'medium',
        }));

      return {
        standard: input.standard,
        totalGaps: gaps.length,
        criticalGaps: gaps.filter(g => g.priority === 'high').length,
        gaps,
        summary: `Found ${gaps.length} gaps requiring attention`,
        actionPlan: gaps.map(g => ({
          clause: g.clause,
          action: g.gap,
          priority: g.priority,
          owner: '',
          dueDate: null,
        })),
      };
    }),
});

// Audit Router
const auditRouter = router({
  generate: publicProcedure
    .input(z.object({
      standard: z.enum(['ISO9001', 'ISO14001', 'ISO45001', 'ISO17025', 'ISO27001']),
      scope: z.string(),
      clauses: z.array(z.string()).optional(),
      auditType: z.enum(['internal', 'external', 'surveillance', 'certification']).optional(),
    }))
    .mutation(async ({ input }) => {
      return {
        id: `audit-${Date.now()}`,
        standard: input.standard,
        scope: input.scope,
        auditType: input.auditType || 'internal',
        checklist: [],
        estimatedDuration: '4-8 hours',
        createdAt: new Date(),
      };
    }),

  createPlan: publicProcedure
    .input(z.object({
      title: z.string(),
      standard: z.enum(['ISO9001', 'ISO14001', 'ISO45001', 'ISO17025', 'ISO27001']),
      scope: z.string(),
      objectives: z.array(z.string()),
      startDate: z.date(),
      endDate: z.date(),
      auditors: z.array(z.string()),
      auditees: z.array(z.string()),
      clauses: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return {
        id: `plan-${Date.now()}`,
        ...input,
        status: 'draft',
        schedule: [],
        resources: [],
        createdAt: new Date(),
      };
    }),
});

// Risk Router
const riskRouter = router({
  assess: publicProcedure
    .input(z.object({
      riskId: z.string().optional(),
      description: z.string(),
      category: z.enum(['quality', 'environmental', 'safety', 'security', 'operational', 'strategic']),
      likelihood: z.enum(['rare', 'unlikely', 'possible', 'likely', 'almost-certain']),
      consequence: z.enum(['insignificant', 'minor', 'moderate', 'major', 'catastrophic']),
      context: z.string().optional(),
      existingControls: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const likelihoodScore = { 'rare': 1, 'unlikely': 2, 'possible': 3, 'likely': 4, 'almost-certain': 5 }[input.likelihood];
      const consequenceScore = { 'insignificant': 1, 'minor': 2, 'moderate': 3, 'major': 4, 'catastrophic': 5 }[input.consequence];
      const riskScore = likelihoodScore * consequenceScore;
      const riskLevel = riskScore >= 15 ? 'extreme' : riskScore >= 10 ? 'high' : riskScore >= 5 ? 'medium' : 'low';

      return {
        id: input.riskId || `risk-${Date.now()}`,
        description: input.description,
        category: input.category,
        likelihood: input.likelihood,
        consequence: input.consequence,
        riskScore,
        riskLevel,
        requiresAction: riskLevel === 'extreme' || riskLevel === 'high',
        recommendations: [],
        residualRisk: null,
        assessedAt: new Date(),
      };
    }),

  matrix: publicProcedure
    .input(z.object({
      risks: z.array(z.object({
        id: z.string(),
        description: z.string(),
        likelihood: z.enum(['rare', 'unlikely', 'possible', 'likely', 'almost-certain']),
        consequence: z.enum(['insignificant', 'minor', 'moderate', 'major', 'catastrophic']),
      })),
    }))
    .query(async ({ input }) => {
      const matrix = input.risks.map(risk => {
        const likelihoodScore = { 'rare': 1, 'unlikely': 2, 'possible': 3, 'likely': 4, 'almost-certain': 5 }[risk.likelihood];
        const consequenceScore = { 'insignificant': 1, 'minor': 2, 'moderate': 3, 'major': 4, 'catastrophic': 5 }[risk.consequence];
        const riskScore = likelihoodScore * consequenceScore;
        const riskLevel = riskScore >= 15 ? 'extreme' : riskScore >= 10 ? 'high' : riskScore >= 5 ? 'medium' : 'low';

        return {
          ...risk,
          likelihoodScore,
          consequenceScore,
          riskScore,
          riskLevel,
        };
      });

      return {
        matrix,
        summary: {
          total: matrix.length,
          extreme: matrix.filter(r => r.riskLevel === 'extreme').length,
          high: matrix.filter(r => r.riskLevel === 'high').length,
          medium: matrix.filter(r => r.riskLevel === 'medium').length,
          low: matrix.filter(r => r.riskLevel === 'low').length,
        },
      };
    }),

  climate: publicProcedure
    .input(z.object({
      organizationContext: z.string(),
      location: z.string().optional(),
      climateHazards: z.array(z.enum([
        'extreme-heat', 'flooding', 'drought', 'storms', 'sea-level-rise',
        'wildfires', 'cold-waves', 'precipitation-changes'
      ])).optional(),
      timeHorizon: z.enum(['short-term', 'medium-term', 'long-term']).optional(),
    }))
    .mutation(async ({ input }) => {
      const hazards = input.climateHazards || ['extreme-heat', 'flooding', 'storms'];
      
      const risks = hazards.map(hazard => ({
        id: `climate-${hazard}-${Date.now()}`,
        hazard,
        description: `Climate risk from ${hazard}`,
        likelihood: 'possible' as const,
        consequence: 'moderate' as const,
        adaptationMeasures: [],
        monitoringPlan: '',
      }));

      return {
        organizationContext: input.organizationContext,
        location: input.location,
        timeHorizon: input.timeHorizon || 'medium-term',
        identifiedRisks: risks,
        opportunities: [],
        adaptationPlan: {
          measures: [],
          timeline: '',
          responsibilities: [],
        },
        iso14001Compliance: true,
        assessedAt: new Date(),
      };
    }),
});

// CAPA Router
const capaRouter = router({
  create: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      type: z.enum(['corrective', 'preventive']),
      source: z.enum(['audit', 'complaint', 'nonconformity', 'risk', 'improvement']),
      rootCause: z.string().optional(),
      proposedAction: z.string(),
      owner: z.string(),
      dueDate: z.date(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
    }))
    .mutation(async ({ input }) => {
      return {
        id: `capa-${Date.now()}`,
        ...input,
        status: 'open',
        effectiveness: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        closedAt: null,
      };
    }),

  fiveWhys: publicProcedure
    .input(z.object({
      problem: z.string(),
      whys: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const whys = input.whys || [
        { question: 'Why did this happen?', answer: '' },
        { question: 'Why did that happen?', answer: '' },
        { question: 'Why did that occur?', answer: '' },
        { question: 'Why was that the case?', answer: '' },
        { question: 'Why is that the root cause?', answer: '' },
      ];

      return {
        problem: input.problem,
        whys,
        rootCause: whys[whys.length - 1]?.answer || 'To be determined',
        recommendations: [],
        createdAt: new Date(),
      };
    }),

  fishbone: publicProcedure
    .input(z.object({
      problem: z.string(),
      categories: z.array(z.object({
        name: z.enum(['people', 'process', 'equipment', 'materials', 'environment', 'management']),
        causes: z.array(z.string()),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const defaultCategories = [
        { name: 'people' as const, causes: [] },
        { name: 'process' as const, causes: [] },
        { name: 'equipment' as const, causes: [] },
        { name: 'materials' as const, causes: [] },
        { name: 'environment' as const, causes: [] },
        { name: 'management' as const, causes: [] },
      ];

      return {
        problem: input.problem,
        categories: input.categories || defaultCategories,
        rootCauses: [],
        recommendations: [],
        createdAt: new Date(),
      };
    }),
});

// Main ISO Router
export const isoRouter = router({
  compliance: complianceRouter,
  audit: auditRouter,
  risk: riskRouter,
  capa: capaRouter,
});
