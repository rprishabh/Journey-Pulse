// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — /api/news — News Articles API
// GET: Paginated, filterable article listing with self-healing fetch
// Production-grade Next.js App Router API route
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  apiPaginatedSuccess,
  apiError,
  parsePagination,
  parseEnumParam,
  parseBooleanParam,
  parseDateParam,
} from "@/lib/api-response";
import { withErrorBoundary } from "@/lib/errors";
import type { Prisma } from "@prisma/client";

// Force dynamic rendering — no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ═══════════════════════════════════════════════════════════════════════════════
// SELF-HEALING FETCH — Auto-populates DB when empty (Vercel Free Plan)
// Uses in-memory lock to prevent concurrent fetch storms
// ═══════════════════════════════════════════════════════════════════════════════

let isFetchInProgress = false;
let lastAutoFetchAt = 0;

// Minimum interval between auto-fetch triggers (1 hour in ms)
const AUTO_FETCH_COOLDOWN_MS = 60 * 60 * 1000;

/**
 * Triggers an RSS fetch cycle in the background if:
 * 1. No articles exist in the DB (first deployment scenario)
 * 2. OR last auto-fetch was more than 1 hour ago (stale data recovery)
 * 3. AND no fetch is currently in progress (concurrency guard)
 *
 * This is the "free plan" alternative to Vercel cron jobs.
 * The fetch runs in the background — the current request still returns immediately.
 */
async function triggerSelfHealingFetch(articleCount: number): Promise<void> {
  const now = Date.now();
  const timeSinceLastFetch = now - lastAutoFetchAt;

  // Only trigger if DB is empty or cooldown has elapsed
  const shouldFetch =
    (articleCount === 0 || timeSinceLastFetch > AUTO_FETCH_COOLDOWN_MS) &&
    !isFetchInProgress;

  if (!shouldFetch) return;

  // Set lock immediately to prevent concurrent triggers
  isFetchInProgress = true;
  lastAutoFetchAt = now;

  console.log(
    `[NewsFeed:SelfHeal] 🔄 Auto-triggering RSS fetch (articles=${articleCount}, lastFetch=${timeSinceLastFetch}ms ago)`
  );

  // Fire-and-forget — don't block the API response
  import("@/lib/news-fetcher")
    .then(({ runFetchCycle }) => runFetchCycle())
    .then((result) => {
      console.log(
        `[NewsFeed:SelfHeal] ✅ Auto-fetch complete: ${result.totalNewArticles} new articles from ${result.totalSources} sources`
      );
    })
    .catch((error) => {
      console.error(
        "[NewsFeed:SelfHeal] ❌ Auto-fetch failed:",
        error instanceof Error ? error.message : error
      );
    })
    .finally(() => {
      isFetchInProgress = false;
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/news — Fetch Articles with Full Relations
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const [data, error] = await withErrorBoundary(async () => {
    const { searchParams } = request.nextUrl;

    // ── Parse query parameters ──────────────────────────────────────────
    const { page, pageSize, skip } = parsePagination(searchParams);
    const category = searchParams.get("category");

    const segment = parseEnumParam(searchParams.get("segment"), [
      "INBOUND",
      "OUTBOUND",
      "DOMESTIC",
      "ENTERPRISE",
      "GLOBAL",
    ] as const);

    const status = parseEnumParam(searchParams.get("status"), [
      "DRAFT",
      "PUBLISHED",
      "ARCHIVED",
      "FLAGGED",
    ] as const);

    const source = searchParams.get("source");
    const isFeatured = parseBooleanParam(searchParams.get("featured"));
    const search = searchParams.get("q");
    const fromDate = parseDateParam(searchParams.get("from"));
    const toDate = parseDateParam(searchParams.get("to"));
    const tag = searchParams.get("tag");
    const sortBy = searchParams.get("sort") ?? "publishedAt";
    const sortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";

    // ── Build dynamic WHERE clause ──────────────────────────────────────
    const where: Prisma.ArticleWhereInput = {};

    if (segment) {
      where.segment = segment;
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (source) {
      where.OR = [
        { sourceName: { contains: source, mode: "insensitive" } },
        { newsSource: { slug: source } },
      ];
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (search) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { summary: { contains: search, mode: "insensitive" } },
            { seoKeywords: { has: search.toLowerCase() } },
          ],
        },
      ];
    }

    if (fromDate || toDate) {
      where.publishedAt = {};
      if (fromDate) where.publishedAt.gte = fromDate;
      if (toDate) where.publishedAt.lte = toDate;
    }

    if (tag) {
      where.tags = { some: { slug: tag } };
    }

    // ── Build ORDER BY ──────────────────────────────────────────────────
    const allowedSortFields = [
      "publishedAt",
      "fetchedAt",
      "viewCount",
      "shareCount",
      "createdAt",
    ];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : "publishedAt";

    const orderBy: Prisma.ArticleOrderByWithRelationInput = {
      [resolvedSortBy]: sortOrder,
    };

    // ── Execute query with count ────────────────────────────────────────
    const [articles, totalCount] = await prisma.$transaction([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          coverImageUrl: true,
          sourceUrl: true,
          sourceName: true,
          sourceLogoUrl: true,
          author: true,
          publishedAt: true,
          status: true,
          segment: true,
          tone: true,
          readTimeMinutes: true,
          viewCount: true,
          isFeatured: true,
          isPinned: true,
          seoTitle: true,
          seoDescription: true,
          // ── Relations the frontend needs ──────────────────────────────
          category: {
            select: {
              name: true,
              slug: true,
              iconName: true,
              colorHex: true,
            },
          },
          tags: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    // ── Self-Healing: Auto-trigger fetch if DB is empty or stale ────────
    // Runs in the background — does NOT block this response
    triggerSelfHealingFetch(totalCount).catch(() => {
      // Silently ignore — self-healing is best-effort
    });

    return { articles, totalCount, page, pageSize };
  }, "GET:/api/news");

  if (error) return apiError(error);
  return apiPaginatedSuccess(data.articles, data.totalCount, data.page, data.pageSize);
}