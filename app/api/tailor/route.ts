export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, TailoredResume, TailorChange } from "@/types";
import { complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseJD } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert resume tailoring specialist. Given a resume and a job description, rewrite the resume's experience bullets and professional summary to better align with the role.

CRITICAL RULES:
- Do NOT fabricate any experience, skills, companies, dates, or job titles
- Only rephrase and reframe existing content using keywords from the JD
- Preserve all factual information exactly
- Focus on incorporating relevant JD keywords naturally
- Strengthen action verbs where appropriate
- Return ONLY valid JSON in this exact shape:

{
  "changes": [
    {
      "section": string,   // "summary" or "experience"
      "field": string,     // e.g. "summary", "experience[0].bullets[1]"
      "original": string,  // exact original text
      "tailored": string   // rewritten version aligned with JD
    }
  ]
}

Rules:
- Only include changes where the tailored version meaningfully differs from the original
- Limit to the most impactful changes (max 15)
- For experience bullets, reference the field as "experience[i].bullets[j]" where i and j are the indices
- For summary, use field "summary"
- Each tailored version must remain factually accurate to the original`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
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
    const json = await complete(prompt, SYSTEM_PROMPT);
    const result = JSON.parse(json) as { changes: Array<{ section: string; field: string; original: string; tailored: string }> };
    const rawChanges = Array.isArray(result.changes) ? result.changes : [];
    const changes: TailorChange[] = rawChanges.slice(0, 15).map((c) => ({
      id: randomUUID(), section: c.section ?? "experience", field: c.field ?? "", original: c.original ?? "", tailored: c.tailored ?? "", accepted: false,
    }));
    const finalResume = applyChanges(parsed, changes);
    const tailoredResume: TailoredResume = { changes, finalResume };
    // Charge only after successful AI response
    const chargeError = await chargeCredits("JD tailoring");
    if (chargeError) return chargeError;
    return NextResponse.json(tailoredResume);
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Tailoring failed. Please try again." },
      { status: 502 }
    );
  }
}

/**
 * Apply accepted (or all) changes to produce a finalResume.
 * Used here to pre-build the finalResume with all changes applied;
 * the client will re-apply only accepted ones before export.
 */
function applyChanges(base: ParsedResume, changes: TailorChange[]): ParsedResume {
  // Deep clone
  const resume: ParsedResume = JSON.parse(JSON.stringify(base));

  for (const change of changes) {
    if (change.section === "summary" && change.field === "summary") {
      resume.summary = change.tailored;
    } else if (change.section === "experience") {
      // Parse field like "experience[0].bullets[1]"
      const expMatch = change.field.match(/experience\[(\d+)\]\.bullets\[(\d+)\]/);
      if (expMatch) {
        const ei = parseInt(expMatch[1], 10);
        const bi = parseInt(expMatch[2], 10);
        if (resume.experience[ei]?.bullets[bi] !== undefined) {
          resume.experience[ei].bullets[bi] = change.tailored;
        }
      }
    }
  }

  return resume;
}

