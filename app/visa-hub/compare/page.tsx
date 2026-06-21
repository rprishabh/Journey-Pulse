"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Globe2,
  Award,
  TrendingUp,
  Search,
  Compass,
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Zap,
} from "lucide-react";

interface PassportData {
  rank: number;
  country: string;
  code: string;
  flag: string;
  visaFree: number;
  visaOnArrival: number;
  visaRequired: number;
  score: number; // Visa-free + VoA
  region: string;
  notes: string;
}

const PASSPORT_LEADERBOARD: PassportData[] = [
  { rank: 1, country: "Singapore", code: "SGP", flag: "🇸🇬", visaFree: 158, visaOnArrival: 37, visaRequired: 3, score: 195, region: "APAC", notes: "The world's most powerful passport with near-total global access." },
  { rank: 2, country: "Japan", code: "JPN", flag: "🇯🇵", visaFree: 156, visaOnArrival: 38, visaRequired: 4, score: 194, region: "APAC", notes: "Consistently ranked at the top; offers extensive travel privileges." },
  { rank: 3, country: "Germany", code: "DEU", flag: "🇩🇪", visaFree: 154, visaOnArrival: 39, visaRequired: 5, score: 193, region: "Europe", notes: "Strongest EU passport, providing seamless European integration." },
  { rank: 3, country: "France", code: "FRA", flag: "🇫🇷", visaFree: 154, visaOnArrival: 39, visaRequired: 5, score: 193, region: "Europe", notes: "Tied for first in Europe with excellent global mobility." },
  { rank: 4, country: "Switzerland", code: "CHE", flag: "🇨🇭", visaFree: 153, visaOnArrival: 39, visaRequired: 6, score: 192, region: "Europe", notes: "Renowned neutrality grants passport holders exceptional access." },
  { rank: 5, country: "United Kingdom", code: "GBR", flag: "🇬🇧", visaFree: 151, visaOnArrival: 39, visaRequired: 8, score: 190, region: "Europe", notes: "Maintains elite ranking post-Brexit with strong global agreements." },
  { rank: 6, country: "Australia", code: "AUS", flag: "🇦🇺", visaFree: 150, visaOnArrival: 39, visaRequired: 9, score: 189, region: "APAC", notes: "Highly respected passport across Commonwealth and beyond." },
  { rank: 7, country: "United States", code: "USA", flag: "🇺🇸", visaFree: 148, visaOnArrival: 40, visaRequired: 10, score: 188, region: "AMER", notes: "Broad global access with specific strict reciprocal requirements." },
  { rank: 7, country: "Canada", code: "CAN", flag: "🇨🇦", visaFree: 148, visaOnArrival: 40, visaRequired: 10, score: 188, region: "AMER", notes: "Matches US mobility with stable geopolitical relations." },
  { rank: 8, country: "United Arab Emirates", code: "ARE", flag: "🇦🇪", visaFree: 140, visaOnArrival: 45, visaRequired: 13, score: 185, region: "Middle East", notes: "Fastest-climbing passport in history over the past decade." },
  { rank: 9, country: "Brazil", code: "BRA", flag: "🇧🇷", visaFree: 129, visaOnArrival: 42, visaRequired: 27, score: 171, region: "AMER", notes: "Strong Latin American baseline with visa-free Schengen access." },
  { rank: 10, country: "Russia", code: "RUS", flag: "🇷🇺", visaFree: 78, visaOnArrival: 38, visaRequired: 82, score: 116, region: "Europe", notes: "Moderate visa-free access, restricted in Western jurisdictions." },
  { rank: 11, country: "South Africa", code: "ZAF", flag: "🇿🇦", visaFree: 73, visaOnArrival: 35, visaRequired: 90, score: 108, region: "Africa", notes: "One of the stronger African passports with key trading partnerships." },
  { rank: 12, country: "Maldives", code: "MDV", flag: "🇲🇻", visaFree: 62, visaOnArrival: 32, visaRequired: 104, score: 94, region: "APAC", notes: "Island nation leveraging tourism for mutual visa-free deals." },
  { rank: 13, country: "Saudi Arabia", code: "SAU", flag: "🇸🇦", visaFree: 54, visaOnArrival: 35, visaRequired: 109, score: 89, region: "Middle East", notes: "Rapidly expanding international mobility under Vision 2030." },
  { rank: 14, country: "China", code: "CHN", flag: "🇨🇳", visaFree: 48, visaOnArrival: 37, visaRequired: 113, score: 85, region: "APAC", notes: "Steadily rising score as diplomatic ties strengthen globally." },
  { rank: 15, country: "Thailand", code: "THA", flag: "🇹🇭", visaFree: 44, visaOnArrival: 38, visaRequired: 116, score: 82, region: "APAC", notes: "Recent visa exemptions boost regional and bilateral travel." },
  { rank: 16, country: "India", code: "IND", flag: "🇮🇳", visaFree: 28, visaOnArrival: 32, visaRequired: 138, score: 60, region: "APAC", notes: "Growing power with new visa-free travel privileges added recently." },
  { rank: 17, country: "Sri Lanka", code: "LKA", flag: "🇱🇰", visaFree: 18, visaOnArrival: 26, visaRequired: 154, score: 44, region: "APAC", notes: "Limited outbound power; heavily reliant on pre-arranged visas." },
  { rank: 18, country: "Nepal", code: "NPL", flag: "🇳🇵", visaFree: 12, visaOnArrival: 28, visaRequired: 158, score: 40, region: "APAC", notes: "Visa requirements apply for a vast majority of destinations." },
];

