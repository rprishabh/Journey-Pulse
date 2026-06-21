"use client";

import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { CompassSpinner } from "./CompassSpinner";

// World map TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Numeric ISO-3166-1 to Alpha-3 mapping dictionary
const NUMERIC_TO_ISO_A3: Record<string, string> = {
  "004": "AFG", // Afghanistan
  "008": "ALB", // Albania
  "012": "DZA", // Algeria
  "016": "ASM", // American Samoa
  "020": "AND", // Andorra
  "024": "AGO", // Angola
  "028": "ATG", // Antigua and Barbuda
  "032": "ARG", // Argentina
  "036": "AUS", // Australia
  "040": "AUT", // Austria
  "044": "BHS", // Bahamas
  "048": "BHR", // Bahrain
  "050": "BGD", // Bangladesh
  "052": "BRB", // Barbados
  "056": "BEL", // Belgium
  "060": "BMU", // Bermuda
  "064": "BTN", // Bhutan
  "068": "BOL", // Bolivia
  "070": "BIH", // Bosnia and Herzegovina
  "072": "BWA", // Botswana
  "076": "BRA", // Brazil
  "084": "BLZ", // Belize
  "090": "SLB", // Solomon Islands
  "096": "BRN", // Brunei
  "100": "BGR", // Bulgaria
  "104": "MMR", // Myanmar
  "108": "BDI", // Burundi
  "112": "BLR", // Belarus
  "116": "KHM", // Cambodia
  "120": "CMR", // Cameroon
  "124": "CAN", // Canada
  "132": "CPV", // Cape Verde
  "136": "CYM", // Cayman Islands
  "140": "CAF", // Central African Republic
  "144": "LKA", // Sri Lanka
  "148": "TCD", // Chad
  "152": "CHL", // Chile
  "156": "CHN", // China
  "170": "COL", // Colombia
  "174": "COM", // Comoros
  "175": "COG", // Congo
  "180": "COD", // DR Congo
  "188": "CRI", // Costa Rica
  "191": "HRV", // Croatia
  "192": "CUB", // Cuba
  "196": "CYP", // Cyprus
  "203": "CZE", // Czechia
  "204": "BEN", // Benin
  "208": "DNK", // Denmark
  "212": "DMA", // Dominica
  "214": "DOM", // Dominican Republic
  "218": "ECU", // Ecuador
  "222": "SLV", // El Salvador
  "226": "GNQ", // Equatorial Guinea
  "231": "ETH", // Ethiopia
  "232": "ERI", // Eritrea
  "233": "EST", // Estonia
  "242": "FJI", // Fiji
  "246": "FIN", // Finland
  "250": "FRA", // France
  "254": "GUF", // French Guiana
  "258": "PYF", // French Polynesia
  "262": "ATF", // French Southern Territories
  "266": "GAB", // Gabon
  "268": "GEO", // Georgia
  "270": "GMB", // Gambia
  "275": "PSE", // Palestine
  "276": "DEU", // Germany
  "288": "GHA", // Ghana
  "292": "GIB", // Gibraltar
  "300": "GRC", // Greece
  "304": "GRL", // Greenland
  "308": "GRD", // Grenada
  "320": "GTM", // Guatemala
  "324": "GIN", // Guinea
  "328": "GUY", // Guyana
  "332": "HTI", // Haiti
  "340": "HND", // Honduras
  "344": "HKG", // Hong Kong
  "348": "HUN", // Hungary
  "352": "ISL", // Iceland
  "356": "IND", // India
  "360": "IDN", // Indonesia
  "364": "IRN", // Iran
  "368": "IRQ", // Iraq
  "372": "IRL", // Ireland
  "376": "ISR", // Israel
  "380": "ITA", // Italy
  "384": "CIV", // Ivory Coast
  "388": "JAM", // Jamaica
  "392": "JPN", // Japan
  "398": "KAZ", // Kazakhstan
  "400": "JOR", // Jordan
  "404": "KEN", // Kenya
  "408": "PRK", // North Korea
  "410": "KOR", // South Korea
  "414": "KWT", // Kuwait
  "417": "KGZ", // Kyrgyzstan
  "418": "LAO", // Laos
  "422": "LBN", // Lebanon
  "426": "LSO", // Lesotho
  "428": "LVA", // Latvia
  "430": "LBR", // Liberia
  "434": "LBY", // Libya
  "438": "LIE", // Liechtenstein
  "440": "LTU", // Lithuania
  "442": "LUX", // Luxembourg
  "446": "MAC", // Macao
  "450": "MDG", // Madagascar
  "454": "MWI", // Malawi
  "458": "MYS", // Malaysia
  "462": "MDV", // Maldives
  "466": "MLI", // Mali
  "470": "MLT", // Malta
  "478": "MRT", // Mauritania
  "480": "MUS", // Mauritius
  "484": "MEX", // Mexico
  "496": "MNG", // Mongolia
  "498": "MDA", // Moldova
  "499": "MNE", // Montenegro
  "504": "MAR", // Morocco
  "508": "MOZ", // Mozambique
  "512": "OMN", // Oman
  "516": "NAM", // Namibia
  "524": "NPL", // Nepal
  "528": "NLD", // Netherlands
  "540": "NCL", // New Caledonia
  "554": "NZL", // New Zealand
  "558": "NIC", // Nicaragua
  "562": "NER", // Niger
  "566": "NGA", // Nigeria
  "578": "NOR", // Norway
  "586": "PAK", // Pakistan
  "591": "PAN", // Panama
  "598": "PNG", // Papua New Guinea
  "600": "PRY", // Paraguay
  "604": "PER", // Peru
  "608": "PHL", // Philippines
  "616": "POL", // Poland
  "620": "PRT", // Portugal
  "624": "GNB", // Guinea-Bissau
  "626": "TLS", // Timor-Leste
  "630": "PRI", // Puerto Rico
  "634": "QAT", // Qatar
  "642": "ROU", // Romania
  "643": "RUS", // Russia
  "646": "RWA", // Rwanda
  "682": "SAU", // Saudi Arabia
  "686": "SEN", // Senegal
  "688": "SRB", // Serbia
  "690": "SYC", // Seychelles
  "694": "SLE", // Sierra Leone
  "702": "SGP", // Singapore
  "703": "SVK", // Slovakia
  "704": "VNM", // Vietnam
  "705": "SVN", // Slovenia
  "706": "SOM", // Somalia
  "710": "ZAF", // South Africa
  "716": "ZWE", // Zimbabwe
  "724": "ESP", // Spain
  "728": "SSD", // South Sudan
  "729": "SDN", // Sudan
  "732": "ESH", // Western Sahara
  "740": "SUR", // Suriname
  "748": "SWZ", // Eswatini
  "752": "SWE", // Sweden
  "756": "CHE", // Switzerland
  "760": "SYR", // Syria
  "762": "TJK", // Tajikistan
  "764": "THA", // Thailand
  "768": "TOG", // Togo
  "776": "TON", // Tonga
  "780": "TTO", // Trinidad and Tobago
  "784": "ARE", // United Arab Emirates
  "788": "TUN", // Tunisia
  "792": "TUR", // Turkey
  "795": "TKM", // Turkmenistan
  "800": "UGA", // Uganda
  "804": "UKR", // Ukraine
  "807": "MKD", // North Macedonia
  "818": "EGY", // Egypt
  "826": "GBR", // United Kingdom
  "834": "TZA", // Tanzania
  "840": "USA", // United States
  "858": "URY", // Uruguay
  "860": "UZB", // Uzbekistan
  "862": "VEN", // Venezuela
  "882": "WSM", // Samoa
  "887": "YEM", // Yemen
  "894": "ZMB", // Zambia
};

