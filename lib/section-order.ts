export type ResumeSectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";

export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

export const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary: "About you",
  experience: "Work history",
  education: "Education",
  skills: "Skills",
  projects: "Your projects",
  certifications: "Certificates",
};

export function normalizeSectionOrder(order?: unknown): ResumeSectionKey[] {
  if (!Array.isArray(order)) {
    return [...DEFAULT_SECTION_ORDER];
  }
  const validKeys = new Set<ResumeSectionKey>(DEFAULT_SECTION_ORDER);
  const seen = new Set<ResumeSectionKey>();
  const result: ResumeSectionKey[] = [];

  for (const item of order) {
    if (typeof item === "string" && validKeys.has(item as ResumeSectionKey) && !seen.has(item as ResumeSectionKey)) {
      seen.add(item as ResumeSectionKey);
      result.push(item as ResumeSectionKey);
    }
  }

  for (const key of DEFAULT_SECTION_ORDER) {
    if (!seen.has(key)) {
      result.push(key);
    }
  }

  return result;
}
