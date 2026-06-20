// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Standardized API Response Helpers
// Consistent envelope format for all /app/api/* route handlers
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { AppError, serializeError } from "@/lib/errors";
import { prismaErrorToHttpStatus, prismaErrorToMessage, isPrismaKnownError, isPrismaConnectionError, isPrismaValidationError } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSE ENVELOPE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  timestamp?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESS RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Returns a standardized success response with optional pagination metadata.
 * All API routes should use this to ensure consistent envelope format.
 */
export function apiSuccess<T>(
  data: T,
  meta?: ApiMeta,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      meta: meta
        ? { ...meta, timestamp: new Date().toISOString() }
        : { timestamp: new Date().toISOString() },
    },
    {
      status,
      headers: {
        "X-Request-Timestamp": new Date().toISOString(),
      },
    }
  );
}

/**
 * Returns a paginated success response with computed pagination metadata.
 */
export function apiPaginatedSuccess<T>(
  data: T[],
  totalCount: number,
  page: number,
  pageSize: number
): NextResponse<ApiSuccessResponse<T[]>> {
  const totalPages = Math.ceil(totalCount / pageSize);

  return apiSuccess(data, {
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  });
}

/**
 * Returns a 201 Created response (for POST operations).
 */
export function apiCreated<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return apiSuccess(data, undefined, 201);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR RESPONSES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Converts any caught error into a standardized error response.
 * Handles AppError, Prisma errors, and unknown errors with proper
 * status codes and safe user-facing messages.
 *
 * @example
 * try { ... } catch (error) { return apiError(error); }
 */
export function apiError(error: unknown): NextResponse<ApiErrorResponse> {
  // ── AppError (our custom hierarchy) ───────────────────────────────────
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false as const,
        error: {
          code: error.code,
          message: error.message,
          details: process.env.NODE_ENV === "development" ? error.details : undefined,
        },
      },
      { status: error.statusCode }
    );
  }

  // ── Prisma errors ─────────────────────────────────────────────────────
  if (isPrismaKnownError(error) || isPrismaConnectionError(error) || isPrismaValidationError(error)) {
    const status = prismaErrorToHttpStatus(error);
    const message = prismaErrorToMessage(error);

    // Log the actual Prisma error for debugging, but return safe message
    console.error("[API] Prisma error:", serializeError(error));

    return NextResponse.json(
      {
        success: false as const,
        error: {
          code: "DATABASE_ERROR",
          message,
        },
      },
      { status }
    );
  }

  // ── Generic Error ─────────────────────────────────────────────────────
  if (error instanceof Error) {
    console.error("[API] Unhandled error:", error.message, error.stack);

    return NextResponse.json(
      {
        success: false as const,
        error: {
          code: "INTERNAL_ERROR",
          message: error.message || "An unexpected error occurred. Please try again later.",
        },
      },
      { status: 500 }
    );
  }

  // ── Unknown thrown value ──────────────────────────────────────────────
  console.error("[API] Unknown error:", error);

  return NextResponse.json(
    {
      success: false as const,
      error: {
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred. Please try again later.",
      },
    },
    { status: 500 }
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERY PARAMETER PARSING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parses pagination parameters from URL search params with defaults and bounds.
 */
export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  pageSize: number;
  skip: number;
} {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10) || 20)
  );
  const skip = (page - 1) * pageSize;

  return { page, pageSize, skip };
}

/**
 * Parses an optional enum parameter, returning undefined if invalid.
 */
export function parseEnumParam<T extends string>(
  value: string | null,
  validValues: readonly T[]
): T | undefined {
  if (!value) return undefined;
  const upper = value.toUpperCase() as T;
  return validValues.includes(upper) ? upper : undefined;
}

/**
 * Parses a boolean query parameter.
 */
export function parseBooleanParam(value: string | null): boolean | undefined {
  if (value === null || value === "") return undefined;
  return value === "true" || value === "1";
}

/**
 * Validates and parses a date string parameter.
 */
export function parseDateParam(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Validates a sort order parameter.
 */
export function parseSortOrder(
  value: string | null,
  allowedFields: string[],
  defaultField: string = "createdAt",
  defaultDirection: "asc" | "desc" = "desc"
): { field: string; direction: "asc" | "desc" } {
  const field = value && allowedFields.includes(value) ? value : defaultField;
  return { field, direction: defaultDirection };
}
