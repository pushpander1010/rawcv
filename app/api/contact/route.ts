import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const resend = getResend();

    // Send notification email to support inbox
    const { error: sendError } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "noreply@rawcv.com",
      to: ["support@rawcv.com"],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#7c3aed;">New Contact Message — rawcv</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;width:100px;">Name</td><td>${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;">Subject</td><td>${subject}</td></tr>
          </table>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;"/>
          <p style="white-space:pre-wrap;line-height:1.6;">${message}</p>
        </div>
      `,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    // Send acknowledgement email to the user
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "noreply@rawcv.com",
      to: [email],
      subject: "We received your message — rawcv",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#7c3aed;">Thanks for reaching out, ${name}! 👋</h2>
          <p>We've received your message and will get back to you within <strong>24–48 business hours</strong>.</p>
          <p style="color:#6b7280;margin-top:24px;">— The rawcv Support Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
