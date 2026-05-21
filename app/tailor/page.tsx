"use client";

import { useState } from "react";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import TailorDiff from "@/components/TailorDiff";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import UndoButton from "@/components/UndoButton";
import ResetButton from "@/components/ResetButton";

export default function TailorPage() {
  const { state, setState } = useResume();
  const [jdInput, setJdInput] = useState(state.jd ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state.parsed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
        <div className="relative max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl" />
          
          <div className="relative w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border border-violet-100 dark:border-violet-900/30 p-1 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-gray-900 shadow-inner">
            <img
              src="/upload_illustration.png"
              alt="Upload Resume Illustration"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            No Resume Loaded
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
            Upload your CV first to tailor it specifically for your target job description.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-violet-500/25 dark:shadow-none transition-all duration-200 hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Resume
            </Link>
          </div>
        </div>
      </main>
    );
  }

  async function runTailor() {
    if (!jdInput.trim()) return;
    setLoading(true);
    setError(null);
    setState((prev) => ({ ...prev, jd: jdInput }));
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsed: state.parsed, jd: jdInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Tailoring failed");
      setState((prev) => ({ ...prev, tailoredResume: data }));
    } catch (e) {
      setError(e instanceof Error ? (e.name === "AbortError" ? "Request timed out. Please try again." : e.message) : "Tailoring failed. Please try again.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  const changes = state.tailoredResume?.changes ?? [];

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          JD-Tailored Resume
        </h1>
        <div className="flex items-center gap-2">
          <UndoButton />
            <ResetButton />
          <DownloadButton />
        </div>
      </div>

      <div className="mb-6 max-w-sm">
      </div>

      {/* JD input */}
      <div className="mb-8 max-w-2xl">
        <label
          htmlFor="jd-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Job Description
        </label>
        <textarea
          id="jd-input"
          value={jdInput}
          onChange={(e) => setJdInput(e.target.value)}
          placeholder="Paste the job description here…"
          rows={6}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-3"
          aria-label="Job description input"
        />

        <button
          type="button"
          onClick={runTailor}
          disabled={!jdInput.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {loading ? "Tailoring…" : state.tailoredResume ? "Re-tailor" : "Tailor Resume"}
        </button>

        {error && (
          <div role="alert" className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            <span className="shrink-0">⚠</span>
            <span className="flex-1">{error}</span>
            <button onClick={runTailor} className="shrink-0 text-xs underline hover:no-underline">Retry</button>
          </div>
        )}
      </div>

      {/* Main content: diff + preview side by side */}
      {(changes.length > 0 || loading) && (
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Changes list */}
          <div className="xl:w-[480px] flex-shrink-0">
            <TailorDiff changes={changes} loading={loading} />
          </div>

          {/* Live resume preview */}
          <div className="flex-1 min-w-0 overflow-auto">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Live Preview
            </h2>
            <ResumePreview resume={state.parsed} theme={state.selectedTheme} />
          </div>
        </div>
      )}

      {/* Visual placeholder for initial state (resume loaded but not tailored yet) */}
      {changes.length === 0 && !loading && (
        <div className="mt-8 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-violet-500/5 blur-2xl" />
          <div className="relative w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border border-violet-100 dark:border-violet-900/30 p-1 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-gray-900 shadow-inner">
            <img
              src="/ats_illustration.png"
              alt="ATS Matching Illustration"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Tailor Your Resume to a Job Description
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Paste the target job description above and hit &quot;Tailor Resume&quot;. Our AI will align your experience highlights with the JD, showing green additions and red deletions, alongside a live preview.
          </p>
        </div>
      )}
    </main>
  );
}
