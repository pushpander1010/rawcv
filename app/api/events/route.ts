// Resend webhook endpoint — receives inbound/status events from Resend
// Docs: https://resend.com/docs/dashboard/webhooks/introduction
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const event = await request.json();

  if (event.type === "email.received") {
    // Handle inbound email forwarded by Resend
    console.log("Inbound email received:", event);
    return NextResponse.json(event);
  }

  // Other event types: email.sent, email.delivered, email.bounced, etc.
  console.log("Resend event:", event.type);
  return NextResponse.json({});
};
