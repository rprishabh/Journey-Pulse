"use client";

import React, { useRef } from "react";
import { MagneticButton } from "./MagneticButton";
import { Compass, Sparkles, Flag, ArrowRight, Landmark } from "lucide-react";

interface Initiative {
  id: string;
  title: string;
  summary: string;
  ministry: string;
  budget: string;
  icon: React.ReactNode;
}

const INITIATIVES: Initiative[] = [
  {
    id: "init-1",
    title: "Swadesh Darshan 2.0",
    summary: "Developing sustainable and responsible tourist destinations across 30+ Indian states and territories.",
    ministry: "Ministry of Tourism",
    budget: "₹1,400 Crores",
    icon: <Compass className="w-8 h-8 text-sunset-1" />,
  },
  {
    id: "init-2",
    title: "PRASHAD Scheme",
    summary: "Pilgrimage Rejuvenation and Spiritual, Heritage Augmentation Drive to beautify holy pilgrimage centers.",
    ministry: "Ministry of Tourism",
    budget: "₹800 Crores",
    icon: <Landmark className="w-8 h-8 text-sunset-2" />,
  },
  {
    id: "init-3",
    title: "Dekho Apna Desh",
    summary: "Promotional campaigns and financial subsidies encouraging domestic citizens to explore heritage sights.",
    ministry: "Ministry of External Affairs",
    budget: "₹250 Crores",
    icon: <Sparkles className="w-8 h-8 text-sunset-3" />,
  },
  {
    id: "init-4",
    title: "Vibrant Villages Program",
    summary: "Transforming northern border villages into eco-tourism hubs, creating local home-stays and trails.",
    ministry: "Ministry of Home Affairs",
    budget: "₹4,800 Crores",
    icon: <Flag className="w-8 h-8 text-sunset-4" />,
  },
];

export function GovInitiativesRail() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 340;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full space-y-6 relative select-none">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-sunset-1 tracking-widest">Govt Policy Rail</span>
          <h3 className="font-display font-black text-heading-xl text-ink dark:text-cream leading-tight">
            National Tourism Initiatives
          </h3>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full border border-sunset-1/15 flex items-center justify-center hover:bg-sunset-1/10 hover:text-sunset-1 transition-colors text-xs font-bold"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full border border-sunset-1/15 flex items-center justify-center hover:bg-sunset-1/10 hover:text-sunset-1 transition-colors text-xs font-bold"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal snap container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 scroll-smooth"
      >
        {INITIATIVES.map((item) => (
          <div
            key={item.id}
            className="w-[290px] md:w-[320px] shrink-0 snap-start card-modern p-6 bg-white dark:bg-ink border border-sunset-1/10 flex flex-col justify-between h-[300px] relative"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 rounded-2xl bg-sunset-1/5 flex items-center justify-center border border-sunset-1/15">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase text-sunset-3 px-2 py-0.5 bg-sunset-3/10 rounded">
                  {item.budget} Allocation
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-heading-md text-ink dark:text-cream">
                  {item.title}
                </h4>
                <span className="text-[9px] uppercase font-bold text-sunset-2 tracking-wide block">
                  {item.ministry}
                </span>
              </div>

              <p className="text-xs text-ink/70 dark:text-cream/70 leading-relaxed line-clamp-3">
                {item.summary}
              </p>
            </div>

            {/* Magnetic Button CTA */}
            <div className="pt-4 border-t border-sunset-1/10 mt-4">
              <MagneticButton radius={60}>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-sunset-1 uppercase tracking-widest hover:text-sunset-2 transition-colors">
                  <span>Explore Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </MagneticButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
