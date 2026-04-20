/**
 * Generates PNG versions of logo and OG image for Google/Bing indexing.
 * SVGs are not supported as OG images or Organization logos by search engines.
 *
 * Run: node scripts/generate-og-images.mjs
 * Output: public/logo.png (512x512), public/og-image.png (1200x630)
 */

import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

// ─── Logo PNG (512×512) ───────────────────────────────────────────────────────
function generateLogo() {
  const size = 512;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background — rounded square (simulate with filled rect + clip)
  const radius = 96;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = "#7c3aed";
  ctx.fill();
  ctx.clip();

  // Document icon — white paper
  ctx.fillStyle = "white";
  ctx.beginPath();
  const docX = 140, docY = 100, docW = 180, docH = 240, docR = 16;
  ctx.moveTo(docX + docR, docY);
  ctx.lineTo(docX + docW - docR, docY);
  ctx.quadraticCurveTo(docX + docW, docY, docX + docW, docY + docR);
  ctx.lineTo(docX + docW, docY + docH - docR);
  ctx.quadraticCurveTo(docX + docW, docY + docH, docX + docW - docR, docY + docH);
  ctx.lineTo(docX + docR, docY + docH);
  ctx.quadraticCurveTo(docX, docY + docH, docX, docY + docH - docR);
  ctx.lineTo(docX, docY + docR);
  ctx.quadraticCurveTo(docX, docY, docX + docR, docY);
  ctx.closePath();
  ctx.fill();

  // Lines on document
  const lineColor = "#7c3aed";
  const lines = [
    { y: 160, w: 120 },
    { y: 190, w: 140 },
    { y: 220, w: 100 },
    { y: 250, w: 130 },
    { y: 280, w: 80 },
  ];
  lines.forEach(({ y, w }) => {
    ctx.fillStyle = lineColor;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.roundRect(docX + 20, y, w, 12, 6);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // "rawcv" text below document
  ctx.fillStyle = "white";
  ctx.font = "bold 72px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("rawcv", size / 2, 410);

  const buffer = canvas.toBuffer("image/png");
  writeFileSync(join(publicDir, "logo.png"), buffer);
  console.log("✅ public/logo.png generated (512×512)");
}

// ─── OG Image PNG (1200×630) ──────────────────────────────────────────────────
function generateOgImage() {
  const W = 1200, H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0f0a1e";
  ctx.fillRect(0, 0, W, H);

  // Gradient blob (radial)
  const grad = ctx.createRadialGradient(600, 315, 0, 600, 315, 500);
  grad.addColorStop(0, "rgba(124,58,237,0.35)");
  grad.addColorStop(1, "rgba(37,99,235,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // ── Left side: branding ──────────────────────────────────────────────────
  // Logo icon (small document)
  ctx.fillStyle = "#7c3aed";
  ctx.beginPath();
  ctx.roundRect(80, 160, 56, 72, 8);
  ctx.fill();
  // lines on mini doc
  [[180, 40], [195, 32], [210, 24]].forEach(([y, w]) => {
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.roundRect(88, y, w, 6, 3);
    ctx.fill();
  });

  // "rawcv" wordmark
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 80px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("rawcv", 80, 310);

  // Tagline
  ctx.fillStyle = "#a78bfa";
  ctx.font = "28px system-ui, sans-serif";
  ctx.fillText("AI-Powered Resume Platform", 80, 355);

  // Divider
  ctx.fillStyle = "rgba(124,58,237,0.5)";
  ctx.fillRect(80, 375, 480, 2);

  // Feature bullets
  ctx.fillStyle = "#94a3b8";
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillText("ATS Score · JD Match · AI Enhancement", 80, 415);
  ctx.fillText("Resume Builder · PDF Export", 80, 445);

  // URL
  ctx.fillStyle = "#6366f1";
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("www.rawcv.com", 80, 580);

  // ── Right side: resume card mockup ───────────────────────────────────────
  const cardX = 680, cardY = 80, cardW = 440, cardH = 470;

  // Card shadow
  ctx.shadowColor = "rgba(124,58,237,0.4)";
  ctx.shadowBlur = 40;
  ctx.fillStyle = "#1e1b4b";
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Card header bar
  ctx.fillStyle = "#7c3aed";
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, 80, [16, 16, 0, 0]);
  ctx.fill();

  // Name placeholder
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.roundRect(cardX + 20, cardY + 20, 120, 14, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.roundRect(cardX + 20, cardY + 42, 80, 10, 5);
  ctx.fill();

  // Content lines
  const sections = [
    { y: 180, label: true, lines: [380, 320, 360] },
    { y: 250, label: true, lines: [380, 300, 340] },
    { y: 320, label: true, lines: [200, 180] },
  ];
  sections.forEach(({ y, label, lines: lns }) => {
    if (label) {
      ctx.fillStyle = "rgba(124,58,237,0.8)";
      ctx.beginPath();
      ctx.roundRect(cardX + 20, cardY + y - cardY, 60, 8, 4);
      ctx.fill();
    }
    lns.forEach((w, i) => {
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.roundRect(cardX + 20, cardY + y - cardY + 18 + i * 14, w, 6, 3);
      ctx.fill();
    });
  });

  // Skill chips
  ["React", "TypeScript", "Node.js"].forEach((skill, i) => {
    const chipX = cardX + 20 + i * 100;
    ctx.fillStyle = "rgba(124,58,237,0.4)";
    ctx.beginPath();
    ctx.roundRect(chipX, cardY + 390, 90, 22, 11);
    ctx.fill();
    ctx.fillStyle = "#a78bfa";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(skill, chipX + 45, cardY + 406);
  });
  ctx.textAlign = "left";

  // ATS badge
  ctx.fillStyle = "rgba(16,185,129,0.15)";
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX + 20, cardY + 430, 110, 32, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ATS Score: 92", cardX + 75, cardY + 451);
  ctx.textAlign = "left";

  const buffer = canvas.toBuffer("image/png");
  writeFileSync(join(publicDir, "og-image.png"), buffer);
  console.log("✅ public/og-image.png generated (1200×630)");
}

generateLogo();
generateOgImage();
console.log("\nDone! Update layout.tsx and page.tsx to reference .png instead of .svg");
