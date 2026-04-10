import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserById, deductCredits } from "@/lib/user-store";
import type { ModelId } from "@/types";

// Credits charged per AI operation per model
const OPERATION_COSTS: Record<ModelId, number> = {
  "groq-llama-3.1-8b": 0,
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