// Helper function to resolve dynamic TopoJSON properties/id to 3-letter countryCode
function getCountryCode(geo: any, visaList: Record<string, VisaData>): string {
  // 1. Try ISO_A3 or iso_a3 from properties
  const isoA3 = geo.properties?.ISO_A3 || geo.properties?.iso_a3;
  if (isoA3 && typeof isoA3 === "string" && isoA3.length === 3) {
    return isoA3.toUpperCase();
  }

  // 2. Try numeric code mapping from geo.id
  const idStr = String(geo.id || geo.properties?.id || "").trim();
  if (idStr) {
    const padded = idStr.padStart(3, "0");
    const mapped = NUMERIC_TO_ISO_A3[padded];
    if (mapped) return mapped;
  }

  // 3. Try name match fallback
  const name = geo.properties?.name || geo.properties?.NAME;
  if (name && typeof name === "string") {
    const nameLower = name.toLowerCase().trim();
    if (nameLower === "united states of america" || nameLower === "united states") return "USA";
    if (nameLower === "united kingdom") return "GBR";
    if (nameLower === "viet nam") return "VNM";
    if (nameLower === "south korea" || nameLower === "korea") return "KOR";
    if (nameLower === "north korea") return "PRK";
    if (nameLower === "russia" || nameLower === "russian federation") return "RUS";
    if (nameLower === "uae" || nameLower === "united arab emirates") return "ARE";

    const matched = Object.values(visaList).find(
      (v) => v.countryName.toLowerCase().trim() === nameLower
    );
    if (matched) return matched.countryCode;
  }

  return idStr;
}

