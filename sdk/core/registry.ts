import type { Agent } from '../types/index';
import { SDKError, SDKErrorCode } from '../errors';

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

  getOrThrow(agentId: string): Agent {
    const agent = this.agents.get(agentId);
    if (!agent) throw new SDKError(SDKErrorCode.AGENT_NOT_FOUND, `No agent with id "${agentId}"`);
    return agent;
  }

  getAll(): Agent[] {
    return Array.from(this.agents.values());
  }

  getByType(type: Agent['type']): Agent[] {
    return this.getAll().filter(a => a.type === type);
  }

  getActive(): Agent[] {
    return this.getAll().filter(a => a.status === 'active');
  }

  /** Find agents that have ALL of the requested capabilities */
  getByCapabilities(capabilities: string[]): Agent[] {
    return this.getActive().filter(a =>
      capabilities.every(cap => a.capabilities.includes(cap)),
    );
  }

  /** Find agents that have ANY of the requested tools */
  getByTools(toolNames: string[]): Agent[] {
    return this.getActive().filter(a =>
      toolNames.some(t => a.tools.includes(t)),
    );
  }

  has(agentId: string): boolean {
    return this.agents.has(agentId);
  }

  get size(): number {
    return this.agents.size;
  }
}

export const agentRegistry = new AgentRegistry();
