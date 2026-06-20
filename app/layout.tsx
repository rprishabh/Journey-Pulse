// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Root Layout
// Next.js 14 App Router with dark mode, fonts, SEO metadata
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import "./globals.css";

// ═══════════════════════════════════════════════════════════════════════════════
// FONTS (Modern typography — skills.md §2)
// ═══════════════════════════════════════════════════════════════════════════════

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEO METADATA (skills.md §3: Omni-Algorithm Ingestion)
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "JourneyPulse India — Live Travel News, Visa Updates & Advisories",
    template: "%s | JourneyPulse India",
  },
  description:
    "India's premier travel intelligence platform. Live news aggregation from 20+ sources, real-time visa requirements for Indian passport holders, travel advisories, government tourism initiatives, and daily facts about Incredible India.",
  keywords: [
    "India travel news",
    "visa requirements India",
    "Indian passport visa",
    "travel advisory India",
    "tourism India",
    "Incredible India",
    "travel updates",
    "visa on arrival",
    "e-visa India",
    "travel alerts",
  ],
  authors: [{ name: "JourneyPulse India" }],
  creator: "JourneyPulse India",
  publisher: "JourneyPulse India",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "JourneyPulse India",
    title: "JourneyPulse India — Live Travel News, Visa Updates & Advisories",
    description: "India's premier travel intelligence platform with live news, visa data, and travel advisories.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "JourneyPulse India" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JourneyPulse India — Live Travel News, Visa Updates & Advisories",
    description: "India's premier travel intelligence platform.",
    creator: "@JourneyPulseIN",
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURED DATA (JSON-LD for SEO/AEO — skills.md §3)
// ═══════════════════════════════════════════════════════════════════════════════

function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JourneyPulse India",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    description: "India's premier travel intelligence platform with live news aggregation, visa requirements, and travel advisories.",
    publisher: {
      "@type": "Organization",
      name: "JourneyPulse India",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DARK MODE SCRIPT (prevents FOUC — injected before hydration)
// ═══════════════════════════════════════════════════════════════════════════════

const DARK_MODE_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
`;

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd />
        <script dangerouslySetInnerHTML={{ __html: DARK_MODE_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Breaking News Ticker — pinned to top */}
        <BreakingNewsTicker />

        {/* Global Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
