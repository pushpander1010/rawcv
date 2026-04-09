import { NextRequest, NextResponse } from "next/server";
import { getUserByVerificationToken, updateUser } from "@/lib/user-store";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  const user = await getUserByVerificationToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  if (user.emailVerified) {
    // Already verified — just send them to login
    return NextResponse.redirect(new URL("/login?verified=1", req.url));
  }

  await updateUser(user.email, {
    emailVerified: true,
    verificationToken: undefined,
  });

  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}

