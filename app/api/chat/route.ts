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

// Tracks which build step each user is on — prevents re-asking completed steps
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
// Each step maps to a section. The AI uses this to know exactly where it is.
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

// ─── Derive the furthest completed step from existing resume data ──────────────
// Used on first turn so the AI skips sections that are already filled.
function deriveStepFromResume(r: Partial<ParsedResume>): number {
  if (!r.contact?.name) return 0;
  if (!r.contact?.email) return 1;
  if (!r.contact?.phone && !r.contact?.location && !r.contact?.linkedin) return 2;
  if (!r.summary) return 3;
  if (!r.experience?.length) return 4;
  if (!r.education?.length) return 5;
  if (!r.skills?.length) return 6;
  if (!r.certifications?.length) return 7;
  if (!r.projects?.length) return 8;
  return 9; // everything filled — go straight to confirmation
}

// ─── System prompts ────────────────────────────────────────────────────────────
const BUILD_SYSTEM_PROMPT = `You are a resume-building assistant. Your job is to INTERVIEW the user — always ask questions, never make statements without a follow-up question. You are a detective gathering information.

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

STEP ORDER (strict — never skip forward, never go back):
0 = name
1 = email
2 = phone + location + linkedin + other links (ask all together)
3 = summary
4 = work experience (collect all jobs; ask "Any other positions? Or type 'done'" after each)
5 = education
6 = skills
7 = certifications (optional; if none, skip to 8)
8 = projects (optional; if none, skip to 9)
9 = confirmation — show a brief summary and ask "Does everything look correct?"
DONE = isComplete: true (only after user confirms at step 9)

INTERROGATION RULES (CRITICAL):
1. ALWAYS end your message with a question mark "?" — no exceptions unless isComplete is true
2. If the user gives a vague or incomplete answer, cross-question them before moving on:
   - Vague job title → "What exactly did you do as [title]? Can you give me 2-3 key achievements?"
   - No dates → "When did you start and end at [company]?"
   - Short summary → "That's a start — can you tell me more about your specialisation or key strengths?"
   - Missing location → "Where are you based?"
3. Only advance to the next step when you have COMPLETE data for the current step
4. Never ask about a section that already has data in CURRENT RESUME STATE
5. Never ask two different sections in the same message — focus on ONE step at a time
6. After collecting each section, acknowledge briefly (≤5 words) then immediately ask the next question
7. resumeUpdate: include ONLY fields changed this turn. null if nothing changed
8. isComplete: true ONLY when user confirms at step 9
9. If user says "skip", "none", or "no" for optional sections (certifications/projects), advance and ask next
10. If user says "generate"/"make them up"/"suggest" — generate realistic data from context, include in resumeUpdate, advance step

GREETING RULE (isGreeting=true):
- Greet the user warmly
- If resume has data: acknowledge what's already filled and ask about the CURRENT STEP
- If resume is empty: introduce yourself and ask for their full name
- Always end with a question`;

const CUSTOMIZE_SYSTEM_PROMPT = `You are an expert resume coach helping the user improve their existing resume through conversation. You ALWAYS ask a follow-up question after every response.

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

INTERROGATION RULES:
1. ALWAYS end your message with a question — never leave the user without clear next action
2. If the user's request is vague, ask for clarification before making changes
3. After every change, check MISSING SECTIONS and ask about the most important missing one
4. Cross-question weak content: "That bullet point is quite generic — can you add a specific metric or outcome?"`;


// ─── Helpers ───────────────────────────────────────────────────────────────────
function getMissingSections(r: Partial<ParsedResume>): string[] {
  const missing: string[] = [];
  if (!r.contact?.name) missing.push("contact name");
  if (!r.contact?.email) missing.push("email");
  if (!r.contact?.phone) missing.push("phone");
  if (!r.contact?.linkedin) missing.push("linkedin");
  if (!r.contact?.website) missing.push("other links");
  if (!r.summary) missing.push("professional summary");
  if (!r.experience?.length) missing.push("work experience");
  if (!r.education?.length) missing.push("education");
  if (!r.certifications?.length) missing.push("certifications");
  if (!r.projects?.length) missing.push("projects");
  if (!r.skills?.length) missing.push("skills");
  return missing;
}

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

  // Server-side stores
  const sectionHistory: Record<string, unknown> = sectionHistoryStore.get(auth.userId) ?? {};

  // On greeting or first turn, reset the step store so it re-derives from resume state
  const isFirstTurn = isGreeting || !buildStepStore.has(auth.userId);
  const storedStep = buildStepStore.get(auth.userId) ?? 0;
  const currentStep = isFirstTurn ? deriveStepFromResume(resumeState) : storedStep;

  // If this is a greeting reset, clear the step store so next real turn starts fresh
  if (isGreeting) {
    buildStepStore.delete(auth.userId);
  }

  try {
    const systemPrompt = mode === "customize" ? CUSTOMIZE_SYSTEM_PROMPT : BUILD_SYSTEM_PROMPT;

    // Build the context block
    const missing = getMissingSections(resumeState);
    const missingBlock = missing.length > 0
      ? `MISSING SECTIONS: ${missing.join(", ")}`
      : "MISSING SECTIONS: none";

    const stateBlock = mode === "build"
      ? [
          `CURRENT RESUME STATE:\n${Object.keys(resumeState).length > 0 ? JSON.stringify(resumeState, null, 2) : "(empty)"}`,
          `CURRENT STEP: ${currentStep} (${getStepName(currentStep)})`,
          missingBlock,
          isFirstTurn
            ? `NOTE: ${isGreeting ? "isGreeting=true. " : ""}Greet the user, briefly acknowledge what sections are already filled (if any), and then ask only about the CURRENT STEP.`
            : "",
        ].filter(Boolean).join("\n\n")
      : [
          `CURRENT RESUME:\n${JSON.stringify(resumeState, null, 2)}`,
          missingBlock,
          isGreeting ? "NOTE: isGreeting=true. Greet the user and ask what they would like to improve." : "",
        ].filter(Boolean).join("\n\n");

    // Include last 20 turns of history, exclude the current message
    const historyMessages = messages.slice(-21, -1);
    const historyBlock = historyMessages.length > 0
      ? `CONVERSATION HISTORY:\n${historyMessages
          .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n")}`
      : "";

    const lastMsg = messages[messages.length - 1]?.content ?? "";

    const prompt = [
      stateBlock,
      historyBlock,
      `User: ${lastMsg}`,
      "Respond with JSON only:",
    ]
      .filter(Boolean)
      .join("\n\n");

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

    // Persist the step the AI says to advance to; never go backwards
    // Don't persist step on greeting — let the next real turn set it
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

// ─── Reset server-side state (called when user clicks Reset) ──────────────────
export async function DELETE() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  buildStepStore.delete(auth.userId);
  sectionHistoryStore.delete(auth.userId);

  return NextResponse.json({ ok: true });
}
