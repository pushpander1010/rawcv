import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume } from "@/types";
import { complete } from "@/lib/ai-providers";
import { requireAuth } from "@/lib/api-guard";
import { chargeCredits } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SIZE = 5 * 1024 * 1024;

/* ---------------- HARD SAFE NORMALIZER ---------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeParsed(data: any): ParsedResume {
  return {
    contact: {
      name:     data?.contact?.name     ?? "",
      email:    data?.contact?.email    ?? "",
      phone:    data?.contact?.phone    ?? "",
      location: data?.contact?.location ?? "",
      linkedin: data?.contact?.linkedin ?? "",
      website:  data?.contact?.website  ?? "",
    },
    summary: data?.summary ?? "",
    experience: Array.isArray(data?.experience)
      ? data.experience.map((e: any) => ({
          company:   e?.company   ?? "",
          title:     e?.title     ?? "",
          startDate: e?.startDate ?? "",
          endDate:   e?.endDate   ?? "",
          bullets:   Array.isArray(e?.bullets) ? e.bullets : [],
        }))
      : [],
    education: Array.isArray(data?.education)
      ? data.education.map((e: any) => ({
          institution:    e?.institution    ?? "",
          degree:         e?.degree         ?? "",
          field:          e?.field          ?? "",
          graduationYear: e?.graduationYear ?? "",
        }))
      : [],
    skills:         Array.isArray(data?.skills)         ? data.skills         : [],
    certifications: Array.isArray(data?.certifications) ? data.certifications : [],
    projects: Array.isArray(data?.projects)
      ? data.projects.map((p: any) => ({
          name:         p?.name         ?? "",
          description:  p?.description  ?? "",
          technologies: Array.isArray(p?.technologies) ? p.technologies : [],
        }))
      : [],
  };
}

/* ---------------- PDF ---------------- */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mupdf = await import("mupdf") as any;
  const doc = mupdf.Document.openDocument(buffer, "application/pdf");
  let text = "";
  for (let i = 0; i < doc.countPages(); i++) {
    const page = doc.loadPage(i);
    text += page.toStructuredText("preserve-whitespace").asText() + "\n";
  }
  return text.trim();
}

/* ---------------- DOCX ---------------- */
async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

/* ---------------- EXTRACT ---------------- */
async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf"))  return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);
  return buffer.toString("utf-8");
}

/* ---------------- API ---------------- */
const SYSTEM_PROMPT = `You are a resume parser. Extract ALL information from the resume text and return a JSON object with this exact structure:
{
  "contact": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
  "summary": "",
  "experience": [{ "company": "", "title": "", "startDate": "", "endDate": "", "bullets": [""] }],
  "education": [{ "institution": "", "degree": "", "field": "", "graduationYear": "" }],
  "skills": [""],
  "certifications": [""],
  "projects": [{ "name": "", "description": "", "technologies": [""] }]
}
Extract every job, every bullet point, every skill. Use empty string for missing fields, empty array for missing arrays.`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    void formData.get("model");

    if (!file) {
      return NextResponse.json({ error: "NO_FILE", message: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "FILE_TOO_LARGE", message: "File exceeds 5 MB limit." }, { status: 400 });
    }

    /* ── Extract text ── */
    let rawText: string;
    try {
      rawText = await extractText(file);
      console.log("[parse] extracted", rawText.length, "chars from", file.name);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error("[parse] extraction failed:", detail);
      return NextResponse.json(
        { error: "EXTRACTION_FAILED", message: "Could not read this file. Try saving as PDF or TXT." },
        { status: 422 }
      );
    }

    if (!rawText || rawText.length < 20) {
      return NextResponse.json(
        { error: "NO_TEXT_EXTRACTED", message: "No readable text found in this file." },
        { status: 422 }
      );
    }

    /* ── Charge credits before AI work ── */
    const chargeError = await chargeCredits("Resume parse");
    if (chargeError) return chargeError;

    /* ── AI parse ── */
    let parsed: ParsedResume;
    try {
      const prompt = `Parse this resume:\n\n${rawText.slice(0, 12000)}`;
      const result = await complete(prompt, SYSTEM_PROMPT, { maxTokens: 2000 });
      console.log("[parse] result — experience:", (result as any)?.experience?.length, "skills:", (result as any)?.skills?.length);
      parsed = normalizeParsed(result);
    } catch (err) {
      console.error("[parse] AI failed:", err);
      parsed = normalizeParsed({});
    }

    return NextResponse.json({ success: true, parsed, raw: rawText });
  } catch (err) {
    console.error("[parse] unexpected error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
