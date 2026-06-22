// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — AdvisorySearchForm Component
// Client-side advisory filtering controller. Syncs input query values
// (keyword, segment, severity level) to URL search parameters.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShieldAlert, PlaneTakeoff, PlaneLanding, X, Filter } from "lucide-react";

export function AdvisorySearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Sync local state with URL search parameters ──────────────────────────
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [segment, setSegment] = useState(searchParams.get("segment") ?? "OUTBOUND");
  const [level, setLevel] = useState(searchParams.get("level") ?? "ALL");

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
    setSegment(searchParams.get("segment") ?? "OUTBOUND");
    setLevel(searchParams.get("level") ?? "ALL");
  }, [searchParams]);

  // ── Update URL search parameters ──────────────────────────────────────────
  const updateFilters = (newQ: string, newSegment: string, newLevel: string) => {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    if (newSegment && newSegment !== "ALL") params.set("segment", newSegment);
    if (newLevel && newLevel !== "ALL") params.set("level", newLevel);
    params.set("page", "1"); // Reset pagination

    router.push(`/travel-advisories?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(q, segment, level);
  };

  const handleClear = () => {
    setQ("");
    setLevel("ALL");
    updateFilters("", segment, "ALL");
  };

  const handleSegmentChange = (seg: "OUTBOUND" | "INBOUND") => {
    setSegment(seg);
    updateFilters(q, seg, level);
  };

  const SEVERITY_LEVELS = [
    { label: "All Threat Levels", value: "ALL" },
    { label: "Normal Precautions (Level 1)", value: "LEVEL_1_EXERCISE_NORMAL" },
    { label: "Increased Caution (Level 2)", value: "LEVEL_2_EXERCISE_INCREASED" },
    { label: "Reconsider Travel (Level 3)", value: "LEVEL_3_RECONSIDER_TRAVEL" },
    { label: "Do Not Travel (Level 4)", value: "LEVEL_4_DO_NOT_TRAVEL" },
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
        {/* Country Search */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-450">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search country name, affected territories, or risk tags..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-surface-200 dark:bg-surface-900 dark:border-surface-850 dark:text-white rounded-xl text-body-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
          {q && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-650"
              aria-label="Clear search"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Severity Level Dropdown */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-surface-450">
            <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
          </div>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              updateFilters(q, segment, e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 dark:bg-surface-900 dark:border-surface-850 dark:text-white rounded-xl text-body-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer appearance-none"
          >
            {SEVERITY_LEVELS.map((sl) => (
              <option key={sl.value} value={sl.value}>
                {sl.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-500">
            <Filter className="w-4 h-4" />
          </div>
        </div>

        {/* Search Submit */}
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
