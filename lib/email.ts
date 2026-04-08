import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "rawcv <noreply@rawcv.com>";
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  console.log("[email] Sending verification email to:", to);
  console.log("[email] FROM:", FROM);
  console.log("[email] Verify URL:", verifyUrl);

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your rawcv email address",
    html: buildVerificationHtml(name, verifyUrl),
    text: buildVerificationText(name, verifyUrl),
  });

  if (error) {
    console.error("[email] Resend error:", JSON.stringify(error));
    throw new Error(`Resend failed: ${error.message}`);
  }

  console.log("[email] Sent successfully, id:", data?.id);
} function buildVerificationHtml(name: string, url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#7c3aed;padding:28px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">rawcv</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">Hi ${escapeHtml(name)},</p>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Thanks for signing up for rawcv. Click the button below to verify your email address and activate your account.
              </p>
              <a href="${url}"
                 style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:10px;">
                Verify email address
              </a>
              <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
              </p>
              <p style="margin:16px 0 0;font-size:12px;color:#d1d5db;word-break:break-all;">
                Or copy this URL: ${url}
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} rawcv. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildVerificationText(name: string, url: string): string {
  return `Hi ${name},

Thanks for signing up for rawcv. Please verify your email address by visiting the link below:

${url}

This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.

— rawcv`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your rawcv password",
    html: buildResetHtml(name, resetUrl),
    text: `Hi ${name},\n\nClick the link below to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.\n\n— rawcv`,
  });

  if (error) {
    console.error("[email] Resend reset error:", JSON.stringify(error));
    throw new Error(`Resend failed: ${error.message}`);
  }

  console.log("[email] Reset email sent, id:", data?.id);
}

function buildResetHtml(name: string, url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Reset your password</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
        <tr><td style="background:#7c3aed;padding:28px 32px;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">rawcv</p>
        </td></tr>
        <tr><td style="padding:36px 32px;">
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">Hi ${escapeHtml(name)},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>
          <a href="${url}" style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:10px;">
            Reset password
          </a>
          <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
            This link expires in <strong>1 hour</strong>. If you didn't request a reset, you can safely ignore this email.
          </p>
          <p style="margin:16px 0 0;font-size:12px;color:#d1d5db;word-break:break-all;">Or copy: ${url}</p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} rawcv.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
