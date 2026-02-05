// ============================================================================
// L'ESSENCE DU LUXE v2.0 - Retry Utility
// Exponential backoff retry logic for API calls
// ============================================================================

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry'>> & {
  onRetry?: RetryOptions['onRetry'];
} = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryCondition: () => true,
  onRetry: undefined,
};

/**
 * Determines if an error is retryable based on common patterns
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('econnreset') ||
      message.includes('fetch failed')
    ) {
      return true;
    }

    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      return true;
    }

    // Server errors (5xx)
    if (message.includes('500') || message.includes('502') || message.includes('503')) {
      return true;
    }
  }

  // Check for response status codes
  if (typeof error === 'object' && error !== null) {
    const status = (error as { status?: number }).status;
    if (status && (status >= 500 || status === 429)) {
      return true;
    }
  }

  return false;
}

/**
 * Sleeps for the specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculates delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number
): number {
  const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
  const jitter = Math.random() * 0.3 * exponentialDelay; // Add 0-30% jitter
  return Math.min(exponentialDelay + jitter, maxDelayMs);
}

/**
 * Executes an async function with exponential backoff retry logic
 *
 * @example
 * const result = await withRetry(
 *   () => fetchData(),
 *   {
 *     maxAttempts: 3,
 *     retryCondition: isRetryableError,
 *     onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error)
 *   }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const {
    maxAttempts,
    initialDelayMs,
    maxDelayMs,
    backoffMultiplier,
    retryCondition,
    onRetry,
  } = config;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      const shouldRetry = attempt < maxAttempts && retryCondition(error);

      if (!shouldRetry) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delayMs = calculateDelay(attempt, initialDelayMs, maxDelayMs, backoffMultiplier);

      // Notify caller of retry
      if (onRetry) {
        onRetry(attempt, error, delayMs);
      }

      // Wait before retrying
      await sleep(delayMs);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError;
}

/**
 * Creates a retryable version of an async function
 *
 * @example
 * const retryableFetch = createRetryable(fetchData, { maxAttempts: 3 });
 * const result = await retryableFetch();
 */
export function createRetryable<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return ((...args: Parameters<T>) =>
    withRetry(() => fn(...args), options)) as T;
}

/**
 * Retry options preset for Gemini AI API calls
 */
export const GEMINI_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 8000,
  backoffMultiplier: 2,
  retryCondition: isRetryableError,
  onRetry: (attempt, error, delayMs) => {
    console.warn(
      `[GeminiService] Retry attempt ${attempt} after ${delayMs}ms:`,
      error instanceof Error ? error.message : error
    );
  },
};

/**
 * Retry options preset for Firebase API calls
 */
export const FIREBASE_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 500,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
  retryCondition: isRetryableError,
  onRetry: (attempt, error, delayMs) => {
    console.warn(
      `[FirebaseService] Retry attempt ${attempt} after ${delayMs}ms:`,
      error instanceof Error ? error.message : error
    );
  },
};

/**
 * Retry options preset for RevenueCat API calls
 */
export const REVENUECAT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 2,
  initialDelayMs: 1000,
  maxDelayMs: 3000,
  backoffMultiplier: 2,
  retryCondition: isRetryableError,
  onRetry: (attempt, error, delayMs) => {
    console.warn(
      `[RevenueCat] Retry attempt ${attempt} after ${delayMs}ms:`,
      error instanceof Error ? error.message : error
    );
  },
};
