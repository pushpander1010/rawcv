import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // No auth protection — all routes are public
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
