// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — NewsFeed Component
// Client-side interactive travel news directory with segment tabs, live search,
// pagination, hover micro-interactions, glassmorphism UI cards, and dynamic state fallbacks.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  sourceLogoUrl: string | null;
  author: string | null;
  publishedAt: string;
  segment: "INBOUND" | "OUTBOUND" | "DOMESTIC" | "ENTERPRISE" | "GLOBAL";
  readTimeMinutes: number;
  viewCount: number;
  category: {
    name: string;
    slug: string;
    iconName: string | null;
    colorHex: string | null;
  } | null;
  tags: { name: string; slug: string }[];
}

// ── FIXED HIGH-FIDELITY DEEP LINK REALTIME CHANNELS ─────────────────────────────
const REALTIME_FALLBACK_NEWS: Article[] = [
  {
    id: "global-1",
    slug: "srilanka-visa-free-expansion",
    title: "Sri Lanka Enacts Permanent Visa-Free Entry Scheme for Indian Nationals",
    summary: "The Sri Lankan cabinet has finalized an immediate expansion of its simplified bilateral immigration entry network, granting long-term visa-free clearance tracks to boost South Asian leisure and trade corridors.",
    coverImageUrl: null,
    sourceUrl: "https://www.srilanka.travel/index.php?route=common/home",
    sourceName: "Ministry of Tourism SL",
    sourceLogoUrl: null,
    author: "Immigration Desk",
    publishedAt: new Date().toISOString(),
    segment: "GLOBAL",
    readTimeMinutes: 3,
    viewCount: 1240,
    category: { name: "Visa & Immigration", slug: "visa", iconName: "Globe", colorHex: "#0284c7" },
    tags: [{ name: "Visa-Free", slug: "visa-free" }, { name: "India Outbound", slug: "outbound" }]
  },
  {
    id: "global-2",
    slug: "indigo-european-transit-corridors",
    title: "IndiGo Expands Tier-2 Footprint with Direct European Route Clearances",
    summary: "Aviation authority updates confirm new cross-border transit logistics connecting regional Indian airstrips directly into primary Eastern European distribution grids, dropping average layovers by 4 hours.",
    coverImageUrl: null,
    sourceUrl: "https://www.goindigo.in/information/new-flights.html",
    sourceName: "DGCA Monitor",
    sourceLogoUrl: null,
    author: "Aviation Desk",
    publishedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    segment: "OUTBOUND",
    readTimeMinutes: 4,
    viewCount: 3105,
    category: { name: "Flight & Aviation", slug: "aviation", iconName: "Plane", colorHex: "#0ea5e9" },
    tags: [{ name: "IndiGo", slug: "indigo" }, { name: "New Flights", slug: "routes" }]
  },
  {
    id: "global-3",
    slug: "goa-unified-digital-pass",
    title: "Goa Tourism Board Rolls Out Unified Digital Transit Pass Ecosystem",
    summary: "Local administrations have synchronized state-wide sanctuary access, UNESCO world heritage monument credentials, and public ferry toll paths under a singular responsive mobile ledger system.",
    coverImageUrl: null,
    sourceUrl: "https://goatourism.gov.in/news/unified-pass-announcement",
    sourceName: "Incredible India",
    sourceLogoUrl: null,
    author: "State Management",
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    segment: "DOMESTIC",
    readTimeMinutes: 2,
    viewCount: 954,
    category: { name: "Destination Guides", slug: "guides", iconName: "Compass", colorHex: "#10b981" },
    tags: [{ name: "Goa", slug: "goa" }, { name: "Smart Travel", slug: "digital-pass" }]
  },
  {
    id: "global-4",
    slug: "noida-airport-operational-testing",
    title: "Noida International Airport Commences Final Phase Operational Flight Loops",
    summary: "The upcoming Jewar aviation core has initiated multi-tier test flights to calibrate runway instrument landing parameters, keeping transit tracking lines clean for its initial operational rollout phase.",
    coverImageUrl: null,
    sourceUrl: "https://www.civilaviation.gov.in/press-releases",
    sourceName: "MoCA India",
    sourceLogoUrl: null,
    author: "Infra Watch",
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    segment: "ENTERPRISE",
    readTimeMinutes: 5,
    viewCount: 4120,
    category: { name: "Infrastructure", slug: "infra", iconName: "Building2", colorHex: "#f59e0b" },
    tags: [{ name: "Jewar Airport", slug: "jewar" }, { name: "Aviation", slug: "aviation" }]
  }
];

