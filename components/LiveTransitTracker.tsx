"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Train,
  Plane,
  Grid3X3,
  Search,
  ExternalLink,
  AlertCircle,
  Clock,
  Building2,
  ArrowRight,
  Luggage,
  Timer,
  PlaneTakeoff,
  PlaneLanding,
  MapPin,
  RefreshCw,
} from "lucide-react";

type TabId = "train" | "flight" | "seat";

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const TABS: TabConfig[] = [
  { id: "train", label: "Train Enquiry", icon: Train, gradient: "from-sunset-1 to-sunset-2" },
  { id: "flight", label: "Flight Tracker", icon: Plane, gradient: "from-sunset-3 to-sunset-4" },
  { id: "seat", label: "Seat Matrix", icon: Grid3X3, gradient: "from-sunset-4 to-sunset-1" },
];

interface FlightResult {
  flight: string;
  airline: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: string;
  gate?: string;
  terminal?: string;
}

const MOCK_FLIGHTS: Record<string, FlightResult> = {
  AI101: { flight: "AI101", airline: "Air India", origin: "DEL", destination: "JFK", departure: "01:30", arrival: "06:45", status: "On Time", gate: "G12", terminal: "3" },
  AI102: { flight: "AI102", airline: "Air India", origin: "BOM", destination: "LHR", departure: "23:55", arrival: "05:30", status: "Boarding", gate: "B4", terminal: "2" },
  EK502: { flight: "EK502", airline: "Emirates", origin: "DXB", destination: "SYD", departure: "02:15", arrival: "22:30", status: "On Time", gate: "A7", terminal: "3" },
  EK503: { flight: "EK503", airline: "Emirates", origin: "MAA", destination: "DXB", departure: "21:40", arrival: "00:10", status: "Delayed", gate: "C9", terminal: "1" },
  SG123: { flight: "SG123", airline: "SpiceJet", origin: "DEL", destination: "BLR", departure: "06:00", arrival: "08:30", status: "Scheduled", gate: "D3", terminal: "1" },
  UK456: { flight: "UK456", airline: "Vistara", origin: "CCU", destination: "BOM", departure: "14:20", arrival: "16:50", status: "On Time", gate: "E5", terminal: "2" },
};

const STATUS_COLORS: Record<string, string> = {
  "On Time": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  "Boarding": "text-sky-500 bg-sky-500/10 border-sky-500/20",
  "Delayed": "text-sunset-1 bg-sunset-1/10 border-sunset-1/20",
  "Scheduled": "text-surface-600 bg-white/10 border-white/15",
  "Cancelled": "text-red-500 bg-red-500/10 border-red-500/20",
  "Landed": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
};

