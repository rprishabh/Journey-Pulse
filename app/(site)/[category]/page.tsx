"use client";

import React, { use } from "react";
import Link from "next/link";
import { NewsGrid } from "@/components/NewsGrid";
import { TodayFactCard } from "@/components/TodayFactCard";
import { ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { category } = use(params);

  // Map category slug to geographical segment display titles
  const getCategoryMeta = (slug: string) => {
    switch (slug.toLowerCase()) {
      case "india":
        return {
          title: "Incredible India Local News",
          desc: "Latest domestic travel updates, state tourism days, and local regulatory updates across 28 states.",
          bgGrad: "linear-gradient(135deg, #173559 0%, #ff6b35 100%)",
        };
      case "worldwide":
        return {
          title: "Worldwide Policy & Intelligence",
          desc: "Global airline routes, border policies, and international visa scheme shifts monitored hourly.",
          bgGrad: "linear-gradient(135deg, #e84393 0%, #6c5ce7 100%)",
        };
      case "trending":
      default:
        return {
          title: "Trending Travel News",
          desc: "Key regulatory alerts, visa changes, and tourism highlights trending across South Asia and beyond.",
          bgGrad: "linear-gradient(135deg, #0c1929 0%, #173559 100%)",
        };
    }
  };

  const meta = getCategoryMeta(category);

  return (
    <div
      className="min-h-screen relative text-ink dark:text-cream transition-all duration-700 select-none"
      style={{ background: meta.bgGrad }}
    >
      {/* Visual background glowing orb */}
      <div className="absolute inset-0 bg-transparent pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-sunset-1/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 container-wide py-12 md:py-20 space-y-16">
        
        {/* Back Link */}
        <div className="flex justify-start">
          <MagneticButton radius={60}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-sunset-1/10 hover:text-sunset-1 text-xs font-black uppercase tracking-widest border border-sunset-1/10 text-ink dark:text-cream"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Journey</span>
            </Link>
          </MagneticButton>
        </div>

        {/* Header segment */}
        <div className="space-y-4 max-w-2xl">
          <span className="text-[10px] uppercase font-bold text-sunset-1 tracking-widest bg-sunset-1/10 px-2.5 py-1 rounded-md border border-sunset-1/25">
            Category Showcase
          </span>
          <h1 className="font-display font-black text-display-sm md:text-display-md text-ink dark:text-cream leading-tight">
            {meta.title}
          </h1>
          <p className="text-body-md text-ink/80 dark:text-cream/80 leading-relaxed">
            {meta.desc}
          </p>
        </div>

        {/* Dynamic split layout: News grid with Related Fact card sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main news grid */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xs uppercase font-extrabold text-sunset-1 tracking-wider border-b border-sunset-1/15 pb-2">
              Aggregated News Coverage
            </h3>
            <NewsGrid category={category} limit={6} />
          </div>

          {/* Related fact sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <h3 className="text-xs uppercase font-extrabold text-sunset-2 tracking-wider border-b border-sunset-2/15 pb-2">
              Historical Sidebar Dispatch
            </h3>
            <TodayFactCard />
            
            <div className="glass p-6 rounded-2xl border border-sunset-1/15 space-y-3">
              <span className="text-[9px] uppercase font-black text-sunset-1">Editorial Notice</span>
              <p className="text-xs text-ink/75 dark:text-cream/75 leading-relaxed">
                All feeds in this showcase are fetched from authenticated Tier-1 RSS networks including NDTV, Times of India, Reuters, and BBC News. Verify travel advisories locally before departure.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
