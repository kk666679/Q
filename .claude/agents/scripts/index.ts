export * from './quality-manager';
export * from './documentation-manager';
export * from './qa-expert';
export * from './manufacturing-expert';
export * from './construction-expert';
export * from './insurance-expert';
export * from './malaysian-standards-agent';
export * from './iso9001-agent';
export * from './iso14001-agent';
export * from './iso45001-agent';
export * from './ims-integrator-agent';

import type { AgentResponse } from '../types';

// Runtime registry used by `claude/hooks/useClaudeAgents.ts`.
// Must export an `agents` object with callable members keyed by `agentName`.
export const agents = {
  'iso9001-agent': async (input: string, tenantId?: string): Promise<AgentResponse> => {
    return {
      success: true,
      data: {
        agent: 'iso9001-agent',
        input,
        tenantId,
      },
      message: 'iso9001-agent invoked',
    };
  },

  'quality-manager': async (input: string, tenantId?: string): Promise<AgentResponse> => {
    return {
      success: true,
      data: {
