/* eslint-disable @typescript-eslint/no-explicit-any */

export type NodeCategoryId = string;

export type NodeSchemaField = {
  /** Field name */
  name: string;
  /** JSON schema-like primitive info (kept permissive for backwards compatibility) */
  type?: string;
  description?: string;
  defaultValue?: unknown;
  required?: boolean;
};

/**
 * Configuration schema for a node.
 *
 * Note: existing code uses `configSchema` as a loose object.
 * This type intentionally stays permissive to remain compatible.
 */
export type NodeConfigSchema = Record<string, any>;

export type NodeTemplate = {
  id: string;
  name: string;
  description?: string;
  /** Source node id */
  nodeId: string;
  /** Pre-filled config to apply when inserted */
  config: Record<string, any>;
  /** Optional default position hinting */
  pinned?: boolean;
  createdAt: number;
  updatedAt: number;
};

export type NodeDoc = {
  /** External URL */
  docsUrl?: string;
  /** Optional code/example URL */
  exampleUrl?: string;
};

export type NodeRegistryEntry = {
  /** Internal node identifier (must be stable) */
  id: string;
  /** Category identifier */
  category: NodeCategoryId;

  /** Human-friendly display name */
  label: string;

  /** Optional icon name (lucide/react-icon string) */
  icon?: string;

  description?: string;

  /** Tags for search/discovery */
  tags?: string[];

  /** Rich metadata */
  version?: string;
  author?: string;

  /** Input/output counts for intelligence */
  inputs?: number;
  outputs?: number;

  /** Config schema */
  configSchema?: NodeConfigSchema;

  /** Documentation + examples */
  docs?: NodeDoc;
};

export type NodeCategory = {
  id: NodeCategoryId;
  label: string;
  /** Hex/rgb string used for color coding */
  color: string;
  /** Optional icon */
  icon?: string;
};

export type NodeSearchItem = {
  entry: NodeRegistryEntry;
  score: number;
  /** Useful for debugging */
  matchedFields: string[];
};

export type NodeRegistryAdapter = {
  categories: NodeCategory[];
  nodes: NodeRegistryEntry[];
};


