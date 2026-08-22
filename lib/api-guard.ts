import { NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";

const MAX_JD_LENGTH = 8000;
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

/**
 * Public guard — replaces the old auth guard. The app is now a free, no-login
 * service. Every AI route is rate-limited per IP (via Upstash Redis when
 * configured, in-memory fallback otherwise) to prevent abuse and keep the
 * service stable under high concurrent traffic.
 *
 * Returns `{ userId }` (userId = hashed client IP) on success, or a 429
 * NextResponse when the caller has exceeded the limit.
 */
export async function publicGuard(
  req: Request,
  opts?: { limit?: number; windowMs?: number }
): Promise<{ userId: string } | NextResponse> {
  const ip = getIp(req);
  const limit = opts?.limit ?? 20; // 20 calls / minute by default
  const windowMs = opts?.windowMs ?? 60 * 1000;

  const { allowed, retryAfter } = await rateLimit(`pub:${ip}`, limit, windowMs);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  return { userId: ip };
}

/** Alias for publicGuard — all routes are now public with rate limiting */
export const requireAuth = publicGuard;

export function sanitiseJD(jd: unknown): string {
  if (typeof jd !== "string") return "";
  return jd.trim().slice(0, MAX_JD_LENGTH);
}

export function sanitiseMessages(
  messages: unknown
): Array<{ role: "user" | "assistant"; content: string }> | null {
  if (!Array.isArray(messages)) return null;
  const valid = messages
    .filter(m => m && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(0, MAX_MESSAGES)
    .map(m => ({ role: m.role as "user" | "assistant", content: (m.content as string).slice(0, MAX_MESSAGE_LENGTH) }));
  return valid.length > 0 ? valid : null;
}
