import { agents } from '../agents/scripts/index';
import { useQuery } from '@tanstack/react-query';

export function useClaudeAgents(agentName: string, input: string, tenantId?: string) {
  return useQuery({
    queryKey: ['claude-agent', agentName, input],
    queryFn: () => agents[agentName as keyof typeof agents](input, tenantId),
  });
}
