export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, RelevanceResult } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseJD } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert resume-to-job-description relevance analyst. Carefully compare the candidate's resume against the provided job description to determine how well they match.

Your analysis must be thorough and specific:
1. Score based on both explicit keyword matches AND semantic alignment (similar concepts phrased differently)
2. Identify critical missing keywords — terms that appear in the JD's requirements/qualifications but are absent from the resume
3. Flag missing hard skills that would be dealbreakers for the role
4. Provide actionable recommendations: specific changes the candidate could make to improve alignment

Return JSON in this exact shape:
{
  "score": number,           // 0–100 relevance score
  "missingKeywords": string[], // most impactful keywords in JD not found in resume (max 15)
  "missingSkills": string[],   // hard skills from JD absent from resume skills section (max 10)
  "recommendations": string[]  // prioritized, actionable recommendations (max 8)
}

Scoring guidance:
- 90–100: Resume strongly matches the JD with most keywords and skills present
- 70–89: Good match with minor gaps
- 50–69: Moderate match, several important keywords/skills missing
- 0–49: Poor match, significant gaps
- Note: For junior/fresher roles, be more lenient on years-of-experience gaps but strict on skill gaps`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: { parsed: ParsedResume; jd: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed } = body;
  const jd = sanitiseJD(body.jd);

  if (!parsed || !jd) {
    return NextResponse.json(
      { error: "missing_fields", message: "parsed and jd fields are required" },
      { status: 400 }
    );
  }

  try {
    
    const prompt = `Resume:\n${JSON.stringify(parsed, null, 2)}\n\nJob Description:\n${jd.slice(0, 4000)}`;
    const result = await complete(prompt, SYSTEM_PROMPT) as RelevanceResult;

    const safeResult: RelevanceResult = {
      score: Math.max(0, Math.min(100, Math.round(result.score ?? 0))),
      missingKeywords: Array.isArray(result.missingKeywords) ? result.missingKeywords : [],
      missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    };

    // Charge only after successful AI response
    const chargeError = await chargeCredits("JD relevance analysis");
    if (chargeError) return chargeError;

    return NextResponse.json(safeResult);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Relevance analysis failed. Please try again." },
      { status: 502 }
    );
  }
}

