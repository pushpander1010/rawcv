export const runtime = "nodejs";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume } from "@/types";
import { completeChat as complete } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseMessages } from "@/lib/api-guard";

/** Server-side undo history — never sent to or trusted from the client */
const sectionHistoryStore = new Map<string, Record<string, unknown>>();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  resumeState: Partial<ParsedResume>;
  mode: "build" | "customize";
  sectionHistory?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  isComplete: boolean;
  /** Updated section history after this turn (only returned in customize mode) */
  sectionHistory?: Record<string, unknown>;
}

const BUILD_SYSTEM_PROMPT = `You are a resume-building assistant. Interview the user to collect their resume data through conversation.

STRICT OUTPUT RULE — respond with ONLY this JSON, nothing else:
{"message":"<your message ending with a question>","resumeUpdate":<object or null>,"isComplete":<boolean>}

THE SINGLE MOST IMPORTANT RULE:
Every "message" value MUST end with a question mark. No exceptions. If your message does not end with "?", rewrite it until it does.

RESUME FIELDS:
contact: {name, email, phone, location, linkedin, website}
summary: "2-3 sentence professional summary"
experience: [{company, title, startDate, endDate, bullets:["achievement 1","achievement 2"]}]
education: [{institution, degree, field, graduationYear}]
skills: ["skill1","skill2"]
certifications: ["cert1"]
projects: [{name, description, technologies:["tech1"]}]

CONVERSATION FLOW — collect in this order, skip already-collected fields:
1. name → 2. email → 3. phone + city + linkedin (together, all optional) → 4. summary → 5. work experience (loop until done) → 6. education → 7. skills → 8. certifications (skip if none) → 9. projects (skip if none) → 10. confirmation

RULES:
- Acknowledge the answer in ≤5 words, then immediately ask the next question — in the SAME message
- resumeUpdate: include only fields changed this turn. null if nothing was collected
- For arrays always return the COMPLETE updated array
- isComplete: true only after step 10 confirmation
- Never ask for something already in COLLECTED SO FAR

EXAMPLES:
Input: "Pushpa"
Output: {"message":"Got it! What is your email address?","resumeUpdate":{"contact":{"name":"Pushpa"}},"isComplete":false}

Input: "pushpa@gmail.com"
Output: {"message":"Perfect! What is your phone number, city, and LinkedIn URL? (all optional, skip any)","resumeUpdate":{"contact":{"email":"pushpa@gmail.com"}},"isComplete":false}

Input: "skip"
Output: {"message":"No problem! In 2-3 sentences, how would you describe your professional background?","resumeUpdate":null,"isComplete":false}

Input: "I worked at Google as SWE from 2020 to 2023"
Output: {"message":"Great! What were 2-3 key achievements or responsibilities at Google?","resumeUpdate":{"experience":[{"company":"Google","title":"Software Engineer","startDate":"2020","endDate":"2023","bullets":[]}]},"isComplete":false}`;

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
- REORDERING: if user says "move [job/item] up", "swap first and second", or "put X before Y" — reorder the array and return the full reordered array in resumeUpdate
- undoSection: set to the section key if user says "undo"/"revert"/"go back"
- resumeUpdate: null if no data changed
- isComplete: true only when user explicitly says they are done

