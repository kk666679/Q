import fs from 'fs/promises';
import path from 'path';
import { VectorService } from '../core/vector-service';
import type { VectorDocument } from '../types/index';
import { SDKError, SDKErrorCode } from '../errors';
import { logger } from '../utils/logger';

interface ISOClause {
  clause:        string;
  title:         string;
  summary:       string;
  requirements:  string[];
}

interface KBFile {
  [key: string]: ISOClause[];
}

function extractClauses(data: KBFile, standard: string): ISOClause[] {
  const key = Object.keys(data).find(k => k.endsWith('_clauses'));
  const clauses = key ? data[key] : (Array.isArray(data) ? data as unknown as ISOClause[] : []);
  if (!Array.isArray(clauses)) {
    logger.warn('No clauses array found in knowledge base file', { standard });
    return [];
  }
  return clauses;
}

export async function loadAndIndexKnowledgeBase(tenantId?: string): Promise<void> {
  const kbDir = path.join(process.cwd(), 'sdk/knowledge-base');

  let files: string[];
  try {
    files = await fs.readdir(kbDir);
  } catch (err) {
    throw new SDKError(SDKErrorCode.KB_LOAD_FAILED, 'Cannot read knowledge-base directory', err);
  }

  const jsonFiles = files.filter(f => f.endsWith('.json'));
  if (jsonFiles.length === 0) {
    logger.warn('No JSON files found in knowledge-base directory');
    return;
  }

  const vectorService = new VectorService();

  for (const file of jsonFiles) {
    const standard = file
      .replace('-clauses.json', '')
      .replace('.json', '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    const filePath = path.join(kbDir, file);
    let data: KBFile;

    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(raw) as KBFile;
    } catch (err) {
      logger.error('Failed to parse knowledge base file', { file, error: String(err) });
      continue;
    }

    const clauses = extractClauses(data, standard);

    for (const clause of clauses) {
      if (!clause.clause || !clause.title) continue;

      const chunkId = `${standard}-${clause.clause}`;
      const chunkContent = [
        `Clause: ${clause.clause}`,
        `Title: ${clause.title}`,
        `Summary: ${clause.summary ?? ''}`,
        `Requirements: ${(clause.requirements ?? []).join('\n')}`,
      ].join('\n');

      try {
        const embedding = await vectorService.generateEmbedding(chunkContent);
        const doc: VectorDocument & { embedding: number[] } = {
          id:       chunkId,
          content:  chunkContent.trim(),
          metadata: { standard, clause: clause.clause, title: clause.title },
          embedding,
        };
        await vectorService.upsertDocument(doc, tenantId);
        logger.info('Indexed clause', { id: chunkId });
      } catch (err) {
        logger.error('Failed to index clause', {
          id:    chunkId,
          error: err instanceof Error ? err.message : 'unknown',
        });
      }
    }
  }

  logger.info('Knowledge base indexing complete', { files: jsonFiles.length });
}
