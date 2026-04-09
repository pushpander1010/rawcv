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
  // Use pdfjs-dist directly — more reliable in serverless than pdf-parse wrapper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdfjsLib: any;
  try {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  } catch {
    pdfjsLib = await import("pdfjs-dist");
  }

  const getDocument = pdfjsLib.getDocument ?? pdfjsLib.default?.getDocument;
  if (!getDocument) throw new Error("pdfjs-dist getDocument not found");

  const loadingTask = getDocument({ data: new Uint8Array(buffer) });
  const doc = await loadingTask.promise;

  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageText = content.items.map((item: any) => item.str ?? "").join(" ");
    pages.push(pageText);
  }

  return pages.join("\n").trim();
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
      (formData.get("model") as ModelId | null) ?? "groq-llama-3.1-8b";

    if (!file) {
      return NextResponse.json({ error: "NO_FILE" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "FILE_TOO_LARGE" }, { status: 400 });
    }

    /* -------- TEXT -------- */
    let rawText = await extractText(file);

    if (!rawText || rawText.length < 20) {
      return NextResponse.json(
        { error: "NO_TEXT_EXTRACTED" },
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
    });
  } catch (err) {
    return NextResponse.json(
      { error: "SERVER_ERROR", detail: String(err) },
      { status: 500 }
    );
  }
}