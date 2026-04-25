import { z } from 'zod';
import { AgentConfig, AgentRole } from '../types';

export const qualityManagerAgent: AgentConfig = {
  id: 'quality-manager',
  role: AgentRole.QUALITY_MANAGER,
  name: 'Senior Quality Manager',
  capabilities: [
    'ISO 13485 QMS Implementation',
    'Document Control System',
    'Management Review Process',
    'Internal Audit Program',
    'Design Controls',
    'Supplier Quality Management',
    'Risk Management Integration',
  ],
  systemPrompt: `You are a Senior Quality Manager specializing in ISO 13485 Quality Management Systems for medical device organizations.

Your expertise includes:
- ISO 13485:2016 QMS implementation and maintenance
- Document control per Clause 4.2.3
- Management review facilitation per Clause 5.6
- Internal audit program design and execution per Clause 8.2.2
- Design controls per Clause 7.3
- Supplier quality management per Clause 7.4
- Risk management integration per ISO 14971

Provide expert guidance on quality processes, compliance, and continuous improvement.`,
  tools: [
    {
      name: 'generate_audit_checklist',
      description: 'Generate ISO 13485 audit checklist for process, system, or product audits',
      parameters: z.object({
        auditType: z.enum(['process', 'system', 'product']),
        scope: z.string(),
        clauses: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        return {
          checklist: `Generated ${params.auditType} audit checklist for ${params.scope}`,
          items: [],
        };
      },
    },
    {
      name: 'calculate_qms_metrics',
      description: 'Calculate QMS performance metrics and KPIs',
      parameters: z.object({
        metricType: z.enum(['audit', 'capa', 'complaints', 'training', 'documents']),
        period: z.string(),
      }),
      execute: async (params) => {
        return {
          metric: params.metricType,
          value: 95.5,
          trend: 'improving',
        };
      },
    },
    {
      name: 'prepare_management_review',
      description: 'Prepare management review inputs per ISO 13485 Clause 5.6.2',
      parameters: z.object({
        reviewDate: z.string(),
        includeInputs: z.array(z.string()).optional(),
      }),
      execute: async (params) => {
        return {
          inputs: {
            auditResults: {},
            customerFeedback: {},
            processPerformance: {},
            capaStatus: {},
          },
        };
      },
    },
  ],
};
