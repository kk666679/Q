/**
 * Services Layer
 * 
 * Business logic services that use the SDK layer.
 * These services encapsulate complex operations and can be used
 * in both server and client contexts.
 * 
 * Architecture:
 * - Services use the SDK layer for data access
 * - Services contain business logic and data transformations
 * - Hooks use Services for client-side state management
 * 
 * Usage:
 * ```tsx
 * // In a Server Component
 * import { documentService } from '@/lib/services';
 * const documents = await documentService.list();
 * 
 * // In a Hook
 * import { documentService } from '@/lib/services';
 * const { data } = useQuery(['documents'], () => documentService.list());
 * ```
 */

export * from './document-service';
export * from './compliance-service';
export * from './ai-service';
export * from './dashboard-service';
