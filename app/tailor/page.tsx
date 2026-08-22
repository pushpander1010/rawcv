"use client";

import { useState } from "react";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import ResumeUploader from "@/components/ResumeUploader";
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
      <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200/60 dark:border-gray-800/60 p-12 text-center overflow-hidden">
          
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-blue-600 dark:text-blue-400">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Upload resume to tailor it
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Match your resume to any job description with AI
            </p>
            
            <ResumeUploader />
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Tailor to Job</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UndoButton />
            <ResetButton />
            <DownloadButton />
          </div>
        </div>

        {/* JD input */}
        <div className="mb-8 max-w-2xl">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <label htmlFor="jd-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Paste Job Description
            </label>
            <textarea
              id="jd-input"
              value={jdInput}
              onChange={(e) => setJdInput(e.target.value)}
              placeholder="Paste the job description here and we'll tailor your resume to match…"
              rows={5}
              className="w-full rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 resize-none transition-all"
              aria-label="Job description input"
            />
            <button
              type="button"
              onClick={runTailor}
              disabled={!jdInput.trim() || loading}
              className="mt-4 w-full px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Tailoring…" : state.tailoredResume ? "Re-tailor" : "Tailor Resume →"}
            </button>
          </div>

          {error && (
            <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-sm text-red-700 dark:text-red-300">
              <span className="shrink-0 text-lg">⚠</span>
              <span className="flex-1">{error}</span>
              <button onClick={runTailor} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
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

        {/* Visual placeholder for initial state */}
        {changes.length === 0 && !loading && (
          <div className="mt-8 rounded-2xl border border-dashed border-gray-200/60 dark:border-gray-800/60 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm p-12 text-center max-w-4xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Paste a job description above
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Our AI will align your experience with the job requirements, showing exactly what to add, change, or remove.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
