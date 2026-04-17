export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume } from "@/types";
import { completeChat as complete } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseMessages } from "@/lib/api-guard";

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

  return parts.length > 0 ? parts.join("\n") : "(empty)";
}

// ─── System prompts ────────────────────────────────────────────────────────────
const BUILD_SYSTEM_PROMPT = `You are a resume-building assistant. Your job is to INTERVIEW the user — always ask questions, never make statements without a follow-up question.

STRICT OUTPUT RULE — respond with ONLY valid JSON, no markdown, no extra text:
{"message":"<your message>","resumeUpdate":<object or null>,"isComplete":<boolean>,"nextStep":<number>}

RESUME FIELDS:
contact: {name, email, phone, location, linkedin, website}
summary: "3-4 sentence professional summary"
experience: [{company, title, startDate, endDate, bullets:["achievement 1","achievement 2"]}]
education: [{institution, degree, field, graduationYear}]
skills: ["skill1","skill2"]
certifications: ["cert1"]
projects: [{name, description, technologies:["tech1"]}]

STEP ORDER (strict — never skip required steps):
0 = name
1 = email
2 = phone + location + linkedin + other links (ask all together in one message)
3 = summary
4 = work experience (collect all jobs; ask "Any other positions? Or say 'done'" after each)
5 = education
6 = skills
7 = certifications (optional — if user says "none"/"skip", move to step 8)
8 = projects (optional — if user says "none"/"skip", move to step 9)
9 = confirmation — show a brief bullet summary and ask "Does everything look correct?"
DONE = isComplete: true (only after user confirms at step 9)

INTERROGATION RULES (CRITICAL — read every rule):
1. ALWAYS end your message with a "?" — no exceptions unless isComplete is true
2. NEVER ask about a field that is already present in CURRENT RESUME STATE
3. NEVER ask two different sections in the same message — focus on ONE step at a time
4. If the user's answer is vague or incomplete, cross-question BEFORE advancing:
   - Vague title → "What exactly did you do as [title]? Give me 2-3 key achievements."
   - No dates → "When did you start and end at [company]?"
   - Short summary → "Can you tell me more about your specialisation or biggest strengths?"
   - Missing location → "Where are you currently based?"
5. Only advance nextStep when you have COMPLETE, quality data for the current step
6. After collecting a section, acknowledge in ≤5 words then immediately ask the next question
7. resumeUpdate: include ONLY fields changed this turn — null if nothing changed
8. isComplete: true ONLY when user explicitly confirms at step 9
9. If user says "skip"/"none"/"no" for optional sections (7, 8), advance and ask next
10. If user says "generate"/"suggest"/"make one up" — create realistic data from context, include in resumeUpdate, advance step

GREETING BEHAVIOUR (when isGreeting=true in context):
- Read FILLED SECTIONS and MISSING REQUIRED SECTIONS carefully
- If resume has data: say "Welcome back [name if known]! I can see you've already added [list filled sections briefly]. Let's continue — [ask about the CURRENT STEP section only]"
- If resume is empty: say "Hi! I'm your resume assistant. Let's build your resume step by step. What's your full name?"
- Never ask about already-filled sections during greeting
- Always end with exactly ONE question about the current step`;

const CUSTOMIZE_SYSTEM_PROMPT = `You are an expert resume coach helping the user improve their existing resume through conversation.

OUTPUT FORMAT — every response must be exactly this JSON shape, no exceptions:
{"message":"<your reply>","resumeUpdate":<changed fields only, or null>,"undoSection":<section key or null>,"isComplete":<boolean>}

RESUME SCHEMA (use these exact field names):
contact: {name, email, phone, location, linkedin, website}
summary: string
experience: [{company, title, startDate, endDate, bullets:["bullet"]}]
education: [{institution, degree, field, graduationYear}]
skills: ["skill1"]
certifications: ["cert1"]
projects: [{name, description, technologies:["tech1"]}]

EDITING RULES:
- Apply EXACTLY what the user asks — do not change anything they did not mention
- For arrays, return the COMPLETE updated array with only the requested change applied
- REORDERING: if user says "move up", "swap", or "put X before Y" — reorder and return full updated array
- undoSection: set to the section key if user says "undo"/"revert"/"go back"
- resumeUpdate: null if no data changed
- isComplete: true only when user explicitly says they are done

PROACTIVE GAP-FILLING (IMPORTANT):
After every change, check MISSING SECTIONS in the context:
- If there are REQUIRED sections missing, always end your message by asking about the most important one
- Priority order: name > email > phone/location > summary > experience > education > skills
- If all required sections are present but optional ones are missing, ask about certifications then projects
- Never ask about a section that already has data

INTERROGATION RULES:
1. ALWAYS end your message with a question — never leave the user without a clear next action
2. If the user's request is vague, ask for clarification before making changes
3. Cross-question weak content: "That bullet is quite generic — can you add a specific metric or outcome?"`;

// ─── Sanitise resume state ─────────────────────────────────────────────────────
const ALLOWED_KEYS: Array<keyof ParsedResume> = [
  "contact", "summary", "experience", "education", "skills", "certifications", "projects",
];

function sanitizeResumeState(rawState: Record<string, unknown>): Partial<ParsedResume> {
  const MAX_STR = 500;
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
  const auth = await requireAuth();
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

    const aiResult = await complete(prompt, systemPrompt);

    // Charge after AI responds
    const chargeError = await chargeCredits("Chat bot");
    if (chargeError) return chargeError;

    // ── Customize mode ────────────────────────────────────────────────────────
    if (mode === "customize") {
      const parsed = (aiResult ?? {}) as CustomizeAIResponse;

      if (parsed.resumeUpdate !== null && typeof parsed.resumeUpdate !== "object") {
        parsed.resumeUpdate = null;
      }

      let finalUpdate = parsed.resumeUpdate ?? null;
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

      return NextResponse.json({
        message: parsed.message ?? "Done! What else would you like to change?",
        resumeUpdate: finalUpdate,
        isComplete: parsed.isComplete ?? false,
        sectionHistory: updatedHistory,
      } satisfies ChatResponse);
    }

    // ── Build mode ────────────────────────────────────────────────────────────
    const parsed = (aiResult ?? {}) as BuildAIResponse;

    if (parsed.resumeUpdate !== null && typeof parsed.resumeUpdate !== "object") {
      parsed.resumeUpdate = null;
    }

    // Never go backwards in steps
    const nextStep = typeof parsed.nextStep === "number"
      ? Math.max(currentStep, parsed.nextStep)
      : currentStep;

    if (!isGreeting) {
      buildStepStore.set(auth.userId, nextStep);
    }

    return NextResponse.json({
      message: parsed.message ?? "Got it! What's next?",
      resumeUpdate: parsed.resumeUpdate ?? null,
      isComplete: parsed.isComplete ?? false,
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
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  buildStepStore.delete(auth.userId);
  sectionHistoryStore.delete(auth.userId);

  return NextResponse.json({ ok: true });
}