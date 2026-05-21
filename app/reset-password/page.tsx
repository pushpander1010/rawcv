"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-indigo-600 hover:underline text-sm">
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Something went wrong.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-4xl mb-4" aria-hidden="true">✅</p>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Password updated</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Set new password</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose a strong password for your account.</p>

      {error && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
          <span className="text-base shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
            placeholder="Min. 8 characters"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
            placeholder="Repeat password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-4 py-3.5 text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800/80">
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
