"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import ModelSelector from "@/components/ModelSelector";
import TailorDiff from "@/components/TailorDiff";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import type { TailoredResume } from "@/types";

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

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsed: state.parsed,
          jd: jdInput,
          model: state.selectedModel,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Tailoring failed");
      }

      const result: TailoredResume = await res.json();
      setState((prev) => ({ ...prev, tailoredResume: result }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
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
        <DownloadButton />
      </div>

      <div className="mb-6 max-w-sm">
        <ModelSelector label="AI Model" />
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
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
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
