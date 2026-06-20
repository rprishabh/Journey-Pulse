// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Prisma Seed Script
// Production seed data for Indian tourism daily facts & visa metrics
// Connection handles driver adapters for serverless PostgreSQL drivers
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

// 1. Create the native PostgreSQL connection pool
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Inject the driver pool directly into the Prisma Client constructor
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: NEWS SOURCES (20+ Aggregation Sources)
// ═══════════════════════════════════════════════════════════════════════════════

const newsSources = [
  // ── DOMESTIC / REGIONAL (India) — Top-Tier National Networks ──────────
  {
    name: "Times of India — Travel",
    slug: "toi-travel",
    websiteUrl: "https://timesofindia.indiatimes.com/travel",
    rssUrl: "https://timesofindia.indiatimes.com/rssfeeds/1597872545.cms",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.93,
    fetchInterval: 1800,
  },
  {
    name: "NDTV — Top Stories",
    slug: "ndtv-top-stories",
    websiteUrl: "https://www.ndtv.com",
    rssUrl: "https://feeds.feedburner.com/ndtvnews-top-stories",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.92,
    fetchInterval: 1800,
  },
  {
    name: "Press Information Bureau (PIB)",
    slug: "pib-india",
    websiteUrl: "https://pib.gov.in",
    rssUrl: "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.99,
    fetchInterval: 3600,
  },
  {
    name: "DD News — National Broadcaster",
    slug: "dd-news",
    websiteUrl: "https://ddnews.gov.in",
    rssUrl: "https://ddnews.gov.in/en/feed/",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.97,
    fetchInterval: 3600,
  },
  {
    name: "The Hindu — National",
    slug: "the-hindu-national",
    websiteUrl: "https://www.thehindu.com/news/national",
    rssUrl: "https://www.thehindu.com/news/national/feeder/default.rss",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.94,
    fetchInterval: 1800,
  },
  {
    name: "Economic Times — Aviation & Transport",
    slug: "et-aviation",
    websiteUrl: "https://economictimes.indiatimes.com/industry/transportation/airlines-/-aviation",
    rssUrl: "https://economictimes.indiatimes.com/industry/transportation/airlines-/-aviation/rssfeeds/13358022.cms",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.91,
    fetchInterval: 3600,
  },
  {
    name: "India Today — Travel",
    slug: "india-today-travel",
    websiteUrl: "https://www.indiatoday.in/travel",
    rssUrl: "https://www.indiatoday.in/rss/1206573",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.90,
    fetchInterval: 1800,
  },

  // ── GLOBAL (International) — Tier-1 World News Networks ──────────────
  {
    name: "Reuters — World News",
    slug: "reuters-world",
    websiteUrl: "https://www.reuters.com/world",
    rssUrl: "https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.98,
    fetchInterval: 1800,
  },
  {
    name: "BBC News — World",
    slug: "bbc-world",
    websiteUrl: "https://www.bbc.com/news/world",
    rssUrl: "https://feeds.bbci.co.uk/news/world/rss.xml",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.97,
    fetchInterval: 1800,
  },
  {
    name: "Associated Press — International",
    slug: "ap-international",
    websiteUrl: "https://apnews.com",
    rssUrl: "https://rsshub.app/apnews/topics/apf-topnews",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.97,
    fetchInterval: 1800,
  },
  {
    name: "CNBC — Travel & Aviation",
    slug: "cnbc-travel",
    websiteUrl: "https://www.cnbc.com/travel/",
    rssUrl: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000739",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.93,
    fetchInterval: 3600,
  },
  {
    name: "Al Jazeera — News",
    slug: "aljazeera-news",
    websiteUrl: "https://www.aljazeera.com",
    rssUrl: "https://www.aljazeera.com/xml/rss/all.xml",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.94,
    fetchInterval: 3600,
  },
  {
    name: "The Guardian — Travel",
    slug: "guardian-travel",
    websiteUrl: "https://www.theguardian.com/uk/travel",
    rssUrl: "https://www.theguardian.com/uk/travel/rss",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.93,
    fetchInterval: 3600,
  },
  {
    name: "Bloomberg — Markets & Economy",
    slug: "bloomberg-markets",
    websiteUrl: "https://www.bloomberg.com/markets",
    rssUrl: "https://feeds.bloomberg.com/markets/news.rss",
    scraperType: "rss",
    isActive: true,
    trustScore: 0.95,
    fetchInterval: 3600,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

const categories = [
  { name: "Visa & Immigration",     slug: "visa-immigration",     iconName: "Passport",       colorHex: "#6366f1", sortOrder: 1 },
  { name: "Flight & Aviation",      slug: "flight-aviation",      iconName: "Plane",          colorHex: "#0ea5e9", sortOrder: 2 },
  { name: "Hotel & Accommodation",  slug: "hotel-accommodation",  iconName: "Hotel",          colorHex: "#f59e0b", sortOrder: 3 },
  { name: "Destination Guides",     slug: "destination-guides",   iconName: "MapPin",         colorHex: "#10b981", sortOrder: 4 },
  { name: "Travel Advisory",        slug: "travel-advisory",      iconName: "ShieldAlert",    colorHex: "#ef4444", sortOrder: 5 },
  { name: "Government Initiatives", slug: "government-initiatives", iconName: "Landmark",     colorHex: "#8b5cf6", sortOrder: 6 },
  { name: "Luxury Travel",          slug: "luxury-travel",        iconName: "Crown",          colorHex: "#d946ef", sortOrder: 7 },
  { name: "Budget Travel",          slug: "budget-travel",        iconName: "Wallet",         colorHex: "#22c55e", sortOrder: 8 },
  { name: "Adventure & Trekking",   slug: "adventure-trekking",   iconName: "Mountain",       colorHex: "#f97316", sortOrder: 9 },
  { name: "Wellness & Ayurveda",    slug: "wellness-ayurveda",    iconName: "Heart",          colorHex: "#ec4899", sortOrder: 10 },
  { name: "Heritage & Culture",     slug: "heritage-culture",     iconName: "Building2",      colorHex: "#a855f7", sortOrder: 11 },
  { name: "Wildlife & Nature",      slug: "wildlife-nature",      iconName: "Trees",          colorHex: "#16a34a", sortOrder: 12 },
  { name: "Food & Cuisine",         slug: "food-cuisine",         iconName: "UtensilsCrossed", colorHex: "#ea580c", sortOrder: 13 },
  { name: "Rail & Road Travel",     slug: "rail-road-travel",     iconName: "TrainFront",     colorHex: "#0284c7", sortOrder: 14 },
  { name: "Cruise & Waterways",     slug: "cruise-waterways",     iconName: "Ship",           colorHex: "#06b6d4", sortOrder: 15 },
  { name: "Travel Technology",      slug: "travel-technology",    iconName: "Smartphone",     colorHex: "#6d28d9", sortOrder: 16 },
  { name: "Solo & Female Travel",   slug: "solo-female-travel",   iconName: "User",           colorHex: "#e11d48", sortOrder: 17 },
  { name: "Family Travel",          slug: "family-travel",        iconName: "Users",          colorHex: "#059669", sortOrder: 18 },
  { name: "Honeymoon & Romance",    slug: "honeymoon-romance",    iconName: "HeartHandshake", colorHex: "#db2777", sortOrder: 19 },
  { name: "Currency & Finance",     slug: "currency-finance",     iconName: "IndianRupee",    colorHex: "#ca8a04", sortOrder: 20 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: TAGS
// ═══════════════════════════════════════════════════════════════════════════════

const tags = [
  { name: "Trending",          slug: "trending" },
  { name: "Breaking News",     slug: "breaking-news" },
  { name: "Visa on Arrival",   slug: "visa-on-arrival" },
  { name: "e-Visa",            slug: "e-visa" },
  { name: "Indian Passport",   slug: "indian-passport" },
  { name: "Henley Index",      slug: "henley-index" },
  { name: "UNESCO Heritage",   slug: "unesco-heritage" },
  { name: "Incredible India",  slug: "incredible-india" },
  { name: "Budget Friendly",   slug: "budget-friendly" },
  { name: "Luxury",            slug: "luxury" },
  { name: "Backpacking",       slug: "backpacking" },
  { name: "Digital Nomad",     slug: "digital-nomad" },
  { name: "eSIM",              slug: "esim" },
  { name: "Travel Insurance",  slug: "travel-insurance" },
  { name: "Airport Updates",   slug: "airport-updates" },
  { name: "Railway",           slug: "railway" },
  { name: "Monsoon Travel",    slug: "monsoon-travel" },
  { name: "Winter Travel",     slug: "winter-travel" },
  { name: "Summer Travel",     slug: "summer-travel" },
  { name: "Festival Season",   slug: "festival-season" },
  { name: "Pilgrimage",        slug: "pilgrimage" },
  { name: "Wildlife Safari",   slug: "wildlife-safari" },
  { name: "Scuba Diving",      slug: "scuba-diving" },
  { name: "Ayurveda",          slug: "ayurveda" },
  { name: "Yoga Retreat",      slug: "yoga-retreat" },
  { name: "Solo Female",       slug: "solo-female" },
  { name: "Family Friendly",   slug: "family-friendly" },
  { name: "Honeymoon",         slug: "honeymoon" },
  { name: "Work from Anywhere", slug: "work-from-anywhere" },
  { name: "Sustainable Travel", slug: "sustainable-travel" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: INDIAN TOURISM DAILY FACTS
// ═══════════════════════════════════════════════════════════════════════════════

const dailyFacts = [
  {
    dayOffset: 0,
    title: "Taj Mahal's Color-Shifting Marble",
    fact: "The Taj Mahal appears to change color throughout the day — pinkish in the morning, white during the day, and golden under moonlight — due to the translucent properties of its Makrana marble.",
    detailedFact: "Shah Jahan commissioned the Taj Mahal in 1632 in memory of his wife Mumtaz Mahal. It took 22 years to build with 20,000 artisans. The Makrana marble was sourced from Rajasthan and contains crystalline structures that interact uniquely with different light wavelengths. UNESCO designated it a World Heritage Site in 1983.",
    category: "HERITAGE",
    region: "North India",
    state: "Uttar Pradesh",
    funEmoji: "🕌",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 1,
    title: "Hampi's Boulder Wonderland",
    fact: "Hampi, the ruins of the Vijayanagara Empire, spans over 26 square kilometers with more than 1,600 surviving monuments, making it one of the largest open-air museum complexes in the world.",
    detailedFact: "At its peak in the 15th century, Hampi was one of the richest and largest cities in the world, with a population exceeding 500,000. The city's markets traded diamonds, pearls, and silk. The iconic stone chariot at the Vittala Temple is actually a shrine to Garuda, carved from a single granite boulder.",
    category: "HERITAGE",
    region: "South India",
    state: "Karnataka",
    funEmoji: "🏛️",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 2,
    title: "Ajanta Caves' Hidden 2,000-Year-Old Art",
    fact: "The Ajanta Caves contain paintings that have survived for over 2,000 years using a technique where pigments were mixed with glue and pressed into wet lime plaster — an ancient fresco method predating European Renaissance techniques by a millennium.",
    detailedFact: "Carved between the 2nd century BCE and 6th century CE, the 30 rock-cut caves were accidentally rediscovered in 1819 by British officer John Smith during a tiger hunt. The paintings depict Jataka tales and are considered masterpieces of Buddhist religious art. Cave 1's famous Padmapani Bodhisattva is often called the 'Mona Lisa of India'.",
    category: "HERITAGE",
    region: "West India",
    state: "Maharashtra",
    funEmoji: "🎨",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 3,
    title: "The Living Root Bridges of Meghalaya",
    fact: "The Khasi and Jaintia tribes of Meghalaya have been growing living bridges from the aerial roots of rubber fig trees for over 500 years. Some bridges are strong enough to support the weight of 50 people simultaneously.",
    detailedFact: "The most famous double-decker root bridge in Nongriat village took approximately 10–15 years to become functional. Unlike conventional bridges that weaken with time, these living structures grow stronger over centuries. In 2022, Meghalaya submitted these bridges for UNESCO World Heritage Site nomination.",
    category: "HERITAGE",
    region: "Northeast India",
    state: "Meghalaya",
    funEmoji: "🌿",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 4,
    title: "Konark Sun Temple's Precision Engineering",
    fact: "The Konark Sun Temple's main wheel (one of 24 carved stone wheels) functions as an accurate sundial — the spokes cast shadows that tell the time to within minutes, even today after 800 years.",
    detailedFact: "Built by King Narasimhadeva I of the Eastern Ganga dynasty in 1250 CE, the temple was designed as a colossal chariot with 24 wheels pulled by seven horses. Each wheel has 8 major spokes representing the praharas (3-hour periods). The temple's black pagoda served as a navigational landmark for European sailors.",
    category: "ARCHITECTURE",
    region: "East India",
    state: "Odisha",
    funEmoji: "☀️",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 5,
    title: "India Has 75% of the World's Tigers",
    fact: "India is home to approximately 3,682 wild tigers — about 75% of the global population — across 54 tiger reserves spanning 75,000 square kilometers, making it the single most important country for tiger conservation on Earth.",
    detailedFact: "Project Tiger, launched in 1973 with just 9 reserves, has been one of the most successful wildlife conservation programs globally. Jim Corbett National Park was the first tiger reserve. The latest census uses camera traps, pugmark tracking, and DNA analysis. Madhya Pradesh leads with the highest tiger count among Indian states.",
    category: "WILDLIFE",
    region: "Central India",
    state: "Madhya Pradesh",
    funEmoji: "🐅",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 6,
    title: "The Only Place Where Lions and Tigers Coexist",
    fact: "India is the only country in the world where Asiatic lions and Bengal tigers both exist in the wild. The Gir Forest in Gujarat shelters all 674 remaining Asiatic lions on the planet.",
    detailedFact: "The Asiatic lion population dropped to just 20 individuals in 1913 before the Nawab of Junagadh banned hunting. Today, Gir National Park spans 1,412 sq km and is a global conservation success story. Unlike African lions, Asiatic lions have a distinctive belly fold and smaller manes.",
    category: "WILDLIFE",
    region: "West India",
    state: "Gujarat",
    funEmoji: "🦁",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 7,
    title: "Kaziranga's One-Horned Rhino Kingdom",
    fact: "Kaziranga National Park in Assam hosts two-thirds of the world's entire population of Indian one-horned rhinoceroses — approximately 2,613 individuals as of the latest census.",
    detailedFact: "In 1905, when Mary Curzon, wife of the Viceroy, visited and saw no rhinos, it prompted the first conservation efforts. The park also has the highest density of tigers among protected areas globally. Its unique grasslands and wetlands are flooded annually by the Brahmaputra River, which maintains the ecosystem's fertility.",
    category: "WILDLIFE",
    region: "Northeast India",
    state: "Assam",
    funEmoji: "🦏",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 8,
    title: "Kumbh Mela: Earth's Largest Gathering",
    fact: "The Kumbh Mela is the largest peaceful gathering of humans on Earth — the 2019 Prayagraj edition attracted over 240 million visitors across 49 days, visible even from satellite imagery in space.",
    detailedFact: "UNESCO inscribed Kumbh Mela on the Representative List of Intangible Cultural Heritage of Humanity in 2017. The festival rotates between four sacred river cities: Prayagraj, Haridwar, Nashik, and Ujjain. The Maha Kumbh occurs every 144 years. In 2019, the temporary city built for the event had 250,000 tents and consumed 3 billion liters of water.",
    category: "FESTIVAL",
    region: "North India",
    state: "Uttar Pradesh",
    funEmoji: "🪷",
    tone: "FORMAL_RESPECTFUL",
  },
  {
    dayOffset: 9,
    title: "India Speaks 19,500 Languages and Dialects",
    fact: "India has 22 officially recognized languages, but the 2011 Census recorded 19,569 distinct mother tongues across the country. Every 50 kilometers in India, the dialect changes detectably.",
    detailedFact: "Hindi and English serve as the two official languages of the Union Government. The Eighth Schedule of the Indian Constitution recognizes 22 languages, but linguistically India is far more diverse. The People's Linguistic Survey of India documented 780 languages, of which 400 are endangered. Each state's tourism materials must navigate this linguistic richness.",
    category: "CULTURE",
    region: "Pan India",
    state: null,
    funEmoji: "🗣️",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 10,
    title: "Varanasi: The Oldest Continuously Inhabited City",
    fact: "Varanasi (Kashi) has been continuously inhabited for over 5,000 years, making it one of the oldest living cities in the world — older than Athens, Jerusalem, and Beijing.",
    detailedFact: "Mark Twain wrote: 'Varanasi is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together.' The city has 88 ghats along the Ganges, 23,000 temples, and hosts the most ancient continuously-performed Ganga Aarti ceremony. It is the spiritual capital of Hinduism, Buddhism, and Jainism.",
    category: "SPIRITUAL",
    region: "North India",
    state: "Uttar Pradesh",
    funEmoji: "🙏",
    tone: "FORMAL_RESPECTFUL",
  },
  {
    dayOffset: 11,
    title: "India's Spice Trade Built the Modern World",
    fact: "India produces 75% of the world's spices — over 3.6 million tonnes annually — and the historic quest for Indian spices (especially black pepper, called 'Black Gold') directly led to the European Age of Exploration and the discovery of the Americas.",
    detailedFact: "The Malabar Coast of Kerala was the epicenter of the global spice trade for over 3,000 years. Vasco da Gama's 1498 voyage to Calicut was driven by the desire to bypass Arab middlemen in the spice trade. Today, India exports spices worth over ₹35,000 crores annually. Kerala's Idukki district alone produces 60% of India's cardamom.",
    category: "CUISINE",
    region: "South India",
    state: "Kerala",
    funEmoji: "🌶️",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 12,
    title: "The World's Largest Free Kitchen",
    fact: "The Golden Temple in Amritsar runs the world's largest free community kitchen (Langar), serving 75,000 to 100,000 free vegetarian meals daily to people of all religions, races, and backgrounds — every single day without exception.",
    detailedFact: "The Langar tradition was started by Guru Nanak Dev Ji in the 15th century to promote equality. The kitchen uses 12,000 kg of flour, 2,000 kg of rice, 1,500 kg of dal, and 600 kg of ghee daily. Over 400 volunteers work in shifts. The assembly-line cooking and serving system has been studied by management schools worldwide for operational efficiency.",
    category: "CUISINE",
    region: "North India",
    state: "Punjab",
    funEmoji: "🍲",
    tone: "FORMAL_RESPECTFUL",
  },
  {
    dayOffset: 13,
    title: "India's Extreme Altitude Range",
    fact: "India's geography spans from -2 meters below sea level (Kuttanad, Kerala) to 8,586 meters above sea level (Kangchenjunga, Sikkim) — an altitude range of 8,588 meters within a single country, one of the most extreme on Earth.",
    detailedFact: "Kuttanad is one of the few places in the world where farming is done below sea level, using an elaborate system of dykes and canals. Kangchenjunga, meaning 'Five Treasures of Snow', is sacred to the Sikkimese people — climbers traditionally stop a few feet below the summit out of respect. Between these extremes, India contains every climate zone from alpine to tropical.",
    category: "GEOGRAPHY",
    region: "Pan India",
    state: null,
    funEmoji: "⛰️",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 14,
    title: "The Thar Desert's Magnetic Sand Dunes",
    fact: "The Thar Desert in Rajasthan is the world's most densely populated desert, home to 83 species of mammals, and its Sam Sand Dunes near Jaisalmer contain magnetic sand particles that confuse compasses.",
    detailedFact: "Unlike the Sahara, the Thar Desert supports a thriving ecosystem with 141 million people. The Desert National Park near Jaisalmer spans 3,162 sq km and preserves fossils of 180-million-year-old trees. The Jaisalmer Fort is the world's only living fort — one-quarter of the city's population still resides within its walls.",
    category: "GEOGRAPHY",
    region: "West India",
    state: "Rajasthan",
    funEmoji: "🏜️",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 15,
    title: "The World's Highest Motorable Road",
    fact: "Umling La Pass in Ladakh, at 19,024 feet (5,798 meters), is the world's highest motorable road — higher than Everest Base Camp and nearly at the cruising altitude of small aircraft.",
    detailedFact: "Constructed by the Border Roads Organisation (BRO), the road was completed in 2021 and connects Chisumle to Demchok near the India-China border. At this altitude, oxygen levels are approximately 50% of sea level, and temperatures can drop to -40°C in winter. The road surpassed Bolivia's previous record holder by over 300 feet.",
    category: "ADVENTURE",
    region: "North India",
    state: "Ladakh",
    funEmoji: "🛣️",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 16,
    title: "Valley of Flowers: Himalayan Botanical Paradise",
    fact: "The Valley of Flowers National Park in Uttarakhand contains over 600 species of flowering plants, including 31 rare and endangered species found nowhere else on Earth, blooming simultaneously in a kaleidoscopic alpine meadow.",
    detailedFact: "The valley was 'discovered' by British mountaineer Frank Smythe in 1931 after he lost his way returning from a Kamet expedition. At an altitude of 3,352–3,658 meters, the valley spans 87.5 sq km. The Brahma Kamal, Uttarakhand's state flower, blooms here only at night. UNESCO designated it a World Heritage Site alongside Nanda Devi National Park.",
    category: "ADVENTURE",
    region: "North India",
    state: "Uttarakhand",
    funEmoji: "🌺",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 17,
    title: "India Invented the Concept of the Hotel",
    fact: "India's Dharamshalas and Sarais — free roadside inns for travelers — date back to Emperor Ashoka's era (3rd century BCE), making India one of the earliest civilizations to institutionalize hospitality infrastructure for travelers.",
    detailedFact: "Ashoka established rest houses along the Uttarapatha (Grand Trunk Road) every 15 km. The Mughal emperor Sher Shah Suri expanded this system with 1,700 sarais. The concept directly influenced the modern hospitality industry. Today, the Taj Mahal Palace in Mumbai (1903) is one of Asia's most iconic luxury hotels, and India's hospitality sector contributes over 9% to GDP.",
    category: "HISTORY",
    region: "Pan India",
    state: null,
    funEmoji: "🏨",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 18,
    title: "The Grand Trunk Road: 2,500 Years of Travel",
    fact: "The Grand Trunk Road, stretching 2,500 km from Chittagong to Kabul, has been one of Asia's oldest and longest major roads for over 2,500 years — Rudyard Kipling called it 'a river of life as nowhere else exists in the world.'",
    detailedFact: "Originally built during the Maurya Empire (3rd century BCE), the road was significantly rebuilt by Sher Shah Suri in the 16th century. It connected the subcontinent's major cities and served as the primary trade route for millennia. Today, much of it forms part of the modern highway network across India, Pakistan, Bangladesh, and Afghanistan.",
    category: "HISTORY",
    region: "Pan India",
    state: null,
    funEmoji: "🛤️",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 19,
    title: "Chand Baori: The Deepest Stepwell",
    fact: "Chand Baori in Rajasthan is one of the deepest and largest stepwells in the world — 13 stories deep with 3,500 narrow steps arranged in a perfect geometric pattern, creating a visual illusion of infinite descent.",
    detailedFact: "Built in the 9th century by King Chanda of the Nikumbha dynasty, the stepwell extends 30 meters (100 feet) below ground. The temperature at the bottom is 5-6°C cooler than at the surface, making it a natural air conditioning system. It was featured in the films 'The Dark Knight Rises' and 'The Fall'. The geometric precision of the stairs is a masterclass in medieval Indian engineering.",
    category: "ARCHITECTURE",
    region: "West India",
    state: "Rajasthan",
    funEmoji: "🪜",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 20,
    title: "Mysore Palace Illuminated by 100,000 Bulbs",
    fact: "The Mysore Palace is illuminated every Sunday and during Dasara with exactly 97,000 light bulbs that are individually hand-checked and replaced, consuming 2,500 kW of electricity — making it one of India's most photographed monuments.",
    detailedFact: "Designed by British architect Henry Irwin in the Indo-Saracenic style, the current palace was completed in 1912 after the original wooden palace burned down. The interior features stained glass ceilings, carved mahogany doors, and a solid gold howdah (elephant saddle) weighing 750 kg. During Dasara, a grand procession features caparisoned elephants carrying the golden howdah through Mysore's streets.",
    category: "ARCHITECTURE",
    region: "South India",
    state: "Karnataka",
    funEmoji: "✨",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 21,
    title: "India: Birthplace of Four Major World Religions",
    fact: "India is the birthplace of four major world religions — Hinduism, Buddhism, Jainism, and Sikhism — collectively representing over 2 billion adherents worldwide, making it the single most religiously generative civilization in human history.",
    detailedFact: "Hinduism, the world's oldest organized religion, originated in the Indus Valley around 3000 BCE. Buddhism was founded by Siddhartha Gautama in Bodh Gaya around 500 BCE. Jainism traces its roots to the 24 Tirthankaras, with Mahavira (contemporaneous with Buddha). Sikhism was founded by Guru Nanak in Punjab in the 15th century. India also hosts significant Zoroastrian (Parsi), Jewish, and Christian communities.",
    category: "SPIRITUAL",
    region: "Pan India",
    state: null,
    funEmoji: "🙏",
    tone: "FORMAL_RESPECTFUL",
  },
  {
    dayOffset: 22,
    title: "Bodh Gaya: Where Buddhism Began",
    fact: "The Mahabodhi Temple in Bodh Gaya marks the exact spot where Siddhartha Gautama attained enlightenment under the Bodhi Tree around 528 BCE. The current tree is a direct descendant of the original, continuously cultivated for over 2,500 years.",
    detailedFact: "The Mahabodhi Temple Complex is a UNESCO World Heritage Site and one of the four holiest Buddhist pilgrimage sites. Emperor Ashoka built the first temple here in the 3rd century BCE. The Vajrasana (Diamond Throne) beneath the tree is considered the navel of the Earth in Buddhist cosmology. The site receives over 2 million visitors annually from across Asia.",
    category: "SPIRITUAL",
    region: "East India",
    state: "Bihar",
    funEmoji: "🌳",
    tone: "FORMAL_RESPECTFUL",
  },
  {
    dayOffset: 23,
    title: "Indian Railways: The World's Largest Employer",
    fact: "Indian Railways is the fourth-largest railway network in the world, operating 13,500 passenger trains daily across 68,000 km of track, and employs over 1.2 million people — making it one of Earth's largest civilian employers.",
    detailedFact: "The first passenger train in India ran on April 16, 1853, between Bombay and Thane. Today, Indian Railways carries 23 million passengers daily — equivalent to the entire population of Australia. The Vivek Express covers the longest route at 4,189 km from Dibrugarh to Kanyakumari. The Darjeeling Himalayan Railway ('Toy Train') is a UNESCO World Heritage Site.",
    category: "HISTORY",
    region: "Pan India",
    state: null,
    funEmoji: "🚂",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 24,
    title: "The Andaman Sea's Bioluminescent Beaches",
    fact: "Havelock Island (Swaraj Dweep) in the Andaman Islands features bioluminescent plankton that make the shoreline glow an ethereal blue at night — one of the rarest natural phenomena visible to tourists in South Asia.",
    detailedFact: "The bioluminescence is caused by dinoflagellates that emit light when disturbed by wave action. Radhanagar Beach on Havelock was voted 'Asia's Best Beach' by TIME magazine. The Andaman Islands have over 300 islands (only 37 inhabited) with some of the world's most pristine coral reefs, hosting over 1,200 species of marine life.",
    category: "GEOGRAPHY",
    region: "Island Territories",
    state: "Andaman & Nicobar Islands",
    funEmoji: "🌊",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 25,
    title: "Jaipur's Pink City Color Code",
    fact: "Every building in Jaipur's old city is painted the exact same shade of terracotta pink (Pantone 709) by municipal law — originally done in 1876 to welcome Prince Albert, and maintained for nearly 150 years since.",
    detailedFact: "Maharaja Ram Singh ordered the city painted pink as a gesture of hospitality, as pink symbolizes welcome in Rajput culture. The Hawa Mahal (Palace of Winds) with its 953 windows is the most iconic pink structure. UNESCO designated Jaipur's walled city as a World Heritage Site in 2019. The specific pigment is made from mixing red ochre with lime, a formula unchanged for centuries.",
    category: "ARCHITECTURE",
    region: "West India",
    state: "Rajasthan",
    funEmoji: "🩷",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 26,
    title: "Kerala's Zero-Waste Backwater Ecosystem",
    fact: "Kerala's 900 km backwater network supports the world's only houseboat tourism ecosystem entirely powered by traditional kettuvallam (rice barges), with some operators achieving near-zero carbon emissions through solar hybrid conversions.",
    detailedFact: "The backwaters are a chain of brackish lagoons and lakes lying parallel to the Arabian Sea coast. Alleppey (Alappuzha) is the hub, nicknamed 'Venice of the East'. Traditional kettuvallam boats are constructed entirely from anjili wood planks bound with coir ropes — not a single nail is used. The Nehru Trophy Boat Race features snake boats (chundan vallam) rowed by 105+ oarsmen.",
    category: "ADVENTURE",
    region: "South India",
    state: "Kerala",
    funEmoji: "🛶",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 27,
    title: "Ladakh's Magnetic Hill Illusion",
    fact: "On the Leh-Kargil highway at 14,000 feet, there's a stretch called 'Magnetic Hill' where vehicles appear to roll uphill on their own — an optical illusion so convincing that the Indian Air Force once studied it for possible magnetic anomalies.",
    detailedFact: "The phenomenon is actually a gravity hill optical illusion where the surrounding terrain creates a false horizon, making a slight downhill slope appear to be an uphill slope. The area is marked by a yellow signboard reading 'The Phenomenon That Defies Gravity.' Despite being debunked, it remains one of Ladakh's most visited attractions and a social media sensation.",
    category: "GEOGRAPHY",
    region: "North India",
    state: "Ladakh",
    funEmoji: "🧲",
    tone: "MEMES_FUNNY",
  },
  {
    dayOffset: 28,
    title: "Rann of Kutch: India's White Desert",
    fact: "The Rann of Kutch in Gujarat is one of the largest salt deserts in the world, spanning 30,000 sq km. During full moon nights, the white salt surface reflects moonlight so intensely that the entire desert appears to glow.",
    detailedFact: "The Great Rann was once part of the Arabian Sea and contains salt deposits up to 6 meters deep. The annual Rann Utsav festival (November-February) transforms this barren landscape into a cultural carnival with 400+ tents, folk performances, and handicraft exhibitions. The border with Pakistan runs through the Rann, and the BSF operates unique camel patrols here.",
    category: "GEOGRAPHY",
    region: "West India",
    state: "Gujarat",
    funEmoji: "🤍",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 29,
    title: "Majuli: The World's Largest River Island",
    fact: "Majuli in Assam is the world's largest river island, spanning 352 sq km in the Brahmaputra River. It's a living center of Vaishnavite culture with 22 Satras (monasteries) that have preserved traditional dance, music, and mask-making for over 500 years.",
    detailedFact: "Majuli is shrinking due to erosion — it was 1,250 sq km in 1853. Despite this, it became India's first island district in 2016. The Satras established by Srimanta Sankaradeva practice unique forms of neo-Vaishnavite art including Sattriya dance (now recognized as a classical Indian dance form), Bhaona (theatrical performances), and intricate mask-making representing deities and demons.",
    category: "CULTURE",
    region: "Northeast India",
    state: "Assam",
    funEmoji: "🏝️",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 30,
    title: "Cherrapunji's Record Rainfall",
    fact: "Mawsynram village near Cherrapunji in Meghalaya holds the Guinness World Record for the highest average annual rainfall — 11,872 mm (467 inches). In a single year (1861), Cherrapunji received 26,471 mm of rain, a record that still stands.",
    detailedFact: "Paradoxically, Cherrapunji faces water shortages in winter due to rapid runoff on its limestone substrate. The Khasi Hills' unique geography creates a 'funnel effect' that traps moisture-laden clouds from the Bay of Bengal. Locals have adapted with 'knups' — tortoise-shell-shaped bamboo rain shields — and the famous living root bridges that thrive in the constant moisture.",
    category: "GEOGRAPHY",
    region: "Northeast India",
    state: "Meghalaya",
    funEmoji: "🌧️",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 31,
    title: "Khajuraho's Candid Ancient Art",
    fact: "The Khajuraho temples display 646 erotic sculptures alongside 226 non-erotic ones — yet erotica represents only about 10% of the total artwork. The temples are primarily dedicated to Hindu and Jain deities, showcasing life in all its dimensions.",
    detailedFact: "Built between 950 and 1050 CE by the Chandela dynasty, originally 85 temples were constructed — only 25 survive. The sculptures follow the Kama Sutra's philosophy that kama (desire) is one of the four goals of Hindu life. The temples were lost in dense forest for centuries until 'rediscovered' by British engineer T.S. Burt in 1838. They became a UNESCO World Heritage Site in 1986.",
    category: "HERITAGE",
    region: "Central India",
    state: "Madhya Pradesh",
    funEmoji: "🏛️",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 32,
    title: "Coorg's Coffee Kingdom",
    fact: "India is the sixth-largest coffee producer in the world, and Coorg (Kodagu) in Karnataka produces 33% of India's total coffee output. Indian Monsooned Malabar coffee — deliberately exposed to monsoon winds — is a globally prized specialty.",
    detailedFact: "Coffee was introduced to India by Sufi saint Baba Budan who smuggled seven beans from Yemen in the 17th century. The hills where he planted them are still called 'Baba Budangiri.' India's coffee is unique because 80% is shade-grown under a canopy of native trees, making it inherently more sustainable. Chikmagalur district is known as the 'Coffee Land of India.'",
    category: "CUISINE",
    region: "South India",
    state: "Karnataka",
    funEmoji: "☕",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 33,
    title: "Nalanda: World's First Residential University",
    fact: "Nalanda University in Bihar, founded in 427 CE, was the world's first residential university — it housed 10,000 students and 2,000 teachers from across Asia, with a library so vast it burned for three months when destroyed in 1193 CE.",
    detailedFact: "The library, called Dharmaganja (Treasury of Truth), had three multi-story buildings: Ratnasagara, Ratnodadhi, and Ratnaranjaka. Students from China, Korea, Japan, Tibet, Mongolia, Turkey, Sri Lanka, and Southeast Asia studied here. Subjects included astronomy, mathematics, medicine, logic, and Buddhist philosophy. The ruins were excavated by Alexander Cunningham in 1861. A new Nalanda University was inaugurated in 2014.",
    category: "HISTORY",
    region: "East India",
    state: "Bihar",
    funEmoji: "📚",
    tone: "PROFESSIONAL_BUDDY",
  },
  {
    dayOffset: 34,
    title: "Sundarbans: Where Tigers Swim",
    fact: "The Sundarbans mangrove forest — shared between India and Bangladesh — is the only place on Earth where Bengal tigers are known to swim in saltwater, hunt in mangroves, and have adapted to an entirely aquatic lifestyle including eating fish and crabs.",
    detailedFact: "The Indian Sundarbans cover 4,200 sq km and contain 102 islands, of which 54 are inhabited. The Royal Bengal Tigers here have unique behavioral adaptations: they drink saline water, swim up to 8 km between islands, and are known man-eaters (locals wear face masks on the back of their heads as a deterrent). The mangroves act as a natural shield against cyclones.",
    category: "WILDLIFE",
    region: "East India",
    state: "West Bengal",
    funEmoji: "🐅",
    tone: "CASUAL_ENGAGING",
  },
  {
    dayOffset: 35,
    title: "Hampi's Singing Pillars",
    fact: "The 56 musical pillars of the Vittala Temple in Hampi produce distinct musical notes when tapped — the British attempted to cut two pillars to discover the secret and found them completely solid with no hidden mechanisms.",
    detailedFact: "The pillars are carved from different types of granite with varying compositions, densities, and thicknesses, creating different resonant frequencies. The main pillar (called SaReGaMa pillar) has smaller pillars clustered around it, each producing one of the seven notes of Indian classical music. The cut pillars, still visible with their cross-sections, proved the music is purely a function of stone engineering.",
    category: "ARCHITECTURE",
    region: "South India",
    state: "Karnataka",
    funEmoji: "🎵",
    tone: "CASUAL_ENGAGING",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: VISA METRICS — OUTBOUND (Indian Passport Holders)
// ═══════════════════════════════════════════════════════════════════════════════

const visaUpdatesOutbound = [
  {
    countryName: "Thailand",
    countryCode: "THA",
    flagEmoji: "🇹🇭",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: false,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    processingTimeDays: 0,
    validityDays: 60,
    maxStayDays: 60,
    multipleEntry: false,
    fee: 0,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Return ticket", "Proof of accommodation", "Proof of funds (20,000 THB or equivalent)"],
    documentsRequired: ["Passport", "Return flight ticket", "Hotel booking confirmation"],
    notes: "India-Thailand visa exemption allows 60-day stays. Extension possible at Thai Immigration for additional 30 days.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "United Arab Emirates",
    countryCode: "ARE",
    flagEmoji: "🇦🇪",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 60,
    maxStayDays: 30,
    multipleEntry: false,
    fee: 90,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Colored passport photo", "Confirmed return ticket", "Hotel booking", "Bank statement (3 months)"],
    documentsRequired: ["Passport copy", "Photo (white background)", "Flight itinerary", "Hotel voucher", "Bank statement"],
    notes: "Apply through UAE airlines (Emirates, FlyDubai, Etihad) or authorized travel agencies. Processing typically 3-4 business days.",
    isActive: true,
    arrivalCardRequired: false,
    yellowFeverRequired: false,
  },
  {
    countryName: "Singapore",
    countryCode: "SGP",
    flagEmoji: "🇸🇬",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 5,
    validityDays: 60,
    maxStayDays: 30,
    multipleEntry: true,
    fee: 30,
    feeCurrency: "SGD",
    requirements: ["Valid passport with 6 months validity", "SG Arrival Card (SGAC) submission", "Proof of funds", "Return ticket"],
    documentsRequired: ["Passport", "Form 14A", "Photo", "Cover letter", "Bank statement (3 months)", "Flight + hotel bookings"],
    notes: "Apply through authorized agents. Singapore requires electronic SG Arrival Card submission within 3 days before arrival.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Malaysia",
    countryCode: "MYS",
    flagEmoji: "🇲🇾",
    segment: "OUTBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 3,
    validityDays: 90,
    maxStayDays: 30,
    multipleEntry: false,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Return ticket", "Proof of accommodation", "Minimum USD 500 or equivalent"],
    documentsRequired: ["Passport bio page scan", "Digital photo", "Flight itinerary", "Accommodation proof"],
    notes: "eVisa and eNTRI (electronic travel registration) available. eNTRI is faster (24-48 hours) for stays up to 15 days.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Japan",
    countryCode: "JPN",
    flagEmoji: "🇯🇵",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 7,
    validityDays: 90,
    maxStayDays: 30,
    multipleEntry: false,
    fee: 0,
    feeCurrency: "USD",
    requirements: ["Valid passport", "Visit Japan Web registration", "Daily schedule/itinerary", "Proof of financial ability", "Return ticket"],
    documentsRequired: ["Passport", "Application form", "Photo", "Bank statement (6 months)", "ITR (3 years)", "Detailed day-wise itinerary", "Flight + hotel bookings"],
    notes: "Japan has introduced eVisa for Indian tourists. Single-entry tourist visa is free. Register on Visit Japan Web before arrival for smooth immigration.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "United Kingdom",
    countryCode: "GBR",
    flagEmoji: "🇬🇧",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    processingTimeDays: 21,
    validityDays: 180,
    maxStayDays: 180,
    multipleEntry: true,
    fee: 115,
    feeCurrency: "GBP",
    requirements: ["Valid passport", "Financial proof (bank statements)", "Employment/business proof", "Travel itinerary", "Accommodation details", "TB test certificate"],
    documentsRequired: ["Passport", "Online application (GOV.UK)", "Biometrics at VFS", "Bank statement (6 months)", "ITR (3 years)", "Employment letter", "TB screening"],
    notes: "Apply online at GOV.UK and book biometrics appointment at VFS Global. Standard processing 3 weeks. Priority (5 days) and Super Priority (24 hours) available at extra cost.",
    isActive: true,
    arrivalCardRequired: false,
    yellowFeverRequired: false,
  },
  {
    countryName: "United States",
    countryCode: "USA",
    flagEmoji: "🇺🇸",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    processingTimeDays: 45,
    validityDays: 3650,
    maxStayDays: 180,
    multipleEntry: true,
    fee: 185,
    feeCurrency: "USD",
    requirements: ["Valid passport", "DS-160 form", "Interview at US Embassy/Consulate", "Proof of ties to India", "Financial documents", "Travel purpose documentation"],
    documentsRequired: ["Passport (current + old)", "DS-160 confirmation", "Photo", "Bank statement (12 months)", "ITR (3 years)", "Property documents", "Employment proof"],
    notes: "B1/B2 tourist visa. Wait times for interview appointments vary by city (check ustraveldocs.com). Dropbox/interview waiver available for renewals. 10-year multiple entry visa standard.",
    isActive: true,
    arrivalCardRequired: false,
    yellowFeverRequired: false,
  },
  {
    countryName: "Schengen Area (France)",
    countryCode: "FRA",
    flagEmoji: "🇫🇷",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    processingTimeDays: 15,
    validityDays: 180,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 80,
    feeCurrency: "EUR",
    requirements: ["Valid passport (3 months beyond stay)", "Travel insurance (€30,000 coverage)", "Proof of accommodation", "Flight itinerary", "Financial means proof"],
    documentsRequired: ["Passport", "Schengen application form", "Biometrics at VFS/BLS", "Travel insurance", "Bank statement (3 months)", "ITR", "Cover letter", "Flight + hotel"],
    notes: "Apply at the embassy of your primary destination country. Schengen visa covers 27 European countries. 90/180-day rule applies. Apply 3-6 months before travel.",
    isActive: true,
    arrivalCardRequired: false,
    yellowFeverRequired: false,
  },
  {
    countryName: "Australia",
    countryCode: "AUS",
    flagEmoji: "🇦🇺",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 25,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 190,
    feeCurrency: "AUD",
    requirements: ["Valid passport", "Health insurance", "Character requirements", "Genuine temporary entrant", "Financial capacity proof"],
    documentsRequired: ["Passport", "Online application (ImmiAccount)", "Photo", "Bank statement (6 months)", "ITR (2 years)", "Employment letter", "Travel itinerary"],
    notes: "Subclass 600 visitor visa. Apply online through ImmiAccount. Processing times vary (25-40 days). Health examination may be required for stays over 3 months.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Maldives",
    countryCode: "MDV",
    flagEmoji: "🇲🇻",
    segment: "OUTBOUND",
    visaType: "VISA_ON_ARRIVAL",
    isVisaRequired: false,
    isVisaOnArrival: true,
    isEVisaAvailable: false,
    processingTimeDays: 0,
    validityDays: 30,
    maxStayDays: 30,
    multipleEntry: false,
    fee: 0,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Confirmed hotel booking", "Return ticket", "Sufficient funds for the stay"],
    documentsRequired: ["Passport", "Hotel reservation", "Return flight ticket"],
    notes: "Free visa on arrival for 30 days for Indian passport holders. Traveller Declaration must be filled on imuga.immigration.gov.mv within 96 hours before arrival.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Sri Lanka",
    countryCode: "LKA",
    flagEmoji: "🇱🇰",
    segment: "OUTBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 1,
    validityDays: 30,
    maxStayDays: 30,
    multipleEntry: false,
    fee: 50,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Return ticket", "Proof of sufficient funds"],
    documentsRequired: ["Passport", "ETA application online", "Return ticket"],
    notes: "Electronic Travel Authorization (ETA) required. Apply online at eta.gov.lk. Can also be obtained on arrival but online is strongly recommended.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Nepal",
    countryCode: "NPL",
    flagEmoji: "🇳🇵",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: false,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    processingTimeDays: 0,
    validityDays: 0,
    maxStayDays: 0,
    multipleEntry: true,
    fee: 0,
    feeCurrency: "USD",
    requirements: ["Valid Indian passport or Voter ID", "No visa required for Indian nationals"],
    documentsRequired: ["Passport or Voter ID card"],
    notes: "Indian citizens do not need a visa to enter Nepal. Entry allowed with valid passport or Voter ID. No duration limit on stay. INR accepted nationwide (except ₹500 and ₹2000 notes).",
    isActive: true,
    arrivalCardRequired: false,
    yellowFeverRequired: false,
  },
  {
    countryName: "Bhutan",
    countryCode: "BTN",
    flagEmoji: "🇧🇹",
    segment: "OUTBOUND",
    visaType: "TOURIST",
    isVisaRequired: false,
    isVisaOnArrival: false,
    isEVisaAvailable: false,
    processingTimeDays: 0,
    validityDays: 0,
    maxStayDays: 0,
    multipleEntry: true,
    fee: 0,
    feeCurrency: "USD",
    requirements: ["Valid Indian passport or Voter ID", "Permit for areas beyond Thimphu and Paro"],
    documentsRequired: ["Passport or Voter ID", "2 passport-size photos for permits beyond Thimphu/Paro"],
    notes: "Indian nationals do not require a visa. The Sustainable Development Fee (SDF) of USD 100/night is waived for Indian, Bangladeshi, and Maldivian nationals. Entry via Phuentsholing or Paro airport.",
    isActive: true,
    arrivalCardRequired: false,
    yellowFeverRequired: false,
  },
  {
    countryName: "Indonesia",
    countryCode: "IDN",
    flagEmoji: "🇮🇩",
    segment: "OUTBOUND",
    visaType: "VISA_ON_ARRIVAL",
    isVisaRequired: true,
    isVisaOnArrival: true,
    isEVisaAvailable: true,
    processingTimeDays: 0,
    validityDays: 30,
    maxStayDays: 30,
    multipleEntry: false,
    fee: 35,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Return ticket", "Proof of accommodation"],
    documentsRequired: ["Passport", "Return ticket", "Visa on Arrival fee payment"],
    notes: "Visa on Arrival available at major airports (Bali, Jakarta). Extendable once for 30 days. e-VOA available at molina.imigrasi.go.id for faster processing. Payment in IDR or major currencies.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Turkey",
    countryCode: "TUR",
    flagEmoji: "🇹🇷",
    segment: "OUTBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 1,
    validityDays: 180,
    maxStayDays: 30,
    multipleEntry: true,
    fee: 50,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Return ticket", "Proof of accommodation", "Sufficient financial means"],
    documentsRequired: ["Passport", "e-Visa from evisa.gov.tr", "Hotel booking", "Return ticket"],
    notes: "Apply for e-Visa at evisa.gov.tr. Approved instantly in most cases. Must have a valid Schengen, US, UK, or Ireland visa/residence permit, OR apply through a Turkish embassy.",
    isActive: true,
    arrivalCardRequired: false,
    yellowFeverRequired: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: VISA METRICS — INBOUND (Foreign Nationals Entering India)
// ═══════════════════════════════════════════════════════════════════════════════

const visaUpdatesInbound = [
  {
    countryName: "United States",
    countryCode: "USA",
    flagEmoji: "🇺🇸",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket"],
    documentsRequired: ["Passport scan", "Digital photo (2x2 inches)", "Credit/debit card for fee payment"],
    notes: "India e-Visa available in 3 categories: e-Tourist (30-day, 1-year, 5-year), e-Business, e-Medical. Apply at indianvisaonline.gov.in. 28 designated airports and 5 seaports accept e-Visa.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "United Kingdom",
    countryCode: "GBR",
    flagEmoji: "🇬🇧",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket"],
    documentsRequired: ["Passport scan", "Digital photo", "Credit/debit card"],
    notes: "Same e-Visa portal: indianvisaonline.gov.in. UK nationals eligible for all e-Visa categories including 5-year e-Tourist visa with 90 days per visit.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Germany",
    countryCode: "DEU",
    flagEmoji: "🇩🇪",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket"],
    documentsRequired: ["Passport scan", "Digital photo", "Credit/debit card"],
    notes: "German nationals eligible for India e-Visa. Separate e-Conference visa available for business events and conferences in India.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "France",
    countryCode: "FRA",
    flagEmoji: "🇫🇷",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket"],
    documentsRequired: ["Passport scan", "Digital photo", "Credit/debit card"],
    notes: "France is one of the top source countries for tourism to India, especially for heritage and cultural circuits. e-Tourist visa valid at 28 airports.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Australia",
    countryCode: "AUS",
    flagEmoji: "🇦🇺",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket", "Yellow fever vaccination certificate if arriving from endemic country"],
    documentsRequired: ["Passport scan", "Digital photo", "Credit/debit card"],
    notes: "Australian nationals also eligible for Visa on Arrival at designated airports. e-Visa recommended for smoother processing.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: true,
  },
  {
    countryName: "Japan",
    countryCode: "JPN",
    flagEmoji: "🇯🇵",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket"],
    documentsRequired: ["Passport scan", "Digital photo", "Credit/debit card"],
    notes: "Japan is one of the fastest-growing source markets for India tourism. e-Visa covers Wellness/Ayurveda tourism circuits.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "Canada",
    countryCode: "CAN",
    flagEmoji: "🇨🇦",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket"],
    documentsRequired: ["Passport scan", "Digital photo", "Credit/debit card"],
    notes: "Large Indian diaspora in Canada drives significant VFR (Visiting Friends and Relatives) traffic. e-Visa simplifies repeat visits.",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
  {
    countryName: "South Korea",
    countryCode: "KOR",
    flagEmoji: "🇰🇷",
    segment: "INBOUND",
    visaType: "E_VISA",
    isVisaRequired: true,
    isVisaOnArrival: false,
    isEVisaAvailable: true,
    processingTimeDays: 4,
    validityDays: 365,
    maxStayDays: 90,
    multipleEntry: true,
    fee: 25,
    feeCurrency: "USD",
    requirements: ["Valid passport with 6 months validity", "Digital photo", "Return ticket"],
    documentsRequired: ["Passport scan", "Digital photo", "Credit/debit card"],
    notes: "Growing K-tourism influence is driving increased Korean visitor interest in India's Buddhist circuit (Bodh Gaya, Sarnath, Rajgir).",
    isActive: true,
    arrivalCardRequired: true,
    yellowFeverRequired: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: SAMPLE TRAVEL ADVISORIES
// ═══════════════════════════════════════════════════════════════════════════════

const travelAdvisories = [
  {
    slug: "india-monsoon-advisory-2026",
    title: "India Monsoon Season Travel Advisory",
    countryName: "India",
    countryCode: "IND",
    segment: "INBOUND",
    advisoryLevel: "LEVEL_2_EXERCISE_INCREASED",
    summary: "Tourism in Jammu & Kashmir is open with enhanced security measures. Travelers should register with local authorities and maintain awareness of advisories for specific districts.",
    details: "Popular tourist destinations including Srinagar, Gulmarg, Pahalgam, and Sonamarg are operating normally with robust tourism infrastructure. The Amarnath Yatra requires separate registration. Tourists should carry valid ID at all times. Some border areas require Inner Line Permits. Mobile internet services may face intermittent restrictions. Adventure tourism operators must be registered with J&K Tourism Department.",
    affectedRegions: ["Kashmir Valley", "Border districts", "LoC areas"],
    issuedBy: "Ministry of Home Affairs",
    issuedAt: new Date("2026-04-01"),
    effectiveFrom: new Date("2026-04-01"),
    effectiveUntil: null,
    isActive: true,
    healthRisks: ["Altitude sickness above 3,500m", "Cold weather injuries in winter"],
    securityRisks: ["Enhanced security zones", "Occasional communication restrictions"],
    localLaws: "Photography restrictions near military installations. Special permits required for Leh-Manali highway segments. Foreign nationals must register at FRRO within 14 days.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: GOVERNMENT UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

const governmentUpdates = [
  {
    slug: "swadesh-darshan-2-scheme-2026",
    title: "Swadesh Darshan 2.0 — Sustainable & Responsible Tourism Circuits",
    summary: "The Ministry of Tourism has expanded Swadesh Darshan 2.0 to 76 districts across India, focusing on sustainable, responsible, and experiential tourism development with an emphasis on community-based tourism models.",
    content: "Building on the original Swadesh Darshan scheme launched in 2014, the 2.0 version shifts focus from infrastructure development to holistic destination management. Key features include: (1) Challenge-based selection of districts, (2) Focus on local community employment generation, (3) Integration of digital tourism technologies, (4) Sustainable waste management at tourist sites, (5) Development of homestay networks, (6) Capacity building for local guides and artisans. The scheme allocates funding based on district readiness and private sector participation.",
    updateType: "SCHEME",
    ministry: "Ministry of Tourism",
    impactedSegments: ["INBOUND", "DOMESTIC"],
    impactedStates: ["Pan India"],
    budgetAllocation: 1500,
    budgetCurrency: "INR",
    isActive: true,
    isMajor: true,
    publishedAt: new Date("2026-01-26"),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: TRAVEL ALERTS
// ═══════════════════════════════════════════════════════════════════════════════

const travelAlerts = [
  {
    slug: "delhi-aqi-winter-alert-2026",
    title: "Delhi NCR Air Quality Health Advisory",
    message: "Delhi NCR region experiencing 'Severe' category air quality (AQI 400+). Travelers with respiratory conditions should consider rescheduling visits. N95 masks recommended for outdoor activities. GRAP Stage III restrictions in effect — construction banned, vehicle restrictions active.",
    severity: "WARNING",
    alertCategory: "HEALTH",
    segment: "INBOUND",
    affectedCountry: "India",
    countryCode: "IND",
    affectedRegions: ["Delhi", "NCR", "Gurgaon", "Noida", "Ghaziabad", "Faridabad"],
    affectedCities: ["New Delhi", "Gurgaon", "Noida"],
    issuedBy: "Central Pollution Control Board",
    isActive: true,
    isResolved: false,
    latitude: 28.6139,
    longitude: 77.2090,
    radiusKm: 80,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: EXCHANGE RATES (Base: INR)
// ═══════════════════════════════════════════════════════════════════════════════

const exchangeRates = [
  { baseCurrency: "INR", targetCurrency: "USD", rate: 0.01186, inverseRate: 84.32 },
  { baseCurrency: "INR", targetCurrency: "EUR", rate: 0.01089, inverseRate: 91.82 },
  { baseCurrency: "INR", targetCurrency: "GBP", rate: 0.00937, inverseRate: 106.72 },
  { baseCurrency: "INR", targetCurrency: "AED", rate: 0.04356, inverseRate: 22.96 },
  { baseCurrency: "INR", targetCurrency: "SGD", rate: 0.01585, inverseRate: 63.09 },
  { baseCurrency: "INR", targetCurrency: "THB", rate: 0.40700, inverseRate: 2.457 },
  { baseCurrency: "INR", targetCurrency: "MYR", rate: 0.05260, inverseRate: 19.01 },
  { baseCurrency: "INR", targetCurrency: "JPY", rate: 1.82000, inverseRate: 0.5495 },
  { baseCurrency: "INR", targetCurrency: "AUD", rate: 0.01810, inverseRate: 55.25 },
  { baseCurrency: "INR", targetCurrency: "CAD", rate: 0.01620, inverseRate: 61.73 },
  { baseCurrency: "INR", targetCurrency: "CHF", rate: 0.01051, inverseRate: 95.15 },
  { baseCurrency: "INR", targetCurrency: "LKR", rate: 3.56000, inverseRate: 0.2809 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED DATA: GLOBAL FESTIVALS & EVENTS (Upcoming Travel Alerts)
// ═══════════════════════════════════════════════════════════════════════════════

const globalEvents = [
  // ── Events near current date (June 21, 2026) for immediate visibility ─
  {
    slug: "international-yoga-day-2026",
    name: "International Yoga Day",
    description: "Celebrated worldwide on June 21, millions gather at iconic landmarks for mass yoga sessions. India hosts the largest gatherings at sites like Mysore Palace, Rishikesh ghats, and Rajpath in New Delhi.",
    location: "Worldwide (originated in India)",
    country: "India",
    countryCode: "IND",
    flagEmoji: "🇮🇳",
    startDate: new Date("2026-06-21"),
    endDate: new Date("2026-06-21"),
    category: "CULTURAL",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "rath-yatra-puri-2026",
    name: "Rath Yatra — Puri",
    description: "One of the oldest and grandest Hindu festivals, where colossal chariots carrying deities of Lord Jagannath, Balabhadra, and Subhadra are pulled through the streets of Puri by millions of devotees.",
    location: "Puri, Odisha",
    country: "India",
    countryCode: "IND",
    flagEmoji: "🇮🇳",
    startDate: new Date("2026-06-23"),
    endDate: new Date("2026-07-02"),
    category: "RELIGIOUS",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "san-juan-festival-2026",
    name: "San Juan Festival",
    description: "Spain's spectacular midsummer celebration with bonfires on the beach, fireworks, and all-night revelry. Barcelona's beaches transform into a massive open-air party as locals leap over flames at midnight.",
    location: "Barcelona, Spain",
    country: "Spain",
    countryCode: "ESP",
    flagEmoji: "🇪🇸",
    startDate: new Date("2026-06-23"),
    endDate: new Date("2026-06-24"),
    category: "CULTURAL",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "st-jean-baptiste-day-2026",
    name: "Saint-Jean-Baptiste Day",
    description: "Quebec's national holiday featuring grand parades, live music, bonfires, and fireworks across Montreal and Quebec City. A vibrant celebration of French-Canadian culture and heritage.",
    location: "Quebec, Canada",
    country: "Canada",
    countryCode: "CAN",
    flagEmoji: "🇨🇦",
    startDate: new Date("2026-06-24"),
    endDate: new Date("2026-06-24"),
    category: "CULTURAL",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "glastonbury-festival-2026",
    name: "Glastonbury Festival",
    description: "The world's most iconic music and performing arts festival held on 900 acres of English farmland. Featuring headliners across the Pyramid Stage, it draws 200,000+ attendees for five days of music, art, and culture.",
    location: "Somerset, England",
    country: "United Kingdom",
    countryCode: "GBR",
    flagEmoji: "🇬🇧",
    startDate: new Date("2026-06-24"),
    endDate: new Date("2026-06-28"),
    category: "MUSIC",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "full-moon-party-jun-2026",
    name: "Full Moon Party",
    description: "Thailand's legendary all-night beach party on Haad Rin beach. Tens of thousands of travelers dance to fire shows, neon body paint, and pulsating electronic music under the full moon.",
    location: "Koh Phangan, Thailand",
    country: "Thailand",
    countryCode: "THA",
    flagEmoji: "🇹🇭",
    startDate: new Date("2026-06-25"),
    endDate: new Date("2026-06-25"),
    category: "MUSIC",
    isRecurring: true,
    isActive: true,
  },

  // ── Major global festivals (rest of 2026) ────────────────────────────
  {
    slug: "tomorrowland-2026",
    name: "Tomorrowland",
    description: "The world's premier electronic dance music festival, set in the magical grounds of De Schorre park. Featuring breathtaking stage designs, 400+ DJs, and visitors from 200+ countries across two weekends.",
    location: "Boom, Belgium",
    country: "Belgium",
    countryCode: "BEL",
    flagEmoji: "🇧🇪",
    startDate: new Date("2026-07-17"),
    endDate: new Date("2026-07-26"),
    category: "MUSIC",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "la-tomatina-2026",
    name: "La Tomatina",
    description: "The world's largest food fight! Over 20,000 participants hurl 120 tonnes of overripe tomatoes at each other in the streets of Buñol. An hour of pure, chaotic, tomato-drenched joy.",
    location: "Buñol, Valencia, Spain",
    country: "Spain",
    countryCode: "ESP",
    flagEmoji: "🇪🇸",
    startDate: new Date("2026-08-26"),
    endDate: new Date("2026-08-26"),
    category: "FOOD",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "oktoberfest-2026",
    name: "Oktoberfest",
    description: "Munich's legendary 16-day beer festival attracting 6 million+ visitors annually. Giant beer tents, traditional Bavarian music, lederhosen, dirndls, and the finest German cuisine and craft beer.",
    location: "Munich, Germany",
    country: "Germany",
    countryCode: "DEU",
    flagEmoji: "🇩🇪",
    startDate: new Date("2026-09-19"),
    endDate: new Date("2026-10-04"),
    category: "CULTURAL",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "diwali-2026",
    name: "Diwali — Festival of Lights",
    description: "India's grandest celebration illuminating the entire subcontinent with billions of oil lamps, fireworks, and rangoli. Homes, temples, and public spaces glow as families celebrate the triumph of light over darkness.",
    location: "Pan-India",
    country: "India",
    countryCode: "IND",
    flagEmoji: "🇮🇳",
    startDate: new Date("2026-10-20"),
    endDate: new Date("2026-10-24"),
    category: "RELIGIOUS",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "christmas-worldwide-2026",
    name: "Christmas & Holiday Markets",
    description: "From Vienna's Christkindlmarkt to New York's Rockefeller Center, the global holiday season brings enchanting Christmas markets, light displays, carol concerts, and winter festivities across every continent.",
    location: "Worldwide",
    country: "Worldwide",
    countryCode: "WLD",
    flagEmoji: "🎄",
    startDate: new Date("2026-12-20"),
    endDate: new Date("2026-12-26"),
    category: "CULTURAL",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "rio-carnival-2026",
    name: "Rio Carnival",
    description: "The world's biggest carnival, where 2 million+ revelers fill Rio's streets daily for five days of samba parades, elaborate costumes, and non-stop celebration at the legendary Sambadrome.",
    location: "Rio de Janeiro, Brazil",
    country: "Brazil",
    countryCode: "BRA",
    flagEmoji: "🇧🇷",
    startDate: new Date("2026-02-13"),
    endDate: new Date("2026-02-18"),
    category: "CULTURAL",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "holi-2026",
    name: "Holi — Festival of Colors",
    description: "India's most exuberant spring festival, where streets transform into rainbows as millions throw colored powders, drench each other with water guns, and celebrate with bhang thandai and gujiya sweets.",
    location: "Pan-India (epicenter: Mathura & Vrindavan)",
    country: "India",
    countryCode: "IND",
    flagEmoji: "🇮🇳",
    startDate: new Date("2026-03-10"),
    endDate: new Date("2026-03-11"),
    category: "RELIGIOUS",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "ultra-music-festival-2026",
    name: "Ultra Music Festival",
    description: "Miami's premier electronic music festival at Bayfront Park, featuring massive LED stages, world-class DJs, and 170,000+ attendees across three days of cutting-edge electronic music.",
    location: "Miami, Florida, USA",
    country: "United States",
    countryCode: "USA",
    flagEmoji: "🇺🇸",
    startDate: new Date("2026-03-27"),
    endDate: new Date("2026-03-29"),
    category: "MUSIC",
    isRecurring: true,
    isActive: true,
  },
  {
    slug: "pongal-2026",
    name: "Pongal — Tamil Harvest Festival",
    description: "Tamil Nadu's four-day harvest thanksgiving celebrated with boiling rice in decorated pots, kolam art, Jallikattu bull-taming, and vibrant cultural performances honoring the Sun God and farm life.",
    location: "Tamil Nadu, India",
    country: "India",
    countryCode: "IND",
    flagEmoji: "🇮🇳",
    startDate: new Date("2026-01-14"),
    endDate: new Date("2026-01-17"),
    category: "CULTURAL",
    isRecurring: true,
    isActive: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SEED RUNNER
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log("🌍 TravelPulse India — Database Seed Script");
  console.log("━".repeat(60));

  try {
    // ── 1. Seed News Sources ──────────────────────────────────────────────
    console.log("\n📰 Seeding news sources...");
    let sourceCount = 0;
    for (const source of newsSources) {
      await prisma.newsSource.upsert({
        where: { slug: source.slug },
        update: { ...source },
        create: { ...source },
      });
      sourceCount++;
    }
    console.log(`   ✅ ${sourceCount} news sources seeded`);

    // ── 2. Seed Categories ────────────────────────────────────────────────
    console.log("\n📂 Seeding categories...");
    let categoryCount = 0;
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { ...cat },
        create: { ...cat },
      });
      categoryCount++;
    }
    console.log(`   ✅ ${categoryCount} categories seeded`);

    // ── 3. Seed Tags ──────────────────────────────────────────────────────
    console.log("\n🏷️  Seeding tags...");
    let tagCount = 0;
    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: { name: tag.name },
        create: { ...tag },
      });
      tagCount++;
    }
    console.log(`   ✅ ${tagCount} tags seeded`);

    // ── 4. Seed Daily Facts (Indian Tourism Days) ─────────────────────────
    console.log("\n🇮🇳 Seeding Indian tourism daily facts (365 days)...");
    let factCount = 0;
    const baseDate = new Date("2026-01-01");
    
    // Cycle through base facts to seed exactly 365 days of travel data programmatically
    for (let i = 0; i < 365; i++) {
      const factDate = new Date(baseDate);
      factDate.setDate(factDate.getDate() + i);

      const baseFact = dailyFacts[i % dailyFacts.length];
      const { dayOffset, ...rest } = baseFact;
      
      await prisma.dailyFact.upsert({
        where: { factDate },
        update: {
          ...rest,
          category: rest.category as any,
          tone: rest.tone as any,
        },
        create: {
          ...rest,
          category: rest.category as any,
          tone: rest.tone as any,
          factDate,
          isPublished: true,
        },
      });
      factCount++;
    }
    console.log(`   ✅ ${factCount} daily facts seeded across the entire year of 2026`);

    // ── 5. Seed Visa Updates — Outbound ───────────────────────────────────
    console.log("\n🛂 Seeding outbound visa metrics (Indian passport holders)...");
    let outboundVisaCount = 0;
    for (const visa of visaUpdatesOutbound) {
      const slug = `outbound-${visa.countryCode.toLowerCase()}-${visa.visaType.toLowerCase().replace(/_/g, "-")}`;
      await prisma.visaUpdate.upsert({
        where: {
          countryCode_segment_visaType: {
            countryCode: visa.countryCode,
            segment: visa.segment as any,
            visaType: visa.visaType as any,
          },
        },
        update: {
          ...visa,
          segment: visa.segment as any,
          visaType: visa.visaType as any,
          slug,
        },
        create: {
          ...visa,
          segment: visa.segment as any,
          visaType: visa.visaType as any,
          slug,
        },
      });
      outboundVisaCount++;
    }
    console.log(`   ✅ ${outboundVisaCount} outbound visa records seeded`);

    // ── 6. Seed Visa Updates — Inbound ────────────────────────────────────
    console.log("\n🛬 Seeding inbound visa metrics (foreign nationals entering India)...");
    let inboundVisaCount = 0;
    for (const visa of visaUpdatesInbound) {
      const slug = `inbound-${visa.countryCode.toLowerCase()}-${visa.visaType.toLowerCase().replace(/_/g, "-")}`;
      await prisma.visaUpdate.upsert({
        where: {
          countryCode_segment_visaType: {
            countryCode: visa.countryCode,
            segment: visa.segment as any,
            visaType: visa.visaType as any,
          },
        },
        update: {
          ...visa,
          segment: visa.segment as any,
          visaType: visa.visaType as any,
          slug,
        },
        create: {
          ...visa,
          segment: visa.segment as any,
          visaType: visa.visaType as any,
          slug,
        },
      });
      inboundVisaCount++;
    }
    console.log(`   ✅ ${inboundVisaCount} inbound visa records seeded`);

    // ── 7. Seed Travel Advisories ─────────────────────────────────────────
    console.log("\n⚠️  Seeding travel advisories...");
    let advisoryCount = 0;
    for (const advisory of travelAdvisories) {
      await prisma.travelAdvisory.upsert({
        where: { slug: advisory.slug },
        update: {
          ...advisory,
          segment: advisory.segment as any,
          advisoryLevel: advisory.advisoryLevel as any,
        },
        create: {
          ...advisory,
          segment: advisory.segment as any,
          advisoryLevel: advisory.advisoryLevel as any,
        },
      });
      advisoryCount++;
    }
    console.log(`   ✅ ${advisoryCount} travel advisories seeded`);

    // ── 8. Seed Government Updates ────────────────────────────────────────
    console.log("\n🏛️  Seeding government updates...");
    let govCount = 0;
    for (const update of governmentUpdates) {
      await prisma.governmentUpdate.upsert({
        where: { slug: update.slug },
        update: {
          ...update,
          updateType: update.updateType as any,
          impactedSegments: update.impactedSegments as any,
        },
        create: {
          ...update,
          updateType: update.updateType as any,
          impactedSegments: update.impactedSegments as any,
        },
      });
      govCount++;
    }
    console.log(`   ✅ ${govCount} government updates seeded`);

    // ── 9. Seed Travel Alerts ─────────────────────────────────────────────
    console.log("\n🚨 Seeding travel alerts...");
    let alertCount = 0;
    for (const alert of travelAlerts) {
      await prisma.travelAlert.upsert({
        where: { slug: alert.slug },
        update: {
          ...alert,
          severity: alert.severity as any,
          alertCategory: alert.alertCategory as any,
          segment: alert.segment as any,
        },
        create: {
          ...alert,
          severity: alert.severity as any,
          alertCategory: alert.alertCategory as any,
          segment: alert.segment as any,
        },
      });
      alertCount++;
    }
    console.log(`   ✅ ${alertCount} travel alerts seeded`);

    // ── 10. Seed Exchange Rates ───────────────────────────────────────────
    console.log("\n💱 Seeding exchange rates...");
    let rateCount = 0;
    const fetchedAt = new Date();
    for (const rate of exchangeRates) {
      await prisma.exchangeRate.upsert({
        where: {
          baseCurrency_targetCurrency_fetchedAt: {
            baseCurrency: rate.baseCurrency,
            targetCurrency: rate.targetCurrency,
            fetchedAt,
          },
        },
        update: { rate: rate.rate, inverseRate: rate.inverseRate },
        create: { ...rate, fetchedAt },
      });
      rateCount++;
    }
    console.log(`   ✅ ${rateCount} exchange rates seeded`);

    // ── 11. Seed Global Events (Festivals & Upcoming Alerts) ──────────────
    console.log("\n🎉 Seeding global festivals & events...");
    let eventCount = 0;
    for (const event of globalEvents) {
      await prisma.globalEvent.upsert({
        where: { slug: event.slug },
        update: { ...event },
        create: { ...event },
      });
      eventCount++;
    }
    console.log(`   ✅ ${eventCount} global events seeded`);

    // ── Summary ───────────────────────────────────────────────────────────
    console.log("\n" + "━".repeat(60));
    console.log("🎉 TravelPulse India seed completed successfully!");
    console.log("━".repeat(60));
    console.log(`   📰 News Sources:       ${sourceCount}`);
    console.log(`   📂 Categories:         ${categoryCount}`);
    console.log(`   🏷️  Tags:              ${tagCount}`);
    console.log(`   🇮🇳 Daily Facts:        ${factCount}`);
    console.log(`   🛂 Outbound Visas:     ${outboundVisaCount}`);
    console.log(`   🛬 Inbound Visas:      ${inboundVisaCount}`);
    console.log(`   ⚠️  Advisories:         ${advisoryCount}`);
    console.log(`   🏛️  Gov Updates:        ${govCount}`);
    console.log(`   🚨 Travel Alerts:      ${alertCount}`);
    console.log(`   💱 Exchange Rates:     ${rateCount}`);
    console.log(`   🎉 Global Events:      ${eventCount}`);
    console.log("━".repeat(60));
  } catch (error) {
    console.error("\n❌ Seed failed with error:");
    console.error(error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Clean up native pg pool
  });
