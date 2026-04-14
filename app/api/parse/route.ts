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

// ─── Section header detection ─────────────────────────────────────────────────

// Matches lines that ARE section headers — short, no sentence punctuation,
// often all-caps or title-case, matching known resume section keywords.
const SECTION_PATTERNS: [string, RegExp][] = [
  ["summary",        /\b(summary|profile|objective|about me|professional\s+summary|career\s+summary)\b/i],
  ["experience",     /\b(experience|work\s+experience|employment|work\s+history|professional\s+experience|career\s+history|positions?\s+held)\b/i],
  ["education",      /\b(education|academic|qualifications?|schooling|degrees?)\b/i],
  ["skills",         /\b(skills?|technical\s+skills?|core\s+competencies|technologies|expertise|proficiencies|tools)\b/i],
  ["certifications", /\b(certifications?|certificates?|licenses?|credentials|accreditations?)\b/i],
  ["projects",       /\b(projects?|personal\s+projects?|key\s+projects?|notable\s+projects?|portfolio)\b/i],
];

function detectSectionHeader(line: string): string | null {
  const trimmed = line.trim();
  // Must be short (section headers are rarely > 50 chars)
  if (trimmed.length > 60) return null;
  // Must not look like a sentence (no period mid-line, no comma-heavy text)
  if ((trimmed.match(/,/g) ?? []).length > 2) return null;

  for (const [key, re] of SECTION_PATTERNS) {
    if (re.test(trimmed)) return key;
  }
  return null;
}

// ─── Resume parser ────────────────────────────────────────────────────────────

