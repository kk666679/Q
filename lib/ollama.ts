/**
 * Ollama Cloud Integration
 * 
 * Provides client functions for Ollama Cloud API interactions.
 * Ollama Cloud allows running models without a local GPU.
 * 
 * @see https://docs.ollama.com/cloud
 */

import type { AIMessage } from '@/lib/sdk/types';

// ============================================
// TYPES
// ============================================

export interface OllamaCloudConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaChatOptions {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  top_k?: number;
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface OllamaModelsResponse {
  models: OllamaModelInfo[];
}

// ============================================
// CLIENT CONFIG
// ============================================

let ollamaCloudConfig: OllamaCloudConfig | null = null;

/**
 * Initialize Ollama Cloud configuration
 */
export function initializeOllamaCloud(config: OllamaCloudConfig) {
  ollamaCloudConfig = {
    baseURL: 'https://ollama.com/api',
    timeout: 30000,
    ...config,
  };
}

/**
 * Get current Ollama Cloud configuration
 */
export function getOllamaCloudConfig(): OllamaCloudConfig | null {
  return ollamaCloudConfig;
}

/**
 * Check if Ollama Cloud is configured
 */
export function isOllamaCloudConfigured(): boolean {
  const apiKey = process.env.OLLAMA_API_KEY;
  return !!apiKey;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Chat with Ollama Cloud model
 * 
 * @example
 * const response = await chatWithOllamaCloud({
 *   apiKey: process.env.OLLAMA_API_KEY!,
 *   model: 'gpt-oss:120b',
 *   messages: [{ role: 'user', content: 'Hello' }],
 * });
 */
export async function chatWithOllamaCloud(
  options: OllamaChatOptions & { apiKey: string; baseURL?: string }
): Promise<OllamaChatResponse> {
  const { apiKey, baseURL = 'https://ollama.com/api', model, messages, ...rest } = options;

  const response = await fetch(`${baseURL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      ...rest,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Ollama Cloud API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Stream chat with Ollama Cloud model
 * 
 * @example
 * const stream = await streamChatWithOllamaCloud({
 *   apiKey: process.env.OLLAMA_API_KEY!,
 *   model: 'gpt-oss:120b',
 *   messages: [{ role: 'user', content: 'Tell me a story' }],
 * });
 * 
 * for await (const chunk of stream) {
 *   console.log(chunk.message.content);
 * }
 */
export async function* streamChatWithOllamaCloud(
  options: OllamaChatOptions & { apiKey: string; baseURL?: string }
): AsyncGenerator<OllamaChatResponse> {
  const { apiKey, baseURL = 'https://ollama.com/api', model, messages, ...rest } = options;

  const response = await fetch(`${baseURL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      ...rest,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Ollama Cloud API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  if (!response.body) {
    throw new Error('No response body from Ollama Cloud API');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const chunk: OllamaChatResponse = JSON.parse(line);
            yield chunk;
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }

    // Handle remaining buffer
    if (buffer.trim()) {
      try {
        const chunk: OllamaChatResponse = JSON.parse(buffer);
        yield chunk;
      } catch (e) {
        // Skip invalid JSON
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * List available Ollama Cloud models
 * 
 * @example
 * const models = await listOllamaCloudModels(process.env.OLLAMA_API_KEY!);
 */
export async function listOllamaCloudModels(
  apiKey: string,
  baseURL: string = 'https://ollama.com/api'
): Promise<OllamaModelsResponse> {
  const response = await fetch(`${baseURL}/tags`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Ollama Cloud API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Generate text with Ollama Cloud (non-stream)
 * 
 * @example
 * const response = await generateWithOllamaCloud({
 *   apiKey: process.env.OLLAMA_API_KEY!,
 *   model: 'gpt-oss:120b',
 *   prompt: 'What is AI?',
 * });
 */
export async function generateWithOllamaCloud(
  options: {
    apiKey: string;
    model: string;
    prompt: string;
    baseURL?: string;
    temperature?: number;
    top_p?: number;
    top_k?: number;
  }
): Promise<string> {
  const { apiKey, model, prompt, baseURL = 'https://ollama.com/api', ...rest } = options;

  const response = await fetch(`${baseURL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      ...rest,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Ollama Cloud API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.response || '';
}

/**
 * Stream generate with Ollama Cloud
 */
export async function* streamGenerateWithOllamaCloud(
  options: {
    apiKey: string;
    model: string;
    prompt: string;
    baseURL?: string;
    temperature?: number;
    top_p?: number;
    top_k?: number;
  }
): AsyncGenerator<string> {
  const { apiKey, model, prompt, baseURL = 'https://ollama.com/api', ...rest } = options;

  const response = await fetch(`${baseURL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
      ...rest,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Ollama Cloud API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  if (!response.body) {
    throw new Error('No response body from Ollama Cloud API');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const chunk = JSON.parse(line);
            if (chunk.response) {
              yield chunk.response;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }

    // Handle remaining buffer
    if (buffer.trim()) {
      try {
        const chunk = JSON.parse(buffer);
        if (chunk.response) {
          yield chunk.response;
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Convert AIMessage to OllamaMessage
 */
export function convertToOllamaMessage(message: AIMessage): OllamaMessage {
  return {
    role: message.role as 'user' | 'assistant' | 'system',
    content: message.content,
  };
}

/**
 * Convert OllamaMessage to AIMessage
 */
export function convertFromOllamaMessage(message: OllamaMessage): AIMessage {
  return {
    role: message.role,
    content: message.content,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date(),
  };
}
