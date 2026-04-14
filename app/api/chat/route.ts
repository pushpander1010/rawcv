import { NextRequest, NextResponse } from "next/server";
import type { ParsedResume } from "@/types";
import { complete } from "@/lib/ai-providers";
import { chargeCredits } from "@/lib/credits";
import { requireAuth, sanitiseMessages } from "@/lib/api-guard";

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

const BUILD_SYSTEM_PROMPT = `You are an expert resume interviewer. Your job is to interview the user and build their complete resume through natural conversation — like a career coach filling out a form with them.

OUTPUT FORMAT — every response must be exactly this JSON shape, no exceptions:
{"message":"<your reply>","resumeUpdate":<partial resume object or null>,"isComplete":<boolean>}

RESUME SCHEMA (use these exact field names):
contact: {name, email, phone, location, linkedin, website}
summary: string (2-3 sentence professional summary)
experience: [{company, title, startDate, endDate, bullets:["Led team of 5...", "Increased revenue by 30%..."]}]
education: [{institution, degree, field, graduationYear}]
skills: ["React", "Python", "SQL"]
certifications: ["AWS Certified Developer"]
projects: [{name, description, technologies:["React","Node.js"]}]

YOUR INTERVIEW STYLE:
- You are warm, encouraging, and professional — like a career coach
- Ask ONE focused question at a time
- After the user answers, acknowledge what they said, extract the data, then immediately ask the next question
- If an answer is vague, ask one follow-up to get specifics (e.g. "Can you give me a specific achievement with a number?")
- If user says skip/no/later → accept it and move to the next missing section immediately
- Never re-ask for information already in COLLECTED SO FAR

INTERVIEW ORDER — always follow MISSING SECTIONS list below:
1. Full name
2. Email address
3. Phone, city/location, LinkedIn URL (ask all three together as optional)
4. Professional summary — ask: "In 2-3 sentences, how would you describe your professional background and expertise?"
5. Work experience — for EACH job ask: company name → job title → start and end dates → "Tell me 3-5 key achievements or responsibilities in this role" → "Any other jobs to add?"
6. Education — institution → degree and field → graduation year
7. Skills — "List your top technical and professional skills, separated by commas"
8. Certifications — "Do you have any certifications? (e.g. AWS, PMP, Google)" — skip if user says no
9. Projects — "Any notable projects you'd like to highlight?" — skip if user says no
10. Final check — "Your resume looks great! Shall I mark it as complete?" → set isComplete:true

EXTRACTION RULES:
- resumeUpdate: include ONLY the fields updated this turn
- For arrays (experience, education, skills): return the COMPLETE array with all previous items + new item
- resumeUpdate: null if the user's message contained no resume data
- isComplete: true only at step 10 after user confirms
- NEVER end a message without asking the next question — always drive forward
- If the user goes quiet or gives a one-word answer, acknowledge it and ask the next missing section question`;

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
  const { resumeState, mode = "build", sectionHistory = {} } = body;
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

    const raw = await complete(prompt, systemPrompt);

    // Charge only after AI responds successfully
    const chargeError = await chargeCredits("Chat bot");
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

