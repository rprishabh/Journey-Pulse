"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { CompassSpinner } from "./CompassSpinner";

// Dynamically import react-globe.gl to prevent SSR rendering errors
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => <div className="h-[400px] flex items-center justify-center"><CompassSpinner /></div>,
});

interface Advisory {
  id: string;
  title: string;
  countryName: string;
  countryCode: string;
  advisoryLevel: "LEVEL_1_EXERCISE_NORMAL" | "LEVEL_2_EXERCISE_INCREASED" | "LEVEL_3_RECONSIDER_TRAVEL" | "LEVEL_4_DO_NOT_TRAVEL";
  summary: string;
  issuedBy: string;
  securityRisks: string[];
  healthRisks: string[];
  sourceUrl?: string;
}

interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  label: string;
  advisory: Advisory;
}

// Coordinates lookup for seeded countries
const COUNTRY_COORDS: Record<string, [number, number]> = {
  THA: [15.87, 100.99],
  USA: [37.09, -95.71],
  GBR: [55.378, -3.436],
  FRA: [46.227, 2.213],
  DEU: [51.165, 10.45],
  IND: [20.593, 78.962],
  BEL: [50.85, 4.35],
  ESP: [40.463, -3.749],
  CAN: [56.13, -106.34],
  BRA: [-14.235, -51.925],
  AUS: [-25.274, 133.775],
  CHN: [35.861, 104.195],
  JPN: [36.204, 138.252],
  ZAF: [-30.559, 22.937],
  LKA: [7.873, 80.771],
  NPL: [28.394, 84.124],
  MDV: [3.202, 73.22],
  MUS: [-20.348, 57.552],
  KEN: [-0.023, 37.906],
};

export function AdvisoriesGlobe() {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [points, setPoints] = useState<GlobePoint[]>([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [visible, setVisible] = useState(true);
  const globeEl = useRef<any>(null);

  useEffect(() => {
    // Check reduction
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || 
                      document.documentElement.getAttribute("data-motion") === "off";
    if (isReduced) {
      setVisible(false);
      return;
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    async function loadAdvisories() {
      try {
        const res = await fetch("/api/advisories?active=true&pageSize=100");
        if (!res.ok) throw new Error();
        const json = await res.json();
        
        if (json.success && json.data) {
          setAdvisories(json.data);
          
          // Map to Globe points
          const newPoints: GlobePoint[] = json.data
            .map((adv: Advisory) => {
              const coords = COUNTRY_COORDS[adv.countryCode];
              if (!coords) return null;
              
              // Pulsing color depending on severity level
              const color = adv.advisoryLevel === "LEVEL_4_DO_NOT_TRAVEL"
                ? "#ef4444" // red
                : adv.advisoryLevel === "LEVEL_3_RECONSIDER_TRAVEL"
                ? "#f97316" // orange
                : "#f59e0b"; // yellow

              return {
                lat: coords[0],
                lng: coords[1],
                size: adv.advisoryLevel === "LEVEL_4_DO_NOT_TRAVEL" ? 0.35 : 0.25,
                color,
                label: `${adv.countryName} - Level ${adv.advisoryLevel.split("_")[1]}`,
                advisory: adv,
              };
            })
            .filter((p: any) => p !== null);

          setPoints(newPoints);
        }
      } catch (e) {
        console.warn("[AdvisoriesGlobe] Could not fetch live warnings");
      } finally {
        setLoading(false);
      }
    }

    loadAdvisories();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Controls camera focus
  useEffect(() => {
    if (globeEl.current && points.length > 0) {
      // Point camera to first major point
      globeEl.current.pointOfView({ lat: points[0].lat, lng: points[0].lng, alt: 2.2 }, 1000);
    }
  }, [points]);

  if (!visible) {
    // 2D Static layout fallback
    return (
      <div className="card-modern p-6 max-w-lg mx-auto text-center space-y-4">
        <h3 className="font-display font-extrabold text-heading-lg text-ink dark:text-cream">Consular Advisories Tracker</h3>
        <p className="text-body-sm text-ink/70 dark:text-cream/70">
          Check out active travel alerts and consular notices under official bulletins.
        </p>
      </div>
    );
  }

  if (loading) return <div className="glass p-12 rounded-3xl"><CompassSpinner /></div>;

  return (
    <div className="relative w-full glass rounded-3xl p-6 border border-sunset-1/10 shadow-lg select-none flex flex-col md:flex-row items-center gap-8">
      
      {/* Informative Side Panel */}
      <div className="md:w-1/3 space-y-4 text-left">
        <span className="text-[10px] uppercase font-bold text-sunset-1 tracking-widest bg-sunset-1/10 px-2.5 py-1 rounded-md border border-sunset-1/25">
          Live Threat Intel
        </span>
        <h3 className="font-display font-black text-heading-xl md:text-heading-2xl text-ink dark:text-cream leading-tight">
          Geopolitical Alert Globe
        </h3>
        <p className="text-body-sm text-ink/75 dark:text-cream/75 leading-relaxed">
          Interactive global security map tracking consular warnings and biological health restrictions in real-time.
        </p>
        <div className="bg-red-500/10 border border-red-500/25 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
            {points.length} active high-threat bulletins flagged.
          </span>
        </div>
      </div>

      {/* Globe Container */}
      <div className="flex-1 w-full h-[320px] md:h-[450px] overflow-hidden rounded-2xl bg-ink relative">
        <Globe
          ref={globeEl}
          width={isMobile ? 320 : 600}
          height={isMobile ? 320 : 450}
          backgroundColor="rgba(12, 25, 41, 1)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius="size"
          pointAltitude={0.1}
          pointsMerge={true}
          onPointClick={(point: any) => {
            if (point && point.advisory) {
              setSelectedAdvisory(point.advisory);
            }
          }}
        />
        <div className="absolute bottom-4 right-4 bg-ink/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] text-cream uppercase font-bold tracking-widest border border-sunset-1/20 pointer-events-none">
          Click Red Pin to View Advisory
        </div>
      </div>

      {/* Detailed Alert Modal Dialog */}
      {selectedAdvisory && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-cream dark:bg-ink p-8 rounded-3xl border border-sunset-1/10 shadow-2xl space-y-6 animate-scale-in">
            <div className="flex items-start justify-between border-b border-sunset-1/15 pb-4">
              <div>
                <h4 className="text-lg font-display font-black text-ink dark:text-cream leading-snug">
                  {selectedAdvisory.countryName} Consular Alert
                </h4>
                <span className="text-[10px] uppercase font-extrabold text-red-500 tracking-wider">
                  Level {selectedAdvisory.advisoryLevel.split("_")[1]} Threat Classification
                </span>
              </div>
              <button
                onClick={() => setSelectedAdvisory(null)}
                className="w-8 h-8 rounded-full border border-sunset-1/15 flex items-center justify-center hover:bg-sunset-1/10 hover:text-sunset-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-left">
              <h5 className="font-display font-extrabold text-sm text-ink dark:text-cream">
                {selectedAdvisory.title}
              </h5>
              
              <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-xs text-ink/75 dark:text-cream/75 leading-relaxed">
                {selectedAdvisory.summary}
              </div>

              {selectedAdvisory.securityRisks && selectedAdvisory.securityRisks.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Active Security Risks</span>
                  <p className="text-xs text-ink/75 dark:text-cream/75">{selectedAdvisory.securityRisks.join(", ")}</p>
                </div>
              )}
            </div>

            {selectedAdvisory.sourceUrl && (
              <a
                href={selectedAdvisory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn btn-primary mt-4 text-center text-xs"
              >
                View Official Ministerial Bulletin
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
