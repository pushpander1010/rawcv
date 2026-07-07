export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ResumeFormat } from "@/types";
import { completeAnalysis } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth } from "@/lib/api-guard";

const FORMAT_INSTRUCTIONS: Record<ResumeFormat, string> = {
  general: `GENERAL FORMAT rules:
- Standard reverse-chronological structure
- Photo optional — remove if provided
- Keep personal details (name, email, phone, location)
- Up to 2 pages
- Section order: Contact → Summary → Experience → Education → Skills
- Neutral, professional tone suitable for most countries`,

  eu: `EU / EUROPEAN FORMAT rules:
- MUST include a Languages section with CEFR proficiency levels (A1-C2)
- Photo section should be kept if provided — EU recruiters expect it
- Personal details section is standard (include nationality, date of birth if present)
- Up to 3 pages acceptable
- Section order: Personal Info → Photo → Summary → Experience → Education → Languages → Skills
- More descriptive bullet points than US style — detailed role context is valued
- Include volunteer experience and interests sections if present`,

  canada: `CANADIAN FORMAT rules:
- NO photo — remove it entirely
- NO personal details beyond contact (no age, marital status, nationality)
- Remove date of birth, nationality, and similar fields if present
- Up to 2 pages
- Focus on quantified achievements and measurable results
- Section order: Contact → Professional Summary → Experience → Education → Skills
- Bilingual (English/French) skill mention is a plus if applicable
- Clean, achievement-focused language`,

  us: `AMERICAN FORMAT rules:
- NO photo — remove it entirely
- NO personal details beyond contact
- STRICT 1-page limit — trim content aggressively to fit
- Remove date of birth, nationality, and similar fields
- Ultra-concise bullet points — every word must earn its place
- Section order: Contact → Summary → Experience → Education → Skills
- Strong action verbs, quantified achievements, achievement-first bullets
- Remove any sections that don't directly support the candidacy`,
};

const SYSTEM_PROMPT = `You are an expert international resume conversion specialist. Your job is to adapt a resume to match a specific country/region's conventions WITHOUT changing any factual information.

CRITICAL RULES:
- NEVER fabricate experience, skills, education, or any facts
- NEVER change dates, company names, job titles, or specific numbers
- ONLY restructure, rewrite, and reorder existing content
- Preserve all factual information exactly as provided
- Only remove elements that violate the target format rules (e.g., photos for US/Canada)

Your output must be a COMPLETE resume — do not skip any sections or entries.`;

function buildPrompt(parsed: ParsedResume, targetFormat: ResumeFormat): string {
  const formatRules = FORMAT_INSTRUCTIONS[targetFormat];

  return `Convert this resume to the ${targetFormat.toUpperCase()} format.

FORMAT RULES:
${formatRules}

RESUME DATA:
${JSON.stringify(parsed, null, 2)}

Return JSON matching this exact shape:
{
  "converted": {
    "contact": { ... },
    "summary": "rewritten summary if needed, or null if no summary",
    "experience": [{ "company": "...", "title": "...", "startDate": "...", "endDate": "...", "bullets": ["..."] }],
    "education": [{ "institution": "...", "degree": "...", "field": "...", "graduationYear": "..." }],
    "skills": ["..."],
    "certifications": ["..."] | null,
    "projects": [{ "name": "...", "description": "...", "technologies": ["..."] }] | null,
    "languages": [{ "language": "...", "level": "..." }] | null,
    "volunteerExperience": [{ "company": "...", "title": "...", "startDate": "...", "endDate": "...", "bullets": ["..."] }] | null,
    "interests": ["..."] | null,
    "references": "..." | null,
    "format": "${targetFormat}"
  },
  "changes": [
    { "what": "brief description of what changed", "why": "brief explanation of the format rule that required this change" }
  ],
  "summaryRewrite": "the new summary text if it was rewritten, or null if unchanged"
}`;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: { parsed: ParsedResume; targetFormat: ResumeFormat };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed, targetFormat } = body;

  if (!parsed) {
    return NextResponse.json(
      { error: "missing_fields", message: "parsed field is required" },
      { status: 400 }
    );
  }

  if (!targetFormat || !["general", "eu", "canada", "us"].includes(targetFormat)) {
    return NextResponse.json(
      { error: "invalid_format", message: "targetFormat must be one of: general, eu, canada, us" },
      { status: 400 }
    );
  }

  // If already in the target format, no conversion needed
  if (parsed.format === targetFormat) {
    return NextResponse.json({
      converted: parsed,
      changes: [{ what: "No changes needed", why: "Resume is already in the target format" }],
      summaryRewrite: null,
    });
  }

  try {
    const prompt = buildPrompt(parsed, targetFormat);
    const result = await completeAnalysis<{
      converted: ParsedResume;
      changes: Array<{ what: string; why: string }>;
      summaryRewrite: string | null;
    }>(prompt, SYSTEM_PROMPT, { maxTokens: 3500 });

    if (!result?.converted) {
      return NextResponse.json(
        { error: "ai_unavailable", message: "Conversion failed. Please try again." },
        { status: 502 }
      );
    }

    // Ensure format field is set
    result.converted.format = targetFormat;

    // Charge credits after successful conversion
    const chargeError = await chargeCredits("Format conversion");
    if (chargeError) return chargeError;

    return NextResponse.json({
      converted: result.converted,
      changes: result.changes ?? [],
      summaryRewrite: result.summaryRewrite ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Format conversion failed. Please try again." },
      { status: 502 }
    );
  }
}