PROACTIVE COACHING — mandatory after every change:
- After applying a change, check MISSING SECTIONS in the prompt
- If sections are missing, end your message with: "Done! Your resume is also missing [section] — would you like to add that now?"
- Then ask a specific interview question for that section
- Never end a message without either completing the resume or pointing to the next missing section`;


interface CustomizeAIResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  undoSection: keyof ParsedResume | null;
  isComplete: boolean;
}

// Compute missing sections so the AI always knows exactly what to ask next
function getMissingSections(r: Partial<ParsedResume>): string[] {
  const missing: string[] = [];
  if (!r.contact?.name) missing.push("contact name");
  if (!r.contact?.email) missing.push("email");
  if (!r.summary) missing.push("professional summary");
  if (!r.experience?.length) missing.push("work experience");
  if (!r.education?.length) missing.push("education");
  if (!r.skills?.length) missing.push("skills");
  return missing;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const messages = sanitiseMessages(body.messages);
  if (!messages) {
    return NextResponse.json({ error: "missing_fields", message: "messages array is required" }, { status: 400 });
  }
  const { mode = "build" } = body;

  // Server-side section history — keyed by userId, never trusted from client
  const sectionHistory: Record<string, unknown> = sectionHistoryStore.get(auth.userId) ?? {};

  // Sanitize resumeState: only allow known schema keys, truncate strings
  const ALLOWED_KEYS: Array<keyof ParsedResume> = ["contact", "summary", "experience", "education", "skills", "certifications", "projects"];
  const MAX_STR = 500;
  const rawState = body.resumeState ?? {};
  const resumeState: Partial<ParsedResume> = {};
  for (const key of ALLOWED_KEYS) {
    const val = (rawState as Record<string, unknown>)[key];
    if (val === undefined) continue;
    if (typeof val === "string") {
      (resumeState as Record<string, unknown>)[key] = val.slice(0, MAX_STR);
    } else if (Array.isArray(val)) {
      (resumeState as Record<string, unknown>)[key] = val.slice(0, 30).map(item =>
        typeof item === "string" ? item.slice(0, MAX_STR) :
        item && typeof item === "object" ? Object.fromEntries(
          Object.entries(item as Record<string, unknown>).map(([k, v]) => [k, typeof v === "string" ? v.slice(0, MAX_STR) : v])
        ) : item
      );
    } else if (val && typeof val === "object") {
      (resumeState as Record<string, unknown>)[key] = Object.fromEntries(
        Object.entries(val as Record<string, unknown>).map(([k, v]) => [k, typeof v === "string" ? v.slice(0, MAX_STR) : v])
      );
    }
  }
  try {
    
    const systemPrompt = mode === "customize" ? CUSTOMIZE_SYSTEM_PROMPT : BUILD_SYSTEM_PROMPT;

    const collected = resumeState ?? {};

    // Compute missing sections server-side so the AI always knows exactly what to ask next
    const missing = getMissingSections(collected as Partial<ParsedResume>);
    const missingBlock = missing.length > 0
      ? `MISSING SECTIONS (ask about these next, in order): ${missing.join(" → ")}`
      : "MISSING SECTIONS: none — all required sections are filled. Proceed to final confirmation.";

    const hasAnyData = Object.keys(collected).some(k => {
      const v = (collected as Record<string, unknown>)[k];
      return v && (typeof v === "string" ? v.trim() : Array.isArray(v) ? v.length > 0 : true);
    });

    const stateBlock = mode === "build"
      ? `COLLECTED SO FAR:\n${hasAnyData ? JSON.stringify(collected, null, 2) : "(nothing yet)"}\n\n${missingBlock}`
      : `CURRENT RESUME:\n${JSON.stringify(collected, null, 2)}\n\n${missingBlock}`;

    // Keep only last 6 turns to avoid prompt bloat
    const recentHistory = messages.slice(-7, -1);
    const historyBlock = recentHistory.length > 0
      ? `CONVERSATION:\n${recentHistory.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")}`
      : "";

    const lastMsg = messages[messages.length - 1]?.content ?? "";

    const prompt = [
      stateBlock,
      historyBlock,
      `User: ${lastMsg}`,
      "JSON response:",
    ].filter(Boolean).join("\n\n");

    const aiResult = await complete(prompt, systemPrompt);

    // Charge only after AI responds successfully
    const chargeError = await chargeCredits("Chat bot");
    if (chargeError) return chargeError;

    if (mode === "customize") {
      const parsed = (aiResult ?? {}) as CustomizeAIResponse;

      if (parsed.resumeUpdate !== null && typeof parsed.resumeUpdate !== "object") {
        parsed.resumeUpdate = null;
      }

      // Handle undo: restore the previous value for the requested section
      let finalUpdate = parsed.resumeUpdate ?? null;
      const updatedHistory = { ...sectionHistory };

      if (parsed.undoSection && sectionHistory[parsed.undoSection] !== undefined) {
        const section = parsed.undoSection;
        const previousValue = sectionHistory[section];
        finalUpdate = { [section]: previousValue } as Partial<ParsedResume>;
        delete updatedHistory[section];
      } else if (finalUpdate) {
        for (const key of Object.keys(finalUpdate) as Array<keyof ParsedResume>) {
          if (resumeState && resumeState[key] !== undefined) {
            updatedHistory[key] = resumeState[key];
          }
        }
      }

      // Persist updated history server-side
      sectionHistoryStore.set(auth.userId, updatedHistory);

      return NextResponse.json({
        message: parsed.message ?? "Done! What else would you like to change?",
        resumeUpdate: finalUpdate,
        isComplete: parsed.isComplete ?? false,
        sectionHistory: updatedHistory,
      } satisfies ChatResponse);
    }

    // Build mode
    const parsed = (aiResult ?? {}) as { message: string; resumeUpdate: Partial<ParsedResume> | null; isComplete: boolean };

    if (parsed.resumeUpdate !== null && typeof parsed.resumeUpdate !== "object") {
      parsed.resumeUpdate = null;
    }

    return NextResponse.json({
      message: parsed.message ?? "Got it! What's next?",
      resumeUpdate: parsed.resumeUpdate ?? null,
      isComplete: parsed.isComplete ?? false,
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

