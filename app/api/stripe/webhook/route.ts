import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { addCreditsFromStripePayment } from "@/lib/user-store";
import { CREDIT_BUNDLES } from "@/lib/stripe-config";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "stripe_not_configured", message: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-03-31.basil" });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: "invalid_signature", message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const { userId, bundleId, credits } = session.metadata ?? {};

    if (!userId || !bundleId || !credits) {
      console.error("Webhook: missing metadata", session.metadata);
      return NextResponse.json({ error: "missing_metadata" }, { status: 400 });
    }

    const bundle = CREDIT_BUNDLES.find((b) => b.id === bundleId);
    const creditAmount = parseInt(credits, 10);

    if (!bundle || isNaN(creditAmount)) {
      console.error("Webhook: invalid bundle or credits", { bundleId, credits });
      return NextResponse.json({ error: "invalid_bundle" }, { status: 400 });
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const result = await addCreditsFromStripePayment(
      event.id,
      userId,
      creditAmount,
      `${bundle.name} (${creditAmount} credits)`,
      paymentIntentId
    );

    if (result.error === "user_not_found") {
      console.error("Webhook: user not found", userId);
      return NextResponse.json({ error: "user_not_found" }, { status: 400 });
    }

    if (!result.ok) {
      return NextResponse.json({ error: "credit_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
