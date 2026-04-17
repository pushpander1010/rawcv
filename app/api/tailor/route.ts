export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume, TailoredResume, TailorChange } from "@/types";
import { complete } from "@/lib/ai-providers";
import { randomUUID } from "crypto";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseJD } from "@/lib/api-guard";

const SYSTEM_PROMPT = `You are an expert resume tailoring specialist. Given a resume and a job description, aggressively rewrite the resume to be a perfect match for the role. You may change EVERYTHING except personal contact details (name, email, phone, location, linkedin, website).

You CAN and SHOULD change:
- Professional summary (rewrite completely to match the role)
- Job titles / roles (reframe to match JD terminology, e.g. "Software Engineer" → "Full Stack Engineer")
- Experience bullet points (rewrite to highlight JD-relevant impact)
- Skills list (reorder, add relevant skills the candidate likely has based on their experience, remove irrelevant ones)
- Project names, descriptions, and technologies (reframe to highlight JD-relevant aspects)
- Certifications (reorder by relevance)

RULES:
- Do NOT invent companies, dates, institutions, or degrees
- You MAY reframe job titles to better match the JD as long as the seniority level is preserved
- You MAY add skills that are clearly implied by the candidate's existing experience
- Make every bullet result-oriented and keyword-rich for the target role
- Return ONLY valid JSON in this exact shape:

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
- Include ALL impactful changes — do not limit yourself, cover every section
- Only include a change when the tailored version meaningfully differs
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

