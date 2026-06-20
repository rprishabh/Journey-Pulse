"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function SkipAnimationsButton() {
  const [motionOff, setMotionOff] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("motion-pref");
    if (saved === "off") {
      setMotionOff(true);
      document.documentElement.setAttribute("data-motion", "off");
    }
  }, []);

  const toggleMotion = () => {
    const nextState = !motionOff;
    setMotionOff(nextState);
    if (nextState) {
      document.documentElement.setAttribute("data-motion", "off");
      localStorage.setItem("motion-pref", "off");
    } else {
      document.documentElement.removeAttribute("data-motion");
      localStorage.setItem("motion-pref", "on");
    }
  };

  return (
    <button
      onClick={toggleMotion}
      aria-label={motionOff ? "Enable animations" : "Disable animations"}
      className="fixed top-4 right-4 z-[9999] flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider glass hover:bg-sunset-1/25 hover:text-sunset-1 transition-all duration-300 shadow-md border border-sunset-1/10 text-ink dark:text-cream"
    >
      {motionOff ? (
        <>
          <EyeOff className="w-3.5 h-3.5 text-sunset-3" />
          <span>Motion Off</span>
        </>
      ) : (
        <>
          <Eye className="w-3.5 h-3.5 text-sunset-1 animate-pulse" />
          <span>Motion On</span>
        </>
      )}
    </button>
  );
}
