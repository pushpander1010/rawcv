import { NextRequest, NextResponse } from "next/server";
import type { ModelId, ParsedResume } from "@/types";
import { createProvider } from "@/lib/ai-providers";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];

/* ---------------- PDF (TS + ESM SAFE) ---------------- */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfModule = await import("pdf-parse");

    // ✅ handles both ESM & CJS safely
    const pdfFn = (pdfModule as any).default || pdfModule;

    const data = await pdfFn(buffer);

    const text = data?.text || "";
    console.log("[parse] pdf chars:", text.length);

    return text;
  } catch (err) {
    console.error("[parse] pdf error:", err);
    throw err;
  }
}

/* ---------------- DOCX ---------------- */
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });

    const text = result.value || "";
    console.log("[parse] docx chars:", text.length);

    return text;
  } catch (err) {
    console.error("[parse] docx error:", err);
    throw err;
  }
}

/* ---------------- TEXT EXTRACTOR ---------------- */
async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);

  const text = buffer.toString("utf-8");
  console.log("[parse] txt chars:", text.length);

  return text;
}

/* ---------------- JSON CLEANER ---------------- */
function cleanJsonOutput(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

/* ---------------- SAFE JSON PARSER ---------------- */
function safeJsonParse(text: string): ParsedResume {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No valid JSON found");

    return JSON.parse(match[0]);
  }
}

/* ---------------- PROMPT ---------------- */
const SYSTEM_PROMPT = `You are a resume parser.

STRICT RULES:
- Output ONLY valid JSON
- NO markdown
- NO explanation
- NO extra text

Schema:
{
  "contact": { "name": string, "email": string, "phone"?: string, "location"?: string, "linkedin"?: string, "website"?: string },
  "summary"?: string,
  "experience": [{ "company": string, "title": string, "startDate": string, "endDate": string, "bullets": string[] }],
  "education": [{ "institution": string, "degree": string, "field": string, "graduationYear": string }],
  "skills": string[],
  "certifications"?: string[],
  "projects"?: [{ "name": string, "description": string, "technologies": string[] }]
}`;

/* ---------------- API ---------------- */
export async function POST(req: NextRequest) {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const modelId =
    (formData.get("model") as ModelId | null) ?? "groq-llama-3.1-8b";

  if (!file) {
    return NextResponse.json(
      { error: "missing_file", message: "No file provided" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "file_too_large", message: "Max 5MB allowed" },
      { status: 400 }
    );
  }

  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  const validType =
    ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);

  if (!validType) {
    return NextResponse.json(
      {
        error: "unsupported_format",
        message: "Upload PDF, DOCX or TXT only",
      },
      { status: 400 }
    );
  }

  /* -------- TEXT EXTRACTION -------- */
  let rawText: string;

  try {
    rawText = await extractText(file);

    if (!rawText.trim()) {
      return NextResponse.json(
        {
          error: "empty_text",
          message:
            "No text extracted. Likely scanned PDF. Upload text-based resume.",
        },
        { status: 422 }
      );
    }

    console.log("[parse] total chars:", rawText.length);
  } catch (err) {
    return NextResponse.json(
      {
        error: "parse_failed",
        message: "File parsing failed",
        detail: String(err),
      },
      { status: 422 }
    );
  }

  /* -------- AI PARSING -------- */
  let parsed: ParsedResume;

  try {
    const provider = createProvider(modelId);

    const response = await provider.complete(rawText, SYSTEM_PROMPT);

    console.log("[AI RAW]:", response.slice(0, 300));

    const cleaned = cleanJsonOutput(response);
    const json = safeJsonParse(cleaned);

    parsed = {
      ...json,
      experience: json.experience ?? [],
      education: json.education ?? [],
      skills: json.skills ?? [],
    };
  } catch (err) {
    console.error("[AI ERROR]:", err);

    return NextResponse.json(
      {
        error: "ai_failed",
        message: "AI parsing failed",
        detail: String(err),
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    parsed,
    rawPreview: rawText.slice(0, 500),
  });
}