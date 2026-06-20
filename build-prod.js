// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse/JourneyPulse India — Production Build Orchestrator
// Cross-platform compatibility for Windows (PowerShell/cmd) and Vercel (Linux)
// ─────────────────────────────────────────────────────────────────────────────

import { execSync } from "child_process";

try {
  console.log("🚀 Starting Production Database Synchronization...");
  execSync("prisma db push", { stdio: "inherit" });

  console.log("\n🌱 Seeding Database Tables...");
  execSync("prisma db seed", { stdio: "inherit" });

  console.log("\n🏗️  Compiling Next.js Application...");
  execSync("next build", { stdio: "inherit" });

  console.log("\n✅ Production Build and Database Sync Completed Successfully!");
} catch (error) {
  console.error("\n❌ Build execution failed:", error);
  process.exit(1);
}
