"use client";

import React, { useEffect, useRef, useState } from "react";
import { Landmark, Calendar, BellRing, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StateMilestone {
  state: string;
  year: number;
  date: string;
  description: string;
}

const MILESTONES: StateMilestone[] = [
  // ── Global Milestones for immediate 1-week alerts (around June 21) ──
  { state: "Luxembourg", year: 1839, date: "23 Jun", description: "Luxembourg National Day (Grand Duke's Birthday), celebrated with fireworks, parades, and free public concerts in Luxembourg City." },
  { state: "Croatia", year: 1991, date: "25 Jun", description: "Croatia Statehood Day, commemorating the country's declaration of independence from Yugoslavia." },
  { state: "Slovenia", year: 1991, date: "25 Jun", description: "Slovenia Statehood Day (Dan državnosti), celebrating independence with national ceremonies." },
  { state: "Canada", year: 1867, date: "1 Jul", description: "Canada Day (Fête du Canada), marking the confederation of Canada into a single Dominion." },
  { state: "United States", year: 1776, date: "4 Jul", description: "Independence Day (4th of July), celebrating the Declaration of Independence with fireworks, parades, and family barbecues." },

  // ── Domestic Statehood/Foundation Milestones ──
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
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleMilestones = isExpanded ? MILESTONES : MILESTONES.slice(0, 5);

  const upcomingAlerts = React.useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    return MILESTONES.map((m) => {
      const parts = m.date.trim().split(/\s+/);
      if (parts.length < 2) return null;
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1].toLowerCase().substring(0, 3);
      const monthIdx = months[monthStr];
      if (monthIdx === undefined) return null;

      // Create target date in current year (local time context)
      const targetDate = new Date(currentYear, monthIdx, day, 0, 0, 0, 0);
      const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      const diffTime = targetDate.getTime() - localToday.getTime();
      const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...m,
        daysRemaining,
      };
    })
    .filter((item): item is (StateMilestone & { daysRemaining: number }) => 
      item !== null && item.daysRemaining >= 0 && item.daysRemaining <= 7
    )
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
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
      const activeMilestone = visibleMilestones[activeIdx];
      if (activeMilestone) {
        setActiveYear(activeMilestone.year);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleMilestones]);

  return (
    <div ref={containerRef} className="w-full relative py-12 select-none">
      
      {/* Scroll-jacked floating year counter background */}
      <div className="sticky top-1/3 left-0 w-full flex justify-center items-center h-0 pointer-events-none z-0 opacity-15 select-none">
        <span className="font-display font-black text-[120px] md:text-[220px] text-sunset-1 leading-none animate-pulse">
          {activeYear}
        </span>
      </div>

      <div className="max-w-2xl mx-auto space-y-2 text-center mb-10 relative z-10">
        <span className="text-[10px] uppercase font-bold text-sunset-1 tracking-widest bg-sunset-1/10 px-2.5 py-1 rounded-md border border-sunset-1/25">
          History Trail
        </span>
        <h3 className="font-display font-black text-heading-xl md:text-heading-2xl text-ink dark:text-cream leading-tight">
          Tourism States & Regional Alerts
        </h3>
        <p className="text-body-sm text-ink/75 dark:text-cream/75">
          Foundation milestones of Indian States, Union Territories, and famous global regions.
        </p>
      </div>

      {/* Live Alert Cards for upcoming foundation/tourism dates */}
      {upcomingAlerts.length > 0 && (
        <div className="max-w-xl mx-auto mb-12 space-y-4 relative z-10 px-4">
          <div className="flex items-center gap-2 text-sunset-1 justify-center mb-2">
            <BellRing className="w-4 h-4 animate-bounce" />
            <span className="text-[10px] uppercase font-black tracking-widest text-sunset-1">
              Live Regional Alerts (1-Week Window)
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {upcomingAlerts.map((alert, idx) => (
              <motion.div
                key={idx}
                className="glass-strong border-l-4 border-l-sunset-1 border-sunset-1/10 p-4 rounded-2xl flex items-start gap-4 shadow-lg"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="w-9 h-9 rounded-xl bg-sunset-1/10 border border-sunset-1/20 flex items-center justify-center text-sunset-1 shrink-0">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-ink dark:text-cream leading-none">
                      {alert.state} Celebrations
                    </span>
                    <span className="badge bg-sunset-1/15 text-sunset-1 border border-sunset-1/20 text-[9px] px-2 py-0.5 font-bold">
                      {alert.daysRemaining === 0 ? "Today!" : alert.daysRemaining === 1 ? "Tomorrow!" : `In ${alert.daysRemaining} days`}
                    </span>
                  </div>
                  <p className="text-xs text-ink/70 dark:text-cream/70 leading-relaxed">
                    Celebrated on <span className="font-extrabold text-sunset-1">{alert.date}</span>. {alert.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Stream */}
      <div className="relative max-w-xl mx-auto pl-8 border-l border-sunset-1/25 space-y-12 z-10">
        {visibleMilestones.map((item, idx) => {
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

      {/* See More Toggle Button */}
      <div className="max-w-xl mx-auto text-center mt-12 relative z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-secondary inline-flex items-center gap-2 group hover:scale-105 transition-all duration-300 py-2.5 px-6 rounded-full"
        >
          {isExpanded ? (
            <>
              <span>Collapse Timeline</span>
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </>
          ) : (
            <>
              <span>See More Milestones</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
