"use client";

import React, { useEffect, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import type { Suggestion } from "@/types";
import AILoader from "@/components/AILoader";

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

// ─── Single enhancement card ──────────────────────────────────────────────────

type CardStatus = "pending" | "accepted" | "rejected";

interface EnhancementCardProps {
  suggestion: Suggestion;
  status: CardStatus;
  onAccept: (suggestion: Suggestion) => void;
  onReject: (id: string) => void;
}

function EnhancementCard({ suggestion, status, onAccept, onReject }: EnhancementCardProps) {
  return (
    <li className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <SectionBadge section={suggestion.section} />
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{suggestion.reason}</p>
        </div>

        {status === "accepted" && (
          <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Accepted
          </span>
        )}

        {status === "rejected" && (
          <span className="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Rejected
          </span>
        )}

        {status === "pending" && (
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAccept(suggestion)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onReject(suggestion.id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Diff view — always visible */}
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
            Enhanced
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg px-3 py-2 leading-relaxed">
            {suggestion.improved}
          </p>
        </div>
      </div>
    </li>
  );
}

// ─── EnhancementList ──────────────────────────────────────────────────────────

interface EnhancementListProps {
  enhancements: Suggestion[];
  loading?: boolean;
}

export default function EnhancementList({ enhancements, loading = false }: EnhancementListProps) {
  const { setState, pushUndo } = useResume();
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({});
  const [showLoader, setShowLoader] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (loading) { setShowLoader(true); setDone(false); }
    else if (showLoader) setDone(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function acceptChange(suggestion: Suggestion) {
    pushUndo();
    const section = suggestion.section.toLowerCase();

    setState((prev) => {
      if (!prev.parsed) return prev;
      const parsed = { ...prev.parsed };

      if (section === "summary") {
        parsed.summary = suggestion.improved;
      } else if (section === "experience") {
        parsed.experience = parsed.experience.map((exp) => {
          const bulletIdx = exp.bullets.findIndex((b) => b === suggestion.original);
          if (bulletIdx === -1) return exp;
          const bullets = [...exp.bullets];
          bullets[bulletIdx] = suggestion.improved;
          return { ...exp, bullets };
        });
      } else if (section === "skills") {
        const skillIdx = parsed.skills.findIndex((s) => s === suggestion.original);
        if (skillIdx !== -1) {
          const skills = [...parsed.skills];
          skills[skillIdx] = suggestion.improved;
          parsed.skills = skills;
        }
      }

      return { ...prev, parsed };
    });

    setStatuses((prev) => ({ ...prev, [suggestion.id]: "accepted" }));
  }

  function rejectChange(id: string) {
    setStatuses((prev) => ({ ...prev, [id]: "rejected" }));
  }

  if (showLoader) {
    return (
      <section aria-label="Resume Enhancements" className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <AILoader type="enhancements" done={done} onDone={() => setShowLoader(false)} />
      </section>
    );
  }

  if (enhancements.length === 0) {
    return (
      <section aria-label="Resume Enhancements">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No enhancements available. Run enhancement to improve your resume.
        </p>
      </section>
    );
  }

  const acceptedCount = Object.values(statuses).filter((s) => s === "accepted").length;
  const pendingCount = enhancements.filter((e) => !statuses[e.id]).length;

  return (
    <section aria-label="Resume Enhancement Suggestions">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Enhancements
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({enhancements.length})
          </span>
        </h2>
        <div className="flex items-center gap-3 text-xs font-medium">
          {acceptedCount > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400">{acceptedCount} accepted</span>
          )}
          {pendingCount > 0 && (
            <span className="text-gray-400">{pendingCount} pending</span>
          )}
        </div>
      </div>

      <ul className="space-y-3" aria-label="Enhancement suggestions list">
        {enhancements.map((enhancement) => (
          <EnhancementCard
            key={enhancement.id}
            suggestion={enhancement}
            status={statuses[enhancement.id] ?? "pending"}
            onAccept={acceptChange}
            onReject={rejectChange}
          />
        ))}
      </ul>
    </section>
  );
}
