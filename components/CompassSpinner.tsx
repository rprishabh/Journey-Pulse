import React from "react";
import { Compass } from "lucide-react";

export function CompassSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-cream dark:bg-ink border-2 border-sunset-1 shadow-glow-brand animate-[spin_4s_linear_infinite]">
        <Compass className="w-10 h-10 text-sunset-1" />
        {/* Pulsing inner dot */}
        <div className="absolute w-2 h-2 rounded-full bg-sunset-3 animate-ping" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-sunset-1 animate-pulse">
          Navigating the route...
        </p>
        <p className="text-xs text-ink/40 dark:text-cream/40 mt-1">
          Assembling travel coordinates
        </p>
      </div>
    </div>
  );
}
