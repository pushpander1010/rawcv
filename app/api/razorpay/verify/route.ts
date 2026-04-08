import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "razorpay_not_configured", message: "Razorpay is not configured" },
      { status: 503 }
    );
  }

  let body: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Expected JSON body" },
      { status: 400 }
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "missing_fields", message: "Missing Razorpay fields" },
      { status: 400 }
    );
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const ok = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(razorpay_signature)
  );

  if (!ok) {
    return NextResponse.json(
      { error: "invalid_signature", message: "Invalid Razorpay signature" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}

