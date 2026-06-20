// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — /api/cron/fetch — Secured RSS Fetch Trigger
// GET: Triggers an RSS fetch cycle (called by external cron services)
// Protected by CRON_SECRET via Authorization header — NEVER via query params
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { runFetchCycle } from "@/lib/news-fetcher";

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH HELPER — Validates cron secret from request headers
// Supports: Authorization: Bearer <token>, x-cron-secret: <token>
// ═══════════════════════════════════════════════════════════════════════════════

function validateCronAuth(request: NextRequest): { valid: boolean; error?: string } {
  const cronSecret = process.env.CRON_SECRET;

  // If no CRON_SECRET is configured, block all requests in production
  if (!cronSecret || cronSecret.length < 16) {
    console.error("[CronFetch] CRON_SECRET is missing or too short (min 16 chars). Blocking request.");
    return { valid: false, error: "Cron endpoint is not configured. Set a strong CRON_SECRET env variable." };
  }

  // Extract token from headers (NEVER from query params — those appear in logs)
  const authHeader = request.headers.get("authorization");
  const cronHeader = request.headers.get("x-cron-secret");

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : cronHeader ?? null;

  if (!token) {
    return { valid: false, error: "Missing authorization. Use 'Authorization: Bearer <token>' or 'x-cron-secret' header." };
  }

  // Constant-time comparison to prevent timing attacks
  if (!timingSafeEqual(token, cronSecret)) {
    return { valid: false, error: "Invalid cron secret." };
  }

  return { valid: true };
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * Always compares full length regardless of where mismatch occurs.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/cron/fetch — Trigger RSS Fetch Cycle
// External cron services (cron-job.org, GitHub Actions, etc.) call this
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  // 1. Authenticate
  const auth = validateCronAuth(request);
  if (!auth.valid) {
    // Log failed auth attempts (but don't reveal details in response)
    console.warn(`[CronFetch] ❌ Auth failed from ${request.headers.get("x-forwarded-for") ?? "unknown"}: ${auth.error}`);
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    console.log("[CronFetch] ✅ Authenticated — starting fetch cycle...");
    const results = await runFetchCycle();

    return NextResponse.json({
      success: true,
      message: "News database updated successfully",
      articlesAdded: results.totalNewArticles,
      skipped: results.totalSkipped,
      sources: results.totalSources,
      duration: results.duration,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[CronFetch] ❌ Fetch cycle failed:", message);

    // Don't leak internal error details in production
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === "development" ? message : "Fetch cycle failed",
      },
      { status: 500 }
    );
  }
}