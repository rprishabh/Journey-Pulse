"use client";

import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { CompassSpinner } from "./CompassSpinner";

// World map TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface VisaData {
  countryName: string;
  countryCode: string;
  flagEmoji: string;
  isVisaRequired: boolean;
  isVisaOnArrival: boolean;
  isEVisaAvailable: boolean;
  processingTimeDays?: number;
  validityDays?: number;
  maxStayDays?: number;
  fee?: number;
  feeCurrency?: string;
  applicationUrl?: string;
  requirements: string[];
  documentsRequired: string[];
  notes?: string;
}

export function VisaMap() {
  const [visaList, setVisaList] = useState<Record<string, VisaData>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<VisaData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<VisaData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function loadVisaData() {
      try {
        const res = await fetch("/api/visa?segment=OUTBOUND&pageSize=250");
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (json.success && json.data) {
          const mapping: Record<string, VisaData> = {};
          json.data.forEach((item: any) => {
            mapping[item.countryCode] = item;
          });
          setVisaList(mapping);
        }
      } catch (e) {
        console.warn("[VisaMap] Could not fetch live visa details");
      } finally {
        setLoading(false);
      }
    }
    loadVisaData();
  }, []);

  const getCountryColor = (geo: any) => {
    const code = geo.properties.ISO_A3 || geo.id;
    if (code === "IND") return "#10b981"; // India is Emerald

    const visa = visaList[code];
    if (!visa) return "#cbd5e1"; // Unmapped

    if (!visa.isVisaRequired) return "#ff6b35"; // Visa Free (Orange)
    if (visa.isVisaOnArrival) return "#f7931e"; // Visa on Arrival (Yellow)
    if (visa.isEVisaAvailable) return "#e84393"; // e-Visa (Purple)
    return "#334155"; // Visa Required (Dark Slate)
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  if (loading) return <div className="glass p-12 rounded-3xl"><CompassSpinner /></div>;

  return (
    <div className="relative w-full glass rounded-3xl p-6 border border-sunset-1/10 shadow-lg select-none">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="font-display font-extrabold text-heading-lg text-ink dark:text-cream">Global Visa Power Map</h3>
        
        {/* Map Legend */}
        <div className="flex flex-wrap gap-3.5 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#ff6b35]" />
            <span>Visa-Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#f7931e]" />
            <span>On-Arrival</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#e84393]" />
            <span>e-Visa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#334155]" />
            <span>Visa Required</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden h-[300px] md:h-[420px] cursor-grab active:cursor-grabbing relative" onMouseMove={handleMouseMove}>
        <ComposableMap projectionConfig={{ scale: 145 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const code = geo.properties.ISO_A3 || geo.id;
                const visa = visaList[code];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      if (visa) setHoveredCountry(visa);
                    }}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => {
                      if (visa) setSelectedCountry(visa);
                    }}
                    style={{
                      default: {
                        fill: getCountryColor(geo),
                        outline: "none",
                        transition: "fill 0.3s",
                      },
                      hover: {
                        fill: code === "IND" ? "#10b981" : "#6c5ce7",
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#0c1929",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredCountry && (
        <div
          style={{ top: tooltipPos.y, left: tooltipPos.x }}
          className="fixed z-[999] pointer-events-none p-3 px-4 rounded-xl glass-strong border border-sunset-1/20 text-xs font-semibold text-ink dark:text-cream shadow-md flex flex-col space-y-1 animate-scale-in"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base">{hoveredCountry.flagEmoji || "🌐"}</span>
            <span className="font-extrabold text-sm">{hoveredCountry.countryName}</span>
          </div>
          <span className="text-[10px] text-sunset-1 uppercase tracking-wider font-extrabold">
            {!hoveredCountry.isVisaRequired
              ? "Visa Free"
              : hoveredCountry.isVisaOnArrival
              ? "Visa on Arrival"
              : hoveredCountry.isEVisaAvailable
              ? "e-Visa Available"
              : "Visa Required"}
          </span>
          {hoveredCountry.maxStayDays && (
            <span className="text-ink/60 dark:text-cream/60 text-[10px]">
              Max Stay: {hoveredCountry.maxStayDays} Days
            </span>
          )}
        </div>
      )}

      {/* Detailed Slide-out Side Drawer */}
      {selectedCountry && (
        <div className="fixed inset-0 z-[1000] flex justify-end bg-ink/40 backdrop-blur-sm animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedCountry(null)} />
          
          <div className="relative w-full max-w-md h-full bg-cream dark:bg-ink p-8 border-l border-sunset-1/10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-sunset-1/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedCountry.flagEmoji || "🌐"}</span>
                  <div>
                    <h4 className="text-xl font-display font-black text-ink dark:text-cream leading-tight">
                      {selectedCountry.countryName}
                    </h4>
                    <span className="text-xs uppercase font-extrabold text-sunset-1 tracking-widest">
                      {selectedCountry.countryCode}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="w-8 h-8 rounded-full border border-sunset-1/15 flex items-center justify-center hover:bg-sunset-1/10 hover:text-sunset-1 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Visa details cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-sunset-1/5 rounded-2xl border border-sunset-1/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-1">Status</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {!selectedCountry.isVisaRequired ? "Visa Free" : selectedCountry.isVisaOnArrival ? "Visa on Arrival" : selectedCountry.isEVisaAvailable ? "e-Visa" : "Required"}
                  </p>
                </div>
                <div className="p-4 bg-sunset-2/5 rounded-2xl border border-sunset-2/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-2">Max Stay</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {selectedCountry.maxStayDays ? `${selectedCountry.maxStayDays} Days` : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-sunset-3/5 rounded-2xl border border-sunset-3/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-3">Fee</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {selectedCountry.fee ? `${selectedCountry.fee} ${selectedCountry.feeCurrency || "USD"}` : "Free"}
                  </p>
                </div>
                <div className="p-4 bg-sunset-4/5 rounded-2xl border border-sunset-4/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-4">Processing Time</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {selectedCountry.processingTimeDays ? `${selectedCountry.processingTimeDays} Days` : "Instant"}
                  </p>
                </div>
              </div>

              {/* Requirements & Documents */}
              {selectedCountry.documentsRequired && selectedCountry.documentsRequired.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-extrabold text-sunset-1 tracking-wider">Required Documents</span>
                  <ul className="space-y-1.5">
                    {selectedCountry.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2 text-ink/80 dark:text-cream/80">
                        <span className="text-sunset-1">✓</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {selectedCountry.notes && (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-extrabold text-sunset-2 tracking-wider">Crucial Advisories</span>
                  <p className="text-xs text-ink/75 dark:text-cream/75 leading-relaxed bg-sunset-2/5 p-3 rounded-xl border border-sunset-2/10">
                    {selectedCountry.notes}
                  </p>
                </div>
              )}
            </div>

            {selectedCountry.applicationUrl && (
              <a
                href={selectedCountry.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn btn-primary mt-6 text-center"
              >
                Apply Official eVisa
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
