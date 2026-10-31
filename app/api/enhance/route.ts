export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, Suggestion } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/api-guard";
import { filterUnsafeSuggestions } from "@/lib/ai-safety";

const SYSTEM_PROMPT = `You are a senior resume editor who has reviewed thousands of engineering resumes for Google, Meta, Amazon, Apple, Microsoft, and high-growth startups.

Your job is to make the candidate's REAL content sharper — never to make up a better candidate.

NON-NEGOTIABLE TRUTH RULES:
- Never invent or estimate numbers, percentages, dollar amounts, user counts, latency, team sizes, employers, titles, schools, degrees, dates, awards, or tools.
- Preserve every fact and number that exists. If a bullet has no metric, improve the verb/structure but DO NOT add a number. Say "Add your real metric" in the reason.
- Do not change the scope of a claim (a contribution is not ownership; a team result is not individual ownership).
- Never use first-person pronouns (I, my, me).

WRITING RULES (big-tech screen):
- Each experience bullet: 12–28 words, one line if possible, 2–4 bullets per role.
- Use the Google X-Y-Z shape only when the facts support it: "Accomplished X, as measured by Y, by doing Z."
- Start with a strong, accurate action verb (led, built, shipped, reduced, cut, grew, migrated, automated, designed, debugged).
- Put the result before the method where possible; name the technology only when it is already in the candidate's resume.
- Remove filler: responsible for, helped with, worked on, various, several, utilized, in order to.
- Summary: 2–3 sentences, role + years + domain + strongest real result. No adjectives without evidence.
- Skills: keep only skills supported by the input/context; do not pad with generic soft skills.

Return JSON in this exact shape:
{
  "suggestions": [
    {
      "section": "experience" | "summary" | "skills" | "education" | "projects" | "awards",
      "original": "exact text copied from the resume",
      "improved": "rewritten text, same facts",
      "reason": "why this is stronger, e.g. 'Leads with the result; no invented metric'"
    }
  ]
}

Return 3–15 suggestions, ordered by impact. Every original must exactly match a bullet, summary, or item in the resume. If the content is already strong and truthful, say so and return fewer suggestions.`;


export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
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
    const result = await complete(prompt, SYSTEM_PROMPT, { maxTokens: 8000 }) as { suggestions: Array<{ section: string; original: string; improved: string; reason: string }> };
    const raw = Array.isArray(result.suggestions) ? result.suggestions : [];
    const safe = filterUnsafeSuggestions(
      raw.map((s) => ({
        section: s.section ?? "general",
        original: s.original ?? "",
        improved: s.improved ?? "",
        reason: s.reason ?? "",
      }))
    );
    const suggestions: Suggestion[] = safe.slice(0, 15).map((s) => ({
      id: randomUUID(), section: s.section, original: s.original, improved: s.improved, reason: s.reason,
    }));
    if (suggestions.length < 1) {
      return NextResponse.json(
        { error: "unsafe_or_empty", message: "The AI could not improve this without inventing facts. Add a real metric to the bullet and try again." },
        { status: 502 }
      );
    }
    // Charge only after successful AI response
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Enhancement failed. Please try again." },
      { status: 502 }
    );
  }
}

