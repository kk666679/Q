// Errors & retry
export { SDKError, SDKErrorCode, isSDKError, withRetry } from './errors';

// Logger
export { logger } from './utils/logger';

// Validation schemas
export * from './validation/schemas';

// Core
export { AgentRegistry, agentRegistry } from './core/registry';
export { AgentOrchestrator, agentOrchestrator } from './core/orchestrator';
export { VectorService } from './core/vector-service';
export type { AgentContext } from './core/orchestrator';
export type { VectorQueryOptions, VectorMatch } from './core/vector-service';

// Services
export { loadAndIndexKnowledgeBase } from './services/kb-loader';
export { climateRiskEngine } from './services/climate-risk-engine';
export { riskEngine } from './services/risk-engine';

// Types
export * from './types';

// Client hooks (React — only import in client components)
export {
  useAgent,
  useAgents,
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useValidateDocument,
  useProcesses,
  useCreateProcess,
  useUpdateProcess,
  useComplianceCheck,
  useComplianceReport,
  useAudits,
  useGenerateAuditChecklist,
  useCreateAudit,
  useMultiAgentChat,
  useRecordMetrics,
  useOEE,
  useCreateProject,
  useGenerateQuote,
  useCreateClaim,
} from './client/hooks';

export { trpc, trpcClient } from './client/trpc';
export type { AppRouter } from './client/trpc';
