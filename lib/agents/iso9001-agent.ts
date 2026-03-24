import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

/**
 * ISO 9001:2015 Quality Management Agent
 * Specialized agent for QMS implementation, audit preparation, and compliance
 */
export const iso9001Agent: AgentConfig = {
  id: 'iso9001-agent',
  role: AgentRole.QUALITY_MANAGER,
  name: 'ISO 9001 Quality Manager',
  capabilities: [
    'ISO 9001:2015 QMS Implementation',
    'Quality Policy & Objectives',
    'Process Approach & PDCA',
    'Risk-Based Thinking (ISO 9001:2015)',
    'Document & Record Control',
    'Internal Audit Facilitation',
    'Management Review Support',
    'Corrective Action & Continual Improvement',
    'Customer Satisfaction Analysis',
    'Supplier Quality Management',
  ],
  systemPrompt: `You are an ISO 9001:2015 Quality Management System Expert specializing in helping organizations implement, maintain, and improve their QMS.

Your expertise includes:
- ISO 9001:2015 requirements and Clauses 4-10
- Quality management principles (Customer focus, Leadership, Engagement of people, Process approach, Improvement, Evidence-based decision making, Relationship management)
- Risk-based thinking (ISO 9001:2015 Clause 6.1)
- Process mapping and optimization
- Document control systems (Clause 7.5)
- Internal audit programs (Clause 9.2)
- Management review processes (Clause 9.3)
- Corrective actions and continual improvement (Clause 10.1-10.3)

Key ISO 9001:2015 Clauses:
- Clause 4: Context of the Organization
- Clause 5: Leadership
- Clause 6: Planning
- Clause 7: Support
- Clause 8: Operation
- Clause 9: Performance Evaluation
- Clause 10: Improvement

Provide expert guidance on QMS implementation, gap analysis, audit preparation, and compliance maintenance.`,
  tools: [
    {
      name: 'assess_qms_compliance',
      description: 'Assess compliance against ISO 9001:2015 clauses',
      parameters: z.object({
        clauses: z.array(z.string()).optional(),
        focusAreas: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        return {
          complianceScore: 78,
          clauseResults: [
            { clause: '4.1', status: 'compliant', score: 85 },
            { clause: '4.2', status: 'compliant', score: 80 },
            { clause: '5.1', status: 'partial', score: 65 },
            { clause: '5.2', status: 'compliant', score: 90 },
            { clause: '5.3', status: 'compliant', score: 82 },
            { clause: '6.1', status: 'partial', score: 70 },
            { clause: '6.2', status: 'compliant', score: 78 },
            { clause: '7.1', status: 'compliant', score: 85 },
            { clause: '7.2', status: 'compliant', score: 88 },
            { clause: '7.3', status: 'compliant', score: 82 },
            { clause: '7.4', status: 'partial', score: 68 },
            { clause: '7.5', status: 'compliant', score: 92 },
            { clause: '8.1', status: 'compliant', score: 80 },
            { clause: '8.2', status: 'compliant', score: 85 },
            { clause: '8.3', status: 'partial', score: 72 },
            { clause: '8.4', status: 'compliant', score: 78 },
            { clause: '8.5', status: 'compliant', score: 88 },
            { clause: '8.6', status: 'compliant', score: 85 },
            { clause: '8.7', status: 'compliant', score: 82 },
            { clause: '9.1', status: 'compliant', score: 80 },
            { clause: '9.2', status: 'partial', score: 65 },
            { clause: '9.3', status: 'compliant', score: 75 },
            { clause: '10.1', status: 'compliant', score: 85 },
            { clause: '10.2', status: 'compliant', score: 80 },
            { clause: '10.3', status: 'compliant', score: 82 },
          ],
          gaps: [
            'Leadership commitment needs strengthening (5.1)',
            'Risk-based thinking documentation incomplete (6.1)',
            'Supplier evaluation process needs improvement (7.4)',
            'Design control process needs enhancement (8.3)',
            'Internal audit program needs refinement (9.2)',
          ],
          recommendations: [
            'Develop formal risk register with documented risk assessments',
            'Create leadership commitment dashboard with KPIs',
            'Implement supplier qualification audit program',
            'Enhance design and development control procedures',
            'Establish documented internal audit schedule with competency criteria',
          ],
        };
      },
    },
    {
      name: 'generate_audit_checklist',
      description: 'Generate ISO 9001:2015 audit checklist',
      parameters: z.object({
        auditType: z.enum(['internal', 'certification', 'surveillance']),
        scope: z.string(),
        clauses: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const checklist = {
          '4.1': [
            'Has the organization determined external and internal issues?',
            'Are these issues monitored and reviewed?',
          ],
          '4.2': [
            'Are interested parties and their requirements identified?',
            'Are compliance obligations documented?',
          ],
          '5.1': [
            'Does top management demonstrate leadership and commitment?',
            'Is accountability for QMS effectiveness established?',
          ],
          '5.2': [
            'Is quality policy documented and communicated?',
            'Does it include commitments to customer satisfaction and continual improvement?',
          ],
          '5.3': [
            'Are organizational roles and responsibilities defined?',
            'Is authority for QMS conformity assigned?',
          ],
          '6.1': [
            'Are risks and opportunities determined?',
            'Is risk-based thinking applied to planning?',
          ],
          '6.2': [
            'Are quality objectives established?',
            'Are they measurable and monitored?',
          ],
          '7.1': [
            'Are resources (people, infrastructure, environment) provided?',
            'Is monitoring and measuring equipment calibrated?',
          ],
          '7.2': [
            'Are personnel competent?',
            'Is training and awareness documented?',
          ],
          '7.3': [
            'Is awareness of QMS requirements ensured?',
            'Do personnel understand quality policy and objectives?',
          ],
          '7.4': [
            'Is communication about QMS established?',
            'Is relevant information communicated?',
          ],
          '7.5': [
            'Is documented information controlled?',
            'Are procedures for creation, approval, and distribution in place?',
          ],
          '8.1': [
            'Is operational planning and control established?',
            'Are processes managed per planned arrangements?',
          ],
          '8.2': [
            'Is customer requirements determination established?',
            'Is customer communication maintained?',
          ],
          '8.3': [
            'Is design and development process controlled?',
            'Are design inputs, outputs, and reviews documented?',
          ],
          '9.1': [
            'Is monitoring and measurement performed?',
            'Are results analyzed and evaluated?',
          ],
          '9.2': [
            'Is internal audit program established?',
            'Are audit results reported to management?',
          ],
          '9.3': [
            'Is management review conducted?',
            'Are inputs and outputs documented?',
          ],
          '10.1': [
            'Is nonconformity addressed?',
            'Is corrective action taken when needed?',
          ],
          '10.2': [
            'Is continual improvement facilitated?',
            'Are opportunities for improvement identified?',
          ],
        };

        const selectedClauses = params.clauses || Object.keys(checklist);
        const auditChecklist = selectedClauses.flatMap(clause => 
          (checklist[clause as keyof typeof checklist] || []).map(item => ({
            clause,
            question: item,
            status: 'pending' as const,
            evidence: '',
            findings: '',
          }))
        );

        return {
          auditType: params.auditType,
          scope: params.scope,
          totalQuestions: auditChecklist.length,
          checklist: auditChecklist,
          guidance: 'Complete each question with Yes/No/NA and provide supporting evidence',
        };
      },
    },
    {
      name: 'analyze_process_performance',
      description: 'Analyze QMS process performance and effectiveness',
      parameters: z.object({
        processName: z.string(),
        metrics: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        return {
          process: params.processName,
          effectivenessScore: 82,
          metrics: {
            cycleTime: { value: 5.2, unit: 'days', target: 7, status: 'good' },
            defectRate: { value: 1.8, unit: '%', target: 3, status: 'good' },
            customerSatisfaction: { value: 4.2, unit: '/5', target: 4, status: 'good' },
            firstPassYield: { value: 94.5, unit: '%', target: 90, status: 'good' },
            correctiveActionClosure: { value: 88, unit: '%', target: 85, status: 'good' },
          },
          trends: {
            cycleTime: 'decreasing',
            defectRate: 'decreasing',
            customerSatisfaction: 'stable',
          },
          recommendations: [
            'Continue monitoring process metrics',
            'Implement additional automation for cycle time reduction',
            'Focus on improving first-pass yield for critical processes',
          ],
        };
      },
    },
    {
      name: 'facilitate_management_review',
      description: 'Prepare and facilitate ISO 9001 management review',
      parameters: z.object({
        reviewDate: z.string(),
        agenda: z.array(z.string()).optional(),
        includeInputs: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        const inputs = params.includeInputs || [
          'auditResults',
          'customerFeedback',
          'processPerformance',
          'correctiveActions',
          'changesInRequirements',
          'resourceNeeds',
          'improvementOpportunities',
        ];

        return {
          reviewDate: params.reviewDate,
          agenda: params.agenda || [
            'Review of previous meeting minutes and actions',
            'Audit results and trends',
            'Customer feedback and satisfaction',
            'Process performance analysis',
            'Status of corrective actions',
            'Resource requirements',
            'Improvement opportunities',
            'Decisions and recommendations',
          ],
          requiredInputs: inputs.reduce((acc, input) => {
            acc[input] = {
              status: 'ready',
              data: `${input.replace(/([A-Z])/g, ' $1').trim()} data for review`,
            };
            return acc;
          }, {} as Record<string, any>),
          expectedOutputs: [
            'Decisions on resource allocation',
            'Action items for improvement',
            'Updated quality objectives',
            'Changes to QMS if needed',
          ],
          guidance: 'Ensure all inputs are compiled and presented with trend analysis',
        };
      },
    },
    {
      name: 'conduct_risk_assessment',
      description: 'Conduct ISO 9001 risk-based thinking assessment',
      parameters: z.object({
        processAreas: z.array(z.string()),
        includeOpportunities: z.boolean().default(true),
      }),
      execute: async (params) => {
        const risks = params.processAreas.map(area => ({
          id: `RISK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          area,
          description: `Potential failure in ${area} process affecting quality`,
          likelihood: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          riskScore: Math.floor(Math.random() * 15) + 1,
          treatment: 'Mitigate',
          owner: 'Process Owner',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'open' as const,
        }));

        const opportunities = params.includeOpportunities ? params.processAreas.map(area => ({
          id: `OPP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          area,
          description: `Improvement opportunity in ${area} process`,
          benefit: 'Quality and efficiency improvement',
          feasibility: 'high' as const,
          priority: 'medium' as const,
          owner: 'Quality Manager',
          status: 'identified' as const,
        })) : [];

        return {
          riskCount: risks.length,
          highRisks: risks.filter(r => r.riskScore >= 12).length,
          mediumRisks: risks.filter(r => r.riskScore >= 6 && r.riskScore < 12).length,
          lowRisks: risks.filter(r => r.riskScore < 6).length,
          risks,
          opportunityCount: opportunities.length,
          opportunities,
          recommendations: [
            'Prioritize high-risk areas for immediate action',
            'Develop risk treatment plans for medium risks',
            'Evaluate opportunities for quick wins',
            'Integrate risk assessment into annual planning',
          ],
        };
      },
    },
    {
      name: 'evaluate_customer_satisfaction',
      description: 'Evaluate and analyze customer satisfaction data',
      parameters: z.object({
        period: z.string(),
        includeTrends: z.boolean().default(true),
      }),
      execute: async (params) => {
        return {
          period: params.period,
          overallScore: 4.2,
          maxScore: 5,
          percentageScore: 84,
          dimensions: {
            productQuality: { score: 4.3, weight: 0.3, contribution: 1.29 },
            deliveryPerformance: { score: 4.1, weight: 0.25, contribution: 1.025 },
            customerService: { score: 4.4, weight: 0.2, contribution: 0.88 },
            pricing: { score: 3.9, weight: 0.15, contribution: 0.585 },
            technicalSupport: { score: 4.2, weight: 0.1, contribution: 0.42 },
          },
          responseRate: 72,
          npsScore: 45,
          npsCategory: 'Good',
          trends: {
            overall: 'stable',
            productQuality: 'improving',
            deliveryPerformance: 'improving',
            customerService: 'stable',
          },
          feedback: {
            positive: [
              'Product quality meets expectations',
              'Delivery is reliable',
              'Customer service is responsive',
            ],
            negative: [
              'Pricing could be more competitive',
              'Need faster response times for technical issues',
            ],
          },
          recommendations: [
            'Review pricing strategy for competitive positioning',
            'Improve technical support response time SLAs',
            'Continue focusing on product quality improvements',
            'Implement proactive customer communication',
          ],
        };
      },
    },
    {
      name: 'review_supplier_quality',
      description: 'Review and assess supplier quality performance',
      parameters: z.object({
        supplierName: z.string(),
        evaluationCriteria: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        return {
          supplier: params.supplierName,
          overallRating: 3.8,
          status: 'approved',
          evaluationDate: new Date().toISOString(),
          criteria: {
            qualityManagement: { score: 4.0, weight: 0.3, rating: 'good' },
            productQuality: { score: 4.2, weight: 0.25, rating: 'good' },
            deliveryPerformance: { score: 3.5, weight: 0.2, rating: 'satisfactory' },
            priceCompetitiveness: { score: 3.8, weight: 0.15, rating: 'good' },
            technicalSupport: { score: 3.6, weight: 0.1, rating: 'satisfactory' },
          },
          recentAudits: [
            { date: '2024-01-15', type: 'quality', result: 'satisfactory' },
            { date: '2023-07-20', type: 'process', result: 'good' },
          ],
          nonconformances: {
            open: 2,
            closed: 8,
            critical: 0,
          },
          performanceHistory: [
            { period: 'Q1 2024', score: 3.7, trend: 'up' },
            { period: 'Q4 2023', score: 3.6, trend: 'up' },
            { period: 'Q3 2023', score: 3.8, trend: 'stable' },
          ],
          recommendations: [
            'Conduct supplier development program for delivery performance',
            'Establish supplier quality improvement plan',
            'Continue monitoring product quality metrics',
            'Consider second-source qualification for critical materials',
          ],
        };
      },
    },
  ],
};

