"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, Calendar, Sparkles } from "lucide-react";

const CALENDAR_FACTS: Record<string, { category: string; location: string; title: string; description: string }> = {
  "6-19": {
    category: "GLOBAL EXPLORATION",
    location: "Western Australia",
    title: "Steve Fossett's Balloon flight",
    description: "In 2002, adventurer Steve Fossett launched his record solo non-stop round-the-world balloon flight."
  },
  "6-20": {
    category: "AVIATION MILESTONES",
    location: "Paris, France",
    title: "Paris Air Show Debut",
    description: "The Paris Air Show has debuted generations of aviation breakthroughs reshaping continental transit loops."
  },
  "6-21": {
    category: "DOMESTIC TRAVEL & CULTURE",
    location: "Ladakh, India",
    title: "Sindhu Darshan Festival Influx",
    description: "Travelers gather at the Indus River in Leh to witness heritage dances and spiritual solstice assemblies."
  }
};

export function TodayFactCard() {
  const [dateLabel, setDateLabel] = useState("19 June");
  const [fact, setFact] = useState(CALENDAR_FACTS["6-19"]);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const today = new Date();
    const key = `${today.getMonth() + 1}-${today.getDate()}`;
    const formatted = today.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
    
    setDateLabel(formatted);
    if (CALENDAR_FACTS[key]) {
      setFact(CALENDAR_FACTS[key]);
    }
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto h-[320px] relative perspective select-none">
      <motion.div
        className="w-full h-full relative cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ y: -6, scale: 1.015 }}
      >
        
        {/* POSTCARD FRONT SIDE */}
        <div
          className="absolute inset-0 w-full h-full p-6 bg-[#faf3e8] border-[12px] border-double border-sunset-1/25 rounded-2xl flex flex-col justify-between shadow-lg text-ink"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Postcard vintage headers */}
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-sunset-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Incredible India Dispatch
            </span>
            
            {/* Vintage stamp illustration */}
            <div className="w-14 h-18 bg-[#ebd9c1] rounded border-2 border-dashed border-sunset-1/30 flex flex-col justify-between p-1.5 text-center relative rotate-3 shadow">
              <span className="text-[7px] font-extrabold uppercase tracking-tighter text-sunset-3">India</span>
              <div className="w-8 h-8 rounded-full border border-sunset-2 mx-auto flex items-center justify-center text-[9px]">🇮🇳</div>
              <span className="text-[7px] font-extrabold text-sunset-1">Rs 5.00</span>
              {/* Postmark wavy overlay lines */}
              <div className="absolute inset-0 bg-transparent flex flex-col justify-around pointer-events-none opacity-40">
                <div className="h-0.5 w-full bg-slate-800 -rotate-12" />
                <div className="h-0.5 w-full bg-slate-800 -rotate-12" />
                <div className="h-0.5 w-full bg-slate-800 -rotate-12" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-sunset-2 tracking-widest bg-sunset-2/10 px-2 py-0.5 rounded">
              {fact.category}
            </span>
            <h3 className="font-display font-black text-heading-xl text-ink leading-tight">
              {fact.title}
            </h3>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-dashed border-sunset-1/20 text-xs font-bold text-sunset-1 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {dateLabel}
            </span>
            <span className="flex items-center gap-1">
              <Map className="w-4 h-4" />
              {fact.location}
            </span>
          </div>

          {/* Click hint stamp */}
          <div className="absolute bottom-4 right-4 text-[9px] font-bold uppercase tracking-widest text-sunset-2 bg-sunset-2/5 p-1 px-2 rounded animate-pulse">
            Click to Flip Card
          </div>
        </div>

        {/* POSTCARD BACK SIDE */}
        <div
          className="absolute inset-0 w-full h-full p-8 bg-[#faf3e8] border-[12px] border-double border-sunset-1/25 rounded-2xl flex flex-col justify-between shadow-lg text-ink"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Postcard vertical split layout */}
          <div className="flex h-full gap-6">
            
            {/* Left side: Message body */}
            <div className="flex-1 space-y-3 pr-4 border-r border-dashed border-sunset-1/20 flex flex-col justify-center">
              <span className="text-[9px] uppercase font-extrabold text-sunset-3 tracking-widest">Historical Fact Summary</span>
              <p className="text-xs font-medium leading-relaxed italic text-ink/80">
                &ldquo;{fact.description}&rdquo;
              </p>
            </div>

            {/* Right side: Mock address lines */}
            <div className="w-2/5 flex flex-col justify-center space-y-4">
              <div className="space-y-1.5 pt-4">
                <div className="h-0.5 w-full bg-sunset-1/20" />
                <div className="h-0.5 w-full bg-sunset-1/20" />
                <div className="h-0.5 w-full bg-sunset-1/20" />
                <div className="h-0.5 w-full bg-sunset-1/20" />
              </div>
              <div className="text-center pt-2">
                <span className="text-[8px] font-black uppercase tracking-widest text-sunset-2">
                  To: The Passionate Traveler
                </span>
              </div>
            </div>

          </div>

          <div className="text-center text-[9px] font-bold uppercase tracking-widest text-sunset-1 pt-2 border-t border-sunset-1/10">
            Tap to Flip Back
          </div>
        </div>

      </motion.div>
    </div>
  );
}
