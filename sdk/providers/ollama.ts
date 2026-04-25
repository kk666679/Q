/**
 * Ollama Provider Configuration
 * 
 * AI SDK provider for Ollama (self-hosted models + cloud models)
 * 
 * Cloud models run without a powerful GPU and are offloaded to Ollama's cloud service.
 * To use cloud models, set OLLAMA_API_KEY and authenticate via ollama.com.
 * 
 * @see https://docs.ollama.com/cloud
 */

import type { ProviderInfo, ModelDefinition } from '../types';

// ============================================
// LOCAL PROVIDER INFO
// ============================================

export const ollamaProvider: ProviderInfo = {
  id: 'ollama',
  name: 'Ollama',
  website: 'https://ollama.com',
  docsURL: 'https://github.com/ollama/ollama',
  baseURL: 'http://localhost:11434',
  defaultModel: 'llama3.1',
  supportsStreaming: true,
  requiresAPIKey: false,
  authType: 'bearer',
};

// ============================================
// CLOUD PROVIDER INFO
// ============================================

export const ollamaCloudProvider: ProviderInfo = {
  id: 'ollama-cloud',
  name: 'Ollama Cloud',
  website: 'https://ollama.com',
  docsURL: 'https://docs.ollama.com/cloud',
  baseURL: 'https://ollama.com',
  defaultModel: 'gpt-oss:120b',
  supportsStreaming: true,
  requiresAPIKey: true,
  authType: 'bearer',
};

// ============================================
// LOCAL MODELS
// ============================================

export const ollamaModels: ModelDefinition[] = [
  {
    id: 'llama3.3',
    name: 'Llama 3.3',
    provider: 'ollama',
    modelId: 'llama3.3',
    description: 'Meta\'s Llama 3.3 model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
    recommendedFor: ['self-hosted', 'local deployment'],
  },
  {
    id: 'llama3.2',
    name: 'Llama 3.2',
    provider: 'ollama',
    modelId: 'llama3.2',
    description: 'Meta\'s Llama 3.2 model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
  },
  {
    id: 'llama3.1',
    name: 'Llama 3.1',
    provider: 'ollama',
    modelId: 'llama3.1',
    description: 'Meta\'s Llama 3.1 model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
  },
  {
    id: 'qwen2.5',
    name: 'Qwen 2.5',
    provider: 'ollama',
    modelId: 'qwen2.5',
    description: 'Alibaba\'s Qwen 2.5 model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
  },
  {
    id: 'mistral',
    name: 'Mistral',
    provider: 'ollama',
    modelId: 'mistral',
    description: 'Mistral model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
  },
  {
    id: 'phi4',
    name: 'Phi 4',
    provider: 'ollama',
    modelId: 'phi4',
    description: 'Microsoft\'s Phi 4 model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
  },
  {
    id: 'codellama',
    name: 'Code Llama',
    provider: 'ollama',
    modelId: 'codellama',
    description: 'Code Llama model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
    recommendedFor: ['code generation', 'programming'],
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'ollama',
    modelId: 'deepseek-coder',
    description: 'DeepSeek Coder model (self-hosted)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
    },
  },
];

// ============================================
// CLOUD MODELS
// ============================================

/**
 * Ollama Cloud models run on Ollama's cloud service without requiring a local GPU.
 * Access requires an API key from https://ollama.com/settings/keys
 * 
 * Usage:
 *   Local CLI: ollama run gpt-oss:120b-cloud
 *   Cloud API: curl https://ollama.com/api/chat -H "Authorization: Bearer $OLLAMA_API_KEY"
 * 
 * @see https://docs.ollama.com/cloud#cloud-models
 */
export const ollamaCloudModels: ModelDefinition[] = [
  {
    id: 'gpt-oss:120b',
    name: 'GPT-OSS 120B',
    provider: 'ollama',
    modelId: 'gpt-oss:120b',
    description: 'GPT-OSS 120B cloud model via Ollama Cloud (no local GPU required)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: true,
      maxContextTokens: 128000,
      maxOutputTokens: 4096,
    },
    recommendedFor: ['cloud', 'large reasoning tasks', 'QMS document generation'],
  },
  {
    id: 'gpt-oss:20b',
    name: 'GPT-OSS 20B',
    provider: 'ollama',
    modelId: 'gpt-oss:20b',
    description: 'GPT-OSS 20B cloud model via Ollama Cloud (faster, lower cost)',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: true,
      maxContextTokens: 128000,
      maxOutputTokens: 4096,
    },
    recommendedFor: ['cloud', 'balanced performance', 'ISO compliance checking'],
  },
  {
    id: 'minimax-m2.5:cloud',
    name: 'MiniMax M2.5 Cloud',
    provider: 'ollama',
    modelId: 'minimax-m2.5:cloud',
    description: 'MiniMax M2.5 cloud model — runs on Ollama Cloud without local GPU',
    capabilities: {
      supportsImageInput: false,
      supportsObjectGeneration: true,
      supportsToolUsage: true,
      supportsToolStreaming: true,
      supportsVision: false,
      supportsStreaming: true,
      supportsReasoning: false,
      maxContextTokens: 100000,
      maxOutputTokens: 4096,
    },
    recommendedFor: ['cloud', 'general chat', 'QMS assistance'],
  },
];

// ============================================
// EXPORTS
// ============================================

export default {
  provider: ollamaProvider,
  models: ollamaModels,
  cloudProvider: ollamaCloudProvider,
  cloudModels: ollamaCloudModels,
};

