"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  X,
  MapPin,
  Users,
  Banknote,
  Languages,
  Phone,
  Clock,
  Shield,
  Plane,
  ArrowRight,
  Globe2,
} from "lucide-react";
import type { CountryData } from "@/lib/country-data";
import { VISA_STATUS_COLORS, SAFETY_COLORS } from "@/lib/country-data";

interface CountryInfoPanelProps {
  country: CountryData | null;
  onClose: () => void;
}

function formatVisaStatus(status: string): string {
  return status
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CountryInfoPanel({ country, onClose }: CountryInfoPanelProps) {
  if (!country) return null;

  const visaColors = VISA_STATUS_COLORS[country.visaStatus] || VISA_STATUS_COLORS["visa-required"];
  const safetyConfig = SAFETY_COLORS[country.safetyLevel] || SAFETY_COLORS["moderate"];
  const flagUrl = `https://flagcdn.com/w80/${country.iso2.toLowerCase()}.png`;

  return (
    <AnimatePresence>
      {country && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-ink/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[1000] w-full max-w-md bg-gradient-to-b from-slate-900 to-ink border-l border-sunset-1/15 shadow-2xl overflow-y-auto"
          >
            {/* Header with flag */}
            <div className="relative p-6 pb-4 border-b border-white/10">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-sunset-1/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Flag */}
                  <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shadow-md">
                    <img
                      src={flagUrl}
                      alt={`${country.name} flag`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl">${country.flagEmoji}</span>`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-cream leading-tight">
                      {country.name}
                    </h3>
                    <span className="text-[10px] font-bold text-cream/50 uppercase tracking-widest">
                      {country.continent} · {country.region}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-sunset-1/30 flex items-center justify-center transition-colors hover:bg-sunset-1/10 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4 text-cream/60" />
                </button>
              </div>
            </div>

            {/* Visa & Safety Status Badges */}
            <div className="p-6 pb-0 flex gap-3 flex-wrap">
              {/* Visa Status */}
              <div className={`${visaColors.bg} ${visaColors.border} border rounded-xl px-3 py-2 flex items-center gap-2`}>
                <Plane className={`w-3.5 h-3.5 ${visaColors.text}`} />
                <div>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${visaColors.text} block leading-none`}>
                    Visa Status
                  </span>
                  <span className="text-[10px] font-bold text-cream block leading-tight mt-0.5">
                    {formatVisaStatus(country.visaStatus)}
                  </span>
                </div>
              </div>

              {/* Safety Level */}
              <div className={`${safetyConfig.bg} border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2`}>
                <Shield className={`w-3.5 h-3.5 ${safetyConfig.text}`} />
                <div>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${safetyConfig.text} block leading-none`}>
                    Safety
                  </span>
                  <span className="text-[10px] font-bold text-cream block leading-tight mt-0.5">
                    {safetyConfig.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Visa Note */}
            <div className="px-6 pt-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                <span className="text-[8px] font-bold text-sunset-2 uppercase tracking-widest block mb-1">
                  Indian Passport Holder
                </span>
                <p className="text-[11px] text-cream/80 leading-relaxed">
                  {country.visaNote}
                </p>
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="p-6 space-y-3">
              <h4 className="text-[9px] font-black uppercase text-sunset-1 tracking-widest">
                Country Details
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* Capital */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-sunset-2" />
                    <span className="text-[8px] font-bold text-cream/50 uppercase tracking-wider">Capital</span>
                  </div>
                  <span className="text-xs font-bold text-cream block">{country.capital}</span>
                </div>

                {/* Population */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-sunset-2" />
                    <span className="text-[8px] font-bold text-cream/50 uppercase tracking-wider">Population</span>
                  </div>
                  <span className="text-xs font-bold text-cream block">{country.population}</span>
                </div>

                {/* Currency */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-3 h-3 text-sunset-2" />
                    <span className="text-[8px] font-bold text-cream/50 uppercase tracking-wider">Currency</span>
                  </div>
                  <span className="text-xs font-bold text-cream block">{country.currency}</span>
                  <span className="text-[9px] text-cream/40 font-medium">{country.currencyCode}</span>
                </div>

                {/* Languages */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3 h-3 text-sunset-2" />
                    <span className="text-[8px] font-bold text-cream/50 uppercase tracking-wider">Languages</span>
                  </div>
                  <span className="text-xs font-bold text-cream block leading-tight">
                    {country.languages.slice(0, 2).join(", ")}
                  </span>
                </div>

                {/* Calling Code */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-sunset-2" />
                    <span className="text-[8px] font-bold text-cream/50 uppercase tracking-wider">Dialing</span>
                  </div>
                  <span className="text-xs font-bold text-cream block">{country.callingCode}</span>
                </div>

                {/* Timezone */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-sunset-2" />
                    <span className="text-[8px] font-bold text-cream/50 uppercase tracking-wider">Timezone</span>
                  </div>
                  <span className="text-xs font-bold text-cream block">{country.timezone}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-2 space-y-3">
              <Link
                href="/visa-hub"
                className="w-full btn btn-primary text-center text-xs flex items-center justify-center gap-2"
              >
                <Globe2 className="w-4 h-4" />
                <span>Check Full Visa Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/travel-advisories"
                className="w-full btn btn-secondary text-center text-xs flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-sunset-1" />
                <span>View Travel Advisory</span>
              </Link>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 border-t border-white/5">
              <p className="text-[9px] text-cream/30 text-center">
                Data is for reference only. Always verify visa requirements with the official embassy before travel.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
