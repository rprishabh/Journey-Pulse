"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Wifi,
  Smartphone,
  Check,
  X,
  Zap,
  Globe2,
  DollarSign,
  TrendingUp,
  Cpu,
  Compass,
} from "lucide-react";

interface DeviceCompatibility {
  brand: string;
  models: { name: string; compatible: boolean; note?: string }[];
}

const DEVICE_BRANDS: DeviceCompatibility[] = [
  {
    brand: "Apple",
    models: [
      { name: "iPhone 15, 15 Plus, 15 Pro, 15 Pro Max", compatible: true, note: "Supports multiple eSIM profiles." },
      { name: "iPhone 14, 14 Plus, 14 Pro, 14 Pro Max", compatible: true, note: "US models are eSIM-only (no physical SIM tray)." },
      { name: "iPhone 13, 13 Mini, 13 Pro, 13 Pro Max", compatible: true },
      { name: "iPhone 12, 12 Mini, 12 Pro, 12 Pro Max", compatible: true },
      { name: "iPhone 11, 11 Pro, 11 Pro Max", compatible: true },
      { name: "iPhone XS, XS Max, XR", compatible: true, note: "First iPhone generation to support eSIM." },
      { name: "iPhone X and older", compatible: false, note: "Hardware does not support eSIM chipsets." },
      { name: "iPhone SE (2020 & 2022)", compatible: true },
    ],
  },
  {
    brand: "Samsung",
    models: [
      { name: "Galaxy S24, S24+, S24 Ultra", compatible: true },
      { name: "Galaxy S23, S23+, S23 Ultra, S23 FE", compatible: true },
      { name: "Galaxy S22, S22+, S22 Ultra", compatible: true },
      { name: "Galaxy S21, S21+, S21 Ultra", compatible: true, note: "S21 FE is NOT eSIM compatible." },
      { name: "Galaxy S20, S20+, S20 Ultra", compatible: true },
      { name: "Galaxy Z Fold5, Z Flip5, Z Fold4, Z Flip4", compatible: true },
      { name: "Galaxy Note 20, Note 20 Ultra", compatible: true },
      { name: "Galaxy S10/Note 10 and older", compatible: false },
    ],
  },
  {
    brand: "Google Pixel",
    models: [
      { name: "Pixel 8, 8 Pro, 8a", compatible: true },
      { name: "Pixel 7, 7 Pro, 7a", compatible: true },
      { name: "Pixel 6, 6 Pro, 6a", compatible: true },
      { name: "Pixel 5, 5a", compatible: true },
      { name: "Pixel 4, 4 XL, 4a, 4a 5G", compatible: true },
      { name: "Pixel 3, 3 XL, 3a, 3a XL", compatible: true, note: "Select regional carrier limitations apply." },
      { name: "Pixel 2 and older", compatible: false },
    ],
  },
];

interface ProviderInfo {
  name: string;
  type: "eSIM" | "Physical SIM";
  costRating: "Low" | "Medium" | "High";
  convenienceRating: "Excellent" | "Good" | "Poor";
  bestFor: string;
  coverage: string;
  setupTime: string;
  pros: string[];
}

const PROVIDERS: ProviderInfo[] = [
  {
    name: "Airalo",
    type: "eSIM",
    costRating: "Medium",
    convenienceRating: "Excellent",
    bestFor: "Multi-country regional trips & convenience",
    coverage: "200+ countries with local LTE/5G partners",
    setupTime: "Instant QR code scanning (5 mins)",
    pros: ["Purchase in app before travel", "Top-up data on the fly", "No plastic waste"],
  },
  {
    name: "Holafly",
    type: "eSIM",
    costRating: "High",
    convenienceRating: "Excellent",
    bestFor: "Unlimited data heavy users",
    coverage: "160+ countries (mostly unlimited plans)",
    setupTime: "Instant digital activation (5 mins)",
    pros: ["Unlimited data options", "24/7 WhatsApp customer support", "Includes local calling in select destinations"],
  },
  {
    name: "Nomad",
    type: "eSIM",
    costRating: "Low",
    convenienceRating: "Good",
    bestFor: "Budget-conscious data travelers",
    coverage: "110+ countries",
    setupTime: "In-app automated install (10 mins)",
    pros: ["Very competitive short-term prices", "Clean UI dashboard", "SMS packages available for select countries"],
  },
  {
    name: "Local Physical SIM (Airtel/Jio/Vodafone)",
    type: "Physical SIM",
    costRating: "Low",
    convenienceRating: "Poor",
    bestFor: "Local rates, high speed, and OTP receiving",
    coverage: "India-wide & selected international roaming packs",
    setupTime: "Store visit & passport verifications (2-24 hours)",
    pros: ["Cheapest local rates", "Includes native local phone number", "No digital installation hiccups"],
  },
];

