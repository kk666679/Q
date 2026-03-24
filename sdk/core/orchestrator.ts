import { agentRegistry } from './registry';
import type { Agent, Message, ToolExecution, StructuredRAGOutput } from '../types';
import { VectorService } from './vector-service';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { StructuredRAGOutputSchema } from '../types';

export class AgentOrchestrator {
  private vectorService = new VectorService();
  private activeConversations: Map<string, string[]> = new Map();

  async ragQuery(userQuery: string, domain: string = 'ISO'): Promise<StructuredRAGOutput> {
    // 1. Embed query
    const queryEmbedding = await this.vectorService.generateEmbedding(userQuery);

    // 2. Vector search
    const retrievedChunks = await this.vectorService.searchSimilar(
      queryEmbedding, 
      10, 
      domain === 'ISO' ? undefined : { standard: domain }
    );

    // 3. Build context
    const context = retrievedChunks.map(c => c.content).join('\n\n---\n\n');
    const standards = retrievedChunks.map(c => c.metadata?.standard).filter(Boolean).join(', ');
    
    // 4. Production RAG prompt
    const systemPrompt = `You are an AI compliance and process intelligence engine.

Your job is to transform retrieved knowledge base content into structured frontend-ready insights.

Use the retrieved context as the primary source of truth. 
Do not invent information not present in the context.

The output must be structured for UI rendering and support the following frontend components:

- aiinsight-card
- aicompliance-card
- aimetric-card
- aitable
- aichart-container
- recommendation-panel
- risk-assessment-card
- process-timeline

Always produce structured JSON matching the exact schema.`;

    const userPrompt = `User Request:
${userQuery}

Retrieved Knowledge Context (top matches):
${context.substring(0, 8000)}

Relevant Standards:
${standards || 'ISO 9001/14001/45001'}

Application Domain:
${domain}

Instructions:
1. Analyze the retrieved content
2. Extract key compliance requirements
3. Identify risks, gaps, or improvement opportunities
4. Convert insights into structured UI components
5. Ensure the output matches the JSON schema exactly

Return ONLY valid JSON matching the schema.`;

    // 5. Generate structured output
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: StructuredRAGOutputSchema,
      temperature: 0.1,
      maxTokens: 2000,
    });

    return result.object;
  }

  async routeMessage(message: Message, targetAgents?: string[]): Promise<Message[]> {
    const agents = targetAgents 
      ? targetAgents.map(id => agentRegistry.get(id)).filter(Boolean) as Agent[]
      : agentRegistry.getActive();

    const responses: Message[] = [];

    for (const agent of agents) {
      try {
        const response = await this.processMessage(agent, message);
        responses.push(response);
      } catch (error) {
        console.error(`Error processing message for agent ${agent.id}:`, error);
      }
    }

    return responses;
  }

  private async processMessage(agent: Agent, message: Message): Promise<Message> {
    // Use RAG for agent responses
    const ragResult = await this.ragQuery(message.content, 'ISO');
    const responseContent = JSON.stringify(ragResult, null, 2);

    const response: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      agentId: agent.id,
      content: responseContent,
      type: 'agent',
      timestamp: new Date(),
    };

    return response;
  }

  async executeToolChain(agentId: string, tools: string[], parameters: Record<string, any>): Promise<ToolExecution[]> {
    const agent = agentRegistry.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);

    const executions: ToolExecution[] = [];

    for (const toolId of tools) {
      const execution: ToolExecution = {
        id: `exec-${Date.now()}-${Math.random()}`,
        toolId,
        agentId,
        parameters,
        status: 'completed',
        timestamp: new Date(),
        result: { success: true, data: `Tool ${toolId} executed successfully` },
      };

      executions.push(execution);
    }

    return executions;
  }

  startConversation(conversationId: string, agentIds: string[]): void {
    this.activeConversations.set(conversationId, agentIds);
  }

  endConversation(conversationId: string): void {
    this.activeConversations.delete(conversationId);
  }

  getActiveConversations(): Map<string, string[]> {
    return new Map(this.activeConversations);
  }
}

export const agentOrchestrator = new AgentOrchestrator();

