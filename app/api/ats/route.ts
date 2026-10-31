export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ATSResult, ATSIssue } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { requireAuth } from "@/lib/api-guard";
import { runRuleChecks } from "@/lib/ats-rules";
import { scoreResume } from "@/lib/resume-score";

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst with deep knowledge of how major ATS platforms (Greenhouse, Lever, Workday, Taleo, iCIMS) parse and score resumes. Analyze the provided resume data for nuanced issues that automated rule-based checks cannot catch.

Judge the resume the way a Google / Meta engineering screen would:
1. One-page density and a coherent career narrative
2. X-Y-Z bullets: did the candidate accomplish X, measured by Y, by doing Z?
3. Real metrics (%, latency, $, users, scale) versus duty statements
4. Strong, specific action verbs — flag "responsible for", "helped", "worked on"
5. Evidence for listed skills, not just a keyword list
6. Education signal for students: GPA, coursework, graduation date
7. GitHub / portfolio and project links for engineering roles
8. Standard section headings, dates, and ATS-safe formatting

Return JSON in this exact shape:
{
  "additionalIssues": [
    { "type": string, "description": string, "impact": "high" | "medium" | "low" }
  ],
  "scoreAdjustment": number  // between -20 and +10, positive if resume is strong
}`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  let body: { parsed: ParsedResume; raw: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed } = body;
  const raw = body.raw || JSON.stringify(body.parsed ?? {});

  if (!parsed) {
    return NextResponse.json({ error: "missing_fields", message: "parsed field is required" }, { status: 400 });
  }

  const ruleIssues = runRuleChecks(parsed, raw);
  const quality = scoreResume(parsed);
  const qualityIssues: ATSIssue[] = quality.issues.slice(0, 10).map((issue) => ({
    type: `quality_${issue.id}`,
    description: `${issue.title}. ${issue.fix}`,
    impact: issue.impact,
  }));
  let baseScore = quality.score;

  let aiIssues: ATSIssue[] = [];
  try {
    const prompt = `Resume data:\n${JSON.stringify(parsed, null, 2)}\n\nRaw text excerpt:\n${raw.slice(0, 2000)}`;
    const aiResult = await complete(prompt, SYSTEM_PROMPT) as { additionalIssues: ATSIssue[]; scoreAdjustment: number };
    aiIssues = Array.isArray(aiResult.additionalIssues) ? aiResult.additionalIssues : [];
    const adjustment = Math.max(-10, Math.min(8, aiResult.scoreAdjustment ?? 0));
    baseScore = Math.max(0, Math.min(100, baseScore + adjustment));
  } catch {
    // fall back to rule-based score only
  }

  return NextResponse.json({
    score: Math.round(baseScore),
    issues: [...ruleIssues, ...qualityIssues, ...aiIssues],
  } satisfies ATSResult);
}
