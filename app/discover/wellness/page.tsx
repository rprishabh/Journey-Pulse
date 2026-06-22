"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  HeartPulse,
  Compass,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Flower,
  Activity,
  MapPin,
  Star,
  Quote,
} from "lucide-react";

interface Retreat {
  id: string;
  name: string;
  location: string;
  region: string;
  rating: number;
  imageUrl: string;
  description: string;
  therapies: string[];
  duration: string;
  priceLevel: "Luxury" | "Ultra-Luxury" | "Elite";
  websiteUrl: string;
}

const PREMIUM_RETREATS: Retreat[] = [
  {
    id: "r-1",
    name: "Ananda in the Himalayas",
    location: "Rishikesh, Uttarakhand",
    region: "Himalayas (North)",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    description: "Located in the former Palace Estate of the Maharaja of Tehri-Garhwal, Ananda is a world-renowned wellness sanctuary integrating traditional Ayurveda, Yoga, and Vedanta with international spa experiences.",
    therapies: ["Ayurvedic Detox", "Hatha Yoga", "Vedanta Philosophy", "Stress Management"],
    duration: "7 - 21 Days",
    priceLevel: "Ultra-Luxury",
    websiteUrl: "https://www.anandaspa.com/",
  },
  {
    id: "r-2",
    name: "Somatheeram Ayurveda Village",
    location: "Kovalam, Kerala",
    region: "Coastal (South)",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    description: "The world's first Ayurvedic resort, set in tropical gardens along Kovalam's beach. Famous for its authentic clinical Panchakarma programs and heritage wood bungalow accommodations.",
    therapies: ["Panchakarma Detox", "Rasayana Rejuvenation", "Spine & Neck Care", "Traditional Yoga"],
    duration: "14 - 28 Days",
    priceLevel: "Luxury",
    websiteUrl: "https://www.somatheeram.org/",
  },
  {
    id: "r-3",
    name: "Vana Wellness Sanctuary",
    location: "Dehradun, Uttarakhand",
    region: "Himalayas (North)",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80",
    description: "A highly personalized contemporary sanctuary nestled inside sal forests. Vana integrates Ayurveda, Sowa Rigpa (Tibetan healing), Yoga, and natural therapies into an immersive clinical journey.",
    therapies: ["Sowa Rigpa (Tibetan)", "Acupuncture", "Sattvic Nutrition", "Music Therapy"],
    duration: "7 - 30 Days",
    priceLevel: "Elite",
    websiteUrl: "https://www.vfrretreats.com/",
  },
  {
    id: "r-4",
    name: "Carnoustie Ayurveda & Wellness Resort",
    location: "Mararikulam, Kerala",
    region: "Coastal (South)",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
    description: "An eco-friendly luxury retreat offering bespoke wellness cure programs, high-end pool villas, and diagnostic screening combining systemic bio-science with ancient marma therapies.",
    therapies: ["Anti-Aging Cure", "Pranic Healing", "Immune Strengthening", "Bespoke Yoga"],
    duration: "10 - 21 Days",
    priceLevel: "Ultra-Luxury",
    websiteUrl: "https://www.carnoustieresorts.com/",
  }
];

const GOAL_RECOMMENDATIONS = {
  detox: {
    retreatId: "r-2",
    therapy: "Panchakarma Detox & Herbal Steam Therapies",
    guideline: "Ideal for cleansing physical impurities and resetting gut health. Recommends organic plant diet.",
    duration: "14 Days",
  },
  stress: {
    retreatId: "r-1",
    therapy: "Shirodhara, Pranic Healing, and Guided Mindfulness Meditation",
    guideline: "Focuses on calming the central nervous system and restoring emotional/mental clarity.",
    duration: "7 Days",
  },
  tibetan: {
    retreatId: "r-3",
    therapy: "Sowa Rigpa Treatments, Sound Baths, and Meridian Acupuncture",
    guideline: "Restores energy flow and cellular balance using specialized Tibetan medicine matrices.",
    duration: "10 Days",
  },
  antiaging: {
    retreatId: "r-4",
    therapy: "Rasayana Kayakalpa Therapy & Lymphatic Drainage Massage",
    guideline: "Strengthens baseline cell immunity and fights age-related physical and sensory deterioration.",
    duration: "21 Days",
  }
};

