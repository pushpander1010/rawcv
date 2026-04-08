import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getUserByEmail, setPasswordResetToken } from "@/lib/user-store";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "missing_email", message: "Email is required." }, { status: 400 });
  }

  // Always return success to avoid email enumeration
  const user = await getUserByEmail(email);
  // Allow reset for any registered user (verified or not — they may have lost access before verifying)
  if (user) {
    const token = randomUUID();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await setPasswordResetToken(email, token, expiry);
    console.log("[forgot-password] token set for:", email, "| verified:", user.emailVerified);
    try {
      await sendPasswordResetEmail(email, user.name, token);
      console.log("[forgot-password] email sent to:", email);
    } catch (err) {
      console.error("[forgot-password] email send failed:", err);
      return NextResponse.json(
        { message: "Reset email could not be sent. Please try again.", debug: String(err) },
        { status: 500 }
      );
    }
  } else {
    console.log("[forgot-password] no user found for:", email);
  }

  return NextResponse.json({
    message: "If that email is registered, you'll receive a reset link shortly.",
  });
}
