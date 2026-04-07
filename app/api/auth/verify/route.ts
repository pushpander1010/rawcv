import { NextRequest, NextResponse } from "next/server";
import { getUserByVerificationToken, updateUser } from "@/lib/user-store";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const user = getUserByVerificationToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  updateUser(user.email, { emailVerified: true, verificationToken: undefined });

  return NextResponse.redirect(new URL("/login?verified=true", req.url));
}