export default function LuxuryWellnessPage() {
  const [selectedGoal, setSelectedGoal] = useState<"detox" | "stress" | "tibetan" | "antiaging" | null>(null);

  const recommendation = selectedGoal ? GOAL_RECOMMENDATIONS[selectedGoal] : null;
  const recommendedRetreat = recommendation
    ? PREMIUM_RETREATS.find((r) => r.id === recommendation.retreatId)
    : null;

  return (
    <div className="min-h-screen bg-ink text-cream relative overflow-hidden select-none">
      
      {/* Decorative Blur Background Glands */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-sunset-3/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Navigation Bar */}
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

        {/* Hero Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sunset-1/10 text-sunset-2 border border-sunset-1/25">
            <HeartPulse className="w-3.5 h-3.5" />
            Exclusive Wellness Guide
          </span>
          <h1 className="font-display font-black text-display-sm md:text-display-md leading-tight text-white">
            Luxury Wellness & <span className="text-gradient">Ayurvedic Retreats</span>
          </h1>
          <p className="text-body-md text-surface-400">
            Discover India&apos;s leading sanctuaries of tranquility. Immerse yourself in clinically authentic Ayurvedic Panchakarma, Tibetan Sowa Rigpa, and holistic spiritual restoration.
          </p>
        </div>

        {/* Retreat Finder Interactive Quiz Widget */}
        <section className="bg-surface-900/60 border border-sunset-1/15 p-6 md:p-8 rounded-3xl shadow-glass space-y-6">
          <div className="text-left space-y-1 border-b border-white/5 pb-4">
            <h3 className="font-display font-bold text-heading-md text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-sunset-2 animate-spin-slow" />
              Retreat Alignment Finder
            </h3>
            <p className="text-body-sm text-surface-400">
              Select your primary therapeutic goal to locate the corresponding diagnostic retreat and prescribed therapies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: "detox", label: "Panchakarma Detox", icon: Activity },
              { id: "stress", label: "Stress Release", icon: Flower },
              { id: "tibetan", label: "Tibetan Sowa Rigpa", icon: Sparkles },
              { id: "antiaging", label: "Anti-Aging Cure", icon: ShieldCheck },
            ].map((goal) => (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id as any)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all duration-300 ${
                  selectedGoal === goal.id
                    ? "bg-gradient-to-br from-sunset-1 to-sunset-2 border-sunset-2 text-white shadow-glow"
                    : "bg-surface-950/40 border-white/5 text-surface-300 hover:border-white/15 hover:bg-surface-950/60"
                }`}
              >
                <goal.icon className={`w-6 h-6 ${selectedGoal === goal.id ? "text-white" : "text-sunset-2"}`} />
                <span className="font-bold text-xs leading-tight">{goal.label}</span>
              </button>
            ))}
          </div>

          {/* Animate recommendation results */}
          <AnimatePresence mode="wait">
            {recommendation && recommendedRetreat && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface-950/60 border border-sunset-2/20 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left"
              >
                <div className="md:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                    Recommended Therapy
                  </div>
                  <h4 className="font-display font-black text-body-lg text-white">
                    {recommendation.therapy}
                  </h4>
                  <p className="text-body-sm text-surface-400">
                    {recommendation.guideline}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-surface-300 pt-1">
                    <span>Suggested Program: <strong className="text-sunset-2">{recommendation.duration}</strong></span>
                    <span>Retreat Destination: <strong className="text-sunset-1">{recommendedRetreat.name}</strong></span>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-end">
                  <a
                    href={`#${recommendation.retreatId}`}
                    className="btn btn-sm btn-primary w-full md:w-auto text-center"
                  >
                    <span>View Retreat Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Premium Retreats Grid Listing */}
        <section className="space-y-6">
          <div className="text-left">
            <h3 className="font-display font-black text-heading-xl text-white">
              Luxury Sanctuary Directory
            </h3>
            <p className="text-body-sm text-surface-400">
              Explore audited clinical sanctuaries delivering accredited residential programs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PREMIUM_RETREATS.map((retreat) => (
              <div
                key={retreat.id}
                id={retreat.id}
                className="card bg-surface-900 border border-white/5 hover:border-sunset-1/25 p-6 flex flex-col md:flex-row gap-6 scroll-mt-28 transition-all duration-300 hover:shadow-card-hover group"
              >
                <div className="md:w-2/5 relative h-48 md:h-auto rounded-xl overflow-hidden shrink-0">
                  <img
                    src={retreat.imageUrl}
                    alt={retreat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2 left-2 bg-ink/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black uppercase text-sunset-2 tracking-wider">
                    {retreat.priceLevel}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-display font-extrabold text-body-lg text-white group-hover:text-sunset-1 transition-colors">
                          {retreat.name}
                        </h4>
                        <span className="text-[10px] text-surface-400 font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-sunset-2" />
                          {retreat.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-950 px-2 py-1 rounded text-caption font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{retreat.rating}</span>
                      </div>
                    </div>

                    <p className="text-caption text-surface-400 leading-relaxed line-clamp-3">
                      {retreat.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {retreat.therapies.map((therapy, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-bold bg-surface-950 text-surface-300 px-2 py-0.5 rounded border border-white/5"
                        >
                          {therapy}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1.5">
                      <span className="text-[10px] text-surface-400">
                        Min Duration: <strong className="text-white">{retreat.duration}</strong>
                      </span>
                      <a
                        href={retreat.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black uppercase text-sunset-1 hover:text-sunset-2 flex items-center gap-1 group/btn"
                      >
                        <span>Inquire Booking</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Testimonial Block */}
        <section className="bg-gradient-to-r from-surface-900 to-surface-950 rounded-3xl p-8 border border-white/5 relative overflow-hidden flex items-center gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sunset-1/5 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-4 max-w-2xl text-left">
            <Quote className="w-8 h-8 text-sunset-2 opacity-50" />
            <p className="text-body-sm text-surface-300 italic leading-relaxed">
              &quot;The wellness sanctuaries of India represent more than mere luxury hospitality. They are clinical spaces backed by standardized curricula, keeping centuries-old traditions alive through rigorous diagnostics and bespoke organic dietaries.&quot;
            </p>
            <div className="text-caption font-bold text-white">
              — Editorial Board, JourneyPulse India
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
