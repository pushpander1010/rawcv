import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "deprecated", message: "Stripe checkout has been replaced by Razorpay." },
    { status: 410 }
  );
}

