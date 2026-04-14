"use client";

import { useState } from "react";
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
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No resume loaded. Please upload one first.</p>
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
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
          aria-label="Job description input"
        />

        <button
          type="button"
          onClick={runTailor}
          disabled={!jdInput.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </main>
  );
}
