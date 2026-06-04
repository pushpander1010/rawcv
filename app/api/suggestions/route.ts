export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, Suggestion } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { chargeCredits } from "@/lib/credits";
import { requireAuth } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert senior resume coach and career strategist. Thoroughly analyze the provided resume and generate targeted, high-impact improvement suggestions.

Cover these areas in priority order:
1. **Action verb strength** — replace weak/passive verbs (was, was responsible for, helped with) with powerful alternatives (drove, delivered, implemented, optimized, spearheaded)
2. **Quantification** — add specific metrics, percentages, dollar amounts, time saved wherever the original implies results
3. **Clarity & conciseness** — tighten verbose phrases, remove filler words, improve readability
4. **Section completeness** — flag sections that are too thin or missing critical elements
5. **Summary impact** — strengthen the professional summary to differentiate the candidate
6. **Keyword optimization** — suggest terms that would strengthen ATS matching for the implied role

Return JSON in this exact shape:
{
  "suggestions": [
    {
      "section": string,    // e.g. "experience", "summary", "skills", "education", "projects"
      "original": string,   // the exact text to be improved
      "improved": string,   // the improved version — significantly better, not just a tweak
      "reason": string      // brief explanation of why this change helps (e.g. "Adds measurable impact" / "Replaces passive voice")
    }
  ]
}

Rules:
- Return 3–15 suggestions, ordered by impact (most important first)
- Never fabricate facts, dates, company names, job titles, or degree names
- Keep improved text factually consistent with the original scope
- Each suggestion must target a specific, identifiable piece of text
- Make the improved version genuinely better — not just a minor wording change`;

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
      return NextResponse.json({ error: "ai_unavailable", message: "Could not generate enough suggestions. Please try again." }, { status: 502 });
    }
    // Charge only after successful AI response
    const chargeError = await chargeCredits("AI suggestions");
    if (chargeError) return chargeError;
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Suggestions generation failed. Please try again." },
      { status: 502 }
    );
  }
}

