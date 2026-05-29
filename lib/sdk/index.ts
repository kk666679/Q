/**
 * QMS SDK - Centralized Client Layer
 * 
 * This module provides a unified interface for all SDK integrations
 * including AI providers, tRPC clients, and configuration.
 * 
 * Architecture:
 * - SDK (this layer) provides the core clients and configuration
 * - Services layer uses SDK for business logic
 * - Hooks layer uses Services for client-side state management
 * - Components use Hooks for UI interactions
 * 
 * Usage Examples:
 * 
 * Server Component:
 * ```tsx
 * import { trpcClient } from '@/lib/sdk';
 * const documents = await trpcClient.document.list.query();
 * ```
 * 
 * Client Component:
 * ```tsx
 * import { trpc } from '@/lib/sdk';
 * const { data } = trpc.document.list.useQuery();
 * ```
 * 
 * AI Generation:
 * ```tsx
 * import { generate, streamGenerate } from '@/lib/sdk';
 * const result = await generate({ messages, model: 'openai/gpt-4o-mini' });
 * ```
 */

// Re-export AI SDK client and utilities
export {
  // Core generation functions
  generate,
  streamGenerate,
  generateText,
  streamText,
  generateObject,
  streamObject,
  // React hooks for client-side AI
  useChat,
  useCompletion,
  // Model utilities
  availableModels,
  getModelInfo,
  modelSupports,
  defaultAIConfig,
} from './ai';

// Re-export tRPC client
export {
  trpc,
  trpcClient,
  createQueryClient,
  createTRPCClientOptions,
} from './trpc';

// Re-export types
export type {
  AIConfig,
  AIMessage,
  AIGenerateOptions,
  AIStreamOptions,
  Document,
  Process,
  ProcessNode,
  ProcessEdge,
  Agent,
  ChatMessage,
  ComplianceResult,
  RiskAssessment,
  AuditFinding,
} from './types';

// Re-export configuration
export { sdkConfig } from './config';

// Re-export AppRouter type for type inference
export type { AppRouter } from './trpc';
