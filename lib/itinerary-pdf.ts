// ─────────────────────────────────────────────────────────────────────────────
// Itinerary PDF Generator — Beautiful PDF Rendering Engine
// Uses jsPDF for 100% client-side PDF generation
// ─────────────────────────────────────────────────────────────────────────────

import { jsPDF } from "jspdf";
import type { ItineraryData, DestinationTheme } from "@/types/itinerary";
import { DESTINATION_THEMES } from "@/types/itinerary";

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PAGE_W = 210; // A4 width mm
const PAGE_H = 297; // A4 height mm
const MARGIN_L = 18;
const MARGIN_R = 18;
const MARGIN_T = 26;
const MARGIN_B = 22;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;
const HEADER_H = 16;
const FOOTER_H = 12;

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function setColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

function setFillColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

function setDrawColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

function cleanText(str: string): string {
  if (!str) return "";
  return str
    .replace(/₹/g, "Rs. ")
    .replace(/[^\x1F-\x7E\n\r\t]/g, "") // Keep only printable ASCII + standard whitespace
    .trim();
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEXT WRAPPING UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(cleanText(text), maxWidth) as string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

class PageManager {
  doc: jsPDF;
  theme: DestinationTheme;
  data: ItineraryData;
  currentY: number;
  pageCount: number;

  constructor(doc: jsPDF, theme: DestinationTheme, data: ItineraryData) {
    this.doc = doc;
    this.theme = theme;
    this.data = data;
    this.currentY = MARGIN_T + HEADER_H;
    this.pageCount = 1;
  }

  /** Available vertical space before footer */
  get availableHeight(): number {
    return PAGE_H - MARGIN_B - FOOTER_H - this.currentY;
  }

  /** Check if we need a new page, and add one if so */
  ensureSpace(needed: number): void {
    if (this.currentY + needed > PAGE_H - MARGIN_B - FOOTER_H) {
      this.addPage();
    }
  }

  /** Add a new page with header and footer */
  addPage(): void {
    this.renderFooter();
    this.doc.addPage();
    this.pageCount++;
    this.currentY = MARGIN_T;
    
    // Draw content page beige background
    setFillColor(this.doc, this.theme.tint);
    this.doc.rect(0, 0, PAGE_W, PAGE_H, "F");
    
    this.renderHeader();
    this.currentY = MARGIN_T + HEADER_H;
  }

  /** Move Y cursor down */
  moveDown(mm: number): void {
    this.currentY += mm;
  }

  // ── Header ──────────────────────────────────────────────────────────────

  renderHeader(): void {
    const doc = this.doc;
    const t = this.theme;

    // Header background bar (Deep Navy)
    setFillColor(doc, t.dark);
    doc.rect(0, 0, PAGE_W, 14, "F");

    // Decorative brand line (Vivid Tangerine)
    setFillColor(doc, t.primary);
    doc.rect(0, 14, PAGE_W, 1, "F");

    // Company Logo Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(doc, "#FFFFFF");
    doc.text(cleanText(this.data.contact.companyName).toUpperCase(), MARGIN_L, 9);

    // Tagline (Electric Aqua)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.5);
    setColor(doc, t.secondary);
    doc.text(cleanText(this.data.contact.tagline), MARGIN_L + 45, 9);

    // Right side — trip title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(doc, "#DAF561"); // Lime Cream
    const rightText = (this.data.tripTitle || "Travel Itinerary").toUpperCase();
    const titleTruncated = rightText.length > 40 ? rightText.substring(0, 40) + "..." : rightText;
    doc.text(cleanText(titleTruncated), PAGE_W - MARGIN_R, 9, { align: "right" });
  }

  // ── Footer ──────────────────────────────────────────────────────────────

  renderFooter(): void {
    const doc = this.doc;
    const t = this.theme;
    const y = PAGE_H - 12;

    // Accent line
    setFillColor(doc, t.dark);
    doc.rect(MARGIN_L, y, CONTENT_W, 0.4, "F");

    // Contact info on left
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    setColor(doc, t.dark);
    const contactParts = [this.data.contact.phone, this.data.contact.email]
      .filter(Boolean)
      .join("  |  ");
    doc.text(cleanText(contactParts), MARGIN_L, y + 5);

    // Website on right
    if (this.data.contact.website) {
      setColor(doc, t.primary);
      doc.text(cleanText(this.data.contact.website), PAGE_W - MARGIN_R, y + 5, { align: "right" });
    }

    // Page number
    setColor(doc, "#666666");
    doc.text(`Page ${this.pageCount}`, PAGE_W / 2, y + 5, { align: "center" });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION RENDERERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Render the cover page */
function renderCover(pm: PageManager): void {
  const { doc, theme: t, data } = pm;

  // Full-page Deep Navy background
  setFillColor(doc, t.dark);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Modern abstract vector glow spots (Low opacity circles)
  setFillColor(doc, t.secondary); // Electric Aqua
  doc.setGState(doc.GState({ opacity: 0.08 }));
  doc.circle(PAGE_W * 0.95, PAGE_H * 0.1, 70, "F");

  setFillColor(doc, t.primary); // Vivid Tangerine
  doc.setGState(doc.GState({ opacity: 0.06 }));
  doc.circle(0, PAGE_H * 0.9, 90, "F");
  
  doc.setGState(doc.GState({ opacity: 1 })); // reset opacity

  // Company logo card area
  setFillColor(doc, t.dark);
  setDrawColor(doc, t.primary);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN_L, 28, CONTENT_W, 20, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  setColor(doc, "#FFFFFF");
  doc.text(cleanText(data.contact.companyName || "Comfort Journey"), PAGE_W / 2, 38, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(doc, "#DAF561"); // Lime Cream
  doc.text(cleanText(data.contact.tagline || "Only premium experience. No compromises."), PAGE_W / 2, 44, { align: "center" });

  // Sleek Accent bar
  setDrawColor(doc, t.primary);
  doc.setLineWidth(0.8);
  doc.line(PAGE_W * 0.4, 56, PAGE_W * 0.6, 56);

  // Modern minimal route connection vector
  const cx = PAGE_W / 2;
  const cy = 82;
  
  setDrawColor(doc, t.secondary); // Electric Aqua
  doc.setLineWidth(0.6);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(cx - 24, cy + 10, cx, cy - 12);
  doc.line(cx, cy - 12, cx + 24, cy + 8);
  doc.setLineDashPattern([], 0); // Reset dash

  // Draw node circles
  setFillColor(doc, t.primary); // Vivid Tangerine
  doc.circle(cx - 24, cy + 10, 2.5, "F");
  setFillColor(doc, t.secondary); // Electric Aqua
  doc.circle(cx, cy - 12, 3.5, "F");
  setFillColor(doc, "#DAF561"); // Lime Cream
  doc.circle(cx + 24, cy + 8, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  setColor(doc, "#FFFFFF");
  doc.text("START", cx - 24, cy + 16, { align: "center" });
  doc.text("EXPLORE", cx, cy - 18, { align: "center" });
  doc.text("ARRIVE", cx + 24, cy + 14, { align: "center" });

  // Trip title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  setColor(doc, "#FFFFFF");
  const titleLines = wrapText(doc, data.tripTitle || "Travel Itinerary", CONTENT_W - 20);
  let titleY = 112;
  for (const line of titleLines) {
    doc.text(cleanText(line), PAGE_W / 2, titleY, { align: "center" });
    titleY += 11;
  }

  // Highlight destinations
  if (data.destinations.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setColor(doc, t.secondary); // Electric Aqua
    const destText = data.destinations.join(" • ");
    doc.text(cleanText(destText), PAGE_W / 2, titleY + 4, { align: "center" });
    titleY += 12;
  }

  // Glassmorphic Info Card Block
  titleY += 5;
  setFillColor(doc, "#001D51");
  setDrawColor(doc, t.secondary);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN_L + 10, titleY, CONTENT_W - 20, 16, 2, 2, "FD");

  const labelY = titleY + 6;
  const valY = titleY + 12;
  const colW = (CONTENT_W - 20) / 3;
  const x1 = MARGIN_L + 10 + colW / 2;
  const x2 = x1 + colW;
  const x3 = x2 + colW;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  setColor(doc, "#AAAAAA");
  doc.text("DURATION", x1, labelY, { align: "center" });
  doc.text("DATES", x2, labelY, { align: "center" });
  doc.text("TRAVELLERS", x3, labelY, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  setColor(doc, "#FFFFFF");
  doc.text(cleanText(data.duration || "Flexible"), x1, valY, { align: "center" });

  const dateStr = data.startDate ? `${data.startDate}${data.endDate ? ` - ${data.endDate}` : ""}` : "Flexible";
  doc.text(cleanText(dateStr), x2, valY, { align: "center" });

  doc.text(cleanText(data.pax ? `${data.pax} Pax` : "Flexible"), x3, valY, { align: "center" });

  // Bottom footer area
  const bandY = PAGE_H - 42;
  setDrawColor(doc, t.primary);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_L, bandY, PAGE_W - MARGIN_R, bandY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  setColor(doc, "#CCCCCC");
  doc.text("Custom-crafted premium travel experience", PAGE_W / 2, bandY + 8, { align: "center" });

  const contactParts = [data.contact.phone, data.contact.email, data.contact.website].filter(Boolean);
  if (contactParts.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(doc, "#DAF561"); // Lime Cream accent contact
    doc.text(cleanText(contactParts.join("   |   ")), PAGE_W / 2, bandY + 16, { align: "center" });
  }
}

/** Render a section heading */
function renderSectionHeading(pm: PageManager, title: string): void {
  pm.ensureSpace(16);
  const { doc, theme: t } = pm;

  // Vertical accent block
  setFillColor(doc, t.primary); // Vivid Tangerine vertical block
  doc.rect(MARGIN_L, pm.currentY, 3, 7.5, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setColor(doc, t.dark);
  doc.text(title.toUpperCase(), MARGIN_L + 6, pm.currentY + 6.5);

  // Bottom double accent lines
  setFillColor(doc, t.dark);
  doc.rect(MARGIN_L, pm.currentY + 10, CONTENT_W, 0.5, "F");

  pm.moveDown(15);
}

/** Render day-wise itinerary */
function renderDays(pm: PageManager): void {
  if (pm.data.days.length === 0) return;

  renderSectionHeading(pm, "Day-Wise Itinerary");

  for (const day of pm.data.days) {
    // Estimate space needed
    const descLines = wrapText(pm.doc, day.description, CONTENT_W - 14);
    const neededHeight = 14 + descLines.length * 4.2 + (day.meals || day.overnight ? 10 : 0) + 6;
    pm.ensureSpace(Math.min(neededHeight, 60));

    const { doc, theme: t } = pm;

    // Day number badge (Vivid Tangerine)
    setFillColor(doc, t.primary);
    doc.roundedRect(MARGIN_L, pm.currentY, 26, 7, 1.5, 1.5, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setColor(doc, "#FFFFFF");
    doc.text(`DAY ${day.dayNumber}`, MARGIN_L + 13, pm.currentY + 4.8, { align: "center" });

    // Day title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    setColor(doc, t.dark);
    const cleanedTitle = cleanText(day.title);
    const titleTruncated = cleanedTitle.length > 80 ? cleanedTitle.substring(0, 80) + "..." : cleanedTitle;
    doc.text(titleTruncated, MARGIN_L + 30, pm.currentY + 5);

    pm.moveDown(11);

    // Description text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    setColor(doc, t.dark);

    for (const line of descLines) {
      pm.ensureSpace(5);
      doc.text(line, MARGIN_L + 6, pm.currentY);
      pm.moveDown(4.0);
    }

    // Pills for Meals & Overnight
    if (day.meals || day.overnight) {
      pm.ensureSpace(8);
      let pillX = MARGIN_L + 6;

      if (day.meals) {
        const mealTxt = `Meals: ${day.meals}`;
        const mealW = doc.getTextWidth(mealTxt) + 6;
        setFillColor(doc, "#FFFFFF");
        setDrawColor(doc, "#DAF561"); // Lime Cream border
        doc.setLineWidth(0.3);
        doc.roundedRect(pillX, pm.currentY, mealW, 5.5, 1, 1, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        setColor(doc, t.dark);
        doc.text(cleanText(mealTxt), pillX + 3, pm.currentY + 3.8);
        pillX += mealW + 4;
      }

      if (day.overnight) {
        const overnightTxt = `Stay: ${day.overnight}`;
        const stayW = doc.getTextWidth(overnightTxt) + 6;
        setFillColor(doc, "#FFFFFF");
        setDrawColor(doc, t.primary); // Tangerine border
        doc.setLineWidth(0.3);
        doc.roundedRect(pillX, pm.currentY, stayW, 5.5, 1, 1, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        setColor(doc, t.dark);
        doc.text(cleanText(overnightTxt), pillX + 3, pm.currentY + 3.8);
      }
      pm.moveDown(8);
    }

    // Separator line
    setFillColor(doc, "#E2E8F0");
    doc.rect(MARGIN_L + 6, pm.currentY, CONTENT_W - 12, 0.2, "F");
    pm.moveDown(6);
  }
}

/** Render accommodation section */
function renderAccommodation(pm: PageManager): void {
  if (pm.data.accommodation.length === 0) return;

  renderSectionHeading(pm, "Accommodation Details");

  const { doc, theme: t } = pm;

  for (const hotel of pm.data.accommodation) {
    pm.ensureSpace(20);

    // Draw rounded card background in white
    setFillColor(doc, "#FFFFFF");
    setDrawColor(doc, "#DAF561"); // Lime Cream border
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN_L, pm.currentY, CONTENT_W, 14, 1.5, 1.5, "FD");

    // Hotel circle icon representation
    setFillColor(doc, t.tint);
    doc.circle(MARGIN_L + 8, pm.currentY + 7, 4.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(doc, t.primary);
    doc.text("H", MARGIN_L + 6.8, pm.currentY + 9.5); // Simple H logo inside circle

    // Hotel Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setColor(doc, t.dark);
    const hotelName = cleanText(hotel.name);
    doc.text(hotelName.length > 55 ? hotelName.substring(0, 55) + "..." : hotelName, MARGIN_L + 16, pm.currentY + 5.5);

    // Location
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setColor(doc, "#555555");
    doc.text(`Location: ${cleanText(hotel.location)}`, MARGIN_L + 16, pm.currentY + 10.5);

    // Star rating badge
    if (hotel.starRating) {
      setFillColor(doc, t.primary);
      doc.roundedRect(PAGE_W - MARGIN_R - 22, pm.currentY + 4.5, 18, 5, 1, 1, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      setColor(doc, "#FFFFFF");
      doc.text(cleanText(hotel.starRating), PAGE_W - MARGIN_R - 13, pm.currentY + 8, { align: "center" });
    }

    pm.moveDown(18);
  }

  pm.moveDown(2);
}

/** Render transport section */
function renderTransport(pm: PageManager): void {
  if (pm.data.transport.length === 0) return;

  renderSectionHeading(pm, "Transport Details");

  const { doc, theme: t } = pm;

  for (const tp of pm.data.transport) {
    pm.ensureSpace(18);

    // Rounded card background
    setFillColor(doc, "#FFFFFF");
    setDrawColor(doc, t.secondary); // Electric Aqua border
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN_L, pm.currentY, CONTENT_W, 12, 1.5, 1.5, "FD");

    // Transport type circle
    setFillColor(doc, t.tint);
    doc.circle(MARGIN_L + 8, pm.currentY + 6, 4, "F");

    const modeChar = tp.mode.substring(0, 1).toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(doc, t.dark);
    doc.text(modeChar, MARGIN_L + 7, pm.currentY + 8.5);

    // Mode Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setColor(doc, t.dark);
    doc.text(cleanText(tp.mode).toUpperCase(), MARGIN_L + 15, pm.currentY + 5);

    // Details text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setColor(doc, "#555555");
    const details = cleanText(tp.details);
    doc.text(details.length > 85 ? details.substring(0, 85) + "..." : details, MARGIN_L + 15, pm.currentY + 9);

    pm.moveDown(15);
  }

  pm.moveDown(2);
}

/** Render pricing section */
function renderPricing(pm: PageManager): void {
  const { pricing } = pm.data;
  if (!pricing.summary && pricing.items.length === 0 && !pricing.total) return;

  renderSectionHeading(pm, "Pricing & Payments");

  const { doc, theme: t } = pm;

  // Summary card
  if (pricing.summary) {
    pm.ensureSpace(12);
    setFillColor(doc, "#FFFFFF");
    setDrawColor(doc, t.primary);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN_L, pm.currentY, CONTENT_W, 9, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setColor(doc, t.primary);
    doc.text(cleanText(pricing.summary), PAGE_W / 2, pm.currentY + 6, { align: "center" });
    pm.moveDown(13);
  }

  // Pricing Line items
  for (const item of pricing.items) {
    pm.ensureSpace(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setColor(doc, t.dark);
    doc.text(cleanText(item.label), MARGIN_L + 4, pm.currentY + 4);

    doc.setFont("helvetica", "bold");
    doc.text(cleanText(item.amount), PAGE_W - MARGIN_R - 4, pm.currentY + 4, { align: "right" });

    // Subtle line divider
    setFillColor(doc, "#E0E5C9");
    doc.rect(MARGIN_L, pm.currentY + 6, CONTENT_W, 0.3, "F");
    pm.moveDown(8);
  }

  // Grand Total Card (Deep Navy)
  if (pricing.total) {
    pm.ensureSpace(14);
    setFillColor(doc, t.dark); // Deep Navy block
    doc.roundedRect(MARGIN_L, pm.currentY, CONTENT_W, 11, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    setColor(doc, "#FFFFFF");
    doc.text("TOTAL PACKAGE COST", MARGIN_L + 6, pm.currentY + 7);

    setColor(doc, "#DAF561"); // Lime Cream text amount
    doc.setFontSize(10.5);
    doc.text(cleanText(pricing.total), PAGE_W - MARGIN_R - 6, pm.currentY + 7.5, { align: "right" });
    pm.moveDown(16);
  }

  // Payment terms
  if (pricing.paymentTerms) {
    pm.ensureSpace(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(doc, t.primary);
    doc.text("Payment Policy:", MARGIN_L + 4, pm.currentY);
    pm.moveDown(3.5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    setColor(doc, "#555555");
    const termLines = wrapText(doc, pricing.paymentTerms, CONTENT_W - 10);
    for (const line of termLines) {
      pm.ensureSpace(4);
      doc.text(line, MARGIN_L + 4, pm.currentY);
      pm.moveDown(3.8);
    }
    pm.moveDown(3);
  }
}

/** Render inclusions and exclusions side-by-side inside dual card containers */
function renderInclusionsExclusions(pm: PageManager): void {
  const { inclusions, exclusions } = pm.data;
  if (inclusions.length === 0 && exclusions.length === 0) return;

  pm.ensureSpace(35);
  const { doc, theme: t } = pm;
  const colW = (CONTENT_W - 8) / 2;

  renderSectionHeading(pm, "Inclusions & Exclusions");

  const startY = pm.currentY;
  let leftY = startY + 8;
  let rightY = startY + 8;

  // Left Column — Inclusions
  if (inclusions.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setColor(doc, t.dark);
    doc.text("WHAT IS INCLUDED", MARGIN_L + 4, startY + 3);

    setFillColor(doc, "#059669"); // Green line accent
    doc.rect(MARGIN_L + 4, startY + 4.5, 30, 0.6, "F");

    for (const item of inclusions) {
      const itemLines = wrapText(doc, item, colW - 8);
      const blockH = itemLines.length * 4 + 1;
      
      if (leftY + blockH > PAGE_H - MARGIN_B - FOOTER_H - 8) {
        pm.addPage();
        setFillColor(doc, t.tint);
        doc.rect(0, 0, PAGE_W, PAGE_H, "F");
        pm.renderHeader();
        leftY = pm.currentY + 5;
        rightY = pm.currentY + 5;
      }

      // Draw small green bullet circle with indicator
      setFillColor(doc, "#D1FAE5");
      doc.circle(MARGIN_L + 4, leftY + 1.5, 1.8, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      setColor(doc, "#059669");
      doc.text("Y", MARGIN_L + 3.0, leftY + 2.5); // Simple "Y" as check representation

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      setColor(doc, t.dark);

      for (let i = 0; i < itemLines.length; i++) {
        doc.text(itemLines[i], MARGIN_L + 8, leftY + i * 3.8 + 2.2);
      }
      leftY += itemLines.length * 3.8 + 3.2;
    }
  }

  // Right Column — Exclusions
  if (exclusions.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    setColor(doc, t.dark);
    doc.text("WHAT IS NOT INCLUDED", MARGIN_L + colW + 12, startY + 3);

    setFillColor(doc, "#EF4444"); // Red line accent
    doc.rect(MARGIN_L + colW + 12, startY + 4.5, 30, 0.6, "F");

    for (const item of exclusions) {
      const itemLines = wrapText(doc, item, colW - 8);
      const blockH = itemLines.length * 4 + 1;

      if (rightY + blockH > PAGE_H - MARGIN_B - FOOTER_H - 8) {
        pm.addPage();
        setFillColor(doc, t.tint);
        doc.rect(0, 0, PAGE_W, PAGE_H, "F");
        pm.renderHeader();
        leftY = pm.currentY + 5;
        rightY = pm.currentY + 5;
      }

      // Draw small red cross circle
      setFillColor(doc, "#FEE2E2");
      doc.circle(MARGIN_L + colW + 12, rightY + 1.5, 1.8, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      setColor(doc, "#EF4444");
      doc.text("X", MARGIN_L + colW + 10.8, rightY + 2.5); // Simple "X" representation

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      setColor(doc, t.dark);

      for (let i = 0; i < itemLines.length; i++) {
        doc.text(itemLines[i], MARGIN_L + colW + 16, rightY + i * 3.8 + 2.2);
      }
      rightY += itemLines.length * 3.8 + 3.2;
    }
  }

  // Set the cursor Y below the longest column
  pm.currentY = Math.max(leftY, rightY) + 4;
}

/** Render terms & conditions */
function renderTerms(pm: PageManager): void {
  if (pm.data.terms.length === 0) return;

  renderSectionHeading(pm, "Terms & Conditions");

  const { doc, theme: t } = pm;

  for (let i = 0; i < pm.data.terms.length; i++) {
    const lines = wrapText(doc, pm.data.terms[i], CONTENT_W - 14);
    pm.ensureSpace(lines.length * 3.8 + 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(doc, t.primary);
    doc.text(`${i + 1}.`, MARGIN_L + 4, pm.currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    setColor(doc, t.dark);
    for (let j = 0; j < lines.length; j++) {
      doc.text(lines[j], MARGIN_L + 9, pm.currentY + j * 3.8);
    }
    pm.moveDown(lines.length * 3.8 + 1.5);
  }

  pm.moveDown(4);
}

/** Render contact us section */
function renderContactSection(pm: PageManager): void {
  const { contact } = pm.data;
  if (!contact.phone && !contact.email && !contact.address) return;

  renderSectionHeading(pm, "Contact Us");

  const { doc, theme: t } = pm;

  pm.ensureSpace(28);

  // Draw card container in white
  setFillColor(doc, "#FFFFFF");
  setDrawColor(doc, t.primary);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN_L, pm.currentY, CONTENT_W, 22, 2, 2, "FD");

  // Company name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(doc, t.dark);
  doc.text(contact.companyName, MARGIN_L + 8, pm.currentY + 6.5);

  // Address
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(doc, "#555555");
  if (contact.address) {
    doc.text(`Office: ${contact.address}`, MARGIN_L + 8, pm.currentY + 11.5);
  }

  // Row of Email/Web/Phone
  let detailParts = [];
  if (contact.phone) detailParts.push(`Call: ${contact.phone}`);
  if (contact.email) detailParts.push(`Mail: ${contact.email}`);
  if (contact.website) detailParts.push(`Web: ${contact.website}`);

  if (detailParts.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setColor(doc, t.primary);
    doc.text(cleanText(detailParts.join("   |   ")), MARGIN_L + 8, pm.currentY + 17);
  }

  pm.moveDown(28);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PDF GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export function generateItineraryPDF(data: ItineraryData, action: "download" | "open" = "download"): void {
  const theme = DESTINATION_THEMES[data.themeKey] || DESTINATION_THEMES.default;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
    compress: true,
  });

  // ── Page 1: Cover ──────────────────────────────────────────────────────

  renderCover(
    { doc, theme, data, currentY: 0, pageCount: 1 } as unknown as PageManager,
  );

  // ── Content Pages ──────────────────────────────────────────────────────

  doc.addPage();
  const pm = new PageManager(doc, theme, data);
  pm.pageCount = 2;
  pm.currentY = MARGIN_T;

  // Draw content beige background on page 2
  setFillColor(doc, theme.tint);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  pm.renderHeader();
  pm.currentY = MARGIN_T + HEADER_H;

  // Render all structured sections
  renderDays(pm);
  renderAccommodation(pm);
  renderTransport(pm);
  renderPricing(pm);
  renderInclusionsExclusions(pm);
  renderTerms(pm);
  renderContactSection(pm);

  // Final "Thank You" note block
  pm.ensureSpace(24);
  const ty = pm.currentY;
  setFillColor(doc, "#FFFFFF");
  setDrawColor(doc, theme.primary);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN_L, ty, CONTENT_W, 16, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  setColor(doc, theme.primary);
  doc.text("Thank you for choosing Comfort Journey!", PAGE_W / 2, ty + 6.5, { align: "center" });
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  setColor(doc, "#555555");
  doc.text("Only premium experiences, expert guidance, and complete peace of mind.", PAGE_W / 2, ty + 11.5, { align: "center" });

  // Render footer on the last page
  pm.renderFooter();

  // ── Save / Output ──────────────────────────────────────────────────────

  const filename = (data.tripTitle || "Itinerary")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50) || "Itinerary";

  const fullFilename = `${filename}_Itinerary.pdf`;

  try {
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);

    if (action === "open") {
      const newTab = window.open(blobUrl, "_blank");
      if (!newTab) {
        // Fallback to download if pop-up is blocked
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fullFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fullFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Delay revocation to ensure resource loads
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  } catch (e) {
    console.error("PDF action failed, falling back to doc.save:", e);
    doc.save(fullFilename);
  }
}
