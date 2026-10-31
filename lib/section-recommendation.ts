import type { ParsedResume, ResumeSectionKey } from "@/types";

export type CareerStage = "student" | "early" | "experienced";

function yearFrom(value?: string): number | null {
  if (!value) return null;
  const match = String(value).match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : null;
}

/**
 * Infer the layout stage from the actual resume data:
 * - student: still studying / recent grad with little full-time experience
 * - early: 0–3 years, or only one role
 * - experienced: 3+ years or multiple roles
 */
export function inferCareerStage(resume: Pick<ParsedResume, "experience" | "education">): CareerStage {
  const now = new Date().getFullYear();
  const newestGrad = resume.education
    .map((e) => yearFrom(e.graduationYear))
    .filter((y): y is number => y !== null)
    .sort((a, b) => b - a)[0];

  const earliestStart = resume.experience
    .map((e) => yearFrom(e.startDate))
    .filter((y): y is number => y !== null)
    .sort((a, b) => a - b)[0];

  const years = earliestStart ? Math.max(0, now - earliestStart) : 0;

  if ((newestGrad !== undefined && newestGrad >= now - 1) && resume.experience.length <= 1) {
    return "student";
  }
  if (years < 3 || resume.experience.length <= 1) return "early";
  return "experienced";
}

export function stageLabel(stage: CareerStage): string {
  if (stage === "student") return "student / new grad";
  if (stage === "early") return "early career";
  return "experienced";
}

/**
 * The standard order for each stage. Empty sections collapse automatically in
 * every theme, so including a section here does not force blank space.
 */
export function recommendedSectionOrder(resume: Pick<ParsedResume, "experience" | "education">): ResumeSectionKey[] {
  const stage = inferCareerStage(resume);

  if (stage === "student" || stage === "early") {
    return [
      "summary",
      "education",
      "experience",
      "projects",
      "skills",
      "awards",
      "certifications",
    ];
  }

  return [
    "summary",
    "experience",
    "skills",
    "education",
    "projects",
    "awards",
    "certifications",
  ];
}
