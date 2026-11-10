// Build a .docx Word document from a ParsedResume using the `docx` package.
// Runs in the browser (client-side) — no server round-trip needed.

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import type { ParsedResume, ResumeTypography } from "@/types";
import { DEFAULT_TYPOGRAPHY, TYPO_LIMITS, normalizeTypography } from "@/types";

import { normalizeSectionOrder } from "@/lib/section-order";
import { formatDateRange } from "@/lib/format-date";

const FONT_MAP: Record<string, string> = {
  default: "Calibri",
  arial: "Arial",
  calibri: "Calibri",
  georgia: "Georgia",
  times: "Times New Roman",
};

/** docx spacing.line is twips-ish (240 = single). Map the 1.0–2.5 multiplier. */
function lineSpacing(lineHeight: number): number {
  return Math.round(lineHeight * 240);
}

function runs(text: string, opts: { bold?: boolean; size?: number; font?: string; color?: string; italic?: boolean } = {}) {
  return [new TextRun({ text, bold: opts.bold, italics: opts.italic, size: opts.size, font: opts.font, color: opts.color })];
}

function heading(text: string, font: string, size: number) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: size + 2, font, color: "1F2937" })],
  });
}

function body(text: string, font: string, size: number, line: number) {
  return new Paragraph({
    spacing: { after: 80, line },
    children: [new TextRun({ text, size, font })],
  });
}

function bullet(text: string, font: string, size: number, line: number) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40, line },
    children: [new TextRun({ text, size, font })],
  });
}

export async function buildDocxBlob(resume: ParsedResume, typography?: ResumeTypography): Promise<Blob> {
  const typo = normalizeTypography(typography ?? DEFAULT_TYPOGRAPHY);
  const font = FONT_MAP[typo.font] ?? "Calibri";
  const size = Math.round(
    Math.min(TYPO_LIMITS.fontSizeMax, Math.max(TYPO_LIMITS.fontSizeMin, typo.fontSizePt)) * 2
  ); // docx uses half-points
  const line = lineSpacing(typo.lineHeight);
  const c = resume.contact;
  const children: Paragraph[] = [];

  // Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: (c.name || "Resume").toUpperCase(), bold: true, size: size + 10, font, color: "111827" })],
    })
  );

  // Contact line
  const bits = [c.email, c.phone, c.location, c.linkedin, c.github, c.website].filter(Boolean) as string[];
  if (bits.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: bits.join(" | "), size: size - 2, font, color: "4B5563" })],
      })
    );
  }

  const order = normalizeSectionOrder(resume.sectionOrder);
  for (const key of order) {
    if (key === "summary" && resume.summary?.trim()) {
      children.push(heading("Professional Summary", font, size));
      children.push(body(resume.summary.trim(), font, size, line));
    } else if (key === "experience" && resume.experience?.length) {
      children.push(heading("Experience", font, size));
      for (const job of resume.experience) {
        const dates = formatDateRange(job.startDate, job.endDate);
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 20, line },
            children: runs(`${job.title}${job.company ? ` | ${job.company}` : ""}${job.location ? ` | ${job.location}` : ""}`, { bold: true, size, font }),
          })
        );
        if (dates) {
          children.push(
            new Paragraph({
              spacing: { after: 60, line },
              children: runs(dates, { italic: true, size: size - 2, font, color: "6B7280" }),
            })
          );
        }
        for (const b of job.bullets || []) {
          if (b?.trim()) children.push(bullet(b.trim(), font, size, line));
        }
      }
    } else if (key === "education" && resume.education?.length) {
      children.push(heading("Education", font, size));
      for (const edu of resume.education) {
        const degree = [edu.degree, edu.field].filter(Boolean).join(" in ");
        const dates = formatDateRange(edu.startYear, edu.graduationYear);
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 20, line },
            children: runs(`${degree}${edu.institution ? ` | ${edu.institution}` : ""}${dates ? ` (${dates})` : ""}`, { bold: true, size, font }),
          })
        );
        if (edu.gpa) children.push(body(`GPA: ${edu.gpa}`, font, size, line));
        if (edu.coursework?.length) children.push(body(`Coursework: ${edu.coursework.join(", ")}`, font, size, line));
      }
    } else if (key === "skills" && resume.skills?.length) {
      children.push(heading("Skills", font, size));
      children.push(body(resume.skills.join(", "), font, size, line));
    } else if (key === "projects" && resume.projects?.length) {
      children.push(heading("Projects", font, size));
      for (const p of resume.projects) {
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 20, line },
            children: runs(p.name, { bold: true, size, font }),
          })
        );
        if (p.technologies?.length || p.link) {
          children.push(
            new Paragraph({
              spacing: { after: p.description ? 40 : 80, line },
              children: runs([p.technologies?.length ? `Tech: ${p.technologies.join(", ")}` : "", p.link ? `Link: ${p.link}` : ""].filter(Boolean).join("  |  "), { italic: true, size: size - 2, font, color: "4B5563" }),
            })
          );
        }
        if (p.description) children.push(body(p.description, font, size, line));
        for (const b of p.bullets || []) {
          if (b?.trim()) children.push(bullet(b.trim(), font, size, line));
        }
      }
    } else if (key === "awards" && resume.awards?.length) {
      children.push(heading("Awards & Leadership", font, size));
      for (const award of resume.awards) children.push(bullet(award, font, size, line));
    } else if (key === "certifications" && resume.certifications?.length) {
      children.push(heading("Certifications", font, size));
      for (const cert of resume.certifications) children.push(bullet(cert, font, size, line));
    }
  }

  if (resume.languages?.length) {
    children.push(heading("Languages", font, size));
    for (const l of resume.languages) children.push(bullet(`${l.language} (${l.level})`, font, size, line));
  }

  const doc = new Document({
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 } } }, // A4 in twips
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export function downloadDocxFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
