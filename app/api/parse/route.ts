import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume } from "@/types";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

// ─── PDF extraction ───────────────────────────────────────────────────────────

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

// ─── DOCX extraction ──────────────────────────────────────────────────────────

async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

// ─── File router ──────────────────────────────────────────────────────────────

async function extractText(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf"))  return extractPdfText(buffer);
  if (name.endsWith(".docx")) return extractDocxText(buffer);
  return buffer.toString("utf-8");
}

// ─── Rule-based parser ────────────────────────────────────────────────────────

function parseResume(raw: string): ParsedResume {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // ── Contact ──────────────────────────────────────────────────────────────────
  const emailMatch  = raw.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/);
  const phoneMatch  = raw.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  const linkedinMatch = raw.match(/linkedin\.com\/in\/[\w-]+/i);
  const websiteMatch  = raw.match(/https?:\/\/(?!linkedin)[^\s,)>]+/i);

  // Name heuristic: first non-empty line that looks like a name (2–4 words, no @/:)
  let name = "";
  for (const line of lines.slice(0, 6)) {
    if (/[@:/|]/.test(line)) continue;
    if (/^\d/.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 && words.every(w => /^[A-Za-z.'-]+$/.test(w))) {
      name = line;
      break;
    }
  }

  // Location heuristic: line with city/state pattern
  const locationMatch = raw.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)/);

  const contact = {
    name,
    email:    emailMatch?.[0]    ?? "",
    phone:    phoneMatch?.[1]?.trim() ?? "",
    location: locationMatch?.[1] ?? "",
    linkedin: linkedinMatch?.[0] ?? "",
    website:  websiteMatch?.[0]  ?? "",
  };

  // ── Section detection ─────────────────────────────────────────────────────────
  const SECTION_HEADERS: Record<string, RegExp> = {
    summary:        /^(summary|profile|objective|about|professional\s+summary)/i,
    experience:     /^(experience|work\s+experience|employment|work\s+history|professional\s+experience)/i,
    education:      /^(education|academic|qualifications)/i,
    skills:         /^(skills|technical\s+skills|core\s+competencies|technologies|expertise)/i,
    certifications: /^(certifications?|certificates?|licenses?|credentials)/i,
    projects:       /^(projects?|personal\s+projects?|key\s+projects?)/i,
  };

  type SectionKey = keyof typeof SECTION_HEADERS;

  // Split raw text into sections
  const sections: Record<string, string[]> = {
    summary: [], experience: [], education: [],
    skills: [], certifications: [], projects: [],
  };

  let currentSection: SectionKey | null = null;

  for (const line of lines) {
    // Check if this line is a section header
    let matched: SectionKey | null = null;
    for (const [key, re] of Object.entries(SECTION_HEADERS)) {
      if (re.test(line) && line.length < 60) {
        matched = key as SectionKey;
        break;
      }
    }
    if (matched) {
      currentSection = matched;
      continue;
    }
    if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────────
  const summary = sections.summary.join(" ").trim();

  // ── Skills ────────────────────────────────────────────────────────────────────
  const skillsRaw = sections.skills.join(" ");
  const skills = skillsRaw
    .split(/[,|•·\n\/]/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && s.length < 60);

  // ── Certifications ────────────────────────────────────────────────────────────
  const certifications = sections.certifications
    .filter(l => l.length > 3)
    .map(l => l.replace(/^[-•*]\s*/, "").trim());

  // ── Experience ────────────────────────────────────────────────────────────────
  const DATE_RE = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})[a-z]*\.?\s*\d{0,4}/i;
  const DATE_RANGE_RE = new RegExp(
    `(${DATE_RE.source})[\\s\\-–—]+(${DATE_RE.source}|present|current|now)`,
    "i"
  );

  function parseExperienceBlocks(lines: string[]) {
    const jobs: ParsedResume["experience"] = [];
    let current: ParsedResume["experience"][0] | null = null;

    for (const line of lines) {
      const dateRange = line.match(DATE_RANGE_RE);
      // A line with a date range likely starts a new job entry
      if (dateRange) {
        if (current) jobs.push(current);
        const startDate = dateRange[1].trim();
        const endDate   = dateRange[2].trim();
        // Try to extract title and company from the same line or nearby
        const withoutDate = line.replace(DATE_RANGE_RE, "").replace(/[-–—|,]+/g, " ").trim();
        const parts = withoutDate.split(/\s{2,}|[|,]/).map(p => p.trim()).filter(Boolean);
        current = {
          title:     parts[0] ?? "",
          company:   parts[1] ?? "",
          startDate,
          endDate,
          bullets:   [],
        };
      } else if (current) {
        // Bullet point
        if (/^[-•*▸▪◆+]/.test(line) || /^\d+\./.test(line)) {
          current.bullets.push(line.replace(/^[-•*▸▪◆+\d.]\s*/, "").trim());
        } else if (!current.company && line.length < 80 && !/^\d/.test(line)) {
          // Might be the company name on the next line
          current.company = line;
        }
      }
    }
    if (current) jobs.push(current);
    return jobs;
  }

  const experience = parseExperienceBlocks(sections.experience);

  // ── Education ─────────────────────────────────────────────────────────────────
  function parseEducationBlocks(lines: string[]) {
    const entries: ParsedResume["education"] = [];
    let current: ParsedResume["education"][0] | null = null;

    const DEGREE_RE = /\b(bachelor|master|b\.?s\.?|m\.?s\.?|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech|ph\.?d|mba|associate|diploma|b\.?a\.?|m\.?a\.?)\b/i;
    const YEAR_RE   = /\b(19|20)\d{2}\b/;

    for (const line of lines) {
      const yearMatch   = line.match(YEAR_RE);
      const degreeMatch = line.match(DEGREE_RE);

      if (degreeMatch || (yearMatch && !current)) {
        if (current) entries.push(current);
        current = {
          institution:    "",
          degree:         degreeMatch?.[0] ?? "",
          field:          "",
          graduationYear: yearMatch?.[0] ?? "",
        };
        // Try to extract field from same line
        const withoutDegree = line.replace(DEGREE_RE, "").replace(/\bin\b/i, "").trim();
        if (withoutDegree.length > 2 && withoutDegree.length < 80) {
          current.field = withoutDegree.replace(/[,|]/g, "").trim();
        }
      } else if (current) {
        if (!current.institution && line.length < 100) {
          current.institution = line;
        } else if (!current.graduationYear && yearMatch) {
          current.graduationYear = yearMatch[0];
        }
      }
    }
    if (current) entries.push(current);
    return entries;
  }

  const education = parseEducationBlocks(sections.education);

  // ── Projects ──────────────────────────────────────────────────────────────────
  function parseProjectBlocks(lines: string[]) {
    const projects: ParsedResume["projects"] = [];
    let current: NonNullable<ParsedResume["projects"]>[0] | null = null;

    for (const line of lines) {
      if (/^[-•*]/.test(line) && current) {
        current.description += " " + line.replace(/^[-•*]\s*/, "").trim();
      } else if (line.length < 80 && !/^[-•*]/.test(line)) {
        if (current) projects.push(current);
        current = { name: line, description: "", technologies: [] };
      }
    }
    if (current) projects.push(current);
    return projects;
  }

  const projects = parseProjectBlocks(sections.projects);

  return { contact, summary, experience, education, skills, certifications, projects };
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
    } catch (err) {
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

    const parsed = parseResume(rawText);

    return NextResponse.json({ success: true, parsed, raw: rawText });
  } catch (err) {
    console.error("[parse] unexpected error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
