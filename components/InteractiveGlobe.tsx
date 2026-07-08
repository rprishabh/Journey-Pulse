"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { CompassSpinner } from "./CompassSpinner";
import { CountryInfoPanel } from "./CountryInfoPanel";
import { COUNTRY_DATA, CONTINENT_COLORS, type CountryData } from "@/lib/country-data";
import { Globe2, Search, X } from "lucide-react";

// Dynamic import to prevent SSR issues
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] flex items-center justify-center">
      <CompassSpinner />
    </div>
  ),
});

interface GlobePoint {
  lat: number;
  lng: number;
  name: string;
  color: string;
  country: CountryData;
}

export function InteractiveGlobe() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [globeWidth, setGlobeWidth] = useState(600);
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate points from country data
  const points: GlobePoint[] = useMemo(() => {
    return COUNTRY_DATA.map((country) => ({
      lat: country.lat,
      lng: country.lng,
      name: country.name,
      color: CONTINENT_COLORS[country.continent] || "#f59e0b",
      country,
    }));
  }, []);

  // Filter countries for search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return COUNTRY_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  useEffect(() => {
    setMounted(true);
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) {
        setGlobeWidth(containerRef.current.clientWidth);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Set initial camera and auto-rotate
  useEffect(() => {
    if (globeRef.current) {
      // Start focused on India
      globeRef.current.pointOfView({ lat: 20.59, lng: 78.96, alt: 2.0 }, 1500);
      // Enable gentle auto-rotation via the controls
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
      }
    }
  }, [mounted]);

  const handleCountryClick = useCallback((point: any) => {
    if (point?.country) {
      setSelectedCountry(point.country);
      setShowSearch(false);
      setSearchQuery("");
    }
  }, []);

  const handleSearchSelect = useCallback((country: CountryData) => {
    setSelectedCountry(country);
    setShowSearch(false);
    setSearchQuery("");
    // Fly to the country
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: country.lat, lng: country.lng, alt: 1.5 }, 1000);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[450px] flex items-center justify-center">
        <CompassSpinner />
      </div>
    );
  }

  // Mobile fallback — interactive list instead of heavy 3D globe
  if (isMobile) {
    return (
      <div className="w-full space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-sunset-1 shrink-0" />
            <input
              type="text"
              placeholder="Search any country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-cream placeholder-cream/40 w-full outline-none font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="cursor-pointer">
                <X className="w-4 h-4 text-cream/40 hover:text-cream" />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {filteredCountries.length > 0 && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              {filteredCountries.map((c) => (
                <button
                  key={c.iso3}
                  onClick={() => handleSearchSelect(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left cursor-pointer"
                >
                  <span className="text-lg">{c.flagEmoji}</span>
                  <div>
                    <span className="text-xs font-bold text-cream block">{c.name}</span>
                    <span className="text-[10px] text-cream/50">{c.capital} · {c.continent}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Continent quick-links */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CONTINENT_COLORS).map(([continent, color]) => {
            const count = COUNTRY_DATA.filter(c => c.continent === continent).length;
            return (
              <button
                key={continent}
                onClick={() => setSearchQuery(continent)}
                className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: `${color}15`,
                  borderColor: `${color}30`,
                  color: color,
                }}
              >
                {continent} ({count})
              </button>
            );
          })}
        </div>

        {/* Quick grid of popular countries */}
        <div className="grid grid-cols-3 gap-2">
          {COUNTRY_DATA.filter(c => 
            ["USA", "GBR", "FRA", "JPN", "AUS", "ARE", "THA", "IND", "CAN", "DEU", "ITA", "SGP"].includes(c.iso3)
          ).map((c) => (
            <button
              key={c.iso3}
              onClick={() => handleSearchSelect(c)}
              className="flex flex-col items-center gap-1.5 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-sunset-1/20 transition-all cursor-pointer"
            >
              <span className="text-xl">{c.flagEmoji}</span>
              <span className="text-[9px] font-bold text-cream text-center leading-tight">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Country Info Panel */}
        <CountryInfoPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
      </div>
    );
  }

  // Desktop — Full 3D interactive globe
  return (
    <div className="w-full relative">
      <div
        ref={containerRef}
        className="w-full h-[450px] relative select-none rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Search overlay */}
        <div className="absolute top-4 left-4 z-20 w-64">
          <div className="relative">
            <div className="flex items-center gap-2 bg-ink/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg">
              <Search className="w-3.5 h-3.5 text-sunset-1 shrink-0" />
              <input
                type="text"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                className="bg-transparent text-xs text-cream placeholder-cream/40 w-full outline-none font-medium"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setShowSearch(false); }} className="cursor-pointer">
                  <X className="w-3.5 h-3.5 text-cream/40 hover:text-cream" />
                </button>
              )}
            </div>

            {/* Search results */}
            {showSearch && filteredCountries.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-ink/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                {filteredCountries.map((c) => (
                  <button
                    key={c.iso3}
                    onClick={() => handleSearchSelect(c)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left cursor-pointer"
                  >
                    <span className="text-sm">{c.flagEmoji}</span>
                    <div>
                      <span className="text-[11px] font-bold text-cream block leading-tight">{c.name}</span>
                      <span className="text-[9px] text-cream/40">{c.capital}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Continent Legend */}
        <div className="absolute top-4 right-4 z-20 bg-ink/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-[9px] space-y-1.5 shadow-lg pointer-events-none text-left">
          <div className="font-bold text-cream uppercase tracking-wider border-b border-white/5 pb-1 mb-1">
            Continents
          </div>
          {Object.entries(CONTINENT_COLORS).map(([continent, color]) => (
            <div key={continent} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-white/80 font-medium">{continent}</span>
            </div>
          ))}
        </div>

        {/* Globe */}
        <Globe
          ref={globeRef}
          width={globeWidth}
          height={450}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointRadius={0.35}
          pointAltitude={0.01}
          pointsMerge={false}
          pointLabel={(d: any) => {
            const c = d.country as CountryData;
            return `
              <div style="background: rgba(12,25,41,0.95); border: 1px solid rgba(255,107,53,0.35); border-radius: 12px; padding: 10px 12px; font-family: system-ui, sans-serif; text-align: left; max-width: 220px; box-shadow: 0 8px 20px rgba(0,0,0,0.6); color: #fef9f3;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span style="font-size: 16px;">${c.flagEmoji}</span>
                  <div>
                    <div style="font-weight: 800; font-size: 13px; color: #fff; line-height: 1.2;">${c.name}</div>
                    <div style="font-size: 9px; color: rgba(254,249,243,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${c.continent}</div>
                  </div>
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <span style="font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${c.visaStatus === 'visa-free' ? 'rgba(16,185,129,0.2)' : c.visaStatus === 'visa-on-arrival' ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${c.visaStatus === 'visa-free' ? '#34d399' : c.visaStatus === 'visa-on-arrival' ? '#60a5fa' : '#f87171'}; text-transform: uppercase;">${c.visaStatus.replace(/-/g, ' ')}</span>
                  <span style="font-size: 8px; font-weight: 600; color: rgba(254,249,243,0.6);">🏛 ${c.capital}</span>
                </div>
                <div style="font-size: 8px; color: #ff6b35; margin-top: 6px; font-weight: 700;">Click to explore →</div>
              </div>
            `;
          }}
          onPointClick={handleCountryClick}
          atmosphereColor="#ff6b35"
          atmosphereAltitude={0.15}
          animateIn={true}
        />

        {/* Bottom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/75 backdrop-blur-md border border-sunset-1/20 px-4 py-1.5 rounded-full text-[10px] text-cream font-bold uppercase tracking-wider pointer-events-none flex items-center gap-2">
          <Globe2 className="w-3.5 h-3.5 text-sunset-1" />
          <span>Click Any Country to Explore</span>
        </div>
      </div>

      {/* Country Info Panel (slides in from right) */}
      <CountryInfoPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </div>
  );
}
