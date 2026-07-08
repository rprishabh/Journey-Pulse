"use client";

import React from "react";
import Link from "next/link";
import { InteractiveGlobe } from "@/components/InteractiveGlobe";
import { FloatingSuitcase } from "@/components/FloatingSuitcase";
import { TodayFactCard } from "@/components/TodayFactCard";
import { NewsGrid } from "@/components/NewsGrid";
import { Passport3D } from "@/components/Passport3D";
import { VisaMap } from "@/components/VisaMap";
import { GovInitiativesRail } from "@/components/GovInitiativesRail";
import { AdvisoriesGlobe } from "@/components/AdvisoriesGlobe";
import { StateTourismTimeline } from "@/components/StateTourismTimeline";
import { UpcomingFestivalAlerts } from "@/components/UpcomingFestivalAlerts";
import { WorldAlertOverview } from "@/components/WorldAlertOverview";
import { GlobalAqiRanking } from "@/components/GlobalAqiRanking";
import { JourneyCanvas } from "@/components/JourneyCanvas";
import { MagneticButton } from "@/components/MagneticButton";
import { LiveTransitTracker } from "@/components/LiveTransitTracker";
import { Globe2, FileText, ArrowRight, ShieldAlert } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-ink dark:text-cream">
      {/* Scroll-driven Journey Canvas Background */}
      <JourneyCanvas />

      {/* Main Narrative Stream */}
      <main className="relative z-10 container-wide space-y-20 md:space-y-32 py-12 md:py-20">
        
        {/* SECTION 1: HERO */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto space-y-8 relative">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sunset-1/10 border border-sunset-1/25 text-sunset-1">
              <Globe2 className="w-3.5 h-3.5" />
              Tier-1 Mainstream News
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sunset-4/10 border border-sunset-4/25 text-sunset-4">
              <FileText className="w-3.5 h-3.5" />
              Live Visa requirements
            </span>
          </div>

          <h1 className="font-display font-black text-display-md md:text-display-lg leading-none tracking-tighter">
            Global Travel Intelligence. <br />
            <span className="text-gradient-hero">Local Indian Precision.</span>
          </h1>

          <p className="text-body-lg text-ink/75 dark:text-cream/75 max-w-2xl mx-auto leading-relaxed">
            Real-time travel news aggregation, automated visa requirement mapping for Indian passport holders, and regulatory safety tracking verified hourly.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <MagneticButton radius={80}>
              <Link href="/visa-hub" className="btn btn-lg btn-primary">
                <span>Check Visa Requirements</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </MagneticButton>
            
            <MagneticButton radius={80}>
              <Link href="/travel-advisories" className="btn btn-lg btn-secondary">
                <ShieldAlert className="w-5 h-5 text-sunset-1" />
                <span>Travel Advisories</span>
              </Link>
            </MagneticButton>
          </div>

          {/* Interactive Country Explorer Globe */}
          <div className="w-full pt-8">
            <InteractiveGlobe />
          </div>
        </section>

        {/* Dynamic Float Suitcase (Only desktop view) */}
        <FloatingSuitcase />

        {/* SECTION 1.5: WORLD ALERTS — Live Weather Intelligence */}
        <WorldAlertOverview />

        {/* SECTION 1.6: GLOBAL AQI RANKING — Standalone Section */}
        <GlobalAqiRanking />

        {/* SECTION 1.75: LIVE TRANSIT TRACKER */}
        <LiveTransitTracker />

        {/* SECTION 2: TODAY FACT CARD */}
        <section id="daily-facts" className="relative max-w-3xl mx-auto text-center space-y-6 scroll-mt-24">
          {/* Background pattern behind the card */}
          <div className="absolute inset-0 -inset-x-20 -inset-y-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sunset-1/[0.03] to-transparent rounded-[3rem]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sunset-1/5 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-sunset-1 tracking-widest">Postcard Dispatch</span>
            <h2 className="font-display font-black text-heading-xl md:text-heading-2xl leading-tight">
              Today in Travel
            </h2>
          </div>
          <div className="relative z-10">
            <TodayFactCard />
          </div>
        </section>

        {/* SECTION 2.5: UPCOMING FESTIVALS & EVENTS WORLDWIDE */}
        <UpcomingFestivalAlerts />

        {/* SECTION 3: TRENDING NEWS FEED */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-sunset-2 tracking-widest">Live Bulletins</span>
            <h2 className="font-display font-black text-heading-xl md:text-heading-2xl leading-tight">
              Trending Global Updates
            </h2>
          </div>
          <NewsGrid category="trending" limit={3} />
        </section>

        {/* SECTION 4: PASSPORT & VISA MAP */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] uppercase font-bold text-sunset-3 tracking-widest">Passport Power</span>
            <h2 className="font-display font-black text-heading-xl md:text-heading-2xl leading-tight">
              Outbound Visa Authority
            </h2>
            <p className="text-xs text-ink/70 dark:text-cream/70">
              Interactive passport booklet stamp sync and border requirements dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 h-full flex items-center">
              <Passport3D />
            </div>
            <div className="lg:col-span-8">
              <VisaMap />
            </div>
          </div>
        </section>

        {/* SECTION 5: DOMESTIC NEWS */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-sunset-1 tracking-widest">Regional Coverage</span>
            <h2 className="font-display font-black text-heading-xl md:text-heading-2xl leading-tight">
              Incredible India Local News
            </h2>
          </div>
          <NewsGrid category="india" limit={3} />
        </section>

        {/* SECTION 6: GOVERNMENT INITIATIVES RAIL */}
        <section className="max-w-5xl mx-auto">
          <GovInitiativesRail />
        </section>

        {/* SECTION 7: WORLDWIDE NEWS */}
        <section className="space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-sunset-3 tracking-widest">International Shifts</span>
            <h2 className="font-display font-black text-heading-xl md:text-heading-2xl leading-tight">
              Global Policy & Airline Updates
            </h2>
          </div>
          <NewsGrid category="worldwide" limit={3} />
        </section>

        {/* SECTION 8: ADVISORIES GLOBE */}
        <section className="max-w-5xl mx-auto">
          <AdvisoriesGlobe />
        </section>

        {/* SECTION 9: STATE TOURISM TIMELINE */}
        <section id="tourism-timeline" className="max-w-4xl mx-auto scroll-mt-24">
          <StateTourismTimeline />
        </section>

      </main>
    </div>
  );
}
