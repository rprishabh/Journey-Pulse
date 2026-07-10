// ─────────────────────────────────────────────────────────────────────────────
// Itinerary Content Parser
// Intelligently extracts structured itinerary data from freeform text
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ItineraryData,
  DayPlan,
  AccommodationInfo,
  TransportInfo,
  PricingInfo,
  ContactInfo,
  DestinationThemeKey,
} from "@/types/itinerary";

// ═══════════════════════════════════════════════════════════════════════════════
// DESTINATION → THEME MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

const DESTINATION_THEME_MAP: Record<string, DestinationThemeKey> = {
  // Mountains
  kashmir: "mountains", srinagar: "mountains", gulmarg: "mountains", pahalgam: "mountains",
  sonmarg: "mountains", manali: "mountains", shimla: "mountains", dharamshala: "mountains",
  mcleodganj: "mountains", mussoorie: "mountains", nainital: "mountains", leh: "mountains",
  ladakh: "mountains", spiti: "mountains", auli: "mountains", dalhousie: "mountains",
  kullu: "mountains", kodaikanal: "mountains", ooty: "mountains", darjeeling: "mountains",
  gangtok: "mountains", sikkim: "mountains", meghalaya: "mountains", shillong: "mountains",
  // Beach
  goa: "beach", andaman: "beach", nicobar: "beach", pondicherry: "beach", puducherry: "beach",
  lakshadweep: "beach", maldives: "beach", bali: "beach", phuket: "beach", krabi: "beach",
  mauritius: "beach", seychelles: "beach", "sri lanka": "beach", kovalam: "beach",
  varkala: "beach", gokarna: "beach", havelock: "beach", neil: "beach",
  // Desert
  rajasthan: "desert", jaisalmer: "desert", jodhpur: "desert", jaipur: "desert",
  udaipur: "desert", pushkar: "desert", bikaner: "desert", kutch: "desert", rann: "desert",
  // Heritage
  agra: "heritage", varanasi: "heritage", hampi: "heritage", khajuraho: "heritage",
  ajanta: "heritage", ellora: "heritage", mahabalipuram: "heritage", konark: "heritage",
  mysore: "heritage", mysuru: "heritage", thanjavur: "heritage", madurai: "heritage",
  // Tropical
  munnar: "tropical", coorg: "tropical", wayanad: "tropical", alleppey: "tropical",
  alappuzha: "tropical", kumarakom: "tropical", thekkady: "tropical", periyar: "tropical",
  kaziranga: "tropical", sundarbans: "tropical", northeast: "tropical",
  // Urban
  delhi: "urban", mumbai: "urban", bangalore: "urban", bengaluru: "urban",
  hyderabad: "urban", chennai: "urban", kolkata: "urban", pune: "urban",
  dubai: "urban", singapore: "urban", "hong kong": "urban", tokyo: "urban",
  bangkok: "urban", "kuala lumpur": "urban",
  // Spiritual
  rishikesh: "spiritual", haridwar: "spiritual", "bodh gaya": "spiritual",
  amritsar: "spiritual", tirupati: "spiritual", shirdi: "spiritual",
  dwarka: "spiritual", puri: "spiritual", rameshwaram: "spiritual", kashi: "spiritual",
  // International
  europe: "international", paris: "international", london: "international",
  switzerland: "international", italy: "international", spain: "international",
  greece: "international", turkey: "international", egypt: "international",
  vietnam: "international", cambodia: "international", japan: "international",
  australia: "international", "new zealand": "international", canada: "international",
  usa: "international", america: "international",
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER DETECTION PATTERN
// ═══════════════════════════════════════════════════════════════════════════════

function detectHeader(line: string): string | null {
  // Clean punctuation and markdown notation
  const clean = line.trim().toLowerCase().replace(/^[\s\-–—.*•▪#]+/, "").replace(/[:\-–—.*•▪\s]+$/, "").trim();
  
  if (/^day\s*(\d+)/i.test(clean) || /^day[-–—\s]*wise\s*itinerary/i.test(clean) || /^day\s*plan/i.test(clean) || /^itinerary/i.test(clean)) {
    return "dayPlan";
  }
  
  if (
    /^(inclusions?|included|what's\s+included|what\s+is\s+included|package\s+includes?|cost\s+includes?|price\s+includes?|includes)$/i.test(clean) ||
    /^(inclusions?|included|package\s+includes?|cost\s+includes?):\s*$/i.test(line.trim())
  ) {
    return "inclusions";
  }
  
  if (
    /^(exclusions?|excluded|what's\s+not\s+included|what\s+is\s+not\s+included|package\s+excludes?|cost\s+excludes?|price\s+excludes?|excludes|not\s+included)$/i.test(clean) ||
    /^(exclusions?|excluded|package\s+excludes?|cost\s+excludes?):\s*$/i.test(line.trim())
  ) {
    return "exclusions";
  }
  
  if (
    /^(accommodations?|hotels?|stays?|resorts?|lodgings?|where\s+you'll\s+stay|stay\s+details|hotel\s+details)$/i.test(clean)
  ) {
    return "accommodation";
  }
  
  if (
    /^(transports?|transportations?|travel|flights?|trains?|transfers?|cabs?|vehicles?)$/i.test(clean)
  ) {
    return "transport";
  }
  
  if (
    /^(pricing|price|cost|rates?|package\s+cost|tour\s+cost|charges?|tariff|budget|pricing\s+details|cost\s+breakdown)$/i.test(clean)
  ) {
    return "pricing";
  }
  
  if (
    /^(terms?\s*(?:&|and)?\s*conditions?|t&c|t\s*&\s*c|cancellation\s*polic(y|ies)|important\s*notes?|notes?|policies|fine\s*print)$/i.test(clean)
  ) {
    return "terms";
  }
  
  if (
    /^(contact\s*(?:us|info|details)?|reach\s*us|get\s*in\s*touch|booking\s*office|book\s*with\s*us|for\s*bookings?|for\s*enquir(y|ies))$/i.test(clean)
  ) {
    return "contact";
  }
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/** Extract bullet points from a block of text */
function extractBullets(text: string): string[] {
  if (!text) return [];
  const lines = text.split("\n");
  const bullets: string[] = [];
  for (const line of lines) {
    const trimmed = line.replace(/^\s*[-•*▪▸►✓✔✅❌⭐→➤➢>]\s*/, "").trim();
    if (trimmed.length > 2) {
      bullets.push(trimmed);
    }
  }
  return bullets;
}

/** Detect the destination theme from text */
function detectTheme(text: string): DestinationThemeKey {
  const lower = text.toLowerCase();
  const scores: Partial<Record<DestinationThemeKey, number>> = {};

  for (const [keyword, theme] of Object.entries(DESTINATION_THEME_MAP)) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(lower)) {
      scores[theme] = (scores[theme] || 0) + 1;
    }
  }

  let bestTheme: DestinationThemeKey = "default";
  let bestScore = 0;
  for (const [theme, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestTheme = theme as DestinationThemeKey;
    }
  }

  return bestTheme;
}

/** Extract destination names intelligently from text, hotels and title */
function extractDestinationsSmart(text: string, title: string, hotels: AccommodationInfo[]): string[] {
  const found = new Set<string>();
  
  // 1. Check mapped destinations
  const lower = text.toLowerCase();
  for (const [keyword, theme] of Object.entries(DESTINATION_THEME_MAP)) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(lower)) {
      found.add(keyword.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
    }
  }
  
  // 2. Check hotel locations
  for (const hotel of hotels) {
    if (hotel.location && hotel.location.trim().length > 2 && hotel.location !== "TBD") {
      const parts = hotel.location.split(/[,/]/);
      for (const part of parts) {
        const cleaned = part.replace(/(hotel|houseboat|resort|stay|deluxe|star|luxury|premium)/gi, "").trim();
        if (cleaned.length > 2 && /^[A-Z][a-zA-Z\s]+$/.test(cleaned)) {
          found.add(cleaned);
        }
      }
    }
  }
  
  // 3. Fallback: Parse from title
  if (found.size === 0 && title && title !== "Travel Itinerary") {
    const titleParts = title.split(/\b(?:to|and|&|via|from)\b/i);
    for (const part of titleParts) {
      const cleaned = part
        .replace(/(tour|trip|itinerary|package|days?|nights?|pax|group|family|spiritual|comfort|journey)/gi, "")
        .trim();
      if (cleaned.length > 2 && /^[A-Z][a-zA-Z\s]+$/.test(cleaned)) {
        found.add(cleaned);
      }
    }
  }
  
  return found.size > 0 ? Array.from(found) : ["Your Destination"];
}

/** Try to extract a trip title from the first few lines */
function extractTripTitle(text: string): string {
  const lines = text.split("\n").filter(l => l.trim().length > 0);

  // Look for lines that seem like a title (short, possibly capitalised)
  for (const line of lines.slice(0, 5)) {
    const clean = line.trim();
    if (detectHeader(clean)) continue;
    if (clean.length > 5 && clean.length < 120 && !/^\s*[-•*]/.test(clean)) {
      return clean.replace(/^[-–—:.\s]+/, "").replace(/[-–—:.\s]+$/, "");
    }
  }

  return "Travel Itinerary";
}

/** Try to extract duration like "5N/6D" or "5 Nights 6 Days" */
function extractDuration(text: string): string {
  const m = text.match(/(\d+)\s*(?:N(?:ights?)?)\s*[/\\&,\s]+\s*(\d+)\s*(?:D(?:ays?)?)/i);
  if (m) return `${m[1]} Nights / ${m[2]} Days`;

  const m2 = text.match(/(\d+)\s*(?:days?)/i);
  if (m2) {
    const nights = Math.max(0, parseInt(m2[1]) - 1);
    return `${nights} Nights / ${m2[1]} Days`;
  }

  return "";
}

/** Extract date ranges */
function extractDates(text: string): { start: string; end: string } {
  const datePattern = /(\d{1,2}[\s/.-]\w{3,9}[\s/.-]\d{2,4})\s*(?:to|–|-|till|until)\s*(\d{1,2}[\s/.-]\w{3,9}[\s/.-]\d{2,4})/i;
  const m = text.match(datePattern);
  if (m) return { start: m[1].trim(), end: m[2].trim() };

  return { start: "", end: "" };
}

/** Extract pax count */
function extractPax(text: string): string {
  const m = text.match(/(\d+)\s*(?:pax|person[s]?|adult[s]?|traveller[s]?|guest[s]?|people)/i);
  return m ? m[1] : "";
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAY PLAN PARSER
// ═══════════════════════════════════════════════════════════════════════════════

function parseDays(text: string): DayPlan[] {
  const days: DayPlan[] = [];
  const parts = text.split(/(?=(?:^|\n)\s*day\s*[-–—:.]?\s*\d)/gi);

  for (const part of parts) {
    const headerMatch = part.match(/day\s*[-–—:.]?\s*(\d+)\s*[-–—:.]?\s*(.*?)(?:\n|$)/i);
    if (!headerMatch) continue;

    const dayNumber = parseInt(headerMatch[1]);
    const title = headerMatch[2].trim() || `Day ${dayNumber}`;
    const body = part.slice(headerMatch[0].length).trim();

    // Look for meals mention
    const mealsMatch = body.match(/(?:meals?\s*[-:.]?\s*)(.*?)(?:\n|$)/i);
    const meals = mealsMatch ? mealsMatch[1].trim() : undefined;

    // Look for overnight mention
    const overnightMatch = body.match(/(?:overnight|stay|night)\s*(?:at|in|[-:.])\s*(.*?)(?:\n|$)/i);
    const overnight = overnightMatch ? overnightMatch[1].trim() : undefined;

    days.push({
      dayNumber,
      title,
      description: body,
      meals,
      overnight,
    });
  }

  return days.sort((a, b) => a.dayNumber - b.dayNumber);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOMMODATION PARSER
// ═══════════════════════════════════════════════════════════════════════════════

function parseAccommodationSmart(sectionText: string): AccommodationInfo[] {
  if (!sectionText) return [];
  const hotels: AccommodationInfo[] = [];
  const lines = sectionText.split("\n").filter(l => l.trim().length > 2);

  for (const line of lines) {
    const clean = line.replace(/^\s*[-•*▪]\s*/, "").trim();
    if (clean.length < 3) continue;

    // Try to detect star rating
    const starMatch = clean.match(/(\d)\s*star/i);
    const starRating = starMatch ? `${starMatch[1]} Star` : undefined;

    // Clean up star rating and deluxe tags
    let withoutRating = clean
      .replace(/\d\s*star/i, "")
      .replace(/deluxe|luxury|premium/gi, "")
      .replace(/[-–\s]+$/, "")
      .trim();

    // Split by commas or dashes to find name and location
    const parts = withoutRating.split(/[,|\-–]/).map(p => p.trim()).filter(Boolean);
    
    let name = parts[0] || "";
    let location = "";

    if (parts.length > 1) {
      if (parts.length === 2) {
        location = parts[1];
      } else {
        location = parts.slice(1).join(", ");
      }
    }

    name = parts[0].replace(/^[-–,.\s]+/, "").replace(/[-–,.\s]+$/, "").trim();

    hotels.push({
      name,
      location: location || "TBD",
      starRating,
    });
  }

  return hotels;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSPORT PARSER
// ═══════════════════════════════════════════════════════════════════════════════

function parseTransport(sectionText: string): TransportInfo[] {
  if (!sectionText) return [];
  const transports: TransportInfo[] = [];
  const lines = sectionText.split("\n").filter(l => l.trim().length > 2);

  for (const line of lines) {
    const clean = line.replace(/^\s*[-•*▪]\s*/, "").trim();
    if (clean.length < 3) continue;

    let mode: TransportInfo["mode"] = "other";
    if (/flight|air|fly/i.test(clean)) mode = "flight";
    else if (/train|rail/i.test(clean)) mode = "train";
    else if (/cab|taxi|car|drive/i.test(clean)) mode = "cab";
    else if (/bus|coach|volvo/i.test(clean)) mode = "bus";
    else if (/ferry|boat|cruise/i.test(clean)) mode = "ferry";

    const routeMatch = clean.match(/(?:from\s+)?(\w[\w\s]*?)\s*(?:to|–|-|→)\s*(\w[\w\s]*?)(?:\s|$|,)/i);

    transports.push({
      mode,
      from: routeMatch ? routeMatch[1].trim() : "",
      to: routeMatch ? routeMatch[2].trim() : "",
      details: clean,
    });
  }

  return transports;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRICING PARSER
// ═══════════════════════════════════════════════════════════════════════════════

function parsePricing(sectionText: string): PricingInfo {
  const lines = sectionText ? sectionText.split("\n").filter(l => l.trim().length > 2) : [];
  const items: { label: string; amount: string }[] = [];
  let total = "";
  let summary = "";
  let paymentTerms = "";

  for (const line of lines) {
    const clean = line.replace(/^\s*[-•*▪]\s*/, "").trim();

    const amountMatch = clean.match(/[₹$]?\s*[\d,]+(?:\.\d{1,2})?|(?:Rs\.?|INR|USD)\s*[\d,]+(?:\.\d{1,2})?/i);

    if (/total|grand\s*total/i.test(clean) && amountMatch) {
      total = amountMatch[0].trim();
    } else if (/per\s*person|per\s*pax|per\s*head/i.test(clean)) {
      summary = clean;
    } else if (/payment|advance|deposit|balance/i.test(clean)) {
      paymentTerms += (paymentTerms ? "\n" : "") + clean;
    } else if (amountMatch) {
      const label = clean.replace(amountMatch[0], "").replace(/[-–:]+$/, "").trim();
      items.push({ label: label || "Package Cost", amount: amountMatch[0].trim() });
    } else if (clean.length > 3) {
      if (!summary) summary = clean;
      else paymentTerms += (paymentTerms ? "\n" : "") + clean;
    }
  }

  return { summary, items, total, paymentTerms };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT PARSER
// ═══════════════════════════════════════════════════════════════════════════════

function parseContact(sectionText: string): Partial<ContactInfo> {
  const contact: Partial<ContactInfo> = {};
  if (!sectionText) return contact;

  const phoneMatch = sectionText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}/);
  if (phoneMatch) contact.phone = phoneMatch[0].trim();

  const emailMatch = sectionText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) contact.email = emailMatch[0];

  const webMatch = sectionText.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.]+/);
  if (webMatch) contact.website = webMatch[0];

  return contact;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PASTE PRE-PROCESSOR (RESTORES SPACING & LINE BREAKS)
// ═══════════════════════════════════════════════════════════════════════════════

export function preProcessPastedText(rawText: string): string {
  if (!rawText) return "";
  
  // Normalize newlines
  let text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  
  // Count current newlines
  const newlineCount = (text.match(/\n/g) || []).length;
  
  // If the text is reasonably long but contains very few newlines, it was likely merged on paste
  if (newlineCount < 4 && text.length > 150) {
    // 1. Split day plans: look for "Day X" preceded by spaces or text
    text = text.replace(/(\s+)(day\s+\d+)\b/gi, "\n$2");
    
    // 2. Split sections: look for keywords followed by colons or spacing
    const headers = [
      "inclusions", "exclusions", "accommodation", "accommodation details", 
      "transport", "transport details", "pricing", "pricing details", 
      "terms & conditions", "terms", "contact us", "contact"
    ];
    for (const header of headers) {
      const regex = new RegExp(`(\\s+)(${header})[:\\s\\-–—]`, "gi");
      text = text.replace(regex, "\n$2: ");
    }
    
    // 3. Split bullet points
    text = text.replace(/(\s+)([-•*▪])(\s+)/g, "\n$2$3");
    
    // 4. Split key financial items
    text = text.replace(/(\s+)(total|grand total|package cost|gst)[:\s]/gi, "\n$2: ");
    
    // Clean up multiple sequential newlines
    text = text.replace(/\n+/g, "\n");
  }
  
  return text;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PARSER
// ═══════════════════════════════════════════════════════════════════════════════

export function parseItineraryContent(rawText: string): ItineraryData {
  const processedText = preProcessPastedText(rawText);
  const text = processedText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n");

  const sections: Record<string, string[]> = {
    title: [],
    dayPlan: [],
    inclusions: [],
    exclusions: [],
    accommodation: [],
    transport: [],
    pricing: [],
    terms: [],
    contact: [],
  };

  let currentSection = "title";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const detected = detectHeader(line);
    if (detected) {
      currentSection = detected;
      if (detected === "dayPlan") {
        sections.dayPlan.push(line);
      }
      continue;
    }

    sections[currentSection].push(line);
  }

  const titleText = sections.title.join("\n");
  const dayPlanText = sections.dayPlan.join("\n");
  const inclusionsText = sections.inclusions.join("\n");
  const exclusionsText = sections.exclusions.join("\n");
  const accommodationText = sections.accommodation.join("\n");
  const transportText = sections.transport.join("\n");
  const pricingText = sections.pricing.join("\n");
  const termsText = sections.terms.join("\n");
  const contactText = sections.contact.join("\n");

  const tripTitle = extractTripTitle(titleText || text);
  const duration = extractDuration(titleText || text) || extractDuration(text);
  const dates = extractDates(titleText || text) || extractDates(text);
  const pax = extractPax(titleText || text) || extractPax(text);

  const days = parseDays(dayPlanText);
  const accommodation = parseAccommodationSmart(accommodationText);
  const transport = parseTransport(transportText);
  const pricing = parsePricing(pricingText);

  const inclusions = extractBullets(inclusionsText);
  const exclusions = extractBullets(exclusionsText);
  const terms = extractBullets(termsText);

  const parsedContact = parseContact(contactText || text);

  const destinations = extractDestinationsSmart(text, tripTitle, accommodation);
  const themeKey = detectTheme(text);

  return {
    tripTitle,
    destinations,
    duration,
    startDate: dates.start,
    endDate: dates.end,
    pax,
    days,
    accommodation,
    transport,
    pricing,
    inclusions,
    exclusions,
    terms,
    contact: {
      companyName: parsedContact.companyName || "Comfort Journey",
      tagline: parsedContact.tagline || "Only premium experience. No compromises.",
      phone: parsedContact.phone || "+91 755 4220000",
      email: parsedContact.email || "bookings@comfortjourney.in",
      website: parsedContact.website || "www.comfortjourney.in",
      address: parsedContact.address || "Bhopal, Madhya Pradesh, India",
    },
    themeKey,
  };
}

/** Create a blank itinerary data object with defaults */
export function createBlankItinerary(): ItineraryData {
  return {
    tripTitle: "",
    destinations: [],
    duration: "",
    startDate: "",
    endDate: "",
    pax: "",
    days: [],
    accommodation: [],
    transport: [],
    pricing: { summary: "", items: [], total: "", paymentTerms: "" },
    inclusions: [],
    exclusions: [],
    terms: [],
    contact: {
      companyName: "Comfort Journey",
      tagline: "Only premium experience. No compromises.",
      phone: "+91 755 4220000",
      email: "bookings@comfortjourney.in",
      website: "www.comfortjourney.in",
      address: "Bhopal, Madhya Pradesh, India",
    },
    themeKey: "default",
  };
}
