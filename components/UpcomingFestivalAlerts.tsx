// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Upcoming Festival Alerts Component
// Time-filtered global events with 7-day alert window, countdown badges,
// and "Happening Now" indicators.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import { PartyPopper, MapPin, Calendar, Flame, Clock, Sparkles } from "lucide-react";
import { motion } from "motion/react";

// ── Types ────────────────────────────────────────────────────────────────────

interface GlobalEvent {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  country: string;
  countryCode: string;
  flagEmoji: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  category: string;
  isRecurring: boolean;
  statusLabel: string;
  statusType: "happening" | "tomorrow" | "upcoming";
  daysUntilStart: number;
  sourceUrl: string | null;
}

// ── Category color/emoji mappings ────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  CULTURAL: { bg: "bg-violet-500/15 border-violet-500/20", text: "text-violet-400", emoji: "🎭" },
  MUSIC:    { bg: "bg-cyan-500/15 border-cyan-500/20", text: "text-cyan-400", emoji: "🎵" },
  FOOD:     { bg: "bg-orange-500/15 border-orange-500/20", text: "text-orange-400", emoji: "🍽️" },
  RELIGIOUS:{ bg: "bg-amber-500/15 border-amber-500/20", text: "text-amber-400", emoji: "🪷" },
  SPORTS:   { bg: "bg-emerald-500/15 border-emerald-500/20", text: "text-emerald-400", emoji: "🏆" },
};

// ── Gradient overlays for cards ──────────────────────────────────────────────

const CARD_GRADIENTS = [
  "from-indigo-600/90 via-violet-600/80 to-purple-700/90",
  "from-cyan-600/90 via-teal-600/80 to-emerald-700/90",
  "from-rose-600/90 via-pink-600/80 to-fuchsia-700/90",
  "from-amber-600/90 via-orange-600/80 to-red-700/90",
  "from-blue-600/90 via-indigo-600/80 to-violet-700/90",
  "from-emerald-600/90 via-teal-600/80 to-cyan-700/90",
];

// ── Large background emoji for visual impact ────────────────────────────────

const CATEGORY_BG_EMOJI: Record<string, string> = {
  CULTURAL: "🎪",
  MUSIC: "🎶",
  FOOD: "🍅",
  RELIGIOUS: "✨",
  SPORTS: "⚽",
};

export function UpcomingFestivalAlerts() {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const getLocalDateOnly = (dateInput: string) => {
            const d = new Date(dateInput);
            const y = d.getUTCFullYear();
            const m = d.getUTCMonth();
            const dateVal = d.getUTCDate();
            return new Date(y, m, dateVal, 0, 0, 0, 0);
          };

          const calculated = json.data.map((event: any) => {
            const localStart = getLocalDateOnly(event.startDate);
            const localEnd = getLocalDateOnly(event.endDate);
            
            const isHappeningNow = today >= localStart && today <= localEnd;
            const diffTime = localStart.getTime() - today.getTime();
            const daysUntilStart = Math.round(diffTime / (1000 * 60 * 60 * 24));

            let statusType: "happening" | "tomorrow" | "upcoming" = "upcoming";
            let statusLabel = "";

            if (isHappeningNow) {
              statusType = "happening";
              statusLabel = "Happening Now! 🔥";
            } else if (daysUntilStart === 1) {
              statusType = "tomorrow";
              statusLabel = "Tomorrow!";
            } else if (daysUntilStart > 1) {
              statusType = "upcoming";
              statusLabel = `Starts in ${daysUntilStart} days`;
            } else {
              statusType = "upcoming";
              statusLabel = "Completed";
            }

            return {
              ...event,
              statusType,
              statusLabel,
              daysUntilStart: Math.max(0, daysUntilStart)
            };
          });

          setEvents(calculated);
        }
      } catch (err) {
        console.error("Failed to fetch festival events:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Don't render anything if no events are within the 7-day window
  if (!isLoading && events.length === 0) return null;

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="container-wide" id="festival-alerts">
        <div className="space-y-6">
          <div className="skeleton h-8 w-80 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-wide" id="festival-alerts">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <PartyPopper className="w-5 h-5 text-white" />
            </div>
            <span className="text-caption font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Upcoming Travel Alerts
            </span>
          </div>
          <h2 className="font-display font-bold text-heading-xl text-surface-900 dark:text-white">
            Festivals & Events <span className="text-gradient">Worldwide</span>
          </h2>
          <p className="text-body-sm text-surface-500 max-w-2xl">
            Time-sensitive alerts for major global festivals happening within the next 7 days. Auto-rotating — events disappear once they end.
          </p>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const catStyle = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.CULTURAL;
            const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
            const bgEmoji = CATEGORY_BG_EMOJI[event.category] || "🌍";

            // Format dates
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const isSameDay = start.toDateString() === end.toDateString();
            const dateStr = isSameDay
              ? start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;

            return (
              <motion.a
                key={event.id}
                href={event.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(event.name + " official website")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden border border-white/10 dark:border-surface-800 shadow-md hover:shadow-2xl hover:shadow-brand-500/10 transition-shadow duration-300 block cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.08,
                }}
                whileHover={{
                  scale: 1.03,
                  y: -6,
                }}
              >
                {/* Gradient Background with Large Emoji */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                <div className="absolute right-[-20px] bottom-[-20px] text-[120px] opacity-[0.08] pointer-events-none leading-none select-none">
                  {bgEmoji}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col justify-between min-h-[280px]">
                  {/* Top Row: Category + Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`badge ${catStyle.bg} ${catStyle.text} border text-[10px] px-2.5 py-1`}>
                      {catStyle.emoji} {event.category}
                    </span>

                    {/* Status Badge */}
                    {event.statusType === "happening" ? (
                      <span className="badge bg-red-500/20 text-red-200 border border-red-400/30 text-[10px] px-2.5 py-1 animate-pulse">
                        <Flame className="w-3 h-3" />
                        Happening Now!
                      </span>
                    ) : event.statusType === "tomorrow" ? (
                      <span className="badge bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[10px] px-2.5 py-1">
                        <Clock className="w-3 h-3" />
                        Tomorrow!
                      </span>
                    ) : (
                      <span className="badge bg-white/10 text-white/80 border border-white/15 text-[10px] px-2.5 py-1">
                        <Sparkles className="w-3 h-3" />
                        {event.statusLabel}
                      </span>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="space-y-3 mt-auto">
                    <h3 className="font-display font-extrabold text-heading-md text-white leading-tight group-hover:text-amber-200 transition-colors duration-300">
                      {event.flagEmoji && <span className="mr-1.5">{event.flagEmoji}</span>}
                      {event.name}
                    </h3>

                    <p className="text-[13px] text-white/70 leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    {/* Meta Row */}
                    <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                      <span className="flex items-center gap-1 text-[11px] text-white/60 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-white/40" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-white/60 font-medium ml-auto">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        {dateStr}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
