/**
 * SDK Configuration
 * 
 * Centralized configuration for the QMS SDK.
 * Loads environment variables and provides type-safe configuration objects.
 */

import { z } from 'zod';

// ============================================
// ENVIRONMENT SCHEMA
// ============================================

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().optional(),

  // Google
  GOOGLE_API_KEY: z.string().optional(),
  GOOGLE_VERTEX_API_KEY: z.string().optional(),

  // DeepSeek
  DEEPSEEK_API_KEY: z.string().optional(),

  // Groq
  GROQ_API_KEY: z.string().optional(),

  // X.AI
  XAI_API_KEY: z.string().optional(),

  // Mistral
  MISTRAL_API_KEY: z.string().optional(),

  // Cerebras
  CEREBRAS_API_KEY: z.string().optional(),

  // Ollama (local)
  OLLAMA_HOST: z.string().default('http://localhost:11434'),

  // Ollama Cloud
  OLLAMA_API_KEY: z.string().optional(),
  OLLAMA_CLOUD_HOST: z.string().default('https://ollama.com/api'),

  // Other providers
  COHERE_API_KEY: z.string().optional(),
  FIREWORKS_API_KEY: z.string().optional(),
  DEEPINFRA_API_KEY: z.string().optional(),
  TOGETHERAI_API_KEY: z.string().optional(),
  PERPLEXITY_API_KEY: z.string().optional(),

  // Pinecone
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_INDEX_NAME: z.string().optional(),

  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

// ============================================
// ENVIRONMENT LOADING
// ============================================

let cachedEnv: Env | null = null;

/**
 * Load and validate environment variables
 */
function loadEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const env = {
    // Database
    DATABASE_URL: process.env.DATABASE_URL,

    // OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    // Anthropic
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,

    // Google
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_VERTEX_API_KEY: process.env.GOOGLE_VERTEX_API_KEY,

    // DeepSeek
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,

    // Groq
    GROQ_API_KEY: process.env.GROQ_API_KEY,

    // X.AI
    XAI_API_KEY: process.env.XAI_API_KEY,

    // Mistral
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,

    // Cerebras
    CEREBRAS_API_KEY: process.env.CEREBRAS_API_KEY,

    // Ollama
    OLLAMA_HOST: process.env.OLLAMA_HOST || 'http://localhost:11434',
    OLLAMA_API_KEY: process.env.OLLAMA_API_KEY,
    OLLAMA_CLOUD_HOST: process.env.OLLAMA_CLOUD_HOST || 'https://ollama.com/api',

    // Other providers
    COHERE_API_KEY: process.env.COHERE_API_KEY,
    FIREWORKS_API_KEY: process.env.FIREWORKS_API_KEY,
    DEEPINFRA_API_KEY: process.env.DEEPINFRA_API_KEY,
    TOGETHERAI_API_KEY: process.env.TOGETHERAI_API_KEY,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,

    // Pinecone
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,

    // Next.js
    NODE_ENV: (process.env.NODE_ENV || 'development') as any,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  const validated = envSchema.parse(env);
  cachedEnv = validated;
  return validated;
}

// ============================================
// SDK CONFIGURATION
// ============================================

export interface AIConfig {
  defaultModel: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
}

export interface OllamaConfig {
  enabled: boolean;
  host: string;
  cloudEnabled: boolean;
  cloudHost: string;
  apiKey?: string;
}

export interface SDKConfig {
  env: Env;
  ai: AIConfig;
  ollama: OllamaConfig;
}

/**
 * Build SDK configuration from environment
 */
export function buildSDKConfig(): SDKConfig {
  const env = loadEnv();

  return {
    env,
    ai: {
      defaultModel: 'openai/gpt-4o-mini',
      defaultTemperature: 0.7,
      defaultMaxTokens: 2048,
    },
    ollama: {
      enabled: !!env.OLLAMA_HOST,
      host: env.OLLAMA_HOST,
      cloudEnabled: !!env.OLLAMA_API_KEY,
      cloudHost: env.OLLAMA_CLOUD_HOST,
      apiKey: env.OLLAMA_API_KEY,
    },
  };
}

/**
 * Get SDK configuration (cached)
 */
let sdkConfigCache: SDKConfig | null = null;

export function getSDKConfig(): SDKConfig {
  if (!sdkConfigCache) {
    sdkConfigCache = buildSDKConfig();
  }
  return sdkConfigCache;
}

// Export as module-level constant for convenience
export const sdkConfig = getSDKConfig();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if Ollama is configured
 */
export function isOllamaConfigured(): boolean {
  const config = getSDKConfig();
  return config.ollama.enabled;
}

/**
 * Check if Ollama Cloud is configured
 */
export function isOllamaCloudConfigured(): boolean {
  const config = getSDKConfig();
  return config.ollama.cloudEnabled && !!config.ollama.apiKey;
}

/**
 * Get Ollama host URL
 */
export function getOllamaHost(): string {
  const config = getSDKConfig();
  return config.ollama.host;
}

/**
 * Get Ollama Cloud host URL
 */
export function getOllamaCloudHost(): string {
  const config = getSDKConfig();
  return config.ollama.cloudHost;
}

/**
 * Get Ollama Cloud API key
 */
export function getOllamaCloudAPIKey(): string | undefined {
  const config = getSDKConfig();
  return config.ollama.apiKey;
}
