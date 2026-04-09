import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addCreditsFromStripePayment } from "@/lib/user-store";
import { CREDIT_BUNDLES } from "@/lib/stripe-config";

export const runtime = "nodejs";

function verifyWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "razorpay_not_configured", message: "Razorpay webhook is not configured" },
      { status: 503 }
    );
  }

  const sig = req.headers.get("x-razorpay-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const ok = verifyWebhookSignature(rawBody, sig, webhookSecret);
  if (!ok) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // We credit only when payment is captured (successful)
  if (event?.event === "payment.captured") {
    const payment = event?.payload?.payment?.entity;
    const notes = payment?.notes ?? {};

    const userId = notes.userId as string | undefined;
    const bundleId = notes.bundleId as string | undefined;
    const credits = notes.credits as string | undefined;

    if (!userId || !bundleId || !credits) {
      console.error("Razorpay webhook: missing notes", { notes });
      return NextResponse.json({ error: "missing_metadata" }, { status: 400 });
    }

    const bundle = CREDIT_BUNDLES.find((b) => b.id === bundleId);
    const creditAmount = parseInt(credits, 10);

    if (!bundle || isNaN(creditAmount)) {
      console.error("Razorpay webhook: invalid bundle/credits", { bundleId, credits });
      return NextResponse.json({ error: "invalid_bundle" }, { status: 400 });
    }

    // Use Razorpay payment id as the "payment intent id" field for tracking
    const paymentId = payment?.id as string | undefined;

    // Reuse the existing idempotency table (ProcessedStripeEvent) keyed by event id.
    // event.contains the webhook event id at `event.id`
    const result = await addCreditsFromStripePayment(
      String(event.id),
      userId,
      creditAmount,
      `${bundle.name} (${creditAmount} credits)`,
      paymentId
    );

    if (result.error === "user_not_found") {
      console.error("Razorpay webhook: user not found", userId);
      return NextResponse.json({ error: "user_not_found" }, { status: 400 });
    }
    if (!result.ok) {
      return NextResponse.json({ error: "credit_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}


