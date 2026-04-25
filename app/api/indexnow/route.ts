import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow, submitBatchToIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/indexnow
 * Submit URLs to IndexNow for instant search engine indexing
 * 
 * Body: { url: string } or { urls: string[] }
 */
export async function POST(req: NextRequest) {
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

    // Single URL submission
    if (body.url && typeof body.url === "string") {
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
