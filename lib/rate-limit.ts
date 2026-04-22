/**
 * Distributed rate limiter backed by Upstash Redis.
 *
 * Requires two env vars (set in Vercel dashboard + .env.local):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * When those vars are absent (local dev without Redis) the module falls back
 * to the original in-memory Map so development still works without any setup.
 *
 * The public API is identical to the old in-memory version so no call-sites
 * need to change:
 *   rateLimit(key, limit, windowMs) → { allowed, retryAfter }
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── In-memory fallback (dev / missing env vars) ─────────────────────────────

interface Entry { count: number; resetAt: number }
const memStore = new Map<string, Entry>();

function memRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = memStore.get(key);

  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

// ─── Upstash Redis client (lazy singleton) ────────────────────────────────────

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

// ─── Upstash Ratelimit cache (one limiter per window size) ───────────────────
// Upstash's sliding-window algorithm maps cleanly to the windowMs + limit params.

const limiterCache = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  const cacheKey = `${limit}:${windowMs}`;
  if (limiterCache.has(cacheKey)) return limiterCache.get(cacheKey)!;

  const limiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
    analytics: false,
    prefix: "rawcv:rl",
  });
  limiterCache.set(cacheKey, limiter);
  return limiter;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const limiter = getLimiter(limit, windowMs);

  // No Redis configured — use in-memory fallback
  if (!limiter) {
    return memRateLimit(key, limit, windowMs);
  }

  const { success, reset } = await limiter.limit(key);
  const retryAfter = success ? 0 : Math.ceil((reset - Date.now()) / 1000);
  return { allowed: success, retryAfter };
}

/** Extract best-effort client IP from Next.js request headers */
export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
