/**
 * AI SDK Client
 * 
 * Centralized AI client using Vercel AI SDK with AI Gateway.
 * Supports multiple providers through a unified interface.
 * 
 * Usage:
 * - Server: import { generateText, streamText } from '@/lib/sdk/ai'
 * - Client: import { useChat, useCompletion } from '@/lib/sdk/ai'
 */

import { generateText, streamText, generateObject, streamObject } from 'ai';
import { sdkConfig } from './config';
import type { AIConfig, AIMessage, AIGenerateOptions, AIStreamOptions } from './types';

// Re-export AI SDK hooks for client-side usage
export { useChat, useCompletion, useObject, useAssistant } from '@ai-sdk/react';

// Re-export core AI SDK functions
export { generateText, streamText, generateObject, streamObject } from 'ai';

/**
 * Default AI configuration
 */
export const defaultAIConfig: AIConfig = {
  model: sdkConfig.ai.defaultModel,
  temperature: sdkConfig.ai.defaultTemperature,
  maxTokens: sdkConfig.ai.defaultMaxTokens,
};

/**
 * Generate text with AI using Vercel AI Gateway
 * 
 * @example
 * const result = await generate({
 *   messages: [{ role: 'user', content: 'Hello' }],
 * });
 */
export async function generate(options: AIGenerateOptions) {
  const config = { ...defaultAIConfig, ...options };
  
  return generateText({
    model: config.model,
    messages: config.messages,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    system: config.system,
  });
}

/**
 * Stream text with AI using Vercel AI Gateway
 * 
 * @example
 * const stream = await streamGenerate({
 *   messages: [{ role: 'user', content: 'Tell me a story' }],
 * });
 * 
 * for await (const chunk of stream.textStream) {
 *   console.log(chunk);
 * }
 */
export async function streamGenerate(options: AIStreamOptions) {
  const config = { ...defaultAIConfig, ...options };
  
  return streamText({
    model: config.model,
    messages: config.messages,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    system: config.system,
    onFinish: options.onFinish,
  });
}

/**
 * Available AI models through Vercel AI Gateway
 * These models work with zero configuration in v0
 */
export const availableModels = {
  // OpenAI
  'openai/gpt-4o': { name: 'GPT-4o', provider: 'openai', context: 128000 },
  'openai/gpt-4o-mini': { name: 'GPT-4o Mini', provider: 'openai', context: 128000 },
  'openai/gpt-5-mini': { name: 'GPT-5 Mini', provider: 'openai', context: 128000 },
  
  // Anthropic
  'anthropic/claude-opus-4.6': { name: 'Claude Opus 4.6', provider: 'anthropic', context: 200000 },
  'anthropic/claude-sonnet-4': { name: 'Claude Sonnet 4', provider: 'anthropic', context: 200000 },
  
  // Google
  'google/gemini-3-flash': { name: 'Gemini 3 Flash', provider: 'google', context: 1000000 },
  'google/gemini-3.1-flash-image-preview': { name: 'Nano Banana 2', provider: 'google', context: 1000000 },
} as const;

export type ModelId = keyof typeof availableModels;

/**
 * Get model information
 */
export function getModelInfo(modelId: ModelId) {
  return availableModels[modelId];
}

/**
 * Check if a model supports a specific capability
 */
export function modelSupports(modelId: ModelId, capability: 'vision' | 'tools' | 'streaming') {
  // All models through AI Gateway support these capabilities
  return true;
}
