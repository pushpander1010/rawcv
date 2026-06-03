export const runtime = "nodejs";
export const maxDuration = 30;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ATSResult, ATSIssue } from "@/types";

// ─── Rule-based checks (same as full /api/ats but no AI) ───────────────────

function runRuleChecks(parsed: ParsedResume, raw: string): ATSIssue[] {
  const issues: ATSIssue[] = [];

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

  if (raw.includes("|") && (raw.match(/\|/g) ?? []).length > 6) {
    issues.push({
      type: "table_detected",
      description: "Tables detected in the resume. ATS systems often fail to parse content inside tables correctly.",
      impact: "high",
    });
  }

  const allBullets = parsed.experience?.flatMap((e) => e.bullets) ?? [];
  const shortBullets = allBullets.filter((b) => b.split(" ").length < 5);
  if (allBullets.length > 0 && shortBullets.length / allBullets.length > 0.5) {
    issues.push({
      type: "weak_bullet_points",
      description: "Many bullet points are very short (fewer than 5 words). ATS systems score higher for detailed, keyword-rich bullets.",
      impact: "medium",
    });
  }

  if (/[^\x00-\x7F]/.test(raw) && raw.replace(/[^\x00-\x7F]/g, "").length < raw.length * 0.95) {
    issues.push({
      type: "special_characters",
      description: "Unusual or non-ASCII characters detected. These can confuse ATS parsers.",
      impact: "low",
    });
  }

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

function calculateBaseScore(issues: ATSIssue[]): number {
  let deductions = 0;
  for (const issue of issues) {
    if (issue.impact === "high") deductions += 15;
    else if (issue.impact === "medium") deductions += 8;
    else deductions += 3;
  }
  return Math.max(0, 100 - deductions);
}

export async function POST(req: NextRequest) {
  let body: { parsed: ParsedResume; raw: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed } = body;
  const raw = body.raw || JSON.stringify(body.parsed ?? {});

  if (!parsed) {
    return NextResponse.json(
      { error: "missing_fields", message: "parsed field is required" },
      { status: 400 }
    );
  }

  // Rules-based only — no AI, no auth, no credits
  const ruleIssues = runRuleChecks(parsed, raw);
  const baseScore = calculateBaseScore(ruleIssues);

  return NextResponse.json({
    score: Math.round(baseScore),
    issues: ruleIssues,
  } satisfies ATSResult);
}