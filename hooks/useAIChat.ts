'use client';

/**
 * useAIChat Hook
 * 
 * Custom hook for AI chat with full streaming support.
 * Integrates with tRPC for model management and streaming API for responses.
 * Supports both Vercel AI Gateway and Ollama Cloud models.
 */

import { useCallback, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc-client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface UseAIChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  system?: string;
  onError?: (error: Error) => void;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const {
    model = 'openai/gpt-4o-mini',
    temperature = 0.7,
    maxTokens = 2048,
    system,
    onError,
  } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedModel, setSelectedModel] = useState(model);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get available models
  const { data: availableModels = [] } = trpc.ai.getModels.useQuery();

  // Send message and get streaming response
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch('/api/ai/chat-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            model: selectedModel,
            temperature,
            system,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'token') {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.role === 'assistant') {
                      lastMsg.content += data.content;
                      lastMsg.isLoading = false;
                    }
                    return updated;
                  });
                } else if (data.type === 'error') {
                  throw new Error(data.error);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.role === 'assistant') {
            lastMsg.isLoading = false;
          }
          return updated;
        });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Unknown error');

        // Don't set error if aborted
        if (error.name !== 'AbortError') {
          setError(error);
          onError?.(error);

          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.isLoading = false;
              lastMsg.content = `Error: ${error.message}`;
            }
            return updated;
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [messages, selectedModel, isLoading, temperature, system, onError]
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Stop current request
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    stop,
    selectedModel,
    setSelectedModel,
    availableModels,
  };
}

export default useAIChat;
