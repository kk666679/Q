/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NodeCategory, NodeConfigSchema, NodeRegistryEntry, NodeRegistryAdapter, NodeSearchItem } from './types';





export function normalizeConfigSchema(configSchema?: NodeConfigSchema): NodeConfigSchema {
  if (!configSchema) return {};
  return configSchema;
}

export function createRegistry(adapter: NodeRegistryAdapter) {
  const categoryById = new Map<string, NodeCategory>(adapter.categories.map(c => [c.id, c]));
  const entryById = new Map<string, NodeRegistryEntry>(adapter.nodes.map(n => [n.id, n]));

  const allNodes = adapter.nodes;
  const allCategories = adapter.categories;

  const index = buildSearchIndex(allNodes, adapter.categories);

  function listCategories() {
    return allCategories;
  }

  function listNodesByCategory(categoryId: string) {
    return allNodes.filter(n => n.category === categoryId);
  }

  function getNode(id: string) {
    return entryById.get(id);
  }

  function getCategory(id: string) {
    return categoryById.get(id);
  }

  function search(query: string, opts?: { limit?: number; topPinnedBoostIds?: string[] }) {
    const q = query.trim().toLowerCase();
    if (!q) {
      // No query: return top by stable order (registry order)
      const limit = opts?.limit ?? 50;
      return allNodes.slice(0, limit).map(entry => ({
        entry,
        score: 0,
        matchedFields: [],
      } satisfies NodeSearchItem));
    }

    const limit = opts?.limit ?? 50;
    const topPinnedBoostIds = new Set(opts?.topPinnedBoostIds ?? []);

    const scored = index.search(q).map(hit => {
      const pinnedBoost = topPinnedBoostIds.has(hit.entry.id) ? 0.25 : 0;
      return {
        ...hit,
        score: hit.score + pinnedBoost,
      } satisfies NodeSearchItem;
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  return {
    listCategories,
    listNodesByCategory,
    getNode,
    getCategory,
    search,
    _debug: {
      entryById,
    },
  };
}

// ----------------- Search index (lightweight fuzzy) -----------------

type SearchIndex = {
  search: (query: string) => Array<{ entry: NodeRegistryEntry; score: number; matchedFields: string[] }>;
};

function buildSearchIndex(nodes: NodeRegistryEntry[], categories: NodeCategory[]): SearchIndex {
  const categoryLabelById = new Map(categories.map(c => [c.id, c.label.toLowerCase()]));

  const normalized = nodes.map(entry => {
    const fields: Array<[string, string]> = [];

    fields.push(['label', (entry.label ?? '').toLowerCase()]);
    fields.push(['description', (entry.description ?? '').toLowerCase()]);
    fields.push(['category', (categoryLabelById.get(entry.category) ?? entry.category).toLowerCase()]);

    for (const t of entry.tags ?? []) fields.push(['tag', String(t).toLowerCase()]);
    if (entry.icon) fields.push(['icon', entry.icon.toLowerCase()]);
    if (entry.author) fields.push(['author', entry.author.toLowerCase()]);
    if (entry.version) fields.push(['version', entry.version.toLowerCase()]);

    return { entry, fields };
  });

  return {
    search(query: string) {
      const tokens = tokenize(query);

      const results: Array<{ entry: NodeRegistryEntry; score: number; matchedFields: string[] }> = [];

      for (const item of normalized) {
        const matched = new Set<string>();
        let score = 0;

        for (const [fieldName, value] of item.fields) {
          if (!value) continue;

          // Scoring strategy:
          // - exact substring match gets more points
          // - token match gets smaller points
          // - prefix match slight extra
          for (const token of tokens) {
            if (!token) continue;

            if (value === token) {
              score += 0.9;
              matched.add(fieldName);
            } else if (value.includes(token)) {
              score += 0.55;
              matched.add(fieldName);

              if (value.startsWith(token)) {
                score += 0.2;
              }
            } else {
              // fuzzy: allow character subsequence scoring
              const subseq = fuzzySubsequenceScore(value, token);
              if (subseq > 0.25) {
                score += subseq;
                matched.add(fieldName);
              }
            }
          }
        }

        // Require at least one token to match somewhere
        if (score > 0) {
          results.push({ entry: item.entry, score, matchedFields: Array.from(matched) });
        }
      }

      return results;
    },
  };
}

function tokenize(query: string) {
  // split on whitespace and punctuation
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .split(/\s+/g)
    .filter(Boolean);
}

function fuzzySubsequenceScore(haystack: string, needle: string) {
  // simple subsequence scoring: how well needle chars appear in order.
  // returns in range [0, ~0.6].
  let i = 0;
  let matched = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (haystack[j] === needle[i]) {
      matched++;
      i++;
    }
  }
  if (needle.length === 0) return 0;
  const ratio = matched / needle.length;
  if (matched === 0) return 0;

  // Small penalty for gaps: approximate by matched index spread
  // (keep it cheap)
  return ratio * 0.6;
}

