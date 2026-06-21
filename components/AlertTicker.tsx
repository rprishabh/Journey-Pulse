"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

interface TickerItem {
  id: string;
  text: string;
  link: string;
  severity: "INFO" | "WARNING" | "CRITICAL" | "EMERGENCY";
}

const FALLBACK_TICKER_ITEMS: TickerItem[] = [
  {
    id: "fb-1",
    text: "India expands e-Visa eligibility to additional countries.",
    link: "/visa-hub?segment=inbound",
    severity: "INFO",
  },
  {
    id: "fb-2",
    text: "Heavy rainfall warnings issued for parts of Western Ghats.",
    link: "/travel-advisories",
    severity: "WARNING",
  },
  {
    id: "fb-3",
    text: "Thailand visa-free entry extended: Indian passport holders enjoy 60 days stay.",
    link: "/visa-hub?segment=outbound",
    severity: "INFO",
  },
  {
    id: "fb-4",
    text: "Security Advisory: High-altitude border sectors discourages transit.",
    link: "/travel-advisories",
    severity: "CRITICAL",
  },
];

export function AlertTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_TICKER_ITEMS);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // 1. Fetch live alerts & AQI
    async function fetchLiveAlertsAndAqi() {
      let aqiVal = 342;
      let aqiStatus = "SEVERE";
      try {
        const aqiRes = await fetch("https://api.waqi.info/feed/delhi/?token=demo");
        const aqiJson = await aqiRes.json();
        if (aqiJson.status === "ok" && aqiJson.data) {
          aqiVal = aqiJson.data.aqi;
          if (aqiVal <= 50) aqiStatus = "GOOD";
          else if (aqiVal <= 100) aqiStatus = "SATISFACTORY";
          else if (aqiVal <= 150) aqiStatus = "MODERATE";
          else if (aqiVal <= 200) aqiStatus = "POOR";
          else if (aqiVal <= 300) aqiStatus = "VERY POOR";
          else aqiStatus = "SEVERE";
        }
      } catch (e) {
        console.warn("Failed to fetch AQI in ticker, using fallback");
      }

      const aqiItem: TickerItem = {
        id: "fb-aqi",
        text: `Live AQI Alert: Delhi NCR region experiencing '${aqiStatus}' category air quality (AQI ${aqiVal}).`,
        link: "https://aqicn.org/city/delhi/",
        severity: aqiVal > 200 ? "CRITICAL" : "WARNING",
      };

      const rainItem: TickerItem = {
        id: "fb-rain",
        text: "Heavy Rainfall Alert: Orange Warning issued for Mumbai, Konkan, and Western Ghats.",
        link: "https://mausam.imd.gov.in/",
        severity: "WARNING",
      };

      try {
        const res = await fetch("/api/advisories/alerts?pageSize=5&resolved=false");
        const json = res.ok ? await res.json() : null;
        
        let formatted: TickerItem[] = [aqiItem, rainItem];
        if (json && json.success && json.data && json.data.length > 0) {
          const dbAlerts = json.data.map((alert: any) => ({
            id: alert.id,
            text: `[${alert.alertCategory}] ${alert.title}: ${alert.message.substring(0, 80)}`,
            link: alert.sourceUrl || `/travel-advisories?q=${encodeURIComponent(alert.countryCode || alert.title)}`,
            severity: alert.severity,
          }));
          formatted = [...formatted, ...dbAlerts];
        } else {
          // Add remaining fallback items (excluding heavy rainfall duplicate)
          formatted = [...formatted, ...FALLBACK_TICKER_ITEMS.filter(item => item.id !== "fb-2")];
        }
        setItems(formatted);
      } catch (error) {
        console.warn("[AlertTicker] Using offline fallbacks:", error);
        setItems([aqiItem, rainItem, ...FALLBACK_TICKER_ITEMS.filter(item => item.id !== "fb-2")]);
      }
    }

    fetchLiveAlertsAndAqi();
    const fetchInterval = setInterval(fetchLiveAlertsAndAqi, 5 * 60 * 1000);

    // 2. Hide on scroll down, show on scroll up
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setVisible(false); // scroll down
      } else {
        setVisible(true); // scroll up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearInterval(fetchInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "EMERGENCY":
      case "CRITICAL":
        return "bg-red-500/20 text-red-500 border border-red-500/30";
      case "WARNING":
        return "bg-sunset-2/20 text-sunset-2 border border-sunset-2/30";
      default:
        return "bg-sunset-4/20 text-sunset-4 border border-sunset-4/30";
    }
  };

  return (
    <div
      id="alert-ticker"
      className={`sticky top-0 z-[999] h-9 w-full bg-ink text-cream flex items-center overflow-hidden border-b border-sunset-1/15 select-none transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Label Badge */}
      <div className="h-full bg-sunset-1 px-2.5 sm:px-4 flex items-center gap-1 sm:gap-1.5 shrink-0 z-10 shadow-md relative pr-4 sm:pr-6">
        <Flame className="w-3.5 h-3.5 text-cream animate-pulse" />
        <span className="font-display font-black text-[10px] tracking-wider uppercase text-cream leading-none hidden sm:inline">
          Live Advisories
        </span>
        <span className="font-display font-black text-[10px] tracking-wider uppercase text-cream leading-none inline sm:hidden">
          Live
        </span>
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-r from-sunset-1 to-transparent translate-x-full" />
      </div>

      {/* Marquee Wrapper */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex w-max items-center h-full animate-[ticker-scroll_60s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
          {/* Loop 1 */}
          <div className="flex items-center gap-12 pr-12 h-full">
            {items.map((item) => {
              const isExternal = item.link.startsWith("http");
              const innerContent = (
                <>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${getSeverityStyle(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span>{item.text}</span>
                  <span className="inline-flex items-center text-sunset-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[10px] font-bold">
                    View <ArrowRight className="w-3 h-3 ml-0.5" />
                  </span>
                </>
              );

              return isExternal ? (
                <a
                  key={`m1-${item.id}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs font-semibold text-cream/80 hover:text-sunset-1 transition-colors whitespace-nowrap group"
                >
                  {innerContent}
                </a>
              ) : (
                <Link
                  key={`m1-${item.id}`}
                  href={item.link}
                  className="flex items-center gap-2.5 text-xs font-semibold text-cream/80 hover:text-sunset-1 transition-colors whitespace-nowrap group"
                >
                  {innerContent}
                </Link>
              );
            })}
          </div>

          {/* Loop 2 */}
          <div className="flex items-center gap-12 pr-12 h-full" aria-hidden="true">
            {items.map((item) => {
              const isExternal = item.link.startsWith("http");
              const innerContent = (
                <>
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${getSeverityStyle(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span>{item.text}</span>
                  <span className="inline-flex items-center text-sunset-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[10px] font-bold">
                    View <ArrowRight className="w-3 h-3 ml-0.5" />
                  </span>
                </>
              );

              return isExternal ? (
                <a
                  key={`m2-${item.id}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs font-semibold text-cream/80 hover:text-sunset-1 transition-colors whitespace-nowrap group"
                >
                  {innerContent}
                </a>
              ) : (
                <Link
                  key={`m2-${item.id}`}
                  href={item.link}
                  className="flex items-center gap-2.5 text-xs font-semibold text-cream/80 hover:text-sunset-1 transition-colors whitespace-nowrap group"
                >
                  {innerContent}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
