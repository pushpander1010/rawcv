import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rate-limit";

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254 && !/[\r\n]/.test(e);
}

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  const { allowed, retryAfter } = await rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many messages. Try again in ${retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    let { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    name = String(name).trim().slice(0, 100);
    email = String(email).trim().slice(0, 254);
    subject = String(subject).trim().slice(0, 200);
    message = String(message).trim().slice(0, 5000);

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (name.length < 2 || subject.length < 3 || message.length < 10) {
      return NextResponse.json({ error: "Please fill all fields properly (message min 10 chars)." }, { status: 400 });
    }

    const resend = getResend();

    // Send notification email to support inbox
    const { error: sendError } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "noreply@rawcv.com",
      to: ["support@rawcv.com"],
      replyTo: email,
      subject: `[Contact] ${subject.slice(0, 100)}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#7c3aed;">New Contact Message — rawcv</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;width:100px;">Name</td><td>${escHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;">Email</td><td><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;">Subject</td><td>${escHtml(subject)}</td></tr>
          </table>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;"/>
          <p style="white-space:pre-wrap;line-height:1.6;">${escHtml(message)}</p>
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
          <h2 style="color:#7c3aed;">Thanks for reaching out, ${escHtml(name)}! 👋</h2>
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
