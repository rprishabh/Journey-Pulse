import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunset: {
          1: "#ff6b35",
          2: "#f7931e",
          3: "#e84393",
          4: "#6c5ce7",
        },
        cream: "#fef9f3",
        ink: "#0c1929",
        brand: {
          50: "#fff9f5",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#ff6b35",
          600: "#f7931e",
          700: "#e84393",
          800: "#6c5ce7",
          900: "#0c1929",
          950: "#060d16",
        },
        surface: {
          50: "#fef9f3",
          100: "#fbf2e6",
          200: "#f6e3cc",
          300: "#eec19b",
          400: "#e29762",
          500: "#ff6b35",
          600: "#b85e26",
          700: "#93451b",
          800: "#682e12",
          900: "#0c1929",
          950: "#060d16",
        },
        success: { DEFAULT: "#10b981", light: "#d1fae5", dark: "#065f46" },
        warning: { DEFAULT: "#f59e0b", light: "#fef3c7", dark: "#92400e" },
        danger:  { DEFAULT: "#ef4444", light: "#fee2e2", dark: "#991b1b" },
        info:    { DEFAULT: "#3b82f6", light: "#dbeafe", dark: "#1e40af" },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "Syne", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-md": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "heading-xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.005em" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(12, 25, 41, 0.08)",
        "glass-lg": "0 16px 48px rgba(12, 25, 41, 0.12)",
        "glass-xl": "0 24px 64px rgba(12, 25, 41, 0.16)",
        "glow-brand": "0 0 24px rgba(255, 107, 53, 0.3)",
        "glow-accent": "0 0 24px rgba(247, 147, 30, 0.3)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(135deg, var(--ink) 0%, var(--sunset-4) 50%, var(--sunset-3) 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        "shimmer": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
      },
      keyframes: {
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(255,107,53,0.2)" },
          "50%": { boxShadow: "0 0 24px rgba(255,107,53,0.4)" },
        },
      },
      animation: {
        "ticker-scroll": "ticker-scroll 60s linear infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
