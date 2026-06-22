export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getUserByEmail, setPasswordResetToken } from "@/lib/user-store";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { logAuthFailure } from "@/lib/security-log";

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = await rateLimit(`forgot-password:${getIp(req)}`, 3, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "missing_email", message: "Email is required." }, { status: 400 });
  }

  // Always return the same success message to prevent account enumeration
  const user = await getUserByEmail(email);

  if (user) {
    // Log for internal monitoring but don't expose to client
    if (!user.emailVerified) {
      console.log("[forgot-password] Request for unverified account:", email);
    }

    if (user.emailVerified) {
      const token = randomUUID();
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await setPasswordResetToken(email, token, expiry);
      try {
        await sendPasswordResetEmail(email, user.name, token);
      } catch (err) {
        // Don't leak email send failures to client
        console.error("[forgot-password] Email send failed (silent):", err);
      }
    }
  }

  // Always return the same message regardless of whether user exists
  return NextResponse.json({
    message: "If that email is registered, you'll receive a reset link shortly.",
  });
}
