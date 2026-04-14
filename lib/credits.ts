import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserById, deductCredits } from "@/lib/user-store";
import type { ModelId } from "@/types";

// Credits charged per AI operation per model
const OPERATION_COSTS: Record<ModelId, number> = {
  "openrouter-mistral-small": 2,
  "together-gemma-3n":        1,
};

export function getOperationCost(model: ModelId): number {
  return OPERATION_COSTS[model] ?? 2;
}

/**
 * Checks that the current session user has enough credits for the operation.
 * If not, returns a 402 NextResponse. Otherwise deducts and returns null.
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
