import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserById, deductCredits } from "@/lib/user-store";
import type { ModelId } from "@/types";

// Credits charged per AI operation per model
const OPERATION_COSTS: Record<ModelId, number> = {
  // OpenRouter
  "openrouter-liquid-1.2b":      0.5,
  "openrouter-llama-8b":         0.5,
  "openrouter-gemma-9b":         0.5,
  "openrouter-qwen-8b":          1,
  "openrouter-qwen-3.5":         1,
  "openrouter-mistral-24b":      1,
  "openrouter-llama-4-maverick": 2,
  "openrouter-deepseek-v3":      3,
  // Together AI
  "together-gemma-3n":           1,
  "together-llama-70b":          2,
  "together-deepseek-v3":        3,
  "together-qwen3-235b":         3,
  "together-gemma4-31b":         2,
};

export function getOperationCost(model: ModelId): number {
  return OPERATION_COSTS[model] ?? 2;
}

/**
 * Checks that the current session user has enough credits for the operation.
 * If not, returns a 402 NextResponse. Otherwise deducts and returns null.
 * Dev admin (id = "dev-admin") bypasses all DB checks.
 */
export async function chargeCredits(
  model: ModelId,
  operationLabel: string
): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "Not signed in" },
      { status: 401 }
    );
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json(
      { error: "unauthorized", message: "Invalid session" },
      { status: 401 }
    );
  }

  // Dev admin has unlimited credits — skip DB entirely
  if (userId === "dev-admin") return null;

  const user = await getUserById(userId);
  const cost = getOperationCost(model);

  if (!user || user.creditBalance < cost) {
    return NextResponse.json(
      {
        error: "insufficient_credits",
        message: "You don't have enough credits. Please purchase more to continue.",
        balance: user?.creditBalance ?? 0,
        required: cost,
      },
      { status: 402 }
    );
  }

  const ok = await deductCredits(userId, cost, operationLabel);
  if (!ok) {
    return NextResponse.json(
      { error: "insufficient_credits", message: "Credit deduction failed." },
      { status: 402 }
    );
  }

  return null; // success — credits deducted
}
