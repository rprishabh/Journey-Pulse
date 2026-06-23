# Journey Pulse — Architectural Whitepaper & Master Document

Journey Pulse is a premium, interactive, 3D travel intelligence portal and visa compliance tracker. Built specifically for modern travelers, it aggregates real-time regulatory news, visa requirements, travel advisories, regional updates, and cultural insights into a high-fidelity visual experience.

This document serves as the master whitepaper outlining the **Core Vision**, **Technical Architecture**, **Data Pipelines**, **Visual & Interaction Engineering**, and **Development Guidelines** for the platform.

---

## 1. Executive Summary & Vision

Traditional travel portals are either static tables of government rules or ad-heavy booking flows. **Journey Pulse** transforms travel intelligence into a cinematic, story-driven narrative. 

By combining real-time RSS scraper pipelines, a robust database caching layer, and cutting-edge 3D WebGL visualizations, the platform offers users a comprehensive travel radar. It answers critical questions:
- *Can I travel to this country visa-free with an Indian passport right now?*
- *What are the active security, weather, or health hazards in my destination?*
- *What local seasonal events or historical traditions are active right now?*
- *What are the latest government-sponsored tourism schemes and wellness retreats?*

---

## 2. Platform Architecture Overview

Journey Pulse is built as a unified, modern web application using a decoupled component structure with dynamic server-side API endpoints:

```mermaid
graph TD
  User[User Browser] -->|Interacts| UI[Next.js Client Components]
  UI -->|Requests| API[Next.js App Router API Routes]
  API -->|Queries| Prisma[Prisma Client / Query Builder]
  Prisma -->|Reads / Writes| DB[(PostgreSQL Database / Neon)]
  Cron[News Scrapers / RSS Workers] -->|Cron Runs| API
  API -->|Syncs / Seeds| DB
```

---

## 3. High-Fidelity Features

### 3.1. Outbound Visa Authority & Vector Maps
Provides Indian passport holders with an instant lookup directory of visa requirements.
- **Interactive Choropleth Map (`VisaMap`)**: Renders a vector-based global map of outbound visa rules (Visa-Free, e-Visa, Visa on Arrival, or Visa Required).
- **Comparison Engine**: Allows travelers to compare visa requirements and stay metrics side-by-side.
- **Checked Lists**: Displays official documentation requirements, application portal redirections, and processing wait times.

### 3.2. 3D Advisories Globe & Hazard Radar
- **WebGL Interactive Globe (`AdvisoriesGlobe`)**: Renders a 3D Earth using `react-globe.gl` displaying pulsing spatial coordinates.
- **Geopolitical Security Warnings**: Fetches active advisories from travel authorities and plots them visually. Clicking on coordinates reveals detailed warnings, local restrictions, and emergency contact details.

### 3.3. Real-Time Fact Engine ("Today in Travel" Postcard)
- **Timezone Date Synchronization**: Automatically detects client-side calendar date and queries `/api/travel/daily-fact?date=YYYY-MM-DD` to ensure calendar-matched obscure facts are shown.
- **In-Memory Caching**: Leverages a fast `Map`-based memory cache to serve requests instantly, eliminating redundant database operations.
- **Responsive 3D Tilt**: A premium, spring-driven hover effect reacts to real-time mouse movements on the card container, with a snappy, hardware-accelerated 3D flip card mechanism.
- **Passport Stamps & Aesthetics**: Styled as an editorial magazine page with vector entry/exit postmark stamps.

### 3.4. Global Event & Festival Alerts
- **Lookahead Windowing**: Automatically filters global cultural, music, and sports festivals occurring within a 7-day window.
- **Auto-Rotation**: Events automatically expire and disappear from the UI once they end, keeping the interface uncluttered.

### 3.5. Government Policy & Initiatives Rail
- **Policy Tracking**: Highlights national projects (e.g., Swadesh Darshan 2.0, PRASHAD Scheme, Dekho Apna Desh, Vibrant Villages Program) with their respective budget allocations, sponsoring ministries, and direct redirection to official government portals.

### 3.6. Luxury Wellness Directory
- **Ayurveda & Sowa Rigpa**: Catalogs accredited clinical retreats providing traditional panchakarma and alternative healing.
- **Retreat Finder Widget**: An interactive goal-based quiz matching users with specific clinics and treatment recommendations.

---

## 4. Visual & Interaction Engineering

Journey Pulse delivers its cinematic aesthetic using a carefully choreographed motion system:

```mermaid
graph TD
  Scroll[Page Scroll Progress] -->|Interpolates| RoutePath[SVG Route Pathing]
  Scroll -->|Triggers| SuitcaseStickers[Sticker Appearances]
  Mouse[Cursor Movement] -->|Spring Vector| SuitcaseTilt[3D Suitcase Wobble]
  Mouse -->|Coordinates| FactCardTilt[TodayFactCard 3D Spring Tilt]
  Click[Click Interactions] -->|Flip States| PassportBooklet[3D Open & Stamp Pages]
```

