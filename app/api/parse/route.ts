import { NextRequest, NextResponse } from "next/server";
import type { ModelId, ParsedResume } from "@/types";
import { createProvider } from "@/lib/ai-providers";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

/* ---------------- HARD SAFE NORMALIZER ---------------- */
function normalizeParsed(data: any): ParsedResume {
  return {
    contact: {
      name: data?.contact?.name ?? "",
      email: data?.contact?.email ?? "",
      phone: data?.contact?.phone ?? "",
      location: data?.contact?.location ?? "",
      linkedin: data?.contact?.linkedin ?? "",
      website: data?.contact?.website ?? "",
    },
    summary: data?.summary ?? "",
    experience: Array.isArray(data?.experience)
      ? data.experience.map((e: any) => ({
          company: e?.company ?? "",
          title: e?.title ?? "",
          startDate: e?.startDate ?? "",
          endDate: e?.endDate ?? "",
          bullets: Array.isArray(e?.bullets) ? e.bullets : [],
        }))
      : [],
    education: Array.isArray(data?.education)
      ? data.education.map((e: any) => ({
          institution: e?.institution ?? "",
          degree: e?.degree ?? "",
          field: e?.field ?? "",
          graduationYear: e?.graduationYear ?? "",
        }))
      : [],
    skills: Array.isArray(data?.skills) ? data.skills : [],
    certifications: Array.isArray(data?.certifications) ? data.certifications : [],
    projects: Array.isArray(data?.projects)
      ? data.projects.map((p: any) => ({
          name: p?.name ?? "",
          description: p?.description ?? "",
          technologies: Array.isArray(p?.technologies) ? p.technologies : [],
        }))
      : [],
  };
}

/* ---------------- PDF ---------------- */
async function extractPdfText(buffer: Buffer): Promise<string> {
  // mupdf = same engine as Python's PyMuPDF (fitz) — handles image PDFs,
  // complex layouts, and embedded fonts far better than pdfjs-dist.
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
async function extractDocxText(buffer: Buffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

/* ---------------- EXTRACT ---------------- */
async function extractText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);

  return buffer.toString("utf-8");
}

/* ---------------- JSON SAFE ---------------- */
function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  }
}

/* ---------------- API ---------------- */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const modelId =
      (formData.get("model") as ModelId | null) ?? "openrouter-liquid-1.2b";

    if (!file) {
      return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
    }

    /* -------- TEXT -------- */
    let rawText: string;
    try {
      rawText = await extractText(file);
      console.log("[parse] extracted", rawText.length, "chars from", file.name);
    } catch (extractErr) {
      const detail = extractErr instanceof Error ? extractErr.message : String(extractErr);
      console.error("[parse] extraction threw:", detail);
      return NextResponse.json(
        { error: "EXTRACTION_FAILED", detail },
        { status: 422 }
      );
    }

    if (!rawText || rawText.length < 20) {
      console.warn("[parse] text too short:", rawText?.length ?? 0, "chars");
      return NextResponse.json(
        { error: "NO_TEXT_EXTRACTED", length: rawText?.length ?? 0 },
        { status: 422 }
      );
    }

    /* -------- AI -------- */
    let parsed: ParsedResume;

    try {
      const provider = createProvider(modelId);

      const response = await provider.complete(
        rawText.slice(0, 15000),
        `You are a resume parser. Extract structured information and return ONLY valid JSON matching this exact schema:
{
  "contact": { "name": string, "email": string, "phone": string, "location": string, "linkedin": string, "website": string },
  "summary": string,
  "experience": [{ "company": string, "title": string, "startDate": string, "endDate": string, "bullets": string[] }],
  "education": [{ "institution": string, "degree": string, "field": string, "graduationYear": string }],
  "skills": string[],
  "certifications": string[],
  "projects": [{ "name": string, "description": string, "technologies": string[] }]
}
Return ONLY the JSON object. No markdown, no explanation.`
      );

      const rawParsed = safeParse(response);
      parsed = normalizeParsed(rawParsed);
    } catch {
      parsed = normalizeParsed({});
    }

    return NextResponse.json({
      success: true,
      parsed,
      raw: rawText,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "SERVER_ERROR", detail: String(err) },
      { status: 500 }
    );
  }
}