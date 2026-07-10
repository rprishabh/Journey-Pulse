// ─────────────────────────────────────────────────────────────────────────────
// Itinerary Maker — Free PDF Generator Page
// /services/itinerary-maker
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Eye,
  Clipboard,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Hotel,
  Train,
  DollarSign,
  CheckCircle,
  XCircle,
  Phone,
  Info,
  Zap,
  ListChecks,
  Palette,
} from "lucide-react";
import type {
  ItineraryData,
  DayPlan,
  AccommodationInfo,
  TransportInfo,
  DestinationThemeKey,
} from "@/types/itinerary";
import { DESTINATION_THEMES } from "@/types/itinerary";
import { parseItineraryContent, createBlankItinerary } from "@/lib/itinerary-parser";

// ═══════════════════════════════════════════════════════════════════════════════
// SAMPLE ITINERARY TEXT (for placeholder / demo)
// ═══════════════════════════════════════════════════════════════════════════════

const SAMPLE_TEXT = `Enchanting Kashmir Valley Tour
5 Nights / 6 Days | 4 Pax

Day 1 - Arrival in Srinagar
Arrive at Srinagar Airport. Transfer to houseboat on Dal Lake. Evening enjoy Shikara ride on the lake. Overnight at Houseboat.
Meals: Dinner

Day 2 - Gulmarg Excursion
After breakfast, drive to Gulmarg (56 km, ~2 hrs). Enjoy Gondola ride to Kongdori/Apharwat Peak. Explore snow-capped meadows. Return to Srinagar.
Meals: Breakfast, Lunch
Overnight: Hotel in Srinagar

Day 3 - Srinagar to Pahalgam
After breakfast, drive to Pahalgam via Saffron fields & Awantipora ruins. Check-in at hotel. Evening free for Lidder river walk.
Meals: Breakfast, Dinner
Overnight: Hotel in Pahalgam

Day 4 - Pahalgam Sightseeing
Full day exploring Aru Valley, Betaab Valley, and Chandanwari. Enjoy pony ride (at own cost). Return to hotel.
Meals: Breakfast, Lunch, Dinner

Day 5 - Pahalgam to Srinagar
Drive back to Srinagar. Visit Mughal Gardens - Nishat Bagh, Shalimar Bagh, Chashme Shahi. Shopping at local markets.
Meals: Breakfast

Day 6 - Departure
After breakfast, transfer to Srinagar Airport for onward journey.
Meals: Breakfast

Accommodation:
- Royal Houseboat, Dal Lake, Srinagar - Deluxe
- Hotel Pine Valley, Srinagar - 3 Star
- Hotel Pahalgam Retreat, Pahalgam - 3 Star

Transport:
- Airport transfers by private Innova
- All sightseeing by private vehicle
- Gulmarg Gondola Phase 1 tickets included

Pricing:
Package Cost: ₹32,000 per person
Total for 4 Pax: ₹1,28,000
GST (5%): ₹6,400
Grand Total: ₹1,34,400
Payment: 50% advance at booking, balance 7 days before travel

Inclusions:
- 5 Nights accommodation (1N Houseboat + 2N Srinagar + 2N Pahalgam)
- Daily breakfast at all hotels
- All transfers and sightseeing by private AC vehicle
- Shikara ride on Dal Lake (1 hour)
- Gulmarg Gondola Phase 1 ticket
- All parking and toll charges
- Driver allowance and fuel charges
- All applicable hotel taxes

Exclusions:
- Airfare to/from Srinagar
- Lunch and dinner (except where mentioned)
- Pony rides, sledge rides at Gulmarg/Pahalgam
- Gulmarg Gondola Phase 2 ticket
- Personal expenses, tips, laundry
- Any adventure activities
- Travel insurance
- Anything not mentioned in inclusions

Terms & Conditions:
- 50% advance required at time of booking
- Balance payment 7 days before departure
- Cancellation charges apply as per policy
- Rates are subject to change during peak season
- In case of natural calamity, itinerary may be modified
- Check-in time 2 PM, Check-out time 12 Noon

Contact Us:
Comfort Journey
Phone: +91 755 4220000
Email: bookings@comfortjourney.in
Website: www.comfortjourney.in
Address: Comfort Journey House, Bhopal, Madhya Pradesh - 462001`;

// ═══════════════════════════════════════════════════════════════════════════════
// GUIDED FORM TABS
// ═══════════════════════════════════════════════════════════════════════════════

