// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Root Layout
// Next.js 14 App Router with dark mode, fonts, SEO metadata
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AlertTicker } from "@/components/AlertTicker";
import { SkipAnimationsButton } from "@/components/SkipAnimationsButton";
import "./globals.css";

// ═══════════════════════════════════════════════════════════════════════════════
// FONTS (Outfit display & Plus Jakarta Sans body)
// ═══════════════════════════════════════════════════════════════════════════════

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// ═══════════════════════════════════════════════════════════════════════════════
// SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "JourneyPulse India — Live Travel News, Visa Updates & Advisories",
    template: "%s | JourneyPulse India",
  },
  description:
    "India's premier travel intelligence platform. Live news aggregation, real-time visa requirements for Indian passport holders, travel advisories, government tourism initiatives, and daily facts about Incredible India.",
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
    { media: "(prefers-color-scheme: light)", color: "#fef9f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1929" },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRUCTURED DATA (JSON-LD for SEO/AEO)
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
      className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd />
        <script dangerouslySetInnerHTML={{ __html: DARK_MODE_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col relative select-none">
        {/* Grain overlay for paper tactile feel */}
        <div className="grain-overlay" />

        {/* Alert Ticker banner */}
        <AlertTicker />

        {/* Global Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 w-full relative z-10">{children}</main>

        {/* Skip Animation Toggle */}
        <SkipAnimationsButton />

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
