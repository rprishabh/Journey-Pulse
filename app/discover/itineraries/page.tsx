"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Compass,
  MapPin,
  Clock,
  ChevronDown,
  Sparkles,
  Flame,
  Milestone,
  Trees,
} from "lucide-react";

interface DayPlan {
  day: number;
  title: string;
  activities: string[];
  stay: string;
}

interface Itinerary {
  id: string;
  title: string;
  duration: number; // in days
  vibe: "Cultural" | "Adventure" | "Nature" | "Spiritual";
  startCity: string;
  route: string[];
  bestSeason: string;
  difficulty: "Easy" | "Moderate" | "Strenuous";
  highlights: string[];
  imageUrl: string;
  description: string;
  days: DayPlan[];
}

const ITINERARIES: Itinerary[] = [
  {
    id: "iti-1",
    title: "Golden Triangle Cultural Odyssey",
    duration: 5,
    vibe: "Cultural",
    startCity: "New Delhi",
    route: ["Delhi", "Agra", "Jaipur", "Delhi"],
    bestSeason: "October to March",
    difficulty: "Easy",
    highlights: ["Taj Mahal at sunrise", "Amber Fort elephant trails", "Delhi street food food safari"],
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    description: "The classic introduction to India's majestic heritage. Explore historic Mughal monuments, vibrant Rajasthani palaces, and the chaotic charm of old bazaars.",
    days: [
      { day: 1, title: "Imperial Delhi Arrival & Old City Walk", activities: ["Arrive in Delhi, private transfer to hotel.", "Afternoon visit to Jama Masjid and cycle rickshaw ride through Chandni Chowk.", "Evening drive past India Gate and Parliament House."], stay: "The Imperial Delhi (Luxury Heritage)" },
      { day: 2, title: "Delhi Monuments & Drive to Agra", activities: ["Morning tour of Humayun's Tomb and Qutub Minar complex.", "Afternoon 3.5-hour drive via Yamuna Expressway to Agra.", "Sunset view of Taj Mahal from Mehtab Bagh gardens."], stay: "The Oberoi Amarvilas (Agra)" },
      { day: 3, title: "Taj Sunrise & Fatehpur Sikri Transit to Jaipur", activities: ["Sunrise tour of Taj Mahal (UNESCO World Heritage Site).", "Return for breakfast, then tour the massive Agra Fort.", "Drive to Jaipur with a stopover tour of Fatehpur Sikri royal ruins."], stay: "Rambagh Palace (Jaipur)" },
      { day: 4, title: "Royal Amber Fort & Pink City Explores", activities: ["Morning excursion to Amber Fort with guided history walk.", "Photo stop at Hawa Mahal (Palace of Winds) and visit City Palace Museum.", "Astronomical exploration of Jantar Mantar observatory."], stay: "Rambagh Palace (Jaipur)" },
      { day: 5, title: "Jaipur Artisans & Departure back to Delhi", activities: ["Morning hand-block printing workshop with local artisans.", "Drive back to Delhi airport for outbound international flights."], stay: "None (Departure)" }
    ]
  },
  {
    id: "iti-2",
    title: "Kerala Backwaters & Tropical Coastlines",
    duration: 7,
    vibe: "Nature",
    startCity: "Kochi",
    route: ["Kochi", "Munnar", "Alleppey", "Varkala"],
    bestSeason: "September to March",
    difficulty: "Easy",
    highlights: ["Private houseboat cruise", "Tea garden trekking", "Cliffside ocean beaches"],
    imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    description: "Immerse yourself in green hills, spice farms, and tranquil palm-fringed backwaters. End with refreshing cliffside beaches along the Arabian Sea.",
    days: [
      { day: 1, title: "Kochi Heritage & Kathakali Dance", activities: ["Arrive in Kochi, explore colonial Fort Kochi walking trails.", "See Chinese Fishing Nets and visit St. Francis Church.", "Evening traditional Kathakali classical dance performance."], stay: "Brunton Boatyard (Kochi)" },
      { day: 2, title: "Western Ghats drive to Munnar Hills", activities: ["4-hour drive climbing past waterfalls to Munnar hill station.", "Walk through cardamom forests and visit a local spice farm.", "Evening sunset stroll through tea valleys."], stay: "Windermere Estate (Munnar)" },
      { day: 3, title: "Tea Gardens & Eravikulam Sanctuary", activities: ["Guided hike through lush Kannan Devan tea plantations.", "Visit Eravikulam National Park to spot endangered Nilgiri Tahr mountain goats.", "Explore Munnar local organic tea museum."], stay: "Windermere Estate (Munnar)" },
      { day: 4, title: "Alleppey Backwater Luxury Houseboat", activities: ["Drive down to Alleppey jetty points.", "Board a private luxury Kettuvallam (wooden houseboat).", "Slow cruise through inland canals, enjoying local Kerala meals cooked on board."], stay: "Private Houseboat (Overnight canal cruise)" },
      { day: 5, title: "Coastlines of Varkala Cliffs", activities: ["Disembark houseboat, 3.5-hour drive to Varkala beach.", "Settle in at the cliffside overlooking the Arabian Sea.", "Evening coastal yoga session and sunset dining."], stay: "The Gateway Resort (Varkala)" },
      { day: 6, title: "Varkala Spa Treatments & Temple Visit", activities: ["Morning Ayurvedic full body rejuvenation massage.", "Afternoon visit to the 2000-year-old Janardanaswamy Temple.", "Coastal trail walk to hidden Black Sand beach."], stay: "The Gateway Resort (Varkala)" },
      { day: 7, title: "Trivandrum Airport Exit", activities: ["Morning swim in the sea.", "Transfer to Trivandrum Airport (1 hour) for departure flights."], stay: "None (Departure)" }
    ]
  },
  {
    id: "iti-3",
    title: "Leh-Ladakh Himalayan High-Altitude Trail",
    duration: 9,
    vibe: "Adventure",
    startCity: "Leh",
    route: ["Leh", "Nubra Valley", "Pangong Lake", "Leh"],
    bestSeason: "June to September",
    difficulty: "Strenuous",
    highlights: ["Khardung La High Pass (17,582 ft)", "Bactrian camel desert safari", "Pangong Lake deep blue hues"],
    imageUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
    description: "An ultimate road trip through stark, moon-like high-altitude deserts, towering mountain passes, remote Buddhist monasteries, and crystal-clear alpine lakes.",
    days: [
      { day: 1, title: "High-Altitude Acclimatization Day", activities: ["Fly to Leh (11,500 ft). Transfer to hotel.", "Mandatory rest day for oxygen acclimatization.", "Short evening walk to Shanti Stupa for panoramic valley views."], stay: "The Grand Dragon Ladakh (Leh)" },
      { day: 2, title: "Indus Valley Monasteries Tour", activities: ["Visit Hemis Monastery, the wealthiest Buddhist complex in Ladakh.", "Tour Thiksey Monastery, architecturally resembling Lhasa's Potala Palace.", "See Stok Palace museum collections."], stay: "The Grand Dragon Ladakh (Leh)" },
      { day: 3, title: "Khardung La Pass to Nubra Valley", activities: ["Epic drive across Khardung La (17,582 ft), one of the world's highest motorable roads.", "Descend into the sand dunes of Nubra Valley.", "Bactrian double-humped camel safari at Hunder."], stay: "Lchang Nang Retreat (Nubra Valley)" },
      { day: 4, title: "Diskit Monastery & Turtuk Village", activities: ["Visit the giant Maitreya Buddha statue at Diskit.", "Drive to Turtuk, a village right next to the LOC, opened to tourists in 2010.", "Interact with the Balti ethnic community and walk apricot farms."], stay: "Lchang Nang Retreat (Nubra Valley)" },
      { day: 5, title: "Nubra to Pangong Lake via Shyok", activities: ["Rugged off-road driving along the Shyok River.", "Arrive at the breathtaking salt-water Pangong Lake (13,940 ft).", "Walk along the lake shores as colours change from turquoise to indigo."], stay: "Premier Luxury Glamping Camp (Pangong)" },
      { day: 6, title: "Pangong Sunrise to Leh via Chang La", activities: ["Witness freezing lake sunrise.", "Drive back to Leh crossing the formidable Chang La pass (17,586 ft).", "Evening free time to explore Leh Main Bazaar."], stay: "The Grand Dragon Ladakh (Leh)" },
      { day: 7, title: "Magnetic Hill & Confluence point", activities: ["Drive along Srinagar highway to see Magnetic Hill anomaly.", "Photograph Sangam - the confluence of Indus and Zanskar rivers.", "Visit Alchi Temple, built in the 11th century."], stay: "The Grand Dragon Ladakh (Leh)" },
      { day: 8, title: "Khardung La trek or leisure shopping", activities: ["Leisure day for optional souvenir shopping or light trekking.", "Farewell dinner tasting local Ladakhi Skyu (stew)."], stay: "The Grand Dragon Ladakh (Leh)" },
      { day: 9, title: "Leh Airport Exit", activities: ["Early morning flight transfer for departure flights to Delhi."], stay: "None (Departure)" }
    ]
  },
  {
    id: "iti-4",
    title: "Spiritual Ganga Trail & Yoga Journey",
    duration: 6,
    vibe: "Spiritual",
    startCity: "Dehradun",
    route: ["Rishikesh", "Haridwar", "Varanasi"],
    bestSeason: "September to April",
    difficulty: "Moderate",
    highlights: ["Evening Ganga Aarti ceremonies", "Sunrise boat ride in Varanasi", "Himalayan cave meditations"],
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80",
    description: "Align your mind and spirit. Travel from the holy foothills of Rishikesh, the world's yoga capital, to Varanasi, the oldest living city on Earth.",
    days: [
      { day: 1, title: "Rishikesh Foothills & Ashrams Walk", activities: ["Fly to Dehradun, drive to Rishikesh ashram sanctuary.", "Walk across Laxman Jhula suspension bridge.", "Evening attendance of the beautiful Ganga Aarti at Parmarth Niketan."], stay: "Ananda in the Himalayas (Ultra-Luxury)" },
      { day: 2, title: "Yoga Sadhana & Vashishta Cave Meditation", activities: ["Sunrise yoga and pranayama sessions.", "Drive alongside Ganga to Vashishta Guha cave for silent meditation.", "Evening sound healing therapy workshop."], stay: "Ananda in the Himalayas (Ultra-Luxury)" },
      { day: 3, title: "Haridwar ghats & flight to Varanasi", activities: ["Drive down to Haridwar to view Har Ki Pauri holy steps.", "Afternoon flight from Dehradun airport to Varanasi.", "Evening orientation walk in Varanasi's ancient narrow alleys."], stay: "BrijRama Palace (Varanasi Ghats)" },
      { day: 4, title: "Varanasi Sunrise Boat Cruise & Temples", activities: ["Sunrise boat row past the bathing ghats and cremation pyres.", "Guided walk of Kashi Vishwanath temple corridor.", "See traditional weaving shops showcasing silk Banarasi saris."], stay: "BrijRama Palace (Varanasi Ghats)" },
      { day: 5, title: "Sarnath Deer Park excursion & Grand Aarti", activities: ["Excursion to Sarnath, where Lord Buddha gave his first sermon.", "Tour Dhamek Stupa and Archeological Museum.", "Watch the spectacular multi-priest evening Aarti from a private boat."], stay: "BrijRama Palace (Varanasi Ghats)" },
      { day: 6, title: "Varanasi Airport Departure", activities: ["Morning meditation session.", "Afternoon departure transfer to Lal Bahadur Shastri airport."], stay: "None (Departure)" }
    ]
  }
];