const GUIDED_TABS = [
  { id: "trip", label: "Trip Info", icon: MapPin },
  { id: "days", label: "Day Plan", icon: Calendar },
  { id: "accommodation", label: "Stay", icon: Hotel },
  { id: "transport", label: "Transport", icon: Train },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "inclusions", label: "Inc/Exc", icon: CheckCircle },
  { id: "contact", label: "Contact", icon: Phone },
] as const;

type TabId = (typeof GUIDED_TABS)[number]["id"];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ItineraryMakerPage() {
  // ── State ─────────────────────────────────────────────────────────────

  const [mode, setMode] = useState<"quick" | "guided">("quick");
  const [rawText, setRawText] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryData>(createBlankItinerary());
  const [activeTab, setActiveTab] = useState<TabId>("trip");
  const [isParsed, setIsParsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // ── Detected theme ────────────────────────────────────────────────────

  const detectedTheme = useMemo(
    () => DESTINATION_THEMES[itinerary.themeKey] || DESTINATION_THEMES.default,
    [itinerary.themeKey]
  );

  // ── Quick Mode: Parse ─────────────────────────────────────────────────

  const handleParse = useCallback(() => {
    if (!rawText.trim()) return;
    const parsed = parseItineraryContent(rawText);
    setItinerary(parsed);
    setIsParsed(true);
    setShowPreview(true);
  }, [rawText]);

  // ── Load sample ───────────────────────────────────────────────────────

  const handleLoadSample = useCallback(() => {
    setRawText(SAMPLE_TEXT);
  }, []);

  // ── Generate PDF ──────────────────────────────────────────────────────

  const handleGeneratePDF = useCallback(async (action: "download" | "open" = "download") => {
    setIsGenerating(true);
    try {
      // Dynamic import to avoid SSR issues
      const { generateItineraryPDF } = await import("@/lib/itinerary-pdf");
      generateItineraryPDF(itinerary, action);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please check your itinerary data.");
    } finally {
      setIsGenerating(false);
    }
  }, [itinerary]);

  // ── Guided Mode: field updaters ───────────────────────────────────────

  const updateField = useCallback(
    <K extends keyof ItineraryData>(key: K, value: ItineraryData[K]) => {
      setItinerary((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateContact = useCallback(
    (key: keyof ItineraryData["contact"], value: string) => {
      setItinerary((prev) => ({
        ...prev,
        contact: { ...prev.contact, [key]: value },
      }));
    },
    []
  );

  const updatePricing = useCallback(
    (key: keyof ItineraryData["pricing"], value: string) => {
      setItinerary((prev) => ({
        ...prev,
        pricing: { ...prev.pricing, [key]: value },
      }));
    },
    []
  );

  // ── Day management ────────────────────────────────────────────────────

  const addDay = useCallback(() => {
    setItinerary((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          dayNumber: prev.days.length + 1,
          title: "",
          description: "",
          meals: "",
          overnight: "",
        },
      ],
    }));
  }, []);

  const updateDay = useCallback(
    (index: number, field: keyof DayPlan, value: string | number) => {
      setItinerary((prev) => ({
        ...prev,
        days: prev.days.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
      }));
    },
    []
  );

  const removeDay = useCallback((index: number) => {
    setItinerary((prev) => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1 })),
    }));
  }, []);

  // ── Accommodation management ──────────────────────────────────────────

  const addAccommodation = useCallback(() => {
    setItinerary((prev) => ({
      ...prev,
      accommodation: [
        ...prev.accommodation,
        { name: "", location: "", starRating: "", roomType: "", nights: "" },
      ],
    }));
  }, []);

  const updateAccommodation = useCallback(
    (index: number, field: keyof AccommodationInfo, value: string) => {
      setItinerary((prev) => ({
        ...prev,
        accommodation: prev.accommodation.map((a, i) =>
          i === index ? { ...a, [field]: value } : a
        ),
      }));
    },
    []
  );

  const removeAccommodation = useCallback((index: number) => {
    setItinerary((prev) => ({
      ...prev,
      accommodation: prev.accommodation.filter((_, i) => i !== index),
    }));
  }, []);

  // ── Transport management ──────────────────────────────────────────────

  const addTransport = useCallback(() => {
    setItinerary((prev) => ({
      ...prev,
      transport: [
        ...prev.transport,
        { mode: "cab" as const, from: "", to: "", details: "" },
      ],
    }));
  }, []);

  const updateTransport = useCallback(
    (index: number, field: keyof TransportInfo, value: string) => {
      setItinerary((prev) => ({
        ...prev,
        transport: prev.transport.map((t, i) =>
          i === index ? { ...t, [field]: value } : t
        ),
      }));
    },
    []
  );

  const removeTransport = useCallback((index: number) => {
    setItinerary((prev) => ({
      ...prev,
      transport: prev.transport.filter((_, i) => i !== index),
    }));
  }, []);

  // ── Inclusions / Exclusions management ────────────────────────────────

  const addListItem = useCallback((field: "inclusions" | "exclusions" | "terms") => {
    setItinerary((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  }, []);

  const updateListItem = useCallback(
    (field: "inclusions" | "exclusions" | "terms", index: number, value: string) => {
      setItinerary((prev) => ({
        ...prev,
        [field]: prev[field].map((item: string, i: number) => (i === index ? value : item)),
      }));
    },
    []
  );

  const removeListItem = useCallback((field: "inclusions" | "exclusions" | "terms", index: number) => {
    setItinerary((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: string, i: number) => i !== index),
    }));
  }, []);

  // ── Tab navigation ────────────────────────────────────────────────────

  const currentTabIdx = GUIDED_TABS.findIndex((t) => t.id === activeTab);
  const canGoNext = currentTabIdx < GUIDED_TABS.length - 1;
  const canGoPrev = currentTabIdx > 0;

  const goNext = () => {
    if (canGoNext) setActiveTab(GUIDED_TABS[currentTabIdx + 1].id);
  };
  const goPrev = () => {
    if (canGoPrev) setActiveTab(GUIDED_TABS[currentTabIdx - 1].id);
  };

  // ── Counts for preview ────────────────────────────────────────────────

  const sectionCounts = useMemo(() => ({
    days: itinerary.days.length,
    hotels: itinerary.accommodation.length,
    transport: itinerary.transport.length,
    inclusions: itinerary.inclusions.length,
    exclusions: itinerary.exclusions.length,
    terms: itinerary.terms.length,
  }), [itinerary]);

  const hasContent = itinerary.tripTitle || itinerary.days.length > 0 || isParsed;

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen text-ink dark:text-cream">
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-50 via-white to-surface-100 dark:from-surface-950 dark:via-ink dark:to-surface-900" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sunset-1/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sunset-4/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative container-wide py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-sunset-1/10 border border-sunset-1/25 text-sunset-1">
              <Sparkles className="w-3.5 h-3.5" />
              100% Free — No Sign-up Required
            </div>

            <h1 className="font-display font-black text-display-sm md:text-display-md leading-none tracking-tighter">
              Create Beautiful{" "}
              <span className="text-gradient-hero">Travel Itineraries</span>
            </h1>

            <p className="text-body-lg text-ink/70 dark:text-cream/70 max-w-xl mx-auto">
              Paste your itinerary content and generate a stunning, branded PDF
              with company letterhead, destination-themed design, and professional
              formatting — all in seconds.
            </p>

            {/* Mode Toggle */}
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setMode("quick")}
                className={`btn btn-md rounded-xl font-bold transition-all ${
                  mode === "quick"
                    ? "bg-sunset-1 text-white shadow-lg shadow-sunset-1/30"
                    : "bg-surface-100 text-ink/70 dark:bg-surface-800 dark:text-cream/70 hover:bg-surface-200 dark:hover:bg-surface-700"
                }`}
              >
                <Zap className="w-4 h-4" />
                Quick Paste
              </button>
              <button
                onClick={() => setMode("guided")}
                className={`btn btn-md rounded-xl font-bold transition-all ${
                  mode === "guided"
                    ? "bg-sunset-1 text-white shadow-lg shadow-sunset-1/30"
                    : "bg-surface-100 text-ink/70 dark:bg-surface-800 dark:text-cream/70 hover:bg-surface-200 dark:hover:bg-surface-700"
                }`}
              >
                <ListChecks className="w-4 h-4" />
                Guided Form
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <section className="container-wide pb-20">
        <div className="max-w-6xl mx-auto">
          {mode === "quick" ? (
            /* ════════════════════════════════════════════════════════════
               QUICK MODE
               ════════════════════════════════════════════════════════════ */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-heading-md flex items-center gap-2">
                    <Clipboard className="w-5 h-5 text-sunset-1" />
                    Paste Your Itinerary
                  </h2>
                  <button
                    onClick={handleLoadSample}
                    className="text-xs font-bold text-sunset-1 hover:text-sunset-2 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Load Sample
                  </button>
                </div>

                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    setIsParsed(false);
                  }}
                  placeholder="Paste your complete itinerary content here...&#10;&#10;Include details like:&#10;• Trip title and destinations&#10;• Day 1, Day 2, Day 3... with activities&#10;• Hotel/accommodation details&#10;• Transport (flights, trains, cabs)&#10;• Pricing breakdown&#10;• Inclusions &amp; Exclusions&#10;• Contact information&#10;&#10;The parser will automatically detect and structure all sections!"
                  className="w-full h-[500px] p-5 rounded-2xl text-sm font-mono leading-relaxed
                    bg-white dark:bg-surface-900 border-2 border-surface-200 dark:border-surface-800
                    focus:border-sunset-1 dark:focus:border-sunset-1 focus:ring-4 focus:ring-sunset-1/10
                    outline-none transition-all resize-none
                    placeholder:text-surface-400 dark:placeholder:text-surface-600"
                  spellCheck={false}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleParse}
                    disabled={!rawText.trim()}
                    className="btn btn-md btn-primary flex-1 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4.5 h-4.5" />
                    Parse & Preview
                  </button>
                  <button
                    onClick={() => handleGeneratePDF("download")}
                    disabled={!isParsed || isGenerating}
                    className="btn btn-md rounded-xl flex-1 font-bold
                      bg-gradient-to-r from-sunset-4 to-sunset-3 text-white
                      shadow-lg shadow-sunset-4/20
                      hover:shadow-xl hover:shadow-sunset-4/30
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4.5 h-4.5" />
                        Download PDF
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleGeneratePDF("open")}
                    disabled={!isParsed || isGenerating}
                    className="btn btn-md btn-secondary rounded-xl flex-1 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4.5 h-4.5 text-sunset-1" />
                    Open / Print PDF
                  </button>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="space-y-4">
                <h2 className="font-display font-bold text-heading-md flex items-center gap-2">
                  <Eye className="w-5 h-5 text-sunset-4" />
                  Parsed Preview
                </h2>

                {isParsed ? (
                  <div className="glass rounded-2xl p-6 space-y-5 max-h-[560px] overflow-y-auto no-scrollbar">
                    {/* Theme Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: detectedTheme.primary }}
                      >
                        <Palette className="w-3 h-3" />
                        {detectedTheme.emoji} {detectedTheme.label} Theme
                      </span>
                      {itinerary.destinations.map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                          style={{
                            borderColor: detectedTheme.primary + "40",
                            color: detectedTheme.primary,
                            backgroundColor: detectedTheme.tint,
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Trip Title */}
                    {itinerary.tripTitle && (
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-sunset-1">
                          Trip Title
                        </span>
                        <p className="font-bold text-lg">{itinerary.tripTitle}</p>
                      </div>
                    )}

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Duration", value: itinerary.duration || "—", icon: "📅" },
                        { label: "Travellers", value: itinerary.pax || "—", icon: "👤" },
                        { label: "Days", value: `${sectionCounts.days}`, icon: "🗓" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="text-center p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50"
                        >
                          <span className="text-lg">{s.icon}</span>
                          <p className="text-xs font-bold mt-1">{s.value}</p>
                          <p className="text-[10px] text-ink/50 dark:text-cream/50">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Section counts */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-sunset-2">
                        Detected Sections
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "Days", count: sectionCounts.days, color: "#2563EB" },
                          { label: "Hotels", count: sectionCounts.hotels, color: "#059669" },
                          { label: "Transport", count: sectionCounts.transport, color: "#D97706" },
                          { label: "Inclusions", count: sectionCounts.inclusions, color: "#10B981" },
                          { label: "Exclusions", count: sectionCounts.exclusions, color: "#EF4444" },
                          { label: "Terms", count: sectionCounts.terms, color: "#8B5CF6" },
                        ].map((s) => (
                          <span
                            key={s.label}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"
                            style={{
                              backgroundColor: s.color + "15",
                              color: s.color,
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: s.color }}
                            />
                            {s.count} {s.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Day preview list */}
                    {itinerary.days.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-sunset-1">
                          Day-wise Plan
                        </span>
                        {itinerary.days.map((day) => (
                          <div
                            key={day.dayNumber}
                            className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50"
                          >
                            <span
                              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
                              style={{ backgroundColor: detectedTheme.primary }}
                            >
                              {day.dayNumber}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-sm truncate">{day.title}</p>
                              <p className="text-xs text-ink/60 dark:text-cream/60 line-clamp-2">
                                {day.description.substring(0, 120)}...
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pricing preview */}
                    {itinerary.pricing.total && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-sunset-1/10 to-sunset-3/10 border border-sunset-1/20">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-sunset-1">
                          Total Cost
                        </span>
                        <p className="font-black text-xl mt-1">{itinerary.pricing.total}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass rounded-2xl p-12 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-sunset-1/10 flex items-center justify-center">
                      <FileText className="w-10 h-10 text-sunset-1/50" />
                    </div>
                    <p className="text-sm text-ink/50 dark:text-cream/50 max-w-xs mx-auto">
                      Paste your itinerary content on the left and click
                      &ldquo;Parse & Preview&rdquo; to see the structured output here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ════════════════════════════════════════════════════════════
               GUIDED MODE
               ════════════════════════════════════════════════════════════ */
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex overflow-x-auto no-scrollbar gap-1 p-1.5 rounded-2xl glass">
                {GUIDED_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-sunset-1 text-white shadow-lg shadow-sunset-1/30"
                          : "text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream hover:bg-surface-100 dark:hover:bg-surface-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="glass rounded-2xl p-6 md:p-8 min-h-[420px]">
                {/* ── Trip Info Tab ─── */}
                {activeTab === "trip" && (
                  <div className="space-y-5 max-w-2xl">
                    <h3 className="font-display font-bold text-heading-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-sunset-1" />
                      Trip Information
                    </h3>
                    <div className="space-y-4">
                      <InputField
                        label="Trip Title / Package Name"
                        value={itinerary.tripTitle}
                        onChange={(v) => updateField("tripTitle", v)}
                        placeholder="e.g. Enchanting Kashmir Valley Tour"
                      />
                      <InputField
                        label="Destinations (comma separated)"
                        value={itinerary.destinations.join(", ")}
                        onChange={(v) =>
                          updateField(
                            "destinations",
                            v.split(",").map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Duration"
                          value={itinerary.duration}
                          onChange={(v) => updateField("duration", v)}
                          placeholder="e.g. 5 Nights / 6 Days"
                        />
                        <InputField
                          label="No. of Travellers"
                          value={itinerary.pax}
                          onChange={(v) => updateField("pax", v)}
                          placeholder="e.g. 4"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Start Date"
                          value={itinerary.startDate}
                          onChange={(v) => updateField("startDate", v)}
                          placeholder="e.g. 15 Dec 2025"
                        />
                        <InputField
                          label="End Date"
                          value={itinerary.endDate}
                          onChange={(v) => updateField("endDate", v)}
                          placeholder="e.g. 20 Dec 2025"
                        />
                      </div>

                      {/* Theme selector */}
                      <div>
                        <label className="block text-xs font-bold text-ink/60 dark:text-cream/60 uppercase tracking-wider mb-2">
                          Destination Theme
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {Object.values(DESTINATION_THEMES).map((th) => (
                            <button
                              key={th.key}
                              onClick={() => updateField("themeKey", th.key)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                itinerary.themeKey === th.key
                                  ? "text-white border-transparent shadow-lg"
                                  : "border-surface-200 dark:border-surface-700 text-ink/70 dark:text-cream/70 hover:border-surface-400"
                              }`}
                              style={
                                itinerary.themeKey === th.key
                                  ? { backgroundColor: th.primary }
                                  : {}
                              }
                            >
                              {th.emoji} {th.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Days Tab ─── */}
                {activeTab === "days" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-heading-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-sunset-1" />
                        Day-Wise Itinerary
                      </h3>
                      <button
                        onClick={addDay}
                        className="btn btn-sm btn-primary rounded-xl"
                      >
                        <Plus className="w-4 h-4" />
                        Add Day
                      </button>
                    </div>

                    {itinerary.days.length === 0 ? (
                      <EmptyState
                        text="No days added yet. Click 'Add Day' to start building your itinerary."
                        icon="📅"
                      />
                    ) : (
                      <div className="space-y-4">
                        {itinerary.days.map((day, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-sunset-1 text-white flex items-center justify-center text-xs font-black">
                                  {day.dayNumber}
                                </span>
                                Day {day.dayNumber}
                              </span>
                              <button
                                onClick={() => removeDay(idx)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <InputField
                              label="Title"
                              value={day.title}
                              onChange={(v) => updateDay(idx, "title", v)}
                              placeholder="e.g. Arrival in Srinagar"
                            />
                            <div>
                              <label className="block text-xs font-bold text-ink/60 dark:text-cream/60 uppercase tracking-wider mb-1.5">
                                Description
                              </label>
                              <textarea
                                value={day.description}
                                onChange={(e) => updateDay(idx, "description", e.target.value)}
                                placeholder="Describe the day's activities, sightseeing, meals, etc."
                                className="w-full p-3 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none transition-colors resize-none h-20"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <InputField
                                label="Meals"
                                value={day.meals || ""}
                                onChange={(v) => updateDay(idx, "meals", v)}
                                placeholder="e.g. Breakfast, Dinner"
                              />
                              <InputField
                                label="Overnight"
                                value={day.overnight || ""}
                                onChange={(v) => updateDay(idx, "overnight", v)}
                                placeholder="e.g. Hotel in Srinagar"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Accommodation Tab ─── */}
                {activeTab === "accommodation" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-heading-lg flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-sunset-1" />
                        Accommodation
                      </h3>
                      <button onClick={addAccommodation} className="btn btn-sm btn-primary rounded-xl">
                        <Plus className="w-4 h-4" />
                        Add Hotel
                      </button>
                    </div>

                    {itinerary.accommodation.length === 0 ? (
                      <EmptyState text="No hotels added yet." icon="🏨" />
                    ) : (
                      <div className="space-y-4">
                        {itinerary.accommodation.map((hotel, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm">🏨 Hotel {idx + 1}</span>
                              <button
                                onClick={() => removeAccommodation(idx)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <InputField
                                label="Hotel Name"
                                value={hotel.name}
                                onChange={(v) => updateAccommodation(idx, "name", v)}
                                placeholder="e.g. Hotel Pine Valley"
                              />
                              <InputField
                                label="Location"
                                value={hotel.location}
                                onChange={(v) => updateAccommodation(idx, "location", v)}
                                placeholder="e.g. Srinagar"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <InputField
                                label="Category"
                                value={hotel.starRating || ""}
                                onChange={(v) => updateAccommodation(idx, "starRating", v)}
                                placeholder="e.g. 3 Star"
                              />
                              <InputField
                                label="Room Type"
                                value={hotel.roomType || ""}
                                onChange={(v) => updateAccommodation(idx, "roomType", v)}
                                placeholder="e.g. Deluxe"
                              />
                              <InputField
                                label="Nights"
                                value={hotel.nights || ""}
                                onChange={(v) => updateAccommodation(idx, "nights", v)}
                                placeholder="e.g. 2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Transport Tab ─── */}
                {activeTab === "transport" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-heading-lg flex items-center gap-2">
                        <Train className="w-5 h-5 text-sunset-1" />
                        Transport Details
                      </h3>
                      <button onClick={addTransport} className="btn btn-sm btn-primary rounded-xl">
                        <Plus className="w-4 h-4" />
                        Add Transport
                      </button>
                    </div>

                    {itinerary.transport.length === 0 ? (
                      <EmptyState text="No transport details added yet." icon="🚂" />
                    ) : (
                      <div className="space-y-4">
                        {itinerary.transport.map((tp, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm">🚐 Transport {idx + 1}</span>
                              <button
                                onClick={() => removeTransport(idx)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-ink/60 dark:text-cream/60 uppercase tracking-wider mb-1.5">
                                  Mode
                                </label>
                                <select
                                  value={tp.mode}
                                  onChange={(e) => updateTransport(idx, "mode", e.target.value)}
                                  className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none"
                                >
                                  <option value="flight">✈ Flight</option>
                                  <option value="train">🚂 Train</option>
                                  <option value="cab">🚗 Cab</option>
                                  <option value="bus">🚌 Bus</option>
                                  <option value="ferry">⛴ Ferry</option>
                                  <option value="other">🚐 Other</option>
                                </select>
                              </div>
                              <InputField
                                label="From"
                                value={tp.from}
                                onChange={(v) => updateTransport(idx, "from", v)}
                                placeholder="e.g. Delhi"
                              />
                              <InputField
                                label="To"
                                value={tp.to}
                                onChange={(v) => updateTransport(idx, "to", v)}
                                placeholder="e.g. Srinagar"
                              />
                              <InputField
                                label="Reference"
                                value={tp.reference || ""}
                                onChange={(v) => updateTransport(idx, "reference", v)}
                                placeholder="e.g. 6E-2041"
                              />
                            </div>
                            <InputField
                              label="Details"
                              value={tp.details}
                              onChange={(v) => updateTransport(idx, "details", v)}
                              placeholder="e.g. IndiGo flight 6E-2041 departing 06:30 AM"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Pricing Tab ─── */}
                {activeTab === "pricing" && (
                  <div className="space-y-5 max-w-2xl">
                    <h3 className="font-display font-bold text-heading-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-sunset-1" />
                      Pricing Details
                    </h3>

                    <InputField
                      label="Price Summary"
                      value={itinerary.pricing.summary}
                      onChange={(v) => updatePricing("summary", v)}
                      placeholder="e.g. ₹32,000 per person (twin sharing)"
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-ink/60 dark:text-cream/60 uppercase tracking-wider">
                          Line Items
                        </label>
                        <button
                          onClick={() =>
                            updateField("pricing", {
                              ...itinerary.pricing,
                              items: [...itinerary.pricing.items, { label: "", amount: "" }],
                            })
                          }
                          className="text-xs font-bold text-sunset-1 hover:text-sunset-2 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Item
                        </button>
                      </div>
                      {itinerary.pricing.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-end">
                          <div className="flex-1">
                            <input
                              value={item.label}
                              onChange={(e) => {
                                const items = [...itinerary.pricing.items];
                                items[idx] = { ...items[idx], label: e.target.value };
                                updateField("pricing", { ...itinerary.pricing, items });
                              }}
                              placeholder="Label (e.g. Package Cost)"
                              className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none"
                            />
                          </div>
                          <div className="w-40">
                            <input
                              value={item.amount}
                              onChange={(e) => {
                                const items = [...itinerary.pricing.items];
                                items[idx] = { ...items[idx], amount: e.target.value };
                                updateField("pricing", { ...itinerary.pricing, items });
                              }}
                              placeholder="₹ Amount"
                              className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const items = itinerary.pricing.items.filter((_, i) => i !== idx);
                              updateField("pricing", { ...itinerary.pricing, items });
                            }}
                            className="p-2 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <InputField
                      label="Grand Total"
                      value={itinerary.pricing.total}
                      onChange={(v) => updatePricing("total", v)}
                      placeholder="e.g. ₹1,34,400"
                    />

                    <div>
                      <label className="block text-xs font-bold text-ink/60 dark:text-cream/60 uppercase tracking-wider mb-1.5">
                        Payment Terms
                      </label>
                      <textarea
                        value={itinerary.pricing.paymentTerms}
                        onChange={(e) => updatePricing("paymentTerms", e.target.value)}
                        placeholder="e.g. 50% advance at booking, balance 7 days before travel"
                        className="w-full p-3 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none resize-none h-20"
                      />
                    </div>
                  </div>
                )}

                {/* ── Inclusions/Exclusions Tab ─── */}
                {activeTab === "inclusions" && (
                  <div className="space-y-8">
                    {/* Inclusions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-heading-md flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          Inclusions
                        </h3>
                        <button
                          onClick={() => addListItem("inclusions")}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                      {itinerary.inclusions.length === 0 ? (
                        <EmptyState text="No inclusions added." icon="✅" small />
                      ) : (
                        itinerary.inclusions.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="text-emerald-500 text-sm">✓</span>
                            <input
                              value={item}
                              onChange={(e) => updateListItem("inclusions", idx, e.target.value)}
                              placeholder="e.g. Daily breakfast at all hotels"
                              className="flex-1 p-2.5 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none"
                            />
                            <button
                              onClick={() => removeListItem("inclusions", idx)}
                              className="p-1.5 text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Exclusions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-heading-md flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          Exclusions
                        </h3>
                        <button
                          onClick={() => addListItem("exclusions")}
                          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                      {itinerary.exclusions.length === 0 ? (
                        <EmptyState text="No exclusions added." icon="❌" small />
                      ) : (
                        itinerary.exclusions.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="text-red-500 text-sm">✗</span>
                            <input
                              value={item}
                              onChange={(e) => updateListItem("exclusions", idx, e.target.value)}
                              placeholder="e.g. Airfare to/from Srinagar"
                              className="flex-1 p-2.5 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none"
                            />
                            <button
                              onClick={() => removeListItem("exclusions", idx)}
                              className="p-1.5 text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Terms */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-bold text-heading-md flex items-center gap-2">
                          <Info className="w-5 h-5 text-purple-500" />
                          Terms & Conditions
                        </h3>
                        <button
                          onClick={() => addListItem("terms")}
                          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                      {itinerary.terms.length === 0 ? (
                        <EmptyState text="No terms added." icon="📋" small />
                      ) : (
                        itinerary.terms.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="text-purple-500 text-xs font-bold">{idx + 1}.</span>
                            <input
                              value={item}
                              onChange={(e) => updateListItem("terms", idx, e.target.value)}
                              placeholder="e.g. 50% advance required at time of booking"
                              className="flex-1 p-2.5 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 outline-none"
                            />
                            <button
                              onClick={() => removeListItem("terms", idx)}
                              className="p-1.5 text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* ── Contact Tab ─── */}
                {activeTab === "contact" && (
                  <div className="space-y-5 max-w-2xl">
                    <h3 className="font-display font-bold text-heading-lg flex items-center gap-2">
                      <Phone className="w-5 h-5 text-sunset-1" />
                      Company / Contact Info
                    </h3>
                    <p className="text-xs text-ink/50 dark:text-cream/50">
                      This information appears in the PDF header, footer, and contact section.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Company Name"
                        value={itinerary.contact.companyName}
                        onChange={(v) => updateContact("companyName", v)}
                        placeholder="e.g. Comfort Journey"
                      />
                      <InputField
                        label="Tagline"
                        value={itinerary.contact.tagline}
                        onChange={(v) => updateContact("tagline", v)}
                        placeholder="e.g. Only premium experience. No compromises."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Phone"
                        value={itinerary.contact.phone}
                        onChange={(v) => updateContact("phone", v)}
                        placeholder="e.g. +91 755 4220000"
                      />
                      <InputField
                        label="Email"
                        value={itinerary.contact.email}
                        onChange={(v) => updateContact("email", v)}
                        placeholder="e.g. bookings@comfortjourney.in"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Website"
                        value={itinerary.contact.website}
                        onChange={(v) => updateContact("website", v)}
                        placeholder="e.g. www.comfortjourney.in"
                      />
                      <InputField
                        label="Address"
                        value={itinerary.contact.address}
                        onChange={(v) => updateContact("address", v)}
                        placeholder="e.g. Comfort Journey House, Bhopal"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tab Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={!canGoPrev}
                  className="btn btn-md btn-secondary rounded-xl disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-3">
                  {canGoNext ? (
                    <button onClick={goNext} className="btn btn-md btn-primary rounded-xl">
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleGeneratePDF("download")}
                        disabled={isGenerating || !itinerary.tripTitle}
                        className="btn btn-lg rounded-xl font-bold
                          bg-gradient-to-r from-sunset-4 to-sunset-3 text-white
                          shadow-lg shadow-sunset-4/20
                          hover:shadow-xl hover:shadow-sunset-4/30
                          disabled:opacity-40 disabled:cursor-not-allowed
                          transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Generate & Download PDF
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleGeneratePDF("open")}
                        disabled={isGenerating || !itinerary.tripTitle}
                        className="btn btn-lg btn-secondary rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Eye className="w-5 h-5 text-sunset-1" />
                        Open / Print PDF
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────── */}
      <section className="container-wide pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold text-sunset-2 tracking-widest">
              Why Use This Tool
            </span>
            <h2 className="font-display font-black text-heading-xl mt-2">
              Professional Itineraries in Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎨",
                title: "Destination-Aware Design",
                desc: "Auto-detects places like Kashmir, Goa, Rajasthan and applies matching color themes, decorative elements, and travel vibes to your PDF.",
              },
              {
                icon: "📄",
                title: "Company Letterhead",
                desc: "Your brand on every page — custom company name, logo, tagline, and contact info in professional headers and footers.",
              },
              {
                icon: "⚡",
                title: "100% Free & Private",
                desc: "Everything runs in your browser. No data uploads, no sign-up, no hidden charges. Your itinerary data never leaves your device.",
              },
              {
                icon: "🧠",
                title: "Smart Content Parser",
                desc: "Paste raw text and our parser automatically structures days, hotels, transport, pricing, inclusions, and exclusions.",
              },
              {
                icon: "📱",
                title: "Two Input Modes",
                desc: "Quick Paste for speed, or Guided Form for precision. Both produce the same beautiful PDF output.",
              },
              {
                icon: "🌍",
                title: "9 Travel Themes",
                desc: "Mountains, Beach, Desert, Heritage, Tropical, Urban, Spiritual, International — each with unique colors and graphics.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 space-y-3 hover:shadow-card-hover transition-shadow duration-300"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-bold text-sm">{f.title}</h3>
                <p className="text-xs text-ink/60 dark:text-cream/60 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REUSABLE SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-ink/60 dark:text-cream/60 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2.5 rounded-xl text-sm bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 focus:border-sunset-1 dark:focus:border-sunset-1 outline-none transition-colors"
      />
    </div>
  );
}

function EmptyState({ text, icon, small }: { text: string; icon: string; small?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center space-y-2 ${
        small ? "py-6" : "py-12"
      }`}
    >
      <span className={small ? "text-2xl" : "text-4xl"}>{icon}</span>
      <p className="text-xs text-ink/40 dark:text-cream/40 max-w-xs">{text}</p>
    </div>
  );
}
