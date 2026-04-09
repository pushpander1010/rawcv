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

async function extractPdfText(buffer: Buffer): Promise<string> {
  // Use require() to hit the "require" export condition → CJS build with PDFParse class.
  // Dynamic import() would resolve the ESM entry which has a different shape.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const { PDFParse } = require("pdf-parse") as any;
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  return result?.text ?? "";
}

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  return buffer.toString("utf-8");
}

const SYSTEM_PROMPT = `You are a resume parser. Extract structured information from the provided resume text and return ONLY valid JSON matching the schema below. Do not include any explanation or markdown.

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
  const modelId = (formData.get("model") as ModelId | null) ?? "openrouter-gemma-4-27b";

  if (!file) {
    return NextResponse.json({ error: "missing_file", message: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "file_too_large", message: "File exceeds the 5 MB size limit" }, { status: 400 });
  }

  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  const validType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
  if (!validType) {
    return NextResponse.json(
      { error: "unsupported_format", message: "Unsupported file format. Please upload a PDF, DOCX, or TXT file." },
      { status: 400 }
    );
  }

  let rawText: string;
  try {
    rawText = await extractText(file);
    console.log("[parse] extracted chars:", rawText.length);
  } catch (err) {
    console.error("[parse] extraction error:", err);
    return NextResponse.json(
      { error: "parse_failed", message: "Could not extract text from the file. Try a different file or format." },
      { status: 422 }
    );
  }

  if (!rawText.trim()) {
    return NextResponse.json(
      { error: "parse_failed", message: "The file appears to be empty or unreadable. Try a different file." },
      { status: 422 }
    );
  }

  let parsed: ParsedResume;
  try {
    const provider = createProvider(modelId);
    const json = await provider.complete(rawText, SYSTEM_PROMPT);
    const raw_parsed = JSON.parse(json) as ParsedResume;
    // Ensure required arrays are never undefined
    parsed = {
      ...raw_parsed,
      experience: raw_parsed.experience ?? [],
      education: raw_parsed.education ?? [],
      skills: raw_parsed.skills ?? [],
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[parse] AI error:", detail);
    return NextResponse.json(
      {
        error: "ai_unavailable",
        message: "AI extraction failed. Please try again.",
        ...(process.env.NODE_ENV !== "production" && { detail }),
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ parsed, raw: rawText });
}

