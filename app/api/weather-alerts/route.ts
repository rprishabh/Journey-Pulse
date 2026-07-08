// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — /api/weather-alerts — Live Weather Alerts
// Fetches real-time extreme weather conditions from Open-Meteo (free, no key)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface MonitoredCity {
  name: string;
  region: string;
  lat: number;
  lng: number;
  sourceUrl: string;
}

interface WeatherAlert {
  id: string;
  type: "sandstorm" | "tsunami" | "cyclone" | "heavy_rainfall" | "heatwave" | "cold_wave" | "high_winds" | "thunderstorm";
  title: string;
  location: string;
  region: string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY";
  description: string;
  actionGuideline: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
  humidity: number;
  weatherCode: number;
  sourceUrl: string;
  fetchedAt: string;
}

// 25 major global travel destinations to monitor
const MONITORED_CITIES: MonitoredCity[] = [
  { name: "Mumbai", region: "India (South Asia)", lat: 19.076, lng: 72.877, sourceUrl: "https://mausam.imd.gov.in/" },
  { name: "Delhi", region: "India (South Asia)", lat: 28.614, lng: 77.209, sourceUrl: "https://mausam.imd.gov.in/" },
  { name: "Chennai", region: "India (South Asia)", lat: 13.082, lng: 80.271, sourceUrl: "https://mausam.imd.gov.in/" },
  { name: "Kolkata", region: "India (South Asia)", lat: 22.572, lng: 88.363, sourceUrl: "https://mausam.imd.gov.in/" },
  { name: "Dubai", region: "UAE (Middle East)", lat: 25.204, lng: 55.270, sourceUrl: "https://ncm.ae/" },
  { name: "Riyadh", region: "Saudi Arabia (Middle East)", lat: 24.713, lng: 46.675, sourceUrl: "https://ncm.gov.sa/" },
  { name: "Tokyo", region: "Japan (East Asia)", lat: 35.676, lng: 139.650, sourceUrl: "https://www.jma.go.jp/" },
  { name: "Bangkok", region: "Thailand (Southeast Asia)", lat: 13.756, lng: 100.501, sourceUrl: "https://www.tmd.go.th/" },
  { name: "Singapore", region: "Singapore (Southeast Asia)", lat: 1.352, lng: 103.819, sourceUrl: "https://www.weather.gov.sg/" },
  { name: "London", region: "United Kingdom (Europe)", lat: 51.507, lng: -0.127, sourceUrl: "https://www.metoffice.gov.uk/" },
  { name: "Paris", region: "France (Europe)", lat: 48.856, lng: 2.352, sourceUrl: "https://meteofrance.com/" },
  { name: "New York", region: "USA (North America)", lat: 40.712, lng: -74.006, sourceUrl: "https://www.weather.gov/" },
  { name: "Los Angeles", region: "USA (North America)", lat: 34.052, lng: -118.243, sourceUrl: "https://www.weather.gov/" },
  { name: "Sydney", region: "Australia (Oceania)", lat: -33.868, lng: 151.209, sourceUrl: "http://www.bom.gov.au/" },
  { name: "Cairo", region: "Egypt (Africa)", lat: 30.044, lng: 31.235, sourceUrl: "https://www.ema.gov.eg/" },
  { name: "Istanbul", region: "Turkey (Europe/Asia)", lat: 41.008, lng: 28.978, sourceUrl: "https://www.mgm.gov.tr/" },
  { name: "Kuala Lumpur", region: "Malaysia (Southeast Asia)", lat: 3.139, lng: 101.686, sourceUrl: "https://www.met.gov.my/" },
  { name: "Doha", region: "Qatar (Middle East)", lat: 25.286, lng: 51.534, sourceUrl: "https://qweather.gov.qa/" },
  { name: "Nairobi", region: "Kenya (East Africa)", lat: -1.286, lng: 36.817, sourceUrl: "https://www.meteo.go.ke/" },
  { name: "São Paulo", region: "Brazil (South America)", lat: -23.550, lng: -46.633, sourceUrl: "https://www.inmet.gov.br/" },
  { name: "Mexico City", region: "Mexico (North America)", lat: 19.432, lng: -99.133, sourceUrl: "https://smn.conagua.gob.mx/" },
  { name: "Manila", region: "Philippines (Southeast Asia)", lat: 14.599, lng: 120.984, sourceUrl: "https://www.pagasa.dost.gov.ph/" },
  { name: "Dhaka", region: "Bangladesh (South Asia)", lat: 23.810, lng: 90.412, sourceUrl: "https://bmd.gov.bd/" },
  { name: "Kathmandu", region: "Nepal (South Asia)", lat: 27.717, lng: 85.323, sourceUrl: "https://www.mfd.gov.np/" },
  { name: "Colombo", region: "Sri Lanka (South Asia)", lat: 6.927, lng: 79.861, sourceUrl: "https://www.meteo.gov.lk/" },
];

