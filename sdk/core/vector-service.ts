import { Pinecone } from '@pinecone-database/pinecone';
import { VectorDocument, StructuredRAGOutput } from '../types';
import { openai } from '@ai-sdk/openai';
import { embedText, generateObject } from 'ai';

export class VectorService {
  private pinecone: Pinecone | null = null;
  private indexName: string;

  constructor() {
    this.indexName = process.env.PINECONE_INDEX_NAME || 'qms-compliance';
    if (typeof window === 'undefined' && process.env.PINECONE_API_KEY) {
      this.pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });
    }
  }

  async upsertDocument(document: VectorDocument & { embedding: number[] }) {
    if (!this.pinecone) return;
    const index = this.pinecone.index(this.indexName);
    
    await index.upsert([{ 
      id: document.id, 
      values: document.embedding, 
      metadata: { 
        content: document.content, 
        ...document.metadata 
      } 
    }]);
  }

  async searchSimilar(query: number[], topK: number = 10, filter?: Record<string, any>) {
    if (!this.pinecone) return [];
    const index = this.pinecone.index(this.indexName);
    
    const results = await index.query({
      vector: query,
      topK,
      includeMetadata: true,
      filter,
    });

    return results.matches?.map(match => ({
      id: match.id,
      score: match.score || 0,
      content: match.metadata?.content as string,
      metadata: match.metadata,
    })) || [];
  }

  async deleteDocument(id: string) {
    if (!this.pinecone) return;
    const index = this.pinecone.index(this.indexName);
    await index.deleteOne(id);
  }

  async checkCompliance(requirement: string, documents: string[]): Promise<{
    compliant: boolean;
    score: number;
    evidence: string[];
    gaps: string[];
  }> {
    // Simulate embedding generation for requirement
    const requirementEmbedding = await this.generateEmbedding(requirement);
    
    // Search for relevant documents
    const results = await this.searchSimilar(requirementEmbedding, 5);
    
    // Calculate compliance score based on similarity
    const score = results.length > 0 ? Math.max(...results.map(r => r.score)) * 100 : 0;
    const compliant = score > 70;
    
    return {
      compliant,
      score,
      evidence: results.filter(r => r.score > 0.7).map(r => r.content),
      gaps: compliant ? [] : ['Insufficient documentation found for requirement'],
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const embedding = await embedText({
      model: openai.embedding('text-embedding-3-small'),
      text
    });
    return embedding.embeddings[0] as number[];
  }

  async indexKnowledgeBase(globPattern: string): Promise<void> {
    // TODO: Implement file loader for ISO JSONs, chunk clauses, embed & upsert
    console.log(`Indexing knowledge base: ${globPattern}`);
    // Load sdk/knowledge-base/*.json, chunk by clause, generateEmbedding, upsertDocument
  }
}