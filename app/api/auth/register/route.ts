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

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // Skip email in dev — auto-verify so you can test locally without Resend
    await updateUser(email, { emailVerified: true, verificationToken: undefined });
    return NextResponse.json(
      { message: "Account created. You can now sign in." },
      { status: 201 }
    );
  }

  // Production: send verification email via Resend
  try {
    await sendVerificationEmail(email, name, verificationToken);
  } catch (err) {
    console.error("[register] Failed to send verification email:", err);
    // Don't block registration — user can request a resend later
  }

  return NextResponse.json(
    { message: "Account created. Please check your email to verify your account." },
    { status: 201 }
  );
}
