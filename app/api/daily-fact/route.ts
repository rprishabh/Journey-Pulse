// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Daily Fact API
// GET /api/daily-fact
// Fetches the daily tourism fact matching today's date, with a robust fallback.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();

    // Standard date string comparison for database DATE fields
    const isoDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const startOfTodayUtc = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));

    // Try finding by exact date match in timezone-agnostic manner
    let fact = await prisma.dailyFact.findFirst({
      where: {
        factDate: {
          equals: new Date(isoDateStr),
        },
        isPublished: true,
      },
    });

    if (!fact) {
      // Fallback 1: match by UTC date object
      fact = await prisma.dailyFact.findFirst({
        where: {
          factDate: {
            equals: startOfTodayUtc,
          },
          isPublished: true,
        },
      });
    }

    if (!fact) {
      // Fallback 2: Retrieve a fact based on the day of the year (so it changes daily even if date matches fail)
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const diff = today.getTime() - startOfYear.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);

      const allFactsCount = await prisma.dailyFact.count({ where: { isPublished: true } });
      if (allFactsCount > 0) {
        const skipCount = dayOfYear % allFactsCount;
        fact = await prisma.dailyFact.findFirst({
          where: { isPublished: true },
          skip: skipCount,
        });
      }
    }

    if (!fact) {
      return NextResponse.json({
        success: false,
        error: "No facts found in database",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: fact,
    });
  } catch (error) {
    console.error("[API /api/daily-fact] Error fetching daily fact:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}
