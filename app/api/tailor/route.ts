export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, TailoredResume, TailorChange } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { requireAuth, sanitiseJD } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are a big-tech resume tailoring specialist. Your job is to make this resume as relevant as possible to the target job WITHOUT changing who the candidate is.

WHAT YOU MAY DO:
1. Rewrite the summary to mirror the JD's role, domain, and must-have skills — using only facts already in the resume.
2. Reorder experience bullets so the most JD-relevant, highest-impact work appears first.
3. Rephrase bullets to use the JD's terminology when the underlying work is genuinely the same (e.g. "web app" → "customer-facing web application").
4. Reorder skills so JD-required, evidenced skills appear first. You may add a skill to the skills array only when it is explicitly named in the candidate's experience or projects and missing from the list.
5. Reframe project descriptions toward the JD's technologies and outcomes.
6. Reorder certifications by relevance.

HARD TRUTH RULES (never violate):
- Never change company names, job titles, employment dates, institutions, degrees, graduation years, or metrics.
- Never invent a number, percentage, dollar amount, team size, user count, latency, award, or tool.
- Never turn a contribution into ownership or a team result into individual work.
- Never add a skill that is not evidenced somewhere in the resume.
- Do not stuff keywords; every keyword must appear in a truthful context.
- Keep one page: do not add bullets, only rewrite/reorder existing ones.

Return JSON in this exact shape:
{
  "changes": [
    {
      "section": string,
      "field": string,
      "original": string,
      "tailored": string
    }
  ]
}

Field formats:
- Summary: field = "summary"
- Experience bullet: field = "experience[i].bullets[j]"
- Skills array (whole list): field = "skills" — original/tailored are JSON arrays serialized as strings
- Project description: field = "projects[i].description"
- Project technologies: field = "projects[i].technologies" — JSON array as string
- Certifications array: field = "certifications" — JSON array as string

Rules:
- Include only changes that meaningfully improve JD alignment
- Preserve the exact original text in "original" so the diff is accurate
- Prefer reordering and rewording over adding content
- If a JD requirement is genuinely absent, do not fake it; leave it out`;


export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
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
    
    const prompt = `Resume:\n${JSON.stringify(parsed, null, 2)}\n\nJob Description:\n${jd.slice(0, 6000)}`;
    const result = await complete(prompt, SYSTEM_PROMPT, { maxTokens: 8000 }) as { changes: Array<{ section: string; field: string; original: string; tailored: string }> };
    const rawChanges = Array.isArray(result.changes) ? result.changes : [];
    const changes: TailorChange[] = rawChanges.map((c) => ({
      id: randomUUID(), section: c.section ?? "experience", field: c.field ?? "", original: c.original ?? "", tailored: c.tailored ?? "", accepted: false,
    }));
    const finalResume = applyChanges(parsed, changes);
    const tailoredResume: TailoredResume = { changes, finalResume };
    // Charge only after successful AI response
    return NextResponse.json(tailoredResume);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Tailoring failed. Please try again.";
    console.error("tailor route error:", msg);
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
  const resume: ParsedResume = JSON.parse(JSON.stringify(base));

  for (const change of changes) {
    const f = change.field;

    if (change.section === "summary" && f === "summary") {
      resume.summary = change.tailored;

    } else if (change.section === "experience") {
      const titleMatch = f.match(/^experience\[(\d+)\]\.title$/);
      const bulletMatch = f.match(/^experience\[(\d+)\]\.bullets\[(\d+)\]$/);
      if (titleMatch) {
        const ei = parseInt(titleMatch[1], 10);
        if (resume.experience[ei]) resume.experience[ei].title = change.tailored;
      } else if (bulletMatch) {
        const ei = parseInt(bulletMatch[1], 10);
        const bi = parseInt(bulletMatch[2], 10);
        if (resume.experience[ei]?.bullets[bi] !== undefined)
          resume.experience[ei].bullets[bi] = change.tailored;
      }

    } else if (change.section === "skills" && f === "skills") {
      try { resume.skills = JSON.parse(change.tailored); } catch { /* skip */ }

    } else if (change.section === "projects") {
      const nameMatch = f.match(/^projects\[(\d+)\]\.name$/);
      const descMatch = f.match(/^projects\[(\d+)\]\.description$/);
      const techMatch = f.match(/^projects\[(\d+)\]\.technologies$/);
      if (nameMatch) {
        const pi = parseInt(nameMatch[1], 10);
        if (resume.projects?.[pi]) resume.projects[pi].name = change.tailored;
      } else if (descMatch) {
        const pi = parseInt(descMatch[1], 10);
        if (resume.projects?.[pi]) resume.projects[pi].description = change.tailored;
      } else if (techMatch) {
        const pi = parseInt(techMatch[1], 10);
        try {
          if (resume.projects?.[pi]) resume.projects[pi].technologies = JSON.parse(change.tailored);
        } catch { /* skip */ }
      }

    } else if (change.section === "certifications" && f === "certifications") {
      try { resume.certifications = JSON.parse(change.tailored); } catch { /* skip */ }
    }
  }

  return resume;
}

