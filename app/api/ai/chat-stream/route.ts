/**
 * AI Chat Streaming API
 * 
 * Handles streaming responses for AI chat completions.
 * Supports both OpenAI and Ollama Cloud models.
 */

import { aiService } from '@/lib/services/ai-service';
import { streamChatWithOllamaCloud, convertToOllamaMessage } from '@/lib/ollama';
import { getOllamaCloudAPIKey } from '@/lib/sdk/config';
import { isOllamaModel, getOllamaModelId } from '@/lib/sdk/ai';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages, model, temperature, system } = await request.json() as {
      messages: Message[];
      model: string;
      temperature?: number;
      system?: string;
    };

    if (!messages || !model) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: messages, model' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages must be a non-empty array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle Ollama Cloud streaming
    if (isOllamaModel(model)) {
      const apiKey = getOllamaCloudAPIKey();
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Ollama Cloud API key not configured' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const ollamaModelId = getOllamaModelId(model);
      const ollamaMessages = messages.map(convertToOllamaMessage);

      // Create ReadableStream for Ollama Cloud responses
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamChatWithOllamaCloud({
              apiKey,
              model: ollamaModelId,
              messages: ollamaMessages,
              temperature: temperature || 0.7,
            })) {
              const data = JSON.stringify({
                type: 'token',
                content: chunk.message.content,
              });
              controller.enqueue(`data: ${data}\n\n`);
            }
            controller.enqueue(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
            controller.close();
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            controller.enqueue(
              `data: ${JSON.stringify({ type: 'error', error: message })}\n\n`
            );
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Handle other models via Vercel AI Gateway (non-streaming for now)
    const lastMessage = messages[messages.length - 1];
    const result = await aiService.generateText(lastMessage.content, {
      model: model as any,
      temperature,
      system,
    });

    // Convert to streaming format
    const stream = new ReadableStream({
      start(controller) {
        // Send the entire response as a single chunk for non-streaming models
        const data = JSON.stringify({
          type: 'token',
          content: result.text,
        });
        controller.enqueue(`data: ${data}\n\n`);
        controller.enqueue(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
