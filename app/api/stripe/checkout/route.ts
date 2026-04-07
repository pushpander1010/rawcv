import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CREDIT_BUNDLES } from "@/lib/stripe-config";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized", message: "Not signed in" }, { status: 401 });
  }

  let body: { bundleId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request", message: "Expected JSON body" }, { status: 400 });
  }

  const bundle = CREDIT_BUNDLES.find((b) => b.id === body.bundleId);
  if (!bundle) {
    return NextResponse.json({ error: "invalid_bundle", message: "Unknown bundle ID" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "stripe_not_configured", message: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-03-31.basil" });

  const userId = (session.user as { id?: string }).id ?? "";
  const userEmail = session.user.email ?? undefined;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: bundle.priceUsd,
            product_data: {
              name: bundle.name,
              description: bundle.description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        bundleId: bundle.id,
        credits: String(bundle.credits),
      },
      success_url: `${process.env.NEXTAUTH_URL}/credits?success=1&bundle=${bundle.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/credits?cancelled=1`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe checkout failed";
    return NextResponse.json({ error: "stripe_error", message }, { status: 502 });
  }
}
