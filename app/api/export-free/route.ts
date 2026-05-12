import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ThemeId } from "@/types";
import { renderThemeHtml } from "@/lib/theme-renderer";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Free export endpoint — no authentication required
 * Used by the free resume builder (/build) to generate PDFs without login
 */
export async function POST(req: NextRequest) {
  console.log("[export-free] Request received");

  let body: { parsed: ParsedResume; theme: ThemeId };
  try {
    body = await req.json();
    console.log("[export-free] Body parsed, theme:", body?.theme, "hasParsed:", !!body?.parsed);
  } catch (err) {
    console.error("[export-free] JSON parse error:", err);
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const { parsed, theme } = body;

  if (!parsed || !theme) {
    console.error("[export-free] Missing fields:", { hasParsed: !!parsed, hasTheme: !!theme });
    return NextResponse.json(
      { error: "missing_fields", message: "parsed and theme are required" },
      { status: 400 }
    );
  }

  try {
    console.log("[export-free] Rendering themed HTML...");

    // Render themed HTML
    let html: string;
    try {
      html = renderThemeHtml(parsed, theme);
      console.log("[export-free] HTML rendered, length:", html.length);
    } catch (renderErr) {
      console.error("[export-free] Theme render error:", renderErr);
      return NextResponse.json(
        { error: "render_error", message: "Failed to render resume theme" },
        { status: 500 }
      );
    }

    // Try to generate PDF via Puppeteer
    let pdfBuffer: Buffer | null = null;
    try {
      const { generatePdf } = await import("@/lib/pdf-generator");
      pdfBuffer = await generatePdf(html);
      console.log("[export-free] PDF generated, size:", pdfBuffer.byteLength);
    } catch (puppeteerErr) {
      console.warn("[export-free] Puppeteer unavailable, falling back to HTML print:", puppeteerErr);
      // Return HTML for print fallback
      return NextResponse.json(
        { fallbackHtml: html },
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("[export-free] Unexpected error:", err);
    return NextResponse.json(
      { error: "internal_error", message: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
