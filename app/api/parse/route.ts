import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume } from "@/types";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

// ─── File extraction ──────────────────────────────────────────────────────────

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

async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf"))  return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);
  return buffer.toString("utf-8");
}

// ─── Minimal contact extraction ───────────────────────────────────────────────
// Just pull the obvious fields from the raw text so the preview shows something.

function extractContact(raw: string): ParsedResume["contact"] {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const email    = raw.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/)?.[0] ?? "";
  const phone    = raw.match(/(\+?[\d][\d\s\-().]{6,}[\d])/)?.[1]?.trim() ?? "";
  const linkedin = raw.match(/linkedin\.com\/in\/[\w%-]+/i)?.[0] ?? "";
  const website  = raw.match(/https?:\/\/(?!linkedin\.com)[^\s,)<>"]+/i)?.[0] ?? "";
  const location = raw.match(/([A-Z][a-zA-Z\s]{2,20},\s*[A-Z]{2}(?:\s+\d{5})?)/)?.[1] ?? "";

  // Name: first short line that looks like a person's name
  let name = "";
  for (const line of lines.slice(0, 8)) {
    if (/[@:/|\\]/.test(line) || /^\d/.test(line) || line.length > 60) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 &&
        words.every(w => /^[A-Za-z.'-]{1,20}$/.test(w))) {
      name = line;
      break;
    }
  }

  return { name, email, phone, location, linkedin, website };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "NO_FILE", message: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "FILE_TOO_LARGE", message: "File exceeds 5 MB limit." }, { status: 400 });
    }

    let rawText: string;
    try {
      rawText = await extractText(file);
    } catch {
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

    const contact = extractContact(rawText);

    // Put the full raw text as the summary so the user can see and edit everything.
    // The AI features (ATS, suggestions, chat) all work from the raw text anyway.
    const parsed: ParsedResume = {
      contact,
      summary:        rawText,   // full text — user can clean up via chat
      experience:     [],
      education:      [],
      skills:         [],
      certifications: [],
      projects:       [],
    };

    console.log("[parse] extracted", rawText.length, "chars, name:", contact.name);

    return NextResponse.json({ success: true, parsed, raw: rawText });
  } catch (err) {
    console.error("[parse] unexpected error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
