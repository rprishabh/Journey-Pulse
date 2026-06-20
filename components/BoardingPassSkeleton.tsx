import React from "react";

export function BoardingPassSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto glass rounded-2xl overflow-hidden border border-sunset-1/20 flex flex-col md:flex-row relative divide-y md:divide-y-0 md:divide-x divide-dashed divide-sunset-1/30 shadow-lg animate-pulse">
      {/* Main Ticket Area */}
      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-sunset-1/10 rounded-md" />
          <div className="h-4 w-20 bg-sunset-2/10 rounded-md" />
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="space-y-2">
            <div className="h-10 w-24 bg-sunset-1/15 rounded-md" />
            <div className="h-3 w-16 bg-ink/10 dark:bg-cream/10 rounded" />
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <div className="h-0.5 w-full bg-sunset-1/30 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-sunset-1 bg-cream dark:bg-ink" />
            </div>
            <div className="h-3 w-12 bg-ink/10 dark:bg-cream/10 rounded mt-2" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-10 w-24 bg-sunset-1/15 rounded-md" />
            <div className="h-3 w-16 bg-ink/10 dark:bg-cream/10 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sunset-1/10">
          <div className="space-y-1">
            <div className="h-3 w-12 bg-ink/15 dark:bg-cream/15 rounded" />
            <div className="h-5 w-20 bg-sunset-1/10 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 bg-ink/15 dark:bg-cream/15 rounded" />
            <div className="h-5 w-20 bg-sunset-1/10 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 bg-ink/15 dark:bg-cream/15 rounded" />
            <div className="h-5 w-20 bg-sunset-1/10 rounded" />
          </div>
        </div>
      </div>

      {/* Ticket Stub (Coupon) */}
      <div className="w-full md:w-60 p-6 flex flex-col justify-between bg-sunset-1/5 relative">
        {/* Stub cutouts on sides */}
        <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-cream dark:bg-ink z-10" />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-sunset-1/10 rounded" />
            <div className="h-4 w-12 bg-sunset-2/10 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-ink/15 dark:bg-cream/15 rounded" />
            <div className="h-6 w-24 bg-sunset-1/15 rounded" />
          </div>
        </div>

        {/* Mock barcode at bottom */}
        <div className="pt-6 mt-4 border-t border-sunset-1/10">
          <div className="h-10 w-full bg-ink/20 dark:bg-cream/20 flex gap-0.5 rounded overflow-hidden">
            <div className="h-full w-2 bg-ink dark:bg-cream" />
            <div className="h-full w-1 bg-ink dark:bg-cream" />
            <div className="h-full w-4 bg-ink dark:bg-cream" />
            <div className="h-full w-1 bg-ink dark:bg-cream" />
            <div className="h-full w-3 bg-ink dark:bg-cream" />
            <div className="h-full w-1 bg-ink dark:bg-cream" />
            <div className="h-full w-2 bg-ink dark:bg-cream" />
            <div className="h-full w-4 bg-ink dark:bg-cream" />
            <div className="h-full w-1 bg-ink dark:bg-cream" />
            <div className="h-full w-2 bg-ink dark:bg-cream" />
            <div className="h-full w-1 bg-ink dark:bg-cream" />
            <div className="h-full w-3 bg-ink dark:bg-cream" />
          </div>
          <div className="h-3 w-28 bg-ink/10 dark:bg-cream/10 rounded mx-auto mt-1.5" />
        </div>
      </div>
    </div>
  );
}
