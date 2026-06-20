// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — /api/news/fetch — Manual RSS Fetch Trigger
// POST: Manually triggers an RSS fetch cycle
// Protected by CRON_SECRET in ALL environments (not just production)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { withErrorBoundary, UnauthorizedError } from "@/lib/errors";
import { runFetchCycle } from "@/lib/news-fetcher";

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/news/fetch — Trigger RSS Fetch Cycle
// Requires CRON_SECRET authorization header in ALL environments
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  const [result, error] = await withErrorBoundary(async () => {
    // ── Authorization check (enforced in ALL environments) ──────────────
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || cronSecret.length < 16) {
      throw new UnauthorizedError(
        "CRON_SECRET is not configured or too short. Set a strong secret (min 16 chars) in .env."
      );
    }

    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("x-cron-secret");

    if (!authHeader) {
      throw new UnauthorizedError(
        "Missing authorization. Use 'Authorization: Bearer <token>' or 'x-cron-secret' header."
      );
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // Constant-time comparison to prevent timing attacks
    if (!timingSafeEqual(token, cronSecret)) {
      console.warn(
        `[NewsFetch] ❌ Invalid auth attempt from ${request.headers.get("x-forwarded-for") ?? "unknown"}`
      );
      throw new UnauthorizedError("Invalid cron secret.");
    }

    // ── Execute fetch cycle ─────────────────────────────────────────────
    const cycleResult = await runFetchCycle();
    return cycleResult;
  }, "POST:/api/news/fetch");

  if (error) return apiError(error);
  return apiSuccess(result, undefined, 200);
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