export default function ItinerariesPage() {
  const [selectedDuration, setSelectedDuration] = useState<string>("All");
  const [selectedVibe, setSelectedVibe] = useState<string>("All");
  const [activeItineraryId, setActiveItineraryId] = useState<string>("iti-1");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Filters logic
  const filteredItineraries = useMemo(() => {
    return ITINERARIES.filter((iti) => {
      // Duration filter
      let matchesDuration = true;
      if (selectedDuration === "Short") matchesDuration = iti.duration <= 5;
      else if (selectedDuration === "Medium") matchesDuration = iti.duration >= 6 && iti.duration <= 7;
      else if (selectedDuration === "Long") matchesDuration = iti.duration >= 8;

      // Vibe filter
      const matchesVibe = selectedVibe === "All" || iti.vibe === selectedVibe;

      return matchesDuration && matchesVibe;
    });
  }, [selectedDuration, selectedVibe]);

  // Active itinerary details
  const activeItinerary = useMemo(() => {
    return ITINERARIES.find((iti) => iti.id === activeItineraryId) || ITINERARIES[0];
  }, [activeItineraryId]);

  const durationOptions = [
    { id: "All", label: "All Lengths" },
    { id: "Short", label: "3 - 5 Days" },
    { id: "Medium", label: "6 - 7 Days" },
    { id: "Long", label: "8+ Days" }
  ];

  const vibeOptions = ["All", "Cultural", "Adventure", "Nature", "Spiritual"];

  return (
    <div className="min-h-screen bg-ink text-cream relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sunset-1/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-sunset-2/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="container-wide py-10 relative z-10 space-y-12">
        {/* Navigation */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-sunset-1/10 hover:text-sunset-1 text-xs font-black uppercase tracking-widest border border-sunset-1/10 text-cream transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sunset-1/10 text-sunset-2 border border-sunset-1/25">
            <Milestone className="w-3.5 h-3.5" />
            Curated Expeditions
          </span>
          <h1 className="font-display font-black text-display-sm md:text-display-md leading-tight text-white">
            Verified Travel <span className="text-gradient">Itineraries</span>
          </h1>
          <p className="text-body-md text-surface-400">
            Hand-crafted multi-day journeys, curated by luxury destination experts. Authentic scheduling, selected heritage lodgings, and optimized transits.
          </p>
        </div>

        {/* ── FILTERS BAR ── */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-surface-900/60 border border-white/5 shadow-glass">
          {/* Duration Filters */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-surface-500 block pl-1">Trip Length</span>
            <div className="flex flex-wrap gap-1.5 p-1 bg-surface-950/60 rounded-xl border border-white/5">
              {durationOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedDuration(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    selectedDuration === opt.id
                      ? "bg-sunset-1 text-white"
                      : "text-surface-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Filters */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-surface-500 block pl-1">Travel Style</span>
            <div className="flex flex-wrap gap-1.5 p-1 bg-surface-950/60 rounded-xl border border-white/5">
              {vibeOptions.map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => setSelectedVibe(vibe)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    selectedVibe === vibe
                      ? "bg-sunset-2 text-white"
                      : "text-surface-400 hover:text-white"
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── ITINERARY SPLIT INTERFACE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cards List */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 block pl-1">Available Routes ({filteredItineraries.length})</span>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredItineraries.map((iti) => (
                  <motion.div
                    key={iti.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => {
                      setActiveItineraryId(iti.id);
                      setExpandedDay(1);
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                      activeItineraryId === iti.id
                        ? "bg-gradient-to-br from-surface-950/80 to-surface-900/80 border-sunset-1 shadow-glow"
                        : "bg-surface-900/40 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider mb-2 ${
                          iti.vibe === "Cultural" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          iti.vibe === "Adventure" ? "bg-sunset-1/10 text-sunset-1 border border-sunset-1/20" :
                          iti.vibe === "Nature" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}>
                          {iti.vibe}
                        </span>
                        <h4 className="font-display font-bold text-sm text-white group-hover:text-sunset-1 transition-colors">{iti.title}</h4>
                        <p className="text-[11px] text-surface-400 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sunset-2" />
                          {iti.duration} Days
                          <span className="text-white/10">•</span>
                          <MapPin className="w-3.5 h-3.5 text-sunset-3" />
                          Starts in {iti.startCity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-surface-500 shrink-0">
                        {iti.duration}d
                      </span>
                    </div>

                    {/* Route brief */}
                    <div className="flex items-center gap-1 flex-wrap pt-3 mt-3 border-t border-white/5 text-[9px] text-surface-400">
                      {iti.route.map((city, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span className="text-surface-600">→</span>}
                          <span className="bg-white/5 px-1.5 py-0.5 rounded">{city}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredItineraries.length === 0 && (
                <div className="py-12 text-center text-surface-500 text-xs border border-dashed border-white/10 rounded-2xl">
                  No itineraries matches selected filters.
                </div>
              )}
            </div>
          </div>

          {/* Right: Active Detail View */}
          <div className="lg:col-span-7 bg-surface-900/60 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-glass">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-display font-black text-heading-lg text-white">
                  {activeItinerary.title}
                </h3>
                <span className="px-3 py-1 bg-sunset-1/15 border border-sunset-1/30 rounded-xl font-display font-bold text-xs text-sunset-1 text-center shrink-0">
                  {activeItinerary.duration} Days
                </span>
              </div>

              <p className="text-body-sm text-surface-300 leading-relaxed">
                {activeItinerary.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-950/40 border border-white/5 text-xs">
                <div>
                  <span className="text-surface-500 block">Best Season</span>
                  <span className="font-bold text-white">{activeItinerary.bestSeason}</span>
                </div>
                <div>
                  <span className="text-surface-500 block">Difficulty</span>
                  <span className="font-bold text-white">{activeItinerary.difficulty}</span>
                </div>
                <div>
                  <span className="text-surface-500 block">Route Vibe</span>
                  <span className="font-bold text-white">{activeItinerary.vibe}</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 block pl-1">Highlights</span>
              <div className="flex flex-wrap gap-2">
                {activeItinerary.highlights.map((hl, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-surface-200">
                    <Sparkles className="w-3.5 h-3.5 text-sunset-2" />
                    {hl}
                  </span>
                ))}
              </div>
            </div>

            {/* Day-by-Day Accordion */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 block pl-1">Day-by-Day Breakdown</span>
              <div className="space-y-3">
                {activeItinerary.days.map((d) => (
                  <div
                    key={d.day}
                    className="border border-white/5 rounded-2xl bg-surface-950/30 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedDay(expandedDay === d.day ? null : d.day)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-sunset-1/10 border border-sunset-1/25 flex items-center justify-center font-display font-black text-xs text-sunset-1 shrink-0">
                          {d.day}
                        </span>
                        <span className="font-bold text-xs md:text-sm text-white">{d.title}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform duration-300 ${
                        expandedDay === d.day ? "rotate-180 text-sunset-1" : ""
                      }`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedDay === d.day && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-white/5 space-y-3 text-xs text-surface-300 bg-surface-950/20">
                            {/* Activities checklist */}
                            <div className="space-y-2.5 mt-3">
                              {d.activities.map((act, index) => (
                                <div key={index} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sunset-2 shrink-0 mt-1.5" />
                                  <span className="leading-relaxed">{act}</span>
                                </div>
                              ))}
                            </div>

                            {/* Stay Accommodation */}
                            {d.stay && (
                              <div className="mt-4 p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-[10px]">
                                <span className="text-surface-500 uppercase tracking-wider font-bold">Suggested Lodging:</span>
                                <span className="font-bold text-white text-right">{d.stay}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