// WMO Weather interpretation codes → alert type mapping
function classifyWeatherCode(code: number): WeatherAlert["type"] | null {
  // Thunderstorms
  if (code >= 95) return "thunderstorm";
  // Freezing rain / sleet
  if (code >= 66 && code <= 69) return "cold_wave";
  // Heavy rain / showers
  if (code >= 61 && code <= 65) return "heavy_rainfall";
  if (code >= 80 && code <= 82) return "heavy_rainfall";
  // Snow heavy
  if (code >= 71 && code <= 77) return "cold_wave";
  // Drizzle heavy
  if (code >= 55 && code <= 57) return "heavy_rainfall";
  // Fog (dust/sand haze)
  if (code >= 45 && code <= 48) return "sandstorm";
  return null;
}

function getAlertTitle(type: WeatherAlert["type"], city: string, temp: number, wind: number, precip: number): string {
  switch (type) {
    case "heatwave": return `Extreme Heat Warning: ${temp.toFixed(1)}°C`;
    case "cold_wave": return `Cold Wave Alert: ${temp.toFixed(1)}°C`;
    case "heavy_rainfall": return `Heavy Rainfall & Flood Risk`;
    case "high_winds": return `High Wind Advisory: ${wind.toFixed(0)} km/h`;
    case "thunderstorm": return `Severe Thunderstorm Warning`;
    case "sandstorm": return `Dust Storm & Low Visibility`;
    case "cyclone": return `Cyclonic Storm Movement`;
    default: return `Weather Alert Active`;
  }
}

function getActionGuideline(type: WeatherAlert["type"]): string {
  switch (type) {
    case "heatwave": return "Stay hydrated; avoid outdoor exposure between 11 AM–4 PM. Use sun protection.";
    case "cold_wave": return "Wear layered clothing; avoid prolonged outdoor stays. Watch for icy roads.";
    case "heavy_rainfall": return "Avoid low-lying areas; postpone non-essential travel. Monitor flash flood warnings.";
    case "high_winds": return "Secure loose objects; avoid open areas and high-rise observation decks.";
    case "thunderstorm": return "Stay indoors; avoid open fields and tall structures. Do not shelter under trees.";
    case "sandstorm": return "Stay indoors; wear masks if outdoors. Use vehicle fog lights in low visibility.";
    case "cyclone": return "Evacuate coastal areas; follow local emergency directives. Stock essentials.";
    default: return "Monitor local weather updates and follow official advisories.";
  }
}

function getDescription(type: WeatherAlert["type"], city: string, temp: number, wind: number, precip: number, humidity: number): string {
  switch (type) {
    case "heatwave":
      return `Temperatures in ${city} have reached ${temp.toFixed(1)}°C with humidity at ${humidity}%. Heat stress risk is elevated for outdoor travellers. Wind speeds at ${wind.toFixed(0)} km/h provide minimal relief.`;
    case "cold_wave":
      return `${city} is experiencing unusually cold conditions at ${temp.toFixed(1)}°C. Freezing precipitation and icy conditions may affect transport. Humidity at ${humidity}%.`;
    case "heavy_rainfall":
      return `${city} is receiving ${precip.toFixed(1)}mm of precipitation. Waterlogging, reduced visibility, and transit disruptions are likely. Current temperature: ${temp.toFixed(1)}°C.`;
    case "high_winds":
      return `Wind speeds in ${city} have reached ${wind.toFixed(0)} km/h. Outdoor activities and aviation may be affected. Temperature at ${temp.toFixed(1)}°C with ${humidity}% humidity.`;
    case "thunderstorm":
      return `Severe thunderstorm activity detected in ${city} with intense precipitation (${precip.toFixed(1)}mm) and wind gusts up to ${wind.toFixed(0)} km/h. Lightning risk is high.`;
    case "sandstorm":
      return `Dust suspension and reduced visibility in ${city}. Visibility may drop below 1km. Wind speeds at ${wind.toFixed(0)} km/h. Temperature: ${temp.toFixed(1)}°C.`;
    case "cyclone":
      return `Cyclonic conditions near ${city} with wind speeds reaching ${wind.toFixed(0)} km/h and heavy precipitation of ${precip.toFixed(1)}mm. Sea conditions hazardous.`;
    default:
      return `Weather conditions in ${city}: ${temp.toFixed(1)}°C, wind ${wind.toFixed(0)} km/h, precipitation ${precip.toFixed(1)}mm.`;
  }
}

