import type { ItineraryData } from "@/types/itinerary";
import { parseItineraryContent } from "./itinerary-parser";

/**
 * Parses unstructured itinerary text using the Next.js API endpoint (Gemini AI).
 * If the API key is not set, or the API call fails, it falls back to the local
 * regex-based parser.
 *
 * @param rawText Unstructured itinerary text pasted by user.
 * @returns Promise<ItineraryData & { isAiParsed: boolean }>
 */
export async function parseItineraryWithAI(
  rawText: string
): Promise<ItineraryData & { isAiParsed: boolean }> {
  try {
    const response = await fetch("/api/itinerary/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: rawText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    if (json.success && json.data) {
      return {
        ...json.data,
        isAiParsed: true,
      };
    } else {
      throw new Error(json.error || "Failed to parse data");
    }
  } catch (error) {
    console.warn("[AI Parser] Failed, falling back to regex parser:", error);
    const fallbackParsed = parseItineraryContent(rawText);
    return {
      ...fallbackParsed,
      isAiParsed: false,
    };
  }
}
