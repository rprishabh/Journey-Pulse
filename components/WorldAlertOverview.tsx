"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wind,
  Droplets,
  Waves,
  Tornado,
  Flame,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

interface AqiCity {
  city: string;
  country: string;
  aqi: number;
  status: "GOOD" | "MODERATE" | "POOR" | "VERY_POOR" | "SEVERE";
  dashboardUrl: string;
}

interface WeatherAlert {
  id: string;
  type: "sandstorm" | "tsunami" | "cyclone" | "heavy_rainfall" | "heatwave";
  title: string;
  location: string;
  region: string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY";
  description: string;
  actionGuideline: string;
  upcomingWeekScenario: string;
  sourceUrl: string;
}

const BEST_AQI_CITIES: AqiCity[] = [
  { city: "Helsinki", country: "Finland", aqi: 12, status: "GOOD", dashboardUrl: "https://www.iqair.com/finland/helsinki" },
  { city: "Reykjavik", country: "Iceland", aqi: 15, status: "GOOD", dashboardUrl: "https://www.iqair.com/iceland/gullbringusysla/reykjavik" },
  { city: "Zurich", country: "Switzerland", aqi: 18, status: "GOOD", dashboardUrl: "https://www.iqair.com/switzerland/zurich" },
  { city: "Wellington", country: "New Zealand", aqi: 22, status: "GOOD", dashboardUrl: "https://www.iqair.com/new-zealand/wellington" },
  { city: "Honolulu", country: "United States", aqi: 25, status: "GOOD", dashboardUrl: "https://www.iqair.com/usa/hawaii/honolulu" },
];

const WORST_AQI_CITIES: AqiCity[] = [
  { city: "Lahore", country: "Pakistan", aqi: 388, status: "SEVERE", dashboardUrl: "https://www.iqair.com/pakistan/punjab/lahore" },
  { city: "Delhi", country: "India", aqi: 342, status: "SEVERE", dashboardUrl: "https://www.iqair.com/india/delhi" },
  { city: "Dhaka", country: "Bangladesh", aqi: 295, status: "VERY_POOR", dashboardUrl: "https://www.iqair.com/bangladesh/dhaka" },
  { city: "Baghdad", country: "Iraq", aqi: 210, status: "VERY_POOR", dashboardUrl: "https://www.iqair.com/iraq/baghdad" },
  { city: "Cairo", country: "Egypt", aqi: 198, status: "POOR", dashboardUrl: "https://www.iqair.com/egypt/cairo" },
];

const WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: "w-1",
    type: "heavy_rainfall",
    title: "Extreme Precipitation & Flash Flood Warning",
    location: "Mumbai & Western Ghats",
    region: "India (APAC)",
    severity: "CRITICAL",
    description: "Monsoonal low-pressure systems are triggering extreme rainfall (>220mm expected in next 24 hours). Local transit networks are facing severe logging.",
    actionGuideline: "Postpone non-essential travel; avoid low-lying coastal paths.",
    upcomingWeekScenario: "Monsoon activity to peak on June 23, tapering slightly by June 26.",
    sourceUrl: "https://mausam.imd.gov.in/"
  },
  {
    id: "w-2",
    type: "tsunami",
    title: "High Tide & Swell Wave Inundation Alert",
    location: "Fukushima Coastline & Chiba",
    region: "Japan (APAC)",
    severity: "WARNING",
    description: "Aligning full-moon orbital positions are generating high-tide swell waves up to 3.8 meters. Minor coastal overflow expected.",
    actionGuideline: "Avoid marine sports, coastal fishing, and promenade walking.",
    upcomingWeekScenario: "Tidal amplitudes to normalise gradually after June 24.",
    sourceUrl: "https://www.jma.go.jp/bosai/map.html#contents=tsunami"
  },
  {
    id: "w-3",
    type: "cyclone",
    title: "Cyclone Remal Movement Tracking",
    location: "Bay of Bengal (Cox's Bazar to Kolkata)",
    region: "India & Bangladesh",
    severity: "CRITICAL",
    description: "Deep depression has intensified into a severe cyclonic storm with wind velocities reaching 110 km/h. Sea conditions are extremely hazardous.",
    actionGuideline: "Evacuate beachfront resorts; flight delays highly expected at CCU & DAC.",
    upcomingWeekScenario: "Landfall expected near Sundarbans overnight. Severe winds continuing through June 23.",
    sourceUrl: "https://mausam.imd.gov.in/"
  },
  {
    id: "w-4",
    type: "sandstorm",
    title: "Desert Winds & Visibility Advisory",
    location: "Dubai & Abu Dhabi",
    region: "United Arab Emirates (Middle East)",
    severity: "ADVISORY",
    description: "High-speed Shamal desert winds are generating dust suspension, reducing road visibility to less than 800 meters.",
    actionGuideline: "Exercise extreme driving caution; use fog lights; wear masks outdoors.",
    upcomingWeekScenario: "Winds expected to subside by tomorrow evening as pressure stabilizes.",
    sourceUrl: "https://ncm.ae/"
  },
  {
    id: "w-5",
    type: "heatwave",
    title: "Severe Midday Heat Warning",
    location: "Riyadh & Central Provinces",
    region: "Saudi Arabia (Middle East)",
    severity: "WARNING",
    description: "Ambient dry temperatures rising to a peak of 48.2°C during noon hours. High ultraviolet index risk.",
    actionGuideline: "Stay hydrated; avoid outdoor activities between 11:00 AM and 4:00 PM.",
    upcomingWeekScenario: "Dry heat ridge persisting across the Arabian peninsula for the next 7 days.",
    sourceUrl: "https://ncm.gov.sa/"
  }
];

