import { NextResponse } from "next/server";
// Connects directly to the function inside your file layout
import { runFetchCycle } from "@/lib/news-fetcher";

export async function GET(request: Request) {
    // 1. Secure verification check
    const { searchParams } = new URL(request.url);
    const cronToken = searchParams.get("cron_token");

    if (cronToken !== process.env.CRON_SECRET) {
        return new NextResponse("Unauthorized Access", { status: 401 });
    }

    try {
        console.log("Automated Cloud Fetcher Loop Initialized...");

        // 2. Executes your exact fetch orchestrator logic
        const results = await runFetchCycle();

        return NextResponse.json({
            success: true,
            message: "News database updated successfully!",
            articlesAdded: results.totalNewArticles,
            skipped: results.totalSkipped
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}