// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Travel Advisories Page (app/travel-advisories/page.tsx)
// Next.js 14 Server Component querying Prisma DB for security/safety updates.
// Supports: search param filtering, severity border indicators, document checklists.
// ─────────────────────────────────────────────────────────────────────────────

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdvisorySearchForm } from "@/components/AdvisorySearchForm";
import type { Prisma, AdvisoryLevel } from "@prisma/client";
import Link from "next/link";
import {
  Calendar,
  Building2,
  ShieldAlert,
  AlertOctagon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Flame,
  ShieldClose,
  MapPin,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    segment?: string;
    level?: string;
    page?: string;
  }>;
}

// ── SEO Page Metadata ────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Travel Advisories — Active Security Alerts & Travel Warnings",
  description:
    "Review live safety advisories, health warnings, geopolitical alerts, and travel restrictions monitored by global agencies and the Indian Ministry of External Affairs.",
  alternates: {
    canonical: "/travel-advisories",
  },
};

export default async function TravelAdvisoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // ── Parse inputs ──────────────────────────────────────────────────────────
  const q = params.q ?? "";
  const segment = (params.segment === "INBOUND" ? "INBOUND" : "OUTBOUND") as "INBOUND" | "OUTBOUND";
  const levelFilter = params.level && params.level !== "ALL" ? (params.level as AdvisoryLevel) : undefined;
  
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const pageSize = 9;
  const skip = (page - 1) * pageSize;

  // ── Build query filters ───────────────────────────────────────────────────
  const where: Prisma.TravelAdvisoryWhereInput = {
    isActive: true,
    segment,
  };

  if (levelFilter) {
    where.advisoryLevel = levelFilter;
  }

  if (q.trim()) {
    where.OR = [
      { countryName: { contains: q.trim(), mode: "insensitive" } },
      { countryCode: { contains: q.trim(), mode: "insensitive" } },
      { title: { contains: q.trim(), mode: "insensitive" } },
      { summary: { contains: q.trim(), mode: "insensitive" } },
      { affectedRegions: { has: q.trim() } },
    ];
  }

  // ── Execute query with Transaction ────────────────────────────────────────
  const [advisories, totalCount] = await prisma.$transaction([
    prisma.travelAdvisory.findMany({
      where,
      orderBy: [
        { advisoryLevel: "desc" }, // Most severe warnings first
        { issuedAt: "desc" },
      ],
      skip,
      take: pageSize,
    }),
    prisma.travelAdvisory.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // ── Helper to determine severity visual indicators (border/badge) ────────
  const getSeverityStyle = (level: AdvisoryLevel) => {
    switch (level) {
      case "LEVEL_4_DO_NOT_TRAVEL":
        return {
          borderClass: "severity-4",
          badgeClass: "badge-danger",
          textLabel: "Do Not Travel (Level 4)",
          bgGlow: "bg-red-500/5",
        };
      case "LEVEL_3_RECONSIDER_TRAVEL":
        return {
          borderClass: "severity-3",
          badgeClass: "badge-warning bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-350",
          textLabel: "Reconsider Travel (Level 3)",
          bgGlow: "bg-orange-500/5",
        };
      case "LEVEL_2_EXERCISE_INCREASED":
        return {
          borderClass: "severity-2",
          badgeClass: "badge-warning",
          textLabel: "Increased Caution (Level 2)",
          bgGlow: "bg-amber-500/5",
        };
      default:
        return {
          borderClass: "severity-1",
          badgeClass: "badge-success",
          textLabel: "Exercise Normal Precautions (Level 1)",
          bgGlow: "bg-emerald-500/5",
        };
    }
  };

  // Helper for date conversion
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ── JSON-LD Structured Data for AEO (skills.md §3) ────────────────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Global Travel Advisories Directory",
    description: "Real-time safety, security, and health bulletins indexed from official ministry portals.",
    publisher: {
      "@type": "Organization",
      name: "JourneyPulse India",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
  };

  return (
    <div className="container-wide py-10 space-y-12">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Page Header Section ────────────────────────────────────────────── */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="font-display font-extrabold text-display-sm md:text-display-md text-surface-900 dark:text-white tracking-tight">
          Travel <span className="text-gradient">Advisories</span>
        </h1>
        <p className="text-body-md text-surface-500">
          Official security advisories, epidemiological health risk alerts, and geopolitical entry restrictions monitored and categorized by hazard severity.
        </p>
      </div>

      {/* ── Search Form (Client Component) ─────────────────────────────────── */}
      <div className="bg-white dark:bg-surface-950 p-5 rounded-2xl border border-surface-200 dark:border-surface-850 shadow-glass">
        <AdvisorySearchForm />
      </div>

      {/* ── Main Index Directory ───────────────────────────────────────────── */}
      {advisories.length === 0 ? (
        <div className="card-glass p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto text-surface-450">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-heading-md text-surface-900 dark:text-white">
              No active advisories found
            </h3>
            <p className="text-body-sm text-surface-500">
              No government travel warnings matched your selection. Try adjusting filters or searching for another keyword.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {advisories.map((advisory) => {
              const meta = getSeverityStyle(advisory.advisoryLevel);
              const isLevel4 = advisory.advisoryLevel === "LEVEL_4_DO_NOT_TRAVEL";

              return (
                <div
                  key={advisory.id}
                  className={`card bg-white dark:bg-surface-900 ${meta.borderClass} ${meta.bgGlow} p-6 flex flex-col justify-between h-[550px] shadow-sm hover:shadow-card-hover transition-all duration-300`}
                >
                  <div className="space-y-5">
                    {/* Issuer & Flag Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="badge badge-brand bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-350 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md">
                          {advisory.countryCode} Index
                        </span>
                        <h3 className="font-display font-extrabold text-body-lg text-surface-900 dark:text-white leading-tight">
                          {advisory.countryName}
                        </h3>
                      </div>

                      <span className={meta.badgeClass + " text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider rounded-md shrink-0"}>
                        Level {advisory.advisoryLevel.split("_")[1]}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 text-caption text-surface-500 font-semibold border-b border-surface-100 dark:border-surface-850/60 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Issued by: {advisory.issuedBy}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(advisory.issuedAt)}</span>
                      </div>
                    </div>

                    {/* Threat Headline */}
                    <h4 className="font-display font-bold text-body-sm text-surface-900 dark:text-white line-clamp-2 leading-snug">
                      {advisory.title}
                    </h4>

                    {/* Brief Summary */}
                    <p className="text-body-sm text-surface-550 dark:text-surface-400 line-clamp-3 leading-relaxed">
                      {advisory.summary}
                    </p>

                    {/* Affected territories */}
                    {advisory.affectedRegions && advisory.affectedRegions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-500" />
                          Affected Regions
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {advisory.affectedRegions.slice(0, 3).map((r, i) => (
                            <span key={i} className="text-[10px] bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 px-2 py-0.5 rounded">
                              {r}
                            </span>
                          ))}
                          {advisory.affectedRegions.length > 3 && (
                            <span className="text-[9px] text-surface-450 italic">
                              + {advisory.affectedRegions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Safety bulletins (security vs health) */}
                    <div className="space-y-2 pt-2">
                      {advisory.securityRisks && advisory.securityRisks.length > 0 && (
                        <div className="flex gap-2 items-start text-caption text-surface-600 dark:text-surface-400">
                          <ShieldClose className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            <strong>Security:</strong> {advisory.securityRisks.join(", ")}
                          </span>
                        </div>
                      )}
                      {advisory.healthRisks && advisory.healthRisks.length > 0 && (
                        <div className="flex gap-2 items-start text-caption text-surface-600 dark:text-surface-400">
                          <HeartPulse className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            <strong>Health:</strong> {advisory.healthRisks.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Outbound */}
                  <div className="pt-4 border-t border-surface-100 dark:border-surface-850 flex gap-2 mt-4 shrink-0">
                    {advisory.sourceUrl ? (
                      <a
                        href={advisory.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn-sm w-full flex items-center justify-center gap-1.5 ${isLevel4 ? "btn-danger" : "btn-outline"}`}
                      >
                        <span>Official Bulletin</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href={`/contact?subject=Advisory Query ${advisory.countryCode}`}
                        className="btn btn-sm btn-secondary w-full flex items-center justify-center"
                      >
                        File Enquiry
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination Footer ──────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {page > 1 ? (
                <Link
                  href={`/travel-advisories?segment=${segment}${q ? `&q=${encodeURIComponent(q)}` : ""}${levelFilter ? `&level=${levelFilter}` : ""}&page=${page - 1}`}
                  className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-650 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              ) : (
                <span className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-800 opacity-30 cursor-not-allowed text-surface-400">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              )}

              <span className="text-body-sm font-semibold text-surface-700 dark:text-surface-300 px-4">
                Page {page} of {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/travel-advisories?segment=${segment}${q ? `&q=${encodeURIComponent(q)}` : ""}${levelFilter ? `&level=${levelFilter}` : ""}&page=${page + 1}`}
                  className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-650 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <span className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-800 opacity-30 cursor-not-allowed text-surface-400">
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Emergency Response Callout ─────────────────────────────────────── */}
      <div className="bg-red-500/10 border-2 border-red-500/20 rounded-3xl p-8 shadow-glass relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-[80px]" />
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-700 dark:text-red-350">
            <Flame className="w-4 h-4 animate-pulse-subtle" />
            Consular Assistance
          </span>
          <h2 className="font-display font-extrabold text-heading-lg leading-tight text-surface-900 dark:text-white">
            Emergency Indian consular support contact channels
          </h2>
          <p className="text-body-sm text-surface-550 dark:text-surface-400">
            If you are an Indian national abroad experiencing a crisis or sudden evacuation order, contact the Ministry of External Affairs MADAD portal or call our emergency hotline directly.
          </p>
        </div>
        <div className="relative z-10 shrink-0 flex gap-3 w-full md:w-auto">
          <a href="https://madad.gov.in" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-danger px-6 w-full md:w-auto">
            <span>Access MADAD Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
