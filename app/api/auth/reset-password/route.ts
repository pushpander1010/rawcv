export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByValidResetToken, updateUser, clearPasswordResetToken } from "@/lib/user-store";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = await rateLimit(`reset-password:${getIp(req)}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const { token, password } = await req.json();

  if (!token || !password || password.length < 8) {
    return NextResponse.json(
      { error: "invalid_input", message: "Token and a password of at least 8 characters are required." },
      { status: 400 }
    );
  }

  // Single atomic query: validates token AND expiry together
  const user = await getUserByValidResetToken(token);
  if (!user) {
    return NextResponse.json({ error: "invalid_token", message: "Invalid or expired reset link." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await updateUser(user.email, { hashedPassword });
  await clearPasswordResetToken(user.email);

  return NextResponse.json({ message: "Password updated. You can now sign in." });
}

