"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Calendar, Sparkles, RefreshCw, Landmark, Eye, Share2 } from "lucide-react";

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

// Map keywords/categories to stunning travel/heritage high-res Unsplash photography for texturing
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
  if (t.includes("mysore") || t.includes("gumbaz")) return "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("bodh gaya") || t.includes("nalanda")) return "https://images.unsplash.com/photo-1609137144813-2d6ec67e4521?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("kerala") || t.includes("backwater") || t.includes("houseboat")) return "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80";
  if (t.includes("altitude") || t.includes("mountain") || t.includes("peak") || cat === "geography") return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
  
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
  "Manipur": "24.6637° N, 93.9063° E",
  "Pan India": "20.5937° N, 78.9629° E",
};

// Shifting category glow/accent styles
function getCategoryAccent(category: string): { gradient: string; glow: string; accent: string } {
  const cat = (category || "").toUpperCase();
  if (cat === "CUISINE") return { gradient: "from-orange-600 via-red-500 to-amber-500", glow: "shadow-[0_0_80px_30px_rgba(249,115,22,0.25)]", accent: "#f97316" };
  if (cat === "HISTORY" || cat === "HERITAGE") return { gradient: "from-indigo-600 via-purple-500 to-violet-500", glow: "shadow-[0_0_80px_30px_rgba(99,102,241,0.25)]", accent: "#6366f1" };
  if (cat === "WILDLIFE" || cat === "NATURE") return { gradient: "from-emerald-600 via-teal-500 to-green-500", glow: "shadow-[0_0_80px_30px_rgba(16,185,129,0.25)]", accent: "#10b981" };
  if (cat === "GEOGRAPHY" || cat === "ADVENTURE") return { gradient: "from-cyan-600 via-blue-500 to-sky-500", glow: "shadow-[0_0_80px_30px_rgba(6,182,212,0.25)]", accent: "#06b6d4" };
  return { gradient: "from-sunset-1 via-sunset-2 to-sunset-3", glow: "shadow-[0_0_80px_30px_rgba(245,158,11,0.25)]", accent: "#f59e0b" };
}

// Decorative SVG patterns for the card
const CompassRose = () => (
  <svg className="w-20 h-20 opacity-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
    <circle cx="50" cy="50" r="45" />
    <circle cx="50" cy="50" r="35" strokeDasharray="3 2" />
    <line x1="50" y1="5" x2="50" y2="95" />
    <line x1="5" y1="50" x2="95" y2="50" />
    <line x1="18" y1="18" x2="82" y2="82" />
    <line x1="82" y1="18" x2="18" y2="82" />
    <polygon points="50,8 47,20 53,20" fill="currentColor" />
    <text x="50" y="7" textAnchor="middle" fontSize="5" fontWeight="800" fill="currentColor">N</text>
    <text x="50" y="99" textAnchor="middle" fontSize="5" fontWeight="800" fill="currentColor">S</text>
    <text x="3" y="52" textAnchor="middle" fontSize="5" fontWeight="800" fill="currentColor">W</text>
    <text x="97" y="52" textAnchor="middle" fontSize="5" fontWeight="800" fill="currentColor">E</text>
  </svg>
);

// Custom Vector Entry Passport Stamp
const EntryStamp = ({ date }: { date: string }) => (
  <div className="absolute top-4 right-4 opacity-20 rotate-12 pointer-events-none select-none text-white">
    <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="46" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="50" cy="50" r="39" strokeWidth="1" />
      <path d="M15 50 H85" strokeWidth="0.8" />
      <text x="50" y="32" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="currentColor" letterSpacing="0.8">IMMIGRATION</text>
      <text x="50" y="45" textAnchor="middle" fontSize="6" fontWeight="700" fill="currentColor">{date.toUpperCase()}</text>
      <text x="50" y="63" textAnchor="middle" fontSize="8" fontWeight="800" fill="currentColor" letterSpacing="0.5">VERIFIED</text>
      <text x="50" y="73" textAnchor="middle" fontSize="5" fontWeight="700" fill="currentColor">DAILY DISPATCH</text>
    </svg>
  </div>
);

