"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUnverified(false);
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      if (data.error === "email_not_verified") {
        setUnverified(true);
      } else {
        setError(data.message ?? "Something went wrong.");
      }
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">
        {submitted ? (
          <div className="text-center">
            <p className="text-4xl mb-4" aria-hidden="true">📬</p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Check your inbox</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              If <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span> is registered, you&apos;ll receive a reset link shortly.
            </p>
            <Link href="/login" className="text-indigo-600 hover:underline text-sm font-medium">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Forgot password?</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {unverified && (
              <div role="alert" className="mb-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-5 py-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none shrink-0" aria-hidden="true">⚠️</span>
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-200 text-base">Verify your email first</p>
                    <p className="mt-1.5 text-amber-700 dark:text-amber-300 leading-relaxed">
                      Your account hasn&apos;t been verified yet. Please check your inbox for the verification email we sent when you signed up and click the link to activate your account. Password reset is only available after verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div role="alert" className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                <span className="text-base shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-4 py-3.5 text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
