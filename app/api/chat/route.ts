export const runtime = "nodejs";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume } from "@/types";
import { completeChat as complete } from "@/lib/ai-providers";
import { requireAuth, sanitiseMessages } from "@/lib/api-guard";
import { sanitizeResume } from "@/lib/sanitize-resume";
import { parseBuildResponse, parseCustomizeResponse, validateResumeUpdate } from "@/lib/chat-response-parser";

// ─── Server-side stores ────────────────────────────────────────────────────────
// NOTE: These are in-memory. For production, replace with Redis or DB.
const sectionHistoryStore = new Map<string, Record<string, unknown>>();
const buildStepStore = new Map<string, number>();

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  resumeState: Partial<ParsedResume>;
  mode: "build" | "customize";
  isGreeting?: boolean;
}

export interface ChatResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  isComplete: boolean;
  currentStep?: number;
  sectionHistory?: Record<string, unknown>;
}

interface CustomizeAIResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  undoSection: keyof ParsedResume | null;
  isComplete: boolean;
}

interface BuildAIResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  isComplete: boolean;
  nextStep: number;
}

// ─── Build steps ───────────────────────────────────────────────────────────────
const BUILD_STEPS = [
  "name",
  "email",
  "phone_location_linkedin_otherlinks",
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "projects",
  "confirmation",
] as const;

type BuildStep = typeof BUILD_STEPS[number];

function getStepName(index: number): BuildStep {
  return BUILD_STEPS[Math.min(index, BUILD_STEPS.length - 1)];
}

// ─── Analyse what's filled vs missing ─────────────────────────────────────────
interface ResumeAnalysis {
  filledSections: string[];
  missingSections: string[];        // REQUIRED fields missing
  optionalMissing: string[];        // optional fields missing (certifications, projects)
  currentStep: number;
  completionPercent: number;
}

function analyseResume(r: Partial<ParsedResume>): ResumeAnalysis {
  const filled: string[] = [];
  const missing: string[] = [];
  const optionalMissing: string[] = [];

  // Contact sub-fields
  if (r.contact?.name)     filled.push("name");          else missing.push("name");
  if (r.contact?.email)    filled.push("email");         else missing.push("email");
  if (r.contact?.phone)    filled.push("phone");         else missing.push("phone");
  if (r.contact?.location) filled.push("location");      else missing.push("location");
  if (r.contact?.linkedin) filled.push("LinkedIn");      else missing.push("LinkedIn");
  if (r.contact?.github)   filled.push("GitHub");        else missing.push("GitHub");

  // Optional contact extras — lump into one note, never block progress
  if (r.contact?.website) filled.push("website/other links");

  if (r.summary)            filled.push("professional summary"); else missing.push("professional summary");
  if (r.experience?.length) filled.push("work experience");      else missing.push("work experience");
  if (r.education?.length)  filled.push("education");            else missing.push("education");
  if (r.skills?.length)     filled.push("skills");               else missing.push("skills");

  // Optional sections
  if (r.certifications?.length) filled.push("certifications");
  else                          optionalMissing.push("certifications");

  if (r.projects?.length) filled.push("projects");
  else                    optionalMissing.push("projects");

  // Derive current build step from what's actually filled
  let step = 0;
  if (r.contact?.name)                                              step = 1;
  if (r.contact?.name && r.contact?.email)                          step = 2;
  if (r.contact?.name && r.contact?.email &&
      (r.contact?.phone || r.contact?.location || r.contact?.linkedin)) step = 3;
  if (step === 3 && r.summary)                                      step = 4;
  if (step === 4 && r.experience?.length)                           step = 5;
  if (step === 5 && r.education?.length)                            step = 6;
  if (step === 6 && r.skills?.length)                               step = 7;
  // Steps 7 (certs) and 8 (projects) are optional — only skip if we haven't reached them
  if (step === 7)                                                   step = 7; // always ask
  if (step >= 7 && (r.certifications?.length || step > 7))          step = 8;
  if (step >= 8 && (r.projects?.length || step > 8))                step = 9;

  const totalRequired = 9; // steps 0-8 before confirmation
  const completionPercent = Math.round((filled.length / (filled.length + missing.length)) * 100);

  return { filledSections: filled, missingSections: missing, optionalMissing, currentStep: step, completionPercent };
}

