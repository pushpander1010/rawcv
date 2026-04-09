import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById, getTransactions } from "@/lib/user-store";

/** GET /api/credits — returns current balance and transaction history */
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized", message: "Not signed in" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "unauthorized", message: "Invalid session" }, { status: 401 });
  }

  const user = await getUserById(userId);
  const balance = user?.creditBalance ?? 0;
  const transactions = await getTransactions(userId);

  return NextResponse.json({ balance, transactions });
}

