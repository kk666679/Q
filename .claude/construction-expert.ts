import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

export const constructionExpertAgent: AgentConfig = {
  id: 'construction-expert',
  role: AgentRole.QUALITY_MANAGER,
  name: 'Construction Expert',
  capabilities: [
    'Construction Project Management',
    'Building Information Modeling (BIM)',
    'Safety Compliance & OSHA',
    'Cost Estimation & Control',
    'Critical Path Scheduling',
    'Quality Assurance',
    'Risk Management',
  ],
  systemPrompt: `You are a Construction Expert specializing in construction management, project planning, BIM, safety compliance, and modern construction technology.

Your expertise includes:
- Project planning and scheduling (Critical Path Method)
- Cost estimation and control
- Building Information Modeling (BIM) and clash detection
- OSHA safety regulations and compliance
- Quality assurance and building codes
- Risk management and change order management
- Standards: AIA, IBC, ISO 19650, LEED

Provide expert guidance on construction projects, safety, and technology implementation.`,
  tools: [
    {
      name: 'estimate_project_cost',
      description: 'Estimate construction project costs with detailed breakdown',
      parameters: z.object({
        projectType: z.enum(['residential_basic', 'residential_luxury', 'commercial_office', 'industrial_warehouse']),
        squareFootage: z.number(),
        specifications: z.object({
          customDesign: z.boolean().optional(),
          sustainableMaterials: z.boolean().optional(),
          complexSite: z.boolean().optional(),
        }),
      }),
      execute: async (params) => {
        const baseCosts: Record<string, number> = {
          residential_basic: 150,
          residential_luxury: 300,
          commercial_office: 200,
          industrial_warehouse: 75,
        };
        
        const baseCostPerSF = baseCosts[params.projectType];
        let baseCost = baseCostPerSF * params.squareFootage;
        let complexityFactor = 1.0;
        
        if (params.specifications.customDesign) complexityFactor += 0.15;
        if (params.specifications.sustainableMaterials) complexityFactor += 0.10;
        if (params.specifications.complexSite) complexityFactor += 0.20;
        
        const adjustedCost = baseCost * complexityFactor;
        const contingency = adjustedCost * 0.10;
        
        return {
          projectType: params.projectType,
          squareFootage: params.squareFootage,
          baseCostPerSF: baseCostPerSF,
          complexityFactor: complexityFactor.toFixed(2),
          adjustedCost: adjustedCost.toFixed(2),
          contingency: contingency.toFixed(2),
          totalEstimate: (adjustedCost + contingency).toFixed(2),
          breakdown: {
            siteWork: (adjustedCost * 0.08).toFixed(2),
            foundation: (adjustedCost * 0.12).toFixed(2),
            structure: (adjustedCost * 0.25).toFixed(2),
            exterior: (adjustedCost * 0.15).toFixed(2),
            interior: (adjustedCost * 0.20).toFixed(2),
            mep: (adjustedCost * 0.20).toFixed(2),
          },
        };
      },
    },
    {
      name: 'calculate_project_schedule',
      description: 'Calculate project schedule using Critical Path Method',
      parameters: z.object({
        projectId: z.string(),
        tasks: z.array(z.object({
          name: z.string(),
          duration: z.number(),
          predecessors: z.array(z.string()).optional(),
        })),
      }),
      execute: async (params) => {
        const totalDuration = params.tasks.reduce((sum, t) => sum + t.duration, 0);
        const criticalPath = params.tasks.filter(t => !t.predecessors || t.predecessors.length === 0);
        
        return {
          projectId: params.projectId,
          totalTasks: params.tasks.length,
          estimatedDuration: totalDuration,
          criticalPathTasks: criticalPath.length,
          milestones: [
            { phase: 'Site Preparation', day: 15 },
            { phase: 'Foundation', day: 45 },
            { phase: 'Framing', day: 90 },
            { phase: 'MEP Rough-in', day: 120 },
            { phase: 'Interior Finish', day: 150 },
            { phase: 'Final Inspection', day: totalDuration },
          ],
        };
      },
    },
    {
      name: 'assess_safety_compliance',
      description: 'Assess OSHA safety compliance and conduct inspection',
      parameters: z.object({
        projectId: z.string(),
        inspector: z.string(),
        areas: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const inspectionItems = [
          'Personal protective equipment (PPE)',
          'Fall protection systems',
          'Scaffolding integrity',
          'Electrical safety',
          'Equipment guarding',
          'Housekeeping',
          'Fire prevention',
          'First aid availability',
          'Emergency exits',
          'Signage and barriers',
        ];
        
        const violations = [
          { item: 'Fall protection systems', severity: 'major', action: 'Correct immediately' },
          { item: 'Housekeeping', severity: 'minor', action: 'Correct within 24 hours' },
        ];
        
        const passedItems = inspectionItems.length - violations.length;
        const score = (passedItems / inspectionItems.length) * 100;
        
        return {
          projectId: params.projectId,
          inspector: params.inspector,
          inspectionDate: new Date().toISOString(),
          itemsInspected: inspectionItems.length,
          itemsPassed: passedItems,
          violations: violations,
          overallScore: score.toFixed(1),
          status: violations.length === 0 ? 'pass' : 'fail',
          recommendations: [
            'Install additional fall protection anchors',
            'Implement daily housekeeping checklist',
            'Conduct weekly safety toolbox talks',
          ],
        };
      },
    },
    {
      name: 'detect_bim_clashes',
      description: 'Detect clashes in BIM models between disciplines',
      parameters: z.object({
        modelIds: z.array(z.string()),
        disciplines: z.array(z.string()),
      }),
      execute: async (params) => {
        const clashes = [
          {
            clashId: 'CLASH-001',
            type: 'hard',
            disciplines: ['structural', 'mep'],
            description: 'Steel beam conflicts with HVAC duct',
            location: 'Level 3, Grid B-4',
            severity: 'high',
            status: 'open',
          },
          {
            clashId: 'CLASH-002',
            type: 'soft',
            disciplines: ['architectural', 'mep'],
            description: 'Insufficient clearance for plumbing access',
            location: 'Level 2, Grid C-2',
            severity: 'medium',
            status: 'open',
          },
        ];
        
        return {
          modelsAnalyzed: params.modelIds,
          totalClashes: clashes.length,
          hardClashes: clashes.filter(c => c.type === 'hard').length,
          softClashes: clashes.filter(c => c.type === 'soft').length,
          clashes,
          recommendations: [
            'Coordinate MEP routing with structural team',
            'Review architectural clearances',
            'Schedule coordination meeting',
          ],
        };
      },
    },
    {
      name: 'track_project_progress',
      description: 'Track construction project progress and performance',
      parameters: z.object({
        projectId: z.string(),
        currentPhase: z.string(),
        completedTasks: z.number(),
        totalTasks: z.number(),
        budgetSpent: z.number(),
        totalBudget: z.number(),
      }),
      execute: async (params) => {
        const progressPercent = (params.completedTasks / params.totalTasks) * 100;
        const budgetPercent = (params.budgetSpent / params.totalBudget) * 100;
        const scheduleVariance = progressPercent - budgetPercent;
        
        return {
          projectId: params.projectId,
          currentPhase: params.currentPhase,
          overallProgress: progressPercent.toFixed(1),
          scheduleVariance: scheduleVariance.toFixed(1),
          scheduleStatus: scheduleVariance > 0 ? 'ahead' : scheduleVariance < -5 ? 'behind' : 'on_track',
          costVariance: (params.totalBudget - params.budgetSpent).toFixed(2),
          costPerformanceIndex: (params.totalBudget / params.budgetSpent).toFixed(2),
          budgetStatus: params.budgetSpent < params.totalBudget ? 'under' : 'over',
          recommendations: scheduleVariance < -5 ? [
            'Review critical path activities',
            'Consider additional resources',
            'Evaluate schedule compression options',
          ] : ['Continue current pace'],
        };
      },
    },
    {
      name: 'manage_change_order',
      description: 'Manage construction change orders and impact analysis',
      parameters: z.object({
        projectId: z.string(),
        description: z.string(),
        costImpact: z.number(),
        scheduleImpact: z.number(),
        reason: z.string(),
      }),
      execute: async (params) => {
        const changeOrderId = `CO-${Date.now().toString(36).toUpperCase()}`;
        
        return {
          changeOrderId,
          projectId: params.projectId,
          description: params.description,
          costImpact: params.costImpact,
          scheduleImpact: params.scheduleImpact,
          reason: params.reason,
          status: 'pending_approval',
          impactAnalysis: {
            budgetIncrease: ((params.costImpact / 1000000) * 100).toFixed(2) + '%',
            scheduleDelay: params.scheduleImpact + ' days',
            riskLevel: params.costImpact > 50000 || params.scheduleImpact > 14 ? 'high' : 'medium',
          },
          recommendations: [
            'Review contract terms for change order provisions',
            'Obtain owner approval before proceeding',
            'Update project schedule and budget',
          ],
        };
      },
    },
  ],
};