interface VisaData {
  countryName: string;
  countryCode: string;
  flagEmoji: string;
  isVisaRequired: boolean;
  isVisaOnArrival: boolean;
  isEVisaAvailable: boolean;
  processingTimeDays?: number;
  validityDays?: number;
  maxStayDays?: number;
  fee?: number;
  feeCurrency?: string;
  applicationUrl?: string;
  requirements: string[];
  documentsRequired: string[];
  notes?: string;
}

export function VisaMap() {
  const [visaList, setVisaList] = useState<Record<string, VisaData>>({});
  const [loading, setLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<VisaData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<VisaData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function loadVisaData() {
      try {
        const res = await fetch("/api/visa?segment=OUTBOUND&pageSize=250");
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (json.success && json.data) {
          const mapping: Record<string, VisaData> = {};
          json.data.forEach((item: any) => {
            mapping[item.countryCode] = item;
          });
          setVisaList(mapping);
        }
      } catch (e) {
        console.warn("[VisaMap] Could not fetch live visa details");
      } finally {
        setLoading(false);
      }
    }
    loadVisaData();
  }, []);

  const getCountryColor = (geo: any) => {
    const code = getCountryCode(geo, visaList);
    if (code === "IND") return "#10b981"; // India is Emerald

    const visa = visaList[code];
    if (!visa) return "#cbd5e1"; // Unmapped

    if (!visa.isVisaRequired) return "#ff6b35"; // Visa Free (Orange)
    if (visa.isVisaOnArrival) return "#f7931e"; // Visa on Arrival (Yellow)
    if (visa.isEVisaAvailable) return "#e84393"; // e-Visa (Purple)
    return "#334155"; // Visa Required (Dark Slate)
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 15, y: e.clientY + 15 });
  };

  if (loading) return <div className="glass p-12 rounded-3xl"><CompassSpinner /></div>;

  return (
    <div className="relative w-full glass rounded-3xl p-6 border border-sunset-1/10 shadow-lg select-none">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-display font-extrabold text-heading-lg text-ink dark:text-cream">Global Visa Power Map</h3>
          <p className="text-[10px] text-ink/50 dark:text-cream/50 mt-0.5">
            Colored countries indicate registered outbound destinations. White/grey countries represent standard visa applications or unmapped data.
          </p>
        </div>
        
        {/* Map Legend */}
        <div className="flex flex-wrap gap-3.5 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#ff6b35]" />
            <span>Visa-Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#f7931e]" />
            <span>On-Arrival</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#e84393]" />
            <span>e-Visa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#334155]" />
            <span>Visa Required</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden h-[300px] md:h-[420px] cursor-grab active:cursor-grabbing relative" onMouseMove={handleMouseMove}>
        <ComposableMap projectionConfig={{ scale: 145 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const code = getCountryCode(geo, visaList);
                const visa = visaList[code];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      if (visa) setHoveredCountry(visa);
                    }}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => {
                      if (visa) setSelectedCountry(visa);
                    }}
                    style={{
                      default: {
                        fill: getCountryColor(geo),
                        outline: "none",
                        transition: "fill 0.3s",
                      },
                      hover: {
                        fill: code === "IND" ? "#10b981" : "#6c5ce7",
                        outline: "none",
                        cursor: visa ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "#0c1929",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredCountry && (
        <div
          style={{ top: tooltipPos.y, left: tooltipPos.x }}
          className="fixed z-[999] pointer-events-none p-3 px-4 rounded-xl glass-strong border border-sunset-1/20 text-xs font-semibold text-ink dark:text-cream shadow-md flex flex-col space-y-1 animate-scale-in"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-base">{hoveredCountry.flagEmoji || "🌐"}</span>
            <span className="font-extrabold text-sm">{hoveredCountry.countryName}</span>
          </div>
          <span className="text-[10px] text-sunset-1 uppercase tracking-wider font-extrabold">
            {!hoveredCountry.isVisaRequired
              ? "Visa Free"
              : hoveredCountry.isVisaOnArrival
              ? "Visa on Arrival"
              : hoveredCountry.isEVisaAvailable
              ? "e-Visa Available"
              : "Visa Required"}
          </span>
          {hoveredCountry.maxStayDays && (
            <span className="text-ink/60 dark:text-cream/60 text-[10px]">
              Max Stay: {hoveredCountry.maxStayDays} Days
            </span>
          )}
        </div>
      )}

      {/* Detailed Slide-out Side Drawer */}
      {selectedCountry && (
        <div className="fixed inset-0 z-[1000] flex justify-end bg-ink/40 backdrop-blur-sm animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedCountry(null)} />
          
          <div className="relative w-full max-w-md h-full bg-cream dark:bg-ink p-8 border-l border-sunset-1/10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-sunset-1/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedCountry.flagEmoji || "🌐"}</span>
                  <div>
                    <h4 className="text-xl font-display font-black text-ink dark:text-cream leading-tight">
                      {selectedCountry.countryName}
                    </h4>
                    <span className="text-xs uppercase font-extrabold text-sunset-1 tracking-widest">
                      {selectedCountry.countryCode}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="w-8 h-8 rounded-full border border-sunset-1/15 flex items-center justify-center hover:bg-sunset-1/10 hover:text-sunset-1 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Visa details cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-sunset-1/5 rounded-2xl border border-sunset-1/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-1">Status</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {!selectedCountry.isVisaRequired ? "Visa Free" : selectedCountry.isVisaOnArrival ? "Visa on Arrival" : selectedCountry.isEVisaAvailable ? "e-Visa" : "Required"}
                  </p>
                </div>
                <div className="p-4 bg-sunset-2/5 rounded-2xl border border-sunset-2/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-2">Max Stay</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {selectedCountry.maxStayDays ? `${selectedCountry.maxStayDays} Days` : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-sunset-3/5 rounded-2xl border border-sunset-3/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-3">Fee</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {selectedCountry.fee ? `${selectedCountry.fee} ${selectedCountry.feeCurrency || "USD"}` : "Free"}
                  </p>
                </div>
                <div className="p-4 bg-sunset-4/5 rounded-2xl border border-sunset-4/10">
                  <span className="text-[10px] uppercase font-bold text-sunset-4">Processing Time</span>
                  <p className="text-sm font-bold text-ink dark:text-cream mt-1">
                    {selectedCountry.processingTimeDays ? `${selectedCountry.processingTimeDays} Days` : "Instant"}
                  </p>
                </div>
              </div>

              {/* Requirements & Documents */}
              {selectedCountry.documentsRequired && selectedCountry.documentsRequired.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-extrabold text-sunset-1 tracking-wider">Required Documents</span>
                  <ul className="space-y-1.5">
                    {selectedCountry.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2 text-ink/80 dark:text-cream/80">
                        <span className="text-sunset-1">✓</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes */}
              {selectedCountry.notes && (
                <div className="space-y-2">
                  <span className="text-xs uppercase font-extrabold text-sunset-2 tracking-wider">Crucial Advisories</span>
                  <p className="text-xs text-ink/75 dark:text-cream/75 leading-relaxed bg-sunset-2/5 p-3 rounded-xl border border-sunset-2/10">
                    {selectedCountry.notes}
                  </p>
                </div>
              )}
            </div>

            {selectedCountry.applicationUrl && (
              <a
                href={selectedCountry.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn btn-primary mt-6 text-center"
              >
                Apply Official eVisa
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