// ─── Build a human-readable summary of what's already in the resume ───────────
function buildResumeSnapshot(r: Partial<ParsedResume>): string {
  const parts: string[] = [];

  if (r.contact?.name)     parts.push(`Name: ${r.contact.name}`);
  if (r.contact?.email)    parts.push(`Email: ${r.contact.email}`);
  if (r.contact?.phone)    parts.push(`Phone: ${r.contact.phone}`);
  if (r.contact?.location) parts.push(`Location: ${r.contact.location}`);
  if (r.contact?.linkedin) parts.push(`LinkedIn: ${r.contact.linkedin}`);
  if (r.contact?.github)   parts.push(`GitHub: ${r.contact.github}`);
  if (r.summary)           parts.push(`Summary: (present)`);
  if (r.experience?.length)
    parts.push(`Experience: ${r.experience.length} job(s) — ${r.experience.map(j => j.title ?? "?").join(", ")}`);
  if (r.education?.length)
    parts.push(`Education: ${r.education.length} entry(ies)`);
  if (r.skills?.length)
    parts.push(`Skills: ${r.skills.slice(0, 6).join(", ")}${r.skills.length > 6 ? "…" : ""}`);
  if (r.certifications?.length)
    parts.push(`Certifications: ${r.certifications.length}`);
  if (r.projects?.length)
    parts.push(`Projects: ${r.projects.length}`);
  if (r.awards?.length)
    parts.push(`Awards: ${r.awards.length}`);

  return parts.length > 0 ? parts.join("\n") : "(empty)";
}

// ─── System prompts ────────────────────────────────────────────────────────────
const BUILD_SYSTEM_PROMPT = `You are rawcv, a resume builder that runs as a conversation. You collect facts, write the resume, and keep it to one page.

OUTPUT — reply with ONLY valid JSON, no markdown, no prose outside it:
{"message":"<what you say to the user>","resumeUpdate":<object or null>,"isComplete":<boolean>,"nextStep":<number>}

RESUME SCHEMA:
contact: {name, email, phone, location, linkedin, github, website}
summary: "2-3 sentence professional summary, no first-person pronouns"
experience: [{company, title, startDate, endDate, location, bullets:["achievement"]}]
education: [{institution, degree, field, graduationYear, gpa, coursework:["course"]}]
skills: ["skill"]
certifications: ["cert"]
awards: ["award"]
projects: [{name, description, technologies:["tech"], link, bullets:["highlight"]}]

VOICE (this is a chat, not a form):
- Maximum 2 short sentences, then exactly ONE question. Never a wall of text.
- No praise openers ("Great!", "Awesome!", "Thanks for sharing"). Acknowledge in 3 words max: "Got it." / "Added."
- Use the user's own words for facts. Never call their experience "impressive".
- One question per message. Never ask about anything already in CURRENT RESUME STATE.

STEPS:
0 name → 1 email → 2 phone + location + linkedin/portfolio (ask together) → 3 summary → 4 experience → 5 education → 6 skills → 7 certifications (optional) → 8 projects (optional) → 9 confirm
- Skip a step the moment its data exists. Jump to the next empty one.
- "skip" / "none" / "no" on steps 7-8 advances immediately.
- isComplete only after the user confirms at step 9.

BATCH INPUT (important — most users do this):
- If the user pastes a full resume, a LinkedIn blob, or several facts at once: extract EVERY field you can, return it all in ONE resumeUpdate, then reply with "Got it. I filled X, Y, Z." + the single most valuable missing question (usually a metric for the top bullet, or a missing date).
- Never ask the user to re-type something they already pasted.

WRITING RULES:
- Bullets: 12-26 words, strong verb first, result before method. Max 3 bullets per recent role, 2 for older roles, 4 jobs maximum on a one-page resume.
- Summary: 2-3 sentences, <= 45 words, no "passionate", "hardworking", "team player", no first-person pronouns.
- Skills: 8-14 hard skills, comma-free array items, most relevant first.
- NEVER invent an employer, title, date, tool, degree, or metric. If the user gave no number, write the bullet without a number — no placeholders like "[X%]".
- If the user asks you to "make one up" for a section, generate realistic role-appropriate content and clearly say it is a starting point they should edit.

ARRAYS: always return the COMPLETE array (existing + new). Never return only the new item.
resumeUpdate: null when nothing changed.

GREETING (isGreeting=true):
- Empty resume: "Hi! I'm rawcv. Tell me about your last job in your own words — or paste your current resume and I'll structure it."
- Resume in progress: "Welcome back[, name]. You have [2 sections]. Next: [the one missing piece]?" — one question only.`

