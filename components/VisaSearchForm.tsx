// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — VisaSearchForm Component
// Client-side search and filtering controllers for the Visa Hub directory.
// Manages URL query parameters dynamically to trigger Server Component queries.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Globe, PlaneTakeoff, PlaneLanding, X, Filter } from "lucide-react";

export function VisaSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Sync local state with URL search parameters ──────────────────────────
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [segment, setSegment] = useState(searchParams.get("segment") ?? "OUTBOUND");
  const [type, setType] = useState(searchParams.get("type") ?? "ALL");

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setSegment(searchParams.get("segment") ?? "OUTBOUND");
    setType(searchParams.get("type") ?? "ALL");
  }, [searchParams]);

  // ── Update URL search parameters ──────────────────────────────────────────
  const updateFilters = (newQ: string, newSegment: string, newType: string) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    if (newSegment && newSegment !== "ALL") params.set("segment", newSegment);
    if (newType && newType !== "ALL") params.set("type", newType);
    params.set("page", "1"); // Reset pagination

    router.push(`/visa-hub?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(q, segment, type);
  };

  const handleClear = () => {
    setQ("");
    setType("ALL");
    updateFilters("", segment, "ALL");
  };

  const handleSegmentChange = (seg: "OUTBOUND" | "INBOUND") => {
    setSegment(seg);
    updateFilters(q, seg, type);
  };

  const VISA_TYPES = [
    { label: "All Visa Types", value: "ALL" },
    { label: "Tourist Visa", value: "TOURIST" },
    { label: "e-Visa", value: "E_VISA" },
    { label: "Visa on Arrival", value: "VISA_ON_ARRIVAL" },
    { label: "Business Visa", value: "BUSINESS" },
    { label: "Medical Visa", value: "MEDICAL" },
    { label: "Transit Visa", value: "TRANSIT" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Segment Toggle Tabs ────────────────────────────────────────────── */}
      <div className="flex bg-surface-150 dark:bg-surface-900 p-1.5 rounded-2xl max-w-md mx-auto border border-surface-200 dark:border-surface-800">
        <button
          onClick={() => handleSegmentChange("OUTBOUND")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-body-sm font-semibold transition-all duration-200 select-none ${
            segment === "OUTBOUND"
              ? "bg-white text-surface-900 shadow-glass dark:bg-surface-800 dark:text-white"
              : "text-surface-500 hover:text-surface-900 dark:hover:text-white"
          }`}
        >
          <PlaneTakeoff className="w-4.5 h-4.5" />
          <span className="hidden sm:inline">Outbound</span><span className="sm:hidden">Out</span>
        </button>
        <button
          onClick={() => handleSegmentChange("INBOUND")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-body-sm font-semibold transition-all duration-200 select-none ${
            segment === "INBOUND"
              ? "bg-white text-surface-900 shadow-glass dark:bg-surface-800 dark:text-white"
              : "text-surface-500 hover:text-surface-900 dark:hover:text-white"
          }`}
        >
          <PlaneLanding className="w-4.5 h-4.5" />
          <span className="hidden sm:inline">Inbound</span><span className="sm:hidden">In</span>
        </button>
      </div>

      {/* ── Search Input and Filter Bar ───────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Country Text Input */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-450">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Type a country name (e.g. Thailand, United Kingdom)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-surface-200 dark:bg-surface-900 dark:border-surface-850 dark:text-white rounded-xl text-body-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
          {q && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600"
              aria-label="Clear search"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Visa Type Selector */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-450">
            <Filter className="w-4.5 h-4.5" />
          </div>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              updateFilters(q, segment, e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 dark:bg-surface-900 dark:border-surface-850 dark:text-white rounded-xl text-body-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer appearance-none"
          >
            {VISA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-500">
            <Globe className="w-4 h-4" />
          </div>
        </div>

        {/* Action Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="btn btn-primary btn-md w-full shadow-glow-brand"
          >
            Filter
          </button>
        </div>
      </form>
    </div>
  );
}
