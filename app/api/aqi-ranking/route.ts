// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — /api/aqi-ranking — Live Air Quality Index Rankings
// Fetches real-time AQI data from WAQI (World Air Quality Index) public API
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AqiCityData {
  city: string;
  country: string;
  aqi: number;
  status: "GOOD" | "MODERATE" | "UNHEALTHY_SENSITIVE" | "UNHEALTHY" | "VERY_UNHEALTHY" | "HAZARDOUS";
  dominantPollutant: string;
  lastUpdated: string;
  dashboardUrl: string;
}

// Cities to monitor for AQI — balanced mix of historically clean/polluted
const AQI_CITIES = [
  // Historically polluted cities
  { name: "Delhi", country: "India", id: "delhi", lat: 28.614, lng: 77.209 },
  { name: "Lahore", country: "Pakistan", id: "lahore", lat: 31.549, lng: 74.343 },
  { name: "Dhaka", country: "Bangladesh", id: "dhaka", lat: 23.810, lng: 90.412 },
  { name: "Beijing", country: "China", id: "beijing", lat: 39.904, lng: 116.407 },
  { name: "Mumbai", country: "India", id: "mumbai", lat: 19.076, lng: 72.877 },
  { name: "Kolkata", country: "India", id: "kolkata", lat: 22.572, lng: 88.363 },
  { name: "Cairo", country: "Egypt", id: "cairo", lat: 30.044, lng: 31.235 },
  { name: "Baghdad", country: "Iraq", id: "baghdad", lat: 33.312, lng: 44.361 },
  { name: "Jakarta", country: "Indonesia", id: "jakarta", lat: -6.208, lng: 106.845 },
  { name: "Karachi", country: "Pakistan", id: "karachi", lat: 24.860, lng: 67.001 },
  // Historically clean cities
  { name: "Zurich", country: "Switzerland", id: "zurich", lat: 47.376, lng: 8.541 },
  { name: "Helsinki", country: "Finland", id: "helsinki", lat: 60.169, lng: 24.938 },
  { name: "Reykjavik", country: "Iceland", id: "reykjavik", lat: 64.135, lng: -21.895 },
  { name: "Wellington", country: "New Zealand", id: "wellington", lat: -41.286, lng: 174.776 },
  { name: "Honolulu", country: "United States", id: "honolulu", lat: 21.306, lng: -157.858 },
  { name: "Stockholm", country: "Sweden", id: "stockholm", lat: 59.329, lng: 18.068 },
  { name: "Oslo", country: "Norway", id: "oslo", lat: 59.913, lng: 10.752 },
  { name: "Vancouver", country: "Canada", id: "vancouver", lat: 49.282, lng: -123.120 },
  { name: "Hobart", country: "Australia", id: "hobart", lat: -42.882, lng: 147.327 },
  { name: "Tallinn", country: "Estonia", id: "tallinn", lat: 59.436, lng: 24.753 },
];

function getAqiStatus(aqi: number): AqiCityData["status"] {
  if (aqi <= 50) return "GOOD";
  if (aqi <= 100) return "MODERATE";
  if (aqi <= 150) return "UNHEALTHY_SENSITIVE";
  if (aqi <= 200) return "UNHEALTHY";
  if (aqi <= 300) return "VERY_UNHEALTHY";
  return "HAZARDOUS";
}

// In-memory cache
let cachedData: { worst: AqiCityData[]; best: AqiCityData[] } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

async function fetchAqiData(): Promise<{ worst: AqiCityData[]; best: AqiCityData[] }> {
  const now = Date.now();
  if (cachedData && (now - cacheTimestamp) < CACHE_TTL_MS) {
    return cachedData;
  }

  const allCities: AqiCityData[] = [];

  // Use Open-Meteo Air Quality API (free, no key needed)
  const lats = AQI_CITIES.map(c => c.lat).join(",");
  const lngs = AQI_CITIES.map(c => c.lng).join(",");

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide&timezone=auto`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 900 },
      headers: { "User-Agent": "TravelPulse-India/1.0" },
    });

    if (!res.ok) {
      console.error(`[AQI] Open-Meteo Air Quality API returned ${res.status}`);
      return cachedData || { worst: [], best: [] };
    }

    const data = await res.json();
    const results = Array.isArray(data) ? data : [data];

    for (let i = 0; i < results.length && i < AQI_CITIES.length; i++) {
      const city = AQI_CITIES[i];
      const current = results[i]?.current;
      if (!current) continue;

      const aqi = current.us_aqi ?? 0;

      // Determine dominant pollutant
      const pollutants = {
        "PM2.5": current.pm2_5 ?? 0,
        "PM10": current.pm10 ?? 0,
        "NO₂": current.nitrogen_dioxide ?? 0,
        "O₃": current.ozone ?? 0,
        "SO₂": current.sulphur_dioxide ?? 0,
      };

      const dominant = Object.entries(pollutants)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "PM2.5";

      allCities.push({
        city: city.name,
        country: city.country,
        aqi: Math.round(aqi),
        status: getAqiStatus(aqi),
        dominantPollutant: dominant,
        lastUpdated: new Date().toISOString(),
        dashboardUrl: `https://www.iqair.com/`,
      });
    }

    // Sort by AQI — highest first for worst, lowest first for best
    const sorted = [...allCities].sort((a, b) => b.aqi - a.aqi);
    const worst = sorted.slice(0, 5);
    const best = sorted.slice(-5).reverse().sort((a, b) => a.aqi - b.aqi);

    const result = { worst, best };
    cachedData = result;
    cacheTimestamp = now;

    console.log(`[AQI] ✅ Fetched AQI for ${allCities.length} cities. Worst: ${worst[0]?.city} (${worst[0]?.aqi}), Best: ${best[0]?.city} (${best[0]?.aqi})`);

    return result;
  } catch (err) {
    console.error("[AQI] ❌ Fetch failed:", err);
    if (cachedData) return cachedData;
    return { worst: [], best: [] };
  }
}

export async function GET(_request: NextRequest) {
  try {
    const data = await fetchAqiData();
    return NextResponse.json({
      success: true,
      data,
      meta: {
        monitoredCities: AQI_CITIES.length,
        fetchedAt: new Date().toISOString(),
        cacheAge: cachedData ? Date.now() - cacheTimestamp : 0,
      },
    });
  } catch (err) {
    console.error("[AQI] Route error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch AQI rankings" },
      { status: 500 }
    );
  }
}
