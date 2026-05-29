// @ts-ignore optional peer dependency
import { Pinecone } from '@pinecone-database/pinecone';
import type { VectorDocument } from '../types/index';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { SDKError, SDKErrorCode, withRetry } from '../errors';
import { logger } from '../utils/logger';

const EXPECTED_DIMENSIONS = 1536; // text-embedding-3-small
const MAX_TOP_K = 50;

export interface VectorQueryOptions {
  topK?: number;
  filter?: Record<string, string | number | boolean>;
  /** Tenant id for logical partitioning — required in multi-tenant contexts */
  tenantId?: string;
}

export interface VectorMatch {
  id: string;
  score: number;
  content: string;
  metadata: Record<string, unknown>;
}

export class VectorService {
  private pinecone: Pinecone | null = null;
  private readonly indexName: string;

  constructor() {
    this.indexName = process.env.PINECONE_INDEX_NAME ?? 'qms-compliance';
    if (typeof window === 'undefined' && process.env.PINECONE_API_KEY) {
      this.pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    }
  }

  async upsertDocument(
    document: VectorDocument & { embedding: number[] },
    tenantId?: string,
  ): Promise<void> {
    if (!this.pinecone) return;
    if (document.embedding.length !== EXPECTED_DIMENSIONS) {
      throw new SDKError(
        SDKErrorCode.VALIDATION_FAILED,
        `Embedding must have ${EXPECTED_DIMENSIONS} dimensions, got ${document.embedding.length}`,
      );
    }
    const index = this.pinecone.index(this.indexName);
    await withRetry(() =>
      index.upsert({
        records: [{
          id:     document.id,
          values: document.embedding,
          metadata: {
            content: document.content,
            ...(tenantId ? { tenantId } : {}),
            ...document.metadata,
          },
        }],
      }),
    );
  }

  async searchSimilar(
    query: number[],
    options: VectorQueryOptions = {},
  ): Promise<VectorMatch[]> {
    if (!this.pinecone) return [];
    if (query.length !== EXPECTED_DIMENSIONS) {
      throw new SDKError(
        SDKErrorCode.VALIDATION_FAILED,
        `Query embedding must have ${EXPECTED_DIMENSIONS} dimensions`,
      );
    }

    const topK  = Math.min(options.topK ?? 10, MAX_TOP_K);
    const index = this.pinecone.index(this.indexName);

    // Tenant scoping prevents cross-tenant data leaks
    const filter: Record<string, unknown> = { ...options.filter };
    if (options.tenantId) filter['tenantId'] = options.tenantId;

    try {
      const results = await withRetry(() =>
        index.query({
          vector: query,
          topK,
          includeMetadata: true,
          ...(Object.keys(filter).length > 0 ? { filter } : {}),
        }),
      ) as { matches?: Array<{ id: string; score?: number; metadata?: Record<string, unknown> }> };

      return (results.matches ?? []).map((match) => ({
        id:       match.id,
        score:    match.score ?? 0,
        content:  String(match.metadata?.['content'] ?? ''),
        metadata: (match.metadata ?? {}) as Record<string, unknown>,
      }));
    } catch (err) {
      throw new SDKError(SDKErrorCode.VECTOR_STORE_ERROR, 'Vector search failed', err);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    if (!this.pinecone) return;
    const index = this.pinecone.index(this.indexName);
    await index.deleteOne({ id });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!text.trim()) {
      throw new SDKError(SDKErrorCode.VALIDATION_FAILED, 'Cannot embed empty text');
    }
    try {
      const result = await withRetry(() =>
        embed({
          model: openai.embedding('text-embedding-3-small'),
          value: text.slice(0, 8191), // model token limit
        }),
      );
      return result.embedding as number[];
    } catch (err) {
      throw new SDKError(SDKErrorCode.PROVIDER_ERROR, 'Embedding generation failed', err);
    }
  }

  async checkCompliance(
    requirement: string,
    tenantId?: string,
  ): Promise<{ compliant: boolean; score: number; evidence: string[]; gaps: string[] }> {
    const embedding = await this.generateEmbedding(requirement);
    const results   = await this.searchSimilar(embedding, { topK: 5, tenantId });
    const score     = results.length > 0 ? Math.max(...results.map(r => r.score)) * 100 : 0;
    const compliant = score > 70;
    return {
      compliant,
      score,
      evidence: results.filter(r => r.score > 0.7).map(r => r.content),
      gaps:     compliant ? [] : ['Insufficient documentation found for requirement'],
    };
  }

  async indexKnowledgeBase(globPattern: string): Promise<void> {
    logger.info('Indexing knowledge base', { pattern: globPattern });
  }
}
