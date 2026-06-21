"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  UtensilsCrossed,
  Info,
  Flame,
  Leaf,
  Sparkles,
  Search,
} from "lucide-react";

interface CulinaryDestination {
  id: string;
  city: string;
  state: string;
  type: string;
  rating: string;
  imageUrl: string;
  description: string;
  mustTryDishes: string[];
  signatureHub: string;
  foodPreference: "pure_veg" | "organic_sattvic" | "vegan_friendly" | "jain_friendly";
}

const CULINARY_DESTINATIONS: CulinaryDestination[] = [
  {
    id: "c-1",
    city: "Palitana",
    state: "Gujarat",
    type: "100% Vegetarian City",
    rating: "Pure Veg Haven",
    imageUrl: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&w=800&q=80",
    description: "The world's first legally 100% vegetarian city. Set atop Shatrunjaya Hills, this holy town offers pure vegetarian and strict Jain-compatible cuisine at every corner, completely free of onions and garlic.",
    mustTryDishes: ["Siddhachal Khichdi", "Palitana Handvo", "Jain Thali"],
    signatureHub: "Shatrunjaya Foothills Dharamshalas",
    foodPreference: "jain_friendly",
  },
  {
    id: "c-2",
    city: "Varanasi",
    state: "Uttar Pradesh",
    type: "Sattvic & Street Heritage",
    rating: "Holy Culinary Heritage",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=800&q=80",
    description: "Varanasi's culinary map revolves around sacred temple feeds. Experience the world-famous Kachori Sabzi breakfasts, Tamatar Chaat, and completely onion-and-garlic-free Sattvic Thalis at heritage ashrams.",
    mustTryDishes: ["Kachori Gali Sabzi", "Tamatar Chaat", "Kashi Vishwanath Sattvic Thali"],
    signatureHub: "Kachori Gali & Chowk",
    foodPreference: "organic_sattvic",
  },
  {
    id: "c-3",
    city: "Rishikesh",
    state: "Uttarakhand",
    type: "Ayurvedic & Yogi Cafés",
    rating: "Yoga City Cuisine",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    description: "Rishikesh is a dry, meat-free town serving organic macrobiotic yogic dishes. Cozy cafes overlooking the Ganges serve cold-pressed juices, ragi pancakes, and Ayurvedic meals designed to align physical doshas.",
    mustTryDishes: ["Ayurvedic Sattvic Bowl", "Ragi Khichdi", "Ginger Lemon Honey Tea"],
    signatureHub: "Laxman Jhula Cafe Street",
    foodPreference: "vegan_friendly",
  },
  {
    id: "c-4",
    city: "Jaipur",
    state: "Rajasthan",
    type: "Royal Rajasthani Rajasic",
    rating: "Gourmet Heritage",
    imageUrl: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80",
    description: "Jaipur's vegetarian legacy is royal. Experience rich, ghee-laden Dal Baati Churma, Ker Sangri, and Gatte ki Sabzi. The spices are robust, offering a glorious introduction to traditional Rajasic cooking.",
    mustTryDishes: ["Dal Baati Churma", "Ker Sangri", "Mawa Kachori"],
    signatureHub: "Chokhi Dhani Heritage Village",
    foodPreference: "pure_veg",
  }
];

const PREFERENCE_LABELS = {
  pure_veg: "Traditional Pure Veg",
  organic_sattvic: "Organic & Sattvic",
  vegan_friendly: "Vegan Friendly",
  jain_friendly: "Allium-Free (Jain)",
};

