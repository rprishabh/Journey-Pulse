"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wind,
  Droplets,
  Waves,
  Tornado,
  Flame,
  Sun,
  Snowflake,
  CloudLightning,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Clock,
  Radio,
} from "lucide-react";

interface WeatherAlert {
  id: string;
  type: "sandstorm" | "tsunami" | "cyclone" | "heavy_rainfall" | "heatwave" | "cold_wave" | "high_winds" | "thunderstorm";
  title: string;
  location: string;
  region: string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY";
  description: string;
  actionGuideline: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  weatherCode: number;
  sourceUrl: string;
  fetchedAt: string;
}

const ALERT_ICONS: Record<string, typeof Wind> = {
  sandstorm: Wind,
  tsunami: Waves,
  cyclone: Tornado,
  heavy_rainfall: Droplets,
  heatwave: Sun,
  cold_wave: Snowflake,
  high_winds: Wind,
  thunderstorm: CloudLightning,
};

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function WorldAlertOverview() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastFetched, setLastFetched] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAlerts = useCallback(async (showRefreshState = false) => {
    if (showRefreshState) setRefreshing(true);
    try {
      const res = await fetch("/api/weather-alerts");
      const json = await res.json();
      if (json.success && json.data) {
        setAlerts(json.data);
        setLastFetched(json.meta?.fetchedAt || new Date().toISOString());
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch weather alerts:", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => fetchAlerts(), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return (
    <section className="container-wide scroll-mt-24" id="world-overview">
      <div className="glass rounded-3xl p-6 md:p-8 border border-sunset-1/10 shadow-lg relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunset-1/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sunset-4/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Block */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-sunset-1 tracking-widest bg-sunset-1/10 px-2.5 py-0.5 rounded border border-sunset-1/20">
              World Overview
            </span>
            <h2 className="font-display font-black text-heading-xl text-ink dark:text-cream leading-tight">
              Global Travel Alerts & <span className="text-gradient">Weather Intelligence</span>
            </h2>
            <p className="text-body-sm text-ink/70 dark:text-cream/70">
              Live extreme weather monitoring across 25+ major travel destinations worldwide.
            </p>
          </div>

          {/* Live status + refresh */}
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
              onClick={() => fetchAlerts(true)}
              disabled={refreshing}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-sunset-1/30 flex items-center justify-center transition-all duration-300 group cursor-pointer"
              title="Refresh alerts"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cream/60 group-hover:text-sunset-1 transition-colors ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <RefreshCw className="w-6 h-6 text-sunset-1 animate-spin" />
              <span className="text-xs font-bold text-cream/60 uppercase tracking-widest">
                Scanning global weather stations...
              </span>
            </div>
          ) : error || alerts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Radio className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="font-display font-extrabold text-sm text-ink dark:text-cream">
                {error ? "Data Temporarily Unavailable" : "All Clear Globally"}
              </h4>
              <p className="text-xs text-ink/60 dark:text-cream/60 max-w-md mx-auto">
                {error
                  ? "Weather data could not be retrieved. Please try again in a few minutes."
                  : "No extreme weather conditions detected across monitored destinations. Safe travels!"}
              </p>
              {error && (
                <button
                  onClick={() => { setLoading(true); setError(false); fetchAlerts(); }}
                  className="text-[10px] font-bold text-sunset-1 uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Retry Now
                </button>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Alert count summary */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-cream/80">
                    {alerts.filter(a => a.severity === "CRITICAL").length} Critical
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-cream/80">
                    {alerts.filter(a => a.severity === "WARNING").length} Warning
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-cream/80">
                    {alerts.filter(a => a.severity === "ADVISORY").length} Advisory
                  </span>
                </div>
                <span className="text-[9px] text-cream/40 font-medium ml-auto">
                  Monitoring 25 cities
                </span>
              </div>

              {/* Alert cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                  {alerts.map((alert, idx) => {
                    const Icon = ALERT_ICONS[alert.type] || AlertTriangle;
                    const isCritical = alert.severity === "CRITICAL";
                    const isWarning = alert.severity === "WARNING";

                    return (
                      <motion.a
                        key={alert.id}
                        href={alert.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer block text-left ${
                          isCritical
                            ? "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                            : isWarning
                            ? "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Title Row */}
                          <div className="flex items-start justify-between">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                              isCritical
                                ? "bg-red-500/10 border-red-500/20 text-red-500"
                                : isWarning
                                ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                                : "bg-white/10 border-white/15 text-cream"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            
                            <span className={`badge text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border flex items-center gap-1 ${
                              isCritical
                                ? "bg-red-500/20 text-red-300 border-red-500/35"
                                : isWarning
                                ? "bg-orange-500/20 text-orange-300 border-orange-500/35"
                                : "bg-white/10 text-white/80 border-white/15"
                            }`}>
                              {alert.severity}
                              <ExternalLink className="w-2.5 h-2.5 opacity-75" />
                            </span>
                          </div>

                          {/* Weather stats mini-row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold text-sunset-2 bg-sunset-2/10 px-1.5 py-0.5 rounded">
                              {alert.temperature.toFixed(1)}°C
                            </span>
                            <span className="text-[9px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                              💧 {alert.humidity}%
                            </span>
                            {alert.windSpeed > 0 && (
                              <span className="text-[9px] font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">
                                🌬 {alert.windSpeed.toFixed(0)}km/h
                              </span>
                            )}
                          </div>

                          {/* Description Block */}
                          <div className="space-y-1 text-left">
                            <span className="text-[9px] uppercase font-bold text-sunset-2 block">
                              {alert.location} · {alert.region}
                            </span>
                            <h4 className="font-display font-extrabold text-xs text-ink dark:text-cream leading-snug line-clamp-2">
                              {alert.title}
                            </h4>
                            <p className="text-[11px] text-ink/70 dark:text-cream/70 leading-relaxed line-clamp-3">
                              {alert.description}
                            </p>
                          </div>
                        </div>

                        {/* Guideline footer */}
                        <div className="pt-3 border-t border-white/5 space-y-1 text-left">
                          <span className="text-[8px] font-bold text-sunset-1 uppercase block tracking-wider">
                            Tourist Directive
                          </span>
                          <p className="text-[10px] font-semibold text-ink dark:text-cream/90 leading-tight line-clamp-2">
                            {alert.actionGuideline}
                          </p>
                        </div>
                      </motion.a>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
