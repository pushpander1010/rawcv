import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ThemeId, TailorChange } from "@/types";
import { applyChanges, renderThemeHtml } from "@/lib/theme-renderer";
import { requireAuth } from "@/lib/api-guard";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: { parsed: ParsedResume; theme: ThemeId; changes?: TailorChange[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const { parsed, theme, changes } = body;

  if (!parsed || !theme) {
    return NextResponse.json(
      { error: "missing_fields", message: "parsed and theme are required" },
      { status: 400 }
    );
  }

  // Merge accepted tailor changes into the final resume
  const finalResume = applyChanges(parsed, changes);

  // Render themed HTML
  const html = renderThemeHtml(finalResume, theme);

  // Generate PDF via puppeteer
  let pdfBuffer: Buffer;
  try {
    let browser;
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      const chromium = await import("@sparticuz/chromium-min");
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(
          "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
        ),
        headless: true,
      });
    } else {
      const puppeteer = await import("puppeteer");
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
    const page = await browser.newPage();
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
    await browser.close();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PDF generation failed:", message);
    // Return the HTML so the client can fall back to print dialog
    return NextResponse.json(
      { error: "export_failed", message, fallbackHtml: html },
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
}

