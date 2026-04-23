import { z } from "zod";
import type { ParsedResume } from "@/types";

/**
 * Zod schemas for validating AI responses
 */

const ContactSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
}).strict().partial();

const WorkExperienceSchema = z.object({
  company: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  bullets: z.array(z.string()).optional().nullable(),
}).strict().partial();

const EducationSchema = z.object({
  institution: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  graduationYear: z.string().optional().nullable(),
}).strict().partial();

const ProjectSchema = z.object({
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional().nullable(),
}).strict().partial();

const ResumeUpdateSchema = z.object({
  contact: ContactSchema.optional().nullable(),
  summary: z.string().optional().nullable(),
  experience: z.array(WorkExperienceSchema).optional().nullable(),
  education: z.array(EducationSchema).optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  certifications: z.array(z.string()).optional().nullable(),
  projects: z.array(ProjectSchema).optional().nullable(),
}).strict().partial();

const BuildResponseSchema = z.object({
  message: z.string().optional().nullable(),
  resumeUpdate: ResumeUpdateSchema.optional().nullable(),
  isComplete: z.boolean().optional().nullable(),
  nextStep: z.number().optional().nullable(),
}).strict().partial();

const CustomizeResponseSchema = z.object({
  message: z.string().optional().nullable(),
  resumeUpdate: ResumeUpdateSchema.optional().nullable(),
  undoSection: z.string().optional().nullable(),
  isComplete: z.boolean().optional().nullable(),
}).strict().partial();

/**
 * Parse and validate a Build mode response from the AI
 */
export function parseBuildResponse(raw: unknown): {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  isComplete: boolean;
  nextStep: number;
} {
  try {
    const validated = BuildResponseSchema.parse(raw);
    return {
      message: validated.message || "Got it! What's next?",
      resumeUpdate: (validated.resumeUpdate as Partial<ParsedResume> | null) ?? null,
      isComplete: validated.isComplete ?? false,
      nextStep: validated.nextStep ?? 0,
    };
  } catch (err) {
    console.error("[parseBuildResponse] Validation failed:", err);
    // Return safe defaults
    return {
      message: "I'm having trouble processing that. Could you try again?",
      resumeUpdate: null,
      isComplete: false,
      nextStep: 0,
    };
  }
}

/**
 * Parse and validate a Customize mode response from the AI
 */
export function parseCustomizeResponse(raw: unknown): {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  undoSection: string | null;
  isComplete: boolean;
} {
  try {
    const validated = CustomizeResponseSchema.parse(raw);
    return {
      message: validated.message || "Done! What else would you like to change?",
      resumeUpdate: (validated.resumeUpdate as Partial<ParsedResume> | null) ?? null,
      undoSection: validated.undoSection ?? null,
      isComplete: validated.isComplete ?? false,
    };
  } catch (err) {
    console.error("[parseCustomizeResponse] Validation failed:", err);
    // Return safe defaults
    return {
      message: "I'm having trouble processing that. Could you try again?",
      resumeUpdate: null,
      undoSection: null,
      isComplete: false,
    };
  }
}

/**
 * Validate that resumeUpdate contains valid resume data
 * Ensures arrays are complete and not partial
 */
export function validateResumeUpdate(update: Partial<ParsedResume> | null): Partial<ParsedResume> | null {
  if (!update || typeof update !== "object") return null;

  const validated: Partial<ParsedResume> = {};

  // Validate contact
  if (update.contact && typeof update.contact === "object") {
    validated.contact = {
      name: typeof update.contact.name === "string" ? update.contact.name : "",
      email: typeof update.contact.email === "string" ? update.contact.email : "",
      phone: typeof update.contact.phone === "string" ? update.contact.phone : undefined,
      location: typeof update.contact.location === "string" ? update.contact.location : undefined,
      linkedin: typeof update.contact.linkedin === "string" ? update.contact.linkedin : undefined,
      website: typeof update.contact.website === "string" ? update.contact.website : undefined,
    };
  }

  // Validate summary
  if (typeof update.summary === "string") {
    validated.summary = update.summary;
  }

  // Validate experience array
  if (Array.isArray(update.experience)) {
    validated.experience = update.experience
      .filter((exp) => exp && typeof exp === "object")
      .map((exp) => ({
        company: typeof exp.company === "string" ? exp.company : "",
        title: typeof exp.title === "string" ? exp.title : "",
        startDate: typeof exp.startDate === "string" ? exp.startDate : "",
        endDate: typeof exp.endDate === "string" ? exp.endDate : "",
        bullets: Array.isArray(exp.bullets)
          ? exp.bullets.filter((b) => typeof b === "string")
          : [],
      }));
  }

  // Validate education array
  if (Array.isArray(update.education)) {
    validated.education = update.education
      .filter((edu) => edu && typeof edu === "object")
      .map((edu) => ({
        institution: typeof edu.institution === "string" ? edu.institution : "",
        degree: typeof edu.degree === "string" ? edu.degree : "",
        field: typeof edu.field === "string" ? edu.field : "",
        graduationYear: typeof edu.graduationYear === "string" ? edu.graduationYear : "",
      }));
  }

  // Validate skills array
  if (Array.isArray(update.skills)) {
    validated.skills = update.skills.filter((s) => typeof s === "string");
  }

  // Validate certifications array
  if (Array.isArray(update.certifications)) {
    validated.certifications = update.certifications.filter((c) => typeof c === "string");
  }

  // Validate projects array
  if (Array.isArray(update.projects)) {
    validated.projects = update.projects
      .filter((proj) => proj && typeof proj === "object")
      .map((proj) => ({
        name: typeof proj.name === "string" ? proj.name : "",
        description: typeof proj.description === "string" ? proj.description : "",
        technologies: Array.isArray(proj.technologies)
          ? proj.technologies.filter((t) => typeof t === "string")
          : [],
      }));
  }

  // Return null if no valid data was found
  return Object.keys(validated).length > 0 ? validated : null;
}
