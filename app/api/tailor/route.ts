export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, TailoredResume, TailorChange } from "@/types";
import { completeAnalysis as complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseJD } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert resume tailoring specialist with deep knowledge of ATS optimization and recruiter psychology. Your job: rewrite the candidate's resume to be the strongest possible match for the target job description.

Tailoring strategy:
1. **Summary** — Rewrite completely to mirror the JD's tone, required skills, and desired experience level
2. **Job titles** — Reframe to match JD terminology while preserving seniority (e.g. "Software Engineer" → "Full Stack Engineer" if both are true)
3. **Experience bullets** — Highlight achievements that align with the JD's responsibilities; rephrase non-aligned bullets to emphasize transferable skills
4. **Skills** — Reorder so JD-required skills appear first; add skills clearly implied by experience; remove irrelevant ones
5. **Projects** — Reframe descriptions to emphasize technologies and outcomes the JD asks for
6. **Certifications** — Reorder by relevance to the target role

CRITICAL RULES (do not violate):
- Never invent companies, dates, institutions, or degrees
- You MAY reframe job titles to better match the JD as long as seniority is preserved
- You MAY add skills that are clearly implied by the candidate's existing experience
- Make every bullet result-oriented and keyword-rich for the target role

Return JSON in this exact shape:

{
  "changes": [
    {
      "section": string,   // "summary" | "experience" | "skills" | "projects" | "certifications"
      "field": string,     // see field formats below
      "original": string,  // exact original text (or JSON string for arrays)
      "tailored": string   // rewritten version (or JSON string for arrays)
    }
  ]
}

Field formats:
- Summary: field = "summary"
- Experience title: field = "experience[i].title"
- Experience bullet: field = "experience[i].bullets[j]"
- Skills array (whole list): field = "skills"  — original/tailored are JSON arrays serialized as strings
- Project description: field = "projects[i].description"
- Project name: field = "projects[i].name"
- Project technologies: field = "projects[i].technologies" — JSON array as string
- Certifications array: field = "certifications" — JSON array as string

Rules:
- Include ALL impactful changes — cover every section that needs adjustment
- Only include a change when the tailored version meaningfully differs from the original
- Each tailored version must be factually grounded in the original resume`;

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
    
    const prompt = `Resume:\n${JSON.stringify(parsed, null, 2)}\n\nJob Description:\n${jd.slice(0, 6000)}`;
    const result = await complete(prompt, SYSTEM_PROMPT) as { changes: Array<{ section: string; field: string; original: string; tailored: string }> };
    const rawChanges = Array.isArray(result.changes) ? result.changes : [];
    const changes: TailorChange[] = rawChanges.map((c) => ({
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

