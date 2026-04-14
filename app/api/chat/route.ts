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
  sectionHistory?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  isComplete: boolean;
  /** Updated section history after this turn (only returned in customize mode) */
  sectionHistory?: Record<string, unknown>;
}

const BUILD_SYSTEM_PROMPT = `You are a proactive resume-building assistant. Your job is to DRIVE the conversation forward and ensure the user ends up with a complete resume. Never wait passively — always end your message with the next question.

OUTPUT FORMAT — every response must be exactly this JSON shape:
{"message":"<reply to user>","resumeUpdate":<partial resume object or null>,"isComplete":<boolean>}

RESUME SCHEMA:
contact: {name,email,phone,location,linkedin,website}
summary: string
experience: [{company,title,startDate,endDate,bullets:["achievement 1","achievement 2"]}]
education: [{institution,degree,field,graduationYear}]
skills: ["skill1","skill2"]
certifications: ["cert1"]
projects: [{name,description,technologies:["tech1"]}]

COLLECTION ORDER — work through these sections in order, skipping already-filled ones:
1. contact.name → contact.email → contact.phone/location/linkedin (optional, ask together)
2. summary (2-3 sentences)
3. experience: company → title → dates → 3-5 achievement bullets (repeat for each job)
4. education: institution → degree/field → graduation year
5. skills (comma-separated)
6. certifications (optional — ask once, skip if user declines)
7. projects (optional — ask once, skip if user declines)
8. Final confirmation → set isComplete:true

DRIVING RULES — these are mandatory:
- Check COLLECTED SO FAR first — skip any section that already has data
- After extracting data from the user's reply, IMMEDIATELY ask the next question in the same message
- If the user gives a short/vague answer, extract what you can and move on — do NOT ask for clarification unless critical
- If the user says "skip", "no", "later", "done", or gives no useful info → move to the NEXT section immediately
- If the user seems to be done with experience (says "that's all", "no more", "just one"), move to education
- Never ask the same question twice
- Keep messages short and friendly — one question at a time
- resumeUpdate must contain ONLY the fields updated THIS turn
- For arrays (experience, education, skills), return the COMPLETE array including all previous items
- isComplete: true only after the final confirmation step`;

const CUSTOMIZE_SYSTEM_PROMPT = `You are a proactive resume editing assistant. Apply changes the user requests AND notice missing sections — gently suggest filling them in after completing the user's request.

OUTPUT FORMAT — every response must be exactly this JSON shape:
{"message":"<reply>","resumeUpdate":<changed fields only, or null>,"undoSection":<section key or null>,"isComplete":<boolean>}

RESUME SCHEMA:
contact: {name,email,phone,location,linkedin,website}
summary: string
experience: [{company,title,startDate,endDate,bullets:["bullet"]}]
education: [{institution,degree,field,graduationYear}]
skills: ["skill1"]
certifications: ["cert1"]
projects: [{name,description,technologies:["tech1"]}]

RULES:
- Apply EXACTLY what the user asks, nothing more
- For arrays, return the COMPLETE updated array with only the requested change applied
- undoSection: set to the section key if user says "undo"/"revert"/"go back"
- resumeUpdate: null if no data changed
- isComplete: true only when user says they are done
- After applying a change, check CURRENT RESUME for empty sections (no summary, no skills, no experience) and suggest filling them in — but only if the user's request is already handled`;


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

  // Always use a reliable model for chat — user's selected model may be too weak
  const chatModel = model.startsWith("together-") ? model : "openrouter-mistral-small";

  try {
    const provider = createProvider(chatModel);
    const systemPrompt = mode === "customize" ? CUSTOMIZE_SYSTEM_PROMPT : BUILD_SYSTEM_PROMPT;

    // Show AI exactly what's been collected so far
    const collected = resumeState ?? {};
    const hasAnyData = Object.keys(collected).some(k => {
      const v = (collected as Record<string, unknown>)[k];
      return v && (typeof v === "string" ? v.trim() : Array.isArray(v) ? v.length > 0 : true);
    });

    const stateBlock = mode === "build"
      ? `COLLECTED SO FAR:\n${hasAnyData ? JSON.stringify(collected, null, 2) : "(nothing yet — start from step 1)"}`
      : `CURRENT RESUME:\n${JSON.stringify(collected, null, 2)}`;

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

    const raw = await provider.complete(prompt, systemPrompt);

    // Charge only after AI responds successfully
    const chargeError = await chargeCredits(chatModel, "Chat bot");
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