export default function VegFriendlyCulinaryPage() {
  const [selectedPreference, setSelectedPreference] = useState<"all" | "pure_veg" | "organic_sattvic" | "vegan_friendly" | "jain_friendly">("all");

  const filteredDestinations = selectedPreference === "all"
    ? CULINARY_DESTINATIONS
    : CULINARY_DESTINATIONS.filter(dest => dest.foodPreference === selectedPreference);

  return (
    <div className="min-h-screen bg-ink text-cream relative overflow-hidden select-none">
      
      {/* Decorative Spice Colors Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sunset-2/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-sunset-1/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <main className="container-wide py-10 relative z-10 space-y-12">
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-sunset-1/10 hover:text-sunset-1 text-xs font-black uppercase tracking-widest border border-sunset-1/10 text-cream transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>
        </div>

        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sunset-2/10 text-sunset-2 border border-sunset-2/25">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Plant-Based Travel Guide
          </span>
          <h1 className="font-display font-black text-display-sm md:text-display-md leading-tight text-white">
            India&apos;s Vegetarian & <span className="text-gradient">Sattvic Culinary Guides</span>
          </h1>
          <p className="text-body-md text-surface-400">
            Navigate the world&apos;s premier plant-based culinary topography. Explore sacred temple kitchens, 100% vegetarian municipalities, and organic yogic cafes curated for clean dining.
          </p>
        </div>

        {/* Dynamic Dietary Preference Selector */}
        <section className="bg-surface-900/60 border border-sunset-1/15 p-6 rounded-3xl shadow-glass space-y-4">
          <div className="text-left space-y-1">
            <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-500" />
              Filter by Culinary Discipline
            </h3>
            <p className="text-body-sm text-surface-400">
              Narrow your geographical dining guides by specific dietary restrictions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Show All Locations" },
              { id: "pure_veg", label: "Traditional Pure Veg" },
              { id: "organic_sattvic", label: "Organic & Sattvic (Onion/Garlic Free)" },
              { id: "vegan_friendly", label: "Vegan & Eco Cafés" },
              { id: "jain_friendly", label: "Allium-Free (Jain Friendly)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPreference(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
                  selectedPreference === tab.id
                    ? "bg-gradient-to-r from-sunset-2 to-sunset-1 border-sunset-1 text-white shadow-glow"
                    : "bg-surface-950/40 border-white/5 text-surface-300 hover:border-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Culinary Listing */}
        <section className="space-y-6">
          <div className="text-left">
            <h3 className="font-display font-black text-heading-xl text-white">
              Gourmet Heritage Directory
            </h3>
            <p className="text-body-sm text-surface-400">
              Browse vetted regional safezones delivering plant-based culinary excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDestinations.map((dest) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  key={dest.id}
                  className="card bg-surface-900 border border-white/5 hover:border-sunset-1/25 p-6 flex flex-col md:flex-row gap-6 transition-all duration-300 hover:shadow-card-hover group"
                >
                  <div className="md:w-2/5 relative h-48 md:h-auto rounded-xl overflow-hidden shrink-0">
                    <img
                      src={dest.imageUrl}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-2 left-2 bg-ink/85 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black uppercase text-sunset-2 tracking-wider">
                      {PREFERENCE_LABELS[dest.foodPreference]}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display font-extrabold text-body-lg text-white group-hover:text-sunset-2 transition-colors">
                            {dest.city}
                          </h4>
                          <span className="text-[10px] text-surface-400 font-semibold flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-sunset-1" />
                            {dest.state}, India
                          </span>
                        </div>
                        <span className="text-[9px] bg-sunset-2/10 text-sunset-2 border border-sunset-2/20 font-black uppercase px-2 py-0.5 rounded h-fit shrink-0">
                          {dest.type}
                        </span>
                      </div>

                      <p className="text-caption text-surface-400 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-sunset-2 uppercase tracking-wider block">Signature Culinary Hub</span>
                        <span className="text-xs text-white font-semibold">{dest.signatureHub}</span>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
                        <span className="text-[8px] font-bold text-surface-400 uppercase tracking-widest block">Must-Try Food Items</span>
                        <div className="flex flex-wrap gap-1">
                          {dest.mustTryDishes.map((dish, i) => (
                            <span key={i} className="text-[9px] font-bold bg-surface-950 text-surface-300 px-2 py-0.5 rounded">
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Tourist Food Safety and Hygiene Directive Panel */}
        <section className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
          <div className="md:col-span-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Street Food Safety (Samyama Protocol)
            </span>
            <h3 className="font-display font-black text-heading-lg text-white">
              Sanitation Guidelines for International Gastronomers
            </h3>
            <p className="text-body-sm text-surface-400">
              To fully appreciate India&apos;s plant-based street delicacies while mitigating gastrointestinal distress, consume cooked foods hot, prioritize busy stalls with high food turnover, and exclusively utilize packaged drinking water.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-end">
            <Link
              href="/contact?subject=Culinary Query"
              className="btn btn-sm btn-outline text-xs w-full md:w-auto text-center"
            >
              <span>Contact Culinary Advisor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
