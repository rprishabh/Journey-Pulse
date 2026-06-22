"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Sparkles, RefreshCw, Landmark, Eye, Heart } from "lucide-react";

interface FactData {
  id: string;
  title: string;
  fact: string;
  detailedFact: string | null;
  category: string;
  region: string | null;
  state: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  funEmoji: string | null;
}

// Map keywords/categories to stunning travel/heritage high-res Unsplash photography
function getUnsplashImage(title: string, category: string): string {
  const t = (title || "").toLowerCase();
  const cat = (category || "").toLowerCase();
  
  if (t.includes("taj mahal")) return "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("hampi")) return "https://images.unsplash.com/photo-1600100397608-f010f423b971?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("ajanta")) return "https://images.unsplash.com/photo-1608958416755-e4062635d971?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("root bridge") || t.includes("meghalaya") || t.includes("root")) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("konark") || t.includes("sun temple")) return "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("tiger") || t.includes("lion") || t.includes("rhin") || cat === "wildlife") return "https://images.unsplash.com/photo-1615959189197-48400fc7af2b?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("varanasi") || t.includes("spiritual") || t.includes("kashi")) return "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("spice") || cat === "cuisine" || t.includes("kitchen") || t.includes("langar")) return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("golden temple") || t.includes("amritsar")) return "https://images.unsplash.com/photo-1588598130834-585ee5888e28?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("desert") || t.includes("thar") || t.includes("jaipur") || t.includes("rajasthan") || t.includes("baori")) return "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("umling la") || t.includes("ladakh") || t.includes("pass")) return "https://images.unsplash.com/photo-1596890333215-64d852a32eb2?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("valley of flowers") || t.includes("himalaya") || t.includes("uttarakhand")) return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("mysore")) return "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("bodh gaya") || t.includes("nalanda")) return "https://images.unsplash.com/photo-1609137144813-2d6ec67e4521?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("kerala") || t.includes("backwater") || t.includes("houseboat")) return "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("railways") || t.includes("train")) return "https://images.unsplash.com/photo-1574790298283-8a0b0d30ea51?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("andaman") || t.includes("havelock") || t.includes("beach")) return "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80";
  
  return "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80";
}

// Coordinates map for main states to add visual design realism
const STATE_COORDINATES: Record<string, string> = {
  "Uttar Pradesh": "26.8467° N, 80.9462° E",
  "Karnataka": "15.3173° N, 75.7139° E",
  "Maharashtra": "19.7515° N, 75.7139° E",
  "Meghalaya": "25.4670° N, 91.3662° E",
  "Odisha": "20.9517° N, 85.0985° E",
  "Madhya Pradesh": "22.9734° N, 78.6569° E",
  "Gujarat": "22.2587° N, 71.1924° E",
  "Assam": "26.2006° N, 92.9376° E",
  "Kerala": "10.8505° N, 76.2711° E",
  "Punjab": "31.1471° N, 75.3412° E",
  "Rajasthan": "27.0238° N, 74.2179° E",
  "Ladakh": "34.1526° N, 77.5771° E",
  "Uttarakhand": "30.0668° N, 79.0193° E",
  "Bihar": "25.0961° N, 85.3131° E",
  "Andaman & Nicobar Islands": "11.7401° N, 92.6586° E",
};

