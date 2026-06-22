/**
 * Security monitoring — log auth failures, track failed login attempts.
 *
 * Uses in-memory store (dev / no Redis) or Upstash Redis (production).
 * Exports:
 *   logAuthFailure(ip, email, reason)  — log + count
 *   isLockedOut(ip)                    — check if IP is locked out
 *   getFailedAttempts(ip)              — current count
 */

import { rateLimit } from "./rate-limit";

// ─── In-memory store (dev fallback) ───────────────────────────────────────────

interface AuthFailureEntry {
  count: number;
  firstAt: number;
  lastAt: number;
  lockedUntil: number | null;
}

const failStore = new Map<string, AuthFailureEntry>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const FAIL_WINDOW_MS = 15 * 60 * 1000; // 15 minutes tracking window

// ─── Public API ───────────────────────────────────────────────────────────────

export function logAuthFailure(
  ip: string,
  email: string,
  reason: string
): { locked: boolean; retryAfter: number } {
  const now = Date.now();
  const key = `auth-fail:${ip}`;
  const entry = failStore.get(key);

  if (!entry || now - entry.firstAt > FAIL_WINDOW_MS) {
    // Start fresh window
    const newEntry: AuthFailureEntry = {
      count: 1,
      firstAt: now,
      lastAt: now,
      lockedUntil: null,
    };
    failStore.set(key, newEntry);

    console.warn(
      `[SECURITY] Auth failure: ip=${ip} email=${email} reason=${reason} attempts=1`
    );
    return { locked: false, retryAfter: 0 };
  }

  entry.count++;
  entry.lastAt = now;

  console.warn(
    `[SECURITY] Auth failure: ip=${ip} email=${email} reason=${reason} attempts=${entry.count}`
  );

  if (entry.count >= MAX_ATTEMPTS && !entry.lockedUntil) {
    entry.lockedUntil = now + LOCKOUT_WINDOW_MS;
    const retryAfter = Math.ceil(LOCKOUT_WINDOW_MS / 1000);
    console.warn(
      `[SECURITY] ACCOUNT LOCKOUT: ip=${ip} locked for ${retryAfter}s after ${entry.count} failures`
    );
    return { locked: true, retryAfter };
  }

  if (entry.lockedUntil && now < entry.lockedUntil) {
    const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
    return { locked: true, retryAfter };
  }

  const remaining = MAX_ATTEMPTS - entry.count;
  return {
    locked: false,
    retryAfter: 0,
  };
}

export function isLockedOut(ip: string): {
  locked: boolean;
  retryAfter: number;
} {
  const key = `auth-fail:${ip}`;
  const entry = failStore.get(key);
  if (!entry) return { locked: false, retryAfter: 0 };

  if (entry.lockedUntil) {
    const now = Date.now();
    if (now < entry.lockedUntil) {
      return {
        locked: true,
        retryAfter: Math.ceil((entry.lockedUntil - now) / 1000),
      };
    }
    // Lockout expired, clear it
    entry.lockedUntil = null;
    entry.count = 0;
    entry.firstAt = now;
  }

  return { locked: false, retryAfter: 0 };
}

export function getFailedAttempts(ip: string): number {
  const key = `auth-fail:${ip}`;
  const entry = failStore.get(key);
  if (!entry) return 0;
  if (entry.lockedUntil && Date.now() > entry.lockedUntil) return 0;
  return entry.count;
}

/**
 * Record a successful login — clear the failure counter for this IP.
 */
export function clearFailures(ip: string): void {
  const key = `auth-fail:${ip}`;
  failStore.delete(key);
}
