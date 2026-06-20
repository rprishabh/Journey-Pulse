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
    // 1. Fetch live alerts
    async function fetchLiveAlerts() {
      try {
        const res = await fetch("/api/advisories/alerts?pageSize=5&resolved=false");
        if (!res.ok) throw new Error("Alerts fetch failed");
        const json = await res.json();
        
        if (json.success && json.data && json.data.length > 0) {
          const formatted: TickerItem[] = json.data.map((alert: any) => ({
            id: alert.id,
            text: `[${alert.alertCategory}] ${alert.title}: ${alert.message.substring(0, 80)}`,
            link: `/travel-advisories?q=${encodeURIComponent(alert.countryCode || alert.title)}`,
            severity: alert.severity,
          }));
          setItems(formatted);
        }
      } catch (error) {
        console.warn("[AlertTicker] Using offline fallbacks:", error);
      }
    }

    fetchLiveAlerts();
    const fetchInterval = setInterval(fetchLiveAlerts, 5 * 60 * 1000);

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
      <div className="h-full bg-sunset-1 px-4 flex items-center gap-1.5 shrink-0 z-10 shadow-md relative pr-6">
        <Flame className="w-3.5 h-3.5 text-cream animate-pulse" />
        <span className="font-display font-black text-[10px] tracking-wider uppercase text-cream leading-none">
          Live Advisories
        </span>
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-r from-sunset-1 to-transparent translate-x-full" />
      </div>

      {/* Marquee Wrapper */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex w-max items-center h-full animate-[ticker-scroll_60s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer">
          {/* Loop 1 */}
          <div className="flex items-center gap-12 pr-12 h-full">
            {items.map((item) => (
              <Link
                key={`m1-${item.id}`}
                href={item.link}
                className="flex items-center gap-2.5 text-xs font-semibold text-cream/80 hover:text-sunset-1 transition-colors whitespace-nowrap group"
              >
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${getSeverityStyle(item.severity)}`}>
                  {item.severity}
                </span>
                <span>{item.text}</span>
                <span className="inline-flex items-center text-sunset-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[10px] font-bold">
                  View <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </Link>
            ))}
          </div>

          {/* Loop 2 */}
          <div className="flex items-center gap-12 pr-12 h-full" aria-hidden="true">
            {items.map((item) => (
              <Link
                key={`m2-${item.id}`}
                href={item.link}
                className="flex items-center gap-2.5 text-xs font-semibold text-cream/80 hover:text-sunset-1 transition-colors whitespace-nowrap group"
              >
                <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold ${getSeverityStyle(item.severity)}`}>
                  {item.severity}
                </span>
                <span>{item.text}</span>
                <span className="inline-flex items-center text-sunset-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[10px] font-bold">
                  View <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