function determineSeverity(type: WeatherAlert["type"], temp: number, wind: number, precip: number): WeatherAlert["severity"] {
  if (type === "cyclone" || type === "thunderstorm") return "CRITICAL";
  if (type === "heatwave" && temp >= 45) return "CRITICAL";
  if (type === "heavy_rainfall" && precip >= 50) return "CRITICAL";
  if (type === "high_winds" && wind >= 80) return "CRITICAL";
  if (type === "heatwave" && temp >= 40) return "WARNING";
  if (type === "cold_wave" && temp <= -5) return "WARNING";
  if (type === "heavy_rainfall" && precip >= 20) return "WARNING";
  if (type === "high_winds" && wind >= 60) return "WARNING";
  return "ADVISORY";
}

// In-memory cache
let cachedAlerts: WeatherAlert[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchLiveAlerts(): Promise<WeatherAlert[]> {
  const now = Date.now();
  if (cachedAlerts && (now - cacheTimestamp) < CACHE_TTL_MS) {
    return cachedAlerts;
  }

  const alerts: WeatherAlert[] = [];

  // Build batch request — Open-Meteo supports multi-location in one call
  const lats = MONITORED_CITIES.map(c => c.lat).join(",");
  const lngs = MONITORED_CITIES.map(c => c.lng).join(",");

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&timezone=auto`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { "User-Agent": "TravelPulse-India/1.0" },
    });

    if (!res.ok) {
      console.error(`[WeatherAlerts] Open-Meteo returned ${res.status}`);
      return cachedAlerts || [];
    }

    const data = await res.json();

    // Open-Meteo returns an array when multiple locations are requested
    const results = Array.isArray(data) ? data : [data];

    for (let i = 0; i < results.length && i < MONITORED_CITIES.length; i++) {
      const city = MONITORED_CITIES[i];
      const current = results[i]?.current;
      if (!current) continue;

      const temp = current.temperature_2m ?? 0;
      const humidity = current.relative_humidity_2m ?? 0;
      const precip = current.precipitation ?? 0;
      const weatherCode = current.weather_code ?? 0;
      const windSpeed = current.wind_speed_10m ?? 0;
      const windGusts = current.wind_gusts_10m ?? windSpeed;

      // Determine alert type
      let alertType: WeatherAlert["type"] | null = null;

      // Temperature extremes
      if (temp >= 38) alertType = "heatwave";
      else if (temp <= -5) alertType = "cold_wave";
      // Wind extremes
      else if (windSpeed >= 50 || windGusts >= 70) alertType = "high_winds";
      // Precipitation extremes
      else if (precip >= 10) alertType = "heavy_rainfall";
      // Weather code based
      else alertType = classifyWeatherCode(weatherCode);

      // Cyclone detection (high wind + high precip combo)
      if (windSpeed >= 90 && precip >= 30) alertType = "cyclone";

      if (!alertType) continue;

      const severity = determineSeverity(alertType, temp, windSpeed, precip);

      alerts.push({
        id: `live-${city.name.toLowerCase().replace(/\s/g, "-")}-${Date.now()}`,
        type: alertType,
        title: getAlertTitle(alertType, city.name, temp, windSpeed, precip),
        location: city.name,
        region: city.region,
        severity,
        description: getDescription(alertType, city.name, temp, windSpeed, precip, humidity),
        actionGuideline: getActionGuideline(alertType),
        temperature: temp,
        windSpeed,
        precipitation: precip,
        humidity,
        weatherCode,
        sourceUrl: city.sourceUrl,
        fetchedAt: new Date().toISOString(),
      });
    }

    // Sort by severity (CRITICAL first, then WARNING, then ADVISORY)
    const severityOrder = { CRITICAL: 0, WARNING: 1, ADVISORY: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    cachedAlerts = alerts;
    cacheTimestamp = now;

    console.log(`[WeatherAlerts] ✅ Fetched ${alerts.length} active alerts from ${MONITORED_CITIES.length} cities`);
  } catch (err) {
    console.error("[WeatherAlerts] ❌ Fetch failed:", err);
    if (cachedAlerts) return cachedAlerts;
  }

  return alerts;
}

export async function GET(_request: NextRequest) {
  try {
    const alerts = await fetchLiveAlerts();
    return NextResponse.json({
      success: true,
      data: alerts,
      meta: {
        totalAlerts: alerts.length,
        monitoredCities: MONITORED_CITIES.length,
        fetchedAt: new Date().toISOString(),
        cacheAge: cachedAlerts ? Date.now() - cacheTimestamp : 0,
      },
    });
  } catch (err) {
    console.error("[WeatherAlerts] Route error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch weather alerts" },
      { status: 500 }
    );
  }
}
