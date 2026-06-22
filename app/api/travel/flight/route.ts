import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { withErrorBoundary, ExternalServiceError } from "@/lib/errors";

const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  data: FlightData;
  expiresAt: number;
}

interface FlightData {
  flight: string;
  airline: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: string;
  gate?: string;
  terminal?: string;
}

const cache = new Map<string, CacheEntry>();

const DEMO_FLIGHTS: Record<string, FlightData> = {
  AI101: { flight: "AI101", airline: "Air India", origin: "DEL", destination: "JFK", departure: "01:30", arrival: "06:45", status: "On Time", gate: "G12", terminal: "3" },
  AI102: { flight: "AI102", airline: "Air India", origin: "BOM", destination: "LHR", departure: "23:55", arrival: "05:30", status: "Boarding", gate: "B4", terminal: "2" },
  EK502: { flight: "EK502", airline: "Emirates", origin: "DXB", destination: "SYD", departure: "02:15", arrival: "22:30", status: "On Time", gate: "A7", terminal: "3" },
  EK503: { flight: "EK503", airline: "Emirates", origin: "MAA", destination: "DXB", departure: "21:40", arrival: "00:10", status: "Delayed", gate: "C9", terminal: "1" },
  SG123: { flight: "SG123", airline: "SpiceJet", origin: "DEL", destination: "BLR", departure: "06:00", arrival: "08:30", status: "Scheduled", gate: "D3", terminal: "1" },
  UK456: { flight: "UK456", airline: "Vistara", origin: "CCU", destination: "BOM", departure: "14:20", arrival: "16:50", status: "On Time", gate: "E5", terminal: "2" },
  IN175: { flight: "IN175", airline: "IndiGo", origin: "BLR", destination: "DXB", departure: "07:15", arrival: "09:45", status: "On Time", gate: "F2", terminal: "1" },
  AK132: { flight: "AK132", airline: "AirAsia", origin: "KUL", destination: "CCU", departure: "18:30", arrival: "20:10", status: "Delayed", gate: "L11", terminal: "2" },
  BA142: { flight: "BA142", airline: "British Airways", origin: "LHR", destination: "DEL", departure: "10:00", arrival: "23:30", status: "On Time", gate: "A1", terminal: "5" },
  EY232: { flight: "EY232", airline: "Etihad Airways", origin: "AUH", destination: "BOM", departure: "03:45", arrival: "08:55", status: "Boarding", gate: "C3", terminal: "3" },
};

const AIRLABS_FIELDS = [
  "flight_iata",
  "airline_name",
  "dep_iata",
  "arr_iata",
  "dep_time",
  "arr_time",
  "flight_status",
  "dep_terminal",
  "dep_gate",
  "arr_terminal",
  "arr_gate",
].join(",");

async function fetchFromExternalApi(code: string): Promise<FlightData | null> {
  const airlabsKey = process.env.AIRLABS_API_KEY;

  if (airlabsKey) {
    const url = `https://airlabs.co/api/v9/flight?api_key=${airlabsKey}&flight_iata=${code}&_fields=${AIRLABS_FIELDS}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new ExternalServiceError("Airlabs", `HTTP ${res.status}`);
    const body = await res.json();
    if (body.response) {
      const f = body.response;
      return {
        flight: f.flight_iata || code,
        airline: f.airline_name || "",
        origin: f.dep_iata || "",
        destination: f.arr_iata || "",
        departure: f.dep_time || "",
        arrival: f.arr_time || "",
        status: f.flight_status || "Unknown",
        gate: f.dep_gate || f.arr_gate,
        terminal: f.dep_terminal || f.arr_terminal,
      };
    }
  }

  const aviationKey = process.env.AVIATIONSTACK_API_KEY;
  if (aviationKey) {
    const url = `https://api.aviationstack.com/v1/flights?access_key=${aviationKey}&flight_iata=${code}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new ExternalServiceError("Aviationstack", `HTTP ${res.status}`);
    const body = await res.json();
    if (body.data?.length > 0) {
      const f = body.data[0];
      return {
        flight: f.flight?.iata || code,
        airline: f.airline?.name || "",
        origin: f.departure?.iata || "",
        destination: f.arrival?.iata || "",
        departure: f.departure?.scheduled || "",
        arrival: f.arrival?.scheduled || "",
        status: f.flight_status || "Unknown",
        gate: f.departure?.gate,
        terminal: f.departure?.terminal,
      };
    }
  }

  return null;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const [data, error] = await withErrorBoundary(async () => {
    const { searchParams } = request.nextUrl;
    const code = searchParams.get("code")?.toUpperCase().trim();

    if (!code || !/^[A-Z]{2}\d{1,4}$/.test(code)) {
      return null;
    }

    const now = Date.now();
    const cached = cache.get(code);
    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const external = await fetchFromExternalApi(code);
    if (external) {
      cache.set(code, { data: external, expiresAt: now + CACHE_TTL_MS });
      return external;
    }

    const demo = DEMO_FLIGHTS[code];
    if (demo) {
      cache.set(code, { data: demo, expiresAt: now + CACHE_TTL_MS });
      return demo;
    }

    return null;
  }, "GET:/api/travel/flight");

  if (error) return apiError(error);
  if (data === null) {
    return apiSuccess(null, { timestamp: new Date().toISOString() });
  }
  return apiSuccess(data);
}
