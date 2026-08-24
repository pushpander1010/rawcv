/** Shared PDF generation via Puppeteer — used by /api/export and /api/export-free */

export async function generatePdf(html: string): Promise<Buffer> {
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
        "--single-process",
        "--font-render-hinting=none",
      ],
    });
  }

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");

  const pdfBuffer = Buffer.from(
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
  return pdfBuffer;
}

export function safeFileName(name: string | undefined): string {
  const safe = (name || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return safe || "resume";
}
