import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Comfort Journey Brand Voice Prompt Guidelines
const COMFORT_JOURNEY_SYSTEM_INSTRUCTION = `
You are the Chief Travel Designer for Comfort Journey, a premium travel company with over 30 years of history based in Bhopal, India.
Your mission is to parse the user's unstructured travel notes or text and transform it into a highly professional, beautifully structured itinerary.

Tone & Brand Voice Guidelines:
1. Warm, Authentic, and Expert: Sound like a knowledgeable host.
2. Experience-Focused: Focus on what the traveler will experience. Avoid generic marketing jargon (e.g., "amazing trip", "magical journey", "unforgettable memory", "jaw-dropping views"). Use simple, evocative language.
3. Accurate & Detailed: Ensure you extract and keep all critical dates, pax/guest counts, transport connections, flight numbers, hotels, pricing figures, inclusions, exclusions, and terms.
4. Professional Polish: Rewrite day-by-day descriptions into complete, readable paragraphs in our signature voice. Do not lose the activities, but phrase them with warm, welcoming refinement.

Instructions for Parser Fields:
- tripTitle: Extract a real title. Prefer "Destination Tour" or "Scenic Goa Retreat" over simple words like "Overview" or "Itinerary".
- destinations: List of destination names (e.g., ["Srinagar", "Gulmarg", "Pahalgam"]).
- duration: Formatted like "X Nights / Y Days".
- startDate / endDate: Keep if available, or set to empty string.
- pax: Clear number or string (e.g., "18 Corporate Guests", "4").
- days: Format each day with dayNumber, title (clean, concise, e.g., "Arrival in Srinagar & Shikara Ride"), and description (fully polished into a beautiful paragraph). Extract meal codes ("Breakfast", "Lunch", "Dinner") and Overnight stay locations if mentioned.
- accommodation: Extract all hotels, locations, room types, nights, and star ratings if available.
- transport: Extract all flights, trains, cabs, transfers. Map transport modes to: "flight" | "train" | "cab" | "bus" | "ferry" | "other".
- pricing: Extract total price, summary (e.g., "₹17,499 per person"), itemized list of items with labels/amounts, and paymentTerms. Convert any raw rupee symbol ("₹") to "₹" or write as is.
- inclusions / exclusions: Carefully categorize which points belong under inclusions and which under exclusions. Exclude empty or redundant lines.
- terms: Extract cancellation policies and general terms.
- contact: Pre-fill with our default company info if not present in the pasted text:
  * companyName: "Comfort Journey"
  * tagline: "30+ Years of Crafting Trusted Memories"
  * phone: "+91 755 242 4242"
  * email: "bookings@comfortjourney.com"
  * website: "www.comfortjourney.com"
  * address: "Comfort Towers, 12 Arera Hills, Bhopal, M.P., India"
- themeKey: Choose the best matching theme out of: "mountains" | "beach" | "desert" | "heritage" | "tropical" | "urban" | "spiritual" | "international" | "default".
`;

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API key is not configured on the server.",
        },
        { status: 501 }
      );
    }

    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Input text is required.",
        },
        { status: 400 }
      );
    }

    // Call Gemini API with JSON Schema
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Below is the system instruction:\n${COMFORT_JOURNEY_SYSTEM_INSTRUCTION}\n\nNow, parse and polish this raw text:\n${text}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              tripTitle: { type: "STRING" },
              destinations: { type: "ARRAY", items: { type: "STRING" } },
              duration: { type: "STRING" },
              startDate: { type: "STRING" },
              endDate: { type: "STRING" },
              pax: { type: "STRING" },
              days: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    dayNumber: { type: "INTEGER" },
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                    meals: { type: "STRING" },
                    overnight: { type: "STRING" },
                  },
                  required: ["dayNumber", "title", "description"],
                },
              },
              accommodation: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    location: { type: "STRING" },
                    starRating: { type: "STRING" },
                    roomType: { type: "STRING" },
                    checkIn: { type: "STRING" },
                    checkOut: { type: "STRING" },
                    nights: { type: "STRING" },
                  },
                  required: ["name", "location"],
                },
              },
              transport: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    mode: { type: "STRING" },
                    from: { type: "STRING" },
                    to: { type: "STRING" },
                    details: { type: "STRING" },
                    reference: { type: "STRING" },
                  },
                  required: ["mode", "from", "to", "details"],
                },
              },
              pricing: {
                type: "OBJECT",
                properties: {
                  summary: { type: "STRING" },
                  items: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        label: { type: "STRING" },
                        amount: { type: "STRING" },
                      },
                      required: ["label", "amount"],
                    },
                  },
                  total: { type: "STRING" },
                  paymentTerms: { type: "STRING" },
                },
                required: ["summary", "items", "total"],
              },
              inclusions: { type: "ARRAY", items: { type: "STRING" } },
              exclusions: { type: "ARRAY", items: { type: "STRING" } },
              terms: { type: "ARRAY", items: { type: "STRING" } },
              contact: {
                type: "OBJECT",
                properties: {
                  companyName: { type: "STRING" },
                  tagline: { type: "STRING" },
                  phone: { type: "STRING" },
                  email: { type: "STRING" },
                  website: { type: "STRING" },
                  address: { type: "STRING" },
                },
                required: ["companyName", "tagline"],
              },
              themeKey: { type: "STRING" },
            },
            required: [
              "tripTitle",
              "destinations",
              "duration",
              "startDate",
              "endDate",
              "pax",
              "days",
              "accommodation",
              "transport",
              "pricing",
              "inclusions",
              "exclusions",
              "terms",
              "contact",
              "themeKey",
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[API Parse] Gemini request failed:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API request failed.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const parsedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!parsedText) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid response structure from Gemini API.",
        },
        { status: 500 }
      );
    }

    const structuredJSON = JSON.parse(parsedText);
    return NextResponse.json({
      success: true,
      data: structuredJSON,
    });
  } catch (error: any) {
    console.error("[API Parse] Error during parsing:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process text using AI.",
      },
      { status: 500 }
    );
  }
}
