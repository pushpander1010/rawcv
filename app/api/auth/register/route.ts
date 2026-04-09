import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { createUser, getUserByEmail, updateUser } from "@/lib/user-store";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "missing_fields", message: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "email_in_use", message: "This email is already registered." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = randomUUID();

  await createUser({
    email,
    name,
    hashedPassword,
    emailVerified: false,
    verificationToken,
  });

  const skipEmail = process.env.NODE_ENV === "development" && process.env.SKIP_EMAIL_VERIFICATION === "true";

  if (skipEmail) {
    // Auto-verify in dev when SKIP_EMAIL_VERIFICATION=true (no Resend needed)
    await updateUser(email, { emailVerified: true, verificationToken: undefined });
    return NextResponse.json(
      { message: "Account created. You can now sign in." },
      { status: 201 }
    );
  }

  // Send verification email via Resend
  try {
    await sendVerificationEmail(email, name, verificationToken);
  } catch (err) {
    console.error("[register] Failed to send verification email:", err);
    return NextResponse.json(
      {
        error: "email_send_failed",
        message: `Account created but verification email failed: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 201 }
    );
  }

  return NextResponse.json(
    { message: "Account created. Please check your email to verify your account." },
    { status: 201 }
  );
}

