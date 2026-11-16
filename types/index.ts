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
  | "resumeio"
  | "editorial"
  | "atlas"
  | "maang"
  | "onyx";

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
  /** Optional city/country shown beside the company. */
  location?: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  /** Year the programme started; graduationYear is the end year. */
  startYear?: string;
  /** e.g. "3.8/4.0" — important for new-grad big-tech screens. */
  gpa?: string;
  /** Relevant coursework, one course per item. */
  coursework?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  /** GitHub / live demo URL. */
  link?: string;
  /** Optional 1–3 achievement bullets for the project. */
  bullets?: string[];
}

export interface LanguageProficiency {
  language: string;
  level: "basic" | "elementary" | "intermediate" | "upper-intermediate" | "advanced" | "fluent" | "native" | "bilingual";
}

import type { ResumeSectionKey } from "@/lib/section-order";
export type { ResumeSectionKey };

export interface ParsedResume {
  contact: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  photo?: string; // base64 data URL or blob URL
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
  projects?: Project[];
  awards?: string[];
  languages?: LanguageProficiency[];
  volunteerExperience?: WorkExperience[];
  interests?: string[];
  references?: string;
  format?: ResumeFormat;
  sectionOrder?: ResumeSectionKey[];
  /** True once the user manually reorders sections — stops auto-recommendation. */
  sectionOrderCustomized?: boolean;
}

// ─── Resume Typography ─────────────────────────────────────────────────────

export type ResumeFont = "default" | "arial" | "calibri" | "georgia" | "times";

/**
 * Vertical rhythm preset. `compact` shrinks page padding, section gaps and
 * bullet spacing so a full resume still fits on one A4 page.
 */
export type ResumeDensity = "compact" | "standard" | "relaxed";

export interface ResumeTypography {
  font: ResumeFont;
  /** Body font size in points — free choice, not a preset */
  fontSizePt: number;
  /** Line height multiplier — free choice, not a preset */
  lineHeight: number;
  /** Spacing preset — controls page padding + section/item gaps */
  density: ResumeDensity;
}

export const DEFAULT_TYPOGRAPHY: ResumeTypography = {
  font: "default",
  fontSizePt: 11,
  lineHeight: 1.45,
  density: "compact",
};

/** Density presets — page padding + vertical gaps, in CSS variable form */
export const DENSITY_PRESETS: Record<
  ResumeDensity,
  { label: string; hint: string; padY: string; padX: string; secGap: string; itemGap: string; bulletGap: string; headGap: string }
> = {
  compact: {
    label: "Compact",
    hint: "Best for one-page resumes with full experience",
    padY: "10.5mm",
    padX: "12mm",
    secGap: "2.3mm",
    itemGap: "1.6mm",
    bulletGap: "0.2mm",
    headGap: "1.3mm",
  },
  standard: {
    label: "Standard",
    hint: "Balanced default for most resumes",
    padY: "14mm",
    padX: "15mm",
    secGap: "3.6mm",
    itemGap: "2.6mm",
    bulletGap: "0.5mm",
    headGap: "2mm",
  },
  relaxed: {
    label: "Airy",
    hint: "More white space, spreads onto two pages",
    padY: "17mm",
    padX: "17mm",
    secGap: "5mm",
    itemGap: "3.4mm",
    bulletGap: "0.9mm",
    headGap: "2.6mm",
  },
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
    density:
      o.density === "compact" || o.density === "standard" || o.density === "relaxed"
        ? o.density
        : o.spacing === "spacious"
          ? "relaxed"
          : DEFAULT_TYPOGRAPHY.density,
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
  /** Optional category breakdown from the deterministic reviewer. */
  categories?: Array<{ key: string; label: string; score: number; max: number; detail?: string }>;
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
