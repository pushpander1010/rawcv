import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";

// Rate limit NextAuth credential login endpoint
async function handleLoginRateLimit(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfter } = await rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  return null; // allowed
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle CORS preflight for all API routes
  if (pathname.startsWith("/api/") && req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://www.rawcv.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Rate limit login POST to NextAuth credentials callback
  if (
    pathname === "/api/auth/callback/credentials" &&
    req.method === "POST"
  ) {
    const blocked = await handleLoginRateLimit(req);
    if (blocked) return blocked;
  }

  // Rate limit direct login endpoint if used
  if (pathname === "/api/auth/signin/credentials" && req.method === "POST") {
    const blocked = await handleLoginRateLimit(req);
    if (blocked) return blocked;
  }

  // Pass through to NextAuth middleware for protected routes
  const { default: nextAuthMiddleware } = await import("next-auth/middleware");
  return (nextAuthMiddleware as any)(req, {} as any);
}

export const config = {
  matcher: [
    "/analyze/:path*",
    "/tailor/:path*",
    "/themes/:path*",
    "/chat/:path*",
    "/credits/:path*",
    "/international/:path*",
    // Also match auth endpoints for rate limiting
    "/api/auth/callback/credentials",
    "/api/auth/signin/credentials",
  ],
};
