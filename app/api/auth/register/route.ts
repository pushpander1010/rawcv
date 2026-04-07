import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getUserByEmail, createUser } from "@/lib/user-store";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "missing_fields", message: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "email_in_use", message: "This email is already registered." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = randomUUID();

  createUser({
    id: randomUUID(),
    email,
    name,
    hashedPassword,
    emailVerified: false,
    verificationToken,
  });

  // In production, send a verification email here.
  // For development, we auto-verify so the flow can be tested end-to-end.
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    const { updateUser } = await import("@/lib/user-store");
    updateUser(email, { emailVerified: true, verificationToken: undefined });
  }

  return NextResponse.json(
    {
      message: isDev
        ? "Account created. You can now sign in."
        : "Account created. Please check your email to verify your account.",
      verificationToken: isDev ? undefined : verificationToken,
    },
    { status: 201 }
  );
}
