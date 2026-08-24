import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Disabled — all routes are public. Redirects handled in next.config.mjs
  matcher: [],
};
