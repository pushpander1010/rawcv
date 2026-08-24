import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ThemeId } from "@/types";
import { renderThemeHtml } from "@/lib/theme-renderer";
import { generatePdf, safeFileName } from "@/lib/pdf-export";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Free export — no auth, no tailor changes. Used by /build. */
export async function POST(req: NextRequest) {
  let body: { parsed: ParsedResume; theme: ThemeId };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed, theme } = body;
  if (!parsed || !theme) {
    return NextResponse.json({ error: "missing_fields", message: "parsed and theme are required" }, { status: 400 });
  }

  let html: string;
  try {
    html = renderThemeHtml(parsed, theme);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "render_failed", message: `Failed to render resume: ${message}` }, { status: 500 });
  }

  try {
    const pdfBuffer = await generatePdf(html);
    const filename = `${safeFileName(parsed.contact?.name)}-resume.pdf`;
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
    return NextResponse.json(
      { error: "export_failed", message: "PDF generation failed. Falling back to print dialog.", fallbackHtml: html, detail: message },
      { status: 500 }
    );
  }
}
