// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Error Boundary Utilities
// skills.md §1: Deep error boundaries and data fallback loops
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM ERROR CLASSES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Base application error with HTTP status code and operational classification.
 * Operational errors are expected (bad input, not found) and safely reportable.
 * Non-operational errors are bugs that require logging and generic responses.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    isOperational: boolean = true,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/** 400 — Malformed request body, missing required fields, invalid types */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", details?: Record<string, unknown>) {
    super(message, 400, "BAD_REQUEST", true, details);
  }
}

/** 401 — Missing or invalid authentication credentials */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHORIZED", true);
  }
}

/** 403 — Valid credentials but insufficient permissions */
export class ForbiddenError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, "FORBIDDEN", true);
  }
}

/** 404 — Resource does not exist */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND", true);
  }
}

/** 409 — Conflict with current state (duplicate, constraint violation) */
export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT", true);
  }
}

/** 422 — Syntactically valid but semantically unprocessable */
export class UnprocessableError extends AppError {
  constructor(message: string = "Unprocessable entity", details?: Record<string, unknown>) {
    super(message, 422, "UNPROCESSABLE", true, details);
  }
}

/** 429 — Rate limit exceeded */
export class RateLimitError extends AppError {
  constructor(retryAfterSeconds: number = 60) {
    super("Rate limit exceeded. Please try again later.", 429, "RATE_LIMITED", true, {
      retryAfter: retryAfterSeconds,
    });
  }
}

/** 503 — Service temporarily unavailable (DB down, upstream failure) */
export class ServiceUnavailableError extends AppError {
  constructor(service: string = "Service") {
    super(`${service} is temporarily unavailable. Please try again later.`, 503, "SERVICE_UNAVAILABLE", true);
  }
}

/** Upstream RSS/API fetch failure — wraps external service errors */
export class ExternalServiceError extends AppError {
  public readonly serviceName: string;
  public readonly originalError?: Error;

  constructor(serviceName: string, message: string, originalError?: Error) {
    super(`[${serviceName}] ${message}`, 502, "EXTERNAL_SERVICE_ERROR", true);
    this.serviceName = serviceName;
    this.originalError = originalError;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY WRAPPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Wraps an async operation with comprehensive error boundaries.
 * Catches all errors, classifies them, and returns a Result tuple.
 * Never throws — callers always get either data or a structured error.
 *
 * @example
 * const [articles, error] = await withErrorBoundary(
 *   () => prisma.article.findMany({ take: 10 }),
 *   "FetchArticles"
 * );
 * if (error) return apiError(error);
 * return apiSuccess(articles);
 */
export async function withErrorBoundary<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<[T, null] | [null, AppError]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    // Already classified — pass through
    if (error instanceof AppError) {
      console.error(`[ErrorBoundary:${operationName}] Operational error:`, error.message);
      return [null, error];
    }

    // Generic JS Error — classify as internal
    if (error instanceof Error) {
      console.error(`[ErrorBoundary:${operationName}] Unhandled error:`, error.message);
      console.error(error.stack);
      return [
        null,
        new AppError(
          error.message || "An unexpected error occurred",
          500,
          "INTERNAL_ERROR",
          false
        ),
      ];
    }

    // Unknown thrown value
    console.error(`[ErrorBoundary:${operationName}] Unknown error:`, error);
    return [
      null,
      new AppError("An unexpected error occurred", 500, "UNKNOWN_ERROR", false),
    ];
  }
}

/**
 * Retry wrapper with exponential backoff for transient failures.
 * Used by RSS fetcher and external API calls.
 * skills.md §1: data fallback loops for all background workers
 *
 * @param operation - The async operation to retry
 * @param operationName - Label for logging
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param baseDelayMs - Initial delay between retries in ms (default: 1000)
 * @param shouldRetry - Predicate to determine if an error is retryable
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3,
  baseDelayMs: number = 1000,
  shouldRetry: (error: unknown, attempt: number) => boolean = isRetryableError
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error, attempt)) {
        break;
      }

      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
      console.warn(
        `[Retry:${operationName}] Attempt ${attempt + 1}/${maxRetries} failed. ` +
          `Retrying in ${Math.round(delay)}ms...`,
        error instanceof Error ? error.message : error
      );
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Determines if an error is transient and worth retrying.
 * Network timeouts, connection resets, and 5xx upstream errors are retryable.
 * Validation errors, auth errors, and 4xx client errors are NOT retryable.
 */
function isRetryableError(error: unknown, _attempt: number): boolean {
  if (error instanceof AppError) {
    // Don't retry operational client errors
    if (error.isOperational && error.statusCode < 500) return false;
    // Retry 5xx operational errors (upstream, DB)
    return error.statusCode >= 500;
  }

  if (error instanceof Error) {
    const retryablePatterns = [
      "ECONNRESET",
      "ECONNREFUSED",
      "ETIMEDOUT",
      "ENOTFOUND",
      "EAI_AGAIN",
      "EPIPE",
      "socket hang up",
      "network timeout",
      "fetch failed",
      "aborted",
    ];
    return retryablePatterns.some(
      (pattern) =>
        error.message.toLowerCase().includes(pattern.toLowerCase()) ||
        (error as NodeJS.ErrnoException).code === pattern
    );
  }

  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIMEOUT WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Wraps a promise with a timeout. If the operation exceeds the timeout,
 * the returned promise rejects with a descriptive error.
 * Critical for preventing RSS/API calls from hanging indefinitely.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operationName: string
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(
        new ExternalServiceError(
          operationName,
          `Operation timed out after ${timeoutMs}ms`
        )
      );
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (error) {
    clearTimeout(timeoutHandle!);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

/** Non-blocking delay for retry backoff */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely serializes an error to a JSON-friendly object.
 * Used for CronJobLog error persistence and API error responses.
 */
export function serializeError(error: unknown): {
  name: string;
  message: string;
  code: string;
  stack?: string;
} {
  if (error instanceof AppError) {
    return {
      name: error.constructor.name,
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      code: "UNKNOWN",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  }
  return {
    name: "UnknownError",
    message: String(error),
    code: "UNKNOWN",
  };
}
