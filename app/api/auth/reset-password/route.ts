import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByPasswordResetToken, updateUser, clearPasswordResetToken } from "@/lib/user-store";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password || password.length < 8) {
    return NextResponse.json(
      { error: "invalid_input", message: "Token and a password of at least 8 characters are required." },
      { status: 400 }
    );
  }

  const user = await getUserByPasswordResetToken(token);
  if (!user) {
    return NextResponse.json({ error: "invalid_token", message: "Invalid or expired reset link." }, { status: 400 });
  }

  // Check expiry
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.passwordResetExpiry || dbUser.passwordResetExpiry < new Date()) {
    return NextResponse.json({ error: "expired_token", message: "This reset link has expired. Please request a new one." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await updateUser(user.email, { hashedPassword });
  await clearPasswordResetToken(user.email);

  return NextResponse.json({ message: "Password updated. You can now sign in." });
}
