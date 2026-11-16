/**
 * Resume font inlining for server-side PDF rendering.
 *
 * The serverless Chromium ships with almost no fonts (Open Sans only), so any
 * system-font stack silently fell back and the downloaded PDF looked nothing
 * like the browser preview. The preview loads these exact woff2 files from
 * /fonts/rcv/*; here we swap those URLs for data URIs so Puppeteer renders the
 * identical glyphs with zero network fetches.
 */

import fs from "fs";
import path from "path";

const FONT_FILES = [
  "arimo.woff2",
  "gelasio.woff2",
  "carlito-400.woff2",
  "carlito-700.woff2",
  "tinos-400.woff2",
  "tinos-700.woff2",
];

const FONT_DIR = path.join("public", "fonts", "rcv");

let cache: Map<string, string> | null = null;

function loadFonts(): Map<string, string> {
  if (cache) return cache;
  const out = new Map<string, string>();
  // process.cwd() is the project root locally and /var/task on Vercel.
  const roots = [process.cwd(), path.join(process.cwd(), "..")];
  for (const file of FONT_FILES) {
    for (const root of roots) {
      try {
        const buf = fs.readFileSync(path.join(root, FONT_DIR, file));
        out.set(file, buf.toString("base64"));
        break;
      } catch {
        /* try the next root */
      }
    }
  }
  cache = out;
  return out;
}

/** True when every resume font could be read from disk. */
export function resumeFontsAvailable(): boolean {
  return loadFonts().size === FONT_FILES.length;
}

/** Replace /fonts/rcv/*.woff2 URLs with inline data URIs. */
export function inlineResumeFonts(html: string): string {
  const fonts = loadFonts();
  if (fonts.size === 0) return html;
  return html.replace(/url\('\/fonts\/rcv\/([^']+\.woff2)'\)/g, (match, file: string) => {
    const b64 = fonts.get(file);
    return b64 ? `url(data:font/woff2;base64,${b64})` : match;
  });
}
