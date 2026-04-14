import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserById, deductCredits } from "@/lib/user-store";

// Fixed cost per AI operation — set via CREDITS_PER_OPERATION env var, default 2
const COST = parseInt(process.env.CREDITS_PER_OPERATION ?? "2", 10);

export async function chargeCredits(operationLabel: string): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized", message: "Not signed in" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized", message: "Invalid session" }, { status: 401 });
  }

  const user = await getUserById(userId);
  const balance = Math.round((user?.creditBalance ?? 0) * 100) / 100;

  if (!user || balance < COST) {
    return NextResponse.json(
      { error: "insufficient_credits", message: "You don't have enough credits. Please purchase more to continue.", balance, required: COST },
      { status: 402 }
    );
  }

  const ok = await deductCredits(userId, COST, operationLabel);
  if (!ok) {
    return NextResponse.json({ error: "insufficient_credits", message: "Credit deduction failed." }, { status: 402 });
  }

  return null;
}
