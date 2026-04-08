import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "deprecated", message: "Stripe webhook has been replaced by Razorpay." },
    { status: 410 }
  );
}
