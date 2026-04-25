'use client';

/**
 * useDocuments Hook
 * 
 * Client-side hook for document operations using tRPC.
 * Provides reactive data fetching with automatic caching.
 * 
 * @example
 * function DocumentList() {
 *   const { documents, isLoading, createDocument } = useDocuments();
 *   
 *   if (isLoading) return <Spinner />;
 *   return documents.map(doc => <DocumentCard key={doc.id} document={doc} />);
 * }
 */

import { trpc } from '@/lib/sdk';
import { useCallback } from 'react';
import type { Document } from '@/lib/sdk/types';

interface UseDocumentsOptions {
  /** Filter by document type */
  type?: string;
  /** Filter by status */
  status?: string;
  /** Filter by tags */
  tags?: string[];
}

interface CreateDocumentInput {
  title: string;
  content: string;
  type: string;
  version?: string;
  tags?: string[];
}

/**
 * Hook for document list operations
 */
export function useDocuments(options: UseDocumentsOptions = {}) {
  const utils = trpc.useUtils();
  
  // Query documents
  const { data: documents = [], isLoading, error, refetch } = trpc.document.list.useQuery(
    options.type || options.status || options.tags ? options : undefined
  );

  // Create document mutation
  const createMutation = trpc.document.create.useMutation({
    onSuccess: () => {
      utils.document.list.invalidate();
    },
  });

  // Update document mutation
  const updateMutation = trpc.document.update.useMutation({
    onSuccess: () => {
      utils.document.list.invalidate();
    },
  });

  // Validate document mutation
  const validateMutation = trpc.document.validate.useMutation();

  // Create document helper
  const createDocument = useCallback(
    async (input: CreateDocumentInput) => {
      return createMutation.mutateAsync({
        title: input.title,
        content: input.content,
        type: input.type,
        version: input.version || '1.0',
        status: 'draft',
        tags: input.tags || [],
      });
    },
    [createMutation]
  );

  // Update document helper
  const updateDocument = useCallback(
    async (id: string, data: Partial<Document>) => {
      return updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  // Validate document helper
  const validateDocument = useCallback(
    async (id: string) => {
      return validateMutation.mutateAsync({ id });
    },
    [validateMutation]
  );

  return {
    documents,
    isLoading,
    error,
    refetch,
    createDocument,
    updateDocument,
    validateDocument,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isValidating: validateMutation.isPending,
  };
}

/**
 * Hook for single document operations
 */
export function useDocument(id: string) {
  const utils = trpc.useUtils();
  
  const { data: document, isLoading, error, refetch } = trpc.document.get.useQuery({ id });

  const updateMutation = trpc.document.update.useMutation({
    onSuccess: () => {
      utils.document.get.invalidate({ id });
      utils.document.list.invalidate();
    },
  });

  const validateMutation = trpc.document.validate.useMutation();

  const update = useCallback(
    async (data: Partial<Document>) => {
      return updateMutation.mutateAsync({ id, data });
    },
    [id, updateMutation]
  );

  const validate = useCallback(async () => {
    return validateMutation.mutateAsync({ id });
  }, [id, validateMutation]);

  return {
    document,
    isLoading,
    error,
    refetch,
    update,
    validate,
    isUpdating: updateMutation.isPending,
    isValidating: validateMutation.isPending,
  };
}

export default useDocuments;
