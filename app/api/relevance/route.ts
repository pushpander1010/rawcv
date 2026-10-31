export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, RelevanceResult } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { requireAuth, sanitiseJD } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are a strict resume-to-job-description matcher used by candidates applying to Google, Meta, Amazon, and similar companies.

Compare the resume to the job description and score honestly. Do NOT inflate: a resume missing 2+ must-have requirements cannot score above 75.

1. Extract the JD's must-have skills, tools, domain terms, and seniority signals.
2. Mark each as present (used in a bullet/project, with context), listed only (skills section but no evidence), or absent.
3. Score by evidence, not keyword presence:
   - 85–100: nearly all must-haves are evidenced in achievement bullets, seniority matches
   - 70–84: most present, 1–2 important gaps
   - 50–69: several must-haves missing or only listed
   - 0–49: fundamentally different role or missing core requirements
4. missingKeywords: exact JD terms that are absent from the resume (max 15)
5. missingSkills: hard skills/technologies from the JD that are absent (max 10)
6. recommendations: specific, truthful edits. Never suggest inventing experience; suggest reframing existing work or learning the skill.

Return JSON only:
{
  "score": number,
  "missingKeywords": string[],
  "missingSkills": string[],
  "recommendations": string[]
}`;


export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
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

    return NextResponse.json(safeResult);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Relevance analysis failed. Please try again." },
      { status: 502 }
    );
  }
}

