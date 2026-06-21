"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CreditCard,
  Percent,
  Lock,
  Globe2,
  HelpCircle,
  Sparkles,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

interface RateMap {
  [key: string]: { rate: number; symbol: string; fullName: string; flag: string };
}

const RATES: RateMap = {
  USD: { rate: 0.012, symbol: "$", fullName: "United States Dollar", flag: "🇺🇸" },
  EUR: { rate: 0.011, symbol: "€", fullName: "Euro", flag: "🇪🇺" },
  GBP: { rate: 0.0094, symbol: "£", fullName: "British Pound", flag: "🇬🇧" },
  AED: { rate: 0.044, symbol: "د.إ", fullName: "UAE Dirham", flag: "🇦🇪" },
  SGD: { rate: 0.016, symbol: "S$", fullName: "Singapore Dollar", flag: "🇸🇬" },
};

export default function ForexPage() {
  const [inrAmount, setInrAmount] = useState<string>("50000");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const activeCurrency = RATES[selectedCurrency];

  const convertedAmount = React.useMemo(() => {
    const val = parseFloat(inrAmount);
    if (isNaN(val) || val <= 0) return "0.00";
    return (val * activeCurrency.rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [inrAmount, selectedCurrency]);

  return (
    <div className="min-h-screen bg-ink text-cream relative overflow-hidden select-none">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sunset-1/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-sunset-2/5 rounded-full blur-[100px] pointer-events-none" />

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

        {/* Hero Headings */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sunset-1/10 text-sunset-2 border border-sunset-1/25">
            <CreditCard className="w-3.5 h-3.5" />
            Zero-markup Global Card
          </span>
          <h1 className="font-display font-black text-display-sm md:text-display-md leading-tight text-white">
            JourneyPulse <span className="text-gradient">Multi-Currency Card</span>
          </h1>
          <p className="text-body-md text-surface-400">
            One physical card. Unlimited travel freedom. Hold 15+ currencies, spend anywhere globally with zero markup fee, and manage exchange rates on the fly.
          </p>
        </div>

        {/* ── CARD GRAPHIC AND CONVERTER SPLIT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 3D interactive mock card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">Card Preview</span>

            {/* Glassmorphic Visa Card container */}
            <div className="w-[340px] h-[215px] rounded-3xl p-6 bg-gradient-to-br from-surface-950/90 via-surface-900/60 to-surface-950/80 border border-white/10 shadow-glow relative overflow-hidden group hover:border-sunset-1/50 transition-all duration-500 cursor-pointer">
              {/* Card gloss reflecting lines */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-sunset-1/10 rounded-full blur-xl group-hover:bg-sunset-1/20 transition-all duration-500" />
              
              {/* Chip and logo */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-sunset-2 uppercase font-display">JourneyPulse</span>
                  <div className="text-[8px] text-surface-400 uppercase tracking-widest font-medium">Global Pay</div>
                </div>
                {/* Chip Icon Graphic */}
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-500/80 p-1 flex flex-col justify-between border border-amber-300">
                  <div className="grid grid-cols-3 gap-0.5 w-full h-1 bg-ink/20 rounded-sm" />
                  <div className="grid grid-cols-3 gap-0.5 w-full h-1.5 bg-ink/20 rounded-sm" />
                </div>
              </div>

              {/* NFC Sign */}
              <div className="mt-4 text-white text-xs opacity-50 flex items-center gap-1">
                <span>⚡</span>
                <span className="text-[8px] font-bold uppercase tracking-widest">NFC Enabled</span>
              </div>

              {/* Card number / details */}
              <div className="mt-8 space-y-4">
                <div className="font-mono text-base tracking-widest text-white/90">
                  ••••  ••••  ••••  8829
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[7px] text-surface-500 uppercase tracking-widest font-bold">Card Holder</div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">Premium Traveler</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[7px] text-surface-500 uppercase tracking-widest font-bold">Valid Thru</div>
                      <div className="text-[9px] font-bold text-white">09 / 30</div>
                    </div>
                    {/* VISA Graphic */}
                    <div className="italic font-black text-sm text-white/80 select-none">
                      VISA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-surface-500 text-center italic max-w-xs">
              Zero transaction markup. Zero annual fees. Applied directly through your JourneyPulse dashboard.
            </p>
          </div>

          {/* Right: Conversion Widget */}
          <div className="lg:col-span-7 bg-surface-900/60 border border-sunset-1/15 p-6 md:p-8 rounded-3xl shadow-glass space-y-6">
            <div className="border-b border-white/5 pb-4 space-y-1">
              <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-sunset-1 animate-spin-slow" />
                Instant Rate Estimator
              </h3>
              <p className="text-body-sm text-surface-400">
                Check conversion output using our live interbank rates with 0% markup.
              </p>
            </div>

            <div className="space-y-4">
              {/* INR Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400">Amount (INR)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={inrAmount}
                    onChange={(e) => setInrAmount(e.target.value)}
                    className="w-full bg-surface-950/80 border border-white/10 rounded-2xl px-4 py-3 text-white text-base focus:outline-none focus:border-sunset-1 transition-all duration-200 font-bold"
                    placeholder="Enter Indian Rupees..."
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-surface-400">
                    INR (₹)
                  </div>
                </div>
              </div>

              {/* Destination Currency Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-surface-400">Target Currency</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(RATES).map((cc) => (
                    <button
                      key={cc}
                      onClick={() => setSelectedCurrency(cc)}
                      className={`py-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                        selectedCurrency === cc
                          ? "bg-sunset-1 border-sunset-1 text-white shadow-glow"
                          : "bg-surface-950/60 border-white/5 text-surface-400 hover:border-white/15"
                      }`}
                    >
                      <span className="text-lg">{RATES[cc].flag}</span>
                      <span className="text-xs font-bold font-display">{cc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversion Result Block */}
              <div className="bg-surface-950/60 border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-surface-500 block">Estimated Output</span>
                  <div className="font-display font-black text-2xl text-white mt-1 flex items-center gap-1">
                    <span className="text-sunset-2">{activeCurrency.symbol}</span>
                    {convertedAmount}
                  </div>
                  <span className="text-[10px] text-surface-400 mt-1 block">
                    {activeCurrency.fullName} ({selectedCurrency})
                  </span>
                </div>

                <div className="text-xs text-right sm:border-l border-white/5 sm:pl-6 space-y-1.5">
                  <div>
                    <span className="text-surface-500 block text-[9px] font-bold uppercase">Rate Index</span>
                    <span className="font-semibold text-white">1 INR = {activeCurrency.rate} {selectedCurrency}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block text-[9px] font-bold uppercase">Markup Fee</span>
                    <span className="font-black text-emerald-400">0.00% (Zero)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CORE CARD ADVANTAGES ── */}
        <section className="space-y-6">
          <div className="border-b border-white/5 pb-4 space-y-1">
            <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sunset-2" />
              Card Specifications & Travel Privileges
            </h3>
            <p className="text-body-sm text-surface-400">
              Advanced card capabilities designed for international luxury travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface-900/40 border border-white/5 rounded-2xl p-5 space-y-3">
              <Percent className="w-8 h-8 text-sunset-1" />
              <h4 className="font-display font-bold text-sm text-white">Guaranteed Zero Markup</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Standard credit cards charge up to 3.5% foreign transaction markup. Airport exchange counters mark up rates by 5% to 8%. We offer pure interbank rates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-900/40 border border-white/5 rounded-2xl p-5 space-y-3">
              <Lock className="w-8 h-8 text-sunset-2" />
              <h4 className="font-display font-bold text-sm text-white">Enterprise security locks</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Misplaced your card in a foreign taxi? Freeze it instantly in our dashboard app. Toggle ATM withdrawals, online transactions, and contact-less pay.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-900/40 border border-white/5 rounded-2xl p-5 space-y-3">
              <Globe2 className="w-8 h-8 text-sunset-4" />
              <h4 className="font-display font-bold text-sm text-white">Global ATM Privileges</h4>
              <p className="text-xs text-surface-400 leading-relaxed">
                Withdraw physical cash in local currencies at any Visa-accepting ATM worldwide. No foreign ATM fee for the first 3 monthly transactions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
