"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { Calendar, Clock, ExternalLink, RefreshCcw } from "lucide-react";
import { CompassSpinner } from "./CompassSpinner";

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImageUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  readTimeMinutes: number;
}

interface NewsGridProps {
  category: string;
  limit?: number;
}

export function NewsGrid({ category, limit = 6 }: NewsGridProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        // Fetch news, mapping segment or query depending on segment name
        let segmentParam = "";
        if (category === "trending") segmentParam = "&segment=ALL";
        else if (category === "india") segmentParam = "&segment=DOMESTIC";
        else if (category === "worldwide") segmentParam = "&segment=GLOBAL";

        const res = await fetch(`/api/news?page=1&pageSize=${limit}${segmentParam}`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (json.success && json.data) {
          setArticles(json.data);
        }
      } catch (e) {
        console.warn("[NewsGrid] Error loading travel news feeds");
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [category, limit]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  if (loading) return <div className="p-12"><CompassSpinner /></div>;

  if (articles.length === 0) {
    return (
      <div className="card-modern p-12 text-center max-w-md mx-auto space-y-4">
        <RefreshCcw className="w-10 h-10 text-sunset-2 mx-auto animate-spin" />
        <h4 className="font-display font-extrabold text-heading-md text-ink dark:text-cream">No Articles Active</h4>
        <p className="text-xs text-ink/60 dark:text-cream/60">We could not pull updates from databases. Check active connection.</p>
      </div>
    );
  }

  // Polaroid Drop-in animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -60, rotate: -3, opacity: 0 },
    show: {
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
    >
      {articles.map((article) => (
        <motion.div key={article.id} variants={itemVariants} className="w-full">
          <TiltCard className="p-4 bg-white dark:bg-ink border-2 border-sunset-1/10 hover:border-sunset-1/30 relative flex flex-col justify-between h-[450px] shadow-md group">
            
            {/* Polaroid image container */}
            <div className="relative h-48 w-full overflow-hidden bg-cream dark:bg-ink rounded-lg border border-sunset-1/15">
              {article.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.coverImageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sunset-1/10 to-sunset-2/20 flex items-center justify-center text-sunset-1">
                  <span className="text-4xl font-display font-extrabold uppercase opacity-40">TP</span>
                </div>
              )}
              {/* Via Google News Attribution Badge */}
              <span className="absolute bottom-2.5 right-2.5 text-[9px] font-extrabold tracking-wider uppercase bg-ink/75 text-cream px-2 py-0.5 rounded border border-sunset-1/25 backdrop-blur-md">
                via Google News
              </span>
            </div>

            {/* Polaroid Stub Info */}
            <div className="flex-1 flex flex-col justify-between pt-4 pb-2 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-[10px] font-extrabold text-sunset-2 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTimeMinutes || 3} MIN READ
                  </span>
                </div>
                
                <h4 className="font-display font-black text-body-md text-ink dark:text-cream leading-snug line-clamp-2 hover:text-sunset-1 transition-colors">
                  {article.title}
                </h4>
                
                <p className="text-xs text-ink/70 dark:text-cream/70 line-clamp-3 leading-relaxed font-medium">
                  {article.summary}
                </p>
              </div>

              {/* Bottom attribution */}
              <div className="flex items-center justify-between pt-3 border-t border-sunset-1/10 mt-auto">
                <span className="text-[10px] font-extrabold uppercase text-sunset-1 truncate max-w-[150px]">
                  {article.sourceName || "Global Feed"}
                </span>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-ink dark:text-cream hover:text-sunset-1 flex items-center gap-0.5 uppercase tracking-widest"
                >
                  Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