export default function ConnectivityPage() {
  const [selectedBrand, setSelectedBrand] = useState("Apple");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [compatibilityResult, setCompatibilityResult] = useState<{
    searched: boolean;
    compatible: boolean;
    name: string;
    note?: string;
  } | null>(null);

  const activeBrandData = DEVICE_BRANDS.find((b) => b.brand === selectedBrand);

  const handleCheckModel = (modelName: string) => {
    const model = activeBrandData?.models.find((m) => m.name === modelName);
    if (model) {
      setCompatibilityResult({
        searched: true,
        compatible: model.compatible,
        name: model.name,
        note: model.note,
      });
    }
  };

  return (
    <div className="min-h-screen bg-ink text-cream relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sunset-4/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-sunset-1/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="container-wide py-10 relative z-10 space-y-12">
        {/* Navigation */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-sunset-1/10 hover:text-sunset-1 text-xs font-black uppercase tracking-widest border border-sunset-1/10 text-cream transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sunset-4/10 text-sunset-4 border border-sunset-4/25">
            <Wifi className="w-3.5 h-3.5 animate-pulse" />
            Global Travel Connectivity
          </span>
          <h1 className="font-display font-black text-display-sm md:text-display-md leading-tight text-white">
            eSIM & Cellular <span className="text-gradient">Connectivity Guide</span>
          </h1>
          <p className="text-body-md text-surface-400">
            Skip expensive airport SIM lines. Check if your phone supports digital eSIM chips, compare global roaming providers, and connect instantly upon landing.
          </p>
        </div>

        {/* ── INTERACTIVE COMPATIBILITY WIDGET ── */}
        <section className="bg-surface-900/60 border border-sunset-1/15 p-6 md:p-8 rounded-3xl shadow-glass grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sunset-2" />
                eSIM Compatibility Checker
              </h3>
              <p className="text-body-sm text-surface-400">
                Select your device brand and model to verify hardware compatibility.
              </p>
            </div>

            {/* Brand tabs */}
            <div className="flex gap-2 p-1 bg-surface-950/60 rounded-xl border border-white/5 max-w-md">
              {DEVICE_BRANDS.map((b) => (
                <button
                  key={b.brand}
                  onClick={() => {
                    setSelectedBrand(b.brand);
                    setSelectedModel("");
                    setCompatibilityResult(null);
                  }}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors duration-200 ${
                    selectedBrand === b.brand
                      ? "bg-sunset-4 text-white"
                      : "text-surface-400 hover:text-white"
                  }`}
                >
                  {b.brand}
                </button>
              ))}
            </div>

            {/* Models Dropdown */}
            <div className="space-y-2 max-w-md">
              <label className="text-[10px] font-black uppercase tracking-widest text-surface-400">Select Model Group</label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    handleCheckModel(e.target.value);
                  }}
                  className="w-full bg-surface-950/80 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-sunset-4 transition-all duration-200"
                >
                  <option value="" disabled>-- Select Model --</option>
                  {activeBrandData?.models.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">▼</div>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 bg-surface-950/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4 min-h-[220px]">
            {compatibilityResult ? (
              <div className="space-y-4 animate-scale-in">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center border">
                  {compatibilityResult.compatible ? (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Check className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                      <X className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-display font-bold text-white text-base">{compatibilityResult.name}</h4>
                  <p className={`text-xs mt-1 font-semibold ${compatibilityResult.compatible ? "text-emerald-400" : "text-red-400"}`}>
                    {compatibilityResult.compatible ? "eSIM Fully Supported" : "eSIM Not Supported"}
                  </p>
                </div>

                {compatibilityResult.note && (
                  <p className="text-[11px] text-surface-400 max-w-xs leading-relaxed italic bg-white/5 p-2.5 rounded-lg border border-white/5">
                    Note: {compatibilityResult.note}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-surface-500">
                <Cpu className="w-10 h-10 mx-auto opacity-50 animate-pulse text-sunset-4" />
                <p className="text-xs">Choose a model to check instant hardware capabilities.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── eSIM VS PHYSICAL SIM COMPASS WIDGET ── */}
        <section className="space-y-6">
          <div className="border-b border-white/5 pb-4 space-y-1">
            <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-sunset-4" />
              eSIM vs. Local Physical SIM Comparison
            </h3>
            <p className="text-body-sm text-surface-400">
              Evaluate the tradeoffs between immediate setup and cost efficiencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* eSIM Option Card */}
            <div className="bg-gradient-to-br from-surface-900/60 to-surface-950/60 border border-sunset-4/15 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-sunset-4/10 text-sunset-4 border border-sunset-4/20 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Digital eSIM
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Convenience Champion</span>
              </div>
              <h4 className="font-display font-black text-heading-md text-white">Carrier eSIM Profile</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Activated entirely online before you even step on a plane. Virtual eSIM chips download straight over Wi-Fi, allowing you to use dual-SIM lines (home SIM active for OTPs + travel eSIM active for cheap data).
              </p>
              <ul className="space-y-2 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2 text-xs text-surface-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  No risk of losing your primary physical card
                </li>
                <li className="flex items-center gap-2 text-xs text-surface-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Connect instantly to networks the second you land
                </li>
                <li className="flex items-center gap-2 text-xs text-surface-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Multi-profile capability for multiple country transits
                </li>
              </ul>
            </div>

            {/* Local SIM Card */}
            <div className="bg-gradient-to-br from-surface-900/60 to-surface-950/60 border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-white/5 text-surface-400 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Physical SIM
                </span>
                <span className="text-[10px] text-sunset-2 font-bold">Lowest Cost Rates</span>
              </div>
              <h4 className="font-display font-black text-heading-md text-white">Local Retail Shop SIM</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Requires visiting an official brick-and-mortar retail kiosk inside airports or city squares, presenting a passport, completing documentation scans, and waiting several hours for server-side manual activation.
              </p>
              <ul className="space-y-2 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2 text-xs text-surface-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Unmatched local data rates and calling tariffs
                </li>
                <li className="flex items-center gap-2 text-xs text-surface-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  Comes with a real local phone number for inbound calls
                </li>
                <li className="flex items-center gap-2 text-xs text-surface-300">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  Inconvenient airport wait times & queue delays
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── PROVIDER MATRIX SECTION ── */}
        <section className="space-y-6">
          <div className="border-b border-white/5 pb-4 space-y-1">
            <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-sunset-2" />
              Provider Capabilities Matrix
            </h3>
            <p className="text-body-sm text-surface-400">
              Detailed metrics for top connectivity services and networks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {PROVIDERS.map((prov) => (
              <div
                key={prov.name}
                className="bg-surface-900/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-sunset-4/30 transition-colors duration-300"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{prov.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      prov.type === "eSIM" ? "bg-sunset-4/10 text-sunset-4" : "bg-white/5 text-surface-400"
                    }`}>
                      {prov.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/5">
                    <div>
                      <span className="text-surface-500 block">Cost Rating</span>
                      <span className="font-semibold text-white">{prov.costRating}</span>
                    </div>
                    <div>
                      <span className="text-surface-500 block">Convenience</span>
                      <span className="font-semibold text-white">{prov.convenienceRating}</span>
                    </div>
                  </div>

                  <div className="text-xs pt-2">
                    <span className="text-[10px] text-surface-500 block">Best For:</span>
                    <p className="text-surface-300 font-medium">{prov.bestFor}</p>
                  </div>

                  <div className="text-xs">
                    <span className="text-[10px] text-surface-500 block">Activation Speed:</span>
                    <p className="text-surface-300 font-medium">{prov.setupTime}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/5">
                  {prov.pros.map((pro, index) => (
                    <div key={index} className="flex items-start gap-1.5 text-[10px] text-surface-400">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
