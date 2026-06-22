export const runtime = "nodejs";
export const maxDuration = 90;

import { NextRequest, NextResponse } from "next/server";
import { completeFast } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth } from "@/lib/api-guard";
import type { ResumeFormat } from "@/types";

const FORMAT_TIPS: Record<ResumeFormat, string> = {
  general: "Use a professional, standard cover letter format. Greeting: 'Dear Hiring Manager,'. Closing: 'Sincerely,'. Keep it to 3-4 paragraphs.",
  eu: "Use a formal European-style cover letter. Greeting: 'Dear Hiring Manager,' or 'Dear Sir/Madam,'. Closing: 'Yours faithfully,'. Be detailed and structured. Include availability date and notice period.",
  canada: "Use a Canadian-style cover letter. Greeting: 'Dear Hiring Manager,'. Closing: 'Best regards,'. Keep it concise, professional, and results-focused. No personal details beyond contact info.",
  us: "Use a US-style cover letter. Greeting: 'Dear Hiring Manager,'. Closing: 'Best regards,'. Keep it to one page max. Be direct, quantified, and results-oriented.",
};

const SYSTEM_PROMPT = `You are an expert professional cover letter writer. Generate a compelling, tailored cover letter based on the candidate's resume and the job description.

Return JSON in this exact shape:
{
  "opening": string,    // Opening paragraph (2-3 sentences, hook the reader)
  "body": string[],     // 2-3 body paragraphs (each 2-4 sentences)
  "closing": string,    // Closing paragraph (1-2 sentences, call to action)
  "signature": string   // Sign-off (e.g. "Sincerely," or "Best regards,")
}

Rules:
- Match the tone and format to the specified resume format (EU/Canada/US/General)
- Reference specific skills, experiences, and achievements from the resume
- Address the company and role specifically using the job description
- Do NOT invent facts not present in the resume
- Keep paragraphs focused and impactful
- Use strong action verbs and quantified achievements where possible
- The opening should grab attention immediately
- The closing should express enthusiasm and include a call to action`;

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: {
    resume: Record<string, unknown>;
    jobDescription: string;
    format: ResumeFormat;
    recipientName?: string;
    recipientCompany?: string;
    recipientTitle?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const { resume, jobDescription, format, recipientCompany, recipientTitle } = body;

  if (!resume || !jobDescription?.trim()) {
    return NextResponse.json(
      { error: "missing_fields", message: "resume and jobDescription are required" },
      { status: 400 }
    );
  }

  const formatTip = FORMAT_TIPS[format] || FORMAT_TIPS.general;
  const recipientInfo = recipientCompany
    ? `\nCompany: ${recipientCompany}${recipientTitle ? `\nTitle: ${recipientTitle}` : ""}`
    : "";

  // Condense resume to key fields only (avoids sending huge JSON)
  const r = resume as Record<string, unknown>;
  const contact = (r.contact ?? {}) as Record<string, string>;
  const summary = (r.summary ?? "") as string;
  const experience = (r.experience ?? []) as Array<Record<string, unknown>>;
  const education = (r.education ?? []) as Array<Record<string, unknown>>;
  const skills = (r.skills ?? []) as string[];

  const condensedResume = [
    `Name: ${contact.name ?? ""}`,
    `Email: ${contact.email ?? ""}`,
    summary ? `Summary: ${summary}` : "",
    experience.length ? `Experience:\n${experience.map((e) => `- ${e.title ?? ""} at ${e.company ?? ""} (${e.startDate ?? ""}–${e.endDate ?? ""})\n  ${(e.bullets as string[] ?? []).map((b: string) => "  • " + b).join("\n")}`).join("\n")}` : "",
    education.length ? `Education:\n${education.map((e) => `- ${e.degree ?? ""} ${e.field ?? ""} — ${e.institution ?? ""} (${e.graduationYear ?? ""})`).join("\n")}` : "",
    skills.length ? `Skills: ${skills.join(", ")}` : "",
  ].filter(Boolean).join("\n\n");

  const prompt = `Candidate Resume:\n${condensedResume}\n\nJob Description:\n${jobDescription}\n\nFormat Requirements:\n${formatTip}${recipientInfo}`;

  try {
    const result = await completeFast<{
      opening: string;
      body: string[];
      closing: string;
      signature: string;
    }>(prompt, SYSTEM_PROMPT);

    if (!result?.opening || !result?.body?.length) {
      return NextResponse.json(
        { error: "ai_unavailable", message: "Could not generate cover letter. Please try again." },
        { status: 502 }
      );
    }

    const chargeError = await chargeCredits("AI cover letter generation");
    if (chargeError) return chargeError;

    return NextResponse.json({
      opening: result.opening,
      body: result.body,
      closing: result.closing,
      signature: result.signature,
    });
  } catch {
    return NextResponse.json(
      { error: "ai_unavailable", message: "Cover letter generation failed. Please try again." },
      { status: 502 }
    );
  }
}
