// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — News Categorizer (DeepSeek API)
// AI-powered article categorization, sentiment analysis, and smart summaries
// skills.md §1: Deep error boundaries and data fallback loops
// skills.md §3: AEO/AIO/GEO — semantic structures for AI summarization
// ─────────────────────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import {
  withRetry,
  withTimeout,
  withErrorBoundary,
  ExternalServiceError,
  serializeError,
  AppError,
} from "@/lib/errors";
import type { ArticleStatus, ContentTone, TravelSegment } from "@prisma/client";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CategorizationResult {
  categorySlug: string;
  categoryConfidence: number;
  segment: TravelSegment;
  segmentConfidence: number;
  sentiment: number; // -1.0 (negative) to 1.0 (positive)
  tone: ContentTone;
  suggestedTags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  summary: string;
}

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: DeepSeekChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface CategorizationCycleResult {
  jobId: string;
  startedAt: Date;
  completedAt: Date;
  duration: number;
  totalProcessed: number;
  totalSucceeded: number;
  totalFailed: number;
  totalSkipped: number;
  errors: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY ?? "";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
const DEEPSEEK_BASE_URL =
  process.env.DEEPSEEK_API_BASE_URL ?? "https://api.deepseek.com/v1";
const DEEPSEEK_TIMEOUT_MS = 30_000;
const DEEPSEEK_MAX_RETRIES = 2;
const CATEGORIZATION_BATCH_SIZE = 50;

// Valid category slugs matching our seed data
const VALID_CATEGORY_SLUGS = [
  "visa-immigration",
  "flight-aviation",
  "hotel-accommodation",
  "destination-guides",
  "travel-advisory",
  "government-initiatives",
  "luxury-travel",
  "budget-travel",
  "adventure-trekking",
  "wellness-ayurveda",
  "heritage-culture",
  "wildlife-nature",
  "food-cuisine",
  "rail-road-travel",
  "cruise-waterways",
  "travel-technology",
  "solo-female-travel",
  "family-travel",
  "honeymoon-romance",
  "currency-finance",
] as const;

const VALID_SEGMENTS: TravelSegment[] = [
  "INBOUND",
  "OUTBOUND",
  "DOMESTIC",
  "ENTERPRISE",
];

const VALID_TONES: ContentTone[] = [
  "MEMES_FUNNY",
  "PROFESSIONAL_BUDDY",
  "FORMAL_RESPECTFUL",
  "CASUAL_ENGAGING",
];

// ═══════════════════════════════════════════════════════════════════════════════
// DEEPSEEK API CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sends a chat completion request to the DeepSeek API.
 * Wrapped with retry + timeout for resilience against transient failures.
 */
async function callDeepSeek(
  messages: DeepSeekMessage[],
  temperature: number = 0.3,
  maxTokens: number = 1024
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new AppError(
      "DEEPSEEK_API_KEY is not configured. Set it in .env to enable AI categorization.",
      503,
      "MISSING_API_KEY"
    );
  }

  const apiCall = async (): Promise<string> => {
    const response = await withTimeout(
      fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
      }),
      DEEPSEEK_TIMEOUT_MS,
      "DeepSeek-API"
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "No response body");

      // Handle rate limiting specifically
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        throw new ExternalServiceError(
          "DeepSeek",
          `Rate limited (429). Retry after: ${retryAfter ?? "unknown"}s. Body: ${errorBody.slice(0, 200)}`
        );
      }

      throw new ExternalServiceError(
        "DeepSeek",
        `HTTP ${response.status}: ${errorBody.slice(0, 300)}`
      );
    }

    const data: DeepSeekResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new ExternalServiceError(
        "DeepSeek",
        "Empty choices array in API response"
      );
    }

    return data.choices[0].message.content;
  };

  return withRetry(
    apiCall,
    "DeepSeek-Categorize",
    DEEPSEEK_MAX_RETRIES,
    2000
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIZATION PROMPT ENGINEERING
// skills.md §3: Structured content for SEO/AEO/AIO/GEO
// knowledge.md: Inbound/Outbound segment detection
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Builds the system prompt for article categorization.
 * Encodes our exact category taxonomy, segment definitions,
 * and output schema expectations.
 */
function buildSystemPrompt(): string {
  return `You are JourneyPulse India's AI categorization engine. Your role is to analyze travel news articles and produce structured metadata for an Indian travel news aggregation platform.

## Your Tasks
1. **Categorize** the article into exactly ONE of these category slugs:
   ${VALID_CATEGORY_SLUGS.map((s) => `"${s}"`).join(", ")}

2. **Identify the travel segment**:
   - "INBOUND" = International visitors entering India (culture seekers, heritage enthusiasts, luxury wellness travelers, adventure backpackers)
   - "OUTBOUND" = Indian citizens traveling abroad (families, HNIs, budget Gen-Z, solo female adventurers, luxury honeymooners)
   - "DOMESTIC" = Indian travelers within India
   - "ENTERPRISE" = Travel industry/business news (suppliers, DMCs, airlines, hotels)

3. **Analyze sentiment** on a scale from -1.0 (very negative/warning) to 1.0 (very positive/exciting)

4. **Select the best content tone**:
   - "MEMES_FUNNY" = Trending internet syntax, witty hooks, viral potential
   - "PROFESSIONAL_BUDDY" = Collaborative, authoritative yet accessible
   - "FORMAL_RESPECTFUL" = Precise corporate, diplomatic travel guidance
   - "CASUAL_ENGAGING" = Native narrative style, click-through depth

5. **Suggest up to 5 relevant tags** from common travel topics

6. **Generate SEO metadata**:
   - seoTitle: Compelling, keyword-rich title (max 70 chars)
   - seoDescription: Click-worthy meta description (max 160 chars)
   - seoKeywords: 5-8 relevant keywords
   - summary: 2-3 sentence article summary optimized for AI answer engines

## Output Format
Respond with a JSON object matching this exact schema:
{
  "categorySlug": string,
  "categoryConfidence": number (0.0-1.0),
  "segment": "INBOUND" | "OUTBOUND" | "DOMESTIC" | "ENTERPRISE",
  "segmentConfidence": number (0.0-1.0),
  "sentiment": number (-1.0 to 1.0),
  "tone": "MEMES_FUNNY" | "PROFESSIONAL_BUDDY" | "FORMAL_RESPECTFUL" | "CASUAL_ENGAGING",
  "suggestedTags": string[],
  "seoTitle": string,
  "seoDescription": string,
  "seoKeywords": string[],
  "summary": string
}`;
}

/**
 * Builds the user message containing the article to categorize.
 */
function buildUserPrompt(article: {
  title: string;
  summary: string;
  content: string;
  sourceName: string;
  categories?: string[];
}): string {
  // Truncate content to avoid token limits while preserving meaning
  const truncatedContent = stripHtmlBasic(article.content).slice(0, 2000);

  return `Analyze this travel news article:

**Title:** ${article.title}
**Source:** ${article.sourceName}
**Existing Tags:** ${article.categories?.join(", ") || "None"}
**Summary:** ${article.summary}
**Content:** ${truncatedContent}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLE ARTICLE CATEGORIZER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Categorizes a single article using the DeepSeek API.
 * Validates the AI response against our schema before returning.
 */
export async function categorizeArticle(article: {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceName: string;
  seoKeywords: string[];
}): Promise<CategorizationResult> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: buildSystemPrompt() },
    {
      role: "user",
      content: buildUserPrompt({
        title: article.title,
        summary: article.summary,
        content: article.content,
        sourceName: article.sourceName,
        categories: article.seoKeywords,
      }),
    },
  ];

  const rawResponse = await callDeepSeek(messages);

  // ── Parse and validate the JSON response ──────────────────────────────
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawResponse);
  } catch (parseError) {
    throw new ExternalServiceError(
      "DeepSeek",
      `Invalid JSON response: ${rawResponse.slice(0, 200)}`
    );
  }

  // ── Validate and sanitize each field ──────────────────────────────────
  const result = validateCategorizationResult(parsed);
  return result;
}

/**
 * Validates and sanitizes the AI response, falling back to safe defaults
 * for any field that doesn't match our expected schema.
 */
function validateCategorizationResult(
  raw: Record<string, unknown>
): CategorizationResult {
  // Category
  const categorySlug =
    typeof raw.categorySlug === "string" &&
      (VALID_CATEGORY_SLUGS as readonly string[]).includes(raw.categorySlug)
      ? raw.categorySlug
      : "destination-guides"; // Safe default

  const categoryConfidence = clampNumber(raw.categoryConfidence, 0, 1, 0.5);

  // Segment
  const segment =
    typeof raw.segment === "string" && VALID_SEGMENTS.includes(raw.segment as TravelSegment)
      ? (raw.segment as TravelSegment)
      : "DOMESTIC";

  const segmentConfidence = clampNumber(raw.segmentConfidence, 0, 1, 0.5);

  // Sentiment
  const sentiment = clampNumber(raw.sentiment, -1, 1, 0);

  // Tone
  const tone =
    typeof raw.tone === "string" && VALID_TONES.includes(raw.tone as ContentTone)
      ? (raw.tone as ContentTone)
      : "PROFESSIONAL_BUDDY";

  // Tags
  const suggestedTags = Array.isArray(raw.suggestedTags)
    ? raw.suggestedTags
      .filter((t): t is string => typeof t === "string")
      .slice(0, 5)
    : [];

  // SEO
  const seoTitle =
    typeof raw.seoTitle === "string"
      ? raw.seoTitle.slice(0, 70)
      : "";

  const seoDescription =
    typeof raw.seoDescription === "string"
      ? raw.seoDescription.slice(0, 160)
      : "";

  const seoKeywords = Array.isArray(raw.seoKeywords)
    ? raw.seoKeywords
      .filter((k): k is string => typeof k === "string")
      .slice(0, 8)
    : [];

  const summary =
    typeof raw.summary === "string"
      ? raw.summary.slice(0, 500)
      : "";

  return {
    categorySlug,
    categoryConfidence,
    segment,
    segmentConfidence,
    sentiment,
    tone,
    suggestedTags,
    seoTitle,
    seoDescription,
    seoKeywords,
    summary,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATCH CATEGORIZATION CYCLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Runs a categorization cycle on uncategorized DRAFT articles.
 * Processes articles in batches to respect API rate limits.
 * Updates each article with AI-generated metadata and promotes to PUBLISHED.
 *
 * Entry points:
 * - node-cron scheduler (CRON_AI_CATEGORIZE)
 * - /api/news/categorize POST endpoint (manual trigger)
 */
export async function runCategorizationCycle(): Promise<CategorizationCycleResult> {
  const startedAt = new Date();
  let totalProcessed = 0;
  let totalSucceeded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  // ── Create CronJobLog entry ───────────────────────────────────────────
  const cronJob = await prisma.cronJobLog.create({
    data: {
      jobName: "ai-categorization-cycle",
      status: "RUNNING",
      startedAt,
    },
  });

  try {
    // ── Fetch uncategorized articles ──────────────────────────────────────
    const uncategorizedArticles = await prisma.article.findMany({
      where: {
        status: "DRAFT",
        aiCategoryScore: null, // Not yet categorized
      },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        sourceName: true,
        seoKeywords: true,
      },
      take: CATEGORIZATION_BATCH_SIZE,
      orderBy: { fetchedAt: "desc" }, // Prioritize newest
    });

    if (uncategorizedArticles.length === 0) {
      totalSkipped = 1;
      console.log("[NewsCategorizer] No uncategorized articles found. Skipping.");
    } else {
      console.log(
        `[NewsCategorizer] Processing ${uncategorizedArticles.length} articles...`
      );

      // ── Process each article ──────────────────────────────────────────
      for (const article of uncategorizedArticles) {
        totalProcessed++;

        let result: CategorizationResult | null = null;
        const [aiResult, aiError] = await withErrorBoundary(
          () => categorizeArticle(article),
          `Categorize:${article.id}`
        );

        if (aiResult) {
          result = aiResult;
        } else {
          console.warn(`[NewsCategorizer] AI categorization failed, falling back to rule-based: ${aiError?.message}`);
          result = fallbackCategorize(article.title, article.summary) as CategorizationResult;
        }

        if (result) {
          try {
            // ── Resolve category ID from slug ─────────────────────────────
            const category = await prisma.category.findUnique({
              where: { slug: result.categorySlug },
              select: { id: true },
            });

            // ── Resolve or create tags ────────────────────────────────────
            const tagConnections = [];
            for (const tagName of result.suggestedTags) {
              const tagSlug = tagName
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .slice(0, 50);

              if (!tagSlug) continue;

              const tag = await prisma.tag.upsert({
                where: { slug: tagSlug },
                update: {},
                create: { name: tagName, slug: tagSlug },
              });
              tagConnections.push({ id: tag.id });
            }

            // ── Update the article with categorization results ────────────
            await prisma.article.update({
              where: { id: article.id },
              data: {
                category: category ? { connect: { id: category.id } } : undefined,
                segment: result.segment,
                tone: result.tone,
                aiCategoryScore: result.categoryConfidence,
                aiSentiment: result.sentiment,
                seoTitle: result.seoTitle || undefined,
                seoDescription: result.seoDescription || undefined,
                seoKeywords: result.seoKeywords,
                summary: result.summary || undefined,
                status: "PUBLISHED" as ArticleStatus,
                tags: {
                  connect: tagConnections,
                },
              },
            });

            totalSucceeded++;
            console.log(
              `[NewsCategorizer]   ✅ "${article.title.slice(0, 50)}..." → ${result.categorySlug} (${(result.categoryConfidence * 100).toFixed(0)}%) | ${result.segment}`
            );
          } catch (persistError) {
            totalFailed++;
            const msg = `Failed to persist categorization for "${article.title.slice(0, 50)}...": ${persistError instanceof Error ? persistError.message : String(persistError)
              }`;
            errors.push(msg);
            console.error(`[NewsCategorizer]   ❌ ${msg}`);
          }
        } else {
          totalFailed++;
          const msg = `Categorization failed for "${article.title.slice(0, 50)}...": ${aiError?.message}`;
          errors.push(msg);
          console.error(`[NewsCategorizer]   ❌ ${msg}`);

          // ── Mark as FLAGGED if categorization fails repeatedly ────────
          // This prevents infinite retry loops on problematic articles
          try {
            await prisma.article.update({
              where: { id: article.id },
              data: {
                aiCategoryScore: -1, // Sentinel: categorization attempted but failed
              },
            });
          } catch {
            // Non-critical: flag update failed
          }
        }

        // ── Rate limit delay between API calls ──────────────────────────
        // DeepSeek free tier has conservative rate limits
        await sleep(500);
      }
    }

    // ── Update CronJobLog ───────────────────────────────────────────────
    const completedAt = new Date();
    const duration = completedAt.getTime() - startedAt.getTime();

    await prisma.cronJobLog.update({
      where: { id: cronJob.id },
      data: {
        status: totalFailed > 0 ? "COMPLETED_WITH_ERRORS" : "COMPLETED",
        completedAt,
        duration,
        itemsProcessed: totalSucceeded,
        itemsFailed: totalFailed,
        metadata: {
          totalProcessed,
          totalSkipped,
          errors: errors.slice(0, 10),
        },
      },
    });

    const cycleResult: CategorizationCycleResult = {
      jobId: cronJob.id,
      startedAt,
      completedAt,
      duration,
      totalProcessed,
      totalSucceeded,
      totalFailed,
      totalSkipped,
      errors,
    };

    console.log(
      `[NewsCategorizer] Cycle complete: ${totalSucceeded}/${totalProcessed} categorized (${totalFailed} failed) in ${duration}ms`
    );

    return cycleResult;
  } catch (error) {
    // ── Catastrophic cycle failure ──────────────────────────────────────
    const completedAt = new Date();
    const serialized = serializeError(error);

    await prisma.cronJobLog.update({
      where: { id: cronJob.id },
      data: {
        status: "FAILED",
        completedAt,
        duration: completedAt.getTime() - startedAt.getTime(),
        errorMessage: serialized.message,
        errorStack: serialized.stack,
      },
    });

    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FALLBACK CATEGORIZER (Rule-Based)
// skills.md §1: data fallback loops — when AI API is unavailable
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Rule-based fallback categorizer when DeepSeek API is unavailable.
 * Uses keyword matching against the article title and summary.
 * Less accurate but ensures articles are never permanently stuck in DRAFT.
 */
export function fallbackCategorize(
  title: string,
  summary: string
): Partial<CategorizationResult> {
  const text = `${title} ${summary}`.toLowerCase();

  // Keyword → category mapping
  const categoryRules: Array<{
    keywords: string[];
    slug: (typeof VALID_CATEGORY_SLUGS)[number];
  }> = [
      { keywords: ["visa", "passport", "immigration", "e-visa", "evisa", "consulate", "embassy"], slug: "visa-immigration" },
      { keywords: ["flight", "airline", "aviation", "airport", "airfare", "boeing", "airbus", "dgca"], slug: "flight-aviation" },
      { keywords: ["hotel", "resort", "accommodation", "booking", "check-in", "hostel", "airbnb"], slug: "hotel-accommodation" },
      { keywords: ["advisory", "warning", "alert", "safety", "security", "danger", "caution"], slug: "travel-advisory" },
      { keywords: ["government", "ministry", "policy", "scheme", "initiative", "modi", "budget"], slug: "government-initiatives" },
      { keywords: ["luxury", "premium", "five-star", "exclusive", "boutique", "spa"], slug: "luxury-travel" },
      { keywords: ["budget", "cheap", "affordable", "backpack", "hostel", "free"], slug: "budget-travel" },
      { keywords: ["trek", "adventure", "hiking", "climbing", "rafting", "safari", "camping"], slug: "adventure-trekking" },
      { keywords: ["wellness", "ayurveda", "yoga", "spa", "meditation", "retreat", "healing"], slug: "wellness-ayurveda" },
      { keywords: ["heritage", "temple", "monument", "culture", "unesco", "ancient", "historical"], slug: "heritage-culture" },
      { keywords: ["wildlife", "tiger", "national park", "sanctuary", "bird", "elephant", "forest"], slug: "wildlife-nature" },
      { keywords: ["food", "cuisine", "restaurant", "culinary", "street food", "recipe"], slug: "food-cuisine" },
      { keywords: ["train", "railway", "irctc", "road trip", "highway", "bus"], slug: "rail-road-travel" },
      { keywords: ["cruise", "ship", "ferry", "waterway", "houseboat", "sailing"], slug: "cruise-waterways" },
      { keywords: ["app", "technology", "digital", "ai", "startup", "tech", "online"], slug: "travel-technology" },
      { keywords: ["solo", "female", "women", "single", "independent"], slug: "solo-female-travel" },
      { keywords: ["family", "kids", "children", "parent", "school holiday"], slug: "family-travel" },
      { keywords: ["honeymoon", "couple", "romantic", "wedding", "anniversary"], slug: "honeymoon-romance" },
      { keywords: ["currency", "exchange", "rupee", "dollar", "forex", "money", "cost"], slug: "currency-finance" },
    ];

  // Segment detection rules with scoring and expanded keywords
  const segmentRules: Array<{ keywords: string[]; segment: TravelSegment }> = [
    {
      segment: "ENTERPRISE",
      keywords: [
        "skift", "aviation", "airline", "airbus", "boeing", "ceo", "shares",
        "revenue", "acquisition", "merger", "hospitality", "b2b", "industry",
        "market", "hotel industry", "carrier", "pilot bidding", "fleet",
        "quarterly", "profit", "competitor", "business travel"
      ]
    },
    {
      segment: "OUTBOUND",
      keywords: [
        "abroad", "international", "passport", "visa-free", "visa free", "schengen",
        "traveling abroad", "transit", "europe", "japan", "us", "uk", "spain",
        "france", "gulf", "chase", "amex", "membership rewards", "sapphire",
        "lounge", "miami", "global entry", "flights to", "flight to", "destinations",
        "vacation", "points", "miles", "rewards"
      ]
    },
    {
      segment: "INBOUND",
      keywords: [
        "inbound", "visit india", "come to india", "foreign tourist", "tourist arrivals",
        "e-visa", "evisa", "incredible india", "india inbound", "welcome to india",
        "foreign visitors", "foreign travelers"
      ]
    },
    {
      segment: "DOMESTIC",
      keywords: [
        "domestic", "india", "indian", "delhi", "mumbai", "goa", "kerala",
        "ladakh", "irctc", "railways", "national park", "road trip", "highway",
        "local tourism", "staycation"
      ]
    }
  ];

  // Find best matching category
  let bestCategory = "destination-guides";
  let bestScore = 0;
  for (const rule of categoryRules) {
    const score = rule.keywords.reduce(
      (sum, kw) => sum + (text.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.slug;
    }
  }

  // Find segment based on scoring
  const scores: Record<TravelSegment, number> = {
    ENTERPRISE: 0,
    OUTBOUND: 0,
    INBOUND: 0,
    DOMESTIC: 0,
    GLOBAL: 0
  };

  for (const rule of segmentRules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    scores[rule.segment] = score;
  }

  let bestSegment: TravelSegment = "DOMESTIC";
  let highestScore = 0;
  for (const [seg, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestSegment = seg as TravelSegment;
    }
  }

  return {
    categorySlug: bestCategory,
    categoryConfidence: Math.min(0.7, bestScore * 0.15),
    segment: bestSegment,
    segmentConfidence: highestScore > 0 ? 0.6 : 0.4,
    sentiment: 0,
    tone: "PROFESSIONAL_BUDDY",
    suggestedTags: [],
    seoTitle: title.slice(0, 70),
    seoDescription: summary.slice(0, 160),
    seoKeywords: [],
    summary: summary.slice(0, 500),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Basic HTML stripping without loading full Cheerio.
 * Used for prompt content truncation only.
 */
function stripHtmlBasic(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Clamps a numeric value to a min/max range with a default fallback.
 */
function clampNumber(
  value: unknown,
  min: number,
  max: number,
  defaultValue: number
): number {
  if (typeof value !== "number" || isNaN(value)) return defaultValue;
  return Math.max(min, Math.min(max, value));
}

/**
 * Non-blocking delay for rate limiting between API calls.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