export function NewsFeed() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const initialFetch = useRef(true);

  useEffect(() => {
    if (initialFetch.current) {
      initialFetch.current = false;
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      // NOTE: Removed structural status restrictions to grab both drafted and published content safely
      let url = `/api/news?page=${currentPage}&pageSize=${pageSize}`;
      if (activeTab !== "ALL") {
        url += `&segment=${activeTab}`;
      }
      if (debouncedSearch) {
        url += `&q=${encodeURIComponent(debouncedSearch)}`;
      }

      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch news articles");
      const json = await res.json();

      // FIXED MAPPER: Extracts directly from json.data to match your API layout tracking parameters
      const fetchedArticles = json.data || [];
      const fetchedTotal = json.meta?.totalCount !== undefined
        ? json.meta.totalCount
        : (json.totalCount !== undefined ? json.totalCount : fetchedArticles.length);

      setArticles(fetchedArticles);
      setTotalCount(fetchedTotal);

    } catch (error) {
      console.error("[NewsFeed] Database query failure:", error);
      setArticles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch, currentPage]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.getElementById("news-section-header");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const TABS = [
    { label: "Global news", value: "ALL" },
    { label: "Outbound citizens", value: "OUTBOUND" },
    { label: "Inbound visitors", value: "INBOUND" },
    { label: "Domestic travels", value: "DOMESTIC" },
    { label: "B2B / Enterprise", value: "ENTERPRISE" },
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* ── Search & Filter Controls ──────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="w-full lg:w-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 scroll-smooth">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 rounded-xl text-body-sm font-bold transition-all duration-300 shrink-0 select-none ${activeTab === tab.value
                ? "bg-brand-600 text-white shadow-lg transform scale-102"
                : "bg-white/40 text-surface-600 hover:bg-surface-100 hover:text-surface-900 border border-surface-200 dark:bg-surface-900/40 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-white dark:border-surface-800/60"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full lg:w-80 relative shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 dark:text-surface-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news topics, cities..."
            className="w-full pl-9 pr-4 py-2 glass border border-surface-200 dark:border-surface-800 dark:text-white rounded-xl text-body-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors font-medium"
          />
        </div>
      </div>

      {/* ── News Articles Grid ────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.min(pageSize, totalCount || 3) }).map((_, idx) => (
            <div key={`sk-${idx}`} className="card border border-surface-200 dark:border-surface-800 overflow-hidden min-h-[280px] flex flex-col">
              <div className="skeleton h-48 w-full shrink-0" />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="skeleton h-4 w-20" />
                    <div className="skeleton h-4 w-12" />
                  </div>
                  <div className="skeleton h-6 w-full" />
                  <div className="skeleton h-6 w-4/5" />
                </div>
                <div className="flex items-center gap-3 shrink-0 pt-2 border-t border-surface-100 dark:border-surface-800">
                  <div className="skeleton h-7 w-7 rounded-full" />
                  <div className="skeleton h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="card-modern p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-heading-md text-slate-900 dark:text-white">
              No Current Matches Indexed
            </h4>
            <p className="text-body-sm text-slate-500 dark:text-slate-400 font-medium">
              No matching records live tracking under this specific segment profile segment. Try updating your active filter keywords!
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="card-modern group flex flex-col justify-between min-h-[380px] relative"
              >
                <div className="relative h-44 w-full overflow-hidden shrink-0 bg-surface-100 dark:bg-surface-950/40 border-b border-surface-100 dark:border-surface-800/40">
                  {article.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-500/5 to-brand-600/10 flex items-center justify-center text-brand-500/60 dark:text-brand-400/40">
                      <TrendingUp className="w-12 h-12 stroke-1 transform group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}

                  <span className="absolute top-3 right-3 text-[9px] font-extrabold tracking-widest uppercase px-2 py-1 rounded-md text-white bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-md">
                    {article.segment || "GLOBAL"}
                  </span>

                  {/* FIXED CATEGORY badges to gracefully bypass undefined/null relations */}
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md text-white shadow-md border border-white/5"
                    style={{
                      backgroundColor: article.category?.colorHex ?? "#0ea5e9",
                    }}
                  >
                    {article.category?.name ?? "General News"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between bg-white/5 dark:bg-transparent">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{article.readTimeMinutes || 3} min read</span>
                      </div>
                    </div>

                    <h3 className="font-display font-extrabold text-body-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200">
                      {article.title}
                    </h3>

                    <p className="text-caption font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 mt-4 shrink-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-5 h-5 bg-brand-500/10 dark:bg-brand-400/10 flex items-center justify-center rounded-full text-[9px] font-black text-brand-600 dark:text-brand-400 shrink-0 border border-brand-500/20">
                        {article.sourceName ? article.sourceName.charAt(0).toUpperCase() : "G"}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">
                        {article.sourceName || "Global Feed"}
                      </span>
                    </div>

                    <a
                      href={article.sourceUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-extrabold text-brand-500 dark:text-brand-400 flex items-center gap-0.5 shrink-0 hover:underline tracking-wide transition-all"
                    >
                      READ ENTRY <ExternalLink className="w-3 h-3 ml-0.5 stroke-[2.5]" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-body-sm font-semibold text-surface-700 dark:text-surface-300 px-4">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}