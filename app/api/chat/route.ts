import { NextRequest, NextResponse } from "next/server";
import type { ModelId, ParsedResume } from "@/types";
import { createProvider } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseModel, sanitiseMessages } from "@/lib/api-guard";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  resumeState: Partial<ParsedResume>;
  model: ModelId;
  mode: "build" | "customize";
  /** Per-section undo history: maps section key → previous value before last change */
  sectionHistory?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  isComplete: boolean;
  /** Updated section history after this turn (only returned in customize mode) */
  sectionHistory?: Record<string, unknown>;
}

const SYSTEM_PROMPT = `You are a resume-building assistant for rawcv.com. Your ONLY job is to collect resume information from the user and return it as structured JSON.

STRICT OUTPUT RULE: Every single response MUST be valid JSON in exactly this shape — no exceptions:
{
  "message": "<your conversational reply to the user>",
  "resumeUpdate": <object with only the fields updated this turn, or null>,
  "isComplete": <true only when user explicitly says they are done>
}

RESUME DATA SCHEMA (use these exact field names):
- contact: { name, email, phone, location, linkedin, website }
- summary: string
- experience: [{ company, title, startDate, endDate, bullets: ["bullet 1", "bullet 2"] }]
- education: [{ institution, degree, field, graduationYear }]
- skills: ["skill1", "skill2"]
- certifications: ["cert1"]
- projects: [{ name, description, technologies: ["tech1"] }]

COLLECTION ORDER (ask one section at a time):
1. Contact info (name, email — others optional)
2. Professional summary (2–3 sentences)
3. Work experience (most recent first; get company, title, dates, then 3–5 achievement bullets)
4. Education
5. Skills (comma-separated list)
6. Ask if they want certifications or projects (optional)
7. When done, set isComplete: true

RULES:
- resumeUpdate must contain ONLY the fields changed this turn
- For arrays (experience, education, skills), ALWAYS return the COMPLETE updated array including previous items
- Do NOT fabricate any information — only use what the user provides
- If the user provides no resume data (e.g. greets you or asks a question), set resumeUpdate to null
- Keep message friendly and brief — one question at a time`;

const CUSTOMIZE_SYSTEM_PROMPT = `You are a resume editing assistant for rawcv.com. The user has a resume loaded and wants to make specific changes.

STRICT OUTPUT RULE: Every single response MUST be valid JSON in exactly this shape — no exceptions:
{
  "message": "<your conversational reply>",
  "resumeUpdate": <object with only the fields changed, or null if nothing changed>,
  "undoSection": <"contact"|"summary"|"experience"|"education"|"skills"|"certifications"|"projects"|null>,
  "isComplete": <true only when user says they are done>
}

RESUME DATA SCHEMA (use these exact field names):
- contact: { name, email, phone, location, linkedin, website }
- summary: string
- experience: [{ company, title, startDate, endDate, bullets: ["bullet 1"] }]
- education: [{ institution, degree, field, graduationYear }]
- skills: ["skill1", "skill2"]
- certifications: ["cert1"]
- projects: [{ name, description, technologies: ["tech1"] }]

EDITING RULES:
- Apply EXACTLY what the user asks — do not add, remove, or change anything they did not mention
- For arrays (experience, education, skills), return the COMPLETE updated array with the change applied
- To add a bullet: copy all existing bullets and append the new one
- To remove a bullet: copy all existing bullets and remove only the specified one
- To edit a bullet: copy all existing bullets and replace only the specified one
- Do NOT rewrite or "improve" content unless the user explicitly asks
- If the user says "undo" or "revert", set undoSection to the relevant section key
- Set resumeUpdate to null if the user's message requires no data change
- Do NOT fabricate information`;


interface CustomizeAIResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  undoSection: keyof ParsedResume | null;
  isComplete: boolean;
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

  const model = sanitiseModel(body.model);
  const { resumeState, mode = "build", sectionHistory = {} } = body;

  try {
    const provider = createProvider(model);
    const systemPrompt = mode === "customize" ? CUSTOMIZE_SYSTEM_PROMPT : SYSTEM_PROMPT;

    // Build a clear resume context block
    const hasResume = Object.keys(resumeState ?? {}).length > 0;
    const resumeContext = hasResume
      ? `CURRENT RESUME STATE (JSON — edit this based on user instructions):\n${JSON.stringify(resumeState, null, 2)}`
      : mode === "build"
      ? "CURRENT RESUME STATE: empty — guide the user to build it from scratch."
      : "CURRENT RESUME STATE: empty.";

    // Last user message is the actual instruction; history provides context
    const lastUserMsg = messages[messages.length - 1]?.content ?? "";
    const historyLines = messages.slice(0, -1)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = [
      resumeContext,
      historyLines ? `\nCONVERSATION HISTORY:\n${historyLines}` : "",
      `\nUSER: ${lastUserMsg}`,
      "\nRespond with valid JSON only:",
    ].filter(Boolean).join("\n");

    const raw = await provider.complete(prompt, systemPrompt);

    // Charge only after AI responds successfully
    const chargeError = await chargeCredits(model, "Chat bot");
    if (chargeError) return chargeError;

    if (mode === "customize") {
      let parsed: CustomizeAIResponse;
      try {
        parsed = JSON.parse(raw) as CustomizeAIResponse;
      } catch {
        parsed = { message: raw, resumeUpdate: null, undoSection: null, isComplete: false };
      }

      // Validate resumeUpdate — reject if it's not a plain object
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

      return NextResponse.json({
        message: parsed.message ?? "Done! What else would you like to change?",
        resumeUpdate: finalUpdate,
        isComplete: parsed.isComplete ?? false,
        sectionHistory: updatedHistory,
      } satisfies ChatResponse);
    }

    // Build mode
    let parsed: { message: string; resumeUpdate: Partial<ParsedResume> | null; isComplete: boolean };
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { message: raw, resumeUpdate: null, isComplete: false };
    }

    // Validate resumeUpdate
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

