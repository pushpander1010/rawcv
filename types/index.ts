// ─── Model & Theme IDs ───────────────────────────────────────────────────────

export type ModelId =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "gemini-1.5-flash"
  | "gemini-1.5-pro"
  | "claude-haiku"
  | "claude-sonnet"
  | "groq-llama-3.1-8b"
  | "groq-llama-3.3-70b"
  | "openrouter-qwen-7b";

export type ThemeId =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "creative";

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
  score: number; // 0–100
  issues: ATSIssue[];
}

// ─── Relevance ────────────────────────────────────────────────────────────────

export interface RelevanceResult {
  score: number; // 0–100
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
