"use client";

import React, { useEffect, useRef, useState } from "react";
import { Landmark, Calendar } from "lucide-react";

interface StateMilestone {
  state: string;
  year: number;
  date: string;
  description: string;
}

const MILESTONES: StateMilestone[] = [
  { state: "Uttar Pradesh", year: 1950, date: "24 Jan", description: "Establishment of United Provinces, renamed as Uttar Pradesh." },
  { state: "Bihar", year: 1956, date: "26 Jan", description: "Reorganized as a state under the States Reorganisation Act." },
  { state: "Karnataka", year: 1956, date: "1 Nov", description: "Formation of Mysore State, later renamed Karnataka." },
  { state: "Kerala", year: 1956, date: "1 Nov", description: "Integration of Malabar and Travancore-Cochin into Kerala." },
  { state: "Maharashtra", year: 1960, date: "1 May", description: "Bifurcation of Bombay State into Maharashtra & Gujarat." },
  { state: "Gujarat", year: 1960, date: "1 May", description: "Celebration of Gujarat Foundation Day." },
  { state: "Nagaland", year: 1963, date: "1 Dec", description: "Inauguration as the 16th state of the Indian Union." },
  { state: "Haryana", year: 1966, date: "1 Nov", description: "Bifurcated from Punjab to create a separate state." },
  { state: "Punjab", year: 1966, date: "1 Nov", description: "Punjab Day, reflecting state boundary updates." },
  { state: "Himachal Pradesh", year: 1971, date: "25 Jan", description: "Achieved full statehood status from union territory." },
  { state: "Manipur", year: 1972, date: "21 Jan", description: "Elevated to full statehood alongside Meghalaya." },
  { state: "Meghalaya", year: 1972, date: "21 Jan", description: "Achieved complete autonomous state status." },
  { state: "Tripura", year: 1972, date: "21 Jan", description: "Statehood Day marking integration of the kingdom." },
  { state: "Sikkim", year: 1975, date: "16 May", description: "Merged as the 22nd state of the Indian Union." },
  { state: "Mizoram", year: 1887, date: "20 Feb", description: "Attained statehood following the Mizoram Peace Accord." },
  { state: "Arunachal Pradesh", year: 1987, date: "20 Feb", description: "Upgraded from Union Territory to India's 24th state." },
  { state: "Goa", year: 1987, date: "30 May", description: "Separated from Daman & Diu to become a full state." },
  { state: "Chhattisgarh", year: 2000, date: "1 Nov", description: "Carved out from Madhya Pradesh's eastern districts." },
  { state: "Uttarakhand", year: 2000, date: "9 Nov", description: "Formed from the northwestern districts of Uttar Pradesh." },
  { state: "Jharkhand", year: 2000, date: "15 Nov", description: "Carved from southern Bihar on Birsa Munda birth date." },
  { state: "Telangana", year: 2014, date: "2 Jun", description: "Formed as India's newest state from Andhra Pradesh." },
  { state: "Ladakh", year: 2019, date: "31 Oct", description: "Established as an independent Union Territory." },
  { state: "Jammu & Kashmir", year: 2019, date: "31 Oct", description: "Reorganized into a separate Union Territory." },
];

// Custom hook to scramble text letters
function ScrambledText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#*?@&$0123456789";

  useEffect(() => {
    if (!active) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) return text[index];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, active]);

  return <span>{displayText}</span>;
}

export function StateTourismTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState(1950);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      
      // Calculate active element based on screen vertical center
      const items = containerRef.current.querySelectorAll(".timeline-item");
      let activeIdx = 0;
      let minDiff = Infinity;

      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const diff = Math.abs(itemRect.top - window.innerHeight / 2);
        if (diff < minDiff) {
          minDiff = diff;
          activeIdx = index;
        }
      });

      setActiveIndex(activeIdx);
      if (MILESTONES[activeIdx]) {
        setActiveYear(MILESTONES[activeIdx].year);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full relative py-12 select-none">
      
      {/* Scroll-jacked floating year counter background */}
      <div className="sticky top-1/3 left-0 w-full flex justify-center items-center h-0 pointer-events-none z-0 opacity-15 select-none">
        <span className="font-display font-black text-[120px] md:text-[220px] text-sunset-1 leading-none animate-pulse">
          {activeYear}
        </span>
      </div>

      <div className="max-w-2xl mx-auto space-y-2 text-center mb-16 relative z-10">
        <span className="text-[10px] uppercase font-bold text-sunset-1 tracking-widest bg-sunset-1/10 px-2.5 py-1 rounded-md border border-sunset-1/25">
          History Trail
        </span>
        <h3 className="font-display font-black text-heading-xl md:text-heading-2xl text-ink dark:text-cream leading-tight">
          Tourism States Foundation Timeline
        </h3>
        <p className="text-body-sm text-ink/75 dark:text-cream/75">
          Foundation milestones of Indian States and Union Territories. Scroll down to advance years.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative max-w-xl mx-auto pl-8 border-l border-sunset-1/25 space-y-12 z-10">
        {MILESTONES.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              className="timeline-item relative pl-6 group transition-all duration-300"
            >
              {/* Timeline dot */}
              <div
                className={`absolute -left-[38px] top-1.5 w-4.5 h-4.5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "bg-sunset-1 border-sunset-1 scale-125 shadow-glow-brand"
                    : "bg-cream dark:bg-ink border-sunset-1/40 group-hover:border-sunset-1"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-cream ${isActive ? "block" : "hidden"}`} />
              </div>

              {/* Card Container */}
              <div
                className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col gap-2 ${
                  isActive
                    ? "glass-strong border-sunset-1 shadow-md scale-102"
                    : "glass border-sunset-1/10 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-sunset-1 tracking-wider bg-sunset-1/10 px-2 py-0.5 rounded">
                    {item.date} {item.year}
                  </span>
                  <Landmark className={`w-4 h-4 transition-colors ${isActive ? "text-sunset-1 animate-bounce" : "text-sunset-1/40"}`} />
                </div>
                
                <h4 className="font-display font-black text-heading-md text-ink dark:text-cream">
                  <ScrambledText text={item.state} active={isActive} />
                </h4>
                
                <p className="text-xs text-ink/80 dark:text-cream/80 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
