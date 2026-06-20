// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — /api/news/sources — News Sources API (Public)
// GET: List registered news sources (sanitized — no internal metadata)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, parseBooleanParam } from "@/lib/api-response";
import { withErrorBoundary } from "@/lib/errors";

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/news/sources — List News Sources (Public-Safe)
// Only exposes public metadata — hides rssUrl, lastError, trustScore,
// fetchInterval, and other operational fields that could aid attackers.
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const [sources, error] = await withErrorBoundary(async () => {
    const { searchParams } = request.nextUrl;
    const isActive = parseBooleanParam(searchParams.get("active"));

    const sources = await prisma.newsSource.findMany({
      where: isActive !== undefined ? { isActive } : { isActive: true },
      orderBy: [{ name: "asc" }],
      select: {
        // ── PUBLIC fields only ────────────────────────────────────────
        id: true,
        name: true,
        slug: true,
        websiteUrl: true,
        logoUrl: true,
        isActive: true,
        articleCount: true,
        // ── HIDDEN: rssUrl, scraperType, trustScore, fetchInterval,
        //    lastFetchedAt, lastErrorAt, lastError, createdAt
        //    These reveal operational details and attack surface.
      },
    });

    return sources;
  }, "GET:/api/news/sources");

  if (error) return apiError(error);
  return apiSuccess(sources);
}
