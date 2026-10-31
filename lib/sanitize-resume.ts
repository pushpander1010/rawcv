import type {
  ParsedResume,
  WorkExperience,
  Education,
  Project,
  LanguageProficiency,
  ResumeFormat,
} from "@/types";
import { normalizeSectionOrder } from "@/lib/section-order";

/**
 * Convert any value to a string, handling null/undefined/numbers/objects
 */
function toStr(val: unknown): string {
  if (val === undefined || val === null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return String(val);
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

/**
 * Sanitize a WorkExperience object to ensure all fields are strings
 */
function sanitizeExperience(exp: Partial<WorkExperience>): WorkExperience {
  return {
    company: toStr(exp.company),
    title: toStr(exp.title),
    startDate: toStr(exp.startDate),
    endDate: toStr(exp.endDate),
    bullets: Array.isArray(exp.bullets) ? exp.bullets.map(toStr) : [],
  };
}

/**
 * Sanitize an Education object to ensure all fields are strings
 */
function sanitizeEducation(edu: Partial<Education>): Education {
  return {
    institution: toStr(edu.institution),
    degree: toStr(edu.degree),
    field: toStr(edu.field),
    graduationYear: toStr(edu.graduationYear),
  };
}

/**
 * Sanitize a Project object to ensure all fields are strings
 */
function sanitizeProject(proj: Partial<Project>): Project {
  return {
    name: toStr(proj.name),
    description: toStr(proj.description),
    technologies: Array.isArray(proj.technologies) ? proj.technologies.map(toStr) : [],
  };
}

const LANGUAGE_LEVELS = new Set<LanguageProficiency["level"]>([
  "basic",
  "elementary",
  "intermediate",
  "upper-intermediate",
  "advanced",
  "fluent",
  "native",
  "bilingual",
]);

function sanitizeLanguage(lang: Partial<LanguageProficiency>): LanguageProficiency {
  const level = LANGUAGE_LEVELS.has(lang.level as LanguageProficiency["level"])
    ? (lang.level as LanguageProficiency["level"])
    : "intermediate";
  return { language: toStr(lang.language), level };
}

const FORMATS = new Set<ResumeFormat>(["general", "eu", "canada", "us"]);

/**
 * Sanitize a ParsedResume to ensure all fields are the correct types
 * This prevents errors like "e.trim is not a function" when rendering
 */
export function sanitizeResume(resume: Partial<ParsedResume> | null | undefined): ParsedResume {
  if (!resume) {
    return {
      contact: { name: "", email: "" },
      summary: "",
      experience: [],
      education: [],
      skills: [],
    };
  }

  return {
    contact: {
      name: toStr(resume.contact?.name),
      email: toStr(resume.contact?.email),
      phone: resume.contact?.phone ? toStr(resume.contact.phone) : undefined,
      location: resume.contact?.location ? toStr(resume.contact.location) : undefined,
      linkedin: resume.contact?.linkedin ? toStr(resume.contact.linkedin) : undefined,
      website: resume.contact?.website ? toStr(resume.contact.website) : undefined,
    },
    summary: resume.summary ? toStr(resume.summary) : undefined,
    experience: Array.isArray(resume.experience)
      ? resume.experience.map(sanitizeExperience)
      : [],
    education: Array.isArray(resume.education)
      ? resume.education.map(sanitizeEducation)
      : [],
    skills: Array.isArray(resume.skills) ? resume.skills.map(toStr) : [],
    certifications: Array.isArray(resume.certifications)
      ? resume.certifications.map(toStr)
      : undefined,
    projects: Array.isArray(resume.projects)
      ? resume.projects.map(sanitizeProject)
      : undefined,
    photo: resume.photo ? toStr(resume.photo) : undefined,
    languages: Array.isArray(resume.languages)
      ? resume.languages
          .filter((l) => l && toStr(l.language).trim())
          .map(sanitizeLanguage)
      : undefined,
    volunteerExperience: Array.isArray(resume.volunteerExperience)
      ? resume.volunteerExperience.map(sanitizeExperience)
      : undefined,
    interests: Array.isArray(resume.interests) ? resume.interests.map(toStr) : undefined,
    references: resume.references ? toStr(resume.references) : undefined,
    format: resume.format && FORMATS.has(resume.format) ? resume.format : undefined,
    sectionOrder: resume.sectionOrder ? normalizeSectionOrder(resume.sectionOrder) : undefined,
  };
}
