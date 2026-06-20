// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Header Component
// Responsive navigation with dark mode toggle, mobile drawer,
// glassmorphic surface surfaces, and an infinite marquee intelligence ticker.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Newspaper,
  Shield,
  Plane,
  Menu,
  X,
  Moon,
  Sun,
  Search,
  ChevronDown,
  Compass,
  Building2,
  Sparkles,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "News",
    href: "/",
    icon: Newspaper,
    description: "Latest travel news from 20+ sources",
  },
  {
    label: "Visa Hub",
    href: "/visa-hub",
    icon: Globe,
    description: "Visa requirements & processing times",
    children: [
      { label: "Outbound Visas", href: "/visa-hub?segment=outbound", icon: Plane, description: "For Indian passport holders" },
      { label: "Inbound Visas", href: "/visa-hub?segment=inbound", icon: Compass, description: "Visitors entering India" },
      { label: "Compare Countries", href: "/visa-hub/compare", icon: TrendingUp, description: "Side-by-side comparison" },
    ],
  },
  {
    label: "Advisories",
    href: "/travel-advisories",
    icon: Shield,
    description: "Safety alerts & travel warnings",
  },
  {
    label: "Discover India",
    href: "/#daily-facts",
    icon: Sparkles,
    description: "Daily facts & hidden gems",
    children: [
      { label: "Daily Facts", href: "/#daily-facts", icon: CalendarDays, description: "Today's India fact" },
      { label: "Heritage & Culture", href: "/#tourism-timeline", icon: Building2, description: "UNESCO sites & monuments" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DARK MODE HOOK
// ═══════════════════════════════════════════════════════════════════════════════

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored === "dark" || (!stored && prefersDark);
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }, []);

  return { isDark, toggle };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function Header() {
  const pathname = usePathname();
  const { isDark, toggle } = useDarkMode();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // ── Scroll detection for header background ────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Close mobile menu on route change ─────────────────────────────────
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // ── Lock body scroll when mobile menu is open ─────────────────────────
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? "glass-strong shadow-glass"
        : "bg-white/0 dark:bg-surface-950/0"
        }`}
    >
      <div className="container-wide">
        <nav className="flex items-center justify-between h-16">
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="JourneyPulse India — Home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow-brand group-hover:shadow-glow-accent transition-shadow duration-300">
              <Plane className="w-5 h-5 text-white -rotate-45" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-surface-950 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-heading-md leading-none tracking-tight text-surface-900 dark:text-white">
                Journey<span className="text-gradient">Pulse</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400 leading-none mt-0.5">
                India
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation ───────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">

            {/* ── Infinite Live Intel & Trending Places Ticker Marquee ── */}
            <div className="mr-6 hidden xl:flex items-center w-80 h-9 overflow-hidden glass-panel rounded-full relative border border-surface-200/60 dark:border-surface-800/50">
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white/80 dark:from-surface-900/80 to-transparent z-10 rounded-l-full pointer-events-none" />

              <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] items-center text-[10px] font-bold tracking-wider">
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  DELHI AQI: 312 (SEVERE)
                </span>
                <span className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  TRENDING: LEH LADAKH OPEN
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  SRILANKA: VISA FREE ENTRY
                </span>
                <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                  MUMBAI AIRPORT: APP UPDATED
                </span>

                {/* Perfect mirrored set to guarantee a seamless infinite scroll loop */}
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  DELHI AQI: 312 (SEVERE)
                </span>
                <span className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  TRENDING: LEH LADAKH OPEN
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  SRILANKA: VISA FREE ENTRY
                </span>
                <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 mx-4 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                  MUMBAI AIRPORT: APP UPDATED
                </span>
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white/80 dark:from-surface-900/80 to-transparent z-10 rounded-r-full pointer-events-none" />
            </div>

            {NAV_ITEMS.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isActive(item.href);

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-body-sm font-semibold transition-all duration-200 ${active
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
                      : "text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-white dark:hover:bg-surface-800"
                      }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {hasChildren && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.href ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </Link>

                  {/* ── High Contrast Camouflage-Proof Dropdown Menu Menu ── */}
                  {hasChildren && openDropdown === item.href && (
                    <div className="absolute top-full left-0 mt-2 w-72 glass-strong rounded-2xl p-2.5 animate-slide-up origin-top-left shadow-xl z-50">
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-surface-100/70 dark:hover:bg-white/5 transition-all duration-150 group/item"
                        >
                          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-brand-600 transition-colors duration-200">
                            <child.icon className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400 group-hover/item:text-white transition-colors" />
                          </div>
                          <div className="overflow-hidden">
                            {/* Explicit high-contrast settings prevent dark/light theme blending bugs */}
                            <div className="text-body-sm font-bold text-slate-900 dark:text-slate-100 transition-colors">
                              {child.label}
                            </div>
                            <div className="text-caption font-medium text-slate-500 dark:text-slate-400 mt-0.5 leading-snug break-words">
                              {child.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Right Actions ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              id="search-trigger"
              className="btn-ghost rounded-xl p-2.5 text-surface-600 dark:text-surface-400"
              aria-label="Search articles"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle"
              onClick={toggle}
              className="btn-ghost rounded-xl p-2.5 group text-surface-600 dark:text-surface-400"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-surface-500 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden btn-ghost rounded-xl p-2.5 text-surface-600 dark:text-surface-400"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          MOBILE DRAWER
          ═════════════════════════════════════════════════════════════════════ */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed top-16 right-0 bottom-0 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-surface-950 border-l border-surface-200 dark:border-surface-800 z-50 lg:hidden overflow-y-auto animate-slide-in-right">
            <div className="p-4 space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <div key={item.href} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors duration-150 ${isActive(item.href)
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
                      : "text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <div className="font-bold text-surface-900 dark:text-white">{item.label}</div>
                      {item.description && (
                        <div className="text-caption text-surface-500 dark:text-surface-400 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Mobile sub-items */}
                  {item.children && (
                    <div className="ml-8 mt-1 space-y-0.5">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-body-sm text-surface-600 hover:text-surface-900 hover:bg-surface-50 dark:text-surface-400 dark:hover:text-white dark:hover:bg-surface-800/50 transition-colors font-medium"
                        >
                          <child.icon className="w-4 h-4" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="p-4 mt-4 border-t border-surface-200 dark:border-surface-800">
              <div className="glass-panel p-4 text-center rounded-2xl border border-surface-200/60 dark:border-surface-800/40">
                <p className="text-body-sm font-medium text-surface-600 dark:text-surface-400 mb-3">
                  🇮🇳 Discover India&apos;s hidden gems
                </p>
                <Link
                  href="/#daily-facts"
                  className="btn btn-sm btn-primary w-full"
                >
                  <Sparkles className="w-4 h-4" />
                  Today&apos;s Fact
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}