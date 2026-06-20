// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Footer Component
// Responsive, high-fidelity footer with strategic links, newsletter,
// trust indicators, and dark mode support (skills.md §2)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plane,
  Mail,
  ShieldCheck,
  Award,
  Globe2,
  Send,
  Heart,
  ChevronRight,
} from "lucide-react";

// Inline brand icon SVGs since lucide-react v1.0.0+ removed social brand logos
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <title>LinkedIn</title>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <title>Twitter/X</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.36l4.73 6.258L18.244 2.25zM17.086 20.5h1.834L7.514 3.75H5.56l11.526 16.75z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <title>Facebook</title>
      <path d="M9.101 11.966H11.59V24H16.59V11.966H19.789L20.257 8.033H16.59V5.556C16.59 4.704 16.92 3.633 18.257 3.633H20.47V0.25C19.28 0.125 17.55 0 15.688 0C11.642 0 8.91 2.395 8.91 7.027V8.033H6V11.966H9.101Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <title>Instagram</title>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubscribed(true);
    setLoading(false);
    setEmail("");
  };

  const footerLinks = {
    inbound: [
      { label: "Visa Guidance", href: "/visa-hub?segment=inbound" },
      { label: "Safety Advisories", href: "/travel-advisories?segment=inbound" },
      { label: "eSIM & Connectivity", href: "/discover/connectivity" },
      { label: "Verified Itineraries", href: "/discover/itineraries" },
      { label: "Luxury Wellness", href: "/discover/wellness" },
    ],
    outbound: [
      { label: "Passport Power Rank", href: "/visa-hub" },
      { label: "Visa-on-Arrival Hub", href: "/visa-hub?type=VISA_ON_ARRIVAL" },
      { label: "Travel Insurance", href: "/services/insurance" },
      { label: "Forex & Currency Card", href: "/services/forex" },
      { label: "Veg Friendly Guides", href: "/discover/culinary" },
    ],
    enterprise: [
      { label: "DMC Solutions", href: "/enterprise/dmc" },
      { label: "Commercial API", href: "/enterprise/api" },
      { label: "Programmatic Ads", href: "/enterprise/advertising" },
      { label: "Supplier Portal", href: "/enterprise/suppliers" },
      { label: "Media Assets", href: "/press" },
    ],
    legal: [
      { label: "Security & Privacy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Trust Center", href: "/trust" },
      { label: "Report Advisory", href: "/contact?ref=advisory" },
    ],
  };

  return (
    <footer
      id="site-footer"
      className="bg-ink text-surface-300 border-t border-sunset-1/10 relative overflow-hidden"
    >
      {/* Sun setting into ocean SVG divider */}
      <div className="w-full relative z-10 pointer-events-none select-none overflow-hidden">
        <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,130 Q720,40 1440,130 L1440,180 L0,180 Z" fill="#060d16" />
          <circle cx="720" cy="90" r="50" fill="url(#sun-glow)" />
          <path d="M630,135 L810,135 M660,145 L780,145 M690,155 L750,155 M705,165 L735,165" stroke="#f7931e" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <defs>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="50%" stopColor="#f7931e" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* ── Newsletter & Trust Segment ────────────────────────────────────── */}
      <div className="border-b border-sunset-1/10 relative z-10">
        <div className="container-wide py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-display font-black text-heading-lg text-white">
              Stay ahead of global travel shifts
            </h3>
            <p className="text-body-sm text-surface-400 max-w-xl">
              Get real-time visa updates, critical security advisories, and curated travel intelligence delivered straight to your inbox.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="relative max-w-lg lg:ml-auto">
              {subscribed ? (
                <div className="bg-success-dark/20 border border-success/30 rounded-xl p-4 text-center text-success-light text-body-sm animate-fade-in flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  Subscription active. You will receive real-time alerts.
                </div>
              ) : (
                <div className="flex gap-2 p-1.5 bg-surface-900 border border-surface-800 rounded-2xl shadow-inner-glow focus-within:border-sunset-1 transition-colors duration-200">
                  <div className="flex items-center pl-3 text-surface-500 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 py-2.5 text-body-sm text-white placeholder-surface-500 focus:outline-none focus:ring-0"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary shrink-0 relative overflow-hidden"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── Main Links Matrix ─────────────────────────────────────────────── */}
      <div className="container-wide py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-4 lg:col-span-4 space-y-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sunset-1 to-sunset-3 flex items-center justify-center shadow-glow-brand">
              <Plane className="w-5 h-5 text-white -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-heading-md text-white">
                Journey<span className="text-sunset-2">Pulse</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">
                India
              </span>
            </div>
          </Link>

          <p className="text-body-sm text-surface-400 leading-relaxed max-w-sm">
            India&apos;s premier intelligence portal. Delivering real-time news, automated visa assessment matrices, and structured regulatory tracking.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-900 border border-surface-800 rounded-xl hover:bg-sunset-1 hover:text-white transition-all duration-200 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-900 border border-surface-800 rounded-xl hover:bg-sunset-1 hover:text-white transition-all duration-200 flex items-center justify-center"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-900 border border-surface-800 rounded-xl hover:bg-sunset-1 hover:text-white transition-all duration-200 flex items-center justify-center"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-900 border border-surface-800 rounded-xl hover:bg-sunset-1 hover:text-white transition-all duration-200 flex items-center justify-center"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4.5 h-4.5" />
              </a>
            </div>

            <div className="flex items-center gap-4 text-caption text-surface-500 pt-2 border-t border-surface-900 max-w-xs">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sunset-2 shrink-0" />
                <span>Tier-1 Travel Intel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-sunset-1 shrink-0" />
                <span>20+ Monitored Feeds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Column 1: Inbound */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
          <h4 className="font-display font-extrabold text-body-sm uppercase tracking-wider text-white">
            Inbound India
          </h4>
          <ul className="space-y-2.5">
            {footerLinks.inbound.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group flex items-center text-body-sm text-surface-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-150 text-sunset-1 mr-1 shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Column 2: Outbound */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
          <h4 className="font-display font-extrabold text-body-sm uppercase tracking-wider text-white">
            Outbound Explorers
          </h4>
          <ul className="space-y-2.5">
            {footerLinks.outbound.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group flex items-center text-body-sm text-surface-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-150 text-sunset-1 mr-1 shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Column 3: Enterprise */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
          <h4 className="font-display font-extrabold text-body-sm uppercase tracking-wider text-white">
            Commercial
          </h4>
          <ul className="space-y-2.5">
            {footerLinks.enterprise.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group flex items-center text-body-sm text-surface-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-150 text-sunset-1 mr-1 shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Column 4: Legal */}
        <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4">
          <h4 className="font-display font-extrabold text-body-sm uppercase tracking-wider text-white">
            Security & Legal
          </h4>
          <ul className="space-y-2.5">
            {footerLinks.legal.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group flex items-center text-body-sm text-surface-400 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-150 text-sunset-1 mr-1 shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Sub-Footer Copyright Segment ──────────────────────────────────── */}
      <div className="border-t border-sunset-1/10 bg-[#060d16] py-6 relative z-10">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4 text-caption text-surface-500">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} JourneyPulse India. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Built with precision for global travellers. Made in India with</span>
            <Heart className="w-3.5 h-3.5 text-sunset-1 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
