// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Global Events API (7-Day Alert Window)
// GET /api/events
// Returns only events within a 7-day lookahead or currently happening.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();

    // Calculate the 7-day lookahead ceiling
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Query: fetch events where:
    //   - isActive = true
    //   - startDate <= now + 7 days  (event starts within the next week OR has already started)
    //   - endDate >= now             (event hasn't ended yet)
    // This gives us: events starting within 7 days + currently ongoing events
    const events = await prisma.globalEvent.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: sevenDaysFromNow,
        },
        endDate: {
          gte: now,
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    // Enrich each event with computed status fields for the frontend
    const enrichedEvents = events.map((event) => {
      const startMs = new Date(event.startDate).getTime();
      const endMs = new Date(event.endDate).getTime();
      const nowMs = now.getTime();

      const isHappeningNow = nowMs >= startMs && nowMs <= endMs;
      const daysUntilStart = Math.ceil((startMs - nowMs) / (1000 * 60 * 60 * 24));

      let statusLabel: string;
      let statusType: "happening" | "tomorrow" | "upcoming";

      if (isHappeningNow) {
        statusLabel = "Happening Now! 🔥";
        statusType = "happening";
      } else if (daysUntilStart <= 1) {
        statusLabel = "Tomorrow!";
        statusType = "tomorrow";
      } else {
        statusLabel = `Starts in ${daysUntilStart} days`;
        statusType = "upcoming";
      }

      return {
        ...event,
        statusLabel,
        statusType,
        daysUntilStart: Math.max(0, daysUntilStart),
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedEvents,
      meta: {
        total: enrichedEvents.length,
        windowStart: now.toISOString(),
        windowEnd: sevenDaysFromNow.toISOString(),
      },
    });
  } catch (error) {
    console.error("[API /api/events] Error fetching global events:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch upcoming events",
        data: [],
      },
      { status: 500 }
    );
  }
}