const ALERT_ICONS = {
  sandstorm: Wind,
  tsunami: Waves,
  cyclone: Tornado,
  heavy_rainfall: Droplets,
  heatwave: Sun,
};

export function WorldAlertOverview() {
  const [activeTab, setActiveTab] = useState<"weather" | "aqi">("weather");

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
              Global Travel Alerts & <span className="text-gradient">Atmospheric Standings</span>
            </h2>
            <p className="text-body-sm text-ink/70 dark:text-cream/70">
              Live updates on extreme weather anomalies, tidal alerts, and international air quality indexes.
            </p>
          </div>

          {/* Tab Selection buttons */}
          <div className="inline-flex p-1 bg-ink/30 dark:bg-ink/50 backdrop-blur-md rounded-xl border border-white/5 self-start">
            <button
              onClick={() => setActiveTab("weather")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === "weather"
                  ? "bg-gradient-to-r from-sunset-1 to-sunset-2 text-white shadow-md"
                  : "text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Extreme Weather (5)</span>
            </button>
            <button
              onClick={() => setActiveTab("aqi")}
              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === "aqi"
                  ? "bg-gradient-to-r from-sunset-3 to-sunset-4 text-white shadow-md"
                  : "text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream"
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Global AQI Ranking</span>
            </button>
          </div>
        </div>

        {/* Tab content panel */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === "weather" ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-4"
              >
                {WEATHER_ALERTS.map((alert, idx) => {
                  const Icon = ALERT_ICONS[alert.type];
                  const isCritical = alert.severity === "CRITICAL";
                  const isWarning = alert.severity === "WARNING";

                  return (
                    <a
                      key={alert.id}
                      href={alert.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-5 rounded-2xl border flex flex-col justify-between h-[280px] transition-all duration-300 hover:scale-102 hover:shadow-lg cursor-pointer block text-left ${
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

                        {/* Description Block */}
                        <div className="space-y-1 text-left">
                          <span className="text-[9px] uppercase font-bold text-sunset-2 block">
                            {alert.location}
                          </span>
                          <h4 className="font-display font-extrabold text-xs text-ink dark:text-cream leading-snug line-clamp-1">
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
                        <p className="text-[10px] font-semibold text-ink dark:text-cream/90 leading-tight truncate">
                          {alert.actionGuideline}
                        </p>
                        <span className="text-[9px] text-ink/50 dark:text-cream/50 italic leading-none block truncate">
                          Outlook: {alert.upcomingWeekScenario}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="aqi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* 5 Worst Cities */}
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

                  <div className="space-y-2">
                    {WORST_AQI_CITIES.map((c, i) => (
                      <a
                        key={c.city}
                        href={c.dashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all duration-300 cursor-pointer block"
                      >
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
                          <span className="badge bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] px-2 py-0.5 flex items-center gap-1">
                            {c.status.replace("_", " ")}
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </span>
                          <span className="font-display font-black text-sm text-red-500">
                            {c.aqi}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 5 Best Cities */}
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

                  <div className="space-y-2">
                    {BEST_AQI_CITIES.map((c, i) => (
                      <a
                        key={c.city}
                        href={c.dashboardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 rounded-xl transition-all duration-300 cursor-pointer block"
                      >
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
                          <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] px-2 py-0.5 flex items-center gap-1">
                            {c.status}
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </span>
                          <span className="font-display font-black text-sm text-emerald-400">
                            {c.aqi}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
