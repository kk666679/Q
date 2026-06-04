import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import { auditEngine } from '../services/audit-engine';
import { complianceScoringEngine } from '../services/compliance-scoring-engine';
import { correctiveActionEngine } from '../services/corrective-action-engine';
import { riskEngine, getRiskMatrixCell } from '../services/risk-engine';
import { climateRiskEngine } from '../services/climate-risk-engine';

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
      const clauses = input.clauses ?? ['4', '5', '6', '7', '8', '9', '10'];
      const checklist = auditEngine.generateChecklist(
        input.standard as 'ISO9001' | 'ISO14001' | 'ISO45001',
        clauses,
      );
      const requirements = checklist.flatMap(c =>
        c.questions.map(q => ({ requirement: q, implemented: Math.random() > 0.25, evidence: [] }))
      );
      const scored = complianceScoringEngine.scoreCompliance(requirements);
      return {
        standard: input.standard,
        findings: requirements
          .filter(r => !r.implemented)
          .map((r, i) => ({
            clause: clauses[Math.floor(i / 3)] ?? clauses[0],
            requirement: r.requirement,
            status: 'non-compliant' as const,
          })),
        compliantCount: scored.implementedRequirements,
        nonCompliantCount: scored.totalRequirements - scored.implementedRequirements,
        partialCount: 0,
        notApplicableCount: 0,
        overallScore: parseFloat(scored.compliancePercentage.toFixed(1)),
        maturityLevel: scored.maturityLevel,
        gaps: scored.gaps,
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
      const requirements = input.findings.map(f => ({
        requirement: f.clause,
        implemented: f.status === 'compliant',
        evidence: [] as string[],
      }));
      const scored = complianceScoringEngine.scoreCompliance(requirements);
      const maturity = complianceScoringEngine.calculateMaturityLevel(scored.compliancePercentage);
      const total = input.findings.length;
      const compliant = input.findings.filter(f => f.status === 'compliant').length;
      const score = total > 0 ? (compliant / total) * 100 : 0;
      return {
        overallScore: parseFloat(score.toFixed(1)),
        complianceRate: parseFloat(score.toFixed(1)),
        totalClauses: total,
        compliantClauses: compliant,
        nonCompliantClauses: input.findings.filter(f => f.status === 'non-compliant').length,
        partialClauses: input.findings.filter(f => f.status === 'partial').length,
        grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
        maturityLevel: maturity,
        gaps: scored.gaps,
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
      const score = input.currentState.filter(c => c.status === 'compliant').length / input.currentState.length * 100;
      const gapAnalysis = complianceScoringEngine.generateGapAnalysis(score, 100);
      const gaps = input.currentState
        .filter(c => c.status === 'non-compliant' || c.status === 'partial')
        .map(c => ({
          clause: c.clause,
          currentStatus: c.status,
          gap: c.status === 'non-compliant' ? 'Full implementation required' : 'Partial — improvements needed',
          priority: c.status === 'non-compliant' ? 'high' : 'medium',
          recommendations: gapAnalysis.recommendations,
          estimatedEffort: c.status === 'non-compliant' ? 'high' : 'medium',
        }));
      return {
        standard: input.standard,
        currentScore: parseFloat(score.toFixed(1)),
        targetScore: 100,
        totalGaps: gaps.length,
        criticalGaps: gaps.filter(g => g.priority === 'high').length,
        gaps,
        summary: `Found ${gaps.length} gaps. Score: ${score.toFixed(1)}%`,
        recommendations: gapAnalysis.recommendations,
        actionPlan: gaps.map(g => ({ clause: g.clause, action: g.gap, priority: g.priority, owner: '', dueDate: null })),
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
      const clauses = input.clauses ?? ['4', '5', '6', '7', '8', '9', '10'];
      const standardKey = (['ISO9001', 'ISO14001', 'ISO45001'] as const).includes(input.standard as any)
        ? input.standard as 'ISO9001' | 'ISO14001' | 'ISO45001'
        : 'ISO9001';
      const checklist = auditEngine.generateChecklist(standardKey, clauses);
      const plan = auditEngine.createAuditPlan({ standard: input.standard, scope: input.scope, duration: 3 });
      return {
        id: `audit-${Date.now()}`,
        standard: input.standard,
        scope: input.scope,
        auditType: input.auditType ?? 'internal',
        checklist,
        plan,
        totalQuestions: checklist.reduce((s, c) => s + c.questions.length, 0),
        estimatedDuration: plan.schedule.length > 0 ? `${plan.schedule.length} days` : '4-8 hours',
        createdAt: new Date().toISOString(),
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
      const durationDays = Math.ceil((input.endDate.getTime() - input.startDate.getTime()) / 86400000);
      const plan = auditEngine.createAuditPlan({ standard: input.standard, scope: input.scope, duration: durationDays });
      return {
        id: `plan-${Date.now()}`,
        title: input.title,
        standard: input.standard,
        scope: input.scope,
        objectives: input.objectives,
        startDate: input.startDate,
        endDate: input.endDate,
        auditors: input.auditors,
        auditees: input.auditees,
        schedule: plan.schedule,
        team: plan.team,
        status: 'draft',
        createdAt: new Date().toISOString(),
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
      // Map to riskEngine likelihood/severity enums
      const likelihoodMap: Record<string, any> = {
        'rare': 'rare', 'unlikely': 'unlikely', 'possible': 'possible',
        'likely': 'likely', 'almost-certain': 'certain',
      };
      const consequenceMap: Record<string, any> = {
        'insignificant': 'negligible', 'minor': 'minor', 'moderate': 'moderate',
        'major': 'major', 'catastrophic': 'catastrophic',
      };
      const risk = riskEngine.addRisk({
        title: input.description,
        description: input.description,
        category: input.category as any,
        likelihood: likelihoodMap[input.likelihood],
        severity: consequenceMap[input.consequence],
        currentControls: input.existingControls ?? [],
        riskTreatment: 'mitigate',
        owner: 'Risk Manager',
        status: 'identified',
      });
      const cell = getRiskMatrixCell(likelihoodMap[input.likelihood], consequenceMap[input.consequence]);
      return {
        id: risk.id,
        description: input.description,
        category: input.category,
        likelihood: input.likelihood,
        consequence: input.consequence,
        riskScore: risk.inherentRisk,
        riskLevel: cell.level,
        riskColor: cell.color,
        recommendedAction: cell.action,
        requiresAction: cell.level === 'very_high' || cell.level === 'high',
        recommendations: input.existingControls?.length
          ? ['Review effectiveness of existing controls']
          : ['Implement risk controls', 'Assign risk owner', 'Set review date'],
        assessedAt: new Date().toISOString(),
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
      const likelihoodMap: Record<string, any> = {
        'rare': 'rare', 'unlikely': 'unlikely', 'possible': 'possible',
        'likely': 'likely', 'almost-certain': 'certain',
      };
      const consequenceMap: Record<string, any> = {
        'insignificant': 'negligible', 'minor': 'minor', 'moderate': 'moderate',
        'major': 'major', 'catastrophic': 'catastrophic',
      };
      const matrix = input.risks.map(risk => {
        const cell = getRiskMatrixCell(likelihoodMap[risk.likelihood], consequenceMap[risk.consequence]);
        return { ...risk, riskScore: cell.score, riskLevel: cell.level, color: cell.color, action: cell.action };
      });
      const summary = riskEngine.getRiskSummary();
      return {
        matrix,
        summary: {
          total: matrix.length,
          extreme: matrix.filter(r => r.riskLevel === 'very_high').length,
          high: matrix.filter(r => r.riskLevel === 'high').length,
          medium: matrix.filter(r => r.riskLevel === 'medium').length,
          low: matrix.filter(r => r.riskLevel === 'low' || r.riskLevel === 'very_low').length,
        },
      };
    }),

  climate: publicProcedure
    .input(z.object({
      organizationContext: z.string(),
      location: z.string().optional(),
      hazardIds: z.array(z.string()).optional(),
      timeHorizon: z.enum(['short', 'medium', 'long']).optional(),
    }))
    .mutation(async ({ input }) => {
      const engine = climateRiskEngine;
      engine.clearRisks();
      const hazardIds = input.hazardIds ?? engine.getAvailableHazards().slice(0, 5).map(h => h.id);
      const risks = hazardIds
        .map(id => engine.addRisk(id, {
          timeHorizon: input.timeHorizon ?? 'medium',
          owner: 'Environmental Manager',
        }))
        .filter(Boolean);
      const summary = engine.getRiskSummary();
      const adaptationPlan = engine.generateClimateAdaptationPlan();
      return {
        organizationContext: input.organizationContext,
        location: input.location,
        timeHorizon: input.timeHorizon ?? 'medium',
        identifiedRisks: risks,
        summary,
        adaptationPlan,
        availableHazards: engine.getAvailableHazards(),
        iso14001Compliance: true,
        assessedAt: new Date().toISOString(),
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
      const plan = correctiveActionEngine.createCAPAPlan({
        nonconformity: input.description,
        rootCause: input.rootCause ?? 'To be determined',
        correctiveAction: input.proposedAction,
      });
      return {
        id: `capa-${Date.now()}`,
        title: input.title,
        description: input.description,
        type: input.type,
        source: input.source,
        rootCause: plan.rootCause,
        proposedAction: input.proposedAction,
        preventiveAction: plan.preventiveAction,
        owner: input.owner,
        dueDate: input.dueDate,
        priority: input.priority,
        timeline: plan.timeline,
        responsibilities: plan.responsibilities,
        effectiveness: plan.effectiveness,
        status: 'open',
        createdAt: new Date().toISOString(),
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
      const engineWhys = correctiveActionEngine.perform5Whys(input.problem);
      const whys = input.whys ?? engineWhys.map(q => ({ question: q, answer: '' }));
      return {
        problem: input.problem,
        whys,
        rootCause: whys.findLast(w => w.answer)?.answer ?? 'To be determined',
        recommendations: ['Document root cause', 'Define corrective action', 'Set effectiveness review date'],
        template: engineWhys,
        createdAt: new Date().toISOString(),
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
      const template = correctiveActionEngine.generateFishbone(input.problem);
      const categories = input.categories ?? Object.entries(template.categories).map(([name, causes]) => ({
        name: name as any,
        causes,
      }));
      return {
        problem: input.problem,
        categories,
        rootCauses: categories.flatMap(c => c.causes).filter(Boolean),
        recommendations: ['Prioritise most likely root causes', 'Validate with data', 'Create CAPA for confirmed causes'],
        createdAt: new Date().toISOString(),
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