const CUSTOMIZE_SYSTEM_PROMPT = `You are rawcv, a resume editor working through chat on an existing resume.

OUTPUT — reply with ONLY valid JSON:
{"message":"<reply>","resumeUpdate":<changed fields only, or null>,"undoSection":<section key or null>,"isComplete":<boolean>}

RESUME SCHEMA:
contact: {name, email, phone, location, linkedin, github, website}
summary: string
experience: [{company, title, startDate, endDate, location, bullets:["bullet"]}]
education: [{institution, degree, field, graduationYear, gpa, coursework:["course"]}]
skills: ["skill"]
certifications: ["cert"]
awards: ["honor / scholarship / hackathon result"]
projects: [{name, description, technologies:["tech"], link, bullets:["highlight"]}]

DO IT, DON'T ASK:
- Apply exactly what was asked. No clarification round-trips, no "would you like me to…" before doing it.
- Rewrites and generations must appear in resumeUpdate in the same response. Saying "I added 4 bullets" without the JSON is a failure.

VOICE:
- Max 2 sentences, then ONE concrete next suggestion (not a question dump).
- No praise openers, no "Great question", no restating the request back.
- Example: "Rewrote your 3 fintech bullets with the latency numbers you gave. Next: trim the summary to two lines?"

EDITING RULES:
- Arrays: return the COMPLETE updated array with only the requested change applied.
- Reorder requests ("move up", "swap") → return the reordered full array.
- Enhance/rewrite requests → keep every real fact, number, employer and tool. Remove filler ("responsible for", "helped with", "worked on"), put the result before the method, 12-26 words per bullet.
- NEVER invent a metric, employer, client, tool, or date. No "[X%]" placeholders. If there is no number, write the bullet without one.
- One-page discipline: if experience grows past ~6 bullets total, suggest dropping the oldest or weakest bullet instead of adding a section.
- undoSection: the section key when the user says "undo" / "revert" / "go back".
- resumeUpdate: null when nothing changed. isComplete: true only when the user says they are done.

GENERATION:
- "generate / write / improve my summary|skills|bullets" → produce role-appropriate content from what the resume already proves, include it in resumeUpdate, and tell them in one line what you based it on.
- If asked to fabricate facts they do not have, say in one short sentence that you will only write what they can defend, then offer a template with a blank for the number.

BULK EDITS: apply every requested change in one resumeUpdate.

GREETING (isGreeting=true): greet by name if known, name the single highest-impact fix (usually weak experience bullets or a vague summary), and offer to do it right now — one sentence, one offer.`;

// ─── Sanitise resume state ─────────────────────────────────────────────────────
const ALLOWED_KEYS: Array<keyof ParsedResume> = [
  "contact", "summary", "experience", "education", "skills", "certifications", "projects", "awards",
];

function sanitizeResumeState(rawState: Record<string, unknown>): Partial<ParsedResume> {
  const MAX_STR = 2000;
  const resumeState: Partial<ParsedResume> = {};
  for (const key of ALLOWED_KEYS) {
    const val = rawState[key];
    if (val === undefined) continue;
    if (typeof val === "string") {
      (resumeState as Record<string, unknown>)[key] = val.slice(0, MAX_STR);
    } else if (Array.isArray(val)) {
      (resumeState as Record<string, unknown>)[key] = val.slice(0, 30).map(item =>
        typeof item === "string" ? item.slice(0, MAX_STR) :
        item && typeof item === "object" ? Object.fromEntries(
          Object.entries(item as Record<string, unknown>).map(([k, v]) => [
            k, typeof v === "string" ? v.slice(0, MAX_STR) : v,
          ])
        ) : item
      );
    } else if (val && typeof val === "object") {
      (resumeState as Record<string, unknown>)[key] = Object.fromEntries(
        Object.entries(val as Record<string, unknown>).map(([k, v]) => [
          k, typeof v === "string" ? v.slice(0, MAX_STR) : v,
        ])
      );
    }
  }
  return resumeState;
}

