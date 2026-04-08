import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { createUser, getUserByEmail, updateUser } from "@/lib/user-store";

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
    await updateUser(email, { emailVerified: true, verificationToken: undefined });
  }

  return NextResponse.json(
    {
      message: isDev
        ? "Account created. You can now sign in."
        : "Account created. Please check your email to verify your account.",
    },
    { status: 201 }
  );
}
