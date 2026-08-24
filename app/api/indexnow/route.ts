import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow, submitBatchToIndexNow } from "@/lib/indexnow";
import { rateLimit, getIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/indexnow
 * Submit URLs to IndexNow for instant search engine indexing
 * 
 * Body: { url: string } or { urls: string[] }
 */
export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfter } = await rateLimit(`indexnow:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limited. Try again later." }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  }

  try {
    const key = process.env.INDEXNOW_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "IndexNow not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const host = "www.rawcv.com";
    const keyLocation = `https://${host}/${key}.txt`;
    const isAllowedUrl = (u: string): boolean => { try { const parsed = new URL(u); return parsed.hostname === "www.rawcv.com" && parsed.protocol === "https:"; } catch { return false; } };

    // Single URL submission
    if (body.url && typeof body.url === "string") {
      if (!isAllowedUrl(body.url)) return NextResponse.json({ error: "URL must be a https://www.rawcv.com URL" }, { status: 400 });
      const result = await submitToIndexNow(body.url, {
        host,
        key,
        keyLocation,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, submitted: 1 });
    }

    // Batch URL submission
    if (Array.isArray(body.urls)) {
      if (body.urls.length > 100) return NextResponse.json({ error: "Max 100 URLs per request" }, { status: 400 });
      for (const u of body.urls) { if (typeof u !== "string" || !isAllowedUrl(u)) return NextResponse.json({ error: `Invalid URL: ${String(u).slice(0, 80)}` }, { status: 400 }); }
      const result = await submitBatchToIndexNow(body.urls, {
        host,
        key,
        keyLocation,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        submitted: body.urls.length,
      });
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
