"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  radius?: number;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  radius = 80,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, elasticity: 0.8, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const distX = e.clientX - btnX;
      const distY = e.clientY - btnY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || 
                        document.documentElement.getAttribute("data-motion") === "off";

      if (distance < radius && !isReduced) {
        setIsHovered(true);
        // Attract toward cursor with 45% pull strength
        x.set(distX * 0.45);
        y.set(distY * 0.45);
      } else {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [radius, x, y]);

  return (
    <div ref={ref} className="inline-block">
      <motion.div
        style={{ x: springX, y: springY }}
        onClick={onClick}
        className={`${className} cursor-pointer select-none`}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
