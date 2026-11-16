/** Shared PDF generation via Puppeteer — used by /api/export and /api/export-free */

import type { ResumeTypography } from "@/types";
import { inlineResumeFonts } from "@/lib/resume-fonts";

/**
 * Zero @page margins on purpose: the resume sheet paints its own density
 * padding (same CSS the preview uses), so every printed page starts and breaks
 * exactly where the A4 preview slice does — including page 2 and beyond.
 */
export function pdfMargins() {
  return { top: "0", right: "0", bottom: "0", left: "0" };
}

export async function generatePdf(
  html: string,
  typography?: ResumeTypography
): Promise<Buffer> {
  const isProduction = process.env.NODE_ENV === "production";
  let browser: any;

  if (isProduction) {
    const chromium = await import("@sparticuz/chromium-min");
    const puppeteer = await import("puppeteer-core");
    const executablePath = await chromium.default.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
    );
    browser = await puppeteer.default.launch({
      args: chromium.default.args,
      executablePath,
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
        "--font-render-hinting=none",
      ],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    // The document is fully self-contained (no webfonts, no remote assets), so
    // we only need the DOM — the old networkidle wait hung on blocked fonts.
    // Fonts are inlined as data URIs so nothing is fetched over the network,
    // but they still have to finish decoding before the page is printed.
    await page.setContent(inlineResumeFonts(html), { waitUntil: "load" });

    await Promise.race([
      page.evaluate(async () => {
        const faces = Array.from((document as any).fonts ?? []);
        await Promise.all(faces.map((f: any) => f.load?.().catch(() => {})));
        await (document as any).fonts?.ready;
      }),
      new Promise((resolve) => setTimeout(resolve, 6000)),
    ]);

    await page.emulateMediaType("print");

    const pdfBuffer = Buffer.from(
      await page.pdf({
        preferCSSPageSize: true, // @page { size: 210mm 297mm } from the renderer
        printBackground: true,
        tagged: true,
        margin: pdfMargins(),
      })
    );
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

export function safeFileName(name: string | undefined): string {
  const safe = (name || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return safe || "resume";
}