export function LiveTransitTracker() {
  const [activeTab, setActiveTab] = useState<TabId>("train");

  const [pnrInput, setPnrInput] = useState("");
  const [trainInput, setTrainInput] = useState("");
  const [pnrError, setPnrError] = useState("");
  const [trainError, setTrainError] = useState("");

  const [flightCode, setFlightCode] = useState("");
  const [flightResult, setFlightResult] = useState<FlightResult | null>(null);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState("");

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handlePnrSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPnrError("");

    const clean = pnrInput.replace(/\s/g, "");
    if (!/^\d{10}$/.test(clean)) {
      setPnrError("PNR must be exactly 10 digits");
      return;
    }

    alert("You are being redirected to the official Indian Railways Passenger Enquiry portal (indianrail.gov.in) to check your PNR status.");
    window.open("https://www.indianrail.gov.in/enquiry/PNR/PNR_Enq.html", "_blank", "noopener,noreferrer");
  }, [pnrInput]);

  const handleTrainSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setTrainError("");

    const clean = trainInput.trim();
    if (!/^\d{4,5}$/.test(clean)) {
      setTrainError("Enter a valid 4-5 digit train number");
      return;
    }

    alert("You are being redirected to the official Indian Railways Passenger Enquiry portal (indianrail.gov.in) to check train running status. Please enter your train number on the page.");
    window.open("https://www.indianrail.gov.in/enquiry/TrainStatus/TrainStatus.html", "_blank", "noopener,noreferrer");
  }, [trainInput]);

  const handleFlightSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFlightError("");
    setFlightResult(null);

    const clean = flightCode.trim().toUpperCase();
    if (!/^[A-Z]{2}\d{1,4}$/.test(clean)) {
      setFlightError("Enter a valid flight code (e.g. AI101, EK502)");
      return;
    }

    setFlightLoading(true);

    try {
      const res = await fetch(`/api/travel/flight?code=${encodeURIComponent(clean)}`);
      const body = await res.json();

      if (!body.success) {
        setFlightError(body.error?.message || "Failed to fetch flight data");
        return;
      }

      if (!body.data) {
        setFlightError("No flight found with that code");
        return;
      }

      setFlightResult(body.data);
    } catch {
      setFlightError("Network error. Please try again.");
    } finally {
      setFlightLoading(false);
    }
  }, [flightCode]);

  const handleSeatSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const from = origin.trim().toUpperCase();
    const to = destination.trim().toUpperCase();

    if (!from || !to) return;

    const irctcUrl = `https://www.irctc.co.in/nget/train-search`;
    alert(
      `You are being redirected to the official IRCTC portal to check seat availability between ${from} and ${to}.`
    );
    window.open(irctcUrl, "_blank", "noopener,noreferrer");
  }, [origin, destination]);

  return (
    <section className="container-wide scroll-mt-24" id="live-transit-tracker">
      <div className="glass rounded-3xl p-6 md:p-8 border border-sunset-1/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sunset-1/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sunset-4/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-sunset-1 tracking-widest bg-sunset-1/10 px-2.5 py-0.5 rounded border border-sunset-1/20">
              Transit Hub
            </span>
            <h2 className="font-display font-black text-heading-xl text-ink dark:text-cream leading-tight">
              Live Transit <span className="text-gradient-hero">Tracker</span>
            </h2>
            <p className="text-body-sm text-ink/70 dark:text-cream/70">
              Real-time train enquiry, flight tracking & seat availability.
            </p>
          </div>

          <div className="inline-flex p-1 bg-ink/30 dark:bg-ink/50 backdrop-blur-md rounded-xl border border-white/5 self-start">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md`
                      : "text-ink/60 dark:text-cream/60 hover:text-ink dark:hover:text-cream"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === "train" && (
              <motion.div
                key="train"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="glass-strong border border-sunset-1/10 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-sunset-1/10 border-sunset-1/20 text-sunset-1">
                      <Luggage className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-heading-sm text-ink dark:text-cream leading-tight">
                        PNR Status
                      </h3>
                      <span className="text-[9px] font-bold text-sunset-1 uppercase tracking-widest">
                        10-digit PNR Enquiry
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handlePnrSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink/70 dark:text-cream/70 uppercase tracking-wider">
                        Enter PNR Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={pnrInput}
                        onChange={(e) => {
                          setPnrInput(e.target.value.replace(/\D/g, ""));
                          setPnrError("");
                        }}
                        placeholder="e.g. 1234567890"
                        className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-ink/40 border border-white/20 text-ink dark:text-cream text-sm font-medium placeholder:text-ink/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-sunset-1/50 transition-all"
                      />
                      {pnrError && (
                        <p className="text-[10px] font-semibold text-red-500 flex items-center gap-1 pt-1">
                          <AlertCircle className="w-3 h-3" />
                          {pnrError}
                        </p>
                      )}
                    </div>
                    <button type="submit" className="btn btn-md btn-primary w-full justify-center">
                      <Search className="w-4 h-4" />
                      Check PNR Status
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <p className="text-[9px] text-ink/50 dark:text-cream/50 text-center flex items-center justify-center gap-1">
                      <ExternalLink className="w-2.5 h-2.5" />
                      Redirects to indianrail.gov.in
                    </p>
                  </form>
                </div>

                <div className="glass-strong border border-sunset-2/10 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-sunset-2/10 border-sunset-2/20 text-sunset-2">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-heading-sm text-ink dark:text-cream leading-tight">
                        Train Running Status
                      </h3>
                      <span className="text-[9px] font-bold text-sunset-2 uppercase tracking-widest">
                        Real-time Location & Delay
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleTrainSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink/70 dark:text-cream/70 uppercase tracking-wider">
                        Enter Train Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        value={trainInput}
                        onChange={(e) => {
                          setTrainInput(e.target.value.replace(/\D/g, ""));
                          setTrainError("");
                        }}
                        placeholder="e.g. 12345"
                        className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-ink/40 border border-white/20 text-ink dark:text-cream text-sm font-medium placeholder:text-ink/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-sunset-2/50 transition-all"
                      />
                      {trainError && (
                        <p className="text-[10px] font-semibold text-red-500 flex items-center gap-1 pt-1">
                          <AlertCircle className="w-3 h-3" />
                          {trainError}
                        </p>
                      )}
                    </div>
                    <button type="submit" className="btn btn-md btn-primary w-full justify-center">
                      <Search className="w-4 h-4" />
                      Track Train
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    <p className="text-[9px] text-ink/50 dark:text-cream/50 text-center flex items-center justify-center gap-1">
                      <ExternalLink className="w-2.5 h-2.5" />
                      Redirects to indianrail.gov.in
                    </p>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === "flight" && (
              <motion.div
                key="flight"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto space-y-6"
              >
                <form onSubmit={handleFlightSearch} className="glass-strong border border-sunset-3/10 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-sunset-3/10 border-sunset-3/20 text-sunset-3">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-heading-sm text-ink dark:text-cream leading-tight">
                        Search Flight
                      </h3>
                      <span className="text-[9px] font-bold text-sunset-3 uppercase tracking-widest">
                        Airline & Flight Code Lookup
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-ink/70 dark:text-cream/70 uppercase tracking-wider">
                      Flight Code
                    </label>
                    <input
                      type="text"
                      value={flightCode}
                      onChange={(e) => {
                        setFlightCode(e.target.value.toUpperCase());
                        setFlightError("");
                      }}
                      placeholder="e.g. AI101, EK502"
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-ink/40 border border-white/20 text-ink dark:text-cream text-sm font-medium placeholder:text-ink/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-sunset-3/50 transition-all uppercase"
                    />
                    {flightError && (
                      <p className="text-[10px] font-semibold text-red-500 flex items-center gap-1 pt-1">
                        <AlertCircle className="w-3 h-3" />
                        {flightError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={flightLoading}
                    className="btn btn-md btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {flightLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Track Flight
                      </>
                    )}
                  </button>
                </form>

                <AnimatePresence>
                  {flightResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="glass-strong border border-sunset-3/10 p-6 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-sunset-3/10 border-sunset-3/20 text-sunset-3">
                            <PlaneTakeoff className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-display font-black text-heading-sm text-ink dark:text-cream leading-tight">
                              {flightResult.flight}
                            </h3>
                            <span className="text-[9px] font-bold text-sunset-3 uppercase tracking-widest">
                              {flightResult.airline}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`badge text-[9px] px-2.5 py-0.5 border ${
                            STATUS_COLORS[flightResult.status] || STATUS_COLORS["Scheduled"]
                          }`}
                        >
                          {flightResult.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-ink/50 dark:text-cream/50 uppercase tracking-wider flex items-center gap-1">
                            <PlaneTakeoff className="w-3 h-3" />
                            Departure
                          </span>
                          <p className="font-display font-black text-heading-sm text-ink dark:text-cream">
                            {flightResult.origin}
                          </p>
                          <p className="text-xs font-semibold text-ink/70 dark:text-cream/70">
                            {flightResult.departure}
                          </p>
                        </div>
                        <div className="space-y-1 text-right">
                          <span className="text-[9px] font-bold text-ink/50 dark:text-cream/50 uppercase tracking-wider flex items-center justify-end gap-1">
                            <PlaneLanding className="w-3 h-3" />
                            Arrival
                          </span>
                          <p className="font-display font-black text-heading-sm text-ink dark:text-cream">
                            {flightResult.destination}
                          </p>
                          <p className="text-xs font-semibold text-ink/70 dark:text-cream/70">
                            {flightResult.arrival}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        {flightResult.terminal && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink/60 dark:text-cream/60">
                            <Building2 className="w-3 h-3" />
                            Terminal {flightResult.terminal}
                          </div>
                        )}
                        {flightResult.gate && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-ink/60 dark:text-cream/60">
                            <MapPin className="w-3 h-3" />
                            Gate {flightResult.gate}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === "seat" && (
              <motion.div
                key="seat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto"
              >
                <form onSubmit={handleSeatSubmit} className="glass-strong border border-sunset-4/10 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-sunset-4/10 border-sunset-4/20 text-sunset-4">
                      <Grid3X3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-heading-sm text-ink dark:text-cream leading-tight">
                        Seat Availability
                      </h3>
                      <span className="text-[9px] font-bold text-sunset-4 uppercase tracking-widest">
                        IRCTC Real-time Berth Check
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink/70 dark:text-cream/70 uppercase tracking-wider">
                        Origin Station
                      </label>
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="e.g. NDLS"
                        maxLength={10}
                        className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-ink/40 border border-white/20 text-ink dark:text-cream text-sm font-medium placeholder:text-ink/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-sunset-4/50 transition-all uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-ink/70 dark:text-cream/70 uppercase tracking-wider">
                        Destination Station
                      </label>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. BCT"
                        maxLength={10}
                        className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-ink/40 border border-white/20 text-ink dark:text-cream text-sm font-medium placeholder:text-ink/40 dark:placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-sunset-4/50 transition-all uppercase"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!origin.trim() || !destination.trim()}
                    className="btn btn-md btn-primary w-full justify-center disabled:opacity-50"
                  >
                    Check Availability
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <p className="text-[9px] text-ink/50 dark:text-cream/50 text-center flex items-center justify-center gap-1">
                    <ExternalLink className="w-2.5 h-2.5" />
                    Redirects to IRCTC official portal
                  </p>
                </form>

                <div className="mt-4 p-4 rounded-xl bg-sunset-4/5 border border-sunset-4/10">
                  <p className="text-[10px] font-medium text-ink/60 dark:text-cream/60 text-center leading-relaxed">
                    Enter your origin and destination station codes (e.g. NDLS for New Delhi, BCT for Mumbai Central) to check real-time seat availability on the official IRCTC portal.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
