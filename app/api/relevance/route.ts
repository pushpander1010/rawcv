import { NextRequest, NextResponse } from "next/server";
import type { ModelId, ParsedResume, RelevanceResult } from "@/types";
import { createProvider } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";

const SYSTEM_PROMPT = `You are a resume-to-job-description relevance expert. Analyze the provided resume and job description, then return ONLY valid JSON in this exact shape:
{
  "score": number,           // 0–100 relevance score
  "missingKeywords": string[], // keywords in JD not found in resume
  "missingSkills": string[],   // skills in JD absent from resume skills section
  "recommendations": string[]  // prioritized, actionable recommendations (max 8)
}

Scoring guidance:
- 90–100: Resume strongly matches the JD with most keywords and skills present
- 70–89: Good match with minor gaps
- 50–69: Moderate match, several important keywords/skills missing
- 0–49: Poor match, significant gaps

Keep missingKeywords to the most impactful terms (max 15). Keep missingSkills focused on hard skills (max 10). Recommendations should be specific and actionable.`;

export async function POST(req: NextRequest) {
  let body: { parsed: ParsedResume; jd: string; model: ModelId };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const { parsed, jd, model } = body;

  if (!parsed || !jd?.trim()) {
    return NextResponse.json(
      { error: "missing_fields", message: "parsed and jd fields are required" },
      { status: 400 }
    );
  }

  try {
    const chargeError = await chargeCredits(model ?? "openrouter-gemma-4-27b", "JD relevance analysis");
    if (chargeError) return chargeError;

    const provider = createProvider(model ?? "openrouter-gemma-4-27b");
    const prompt = `Resume:\n${JSON.stringify(parsed, null, 2)}\n\nJob Description:\n${jd.slice(0, 4000)}`;
    const json = await provider.complete(prompt, SYSTEM_PROMPT);
    const result = JSON.parse(json) as RelevanceResult;

    // Clamp score to valid range
    const safeResult: RelevanceResult = {
      score: Math.max(0, Math.min(100, Math.round(result.score ?? 0))),
      missingKeywords: Array.isArray(result.missingKeywords) ? result.missingKeywords : [],
      missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    };

    return NextResponse.json(safeResult);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Relevance analysis failed. Please try again." },
      { status: 502 }
    );
  }
}

