export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, ATSResult, ATSIssue } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { requireAuth } from "@/lib/api-guard";
import { runRuleChecks, calculateBaseScore } from "@/lib/ats-rules";

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
  let baseScore = calculateBaseScore(ruleIssues);

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

  return NextResponse.json({
    score: Math.round(baseScore),
    issues: [...ruleIssues, ...aiIssues],
  } satisfies ATSResult);
}
