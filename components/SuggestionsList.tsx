"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import type { Suggestion } from "@/types";
import AILoader from "@/components/AILoader";
import { findIndex, normalise } from "@/lib/fuzzy-match";

// ─── Section badge ────────────────────────────────────────────────────────────

const SECTION_COLORS: Record<string, string> = {
  experience: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  summary:    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  skills:     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  education:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

function SectionBadge({ section }: { section: string }) {
  const style =
    SECTION_COLORS[section.toLowerCase()] ??
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${style}`}>
      {section}
    </span>
  );
}

// ─── Single suggestion card ───────────────────────────────────────────────────

interface SuggestionCardProps {
  suggestion: Suggestion;
  applied: boolean;
  onApply: (suggestion: Suggestion) => void;
}

function SuggestionCard({ suggestion, applied, onApply }: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <SectionBadge section={suggestion.section} />
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {suggestion.reason}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {applied ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Applied
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onApply(suggestion)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label="Toggle suggestion details"
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded diff view */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
              Original
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg px-3 py-2 leading-relaxed">
              {suggestion.original}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
              Improved
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg px-3 py-2 leading-relaxed">
              {suggestion.improved}
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

// ─── SuggestionsList ──────────────────────────────────────────────────────────

interface SuggestionsListProps {
  suggestions: Suggestion[];
  loading?: boolean;
}

export default function SuggestionsList({ suggestions, loading = false }: SuggestionsListProps) {
  const { state, setState, pushUndo } = useResume();
  const showLoader = loading;

  /** Derive applied state from actual resume content instead of local tracking */
  function isApplied(suggestion: Suggestion): boolean {
    const parsed = state.parsed;
    if (!parsed) return false;
    const section = suggestion.section.toLowerCase();
    if (section === "summary") return normalise(parsed.summary ?? "") === normalise(suggestion.improved);
    if (section === "experience") return parsed.experience.some((exp) =>
      exp.bullets.some((b) => normalise(b) === normalise(suggestion.improved))
    );
    if (section === "skills") return parsed.skills.some((s) => normalise(s) === normalise(suggestion.improved));
    return false;
  }

  function applyToContext(suggestion: Suggestion) {
    pushUndo();
    const section = suggestion.section.toLowerCase();

    setState((prev) => {
      if (!prev.parsed) return prev;
      const parsed = { ...prev.parsed };

      if (section === "summary") {
        parsed.summary = suggestion.improved;
      } else if (section === "experience") {
        let applied = false;
        parsed.experience = parsed.experience.map((exp) => {
          if (applied) return exp;
          const bulletIdx = findIndex(exp.bullets, suggestion.original);
          if (bulletIdx === -1) return exp;
          applied = true;
          const bullets = [...exp.bullets];
          bullets[bulletIdx] = suggestion.improved;
          return { ...exp, bullets };
        });
      } else if (section === "skills") {
        const skillIdx = findIndex(parsed.skills, suggestion.original);
        if (skillIdx !== -1) {
          const skills = [...parsed.skills];
          skills[skillIdx] = suggestion.improved;
          parsed.skills = skills;
        }
      }

      const updatedSuggestions = prev.suggestions.map((s) =>
        s.id === suggestion.id ? { ...s, improved: suggestion.improved } : s
      );

      return { ...prev, parsed, suggestions: updatedSuggestions };
    });
  }

  if (showLoader) {
    return (
      <section aria-label="AI Suggestions" className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <AILoader type="suggestions" />
      </section>
    );
  }

  if (suggestions.length === 0) {
    return (
      <section aria-label="AI Suggestions">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No suggestions available. Run the analysis to generate improvements.
        </p>
      </section>
    );
  }

  const appliedCount = suggestions.filter(isApplied).length;

  return (
    <section aria-label="AI Improvement Suggestions">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          AI Suggestions
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({suggestions.length})
          </span>
        </h2>
        {appliedCount > 0 && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {appliedCount} applied
          </span>
        )}
      </div>

      <ul className="space-y-3" aria-label="Improvement suggestions list">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            applied={isApplied(suggestion)}
            onApply={applyToContext}
          />
        ))}
      </ul>
    </section>
  );
}
