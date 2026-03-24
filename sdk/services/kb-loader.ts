import fs from 'fs/promises';
import path from 'path';
import { VectorService } from '../core/vector-service';
import type { VectorDocument } from '../types';

export async function loadAndIndexKnowledgeBase(): Promise<void> {
  const kbDir = path.join(process.cwd(), 'sdk/knowledge-base');
  const files = await fs.readdir(kbDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const vectorService = new VectorService();

  for (const file of jsonFiles) {
    const filePath = path.join(kbDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Chunk by clauses (assume iso9001_clauses array)
    const standard = file.replace('-clauses.json', '').replace('.json', '').toUpperCase();
    const clauses = data.iso9001_clauses || data.iso14001_clauses || data[`${standard.toLowerCase()}_clauses`] || data;

    for (const clause of clauses) {
      const chunkId = `${standard}-${clause.clause}`;
      const chunkContent = `
Clause: ${clause.clause}
Title: ${clause.title}
Summary: ${clause.summary}
Requirements: ${clause.requirements.join('\\n')}
`;

      const embedding = await vectorService.generateEmbedding(chunkContent);
      const doc: VectorDocument & { embedding: number[] } = {
        id: chunkId,
        content: chunkContent.trim(),
        metadata: {
          standard,
          clause: clause.clause,
          title: clause.title,
        },
        embedding,
      };

      await vectorService.upsertDocument(doc);
      console.log(`Indexed: ${chunkId}`);
    }
  }
  console.log('Knowledge base indexing complete.');
}

// CLI usage
if (typeof require !== 'undefined' && require.main === module) {
  loadAndIndexKnowledgeBase().catch(console.error);
}

