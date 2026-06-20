"use client";

import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

// Minimal mockup walk Lottie loader fallback
import travelerWalkAnimation from "../public/animations/traveler-walk.json";

const GRADIENTS = [
  "linear-gradient(135deg, #0c1929 0%, #173559 100%)", // Stage 1: Hero Sunrise
  "linear-gradient(135deg, #173559 0%, #ff6b35 100%)", // Stage 2: Cultural India
  "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)", // Stage 3: Transit/Visa
  "linear-gradient(135deg, #f7931e 0%, #e84393 100%)", // Stage 4: Development
  "linear-gradient(135deg, #e84393 0%, #6c5ce7 100%)", // Stage 5: Alert Globe
  "linear-gradient(135deg, #6c5ce7 0%, #0c1929 100%)", // Stage 6: Sunset Arrival
];

export function JourneyCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [walkerPos, setWalkerPos] = useState({ x: 0, y: 0, angle: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);

  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const checkMotion = () => {
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || 
                        document.documentElement.getAttribute("data-motion") === "off";
      setVisible(!isReduced);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMotion();
    checkMobile();

    window.addEventListener("resize", checkMobile);
    
    // MutationObserver to listen to HTML attribute toggle from SkipAnimationsButton
    const observer = new MutationObserver(checkMotion);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      
      setScrollProgress(progress);
      
      // Determine background stage index
      const idx = Math.min(GRADIENTS.length - 1, Math.floor(progress * GRADIENTS.length));
      setStageIndex(idx);

      // Math tracing of position on SVG path
      if (pathRef.current && svgRef.current) {
        try {
          const pathLen = pathRef.current.getTotalLength();
          // Keep progress bounded
          const pointVal = Math.min(pathLen - 1, Math.max(0, progress * pathLen));
          
          const pt = pathRef.current.getPointAtLength(pointVal);
          const nextPt = pathRef.current.getPointAtLength(Math.min(pathLen, pointVal + 2));
          
          // Calculate angle for traveler rotation
          const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
          
          setWalkerPos({ x: pt.x, y: pt.y, angle });
        } catch (e) {
          // Fallback if browser doesn't compute total length yet
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial frame position
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visible]);

  if (!visible) return null;

  // Custom paths: Mobile is simplified 3-stage, Desktop is full 6-stage
  const pathD = isMobile
    ? "M 20 50 Q 80 150, 180 250 T 300 450"
    : "M 100 100 C 300 150, 600 50, 800 250 C 900 400, 400 550, 200 650 C 100 700, 300 850, 600 950 C 800 1000, 950 1100, 900 1250 C 800 1350, 300 1400, 150 1500 T 500 1800";

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none transition-all duration-1000 ease-out"
      style={{
        background: GRADIENTS[stageIndex],
      }}
    >
      {/* Background radial soft light blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sunset-1/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sunset-4/10 rounded-full blur-[140px] mix-blend-screen" />

      {/* Journey Path Drawing */}
      <svg
        ref={svgRef}
        viewBox={isMobile ? "0 0 320 600" : "0 0 1000 2000"}
        className="w-full h-full opacity-35"
        preserveAspectRatio="none"
      >
        {/* Glow path representation */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#path-grad)"
          strokeWidth={isMobile ? 3 : 5}
          strokeLinecap="round"
          className="transition-all"
        />
        {/* Active tracking line */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#f7931e"
          strokeWidth={isMobile ? 3.5 : 6}
          strokeDasharray="1200"
          strokeDashoffset={1200 - (scrollProgress * 1200)}
          strokeLinecap="round"
          className="transition-all"
        />

        <defs>
          <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="50%" stopColor="#e84393" />
            <stop offset="100%" stopColor="#6c5ce7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Traveling character (Lottie animations) */}
      <div
        className="absolute w-12 h-12 -ml-6 -mt-6 transition-transform duration-100 ease-out"
        style={{
          left: `${(walkerPos.x / (isMobile ? 320 : 1000)) * 100}%`,
          top: `${(walkerPos.y / (isMobile ? 600 : 2000)) * 100}%`,
          transform: `rotate(${walkerPos.angle}deg)`,
        }}
      >
        <div className="w-10 h-10 rounded-full bg-cream shadow-glow-brand flex items-center justify-center p-0.5 border border-sunset-1">
          <Lottie
            animationData={travelerWalkAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
