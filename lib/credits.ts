import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserById, deductCredits } from "@/lib/user-store";
import type { ModelId } from "@/types";

// Credits charged per AI operation per model
const OPERATION_COSTS: Record<ModelId, number> = {
  // OpenRouter
  "openrouter-mistral-nemo":     1,
  "openrouter-llama-8b":         1,
  "openrouter-gemma-9b":         1,
  "openrouter-qwen-8b":          1,
  "openrouter-qwen-3.5":         1,
  "openrouter-mistral-24b":      2,
  "openrouter-llama-4-maverick": 3,
  "openrouter-deepseek-v3":      5,
  // Together AI
  "together-gemma-3n":           1,
  "together-llama-70b":          3,
  "together-deepseek-v3":        5,
  "together-qwen3-235b":         5,
  "together-gemma4-31b":         3,
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
  // Round to 2 decimal places to avoid float precision issues (e.g. 3.9999... < 4)
  const balance = Math.round((user?.creditBalance ?? 0) * 100) / 100;

  if (!user || balance < cost) {
    return NextResponse.json(
      {
        error: "insufficient_credits",
        message: "You don't have enough credits. Please purchase more to continue.",
        balance,
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
