import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CREDIT_BUNDLES } from "@/lib/stripe-config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: "unauthorized", message: "Not signed in" },
      { status: 401 }
    );
  }

  let body: { bundleId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const bundle = CREDIT_BUNDLES.find((b) => b.id === body.bundleId);
  if (!bundle) {
    return NextResponse.json(
      { error: "invalid_bundle", message: "Unknown bundle ID" },
      { status: 400 }
    );
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "razorpay_not_configured", message: "Razorpay is not configured" },
      { status: 503 }
    );
  }

  const userId = (session.user as { id?: string }).id ?? "";
  const userEmail = session.user.email ?? undefined;

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount: bundle.priceInr,
      currency: "INR",
      receipt: `rawcv_${bundle.id}_${Date.now()}`,
      notes: {
        userId,
        bundleId: bundle.id,
        credits: String(bundle.credits),
      },
    });

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      description: `${bundle.name} (${bundle.credits} credits)`,
      prefill: userEmail ? { email: userEmail } : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Razorpay order creation failed";
    return NextResponse.json({ error: "razorpay_error", message }, { status: 502 });
  }
}


