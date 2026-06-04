export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, Suggestion } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { chargeCredits } from "@/lib/credits";
import { requireAuth } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an elite resume rewrite specialist. Your job is to transform weak, generic resume content into powerful, interview-winning language — without inventing facts.

Enhancement priorities (in order):
1. **Weak action verbs** → Replace "Responsible for", "Was in charge of", "Helped with", "Worked on" with strong alternatives like "Delivered", "Spearheaded", "Optimized", "Engineered", "Drove", "Architected"
2. **Missing quantification** → Where the original implies results (e.g. "improved efficiency", "increased sales", "reduced costs"), add plausible metrics that match the context. If no metric is implied, improve the language without adding numbers.
3. **Passive voice removal** → Convert passive constructions to active voice throughout
4. **Summary overhaul** → Rewrite the professional summary to be concise, impact-driven, and differentiated
5. **Filler removal** → Cut padding words (very, extremely, highly, extremely, a lot of, numerous)

CRITICAL RULES (do not violate):
- Never fabricate facts, dates, company names, job titles, or specific numbers not implied by the original
- Only add quantification when the original text clearly implies a measurable outcome
- Preserve all factual information exactly — dates, companies, titles are off-limits
- Do NOT alter dates, company names, or job titles under any circumstances

Return JSON in this exact shape:
{
  "suggestions": [
    {
      "section": string,    // "experience", "summary", "skills", or "education"
      "original": string,   // the exact text to be improved
      "improved": string,   // the enhanced version — significantly punchier
      "reason": string      // brief explanation (e.g. "Replaces passive voice with action verb")
    }
  ]
}

Rules:
- Return 3–15 suggestions
- Prioritize experience bullets and summary — these have the highest impact
- Each suggestion must target a specific, identifiable piece of text
- Make the improved version noticeably stronger, not just a minor tweak`;

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
    const result = await complete(prompt, SYSTEM_PROMPT) as { suggestions: Array<{ section: string; original: string; improved: string; reason: string }> };
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

