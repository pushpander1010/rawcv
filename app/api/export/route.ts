import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ThemeId, TailorChange } from "@/types";
import { applyChanges, renderThemeHtml } from "@/lib/theme-renderer";
import { requireAuth } from "@/lib/api-guard";

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
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--font-render-hinting=none", // sharper font rendering
      ],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Ensure fonts are loaded before capturing
    await page.evaluateHandle("document.fonts.ready");

    pdfBuffer = Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,    // needed for coloured sidebar themes
        tagged: true,             // embeds structure tags → selectable text on mobile
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        preferCSSPageSize: false,
        scale: 0.98,              // slight scale-down reduces file size without visible quality loss
      })
    );
    await browser.close();
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: "export_failed", message: "Failed to generate PDF. Please try again." },
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

