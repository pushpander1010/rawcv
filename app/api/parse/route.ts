import { NextRequest, NextResponse } from "next/server";
import type { ModelId, ParsedResume } from "@/types";
import { createProvider } from "@/lib/ai-providers";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

/* ---------------- PDF + OCR ---------------- */
async function extractPdfText(buffer: Buffer) {
  try {
    const pdfModule = await import("pdf-parse");
    const pdfFn = (pdfModule as any).default || pdfModule;

    const data = await pdfFn(buffer);
    let text = data?.text || "";

    console.log("[PDF TEXT LENGTH]:", text.length);

    // OCR fallback
    if (!text.trim()) {
      console.log("[OCR] Running fallback...");

      try {
        const Tesseract = await import("tesseract.js");
        const result = await Tesseract.recognize(buffer, "eng");

        text = result.data.text || "";
        console.log("[OCR TEXT LENGTH]:", text.length);
      } catch (ocrErr) {
        console.error("[OCR FAILED]:", ocrErr);
      }
    }

    return text;
  } catch (err) {
    console.error("[PDF FAILED]:", err);
    throw err;
  }
}

/* ---------------- DOCX ---------------- */
async function extractDocxText(buffer: Buffer) {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer});

    const text = result.value || "";
    console.log("[DOCX TEXT LENGTH]:", text.length);

    return text;
  } catch (err) {
    console.error("[DOCX FAILED]:", err);
    throw err;
  }
}

/* ---------------- EXTRACT ---------------- */
async function extractText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);

  return buffer.toString("utf-8");
}

/* ---------------- CLEAN JSON ---------------- */
function cleanJson(text: string) {
  return text.replace(/```json|```/g, "").trim();
}

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

/* ---------------- API ---------------- */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
    }

    /* -------- TEXT EXTRACTION -------- */
    let rawText = "";
    try {
      rawText = await extractText(file);
    } catch (err) {
      return NextResponse.json(
        {
          error: "EXTRACTION_FAILED",
          detail: String(err),
        },
        { status: 422 }
      );
    }

    if (!rawText || rawText.length < 20) {
      return NextResponse.json(
        {
          error: "NO_TEXT_EXTRACTED",
          debug: {
            length: rawText?.length || 0,
            hint: "Likely scanned PDF or unsupported format",
          },
        },
        { status: 422 }
      );
    }

    /* -------- AI PARSE -------- */
    let parsed = null;

    try {
      const provider = createProvider("groq-llama-3.1-8b");

      const response = await provider.complete(
        rawText.slice(0, 15000), // 🔥 prevent token overflow
        `Return ONLY JSON resume data. No explanation.`
      );

      const cleaned = cleanJson(response);
      parsed = safeParse(cleaned);
    } catch (err) {
      console.error("[AI FAILED]:", err);
    }

    /* -------- FINAL RESPONSE -------- */
    return NextResponse.json({
      success: true,
      parsed: parsed || null,
      rawPreview: rawText.slice(0, 500),
      debug: {
        textLength: rawText.length,
        parsedSuccess: !!parsed,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "UNKNOWN_ERROR",
        detail: String(err),
      },
      { status: 500 }
    );
  }
}