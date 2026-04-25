/**
 * AI Service
 * 
 * Server-side AI service for generating content and analysis.
 * Uses the centralized SDK AI layer with Vercel AI Gateway.
 */

import { generate, streamGenerate, availableModels, type ModelId } from '@/lib/sdk/ai';
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

    return streamGenerate({
      model: options.model || 'openai/gpt-4o-mini',
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

  /**
   * Get available models
   */
  getAvailableModels() {
    return availableModels;
  },
};

export default aiService;
