// ─── Theme IDs ───────────────────────────────────────────────────────────────

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

// ─── Resume Typography ─────────────────────────────────────────────────────

export type ResumeFont = "default" | "arial" | "calibri" | "georgia" | "times";

export interface ResumeTypography {
  font: ResumeFont;
  /** Body font size in points — free choice, not a preset */
  fontSizePt: number;
  /** Line height multiplier — free choice, not a preset */
  lineHeight: number;
}

export const DEFAULT_TYPOGRAPHY: ResumeTypography = {
  font: "default",
  fontSizePt: 11,
  lineHeight: 1.6,
};

/** Slider bounds for the Text style panel */
export const TYPO_LIMITS = {
  fontSizeMin: 9,
  fontSizeMax: 14,
  fontSizeStep: 0.5,
  lineHeightMin: 1.0,
  lineHeightMax: 2.5,
  lineHeightStep: 0.05,
} as const;

/** Migrate old persisted typography ({size:"small"|"medium"|"large", spacing}) to the free numeric shape */
export function normalizeTypography(t: unknown): ResumeTypography {
  const fallback = { ...DEFAULT_TYPOGRAPHY };
  if (!t || typeof t !== "object") return fallback;
  const o = t as Record<string, unknown>;
  const font: ResumeFont =
    o.font === "arial" || o.font === "calibri" || o.font === "georgia" || o.font === "times"
      ? o.font
      : "default";
  let fontSizePt = fallback.fontSizePt;
  if (typeof o.fontSizePt === "number" && Number.isFinite(o.fontSizePt)) {
    fontSizePt = o.fontSizePt;
  } else if (o.size === "small") {
    fontSizePt = 10;
  } else if (o.size === "large") {
    fontSizePt = 12;
  } else if (typeof o.size === "number" && Number.isFinite(o.size)) {
    fontSizePt = o.size;
  }
  let lineHeight = fallback.lineHeight;
  if (typeof o.lineHeight === "number" && Number.isFinite(o.lineHeight)) {
    lineHeight = o.lineHeight;
  } else if (o.spacing === "compact") {
    lineHeight = 1.35;
  } else if (o.spacing === "spacious") {
    lineHeight = 1.9;
  } else if (typeof o.spacing === "number" && Number.isFinite(o.spacing)) {
    lineHeight = o.spacing;
  }
  return {
    font,
    fontSizePt: Math.min(TYPO_LIMITS.fontSizeMax, Math.max(TYPO_LIMITS.fontSizeMin, fontSizePt)),
    lineHeight:
      Math.round(
        Math.min(TYPO_LIMITS.lineHeightMax, Math.max(TYPO_LIMITS.lineHeightMin, lineHeight)) * 100
      ) / 100,
  };
}

/** CSS font stacks shared by preview overrides and PDF export */
export const RESUME_FONT_STACKS: Record<Exclude<ResumeFont, "default">, string> = {
  arial: "Arial, Helvetica, sans-serif",
  calibri: "Calibri, Carlito, 'Segoe UI', sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
};

/** Preview zoom factor for a given body font size (11pt = theme-native 1.0) */
export function resumeZoom(fontSizePt: number): number {
  return (Number.isFinite(fontSizePt) ? fontSizePt : 11) / 11;
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
