import { NextRequest, NextResponse } from "next/server";
import type { ModelId, ParsedResume } from "@/types";
import { createProvider } from "@/lib/ai-providers";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

/* ---------------- NORMALIZER (CRITICAL FIX) ---------------- */
function normalizeParsed(data: any): ParsedResume {
  return {
    contact: {
      name: data?.contact?.name || "",
      email: data?.contact?.email || "",
      phone: data?.contact?.phone || "",
      location: data?.contact?.location || "",
      linkedin: data?.contact?.linkedin || "",
      website: data?.contact?.website || "",
    },
    summary: data?.summary || "",
    experience: Array.isArray(data?.experience) ? data.experience : [],
    education: Array.isArray(data?.education) ? data.education : [],
    skills: Array.isArray(data?.skills) ? data.skills : [],
    certifications: Array.isArray(data?.certifications) ? data.certifications : [],
    projects: Array.isArray(data?.projects) ? data.projects : [],
  };
}

/* ---------------- PDF + OCR ---------------- */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfModule = await import("pdf-parse");
    const pdfFn = (pdfModule as any).default || pdfModule;

    const data = await pdfFn(buffer);
    let text = data?.text || "";

    console.log("[PDF TEXT]:", text.length);

    if (!text.trim()) {
      console.log("[OCR] fallback...");

      try {
        const Tesseract = await import("tesseract.js");
        const result = await Tesseract.recognize(buffer, "eng");

        text = result.data.text || "";
        console.log("[OCR TEXT]:", text.length);
      } catch (err) {
        console.error("[OCR FAILED]:", err);
      }
    }

    return text;
  } catch (err) {
    console.error("[PDF ERROR]:", err);
    throw err;
  }
}

/* ---------------- DOCX ---------------- */
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });

    const text = result.value || "";
    console.log("[DOCX TEXT]:", text.length);

    return text;
  } catch (err) {
    console.error("[DOCX ERROR]:", err);
    throw err;
  }
}

/* ---------------- EXTRACT ---------------- */
async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);

  const text = buffer.toString("utf-8");
  console.log("[TXT TEXT]:", text.length);

  return text;
}

/* ---------------- JSON CLEAN ---------------- */
function cleanJson(text: string): string {
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

/* ---------------- PROMPT ---------------- */
const SYSTEM_PROMPT = `
Extract resume into STRICT JSON.

RULES:
- ALWAYS include ALL fields
- Use "" or [] if missing
- NO explanation
- NO markdown

Schema:
{
  "contact": { "name": string, "email": string, "phone": string, "location": string, "linkedin": string, "website": string },
  "summary": string,
  "experience": [],
  "education": [],
  "skills": [],
  "certifications": [],
  "projects": []
}
`;

/* ---------------- API ---------------- */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const modelId =
      (formData.get("model") as ModelId | null) ?? "groq-llama-3.1-8b";

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
        { error: "EXTRACTION_FAILED", detail: String(err) },
        { status: 422 }
      );
    }

    if (!rawText || rawText.length < 20) {
      return NextResponse.json(
        {
          error: "NO_TEXT_EXTRACTED",
          debug: { length: rawText.length },
        },
        { status: 422 }
      );
    }

    /* -------- AI PARSE -------- */
    let parsed: ParsedResume | null = null;

    try {
      const provider = createProvider(modelId);

      const response = await provider.complete(
        rawText.slice(0, 15000),
        SYSTEM_PROMPT
      );

      const cleaned = cleanJson(response);
      const rawParsed = safeParse(cleaned);

      parsed = normalizeParsed(rawParsed || {});
    } catch (err) {
      console.error("[AI ERROR]:", err);
      parsed = normalizeParsed({});
    }

    /* -------- RESPONSE -------- */
    return NextResponse.json({
      success: true,
      parsed,
      rawPreview: rawText.slice(0, 500),
      debug: {
        textLength: rawText.length,
        hasContact: !!parsed.contact.name,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "UNKNOWN_ERROR", detail: String(err) },
      { status: 500 }
    );
  }
}