function parseResume(raw: string): ParsedResume {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // ── Contact extraction (scan full text) ──────────────────────────────────────
  const emailMatch   = raw.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/);
  const phoneMatch   = raw.match(/(\+?[\d][\d\s\-().]{6,}[\d])/);
  const linkedinMatch = raw.match(/(?:linkedin\.com\/in\/)([\w%-]+)/i);
  const websiteMatch  = raw.match(/https?:\/\/(?!linkedin\.com)([^\s,)<>"]+)/i);
  const locationMatch = raw.match(/([A-Z][a-zA-Z\s]{2,20},\s*[A-Z]{2}(?:\s+\d{5})?)/);

  // Name: first line that looks like a person's name
  let name = "";
  for (const line of lines.slice(0, 8)) {
    if (/[@:/|\\]/.test(line)) continue;
    if (/^\d/.test(line)) continue;
    if (line.length > 60) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 &&
        words.every(w => /^[A-Za-z.'-]{1,20}$/.test(w))) {
      name = line;
      break;
    }
  }

  const contact: ParsedResume["contact"] = {
    name,
    email:    emailMatch?.[0] ?? "",
    phone:    phoneMatch?.[1]?.replace(/\s+/g, " ").trim() ?? "",
    location: locationMatch?.[1] ?? "",
    linkedin: linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : "",
    website:  websiteMatch?.[0] ?? "",
  };

  // ── Split into sections ───────────────────────────────────────────────────────
  type SectionKey = "summary" | "experience" | "education" | "skills" | "certifications" | "projects";
  const sections: Record<SectionKey, string[]> = {
    summary: [], experience: [], education: [],
    skills: [], certifications: [], projects: [],
  };

  let currentSection: SectionKey | null = null;

  for (const line of lines) {
    const detected = detectSectionHeader(line);
    if (detected) {
      currentSection = detected as SectionKey;
      continue;
    }
    if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────────
  const summary = sections.summary.join(" ").trim();

  // ── Skills ────────────────────────────────────────────────────────────────────
  const skillsText = sections.skills.join(" | ");
  const skills = skillsText
    .split(/[,|•·\n\/\\]/)
    .map(s => s.replace(/^[-*▸▪◆+]\s*/, "").trim())
    .filter(s => s.length > 1 && s.length < 50 && !/^\d+$/.test(s));

  // ── Certifications ────────────────────────────────────────────────────────────
  const certifications = sections.certifications
    .map(l => l.replace(/^[-•*▸▪◆+]\s*/, "").trim())
    .filter(l => l.length > 3);

  // ── Experience ────────────────────────────────────────────────────────────────
  // Date range pattern: "Jan 2020 - Mar 2023" or "2019 – Present" etc.
  const MONTH = "(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)";
  const YEAR  = "(?:19|20)\\d{2}";
  const DATE  = `(?:${MONTH}[\\s,]*${YEAR}|${YEAR})`;
  const DATE_RANGE_RE = new RegExp(
    `(${DATE})[\\s]*[-–—to]+[\\s]*(${DATE}|present|current|now|ongoing)`,
    "i"
  );

  function parseExperienceBlocks(lines: string[]): ParsedResume["experience"] {
    const jobs: ParsedResume["experience"] = [];
    let current: ParsedResume["experience"][0] | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dateMatch = line.match(DATE_RANGE_RE);

      if (dateMatch) {
        if (current) jobs.push(current);
        const startDate = dateMatch[1].trim();
        const endDate   = dateMatch[2].trim();
        // Strip the date from the line to get title/company
        const rest = line.replace(DATE_RANGE_RE, "").replace(/[-–—|,]+$/, "").trim();
        const parts = rest.split(/\s{2,}|\s*[|,]\s*/).map(p => p.trim()).filter(Boolean);
        current = {
          title:     parts[0] ?? "",
          company:   parts[1] ?? "",
          startDate,
          endDate,
          bullets:   [],
        };
      } else if (current) {
        const isBullet = /^[-•*▸▪◆+]/.test(line) || /^\d+[.)]\s/.test(line);
        if (isBullet) {
          current.bullets.push(line.replace(/^[-•*▸▪◆+\d.)]\s*/, "").trim());
        } else if (!current.company && line.length < 100 && !/^\d/.test(line)) {
          // Second line after date range is often the company
          current.company = line;
        } else if (current.company && line.length > 20) {
          // Longer lines without bullet markers are often paragraph-style bullets
          current.bullets.push(line);
        }
      }
    }
    if (current) jobs.push(current);
    return jobs;
  }

  const experience = parseExperienceBlocks(sections.experience);

  // ── Education ─────────────────────────────────────────────────────────────────
  const DEGREE_RE = /\b(bachelor(?:'s)?|master(?:'s)?|b\.?s\.?c?|m\.?s\.?c?|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech|ph\.?d\.?|mba|associate(?:'s)?|diploma|b\.?a\.?|m\.?a\.?|hnd|hnc)\b/i;
  const YEAR_RE   = /\b((?:19|20)\d{2})\b/;

  function parseEducationBlocks(lines: string[]): ParsedResume["education"] {
    const entries: ParsedResume["education"] = [];
    let current: ParsedResume["education"][0] | null = null;

    for (const line of lines) {
      const degreeMatch = line.match(DEGREE_RE);
      const yearMatch   = line.match(YEAR_RE);

      if (degreeMatch) {
        if (current) entries.push(current);
        // Extract field: text after "in" or after the degree keyword
        const afterDegree = line.replace(DEGREE_RE, "").replace(/^\s*(in|of)\s*/i, "").trim();
        current = {
          institution:    "",
          degree:         degreeMatch[0],
          field:          afterDegree.replace(/[,|]/g, "").replace(YEAR_RE, "").trim(),
          graduationYear: yearMatch?.[1] ?? "",
        };
      } else if (current) {
        if (!current.institution && line.length < 100) {
          current.institution = line.replace(YEAR_RE, "").trim();
          if (!current.graduationYear && yearMatch) {
            current.graduationYear = yearMatch[1];
          }
        } else if (!current.graduationYear && yearMatch) {
          current.graduationYear = yearMatch[1];
        }
      }
    }
    if (current) entries.push(current);
    return entries;
  }

  const education = parseEducationBlocks(sections.education);

  // ── Projects ──────────────────────────────────────────────────────────────────
  function parseProjectBlocks(lines: string[]): NonNullable<ParsedResume["projects"]> {
    const projects: NonNullable<ParsedResume["projects"]> = [];
    let current: NonNullable<ParsedResume["projects"]>[0] | null = null;

    for (const line of lines) {
      const isBullet = /^[-•*▸▪◆+]/.test(line);
      if (!isBullet && line.length < 80) {
        if (current) projects.push(current);
        // Extract tech stack if mentioned inline: "ProjectName | React, Node.js"
        const techMatch = line.match(/[|:]\s*(.+)$/);
        const projectName = techMatch ? line.slice(0, line.indexOf(techMatch[0])).trim() : line;
        const techs = techMatch ? techMatch[1].split(/[,/]/).map(t => t.trim()).filter(Boolean) : [];
        current = { name: projectName, description: "", technologies: techs };
      } else if (current) {
        const text = line.replace(/^[-•*▸▪◆+]\s*/, "").trim();
        current.description += (current.description ? " " : "") + text;
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

    const parsed = parseResume(rawText);

    console.log("[parse] result:", {
      name: parsed.contact.name,
      experience: parsed.experience.length,
      education: parsed.education.length,
      skills: parsed.skills.length,
    });

    return NextResponse.json({ success: true, parsed, raw: rawText });
  } catch (err) {
    console.error("[parse] unexpected error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
