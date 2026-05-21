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
      const message = renderErr instanceof Error ? renderErr.message : String(renderErr);
      console.error("[export-free] Theme render error:", message);
      return NextResponse.json(
        { error: "render_error", message: "Failed to render resume theme" },
        { status: 500 }
      );
    }

    // Generate PDF via puppeteer
    let pdfBuffer: Buffer;
    try {
      let browser;
      const isProduction = process.env.NODE_ENV === "production";

      console.log("[export-free] Starting PDF generation, isProduction:", isProduction);

      if (isProduction) {
        try {
          const chromium = await import("@sparticuz/chromium-min");
          const puppeteer = await import("puppeteer-core");
          console.log("[export-free] Chromium and puppeteer-core loaded");

          const executablePath = await chromium.default.executablePath(
            "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
          );
          console.log("[export-free] Chromium executable path:", executablePath);

          browser = await puppeteer.default.launch({
            args: chromium.default.args,
            executablePath,
            headless: true,
          });
        } catch (importErr) {
          console.error("[export-free] Failed to import Chromium/Puppeteer:", importErr);
          // Fallback to print dialog if Chromium is not available
          return NextResponse.json(
            { error: "export_failed", message: "PDF generation not available. Using print dialog.", fallbackHtml: html },
            { status: 500 }
          );
        }
      } else {
        const puppeteer = await import("puppeteer");
        console.log("[export-free] Puppeteer loaded (dev mode)");
        browser = await puppeteer.default.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-extensions",
            "--single-process",
            "--font-render-hinting=none",
          ],
        });
      }

      console.log("[export-free] Browser launched");
      const page = await browser.newPage();
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.evaluateHandle("document.fonts.ready");

      pdfBuffer = Buffer.from(
        await page.pdf({
          format: "A4",
          printBackground: true,
          tagged: true,
          margin: { top: "0", right: "0", bottom: "0", left: "0" },
          preferCSSPageSize: false,
          scale: 0.98,
        })
      );
      console.log("[export-free] PDF generated, size:", pdfBuffer.length);
      await browser.close();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[export-free] PDF generation failed:", message, err);
      // Return the HTML so the client can fall back to print dialog
      return NextResponse.json(
        { error: "export_failed", message: "PDF generation failed. Falling back to print dialog.", fallbackHtml: html },
        { status: 500 }
      );
    }

    // Derive filename from contact name
    const safeName = (parsed.contact.name || "resume")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filename = `${safeName}-resume.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[export-free] Unexpected error:", message, stack);
    return NextResponse.json(
      { error: "export_failed", message: `An unexpected error occurred: ${message}` },
      { status: 500 }
    );
  }
}