// ─── Route ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const messages = sanitiseMessages(body.messages);
  if (!messages) {
    return NextResponse.json(
      { error: "missing_fields", message: "messages array is required" },
      { status: 400 }
    );
  }

  const { mode = "build" } = body;
  const resumeState = sanitizeResumeState((body.resumeState ?? {}) as Record<string, unknown>);
  const isGreeting = body.isGreeting === true;

  const sectionHistory: Record<string, unknown> = sectionHistoryStore.get(auth.userId) ?? {};

  // Always re-derive step on greeting so we never re-ask filled sections
  const analysis = analyseResume(resumeState);
  const storedStep  = buildStepStore.get(auth.userId) ?? 0;
  // On greeting: re-derive from actual resume data. On normal turn: use stored (never go back).
  const currentStep = isGreeting ? analysis.currentStep : Math.max(storedStep, analysis.currentStep);

  if (isGreeting) {
    buildStepStore.delete(auth.userId);
  }

  try {
    const systemPrompt = mode === "customize" ? CUSTOMIZE_SYSTEM_PROMPT : BUILD_SYSTEM_PROMPT;

    // ── Rich context block sent to the AI ──────────────────────────────────
    const snapshot = buildResumeSnapshot(resumeState);

    const contextLines: string[] = [
      `=== CURRENT RESUME STATE ===`,
      snapshot,
      ``,
      `=== ANALYSIS ===`,
      `Filled sections (${analysis.filledSections.length}): ${analysis.filledSections.join(", ") || "none"}`,
      `Missing REQUIRED sections (${analysis.missingSections.length}): ${analysis.missingSections.join(", ") || "none"}`,
      `Missing optional sections: ${analysis.optionalMissing.join(", ") || "none"}`,
      `Completion: ${analysis.completionPercent}%`,
    ];

    if (mode === "build") {
      contextLines.push(
        ``,
        `=== BUILD STATE ===`,
        `Current step: ${currentStep} → "${getStepName(currentStep)}"`,
        isGreeting
          ? `isGreeting=true — Greet the user, acknowledge FILLED SECTIONS (if any), and ask ONLY about the current step.`
          : `Continue from current step. Do NOT re-ask any filled section.`,
      );
    } else {
      contextLines.push(
        ``,
        `=== FULL RESUME JSON (for editing) ===`,
        JSON.stringify(resumeState, null, 2),
        ``,
        `IMPORTANT: When you make changes, ALWAYS include the complete updated data in resumeUpdate.`,
        `For example, if enhancing experience bullets, return the FULL experience array with all jobs and their updated bullets.`,
        isGreeting ? `isGreeting=true — Greet the user and ask what they'd like to improve.` : "",
      );
    }

    // Include last 20 turns of history
    const historyMessages = messages.slice(-21, -1);
    if (historyMessages.length > 0) {
      contextLines.push(
        ``,
        `=== CONVERSATION HISTORY ===`,
        historyMessages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n"),
      );
    }

    const lastMsg = messages[messages.length - 1]?.content ?? "";
    contextLines.push(``, `User: ${lastMsg}`, ``, `Respond with JSON only:`);

    const prompt = contextLines.filter(l => l !== undefined).join("\n");

    const aiResult = await complete(prompt, systemPrompt, { maxTokens: 8000 });

    // Charge 1 credit per chat message (cheaper than other AI operations)

    // ── Customize mode ────────────────────────────────────────────────────────
    if (mode === "customize") {
      // Parse and validate the AI response
      const parsed = parseCustomizeResponse(aiResult);

      let finalUpdate = validateResumeUpdate(parsed.resumeUpdate);
      const updatedHistory = { ...sectionHistory };

      if (parsed.undoSection && sectionHistory[parsed.undoSection] !== undefined) {
        const section = parsed.undoSection;
        finalUpdate = { [section]: sectionHistory[section] } as Partial<ParsedResume>;
        delete updatedHistory[section];
      } else if (finalUpdate) {
        for (const key of Object.keys(finalUpdate) as Array<keyof ParsedResume>) {
          if (resumeState[key] !== undefined) {
            updatedHistory[key] = resumeState[key];
          }
        }
      }

      sectionHistoryStore.set(auth.userId, updatedHistory);

      // Sanitize the resume update to ensure all fields are strings
      const sanitizedUpdate = finalUpdate ? sanitizeResume(finalUpdate) : null;

      return NextResponse.json({
        message: parsed.message,
        resumeUpdate: sanitizedUpdate,
        isComplete: parsed.isComplete,
        sectionHistory: updatedHistory,
      } satisfies ChatResponse);
    }

    // ── Build mode ────────────────────────────────────────────────────────────
    const parsed = parseBuildResponse(aiResult);

    // Never go backwards in steps
    const nextStep = Math.max(currentStep, parsed.nextStep);

    if (!isGreeting) {
      buildStepStore.set(auth.userId, nextStep);
    }

    // Validate and sanitize the resume update
    const validatedUpdate = validateResumeUpdate(parsed.resumeUpdate);
    const sanitizedUpdate = validatedUpdate ? sanitizeResume(validatedUpdate) : null;

    return NextResponse.json({
      message: parsed.message,
      resumeUpdate: sanitizedUpdate,
      isComplete: parsed.isComplete,
      currentStep: nextStep,
    } satisfies ChatResponse);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[chat] AI error:", detail);
    return NextResponse.json(
      {
        error: "ai_unavailable",
        message: "Chat is unavailable. Please try again.",
        ...(process.env.NODE_ENV !== "production" && { detail }),
      },
      { status: 502 }
    );
  }
}

// ─── Reset server-side state ───────────────────────────────────────────────────
export async function DELETE() {
  // Clear all stored state (no auth needed - public endpoint)
  buildStepStore.clear();
  sectionHistoryStore.clear();

  return NextResponse.json({ ok: true });
}