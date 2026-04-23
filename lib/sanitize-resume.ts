import type { ParsedResume, WorkExperience, Education, Project } from "@/types";

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
  };
}
