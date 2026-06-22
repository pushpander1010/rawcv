// ─── Theme IDs ───────────────────────────────────────────────────────────────

export type ModelId = string; // kept for backwards compat

export type ThemeId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "creative"
  | "sharp"
  | "navy"
  | "terra"
  | "enhancv"
  | "europass"
  | "canadian"
  | "fotoram"
  | "zety"
  | "resumeio";

// ─── Resume Format (region-specific) ────────────────────────────────────────

export type ResumeFormat = "general" | "eu" | "canada" | "us";

export const RESUME_FORMAT_INFO: Record<ResumeFormat, {
  label: string;
  description: string;
  maxPages: number;
  photoRequired: boolean;
  photoLabel: string;
  includeLanguages: boolean;
  includePersonalDetails: boolean;
  coverLetterRequired: boolean;
}> = {
  general: {
    label: "General",
    description: "Standard resume format for most countries",
    maxPages: 2,
    photoRequired: false,
    photoLabel: "Photo (optional)",
    includeLanguages: false,
    includePersonalDetails: true,
    coverLetterRequired: false,
  },
  eu: {
    label: "EU / Europass",
    description: "European CV format with languages & personal details",
    maxPages: 3,
    photoRequired: true,
    photoLabel: "Photo (recommended for EU)",
    includeLanguages: true,
    includePersonalDetails: true,
    coverLetterRequired: true,
  },
  canada: {
    label: "Canada",
    description: "Canadian resume — no photo, no personal details",
    maxPages: 2,
    photoRequired: false,
    photoLabel: "Photo (not used for Canada)",
    includeLanguages: false,
    includePersonalDetails: false,
    coverLetterRequired: true,
  },
  us: {
    label: "US",
    description: "American resume — 1 page preferred, no photo",
    maxPages: 1,
    photoRequired: false,
    photoLabel: "Photo (not used for US)",
    includeLanguages: false,
    includePersonalDetails: false,
    coverLetterRequired: true,
  },
};

// ─── Resume Data Models ───────────────────────────────────────────────────────

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string | "Present";
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface LanguageProficiency {
  language: string;
  level: "basic" | "elementary" | "intermediate" | "upper-intermediate" | "advanced" | "fluent" | "native" | "bilingual";
}

export interface ParsedResume {
  contact: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  photo?: string; // base64 data URL or blob URL
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
  projects?: Project[];
  languages?: LanguageProficiency[];
  volunteerExperience?: WorkExperience[];
  interests?: string[];
  references?: string;
  format?: ResumeFormat;
}

// ─── Cover Letter ─────────────────────────────────────────────────────────

export interface CoverLetter {
  id: string;
  format: ResumeFormat;
  recipientName?: string;
  recipientCompany?: string;
  recipientTitle?: string;
  opening: string;
  body: string[];
  closing: string;
  signature: string;
  createdAt: string;
  updatedAt: string;
}

// ─── ATS ─────────────────────────────────────────────────────────────────────

export interface ATSIssue {
  type: string;
  description: string;
  impact: "high" | "medium" | "low";
}

export interface ATSResult {
  score: number;
  issues: ATSIssue[];
}

// ─── Relevance ────────────────────────────────────────────────────────────────

export interface RelevanceResult {
  score: number;
  missingKeywords: string[];
  missingSkills: string[];
  recommendations: string[];
}

// ─── Suggestions ─────────────────────────────────────────────────────────────

export interface Suggestion {
  id: string;
  section: string;
  original: string;
  improved: string;
  reason: string;
}

// ─── Tailoring ───────────────────────────────────────────────────────────────

export interface TailorChange {
  id: string;
  section: string;
  field: string;
  original: string;
  tailored: string;
  accepted: boolean;
}

export interface TailoredResume {
  changes: TailorChange[];
  finalResume: ParsedResume;
}

// ─── API Error Shape ─────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
  message: string;
}
