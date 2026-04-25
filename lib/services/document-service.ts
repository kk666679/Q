/**
 * Document Service
 * 
 * Service layer for document operations using the SDK.
 * Provides high-level methods for document management.
 */

import { trpcClient } from '@/lib/sdk/trpc';
import type { Document } from '@/lib/sdk/types';

export interface CreateDocumentInput {
  title: string;
  content: string;
  type: string;
  version?: string;
  tags?: string[];
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
  type?: string;
  version?: string;
  status?: Document['status'];
  tags?: string[];
}

/**
 * Document Service class
 * Encapsulates all document-related operations
 */
export const documentService = {
  /**
   * List all documents with optional filters
   */
  async list(filters?: { type?: string; status?: string; tags?: string[] }) {
    return trpcClient.document.list.query(filters);
  },

  /**
   * Get a single document by ID
   */
  async get(id: string) {
    return trpcClient.document.get.query({ id });
  },

  /**
   * Create a new document
   */
  async create(input: CreateDocumentInput) {
    return trpcClient.document.create.mutate({
      title: input.title,
      content: input.content,
      type: input.type,
      version: input.version || '1.0',
      status: 'draft',
      tags: input.tags || [],
    });
  },

  /**
   * Update an existing document
   */
  async update(id: string, data: UpdateDocumentInput) {
    return trpcClient.document.update.mutate({ id, data });
  },

  /**
   * Validate a document against standards
   */
  async validate(id: string) {
    return trpcClient.document.validate.mutate({ id });
  },

  /**
   * Generate document content using AI
   */
  async generateContent(prompt: string, documentType: string) {
    const response = await fetch('/api/generate-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, documentType }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate document content');
    }

    return response.json();
  },
};

export default documentService;