export default function PassportPowerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [compareA, setCompareA] = useState<string>("IND");
  const [compareB, setCompareB] = useState<string>("SGP");

  // Filter leaderboard
  const filteredLeaderboard = useMemo(() => {
    return PASSPORT_LEADERBOARD.filter((p) => {
      const matchesSearch =
        p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === "All" || p.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  // Find country objects for comparison
  const countryA = useMemo(() => PASSPORT_LEADERBOARD.find((p) => p.code === compareA) || PASSPORT_LEADERBOARD[15], [compareA]);
  const countryB = useMemo(() => PASSPORT_LEADERBOARD.find((p) => p.code === compareB) || PASSPORT_LEADERBOARD[0], [compareB]);

  // Regions list
  const regions = ["All", "APAC", "Europe", "AMER", "Middle East", "Africa"];

  return (
    <div className="min-h-screen bg-ink text-cream relative overflow-hidden select-none">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sunset-1/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-sunset-4/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="container-wide py-10 relative z-10 space-y-12">
        {/* Navigation Bar */}
        <div className="flex justify-start">
          <Link
            href="/visa-hub"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-sunset-1/10 hover:text-sunset-1 text-xs font-black uppercase tracking-widest border border-sunset-1/10 text-cream transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Visa Hub</span>
          </Link>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sunset-1/10 text-sunset-2 border border-sunset-1/25">
            <Award className="w-3.5 h-3.5 animate-bounce" />
            Global Mobility Intelligence
          </span>
          <h1 className="font-display font-black text-display-sm md:text-display-md leading-tight text-white">
            Passport Power <span className="text-gradient">Rank & Comparison</span>
          </h1>
          <p className="text-body-md text-surface-400">
            Compare travel freedoms, visa requirements, and destination access for any two passports side-by-side. Explore the global power leaderboard.
          </p>
        </div>

        {/* ── SECTION 1: SIDE-BY-SIDE COMPARISON WIDGET ── */}
        <section className="bg-surface-900/60 border border-sunset-1/15 p-6 md:p-8 rounded-3xl shadow-glass space-y-8">
          <div className="border-b border-white/5 pb-4 space-y-1">
            <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-sunset-1" />
              Side-by-Side Comparison Tool
            </h3>
            <p className="text-body-sm text-surface-400">
              Select two passport authorities below to evaluate their mobility differences.
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Passport A */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 block">Passport Authority A</label>
              <div className="relative">
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                  className="w-full bg-surface-950/80 border border-white/10 rounded-2xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-sunset-1 transition-all duration-200"
                >
                  {PASSPORT_LEADERBOARD.map((p) => (
                    <option key={p.code} value={p.code} className="bg-surface-950 text-white">
                      {p.flag} {p.country} ({p.code}) — Rank {p.rank}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">▼</div>
              </div>
            </div>

            {/* Passport B */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400 block">Passport Authority B</label>
              <div className="relative">
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                  className="w-full bg-surface-950/80 border border-white/10 rounded-2xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-sunset-1 transition-all duration-200"
                >
                  {PASSPORT_LEADERBOARD.map((p) => (
                    <option key={p.code} value={p.code} className="bg-surface-950 text-white">
                      {p.flag} {p.country} ({p.code}) — Rank {p.rank}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">▼</div>
              </div>
            </div>
          </div>

          {/* Comparison Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 items-stretch">
            {/* Visual Card A */}
            <div className="bg-gradient-to-br from-surface-950/60 to-surface-900/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-sunset-1/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-sunset-2 uppercase">Passport A</span>
                    <h4 className="font-display font-black text-heading-lg text-white mt-1 flex items-center gap-2">
                      <span className="text-3xl">{countryA.flag}</span>
                      {countryA.country}
                    </h4>
                  </div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-display font-bold text-xs text-white">
                    Rank {countryA.rank}
                  </span>
                </div>
                <p className="text-body-sm text-surface-400 mt-4 leading-relaxed">{countryA.notes}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Visa-Free Score:</span>
                  <span className="font-bold text-emerald-400">{countryA.visaFree} destinations</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Visa on Arrival:</span>
                  <span className="font-bold text-sunset-2">{countryA.visaOnArrival} destinations</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Pre-arranged Required:</span>
                  <span className="font-bold text-red-400">{countryA.visaRequired} countries</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Comparison Dashboard */}
            <div className="bg-surface-950/40 border border-sunset-1/10 rounded-2xl p-6 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">Mobility Delta</span>
                <h4 className="font-display font-black text-heading-md text-white">Destination Spread</h4>
              </div>

              {/* Total score comparison slider */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span>{countryA.country} ({countryA.score})</span>
                  <span>{countryB.country} ({countryB.score})</span>
                </div>
                <div className="h-3.5 bg-surface-950 rounded-full overflow-hidden flex p-0.5 border border-white/5">
                  <div
                    className="bg-sunset-1 rounded-l-full h-full transition-all duration-500"
                    style={{ width: `${(countryA.score / (countryA.score + countryB.score)) * 100}%` }}
                  />
                  <div
                    className="bg-sunset-4 rounded-r-full h-full transition-all duration-500"
                    style={{ width: `${(countryB.score / (countryA.score + countryB.score)) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-surface-400 text-center">
                  {countryA.score > countryB.score
                    ? `🇺🇳 ${countryA.country} grants access to ${countryA.score - countryB.score} more destinations than ${countryB.country}.`
                    : countryB.score > countryA.score
                    ? `🇺🇳 ${countryB.country} grants access to ${countryB.score - countryA.score} more destinations than ${countryA.country}.`
                    : `🇺🇳 Both passports grant identical global mobility access.`}
                </p>
              </div>

              {/* Detailed access bar */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 block text-center">Visa-Free Ratio</span>
                <div className="grid grid-cols-2 gap-4">
                  {/* Country A */}
                  <div className="text-center space-y-1">
                    <span className="text-xs text-surface-400">{countryA.country}</span>
                    <div className="text-heading-sm font-display font-bold text-emerald-400">
                      {Math.round((countryA.visaFree / 198) * 100)}%
                    </div>
                    <span className="text-[9px] text-surface-500">of global access</span>
                  </div>
                  {/* Country B */}
                  <div className="text-center space-y-1">
                    <span className="text-xs text-surface-400">{countryB.country}</span>
                    <div className="text-heading-sm font-display font-bold text-sunset-4">
                      {Math.round((countryB.visaFree / 198) * 100)}%
                    </div>
                    <span className="text-[9px] text-surface-500">of global access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Card B */}
            <div className="bg-gradient-to-br from-surface-950/60 to-surface-900/60 border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-sunset-4/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-sunset-4 uppercase">Passport B</span>
                    <h4 className="font-display font-black text-heading-lg text-white mt-1 flex items-center gap-2">
                      <span className="text-3xl">{countryB.flag}</span>
                      {countryB.country}
                    </h4>
                  </div>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-display font-bold text-xs text-white">
                    Rank {countryB.rank}
                  </span>
                </div>
                <p className="text-body-sm text-surface-400 mt-4 leading-relaxed">{countryB.notes}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Visa-Free Score:</span>
                  <span className="font-bold text-emerald-400">{countryB.visaFree} destinations</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Visa on Arrival:</span>
                  <span className="font-bold text-sunset-2">{countryB.visaOnArrival} destinations</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Pre-arranged Required:</span>
                  <span className="font-bold text-red-400">{countryB.visaRequired} countries</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: GLOBAL LEADERBOARD INDEX ── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sunset-2" />
                Global Passport Power Rankings
              </h3>
              <p className="text-body-sm text-surface-400">
                Live indices sorted by total visa-free and visa-on-arrival entry allowances.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Region Select */}
              <div className="flex rounded-xl bg-surface-950/60 p-1 border border-white/5">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors duration-200 ${
                      selectedRegion === region
                        ? "bg-sunset-1 text-white"
                        : "text-surface-400 hover:text-white"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search passport..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-950/60 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-surface-500 focus:outline-none focus:border-sunset-1 w-full sm:w-48 transition-all duration-200"
                />
                <Search className="w-3.5 h-3.5 text-surface-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-surface-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-surface-950/60 text-[10px] font-black uppercase tracking-widest text-surface-400">
                    <th className="py-4 px-6 text-center w-16">Rank</th>
                    <th className="py-4 px-6">Country / Passport</th>
                    <th className="py-4 px-6 text-center">Score</th>
                    <th className="py-4 px-6 text-center">Visa-Free</th>
                    <th className="py-4 px-6 text-center">Visa on Arrival</th>
                    <th className="py-4 px-6 text-center">Required</th>
                    <th className="py-4 px-6 text-right">Mobility Group</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm text-surface-300">
                  <AnimatePresence mode="popLayout">
                    {filteredLeaderboard.map((item, idx) => (
                      <motion.tr
                        key={item.code}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => {
                          if (compareA !== item.code && compareB !== item.code) {
                            setCompareB(compareA);
                            setCompareA(item.code);
                          } else if (compareA === item.code) {
                            // already selected in A
                          } else {
                            // already selected in B
                          }
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <td className="py-4 px-6 font-display font-bold text-center text-white">
                          #{item.rank}
                        </td>
                        <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{item.flag}</span>
                          <div>
                            <div className="text-white group-hover:text-sunset-1 transition-colors">{item.country}</div>
                            <div className="text-[10px] text-surface-500 uppercase tracking-widest">{item.code}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-display font-black text-sunset-2">
                          {item.score}
                        </td>
                        <td className="py-4 px-6 text-center text-emerald-400 font-medium">
                          {item.visaFree}
                        </td>
                        <td className="py-4 px-6 text-center text-sunset-3 font-medium">
                          {item.visaOnArrival}
                        </td>
                        <td className="py-4 px-6 text-center text-red-400 font-medium">
                          {item.visaRequired}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            item.score >= 180
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : item.score >= 100
                              ? "bg-sunset-4/10 text-sunset-4 border border-sunset-4/20"
                              : "bg-sunset-1/10 text-sunset-1 border border-sunset-1/20"
                          }`}>
                            {item.region}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>

                  {filteredLeaderboard.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-surface-500 text-xs">
                        No passport records matches your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
