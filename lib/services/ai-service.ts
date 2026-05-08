/**
 * AI Service
 * 
 * Server-side AI service for generating content and analysis.
 * Uses the centralized SDK AI layer with Vercel AI Gateway and custom providers.
 */

import { generate, streamGenerate, availableModels, type ModelId, isOllamaModel, getOllamaModelId } from '@/lib/sdk/ai';
import { chatWithOllamaCloud, streamChatWithOllamaCloud, convertToOllamaMessage } from '@/lib/ollama';
import { getOllamaCloudAPIKey } from '@/lib/sdk/config';
import type { AIMessage, StructuredRAGOutput } from '@/lib/sdk/types';

export interface GenerateOptions {
  model?: ModelId;
  temperature?: number;
  maxTokens?: number;
  system?: string;
}

/**
 * AI Service
 * Provides high-level AI operations for the QMS system
 */
export const aiService = {
  /**
   * Generate text response
   */
  async generateText(prompt: string, options: GenerateOptions = {}) {
    const messages: AIMessage[] = [{ role: 'user', content: prompt }];

    const result = await generate({
      model: options.model || 'openai/gpt-4o-mini',
      messages,
      system: options.system,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    });

    return {
      text: result.text,
      usage: result.usage,
      finishReason: result.finishReason,
    };
  },

  /**
   * Stream text response
   */
  async streamText(prompt: string, options: GenerateOptions = {}) {
    const messages: AIMessage[] = [{ role: 'user', content: prompt }];
    const model = options.model || 'openai/gpt-4o-mini';

    // Route Ollama models to Ollama Cloud
    if (isOllamaModel(model)) {
      return this.streamTextWithOllama(messages, model, options);
    }

    return streamGenerate({
      model,
      messages,
      system: options.system,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    });
  },

  /**
   * Generate QMS document content
   */
  async generateDocument(
    documentType: string,
    context: string,
    options: GenerateOptions = {}
  ) {
    const systemPrompt = `You are an expert QMS consultant. Generate professional ${documentType} content following ISO standards. The document should be well-structured, comprehensive, and ready for use in a quality management system.`;

    return this.generateText(context, {
      ...options,
      system: systemPrompt,
    });
  },

  /**
   * Analyze document for compliance
   */
  async analyzeCompliance(
    content: string,
    standard: string,
    options: GenerateOptions = {}
  ) {
    const systemPrompt = `You are an ISO compliance expert. Analyze the provided content against ${standard} requirements. Identify compliance status, gaps, and provide recommendations. Return your analysis in a structured format.`;

    return this.generateText(content, {
      ...options,
      system: systemPrompt,
    });
  },

  /**
   * Perform root cause analysis using 5 Whys method
   */
  async performFiveWhys(problem: string, options: GenerateOptions = {}) {
    const systemPrompt = `You are a quality management expert specializing in root cause analysis. Perform a 5 Whys analysis on the given problem. For each "Why" level, provide a clear question and potential answer that drills deeper into the root cause.`;

    return this.generateText(problem, {
      ...options,
      system: systemPrompt,
    });
  },

  /**
   * Generate risk assessment
   */
  async generateRiskAssessment(context: string, options: GenerateOptions = {}) {
    const systemPrompt = `You are a risk management expert. Analyze the given context and identify potential risks. For each risk, assess severity, likelihood, and provide mitigation strategies. Use a structured risk matrix approach.`;

    return this.generateText(context, {
      ...options,
      system: systemPrompt,
    });
  },

  // ============================================
  // OLLAMA CLOUD METHODS
  // ============================================

  /**
   * Check if Ollama Cloud is configured and available
   */
  isOllamaCloudAvailable(): boolean {
    return !!getOllamaCloudAPIKey();
  },

  /**
   * Stream text using Ollama Cloud models
   */
  async streamTextWithOllama(
    messages: AIMessage[],
    modelId: string,
    options: GenerateOptions = {}
  ) {
    const apiKey = getOllamaCloudAPIKey();
    if (!apiKey) {
      throw new Error('Ollama Cloud API key not configured. Set OLLAMA_API_KEY environment variable.');
    }

    const ollamaModelId = getOllamaModelId(modelId);
    const ollamaMessages = messages.map(convertToOllamaMessage);

    return streamChatWithOllamaCloud({
      apiKey,
      model: ollamaModelId,
      messages: ollamaMessages,
      temperature: options.temperature,
    });
  },

  /**
   * Generate text using Ollama Cloud models
   */
  async generateTextWithOllama(
    prompt: string,
    modelId: string,
    options: GenerateOptions = {}
  ) {
    const apiKey = getOllamaCloudAPIKey();
    if (!apiKey) {
      throw new Error('Ollama Cloud API key not configured. Set OLLAMA_API_KEY environment variable.');
    }

    const ollamaModelId = getOllamaModelId(modelId);
    const messages = [convertToOllamaMessage({ role: 'user', content: prompt, id: '', timestamp: new Date() })];

    const response = await chatWithOllamaCloud({
      apiKey,
      model: ollamaModelId,
      messages,
      temperature: options.temperature,
    });

    return {
      text: response.message.content,
      usage: {
        promptTokens: response.prompt_eval_count || 0,
        completionTokens: response.eval_count || 0,
      },
      finishReason: response.done ? 'stop' : 'length',
    };
  },

  /**
   * Generate text response - routes to Ollama if model is Ollama
   */
  async generateTextRouted(prompt: string, options: GenerateOptions = {}) {
    const model = options.model || 'openai/gpt-4o-mini';
    const system = options.system;

    // Route Ollama models to Ollama Cloud
    if (isOllamaModel(model)) {
      const result = await this.generateTextWithOllama(prompt, model, options);
      return result;
    }

    return this.generateText(prompt, {
      ...options,
      model,
      system,
    });
  },

  /**
   * Get available models
   */
  getAvailableModels() {
    return availableModels;
  },
};

export default aiService;