export function TodayFactCard() {
  const [fact, setFact] = useState<FactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
    setDateLabel(formatted);

    async function fetchDailyFact() {
      try {
        const res = await fetch("/api/daily-fact");
        const json = await res.json();
        if (json.success && json.data) {
          setFact(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch daily fact:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDailyFact();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto aspect-[9/16] rounded-3xl bg-ink/40 border border-white/10 flex items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-4 text-center">
          <RefreshCw className="w-8 h-8 text-sunset-1 animate-spin" />
          <span className="text-xs font-bold text-surface-450 uppercase tracking-widest">Sealing Postcard...</span>
        </div>
      </div>
    );
  }

  if (!fact) return null;

  const bgImage = getUnsplashImage(fact.title, fact.category);
  const coords = fact.state ? STATE_COORDINATES[fact.state] || "20.5937° N, 78.9629° E" : "20.5937° N, 78.9629° E";

  return (
    <div className="w-full max-w-[390px] mx-auto aspect-[9/16] relative perspective select-none">
      <motion.div
        className="w-full h-full relative cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ y: -8, scale: 1.01 }}
      >
        
        {/* ==================== POSTCARD FRONT SIDE ==================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border-[10px] border-double border-white/20 shadow-glass-xl flex flex-col justify-between p-7 text-white"
          style={{ 
            backfaceVisibility: "hidden",
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Top Dark/Vibrant Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/65 z-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-sunset-3/15 via-transparent to-sunset-1/10 z-0 mix-blend-overlay" />

          {/* Header Rows */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-sunset-1 text-white shadow-glow-brand">
                <Sparkles className="w-3 h-3 animate-pulse" />
                {fact.category}
              </span>
              <div className="text-[8px] font-mono text-white/50 tracking-wider">
                COORDS: {coords}
              </div>
            </div>

            {/* Premium Postcard Stamp */}
            <div className="w-16 h-20 bg-cream/90 backdrop-blur-md rounded-lg border-2 border-dashed border-sunset-2/40 flex flex-col justify-between p-2 text-center relative rotate-6 shadow-lg text-ink">
              <span className="text-[7px] font-black uppercase tracking-widest text-sunset-1">Dispatch</span>
              <div className="w-8 h-8 rounded-full border border-sunset-2 mx-auto flex items-center justify-center text-xs select-none">
                {fact.funEmoji || "🇮🇳"}
              </div>
              <span className="text-[8px] font-black text-sunset-3 tracking-tighter">Rs. 5.00</span>
              {/* Postmark wavy overlay lines */}
              <div className="absolute inset-0 bg-transparent flex flex-col justify-around pointer-events-none opacity-30">
                <div className="h-[1px] w-full bg-slate-900 -rotate-12" />
                <div className="h-[1px] w-full bg-slate-900 -rotate-12" />
                <div className="h-[1px] w-full bg-slate-900 -rotate-12" />
              </div>
            </div>
          </div>

          {/* Middle Decorative Layout */}
          <div className="relative z-10 flex flex-col items-center justify-center grow">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center opacity-40 mb-4 animate-spin-slow">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Bottom Title & Meta details */}
          <div className="relative z-10 space-y-6">
            <div className="space-y-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-sunset-2 bg-sunset-2/10 px-2 py-0.5 rounded border border-sunset-2/20">
                Story N° {fact.id.substring(fact.id.length - 4).toUpperCase()}
              </span>
              
              <h3 className="font-display font-black text-2xl md:text-[1.75rem] leading-tight text-white tracking-tight uppercase select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                {fact.title}
              </h3>

              <p className="text-[13px] text-white/80 leading-relaxed font-medium line-clamp-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {fact.fact}
              </p>
            </div>

            {/* Footer Row */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10 text-[10px] font-bold text-white/85 uppercase tracking-wider">
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-sunset-2" />
                {dateLabel}
              </span>
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-sunset-1" />
                {fact.state || fact.region || "Incredible India"}
              </span>
            </div>

            {/* Flip Hint */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-sunset-2 bg-black/40 backdrop-blur-sm p-2 rounded-2xl border border-white/5 animate-pulse text-center">
              <Eye className="w-3 h-3" />
              <span>Tap to Flip Card</span>
            </div>
          </div>
        </div>

        {/* ==================== POSTCARD BACK SIDE ==================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-[2.5rem] p-7 bg-[#fbf6ef] border-[10px] border-double border-sunset-1/25 shadow-glass-xl flex flex-col justify-between text-ink"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* airmail stamp accent */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-600 via-white to-blue-600 opacity-60" />

          {/* Postcard Header */}
          <div className="flex justify-between items-center border-b border-sunset-1/20 pb-4">
            <div>
              <span className="text-[11px] font-black uppercase text-sunset-1 tracking-widest block leading-none">The Daily Dispatch</span>
              <span className="text-[7px] font-mono text-ink/40 tracking-wider">JOURNEYPULSE TRAVEL GAZETTE</span>
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-sunset-2 px-2.5 py-0.5 bg-sunset-2/10 rounded">
              {fact.state || "India"}
            </div>
          </div>

          {/* Vertical split layout */}
          <div className="flex h-full gap-5 items-stretch py-5 overflow-hidden">
            
            {/* Left side: Detailed story block */}
            <div className="flex-1 space-y-3.5 pr-4 border-r border-dashed border-sunset-1/25 flex flex-col justify-center overflow-y-auto no-scrollbar">
              <div className="space-y-1">
                <span className="text-[8px] uppercase font-bold text-sunset-3 tracking-widest block">In-Depth Historical Record</span>
                <h4 className="font-display font-bold text-[13px] text-ink leading-tight">
                  {fact.title}
                </h4>
              </div>
              <p className="text-[11px] font-semibold leading-relaxed italic text-ink/80 font-sans border-l-2 border-sunset-2 pl-2">
                &ldquo;{fact.detailedFact || fact.fact}&rdquo;
              </p>
            </div>

            {/* Right side: Mock address lines & details */}
            <div className="w-[35%] flex flex-col justify-between py-2 shrink-0">
              {/* Fake postmark stamp */}
              <div className="border border-sunset-1/30 rounded p-2 text-center rotate-3 space-y-1 shadow bg-[#ebd9c1]/20">
                <span className="text-[6px] font-extrabold uppercase text-sunset-3 block tracking-tighter">Verified</span>
                <span className="text-[7px] font-black text-sunset-1 block tracking-wider">MUSEUM ARCHIVE</span>
                <span className="text-[6px] font-mono text-ink/40 block">2026.06.23</span>
              </div>

              {/* Address Lines */}
              <div className="space-y-3">
                <div className="h-[1px] w-full bg-sunset-1/25" />
                <div className="h-[1px] w-full bg-sunset-1/25" />
                <div className="h-[1px] w-full bg-sunset-1/25" />
                <div className="h-[1px] w-full bg-sunset-1/25" />
              </div>

              {/* Recipient */}
              <div className="text-center pt-2">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-sunset-2 block">
                  To: The Explorer
                </span>
                <span className="text-[6px] font-mono text-ink/30 block mt-0.5">
                  STORY-NO-{fact.id.substring(fact.id.length - 6).toUpperCase()}
                </span>
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-sunset-1/10 flex items-center justify-between">
            <span className="text-[7px] font-mono text-ink/40">
              © 2026 JourneyPulse India
            </span>
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-sunset-1">
              <span>Tap to Flip Back</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
