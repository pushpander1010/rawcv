export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, Suggestion } from "@/types";
import { complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { chargeCredits } from "@/lib/credits";
import { requireAuth } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert resume coach. Analyze the provided resume and generate improvement suggestions covering:
- Clarity and conciseness of bullet points
- Action verb usage (replace weak verbs with strong ones)
- Quantification of achievements (add metrics where possible)
- Section completeness (missing or thin sections)
- Professional summary impact

Return ONLY valid JSON in this exact shape:
{
  "suggestions": [
    {
      "section": string,    // e.g. "experience", "summary", "skills", "education"
      "original": string,   // the exact text to be improved
      "improved": string,   // the improved version
      "reason": string      // brief explanation of why this change helps
    }
  ]
}

Rules:
- Return between 3 and 15 suggestions
- Focus on the highest-impact improvements first
- Do NOT fabricate facts, dates, company names, or job titles
- Keep improved text factually consistent with the original
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

