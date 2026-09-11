export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { completeFast as complete } from "@/lib/ai-providers";
import { requireAuth } from "@/lib/api-guard";

const BodySchema = z.object({
  section: z.string().min(1).max(40),
  value: z.string().min(1).max(6000),
  context: z.string().max(2000).optional().nullable(),
});

const HINTS: Record<string, string> = {
  summary:
    "Rewrite as a concise 3-4 sentence professional summary. Impact-driven, no filler, no invented employers or dates.",
  bullets:
    "Rewrite each bullet on its own line. Start with a strong action verb, keep 1-2 lines each, add a plausible metric only where the original implies a measurable outcome. Never invent companies, titles, or dates. Return bullets only, one per line, no numbering.",
  skills:
    "Return a comma-separated list of 8-12 relevant hard + soft skills based on the input and context. No explanations, just the list.",
  project:
    "Rewrite as a concise 2-3 sentence project description highlighting stack, role, and outcome. No invented metrics unless implied.",
  education:
    "Clean up the education text. Never invent institutions, degrees, or years.",
};

const SYSTEM_PROMPT = `You are a resume writing assistant. Improve ONLY the text the user provides.
Rules:
- Preserve all facts exactly — no invented employers, titles, dates, numbers, or skills.
- Keep the same language the input uses.
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
