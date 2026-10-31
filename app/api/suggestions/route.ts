export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, Suggestion } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert big-tech resume coach. Review the resume the way a Google/Meta/Amazon engineering screener would, then propose only factual improvements.

TRUTH RULES (highest priority):
- Never invent metrics, percentages, dollar amounts, employers, titles, dates, degrees, awards, or tools.
- Preserve every number and fact. If a result is missing, rewrite for clarity and put "Add your real metric" in the reason.
- Do not upgrade a contribution into ownership or a team result into individual work.

BIG-TECH REVIEW PRIORITIES:
1. Bullet quality: X-Y-Z shape (accomplished X, measured by Y, by doing Z), strong first verb, result before method, 12–28 words.
2. Evidence: metrics, scale, latency, revenue, users, time saved — only when already present or clearly implied without inventing a figure.
3. Duties disguised as achievements ("Responsible for...", "Worked on..."): rewrite around outcome and scope.
4. Summary: 2–3 sentences, role + years + strongest real outcome; no "passionate/hardworking".
5. Skills: hard skills evidenced by the resume; flag unproven keyword lists rather than adding more.
6. Student signal: GPA, relevant coursework, projects with links, awards/leadership.
7. One-page density: cut low-value bullets and filler.

Return JSON in this exact shape:
{
  "suggestions": [
    {
      "section": "experience" | "summary" | "skills" | "education" | "projects" | "awards",
      "original": "exact text from the resume",
      "improved": "rewritten version, same facts and numbers",
      "reason": "specific screen-level reason, e.g. 'Adds a real metric placeholder' or 'Leads with outcome'"
    }
  ]
}

Rules:
- 3–15 suggestions, most impactful first
- "original" must exactly match existing text
- Never return a suggestion that only changes style without improving clarity or evidence
- If the resume is already strong, return fewer, sharper suggestions`;


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
    const suggestions: Suggestion[] = raw.slice(0, 15).map((s) => ({
      id: randomUUID(), section: s.section ?? "general", original: s.original ?? "", improved: s.improved ?? "", reason: s.reason ?? "",
    }));
    if (suggestions.length < 1) {
      return NextResponse.json({ error: "ai_unavailable", message: "Could not generate suggestions. Please try again." }, { status: 502 });
    }
    // Charge only after successful AI response
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Suggestions generation failed. Please try again." },
      { status: 502 }
    );
  }
}

