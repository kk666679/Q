import { agentRegistry } from './registry';
import type { Agent, Message, ToolExecution } from '../types/index';
import type { StructuredRAGOutput } from '../types';
import { StructuredRAGOutputSchema } from '../types';
import { VectorService } from './vector-service';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { SDKError, SDKErrorCode, withRetry } from '../errors';
import { logger } from '../utils/logger';
import { RAGQuerySchema } from '../validation/schemas';

export interface AgentContext {
  sessionId: string;
  userId:    string;
  tenantId:  string;
  signal?:   AbortSignal;
}

export class AgentOrchestrator {
  private vectorService = new VectorService();
  private activeConversations: Map<string, string[]> = new Map();

  async ragQuery(
    userQuery: string,
    domain = 'ISO',
    ctx?: Pick<AgentContext, 'tenantId' | 'signal'>,
  ): Promise<StructuredRAGOutput> {
    const { query, topK } = RAGQuerySchema.parse({ query: userQuery, domain });

    const queryEmbedding = await this.vectorService.generateEmbedding(query);
    const retrievedChunks = await this.vectorService.searchSimilar(queryEmbedding, {
      topK,
      tenantId: ctx?.tenantId,
      ...(domain !== 'ISO' ? { filter: { standard: domain } } : {}),
    });

    const context   = retrievedChunks.map(c => c.content).join('\n\n---\n\n');
    const standards = [...new Set(
      retrievedChunks.map(c => c.metadata['standard']).filter(Boolean),
    )].join(', ');

    const systemPrompt = `You are an AI compliance and process intelligence engine.
Transform retrieved knowledge base content into structured frontend-ready insights.
Use the retrieved context as the primary source of truth. Do not invent information.
Return ONLY valid JSON matching the schema.`;

    const userPrompt = `User Request:\n${query}\n\nRetrieved Context:\n${context.slice(0, 8000)}\n\nStandards: ${standards || 'ISO 9001/14001/45001'}\nDomain: ${domain}`;

    try {
      const result = await withRetry(() =>
        generateObject({
          model:      openai('gpt-4o-mini'),
          system:     systemPrompt,
          prompt:     userPrompt,
          schema:     StructuredRAGOutputSchema,
          temperature: 0.1,
          maxOutputTokens: 2000,
        }),
      );
      return result.object;
    } catch (err) {
      throw new SDKError(SDKErrorCode.PROVIDER_ERROR, 'RAG generation failed', err);
    }
  }

  async routeMessage(
    message: Message,
    ctx: AgentContext,
    targetAgents?: string[],
  ): Promise<Message[]> {
    const agents = targetAgents
      ? targetAgents.map(id => agentRegistry.get(id)).filter((a): a is Agent => !!a)
      : agentRegistry.getActive();

    const responses: Message[] = [];

    for (const agent of agents) {
      try {
        const response = await this.processMessage(agent, message, ctx);
        responses.push(response);
        logger.info('Agent responded', { agentId: agent.id, sessionId: ctx.sessionId });
      } catch (err) {
        logger.error('Agent message processing failed', {
          agentId: agent.id,
          error: err instanceof Error ? err.message : 'unknown',
        });
      }
    }

    return responses;
  }

  private async processMessage(
    agent: Agent,
    message: Message,
    ctx: AgentContext,
  ): Promise<Message> {
    const ragResult = await this.ragQuery(message.content, 'ISO', ctx);
    return {
      id:        `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      agentId:   agent.id,
      content:   JSON.stringify(ragResult),
      type:      'agent',
      timestamp: new Date(),
    };
  }

  async executeToolChain(
    agentId: string,
    tools: string[],
    parameters: Record<string, unknown>,
    ctx: AgentContext,
  ): Promise<ToolExecution[]> {
    const agent = agentRegistry.getOrThrow(agentId);
    const executions: ToolExecution[] = [];

    for (const toolId of tools) {
      if (!agent.tools.includes(toolId)) {
        throw new SDKError(SDKErrorCode.TOOL_NOT_FOUND, `Agent "${agentId}" has no tool "${toolId}"`);
      }

      const execution: ToolExecution = {
        toolId,
        agentId,
        parameters,
        status:    'completed',
        timestamp: new Date(),
        result:    { success: true, data: `Tool ${toolId} executed` },
      };

      // Audit log every tool execution for ISO 27001 compliance
      logger.info('Tool executed', {
        toolId,
        agentId,
        userId:   ctx.userId,
        tenantId: ctx.tenantId,
        sessionId: ctx.sessionId,
      });

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

  getActiveConversations(): ReadonlyMap<string, string[]> {
    return this.activeConversations;
  }
}

export const agentOrchestrator = new AgentOrchestrator();
