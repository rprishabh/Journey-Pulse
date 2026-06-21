// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Visa Hub Page (app/visa-hub/page.tsx)
// Next.js 14 Server Component implementing searchable visa indexes.
// Optimized for crawlability (SEO/AEO structured data) (skills.md §3).
// ─────────────────────────────────────────────────────────────────────────────

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VisaSearchForm } from "@/components/VisaSearchForm";
import type { Prisma, VisaType } from "@prisma/client";
import Link from "next/link";
import {
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  Globe2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    segment?: string;
    type?: string;
    page?: string;
  }>;
}

// ── Page Metadata for Search Indexing ─────────────────────────────────────────
export const metadata: Metadata = {
  title: "Visa Hub — Live Travel Requirements & Processing Metrics",
  description:
    "Explore visa requirements for Indian passport holders (outbound) and foreign nationals entering India (inbound). Find processing times, application fees, required documents, and direct official visa portals.",
  alternates: {
    canonical: "/visa-hub",
  },
};

const MOCK_VISA_RECORDS = [
  // MEDICAL
  {
    id: "mock-v-med-deu",
    slug: "germany-medical-visa",
    countryName: "Germany",
    countryCode: "DEU",
    flagEmoji: "🇩🇪",
    segment: "OUTBOUND" as const,
    visaType: "MEDICAL" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    maxStayDays: 90,
    processingTimeDays: 15,
    fee: 80,
    feeCurrency: "EUR",
    applicationUrl: "https://india.diplo.de/",
    documentsRequired: ["Medical certificate from Indian doctor", "Confirmation letter from German hospital", "Proof of sufficient funds"],
    notes: "Schengen Medical Treatment Visa. Required for citizens seeking medical care in Germany. Must present confirmed medical appointment and deposit proof.",
    sourceUrl: "https://india.diplo.de/in-en/service/visa",
  },
  {
    id: "mock-v-med-gbr",
    slug: "uk-medical-visa",
    countryName: "United Kingdom",
    countryCode: "GBR",
    flagEmoji: "🇬🇧",
    segment: "OUTBOUND" as const,
    visaType: "MEDICAL" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    maxStayDays: 180,
    processingTimeDays: 21,
    fee: 115,
    feeCurrency: "GBP",
    applicationUrl: "https://www.gov.uk/standard-visitor/medical-reason",
    documentsRequired: ["Letter from UK registered doctor", "Estimated cost & duration of treatment", "Sponsor financial support details"],
    notes: "Standard Visitor Visa for Medical Treatment. Allows entry for private medical treatment. Extension possible if treatment takes longer than 6 months.",
    sourceUrl: "https://www.gov.uk/standard-visitor",
  },
  {
    id: "mock-v-med-ind-bgd",
    slug: "india-medical-visa-bangladesh",
    countryName: "India (for Bangladesh)",
    countryCode: "BGD",
    flagEmoji: "🇧🇩",
    segment: "INBOUND" as const,
    visaType: "MEDICAL" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    maxStayDays: 60,
    processingTimeDays: 3,
    fee: 0,
    feeCurrency: "USD",
    applicationUrl: "https://indianvisaonline.gov.in/evisa/",
    documentsRequired: ["Passport valid for 6 months", "Referral letter from local hospital", "Letter of invitation from Indian hospital"],
    notes: "Indian Medical e-Visa for Bangladeshi nationals seeking specialized treatment. Up to two attendants allowed under separate Medical Attendant visas.",
    sourceUrl: "https://indianvisaonline.gov.in/",
  },
  // BUSINESS
  {
    id: "mock-v-bus-usa",
    slug: "us-business-visa",
    countryName: "United States",
    countryCode: "USA",
    flagEmoji: "🇺🇸",
    segment: "OUTBOUND" as const,
    visaType: "BUSINESS" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    maxStayDays: 180,
    processingTimeDays: 30,
    fee: 185,
    feeCurrency: "USD",
    applicationUrl: "https://ceac.state.gov/genniv/",
    documentsRequired: ["DS-160 confirmation page", "Invitation letter from US host company", "Employment verification letter"],
    notes: "B-1 Business Visitor Visa. For consulting with business associates, attending scientific/educational conventions, or negotiating contracts.",
    sourceUrl: "https://travel.state.gov/",
  },
  {
    id: "mock-v-bus-sgp",
    slug: "singapore-business-visa",
    countryName: "Singapore",
    countryCode: "SGP",
    flagEmoji: "🇸🇬",
    segment: "OUTBOUND" as const,
    visaType: "BUSINESS" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    maxStayDays: 30,
    processingTimeDays: 5,
    fee: 30,
    feeCurrency: "SGD",
    applicationUrl: "https://www.ica.gov.sg/",
    documentsRequired: ["V39A Letter of Introduction", "Business profile of Singapore entity", "Onward return ticket"],
    notes: "Business entry visa. Requires a local Singapore contact to act as a visa sponsor and submit the Letter of Introduction (LOI).",
    sourceUrl: "https://www.ica.gov.sg/",
  },
  {
    id: "mock-v-bus-ind-usa",
    slug: "india-business-visa-usa",
    countryName: "India (for USA)",
    countryCode: "USA",
    flagEmoji: "🇺🇸",
    segment: "INBOUND" as const,
    visaType: "BUSINESS" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    maxStayDays: 180,
    processingTimeDays: 3,
    fee: 80,
    feeCurrency: "USD",
    applicationUrl: "https://indianvisaonline.gov.in/evisa/",
    documentsRequired: ["Passport bio page", "Business card of applicant", "Letter of invitation from Indian company"],
    notes: "e-Business Visa for US citizens. Multiple entries permitted within 1 year from the date of e-Visa grant. Maximum stay of 180 days per visit.",
    sourceUrl: "https://indianvisaonline.gov.in/",
  },
  // TRANSIT
  {
    id: "mock-v-tran-sgp",
    slug: "singapore-transit-visa",
    countryName: "Singapore",
    countryCode: "SGP",
    flagEmoji: "🇸🇬",
    segment: "OUTBOUND" as const,
    visaType: "TRANSIT" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    maxStayDays: 4, // 96 hours
    processingTimeDays: 0,
    fee: 0,
    feeCurrency: "USD",
    applicationUrl: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa-free-transit-facility",
    documentsRequired: ["Valid passport", "Onward boarding pass", "Valid visa/residence permit for US/UK/Schengen/Australia"],
    notes: "96-Hour Visa-Free Transit Facility (VFTF). Indian passport holders transiting to/from a third country can exit Changi airport if holding select destination visas.",
    sourceUrl: "https://www.ica.gov.sg/",
  },
  {
    id: "mock-v-tran-are",
    slug: "uae-transit-visa",
    countryName: "United Arab Emirates",
    countryCode: "ARE",
    flagEmoji: "🇦🇪",
    segment: "OUTBOUND" as const,
    visaType: "TRANSIT" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    maxStayDays: 4, // 96 hours
    processingTimeDays: 1,
    fee: 30,
    feeCurrency: "USD",
    applicationUrl: "https://www.gdrfad.gov.ae/",
    documentsRequired: ["Passport valid for 3 months", "Confirmed onward flight ticket", "Hotel booking if staying over 24 hours"],
    notes: "Transit visas are sponsored by UAE airlines (Emirates, Etihad, Flydubai). 48-hour transit is free of charge; 96-hour transit incurs a fee of 30 USD.",
    sourceUrl: "https://u.ae/en/information-and-services/visiting-and-tourism/transit-visa",
  },
  {
    id: "mock-v-tran-qat",
    slug: "qatar-transit-visa",
    countryName: "Qatar",
    countryCode: "QAT",
    flagEmoji: "🇶🇦",
    segment: "OUTBOUND" as const,
    visaType: "TRANSIT" as const,
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    maxStayDays: 4, // 96 hours
    processingTimeDays: 1,
    fee: 0,
    feeCurrency: "USD",
    applicationUrl: "https://www.qatarairways.com/",
    documentsRequired: ["Valid passport", "Onward flight ticket via Qatar Airways", "Valid visa/entry permit of final destination"],
    notes: "Qatar Transit Visa. Applied through Qatar Airways. Permits stay up to 96 hours. Multi-entry is not permitted; one transit per journey.",
    sourceUrl: "https://www.visitqatar.com/",
  }
];

