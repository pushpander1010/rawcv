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

const BUILD_SYSTEM_PROMPT = `You are a resume-building assistant. Collect resume information conversationally and return structured JSON.

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

COLLECTION FLOW — follow this order strictly:
Step 1: Ask for full name → extract to contact.name
Step 2: Ask for email → extract to contact.email  
Step 3: Ask for phone, location, LinkedIn (all optional, one question) → extract to contact
Step 4: Ask for professional summary (2-3 sentences about their role/expertise)
Step 5: Ask for most recent job — company, title, start/end dates, then 3-5 bullet points describing achievements
Step 6: Ask if they have more jobs → repeat step 5 for each
Step 7: Ask for education — institution, degree, field, graduation year
Step 8: Ask for skills (comma-separated list)
Step 9: Ask if they want to add certifications or projects (optional)
Step 10: Confirm they are done → set isComplete:true

CRITICAL RULES:
- Look at COLLECTED SO FAR to know what step you are on — never re-ask for data already collected
- resumeUpdate must contain ONLY the fields updated THIS turn
- For experience/education/skills arrays, return the COMPLETE array (all previous items + new item)
- Extract data from whatever the user writes — don't ask them to reformat
- If user says "skip" or "no", move to next step
- Set resumeUpdate to null if no new data was provided
- isComplete only when user confirms they are finished`;

const CUSTOMIZE_SYSTEM_PROMPT = `You are a resume editing assistant. Apply the user's requested changes and return structured JSON.

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
- isComplete: true only when user says they are done`;


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
  const chatModel = model.startsWith("together-") ? model : "together-llama-70b";

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

