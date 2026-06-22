/**
 * reCAPTCHA verification helper.
 *
 * Uses Google reCAPTCHA v2/v3 secret validation API.
 * Set RECAPTCHA_SECRET_KEY in .env to enable.
 * When the env var is missing (local dev), CAPTCHA checks are SKIPPED.
 */

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY ?? "";
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Verify a reCAPTCHA token from the client.
 * Returns { success: boolean, error?: string }
 *
 * In dev (no key configured), always returns success.
 */
export async function verifyCaptcha(
  token: string | undefined
): Promise<{ success: boolean; error?: string }> {
  // Dev bypass — skip when no key configured
  if (!RECAPTCHA_SECRET) {
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "CAPTCHA token is required." };
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
    });

    const data = await res.json();

    if (data.success) {
      return { success: true };
    }

    const errorCodes = data["error-codes"]?.join(", ") ?? "unknown";
    console.warn("[captcha] Verification failed:", errorCodes);
    return { success: false, error: "CAPTCHA verification failed." };
  } catch (err) {
    console.error("[captcha] Network error verifying CAPTCHA:", err);
    // Fail open — don't block users if captcha service is down
    return { success: true };
  }
}

/**
 * Check if CAPTCHA is required based on environment.
 */
export function isCaptchaEnabled(): boolean {
  return Boolean(RECAPTCHA_SECRET);
}
