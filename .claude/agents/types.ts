import { z } from 'zod';

export const AgentRole = {
  QUALITY_MANAGER: 'quality-manager',
  DOCUMENTATION_MANAGER: 'documentation-manager',
  QA_EXPERT: 'qa-expert',
  MANUFACTURING_EXPERT: 'manufacturing-expert',
  CONSTRUCTION_EXPERT: 'construction-expert',
  INSURANCE_EXPERT: 'insurance-expert',
} as const;

export type AgentRoleType = typeof AgentRole[keyof typeof AgentRole];

export interface AgentConfig {
  id: string;
  role: AgentRoleType;
  name: string;
  capabilities: string[];
  systemPrompt: string;
  tools: Array<{
    name: string;
    description: string;
    parameters: unknown;
    execute: unknown;
  }>;
}

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string(),
  capabilities: z.array(z.string()),
  tools: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'busy']),
  metadata: z.record(z.any()).optional(),
});

export type Agent = z.infer<typeof AgentSchema>;
