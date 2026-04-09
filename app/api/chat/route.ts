import { NextRequest, NextResponse } from "next/server";
import type { ModelId, ParsedResume } from "@/types";
import { createProvider } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";

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

const SYSTEM_PROMPT = `You are a friendly, professional resume-building assistant for rawcv.com. Your job is to help users build or customize their resume through natural conversation.

When building from scratch, guide the user through these sections in order:
1. Contact information (name, email, phone, location, LinkedIn, website)
2. Professional summary
3. Work experience (company, title, dates, bullet points describing achievements)
4. Education (institution, degree, field, graduation year)
5. Skills
6. Certifications (optional)
7. Projects (optional)

IMPORTANT RULES:
- Ask for one section at a time, don't overwhelm the user
- Be conversational and encouraging
- When the user provides information, extract it and include it in the resumeUpdate JSON
- If the user wants to modify a previously entered section, help them do so
- When all required sections (contact, experience, education, skills) are complete and the user says they're done, set isComplete to true
- Always return valid JSON in this exact shape:

{
  "message": "Your conversational response to the user",
  "resumeUpdate": {
    // Only include fields that were updated in this turn
    // Use null if no resume fields were updated
    // Partial ParsedResume shape:
    // contact: { name, email, phone, location, linkedin, website }
    // summary: string
    // experience: [{ company, title, startDate, endDate, bullets: [] }]
    // education: [{ institution, degree, field, graduationYear }]
    // skills: string[]
    // certifications: string[]
    // projects: [{ name, description, technologies: [] }]
  },
  "isComplete": false
}

When resumeUpdate contains arrays (experience, education, skills), always return the FULL updated array, not just the new item.
Set resumeUpdate to null if the user's message didn't provide any resume data (e.g., they asked a question or said hello).`;

const CUSTOMIZE_SYSTEM_PROMPT = `You are a friendly, professional resume customization assistant for rawcv.com. The user has an existing resume loaded and wants to make targeted changes through conversation.

You can help the user:
- Rewrite or improve any section
- Add or remove experience bullets
- Update skills, certifications, or projects
- Improve the professional summary
- Change any contact details
- Undo the most recent change to any section

IMPORTANT RULES:
- Be conversational and helpful
- When the user requests a change, apply it and include the updated field in resumeUpdate
- When the user asks to undo a change (e.g. "undo", "revert that", "go back"), set undoSection to the section key they want reverted
- Preserve all factual information — don't fabricate anything
- When the user says they're done or satisfied, set isComplete to true
- Always return valid JSON in this exact shape:

{
  "message": "Your conversational response to the user",
  "resumeUpdate": {
    // Only include fields that were updated in this turn
    // Use null if no resume fields were updated
  },
  "undoSection": null,
  "isComplete": false
}

Valid undoSection values: "contact", "summary", "experience", "education", "skills", "certifications", "projects", or null.
When resumeUpdate contains arrays (experience, education, skills), always return the FULL updated array.
Set resumeUpdate to null if no resume data changed.`;

interface CustomizeAIResponse {
  message: string;
  resumeUpdate: Partial<ParsedResume> | null;
  undoSection: keyof ParsedResume | null;
  isComplete: boolean;
}

export async function POST(req: NextRequest) {
  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const { messages, resumeState, model, mode = "build", sectionHistory = {} } = body;

  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "missing_fields", message: "messages array is required" },
      { status: 400 }
    );
  }

  try {
    const chargeError = await chargeCredits(model ?? "openrouter-gemma-4-27b", "Chat bot");
    if (chargeError) return chargeError;

    const provider = createProvider(model ?? "openrouter-gemma-4-27b");
    const systemPrompt = mode === "customize" ? CUSTOMIZE_SYSTEM_PROMPT : SYSTEM_PROMPT;

    const conversationHistory = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const resumeContext = Object.keys(resumeState ?? {}).length > 0
      ? `\nCurrent resume state:\n${JSON.stringify(resumeState, null, 2)}\n`
      : mode === "build"
      ? "\nThe resume is currently empty — guide the user to build it from scratch.\n"
      : "";

    const prompt = `${resumeContext}\nConversation:\n${conversationHistory}\n\nRespond as the assistant:`;

    const raw = await provider.complete(prompt, systemPrompt);

    if (mode === "customize") {
      let parsed: CustomizeAIResponse;
      try {
        parsed = JSON.parse(raw) as CustomizeAIResponse;
      } catch {
        parsed = { message: raw, resumeUpdate: null, undoSection: null, isComplete: false };
      }

      // Handle undo: restore the previous value for the requested section
      let finalUpdate = parsed.resumeUpdate ?? null;
      const updatedHistory = { ...sectionHistory };

      if (parsed.undoSection && sectionHistory[parsed.undoSection] !== undefined) {
        const section = parsed.undoSection;
        const previousValue = sectionHistory[section];
        finalUpdate = { [section]: previousValue } as Partial<ParsedResume>;
        // Remove from history after undo (one level deep)
        delete updatedHistory[section];
      } else if (finalUpdate) {
        // Save current values to history before applying the update
        for (const key of Object.keys(finalUpdate) as Array<keyof ParsedResume>) {
          if (resumeState && resumeState[key] !== undefined) {
            updatedHistory[key] = resumeState[key];
          }
        }
      }

      return NextResponse.json({
        message: parsed.message ?? "I'm here to help! What would you like to change?",
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

    return NextResponse.json({
      message: parsed.message ?? "I'm here to help! What would you like to do?",
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

