import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import type { ModelId } from "@/types";

const VALID_MODELS = new Set<ModelId>([
  "openrouter-mistral-small",
  "together-gemma-3n",
] as ModelId[]);

const MAX_JD_LENGTH = 8000;
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

/**
 * Verify the request is authenticated and return the userId.
 * Returns a 401 NextResponse if not authenticated.
 */
export async function requireAuth(): Promise<{ userId: string } | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "You must be signed in to use this feature." },
      { status: 401 }
    );
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json(
      { error: "unauthorized", message: "Invalid session. Please sign in again." },
      { status: 401 }
    );
  }
  return { userId };
}

/**
 * Validate and sanitise a ModelId from user input.
 * Falls back to the default free model if invalid.
 */
export function sanitiseModel(model: unknown): ModelId {
  if (typeof model === "string" && VALID_MODELS.has(model as ModelId)) {
    return model as ModelId;
  }
  return "openrouter-mistral-small";
}

/**
 * Sanitise a job description string — trim and enforce max length.
 */
export function sanitiseJD(jd: unknown): string {
  if (typeof jd !== "string") return "";
  return jd.trim().slice(0, MAX_JD_LENGTH);
}

/**
 * Sanitise chat messages — enforce count and per-message length limits.
 */
export function sanitiseMessages(
  messages: unknown
): Array<{ role: "user" | "assistant"; content: string }> | null {
  if (!Array.isArray(messages)) return null;
  const valid = messages
    .filter(
      (m) =>
        m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .slice(0, MAX_MESSAGES)
    .map((m) => ({ role: m.role as "user" | "assistant", content: (m.content as string).slice(0, MAX_MESSAGE_LENGTH) }));
  return valid.length > 0 ? valid : null;
}
