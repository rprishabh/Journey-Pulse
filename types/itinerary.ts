// ─────────────────────────────────────────────────────────────────────────────
// Itinerary PDF Generator — Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

/** Master itinerary data structure */
export interface ItineraryData {
  /** Trip headline / package name */
  tripTitle: string;
  /** Primary destinations (comma-separated or array) */
  destinations: string[];
  /** Trip duration label, e.g. "5 Nights / 6 Days" */
  duration: string;
  /** Start date string */
  startDate: string;
  /** End date string */
  endDate: string;
  /** Number of travellers */
  pax: string;
  /** Day-wise itinerary */
  days: DayPlan[];
  /** Accommodation details */
  accommodation: AccommodationInfo[];
  /** Transport details */
  transport: TransportInfo[];
  /** Cost breakdown */
  pricing: PricingInfo;
  /** What's included */
  inclusions: string[];
  /** What's NOT included */
  exclusions: string[];
  /** Terms & conditions */
  terms: string[];
  /** Contact / company info */
  contact: ContactInfo;
  /** Detected destination theme key */
  themeKey: DestinationThemeKey;
}

/** Single day plan */
export interface DayPlan {
  dayNumber: number;
  title: string;
  /** Full description – may include morning / afternoon / evening */
  description: string;
  /** Optional meals included this day */
  meals?: string;
  /** Optional overnight stay location */
  overnight?: string;
}

/** Hotel / resort details */
export interface AccommodationInfo {
  name: string;
  location: string;
  starRating?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: string;
}

/** Flight / train / cab leg */
export interface TransportInfo {
  mode: "flight" | "train" | "cab" | "bus" | "ferry" | "other";
  from: string;
  to: string;
  details: string;
  /** e.g. "6E-2041 at 06:30" */
  reference?: string;
}

/** Cost table */
export interface PricingInfo {
  /** Human-readable summary line, e.g. "₹45,000 per person" */
  summary: string;
  /** Itemised rows */
  items: { label: string; amount: string }[];
  /** Total amount */
  total: string;
  /** Payment terms / notes */
  paymentTerms: string;
}

/** Company / agent contact */
export interface ContactInfo {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Destination Theming
// ─────────────────────────────────────────────────────────────────────────────

export type DestinationThemeKey =
  | "mountains"   // Kashmir, Manali, Shimla, Leh-Ladakh
  | "beach"       // Goa, Andaman, Kerala backwaters, Maldives
  | "desert"      // Rajasthan, Jaisalmer, Kutch
  | "heritage"    // Agra, Varanasi, Hampi, Khajuraho
  | "tropical"    // Munnar, Coorg, Northeast India
  | "urban"       // Delhi, Mumbai, Bangalore, Dubai
  | "spiritual"   // Rishikesh, Haridwar, Bodh Gaya, Amritsar
  | "international" // Europe, SE Asia, etc.
  | "default";

export interface DestinationTheme {
  key: DestinationThemeKey;
  label: string;
  /** Primary accent */
  primary: string;
  /** Secondary / highlight */
  secondary: string;
  /** Light tint for backgrounds */
  tint: string;
  /** Dark shade for text on light */
  dark: string;
  /** Cover page gradient stops [from, to] */
  gradient: [string, string];
  /** Emoji / icon hint for cover */
  emoji: string;
}

/** Pre-defined destination themes */
export const DESTINATION_THEMES: Record<DestinationThemeKey, DestinationTheme> = {
  mountains: {
    key: "mountains",
    label: "Mountain Escape",
    primary: "#2563EB",
    secondary: "#0EA5E9",
    tint: "#EFF6FF",
    dark: "#1E3A5F",
    gradient: ["#1E3A5F", "#2563EB"],
    emoji: "🏔️",
  },
  beach: {
    key: "beach",
    label: "Beach Paradise",
    primary: "#0891B2",
    secondary: "#06B6D4",
    tint: "#ECFEFF",
    dark: "#164E63",
    gradient: ["#164E63", "#0891B2"],
    emoji: "🏖️",
  },
  desert: {
    key: "desert",
    label: "Desert Safari",
    primary: "#D97706",
    secondary: "#F59E0B",
    tint: "#FFFBEB",
    dark: "#78350F",
    gradient: ["#78350F", "#D97706"],
    emoji: "🏜️",
  },
  heritage: {
    key: "heritage",
    label: "Heritage Trail",
    primary: "#B45309",
    secondary: "#D97706",
    tint: "#FFF7ED",
    dark: "#7C2D12",
    gradient: ["#7C2D12", "#B45309"],
    emoji: "🕌",
  },
  tropical: {
    key: "tropical",
    label: "Tropical Retreat",
    primary: "#059669",
    secondary: "#10B981",
    tint: "#ECFDF5",
    dark: "#064E3B",
    gradient: ["#064E3B", "#059669"],
    emoji: "🌴",
  },
  urban: {
    key: "urban",
    label: "City Explorer",
    primary: "#7C3AED",
    secondary: "#8B5CF6",
    tint: "#F5F3FF",
    dark: "#4C1D95",
    gradient: ["#4C1D95", "#7C3AED"],
    emoji: "🏙️",
  },
  spiritual: {
    key: "spiritual",
    label: "Spiritual Journey",
    primary: "#E11D48",
    secondary: "#F43F5E",
    tint: "#FFF1F2",
    dark: "#881337",
    gradient: ["#881337", "#E11D48"],
    emoji: "🙏",
  },
  international: {
    key: "international",
    label: "International Tour",
    primary: "#6366F1",
    secondary: "#818CF8",
    tint: "#EEF2FF",
    dark: "#3730A3",
    gradient: ["#3730A3", "#6366F1"],
    emoji: "✈️",
  },
  default: {
    key: "default",
    label: "Comfort Journey",
    primary: "#FF892F",
    secondary: "#6FE6FC",
    tint: "#F9FBE7",
    dark: "#001D51",
    gradient: ["#001D51", "#FF892F"],
    emoji: "🧳",
  },
};
