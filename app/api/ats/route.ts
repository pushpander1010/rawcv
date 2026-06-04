export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ATSResult, ATSIssue } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth } from "@/lib/api-guard";

// ─── Rule-based checks ────────────────────────────────────────────────────────

function runRuleChecks(parsed: ParsedResume, raw: string): ATSIssue[] {
  const issues: ATSIssue[] = [];

  // Section presence checks
  if (!parsed.experience || parsed.experience.length === 0) {
    issues.push({
      type: "missing_experience_section",
      description: "No work experience section detected. ATS systems expect a clearly labeled experience section.",
      impact: "high",
    });
  }

  if (!parsed.education || parsed.education.length === 0) {
    issues.push({
      type: "missing_education_section",
      description: "No education section detected. Most ATS systems require an education section.",
      impact: "high",
    });
  }

  if (!parsed.skills || parsed.skills.length === 0) {
    issues.push({
      type: "missing_skills_section",
      description: "No skills section detected. ATS systems rely heavily on keyword matching in a dedicated skills section.",
      impact: "high",
    });
  }

  if (!parsed.contact?.email) {
    issues.push({
      type: "missing_email",
      description: "No email address found. Contact information is essential for ATS parsing.",
      impact: "high",
    });
  }

  if (!parsed.summary) {
    issues.push({
      type: "missing_summary",
      description: "No professional summary detected. A summary helps ATS systems categorize your profile.",
      impact: "medium",
    });
  }

  // Formatting signals from raw text

  // Tables are ATS-unfriendly — detect common table markers
  if (raw.includes("|") && (raw.match(/\|/g) ?? []).length > 6) {
    issues.push({
      type: "table_detected",
      description: "Tables detected in the resume. ATS systems often fail to parse content inside tables correctly.",
      impact: "high",
    });
  }

  // Very short bullets suggest lack of detail
  const allBullets = parsed.experience?.flatMap((e) => e.bullets) ?? [];
  const shortBullets = allBullets.filter((b) => b.split(" ").length < 5);
  if (allBullets.length > 0 && shortBullets.length / allBullets.length > 0.5) {
    issues.push({
      type: "weak_bullet_points",
      description: "Many bullet points are very short (fewer than 5 words). ATS systems score higher for detailed, keyword-rich bullets.",
      impact: "medium",
    });
  }

  // Check for common ATS-unfriendly characters
  if (/[^\x00-\x7F]/.test(raw) && raw.replace(/[^\x00-\x7F]/g, "").length < raw.length * 0.95) {
    issues.push({
      type: "special_characters",
      description: "Unusual or non-ASCII characters detected. These can confuse ATS parsers.",
      impact: "low",
    });
  }

  // Keyword density — check if skills appear in experience bullets
  if (parsed.skills && parsed.skills.length > 0 && allBullets.length > 0) {
    const bulletText = allBullets.join(" ").toLowerCase();
    const skillsInBullets = parsed.skills.filter((s) =>
      bulletText.includes(s.toLowerCase())
    );
    if (skillsInBullets.length / parsed.skills.length < 0.3) {
      issues.push({
        type: "low_keyword_density",
        description: "Few skills from your skills section appear in your experience bullets. ATS systems reward keyword consistency across sections.",
        impact: "medium",
      });
    }
  }

  // Check for date formatting consistency
  const datePattern = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})\b/i;
  const hasDateInfo = parsed.experience?.some(
    (e) => datePattern.test(e.startDate) || datePattern.test(e.endDate as string)
  );
  if (parsed.experience && parsed.experience.length > 0 && !hasDateInfo) {
    issues.push({
      type: "missing_dates",
      description: "Work experience entries appear to be missing clear date ranges. ATS systems use dates to calculate tenure.",
      impact: "medium",
    });
  }

  return issues;
}

// ─── Score calculation ────────────────────────────────────────────────────────

function calculateBaseScore(issues: ATSIssue[]): number {
  let deductions = 0;
  for (const issue of issues) {
    if (issue.impact === "high") deductions += 15;
    else if (issue.impact === "medium") deductions += 8;
    else deductions += 3;
  }
  return Math.max(0, 100 - deductions);
}

// ─── AI scoring prompt ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst with deep knowledge of how major ATS platforms (Greenhouse, Lever, Workday, Taleo, iCIMS) parse and score resumes. Analyze the provided resume data for nuanced issues that automated rule-based checks cannot catch.

Focus on:
1. Semantic relevance — does the candidate's profile suggest a coherent career narrative?
2. Job title vagueness — are titles generic when they should be descriptive?
3. Quantification gaps — are achievements described without metrics or outcomes?
4. Buzzword authenticity — are keywords used with genuine context or just listed?
5. Formatting inconsistencies — do date formats, verb tenses, or section styles vary?
6. Keyword prevalence — are industry-standard terms for the implied role present?
7. Summary impact — does the summary differentiate the candidate or just describe roles?

Return JSON in this exact shape:
{
  "additionalIssues": [
    { "type": string, "description": string, "impact": "high" | "medium" | "low" }
  ],
  "scoreAdjustment": number  // between -20 and +10, positive if resume is strong
}`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: { parsed: ParsedResume; raw: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed } = body;
  // raw may be empty when resume was built via chat — fall back to serialized parsed data
  const raw = body.raw || JSON.stringify(body.parsed ?? {});

  if (!parsed) {
    return NextResponse.json(
      { error: "missing_fields", message: "parsed field is required" },
      { status: 400 }
    );
  }

  // Rule-based checks (instant)
  const ruleIssues = runRuleChecks(parsed, raw);
  let baseScore = calculateBaseScore(ruleIssues);

  // AI-powered nuanced scoring (best-effort — falls back to rule-based if it fails)
  let aiIssues: ATSIssue[] = [];
  try {
    const prompt = `Resume data:\n${JSON.stringify(parsed, null, 2)}\n\nRaw text excerpt:\n${raw.slice(0, 2000)}`;
    const aiResult = await complete(prompt, SYSTEM_PROMPT) as { additionalIssues: ATSIssue[]; scoreAdjustment: number };
    aiIssues = Array.isArray(aiResult.additionalIssues) ? aiResult.additionalIssues : [];
    const adjustment = Math.max(-20, Math.min(10, aiResult.scoreAdjustment ?? 0));
    baseScore = Math.max(0, Math.min(100, baseScore + adjustment));
  } catch {
    // fall back to rule-based score only
  }

  const chargeError = await chargeCredits("ATS analysis");
  if (chargeError) return chargeError;

  return NextResponse.json({
    score: Math.round(baseScore),
    issues: [...ruleIssues, ...aiIssues],
  } satisfies ATSResult);
}

