/**
 * AI Router
 * 
 * tRPC router for AI operations including chat, models, and completions.
 * Routes requests to the appropriate AI service based on model selection.
 */

import { z } from 'zod';
import { router, publicProcedure } from './trpc';
import { aiService } from '@/lib/services/ai-service';
import { availableModels } from '@/lib/sdk/ai';
import { getOllamaCloudAPIKey } from '@/lib/sdk/config';

// ============================================
// INPUT SCHEMAS
// ============================================

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const chatInputSchema = z.object({
  messages: z.array(messageSchema),
  model: z.string().default('openai/gpt-4o-mini'),
  temperature: z.number().optional().default(0.7),
  maxTokens: z.number().optional().default(2048),
  system: z.string().optional(),
});

const generateInputSchema = z.object({
  prompt: z.string(),
  model: z.string().default('openai/gpt-4o-mini'),
  temperature: z.number().optional().default(0.7),
  maxTokens: z.number().optional().default(2048),
});

// ============================================
// AI ROUTER
// ============================================

export const aiRouter = router({
  /**
   * Get available AI models
   */
  getModels: publicProcedure.query(async () => {
    const models = Object.entries(availableModels).map(([key, model]) => ({
      id: key,
      name: model.name,
      provider: model.provider,
      context: model.context,
    }));

    // Add availability info for Ollama Cloud
    const ollamaApiKey = getOllamaCloudAPIKey();
    const modelsWithAvailability = models.map(model => ({
      ...model,
      available: model.provider === 'ollama' ? !!ollamaApiKey : true,
    }));

    return modelsWithAvailability;
  }),

  /**
   * Check if specific model is available
   */
  isModelAvailable: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(({ input }) => {
      const isOllama = input.model.startsWith('ollama/');
      if (isOllama) {
        return !!getOllamaCloudAPIKey();
      }
      return true;
    }),

  /**
   * Get model details
   */
  getModel: publicProcedure
    .input(z.object({ model: z.string() }))
    .query(({ input }) => {
      const model = availableModels[input.model as keyof typeof availableModels];
      if (!model) {
        return null;
      }

      return {
        id: input.model,
        name: model.name,
        provider: model.provider,
        context: model.context,
        available: input.model.startsWith('ollama/') ? !!getOllamaCloudAPIKey() : true,
      };
    }),

  /**
   * Generate text completion
   */
  generate: publicProcedure
    .input(generateInputSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await aiService.generateTextRouted(input.prompt, {
          model: input.model as any,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        });

        return {
          success: true,
          text: result.text,
          usage: result.usage,
          finishReason: result.finishReason,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: message,
          text: '',
        };
      }
    }),

  /**
   * Chat completion (non-streaming)
   * Note: For streaming responses, use the /api/ai/chat-stream endpoint
   */
  chat: publicProcedure
    .input(chatInputSchema)
    .mutation(async ({ input }) => {
      try {
        const messages = input.messages.map((msg) => ({
          ...msg,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        }));

        const lastMessage = messages[messages.length - 1];
        const result = await aiService.generateTextRouted(lastMessage.content, {
          model: input.model as any,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
          system: input.system,
        });

        return {
          success: true,
          message: {
            role: 'assistant' as const,
            content: result.text,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date(),
          },
          usage: result.usage,
          finishReason: result.finishReason,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: message,
          message: null,
        };
      }
    }),

  /**
   * Check if Ollama Cloud is configured
   */
  isOllamaCloudAvailable: publicProcedure.query(() => {
    return !!getOllamaCloudAPIKey();
  }),

  /**
   * Generate QMS document content
   */
  generateDocument: publicProcedure
    .input(
      z.object({
        documentType: z.string(),
        context: z.string(),
        model: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await aiService.generateDocument(input.documentType, input.context, {
          model: input.model as any,
        });

        return {
          success: true,
          text: result.text,
          usage: result.usage,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: message,
          text: '',
        };
      }
    }),

  /**
   * Analyze compliance
   */
  analyzeCompliance: publicProcedure
    .input(
      z.object({
        content: z.string(),
        standard: z.string(),
        model: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await aiService.analyzeCompliance(input.content, input.standard, {
          model: input.model as any,
        });

        return {
          success: true,
          text: result.text,
          usage: result.usage,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: message,
          text: '',
        };
      }
    }),

  /**
   * Perform 5 Whys analysis
   */
  fiveWhys: publicProcedure
    .input(
      z.object({
        problem: z.string(),
        model: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await aiService.performFiveWhys(input.problem, {
          model: input.model as any,
        });

        return {
          success: true,
          text: result.text,
          usage: result.usage,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: message,
          text: '',
        };
      }
    }),

  /**
   * Generate risk assessment
   */
  assessRisk: publicProcedure
    .input(
      z.object({
        context: z.string(),
        model: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await aiService.generateRiskAssessment(input.context, {
          model: input.model as any,
        });

        return {
          success: true,
          text: result.text,
          usage: result.usage,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: message,
          text: '',
        };
      }
    }),
});
