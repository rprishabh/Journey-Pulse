module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "isPrismaConnectionError",
    ()=>isPrismaConnectionError,
    "isPrismaKnownError",
    ()=>isPrismaKnownError,
    "isPrismaValidationError",
    ()=>isPrismaValidationError,
    "prisma",
    ()=>prisma,
    "prismaErrorToHttpStatus",
    ()=>prismaErrorToHttpStatus,
    "prismaErrorToMessage",
    ()=>prismaErrorToMessage
]);
// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Prisma Client Singleton
// Zero connection-leak handling via global singleton pattern
// skills.md §1: Deep error boundaries for all background workers
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
// ═══════════════════════════════════════════════════════════════════════════════
// CONNECTION POOL CONFIGURATION
// Optimized for high-read / low-write replication (skills.md §1)
// ═══════════════════════════════════════════════════════════════════════════════
const PRISMA_CLIENT_OPTIONS = {
    log: ("TURBOPACK compile-time truthy", 1) ? [
        {
            level: "query",
            emit: "event"
        },
        {
            level: "error",
            emit: "stdout"
        },
        {
            level: "warn",
            emit: "stdout"
        }
    ] : "TURBOPACK unreachable"
};
// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL SINGLETON — PREVENTS CONNECTION LEAKS
// In Next.js dev mode, hot-reload creates new PrismaClient instances on every
// file change. This global cache ensures only ONE client is ever instantiated.
// In production, the module-level singleton is sufficient.
// ═══════════════════════════════════════════════════════════════════════════════
const globalForPrisma = globalThis;
function createPrismaClient() {
    const pool = globalForPrisma.pgPool ?? new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["default"].Pool({
        connectionString: process.env.DATABASE_URL
    });
    if ("TURBOPACK compile-time truthy", 1) {
        globalForPrisma.pgPool = pool;
    }
    const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaPg"](pool);
    const client = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
        ...PRISMA_CLIENT_OPTIONS,
        adapter
    });
    // ── Connection lifecycle hooks ────────────────────────────────────────
    client.$connect().catch((error)=>{
        console.error("[PrismaClient] ❌ Failed to establish database connection:", error);
    // Do NOT throw — let queries fail individually with proper error boundaries
    // rather than crashing the entire process on startup.
    });
    // ── Graceful shutdown handlers ────────────────────────────────────────
    // Prevents connection pool exhaustion on process termination
    const shutdownHandler = async (signal)=>{
        console.log(`[PrismaClient] 🔌 Received ${signal}. Disconnecting Prisma Client...`);
        await client.$disconnect();
        await pool.end();
        process.exit(0);
    };
    // Only attach shutdown handlers once (check prevents duplicate listeners
    // during dev hot-reload cycles)
    if (!globalForPrisma.prisma) {
        process.on("SIGINT", ()=>shutdownHandler("SIGINT"));
        process.on("SIGTERM", ()=>shutdownHandler("SIGTERM"));
        process.on("beforeExit", async ()=>{
            await client.$disconnect();
            await pool.end();
        });
    }
    return client;
}
const prisma = globalForPrisma.prisma ?? createPrismaClient();
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
function isPrismaKnownError(error) {
    return error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Prisma"].PrismaClientKnownRequestError;
}
function isPrismaConnectionError(error) {
    return error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Prisma"].PrismaClientInitializationError;
}
function isPrismaValidationError(error) {
    return error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Prisma"].PrismaClientValidationError;
}
function prismaErrorToHttpStatus(error) {
    if (isPrismaKnownError(error)) {
        switch(error.code){
            case "P2000":
                return 400;
            case "P2001":
                return 404;
            case "P2002":
                return 409;
            case "P2003":
                return 409;
            case "P2025":
                return 404;
            default:
                return 500;
        }
    }
    if (isPrismaValidationError(error)) {
        return 400;
    }
    if (isPrismaConnectionError(error)) {
        return 503;
    }
    return 500;
}
function prismaErrorToMessage(error) {
    if (isPrismaKnownError(error)) {
        switch(error.code){
            case "P2000":
                return "The provided value is too long for this field.";
            case "P2001":
                return "The requested record was not found.";
            case "P2002":
                {
                    const target = error.meta?.target?.join(", ") ?? "field";
                    return `A record with this ${target} already exists.`;
                }
            case "P2003":
                return "This operation references a record that does not exist.";
            case "P2025":
                return "The record you are trying to update or delete was not found.";
            default:
                return "A database error occurred. Please try again later.";
        }
    }
    if (isPrismaValidationError(error)) {
        return "Invalid data provided. Please check your request and try again.";
    }
    if (isPrismaConnectionError(error)) {
        return "Database service is temporarily unavailable. Please try again later.";
    }
    return "An unexpected error occurred. Please try again later.";
}
const __TURBOPACK__default__export__ = prisma;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/errors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Error Boundary Utilities
// skills.md §1: Deep error boundaries and data fallback loops
// ─────────────────────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM ERROR CLASSES
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * Base application error with HTTP status code and operational classification.
 * Operational errors are expected (bad input, not found) and safely reportable.
 * Non-operational errors are bugs that require logging and generic responses.
 */ __turbopack_context__.s([
    "AppError",
    ()=>AppError,
    "BadRequestError",
    ()=>BadRequestError,
    "ConflictError",
    ()=>ConflictError,
    "ExternalServiceError",
    ()=>ExternalServiceError,
    "ForbiddenError",
    ()=>ForbiddenError,
    "NotFoundError",
    ()=>NotFoundError,
    "RateLimitError",
    ()=>RateLimitError,
    "ServiceUnavailableError",
    ()=>ServiceUnavailableError,
    "UnauthorizedError",
    ()=>UnauthorizedError,
    "UnprocessableError",
    ()=>UnprocessableError,
    "serializeError",
    ()=>serializeError,
    "withErrorBoundary",
    ()=>withErrorBoundary,
    "withRetry",
    ()=>withRetry,
    "withTimeout",
    ()=>withTimeout
]);
class AppError extends Error {
    statusCode;
    isOperational;
    code;
    details;
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", isOperational = true, details){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
class BadRequestError extends AppError {
    constructor(message = "Bad request", details){
        super(message, 400, "BAD_REQUEST", true, details);
    }
}
class UnauthorizedError extends AppError {
    constructor(message = "Authentication required"){
        super(message, 401, "UNAUTHORIZED", true);
    }
}
class ForbiddenError extends AppError {
    constructor(message = "Access denied"){
        super(message, 403, "FORBIDDEN", true);
    }
}
class NotFoundError extends AppError {
    constructor(resource = "Resource"){
        super(`${resource} not found`, 404, "NOT_FOUND", true);
    }
}
class ConflictError extends AppError {
    constructor(message = "Resource conflict"){
        super(message, 409, "CONFLICT", true);
    }
}
class UnprocessableError extends AppError {
    constructor(message = "Unprocessable entity", details){
        super(message, 422, "UNPROCESSABLE", true, details);
    }
}
class RateLimitError extends AppError {
    constructor(retryAfterSeconds = 60){
        super("Rate limit exceeded. Please try again later.", 429, "RATE_LIMITED", true, {
            retryAfter: retryAfterSeconds
        });
    }
}
class ServiceUnavailableError extends AppError {
    constructor(service = "Service"){
        super(`${service} is temporarily unavailable. Please try again later.`, 503, "SERVICE_UNAVAILABLE", true);
    }
}
class ExternalServiceError extends AppError {
    serviceName;
    originalError;
    constructor(serviceName, message, originalError){
        super(`[${serviceName}] ${message}`, 502, "EXTERNAL_SERVICE_ERROR", true);
        this.serviceName = serviceName;
        this.originalError = originalError;
    }
}
async function withErrorBoundary(operation, operationName) {
    try {
        const result = await operation();
        return [
            result,
            null
        ];
    } catch (error) {
        // Already classified — pass through
        if (error instanceof AppError) {
            console.error(`[ErrorBoundary:${operationName}] Operational error:`, error.message);
            return [
                null,
                error
            ];
        }
        // Generic JS Error — classify as internal
        if (error instanceof Error) {
            console.error(`[ErrorBoundary:${operationName}] Unhandled error:`, error.message);
            console.error(error.stack);
            return [
                null,
                new AppError(("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable", 500, "INTERNAL_ERROR", false)
            ];
        }
        // Unknown thrown value
        console.error(`[ErrorBoundary:${operationName}] Unknown error:`, error);
        return [
            null,
            new AppError("An unexpected error occurred", 500, "UNKNOWN_ERROR", false)
        ];
    }
}
async function withRetry(operation, operationName, maxRetries = 3, baseDelayMs = 1000, shouldRetry = isRetryableError) {
    let lastError;
    for(let attempt = 0; attempt <= maxRetries; attempt++){
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            if (attempt === maxRetries || !shouldRetry(error, attempt)) {
                break;
            }
            const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
            console.warn(`[Retry:${operationName}] Attempt ${attempt + 1}/${maxRetries} failed. ` + `Retrying in ${Math.round(delay)}ms...`, error instanceof Error ? error.message : error);
            await sleep(delay);
        }
    }
    throw lastError;
}
/**
 * Determines if an error is transient and worth retrying.
 * Network timeouts, connection resets, and 5xx upstream errors are retryable.
 * Validation errors, auth errors, and 4xx client errors are NOT retryable.
 */ function isRetryableError(error, _attempt) {
    if (error instanceof AppError) {
        // Don't retry operational client errors
        if (error.isOperational && error.statusCode < 500) return false;
        // Retry 5xx operational errors (upstream, DB)
        return error.statusCode >= 500;
    }
    if (error instanceof Error) {
        const retryablePatterns = [
            "ECONNRESET",
            "ECONNREFUSED",
            "ETIMEDOUT",
            "ENOTFOUND",
            "EAI_AGAIN",
            "EPIPE",
            "socket hang up",
            "network timeout",
            "fetch failed",
            "aborted"
        ];
        return retryablePatterns.some((pattern)=>error.message.toLowerCase().includes(pattern.toLowerCase()) || error.code === pattern);
    }
    return false;
}
async function withTimeout(promise, timeoutMs, operationName) {
    let timeoutHandle;
    const timeoutPromise = new Promise((_resolve, reject)=>{
        timeoutHandle = setTimeout(()=>{
            reject(new ExternalServiceError(operationName, `Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
    });
    try {
        const result = await Promise.race([
            promise,
            timeoutPromise
        ]);
        clearTimeout(timeoutHandle);
        return result;
    } catch (error) {
        clearTimeout(timeoutHandle);
        throw error;
    }
}
// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════════════
/** Non-blocking delay for retry backoff */ function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function serializeError(error) {
    if (error instanceof AppError) {
        return {
            name: error.constructor.name,
            message: error.message,
            code: error.code,
            stack: ("TURBOPACK compile-time truthy", 1) ? error.stack : "TURBOPACK unreachable"
        };
    }
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            code: "UNKNOWN",
            stack: ("TURBOPACK compile-time truthy", 1) ? error.stack : "TURBOPACK unreachable"
        };
    }
    return {
        name: "UnknownError",
        message: String(error),
        code: "UNKNOWN"
    };
}
}),
"[project]/lib/api-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "apiCreated",
    ()=>apiCreated,
    "apiError",
    ()=>apiError,
    "apiPaginatedSuccess",
    ()=>apiPaginatedSuccess,
    "apiSuccess",
    ()=>apiSuccess,
    "parseBooleanParam",
    ()=>parseBooleanParam,
    "parseDateParam",
    ()=>parseDateParam,
    "parseEnumParam",
    ()=>parseEnumParam,
    "parsePagination",
    ()=>parsePagination,
    "parseSortOrder",
    ()=>parseSortOrder
]);
// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — Standardized API Response Helpers
// Consistent envelope format for all /app/api/* route handlers
// ─────────────────────────────────────────────────────────────────────────────
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function apiSuccess(data, meta, status = 200) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        data,
        meta: meta ? {
            ...meta,
            timestamp: new Date().toISOString()
        } : {
            timestamp: new Date().toISOString()
        }
    }, {
        status,
        headers: {
            "X-Request-Timestamp": new Date().toISOString()
        }
    });
}
function apiPaginatedSuccess(data, totalCount, page, pageSize) {
    const totalPages = Math.ceil(totalCount / pageSize);
    return apiSuccess(data, {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    });
}
function apiCreated(data) {
    return apiSuccess(data, undefined, 201);
}
function apiError(error) {
    // ── AppError (our custom hierarchy) ───────────────────────────────────
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AppError"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: ("TURBOPACK compile-time truthy", 1) ? error.details : "TURBOPACK unreachable"
            }
        }, {
            status: error.statusCode
        });
    }
    // ── Prisma errors ─────────────────────────────────────────────────────
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrismaKnownError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrismaConnectionError"])(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrismaValidationError"])(error)) {
        const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prismaErrorToHttpStatus"])(error);
        const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prismaErrorToMessage"])(error);
        // Log the actual Prisma error for debugging, but return safe message
        console.error("[API] Prisma error:", (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeError"])(error));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                code: "DATABASE_ERROR",
                message
            }
        }, {
            status
        });
    }
    // ── Generic Error ─────────────────────────────────────────────────────
    if (error instanceof Error) {
        console.error("[API] Unhandled error:", error.message, error.stack);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: ("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable"
            }
        }, {
            status: 500
        });
    }
    // ── Unknown thrown value ──────────────────────────────────────────────
    console.error("[API] Unknown error:", error);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        error: {
            code: "UNKNOWN_ERROR",
            message: "An unexpected error occurred. Please try again later."
        }
    }, {
        status: 500
    });
}
function parsePagination(searchParams) {
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10) || 20));
    const skip = (page - 1) * pageSize;
    return {
        page,
        pageSize,
        skip
    };
}
function parseEnumParam(value, validValues) {
    if (!value) return undefined;
    const upper = value.toUpperCase();
    return validValues.includes(upper) ? upper : undefined;
}
function parseBooleanParam(value) {
    if (value === null || value === "") return undefined;
    return value === "true" || value === "1";
}
function parseDateParam(value) {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
}
function parseSortOrder(value, allowedFields, defaultField = "createdAt", defaultDirection = "desc") {
    const field = value && allowedFields.includes(value) ? value : defaultField;
    return {
        field,
        direction: defaultDirection
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/news/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// ─────────────────────────────────────────────────────────────────────────────
// TravelPulse India — /api/news — News Articles API
// GET: Paginated, filterable article listing with self-healing fetch
// Production-grade Next.js App Router API route
// ─────────────────────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-response.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/errors.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const dynamic = "force-dynamic";
const revalidate = 0;
// ═══════════════════════════════════════════════════════════════════════════════
// SELF-HEALING FETCH — Auto-populates DB when empty (Vercel Free Plan)
// Uses in-memory lock to prevent concurrent fetch storms
// ═══════════════════════════════════════════════════════════════════════════════
let isFetchInProgress = false;
let lastAutoFetchAt = 0;
// Minimum interval between auto-fetch triggers (1 hour in ms)
const AUTO_FETCH_COOLDOWN_MS = 60 * 60 * 1000;
/**
 * Triggers an RSS fetch cycle in the background if:
 * 1. No articles exist in the DB (first deployment scenario)
 * 2. OR last auto-fetch was more than 1 hour ago (stale data recovery)
 * 3. AND no fetch is currently in progress (concurrency guard)
 *
 * This is the "free plan" alternative to Vercel cron jobs.
 * The fetch runs in the background — the current request still returns immediately.
 */ async function triggerSelfHealingFetch(articleCount) {
    const now = Date.now();
    const timeSinceLastFetch = now - lastAutoFetchAt;
    // Only trigger if DB is empty or cooldown has elapsed
    const shouldFetch = (articleCount === 0 || timeSinceLastFetch > AUTO_FETCH_COOLDOWN_MS) && !isFetchInProgress;
    if (!shouldFetch) return;
    // Set lock immediately to prevent concurrent triggers
    isFetchInProgress = true;
    lastAutoFetchAt = now;
    console.log(`[NewsFeed:SelfHeal] 🔄 Auto-triggering RSS fetch (articles=${articleCount}, lastFetch=${timeSinceLastFetch}ms ago)`);
    // Fire-and-forget — don't block the API response
    __turbopack_context__.A("[project]/lib/news-fetcher.ts [app-route] (ecmascript, async loader)").then(({ runFetchCycle })=>runFetchCycle()).then((result)=>{
        console.log(`[NewsFeed:SelfHeal] ✅ Auto-fetch complete: ${result.totalNewArticles} new articles from ${result.totalSources} sources`);
    }).catch((error)=>{
        console.error("[NewsFeed:SelfHeal] ❌ Auto-fetch failed:", error instanceof Error ? error.message : error);
    }).finally(()=>{
        isFetchInProgress = false;
    });
}
async function GET(request) {
    const [data, error] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withErrorBoundary"])(async ()=>{
        const { searchParams } = request.nextUrl;
        // ── Parse query parameters ──────────────────────────────────────────
        const { page, pageSize, skip } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePagination"])(searchParams);
        const category = searchParams.get("category");
        const segment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseEnumParam"])(searchParams.get("segment"), [
            "INBOUND",
            "OUTBOUND",
            "DOMESTIC",
            "ENTERPRISE",
            "GLOBAL"
        ]);
        const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseEnumParam"])(searchParams.get("status"), [
            "DRAFT",
            "PUBLISHED",
            "ARCHIVED",
            "FLAGGED"
        ]);
        const source = searchParams.get("source");
        const isFeatured = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseBooleanParam"])(searchParams.get("featured"));
        const search = searchParams.get("q");
        const fromDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDateParam"])(searchParams.get("from"));
        const toDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseDateParam"])(searchParams.get("to"));
        const tag = searchParams.get("tag");
        const sortBy = searchParams.get("sort") ?? "publishedAt";
        const sortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";
        // ── Build dynamic WHERE clause ──────────────────────────────────────
        const where = {};
        if (segment) {
            where.segment = segment;
        }
        if (status) {
            where.status = status;
        }
        if (category) {
            where.category = {
                slug: category
            };
        }
        if (source) {
            where.OR = [
                {
                    sourceName: {
                        contains: source,
                        mode: "insensitive"
                    }
                },
                {
                    newsSource: {
                        slug: source
                    }
                }
            ];
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        if (search) {
            where.AND = [
                ...Array.isArray(where.AND) ? where.AND : where.AND ? [
                    where.AND
                ] : [],
                {
                    OR: [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            summary: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            seoKeywords: {
                                has: search.toLowerCase()
                            }
                        }
                    ]
                }
            ];
        }
        if (fromDate || toDate) {
            where.publishedAt = {};
            if (fromDate) where.publishedAt.gte = fromDate;
            if (toDate) where.publishedAt.lte = toDate;
        }
        if (tag) {
            where.tags = {
                some: {
                    slug: tag
                }
            };
        }
        // ── Build ORDER BY ──────────────────────────────────────────────────
        const allowedSortFields = [
            "publishedAt",
            "fetchedAt",
            "viewCount",
            "shareCount",
            "createdAt"
        ];
        const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : "publishedAt";
        const orderBy = {
            [resolvedSortBy]: sortOrder
        };
        // ── Execute query with count ────────────────────────────────────────
        const [articles, totalCount] = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].article.findMany({
                where,
                orderBy,
                skip,
                take: pageSize,
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    summary: true,
                    coverImageUrl: true,
                    sourceUrl: true,
                    sourceName: true,
                    sourceLogoUrl: true,
                    author: true,
                    publishedAt: true,
                    status: true,
                    segment: true,
                    tone: true,
                    readTimeMinutes: true,
                    viewCount: true,
                    isFeatured: true,
                    isPinned: true,
                    seoTitle: true,
                    seoDescription: true,
                    // ── Relations the frontend needs ──────────────────────────────
                    category: {
                        select: {
                            name: true,
                            slug: true,
                            iconName: true,
                            colorHex: true
                        }
                    },
                    tags: {
                        select: {
                            name: true,
                            slug: true
                        }
                    }
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].article.count({
                where
            })
        ]);
        // ── Self-Healing: Auto-trigger fetch if DB is empty or stale ────────
        // Runs in the background — does NOT block this response
        triggerSelfHealingFetch(totalCount).catch(()=>{
        // Silently ignore — self-healing is best-effort
        });
        return {
            articles,
            totalCount,
            page,
            pageSize
        };
    }, "GET:/api/news");
    if (error) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiError"])(error);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiPaginatedSuccess"])(data.articles, data.totalCount, data.page, data.pageSize);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1nxfeum._.js.map