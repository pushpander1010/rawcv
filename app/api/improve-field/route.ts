export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { completeFast as complete } from "@/lib/ai-providers";
import { requireAuth } from "@/lib/api-guard";
import { addsNewNumbers, hasFirstPerson } from "@/lib/ai-safety";

const BodySchema = z.object({
  section: z.string().min(1).max(40),
  value: z.string().min(1).max(6000),
  context: z.string().max(2000).optional().nullable(),
});

const HINTS: Record<string, string> = {
  summary:
    "Rewrite as 2–3 sentences: role, years of experience, domain, and the strongest real result. No first-person pronouns, no 'passionate/hardworking/team player', no invented facts or numbers.",
  bullets:
    "Rewrite each bullet on its own line, one per line, no numbering. 12–28 words. Start with a strong, accurate action verb. Put the result before the method. Use the X-Y-Z shape only when the facts already contain X, Y, and Z. NEVER invent a percentage, dollar amount, team size, user count, or latency number — if the input has no metric, keep it out. Remove 'responsible for', 'helped with', 'worked on', and first-person pronouns.",
  skills:
    "Return a comma-separated list of hard skills that are explicitly present or directly evidenced in the input/context. Do not add tools, languages, or certifications the person has not shown. Keep 8–15 skills, hard skills first, no proficiency ratings.",
  project:
    "Rewrite as 1–2 concise sentences plus optional bullets: what was built, the stack, and the real outcome. Do not invent users, stars, latency, or revenue.",
  education:
    "Clean up the education text. Preserve institution, degree, field, year, GPA, and coursework exactly. Never invent any of them.",
};

const SYSTEM_PROMPT = `You are a senior big-tech resume editor. Improve ONLY the text the user provides.

Hard rules:
- Preserve every fact, number, company, title, date, school, degree, and tool exactly.
- Never invent or estimate a metric. If the input has no number, do not add one.
- Never add a skill or experience the person has not shown.
- No first-person pronouns. No filler adjectives.
- Write like a Google/Meta engineering resume: strong verb first, result before method, 12–28 words per bullet, one bullet per line.
- Return JSON only: {"improved":"<improved text>"}`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "missing_fields", message: "section and value are required" },
      { status: 400 }
    );
  }

  const { section, value, context } = parsed.data;
  const hint = HINTS[section] ?? "Improve clarity and impact. Preserve all facts exactly.";
  const prompt = `Section: ${section}\nInstruction: ${hint}\n${context ? `Context: ${context}\n` : ""}Text to improve:\n${value}`;

  try {
    const result = await complete(prompt, SYSTEM_PROMPT, {
      maxTokens: 2000,
      schema: z.object({ improved: z.string() }),
    });
    const improved = (result as { improved?: string }).improved?.trim() ?? "";
    if (!improved) {
      return NextResponse.json(
        { error: "ai_unavailable", message: "Could not improve this text. Please try again." },
        { status: 502 }
      );
    }
    if (addsNewNumbers(value, improved) || hasFirstPerson(improved)) {
      return NextResponse.json(
        {
          error: "unsafe_rewrite",
          message: "The AI tried to add a number or first-person claim that is not in your text. Add your real metric, then try again.",
        },
        { status: 422 }
      );
    }
    return NextResponse.json({ improved });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[improve-field] AI error:", detail);
    return NextResponse.json(
      { error: "ai_unavailable", message: "AI is unavailable. Please try again." },
      { status: 502 }
    );
  }
}
