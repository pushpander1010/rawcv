"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

interface Props {
  section: "summary" | "bullets" | "skills" | "project" | "education";
  value: string;
  context?: string;
  onApply: (improved: string) => void;
  label?: string;
}

/**
 * Small "Improve with AI" button for manual form fields.
 * Calls /api/improve-field, shows the suggestion inline with Accept/Discard.
 */
export default function FieldAIButton({ section, value, context, onApply, label = "Improve with AI" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const empty = !value.trim();

  async function improve() {
    if (empty || loading) return;
    setLoading(true);
    setError(null);
    setSuggestion(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60000);
    try {
      const res = await fetch("/api/improve-field", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, value, context: context ?? "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "AI improvement failed");
      setSuggestion((data.improved as string) ?? "");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.name === "AbortError"
            ? "Request timed out. Please try again."
            : e.message
          : "AI is unavailable. Please try again."
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  function accept() {
    if (suggestion) onApply(suggestion);
    setSuggestion(null);
  }

  return (
    <div>
      <button
        type="button"
        onClick={improve}
        disabled={empty || loading}
        title={empty ? "Type something first, then improve it with AI" : label}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {loading ? (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <Icon name="sparkles" size={14} />
        )}
        {loading ? "Improving…" : label}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-300">{error}</p>
      )}

      {suggestion && (
        <div className="mt-2 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-950/20 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300 mb-1.5">
            AI suggestion
          </p>
          <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap max-h-40 overflow-auto">
            {suggestion}
          </p>
          <div className="flex gap-2 mt-2.5">
            <button
              type="button"
              onClick={accept}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
