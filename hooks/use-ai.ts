'use client';

/**
 * useAI Hook
 * 
 * Custom hook for AI interactions using the centralized SDK.
 * Provides a simplified interface for chat completions with streaming.
 * Supports both Vercel AI Gateway models and Ollama Cloud models.
 * 
 * @example
 * function ChatComponent() {
 *   const { messages, input, handleInputChange, handleSubmit, isLoading } = useAI();
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={input} onChange={handleInputChange} />
 *       <button type="submit" disabled={isLoading}>Send</button>
 *     </form>
 *   );
 * }
 */

import { useChat as useAIChat, useCompletion as useAICompletion } from '@ai-sdk/react';
import { useState, useCallback } from 'react';
import type { AIConfig, ChatMessage } from '@/lib/sdk/types';

interface UseAIOptions extends Partial<AIConfig> {
  /** API endpoint for chat */
  api?: string;
  /** Initial messages */
  initialMessages?: ChatMessage[];
  /** Callback when message is finished */
  onFinish?: (message: ChatMessage) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Hook for AI chat interactions
 */
export function useAI(options: UseAIOptions = {}) {
  const {
    api = '/api/chat',
    model = 'openai/gpt-4o-mini',
    system,
    initialMessages = [],
    onFinish,
    onError,
  } = options;

  const chatResult = useAIChat({
    api,
    initialMessages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    })),
    body: {
      model,
      system,
    },
    onFinish: onFinish
      ? (message) =>
          onFinish({
            id: message.id,
            role: message.role as 'user' | 'assistant' | 'system',
            content: message.content,
            timestamp: new Date(),
          })
      : undefined,
    onError,
  });

  return chatResult;
}

/**
 * Hook for single AI completions (non-chat)
 */
export function useCompletion(options: UseAIOptions = {}) {
  const { api = '/api/completion', model = 'openai/gpt-4o-mini', onError } = options;

  return useAICompletion({
    api,
    body: { model },
    onError,
  });
}

/**
 * Hook for generating structured data with AI
 */
export function useStructuredGeneration<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(async (prompt: string, schema: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, schema }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      const result = await response.json();
      setData(result.object as T);
      return result.object as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, generate };
}

// ============================================
// OLLAMA HELPERS
// ============================================

/**
 * Check if a model is an Ollama model
 */
export function useIsOllamaModel(modelId: string): boolean {
  return modelId.startsWith('ollama/');
}

/**
 * Get Ollama cloud models
 */
export function useOllamaCloudModels() {
  return [
    { id: 'ollama/gpt-oss:120b', name: 'GPT-OSS 120B (Ollama Cloud)' },
    { id: 'ollama/gpt-oss:20b', name: 'GPT-OSS 20B (Ollama Cloud)' },
    { id: 'ollama/minimax-m2.5:cloud', name: 'MiniMax M2.5 Cloud' },
  ];
}

/**
 * Hook for checking Ollama Cloud availability
 */
export function useOllamaCloudAvailable() {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useCallback(() => {
    // Check if Ollama Cloud is configured via environment
    // In production, this would be determined server-side
    const checkAvailable = async () => {
      try {
        const response = await fetch('/api/ollama-cloud-available', {
          method: 'GET',
        });
        setAvailable(response.ok);
      } catch {
        setAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkAvailable();
  }, []);

  return { available, loading };
}

export default useAI;
