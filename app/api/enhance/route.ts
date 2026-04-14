import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, Suggestion } from "@/types";
import { complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { chargeCredits } from "@/lib/credits";
import { requireAuth } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert resume writer specializing in enhancement without a job description. Your goal is to improve the overall quality and impact of the resume.

Focus on:
- Rewriting weak bullet points with stronger action verbs (e.g. "Responsible for managing" → "Led and managed")
- Adding quantified outcomes where the context implies measurable results (e.g. "improved performance" → "improved performance by 30%") — only when the original text implies a measurable outcome
- Improving the professional summary for clarity, impact, and conciseness
- Removing filler phrases and passive voice

CRITICAL RULES:
- Do NOT fabricate facts, dates, company names, job titles, or specific numbers that are not implied by the original
- Only add quantification when the original text clearly implies a measurable result
- Preserve all factual information exactly
- Do NOT alter dates, company names, or job titles

Return ONLY valid JSON in this exact shape:
{
  "suggestions": [
    {
      "section": string,    // "experience", "summary", "skills", or "education"
      "original": string,   // the exact text to be improved
      "improved": string,   // the enhanced version
      "reason": string      // brief explanation of the improvement
    }
  ]
}

Rules:
- Return between 3 and 15 suggestions
- Prioritize experience bullets and summary — these have the highest impact
- Each suggestion must target a specific, identifiable piece of text from the resume`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: { parsed: ParsedResume };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { parsed } = body;

  if (!parsed) {
    return NextResponse.json(
      { error: "missing_fields", message: "parsed field is required" },
      { status: 400 }
    );
  }

  try {
    
    const prompt = `Resume data:\n${JSON.stringify(parsed, null, 2)}`;
    const json = await complete(prompt, SYSTEM_PROMPT);
    const result = JSON.parse(json) as { suggestions: Array<{ section: string; original: string; improved: string; reason: string }> };
    const raw = Array.isArray(result.suggestions) ? result.suggestions : [];
    const suggestions: Suggestion[] = raw.slice(0, 15).map((s) => ({
      id: randomUUID(), section: s.section ?? "general", original: s.original ?? "", improved: s.improved ?? "", reason: s.reason ?? "",
    }));
    if (suggestions.length < 3) {
      return NextResponse.json({ error: "ai_unavailable", message: "Could not generate enough enhancements. Please try again." }, { status: 502 });
    }
    // Charge only after successful AI response
    const chargeError = await chargeCredits("Resume enhancement");
    if (chargeError) return chargeError;
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Enhancement failed. Please try again." },
      { status: 502 }
    );
  }
}

