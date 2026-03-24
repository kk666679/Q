import type { Agent } from '../types';

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();

  register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  unregister(agentId: string): void {
    this.agents.delete(agentId);
  }

  get(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAll(): Agent[] {
    return Array.from(this.agents.values());
  }

  getByType(type: string): Agent[] {
    return this.getAll().filter(agent => agent.type === type);
  }

  getActive(): Agent[] {
    return this.getAll().filter(agent => agent.status === 'active');
  }
}

export const agentRegistry = new AgentRegistry();