### 4.1. Scroll-Driven Path Tracing & Lottie Coordination
- **Journey Pathing**: A glowing SVG travel path traces down the screen on scroll. A Lottie backpacker walker dynamically positions itself along the path coordinates using `SVGPathElement.getPointAtLength`, adjusting both translation and rotation.
- **Gradient Background Melding**: Six atmospheric CSS gradients (from sunset gold to deep ocean navy) cross-fade based on scroll milestones to represent the passage of travel time.

### 4.2. Procedural 3D Suitcase Canvas
- **Dynamic 3D Canvas**: Uses React Three Fiber (R3F) to load a custom-designed travel suitcase.
- **Dynamic Stickers**: As the user scrolls past specific sections, stickers from those countries (e.g. India, Thailand, Spain) animate onto the suitcase shell.
- **Mouse Parallax Springs**: The suitcase responds to cursor movements with soft spring physics (`@react-three/fiber` frame loop).

### 4.3. Interactive Passport Booklet
- **WebGL Stamp Booklet**: Clicking on the 3D Passport booklet triggers a page-flip animation. 
- **Confetti Bursts**: Pages display official e-Visa and VoA stamps on page turns, accompanied by color-coordinated confetti bursts matching national flags.

---

## 5. Technical Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 16 (App Router) | Server-side rendering, API routes, and optimized caching |
| **Language** | TypeScript | Strong typing, compilation safety |
| **Styling** | Tailwind CSS / Vanilla CSS | Premium dark mode, slate-950 mesh gradients, glassmorphism |
| **Database & ORM** | PostgreSQL / Prisma | Data persistence, full-text search indexes |
| **3D & WebGL** | React Three Fiber / Three.js | Procedural 3D suitcase, 3D passport booklet |
| **Data Globes** | React Globe.gl | Interactive WebGL geopolitical hazards mapping |
| **Vector Mapping** | React Simple Maps / D3-Geo | Global outbound visa status choropleths |
| **Animations** | Motion (Framer Motion) / GSAP | Spring-based 3D tilt, scroll tracking, and transitions |

---

## 6. Database Schema Design

Journey Pulse organizes its database to balance heavy news feeds with critical regulatory checks:

- **Article**: Aggregates news from 20+ RSS/scraper sources, including metadata such as read times, sentiment analysis scores, and SEO tags.
- **NewsSource**: Manages scraping metadata, fetch health statistics, and website URLs.
- **VisaUpdate**: Contains visa requirements, application URLs, processing times, fee structures, and Henley indices.
- **TravelAdvisory**: Stores regional safety warnings, local restrictions, and emergency contact details.
- **DailyFact**: Tracks pre-seeded facts linked to exact calendar dates (`@db.Date`).
- **GlobalEvent**: Manages seasonal festivals with automatic expiration dates.

---

## 7. Installation & Local Development Setup

To run Journey Pulse locally, follow these instructions:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/rprishabh/Travel-Pulse.git
cd Travel-Pulse
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database connection (PostgreSQL / Neon)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# App URL for absolute references
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Sync and Seed Database Tables
Sync the PostgreSQL schema and run the seed script to populate news feeds, outbound visa updates, 365 daily facts, and global events:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to interact with the portal locally.

### 5. Build for Production
To compile and optimize the app for production:
```bash
npm run build
npm run start
```

---

## 8. Performance Optimization & Accessibility Gates

- **Reduced Motion Gate**: A global media-query hook listens to the user's OS preference (`prefers-reduced-motion: reduce`). If enabled, the page sets `data-motion="off"`, instantly shutting down R3F WebGL canvases, Lottie animations, and complex cursor trackers, falling back to static illustrations.
- **Skip Animations Toggle**: Users can manually skip WebGL and path-tracing animations via a floating control; preferences are persisted in `localStorage`.
- **Dynamic Imports**: Heavy WebGL scripts (Globe, Simple Maps, 3D assets) are loaded via Next.js dynamic imports (`ssr: false`) alongside boarding pass skeletons to optimize First Contentful Paint (FCP) and Time to Interactive (TTI).

---

## 9. Future Roadmap

1. **AI-Driven News Sentiment**: Real-time classification of regulatory updates into positive/negative sentiment categories using LLM summaries.
2. **Flight Path Interpolator**: Visualizing real-time flight routes and ticket details directly on the 3D globe.
3. **Interactive Itinerary Generator**: A scroll-driven travel itinerary planner matching user interests with regional daily facts.
