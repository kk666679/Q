export const SDKErrorCode = {
  AGENT_NOT_FOUND:      'AGENT_NOT_FOUND',
  TOOL_NOT_FOUND:       'TOOL_NOT_FOUND',
  TOOL_EXEC_FAILED:     'TOOL_EXEC_FAILED',
  VALIDATION_FAILED:    'VALIDATION_FAILED',
  UNAUTHORIZED:         'UNAUTHORIZED',
  RATE_LIMITED:         'RATE_LIMITED',
  PROVIDER_ERROR:       'PROVIDER_ERROR',
  VECTOR_STORE_ERROR:   'VECTOR_STORE_ERROR',
  KB_LOAD_FAILED:       'KB_LOAD_FAILED',
  WORKFLOW_EXEC_FAILED: 'WORKFLOW_EXEC_FAILED',
  MISSING_CONFIG:       'MISSING_CONFIG',
} as const;

export type SDKErrorCode = typeof SDKErrorCode[keyof typeof SDKErrorCode];

export class SDKError extends Error {
  constructor(
    public readonly code: SDKErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'SDKError';
  }
}

export function isSDKError(err: unknown): err is SDKError {
  return err instanceof SDKError;
}

/** Exponential backoff retry — wraps transient provider failures */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 300,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      // Never retry auth failures
      if (isSDKError(err) && err.code === SDKErrorCode.UNAUTHORIZED) throw err;
      if (attempt < maxAttempts - 1) {
        await new Promise(r => setTimeout(r, baseDelayMs * 2 ** attempt));
      }
    }
  }
  throw new SDKError(
    SDKErrorCode.PROVIDER_ERROR,
    `Failed after ${maxAttempts} attempts`,
    lastError,
  );
}