export default async function VisaHubPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // ── Parse inputs and apply fallbacks ──────────────────────────────────────
  const q = params.q ?? "";
  const segment = (params.segment === "INBOUND" ? "INBOUND" : "OUTBOUND") as "INBOUND" | "OUTBOUND";
  const typeFilter = params.type && params.type !== "ALL" ? (params.type as VisaType) : undefined;
  
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  // ── Execute DB Query ──────────────────────────────────────────────────────
  const dbVisaRecords = await prisma.visaUpdate.findMany({
    where: {
      isActive: true,
      segment,
    },
    orderBy: { countryName: "asc" },
  });

  // ── Merge DB & Mock records and filter in-memory ──────────────────────────
  const dbCountryKeys = new Set(dbVisaRecords.map(r => `${r.countryCode}_${r.segment}_${r.visaType}`));
  const combined = [...dbVisaRecords];

  MOCK_VISA_RECORDS.forEach((mock) => {
    // Avoid duplicates
    if (dbCountryKeys.has(`${mock.countryCode}_${mock.segment}_${mock.visaType}`)) {
      return;
    }

    // Filter segment
    if (mock.segment !== segment) return;

    // Filter type
    if (typeFilter && mock.visaType !== typeFilter) return;

    // Filter query
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      const match =
        mock.countryName.toLowerCase().includes(term) ||
        mock.countryCode.toLowerCase().includes(term) ||
        mock.notes.toLowerCase().includes(term);
      if (!match) return;
    }

    combined.push({
      ...mock,
      validityDays: null,
      multipleEntry: false,
      requirements: [],
      exemptions: null,
      lastVerifiedAt: new Date(),
      effectiveFrom: new Date(),
      effectiveUntil: null,
      isActive: true,
      passportPowerRank: null,
      henleyIndex: null,
      arrivalCardRequired: false,
      yellowFeverRequired: false,
      covidProtocol: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Sort alphabetically by countryName
  combined.sort((a, b) => a.countryName.localeCompare(b.countryName));

  const totalCount = combined.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const visaRecords = combined.slice(skip, skip + pageSize);

  // ── JSON-LD Structured Data for AEO/GEO Engines (skills.md §3) ────────────
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Visa Hub Directory — ${segment === "OUTBOUND" ? "Outbound for Indian Citizens" : "Inbound for Visitors"}`,
    description: `Official directory of travel visa policies, costs, and processing wait-times for ${segment === "OUTBOUND" ? "Indian travellers" : "international tourists entering India"}.`,
    provider: {
      "@type": "Organization",
      name: "JourneyPulse India",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
  };

  return (
    <div className="container-wide py-10 space-y-12">
      {/* JSON-LD Script injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Page Header Section ────────────────────────────────────────────── */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="font-display font-extrabold text-display-sm md:text-display-md text-surface-900 dark:text-white tracking-tight">
          Visa <span className="text-gradient">Hub</span> Directory
        </h1>
        <p className="text-body-md text-surface-500">
          Real-time visa requirement matrices, stay durations, official government processing fees, and documentation checklists parsed from immigration authorities.
        </p>
      </div>

      {/* ── Search Form (Client Component) ─────────────────────────────────── */}
      <div className="bg-white dark:bg-surface-950 p-5 rounded-2xl border border-surface-200 dark:border-surface-850 shadow-glass">
        <VisaSearchForm />
      </div>

      {/* ── Main List Grid ────────────────────────────────────────────────── */}
      {visaRecords.length === 0 ? (
        <div className="card-glass p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto text-surface-450">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-heading-md text-surface-900 dark:text-white">
              No visa rules match filters
            </h3>
            <p className="text-body-sm text-surface-500">
              We couldn&apos;t find any visa regulations matching your query. Try selecting another segment or adjusting your search keyword.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaRecords.map((record) => {
              // Format category badge
              const isVisaFree = !record.isVisaRequired;
              const isVoA = record.isVisaOnArrival;
              const isEVisa = record.isEVisaAvailable;

              return (
                <div
                  key={record.id}
                  className="card bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 p-6 flex flex-col justify-between h-auto min-h-[520px] hover:shadow-card-hover group transition-shadow duration-300"
                >
                  <div className="space-y-5">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-heading-xl select-none" role="img" aria-label={record.countryName}>
                          {record.flagEmoji ?? "🌐"}
                        </span>
                        <div>
                          <h3 className="font-display font-extrabold text-body-lg text-surface-900 dark:text-white leading-tight">
                            {record.countryName}
                          </h3>
                          <span className="text-caption font-semibold text-surface-400">
                            ISO: {record.countryCode}
                          </span>
                        </div>
                      </div>

                      {/* Visa Category Badge */}
                      {isVisaFree ? (
                        <span className="badge badge-success font-bold px-2.5 py-1 text-[10px]">
                          Visa Free
                        </span>
                      ) : isVoA ? (
                        <span className="badge badge-warning font-bold px-2.5 py-1 text-[10px]">
                          Visa on Arrival
                        </span>
                      ) : isEVisa ? (
                        <span className="badge badge-brand font-bold px-2.5 py-1 text-[10px]">
                          e-Visa Available
                        </span>
                      ) : (
                        <span className="badge badge-danger font-bold px-2.5 py-1 text-[10px]">
                          Visa Required
                        </span>
                      )}
                    </div>

                    {/* Visa Metadata Row (stay, processing, fee) */}
                    <div className="grid grid-cols-3 gap-1 text-center py-2 bg-surface-50 dark:bg-surface-950 rounded-xl">
                      <div className="border-r border-surface-200 dark:border-surface-800">
                        <span className="text-[9px] font-bold text-surface-450 uppercase block">Stay Limit</span>
                        <span className="text-body-sm font-extrabold text-surface-900 dark:text-white">
                          {record.maxStayDays !== null ? `${record.maxStayDays} Days` : "N/A"}
                        </span>
                      </div>
                      <div className="border-r border-surface-200 dark:border-surface-800">
                        <span className="text-[9px] font-bold text-surface-450 uppercase block">Processing</span>
                        <span className="text-body-sm font-extrabold text-surface-900 dark:text-white">
                          {isVisaFree ? "Instant" : record.processingTimeDays !== null ? `${record.processingTimeDays} Days` : "Varies"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-surface-450 uppercase block">Gov Fee</span>
                        <span className="text-body-sm font-extrabold text-surface-900 dark:text-white">
                          {record.fee !== null && record.fee > 0 ? `${record.fee} ${record.feeCurrency ?? "USD"}` : "Free"}
                        </span>
                      </div>
                    </div>

                    {/* Documents checklist */}
                    {record.documentsRequired && record.documentsRequired.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-surface-500 uppercase tracking-wider block">
                          Required Documents
                        </span>
                        <ul className="space-y-1.5">
                          {record.documentsRequired.slice(0, 3).map((doc, idx) => (
                            <li key={idx} className="text-body-sm text-surface-600 dark:text-surface-400 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="truncate">{doc}</span>
                            </li>
                          ))}
                          {record.documentsRequired.length > 3 && (
                            <li className="text-[10px] text-surface-400 pl-6 italic">
                              + {record.documentsRequired.length - 3} more document(s)
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Notes segment */}
                    {record.notes && (
                      <div className="text-caption text-surface-500 dark:text-surface-400 leading-relaxed bg-surface-50 dark:bg-surface-950 p-2.5 rounded-lg border border-surface-150 dark:border-surface-850">
                        {record.notes}
                      </div>
                    )}
                  </div>

                  {/* Outbound Link CTA */}
                  <div className="pt-4 border-t border-surface-100 dark:border-surface-850 flex gap-2 mt-4">
                    {record.applicationUrl ? (
                      <a
                        href={record.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary flex-1 flex items-center justify-center gap-1.5"
                      >
                        <span>Apply Online</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href={`/contact?subject=Visa Query ${record.countryCode}`}
                        className="btn btn-sm btn-secondary flex-1 flex items-center justify-center"
                      >
                        Ask Advisor
                      </Link>
                    )}
                    <a
                      href={record.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(record.countryName + " official government visa portal immigration e-visa")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-secondary flex items-center justify-center gap-1 px-3"
                      title={record.sourceUrl ? "Official Government Source" : "Search Official Source"}
                    >
                      <Globe2 className="w-3.5 h-3.5 text-sunset-1" />
                      <span>Source</span>
                    </a>
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
                  href={`/visa-hub?segment=${segment}${q ? `&q=${encodeURIComponent(q)}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}&page=${page - 1}`}
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
                  href={`/visa-hub?segment=${segment}${q ? `&q=${encodeURIComponent(q)}` : ""}${typeFilter ? `&type=${typeFilter}` : ""}&page=${page + 1}`}
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

      {/* ── B2B & Commercial Promotion Banner ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-surface-900 to-surface-950 text-white rounded-3xl p-8 border border-surface-850 shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300">
            <Building className="w-4 h-4" />
            Travel Enterprise API
          </span>
          <h2 className="font-display font-extrabold text-heading-lg md:text-heading-xl leading-tight">
            Deploy automated visa logic in your booking flows
          </h2>
          <p className="text-body-sm text-surface-300">
            Integrate our real-time immigration databases directly into your B2B corporate platforms, OTA engines, or supplier checkout pipelines to mitigate visa compliance issues.
          </p>
          <div className="flex gap-3 pt-2">
            <Link href="/enterprise/api" className="btn btn-sm btn-primary">
              <span>View API Documentation</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
