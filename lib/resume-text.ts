// Shared plain-text resume rendering — used for TXT download and Word fallback.
// Keeps one text layout so TXT and DOCX never drift apart.

import type { ParsedResume } from "@/types";
import { normalizeSectionOrder } from "@/lib/section-order";
import { formatDateRange, formatResumeDate } from "@/lib/format-date";

export function resumeToPlainText(resume: ParsedResume): string {
  const lines: string[] = [];
  const c = resume.contact;

  lines.push(c.name || "Resume");
  const contactBits = [c.email, c.phone, c.location, c.linkedin, c.website].filter(Boolean);
  if (contactBits.length > 0) lines.push(contactBits.join(" | "));
  lines.push("");

  const order = normalizeSectionOrder(resume.sectionOrder);

  for (const key of order) {
    if (key === "summary" && resume.summary?.trim()) {
      lines.push("PROFESSIONAL SUMMARY");
      lines.push(resume.summary.trim());
      lines.push("");
    } else if (key === "experience" && resume.experience?.length) {
      lines.push("EXPERIENCE");
      for (const job of resume.experience) {
        const dates = formatDateRange(job.startDate, job.endDate);
        lines.push(`${job.title}${job.company ? ` — ${job.company}` : ""}${dates ? ` (${dates})` : ""}`);
        for (const b of job.bullets || []) {
          if (b?.trim()) lines.push(`- ${b.trim()}`);
        }
        lines.push("");
      }
    } else if (key === "education" && resume.education?.length) {
      lines.push("EDUCATION");
      for (const edu of resume.education) {
        const degree = [edu.degree, edu.field].filter(Boolean).join(" in ");
        lines.push(`${degree}${edu.graduationYear ? ` (${formatResumeDate(edu.graduationYear)})` : ""}`);
        if (edu.institution) lines.push(edu.institution);
        lines.push("");
      }
    } else if (key === "skills" && resume.skills?.length) {
      lines.push("SKILLS");
      lines.push(resume.skills.join(", "));
      lines.push("");
    } else if (key === "projects" && resume.projects?.length) {
      lines.push("PROJECTS");
      for (const p of resume.projects) {
        lines.push(p.name);
        if (p.technologies?.length) lines.push(`Tech: ${p.technologies.join(", ")}`);
        if (p.description) lines.push(p.description);
        lines.push("");
      }
    } else if (key === "certifications" && resume.certifications?.length) {
      lines.push("CERTIFICATIONS");
      for (const cert of resume.certifications) lines.push(`- ${cert}`);
      lines.push("");
    }
  }

  if (resume.languages?.length) {
    lines.push("LANGUAGES");
    for (const l of resume.languages) lines.push(`- ${l.language} (${l.level})`);
    lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
