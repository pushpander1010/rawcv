// Build a .docx Word document from a ParsedResume using the `docx` package.
// Runs in the browser (client-side) — no server round-trip needed.

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import type { ParsedResume, ResumeTypography } from "@/types";
import { DEFAULT_TYPOGRAPHY } from "@/types";

const FONT_MAP: Record<string, string> = {
  default: "Calibri",
  arial: "Arial",
  calibri: "Calibri",
  georgia: "Georgia",
  times: "Times New Roman",
};

const SIZE_MAP: Record<string, number> = {
  small: 20, // half-points → 10pt
  medium: 22, // 11pt
  large: 24, // 12pt
};

const SPACING_MAP: Record<string, number> = {
  compact: 240,
  comfortable: 276,
  spacious: 360,
};

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
  const typo = typography ?? DEFAULT_TYPOGRAPHY;
  const font = FONT_MAP[typo.font] ?? "Calibri";
  const size = SIZE_MAP[typo.size] ?? 22;
  const line = SPACING_MAP[typo.spacing] ?? 276;
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
  const bits = [c.email, c.phone, c.location, c.linkedin, c.website].filter(Boolean) as string[];
  if (bits.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: bits.join(" | "), size: size - 2, font, color: "4B5563" })],
      })
    );
  }

  if (resume.summary?.trim()) {
    children.push(heading("Professional Summary", font, size));
    children.push(body(resume.summary.trim(), font, size, line));
  }

  if (resume.experience?.length) {
    children.push(heading("Experience", font, size));
    for (const job of resume.experience) {
      const dates = [job.startDate, job.endDate].filter(Boolean).join(" - ");
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 20, line },
          children: runs(`${job.title}${job.company ? ` — ${job.company}` : ""}`, { bold: true, size, font }),
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
  }

  if (resume.education?.length) {
    children.push(heading("Education", font, size));
    for (const edu of resume.education) {
      const degree = [edu.degree, edu.field].filter(Boolean).join(" in ");
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20, line },
          children: runs(`${degree}${edu.graduationYear ? ` (${edu.graduationYear})` : ""}`, { bold: true, size, font }),
        })
      );
      if (edu.institution) children.push(body(edu.institution, font, size, line));
    }
  }

  if (resume.skills?.length) {
    children.push(heading("Skills", font, size));
    children.push(body(resume.skills.join(", "), font, size, line));
  }

  if (resume.projects?.length) {
    children.push(heading("Projects", font, size));
    for (const p of resume.projects) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20, line },
          children: runs(p.name, { bold: true, size, font }),
        })
      );
      if (p.description) children.push(body(p.description, font, size, line));
      if (p.technologies?.length) {
        children.push(
          new Paragraph({
            spacing: { after: 80, line },
            children: runs(`Tech: ${p.technologies.join(", ")}`, { italic: true, size: size - 2, font, color: "4B5563" }),
          })
        );
      }
    }
  }

  if (resume.certifications?.length) {
    children.push(heading("Certifications", font, size));
    for (const cert of resume.certifications) children.push(bullet(cert, font, size, line));
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
