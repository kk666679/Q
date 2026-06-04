/**
 * Hooks Layer
 * 
 * Client-side hooks for reactive state management.
 * These hooks use the SDK and Services layers to provide
 * a clean interface for React components.
 * 
 * Architecture:
 * - Hooks use tRPC queries/mutations from SDK
 * - Hooks provide loading states, error handling, and caching
 * - Components should use hooks, not SDK directly
 * 
 * Usage:
 * ```tsx
 * 'use client';
 * 
 * import { useDashboard, useDocuments, useCompliance } from '@/hooks';
 * 
 * function MyComponent() {
 *   const { stats } = useDashboard();
 *   const { documents, createDocument } = useDocuments();
 *   return <div>...</div>;
 * }
 * ```
 */

// Dashboard hooks
export { useDashboard, useDashboardStats, useProjects, useProject } from './use-dashboard';

// Document hooks
export { useDocuments, useDocument } from './use-documents';

// Compliance hooks
export { useCompliance, useComplianceReport, useComplianceScore } from './use-compliance';

// AI hooks
export { useAI, useCompletion, useStructuredGeneration } from './use-ai';

// Industry hooks
export { useManufacturing } from './use-manufacturing';
export { useConstruction } from './use-construction';
export { useInsurance } from './use-insurance';

// ISO Engine hooks
export { useRiskManagement, useAuditManagement } from './use-iso-engines';

// AI Operations hooks
export { useAgents as useAgentsOps, useAIOperations } from './use-ai-operations';

// Compliance Engines hooks
export { useCompliance as useComplianceEngine, useCAPAOperations } from './use-compliance-engines';

// Mobile detection
export { useIsMobile } from './use-mobile';

// Toast notifications
export { useToast, toast } from './use-toast';
