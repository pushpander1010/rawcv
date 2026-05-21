import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ThemeId, TailorChange } from "@/types";
import { applyChanges, renderThemeHtml } from "@/lib/theme-renderer";
import { requireAuth } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  console.log("[export] Request received");
  
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    console.log("[export] Auth failed");
    return auth;
  }
  
  console.log("[export] Auth successful, userId:", (auth as any).userId);

  let body: { parsed: ParsedResume; theme: ThemeId; changes?: TailorChange[] };
  try {
    body = await req.json();
    console.log("[export] Body parsed, theme:", body?.theme, "hasParsed:", !!body?.parsed);
  } catch (err) {
    console.error("[export] JSON parse error:", err);
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const { parsed, theme, changes } = body;

  if (!parsed || !theme) {
    console.error("[export] Missing fields:", { hasParsed: !!parsed, hasTheme: !!theme });
    return NextResponse.json(
      { error: "missing_fields", message: "parsed and theme are required" },
      { status: 400 }
    );
  }

  try {
    console.log("[export] Applying changes...");
    // Merge accepted tailor changes into the final resume
    const finalResume = applyChanges(parsed, changes);
    console.log("[export] Changes applied");

    // Render themed HTML
    let html: string;
    try {
      console.log("[export] Rendering HTML for theme:", theme);
      console.log("[export] Resume data:", JSON.stringify({
        hasContact: !!finalResume.contact,
        contactName: finalResume.contact?.name,
        experienceCount: finalResume.experience?.length || 0,
        educationCount: finalResume.education?.length || 0,
        skillsCount: finalResume.skills?.length || 0,
      }));
      html = renderThemeHtml(finalResume, theme);
      console.log("[export] HTML rendered, length:", html.length);
    } catch (renderErr) {
      const message = renderErr instanceof Error ? renderErr.message : String(renderErr);
      const stack = renderErr instanceof Error ? renderErr.stack : undefined;
      console.error("[export] HTML rendering failed:", message);
      console.error("[export] Stack trace:", stack);
      console.error("[export] Resume data that caused error:", JSON.stringify(finalResume, null, 2));
      return NextResponse.json(
        { error: "render_failed", message: `Failed to render resume HTML: ${message}` },
        { status: 500 }
      );
    }

    // Generate PDF via puppeteer
    let pdfBuffer: Buffer;
    try {
      let browser;
      const isProduction = process.env.NODE_ENV === "production";
      
      console.log("[export] Starting PDF generation, isProduction:", isProduction);
      
      if (isProduction) {
        try {
          const chromium = await import("@sparticuz/chromium-min");
          const puppeteer = await import("puppeteer-core");
          console.log("[export] Chromium and puppeteer-core loaded");
          
          const executablePath = await chromium.default.executablePath(
            "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
          );
          console.log("[export] Chromium executable path:", executablePath);
          
          browser = await puppeteer.default.launch({
            args: chromium.default.args,
            executablePath,
            headless: true,
          });
        } catch (importErr) {
          console.error("[export] Failed to import Chromium/Puppeteer:", importErr);
          // Fallback to print dialog if Chromium is not available
          return NextResponse.json(
            { error: "export_failed", message: "PDF generation not available. Using print dialog.", fallbackHtml: html },
            { status: 500 }
          );
        }
      } else {
        const puppeteer = await import("puppeteer");
        console.log("[export] Puppeteer loaded (dev mode)");
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
      
      console.log("[export] Browser launched");
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
      console.log("[export] PDF generated, size:", pdfBuffer.length);
      await browser.close();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[export] PDF generation failed:", message, err);
      // Return the HTML so the client can fall back to print dialog
      return NextResponse.json(
        { error: "export_failed", message: "PDF generation failed. Falling back to print dialog.", fallbackHtml: html },
        { status: 500 }
      );
    }

    // Derive filename from contact name
    const safeName = (finalResume.contact.name || "resume")
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
    console.error("[export] Unexpected error:", message, stack);
    return NextResponse.json(
      { error: "export_failed", message: `An unexpected error occurred: ${message}` },
      { status: 500 }
    );
  }
}

