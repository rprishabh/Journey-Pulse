"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  TrendingDown,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  Wind,
  Activity,
  Radio,
} from "lucide-react";

interface AqiCity {
  city: string;
  country: string;
  aqi: number;
  status: string;
  dominantPollutant: string;
  lastUpdated: string;
  dashboardUrl: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  GOOD: { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  MODERATE: { color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" },
  UNHEALTHY_SENSITIVE: { color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" },
  UNHEALTHY: { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
  VERY_UNHEALTHY: { color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" },
  HAZARDOUS: { color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/30" },
};

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

function getAqiBarWidth(aqi: number, maxAqi: number): string {
  const pct = Math.min((aqi / Math.max(maxAqi, 1)) * 100, 100);
  return `${pct}%`;
}

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function GlobalAqiRanking() {
  const [worstCities, setWorstCities] = useState<AqiCity[]>([]);
  const [bestCities, setBestCities] = useState<AqiCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastFetched, setLastFetched] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAqi = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/aqi-ranking");
      const json = await res.json();
      if (json.success && json.data) {
        setWorstCities(json.data.worst || []);
        setBestCities(json.data.best || []);
        setLastFetched(json.meta?.fetchedAt || new Date().toISOString());
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch AQI data:", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAqi();
    // Refresh every 15 minutes
    const interval = setInterval(() => fetchAqi(), 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAqi]);

  const maxWorstAqi = Math.max(...worstCities.map(c => c.aqi), 1);
  const maxBestAqi = Math.max(...bestCities.map(c => c.aqi), 1);

  return (
    <section className="container-wide scroll-mt-24" id="aqi-ranking">
      <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-lg relative overflow-hidden">

        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 w-[500px] h-[300px] bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/2" />

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-sunset-3 tracking-widest bg-sunset-3/10 px-2.5 py-0.5 rounded border border-sunset-3/20">
              Atmospheric Intelligence
            </span>
            <h2 className="font-display font-black text-heading-xl text-ink dark:text-cream leading-tight">
              Global AQI <span className="text-gradient">Rankings</span>
            </h2>
            <p className="text-body-sm text-ink/70 dark:text-cream/70">
              Live air quality index comparison across 20 cities worldwide — from cleanest to most hazardous.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start">
            {lastFetched && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                  Live
                </span>
                <span className="text-[9px] text-emerald-400/70 font-medium">
                  · {formatTimeAgo(lastFetched)}
                </span>
              </div>
            )}
            <button
              onClick={() => fetchAqi(true)}
              disabled={refreshing}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-sunset-1/30 flex items-center justify-center transition-all duration-300 group cursor-pointer"
              title="Refresh AQI data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cream/60 group-hover:text-sunset-1 transition-colors ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <Wind className="w-6 h-6 text-sunset-3 animate-pulse" />
              <span className="text-xs font-bold text-cream/60 uppercase tracking-widest">
                Sampling air quality data...
              </span>
            </div>
          ) : error || (worstCities.length === 0 && bestCities.length === 0) ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Radio className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="font-display font-extrabold text-sm text-ink dark:text-cream">
                AQI Data Temporarily Unavailable
              </h4>
              <p className="text-xs text-ink/60 dark:text-cream/60 max-w-md mx-auto">
                Air quality monitoring data could not be retrieved. Please try again shortly.
              </p>
              <button
                onClick={() => { setLoading(true); setError(false); fetchAqi(); }}
                className="text-[10px] font-bold text-sunset-1 uppercase tracking-wider hover:underline cursor-pointer"
              >
                Retry Now
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Top 5 Worst Cities */}
              <div className="glass-strong border border-red-500/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="font-display font-black text-heading-md text-ink dark:text-cream leading-tight">
                      Top 5 Severe AQI Cities
                    </h3>
                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                      Hazardous / High-Threat Air Quality
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {worstCities.map((c, i) => {
                    const config = STATUS_CONFIG[c.status] || STATUS_CONFIG.UNHEALTHY;
                    return (
                      <motion.a
                        key={c.city}
                        href={c.dashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="block p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-display font-black text-xs text-red-400">
                              #{i + 1}
                            </span>
                            <div className="text-left">
                              <span className="font-bold text-xs text-ink dark:text-cream block leading-tight">
                                {c.city}
                              </span>
                              <span className="text-[10px] text-ink/60 dark:text-cream/60">
                                {c.country}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="text-right">
                              <span className={`badge ${config.bg} ${config.color} ${config.border} text-[8px] px-2 py-0.5 flex items-center gap-1`}>
                                {formatStatus(c.status)}
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </span>
                              <span className="text-[8px] text-cream/40 font-medium block mt-0.5">
                                {c.dominantPollutant}
                              </span>
                            </div>
                            <span className="font-display font-black text-sm text-red-500 min-w-[36px] text-right">
                              {c.aqi}
                            </span>
                          </div>
                        </div>
                        {/* AQI bar */}
                        <div className="w-full h-1.5 bg-red-500/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: getAqiBarWidth(c.aqi, maxWorstAqi) }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Top 5 Best Cities */}
              <div className="glass-strong border border-emerald-500/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h3 className="font-display font-black text-heading-md text-ink dark:text-cream leading-tight">
                      Top 5 Clean AQI Cities
                    </h3>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                      Premium / Safe Air Quality
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {bestCities.map((c, i) => {
                    const config = STATUS_CONFIG[c.status] || STATUS_CONFIG.GOOD;
                    return (
                      <motion.a
                        key={c.city}
                        href={c.dashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="block p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 rounded-xl transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-display font-black text-xs text-emerald-400">
                              #{i + 1}
                            </span>
                            <div className="text-left">
                              <span className="font-bold text-xs text-ink dark:text-cream block leading-tight">
                                {c.city}
                              </span>
                              <span className="text-[10px] text-ink/60 dark:text-cream/60">
                                {c.country}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="text-right">
                              <span className={`badge ${config.bg} ${config.color} ${config.border} text-[8px] px-2 py-0.5 flex items-center gap-1`}>
                                {formatStatus(c.status)}
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </span>
                              <span className="text-[8px] text-cream/40 font-medium block mt-0.5">
                                {c.dominantPollutant}
                              </span>
                            </div>
                            <span className="font-display font-black text-sm text-emerald-400 min-w-[36px] text-right">
                              {c.aqi}
                            </span>
                          </div>
                        </div>
                        {/* AQI bar */}
                        <div className="w-full h-1.5 bg-emerald-500/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: getAqiBarWidth(c.aqi, maxBestAqi) }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
