// ─── Model & Theme IDs ───────────────────────────────────────────────────────

export type ModelId =
  | "openrouter-liquid-1.2b"
  | "openrouter-qwen-7b"
  | "openrouter-mistral-small"
  | "openrouter-llama-4-maverick"
  | "openrouter-deepseek-v3"
  | "together-gemma-3n";

export type ThemeId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "creative"
  | "sharp"
  | "navy"
  | "terra";

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

export interface ParsedResume {
  contact: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
  projects?: Project[];
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