// Custom Vector Departure Passport Stamp (Back Side)
const DepartureStamp = ({ id }: { id: string }) => (
  <div className="absolute top-8 right-6 opacity-15 -rotate-6 pointer-events-none select-none text-sunset-1">
    <svg className="w-20 h-14" viewBox="0 0 120 80" fill="none" stroke="currentColor">
      <rect x="4" y="4" width="112" height="72" rx="6" strokeWidth="1.5" strokeDasharray="4 2" />
      <rect x="8" y="8" width="104" height="64" rx="4" strokeWidth="0.8" />
      <path d="M8 40 H112" strokeWidth="0.8" />
      <text x="60" y="24" textAnchor="middle" fontSize="7" fontWeight="900" fill="currentColor" letterSpacing="1.2">EXIT CONTROL</text>
      <text x="60" y="34" textAnchor="middle" fontSize="5" fontWeight="600" fill="currentColor">JOURNEYPULSE HQ</text>
      <text x="60" y="54" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor" letterSpacing="0.8">STORY N° {id}</text>
      <text x="60" y="64" textAnchor="middle" fontSize="4.5" fontWeight="600" fill="currentColor">OFFICIAL ARCHIVE</text>
    </svg>
  </div>
);

export function TodayFactCard() {
  const [fact, setFact] = useState<FactData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
    setDateLabel(formatted);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const localDateStr = `${year}-${month}-${day}`;

    async function fetchDailyFact() {
      try {
        const res = await fetch(`/api/travel/daily-fact?date=${localDateStr}`);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates to range [-0.5, 0.5]
    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;
    
    setTilt({
      x: -yc * 12, // Tilt on X axis
      y: xc * 12   // Tilt on Y axis
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fact && navigator.share) {
      try {
        await navigator.share({
          title: fact.title,
          text: fact.fact,
          url: window.location.href,
        });
      } catch {}
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto aspect-[9/16] rounded-[2.5rem] bg-slate-950 border border-white/10 flex items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-4 text-center">
          <RefreshCw className="w-8 h-8 text-sunset-1 animate-spin" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Travel Dispatch...</span>
        </div>
      </div>
    );
  }

  if (!fact) return null;

  const bgImage = getUnsplashImage(fact.title, fact.category);
  const coords = fact.state ? STATE_COORDINATES[fact.state] || "20.5937° N, 78.9629° E" : "20.5937° N, 78.9629° E";
  const categoryAccent = getCategoryAccent(fact.category);
  const storyNo = fact.id.substring(fact.id.length - 4).toUpperCase();

  return (
    <div 
      className="w-full max-w-[390px] mx-auto aspect-[9/16] relative select-none"
      style={{ perspective: "1500px" }}
    >
      <motion.div
        className="w-full h-full relative cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateY: isFlipped ? 180 + tilt.y : tilt.y,
          rotateX: tilt.x,
          y: isHovered ? -8 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.5
        }}
      >
        
        {/* ==================== POSTCARD FRONT SIDE ==================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl flex flex-col"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)"
          }}
        >
          {/* HERO IMAGE — Prominent, taking up 45% of card */}
          <div className="relative h-[45%] w-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
              style={{ backgroundImage: `url(${bgImage})` }}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
            
            {/* Decorative top gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryAccent.gradient}`} />

            {/* Category badge — top left over image */}
            <div className="absolute top-5 left-5 z-10">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r ${categoryAccent.gradient} text-white shadow-lg`}>
                <Sparkles className="w-3 h-3" />
                {fact.category}
              </span>
            </div>

            {/* Coordinates — below category */}
            <div className="absolute top-14 left-5 z-10">
              <span className="text-[8px] font-mono text-white/50 tracking-wider bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
                COORDS: {coords}
              </span>
            </div>

            {/* Share button — top right */}
            <button
              onClick={handleShare}
              className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
            </button>

            {/* Passport stamp overlay */}
            <EntryStamp date={dateLabel} />

            {/* Decorative compass rose — bottom right of image */}
            <div className="absolute bottom-2 right-4 text-white pointer-events-none">
              <CompassRose />
            </div>
          </div>

          {/* CONTENT AREA — Bottom 55% */}
          <div className="relative flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
            {/* Decorative route line */}
            <div className="absolute top-0 left-8 w-[1px] h-full bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none" />
            
            {/* Glow orb */}
            <div className={`absolute w-32 h-32 rounded-full blur-[60px] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-gradient-to-br ${categoryAccent.gradient}`} />

            <div className="relative z-10 space-y-4">
              {/* Story number */}
              <span className="inline-block text-[9px] font-mono uppercase tracking-widest text-sunset-2 bg-sunset-2/10 border border-sunset-2/20 px-2.5 py-0.5 rounded">
                Story N° {storyNo}
              </span>
              
              {/* Title */}
              <h3 className="font-display font-black text-[1.65rem] leading-[1.1] text-white tracking-tighter uppercase select-none">
                {fact.title}
              </h3>

              {/* Fact text */}
              <p className="text-[13px] text-white/80 leading-relaxed font-medium line-clamp-3">
                {fact.fact}
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              {/* Footer Row */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10 text-[9px] font-bold text-white/70 uppercase tracking-widest">
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-sunset-2" />
                  {dateLabel}
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-sunset-1" />
                  {fact.state || fact.region || "India"}
                </span>
              </div>

              {/* Flip Hint Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-sunset-1 bg-white/5 border border-white/10 hover:border-sunset-1/30 px-5 py-2.5 rounded-full transition-colors duration-300 w-fit mx-auto cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tap to Flip Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================== POSTCARD BACK SIDE ==================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Top accent bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${categoryAccent.gradient}`} />

          {/* Background */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-900 via-slate-950 to-black p-7">
            
            {/* Decorative elements */}
            <div className={`absolute w-44 h-44 rounded-full blur-[80px] opacity-20 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-gradient-to-br ${categoryAccent.gradient}`} />
            <DepartureStamp id={storyNo} />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4 mb-5">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-sunset-1 tracking-widest block leading-none">The Daily Dispatch</span>
                <span className="text-[7px] font-mono text-white/30 tracking-wider">JOURNEYPULSE TRAVEL GAZETTE</span>
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-sunset-2 px-2.5 py-0.5 bg-sunset-2/10 border border-sunset-2/20 rounded">
                {fact.state || "India"}
              </div>
            </div>

            {/* Full-width story content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center space-y-5 overflow-y-auto no-scrollbar">
              <div className="space-y-2">
                <span className="text-[8px] uppercase font-bold text-sunset-3 tracking-widest block">In-Depth Historical Record</span>
                <h4 className="font-display font-black text-sm text-white leading-tight uppercase">
                  {fact.title}
                </h4>
              </div>

              <div className="relative">
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${categoryAccent.gradient} rounded-full`} />
                <p className="text-[12px] font-medium leading-[1.7] italic text-white/80 font-serif pl-4">
                  &ldquo;{fact.detailedFact || fact.fact}&rdquo;
                </p>
              </div>

              {/* Mini metadata row */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <div className="border border-white/10 rounded-lg px-2.5 py-1.5 text-center bg-white/5">
                  <span className="text-[6px] font-extrabold uppercase text-sunset-3 block tracking-tighter">Verified</span>
                  <span className="text-[7px] font-black text-sunset-1 block tracking-wider">ARCHIVE</span>
                </div>
                <div className="border border-white/10 rounded-lg px-2.5 py-1.5 text-center bg-white/5">
                  <span className="text-[6px] font-extrabold uppercase text-sunset-3 block tracking-tighter">Category</span>
                  <span className="text-[7px] font-black text-sunset-2 block tracking-wider">{fact.category}</span>
                </div>
                <div className="border border-white/10 rounded-lg px-2.5 py-1.5 text-center bg-white/5">
                  <span className="text-[6px] font-extrabold uppercase text-sunset-3 block tracking-tighter">Date</span>
                  <span className="text-[7px] font-black text-white/60 block">{dateLabel}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
              <span className="text-[7px] font-mono text-white/30">
                © 2026 JourneyPulse India
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-sunset-1 bg-white/5 border border-white/10 hover:border-sunset-1/30 px-4 py-1.5 rounded-full transition-colors duration-300 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Flip Back</span>
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
