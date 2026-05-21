"use client";

import React, { useEffect, useState } from "react";
import type { ATSResult, ATSIssue } from "@/types";
import AILoader from "@/components/AILoader";

// ─── Circular gauge ───────────────────────────────────────────────────────────

function CircularGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative inline-flex items-center justify-center" aria-hidden="true">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-gray-700" />
        <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={progress} transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <span className="absolute text-2xl font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── Impact badge ─────────────────────────────────────────────────────────────

const IMPACT_STYLES: Record<ATSIssue["impact"], string> = {
  high:   "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  low:    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function ImpactBadge({ impact }: { impact: ATSIssue["impact"] }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${IMPACT_STYLES[impact]}`}>{impact}</span>;
}

// ─── Issue row ────────────────────────────────────────────────────────────────

function IssueRow({ issue }: { issue: ATSIssue }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-expanded={expanded}>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{issue.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
        <span className="flex items-center gap-2 shrink-0">
          <ImpactBadge impact={issue.impact} />
          <svg className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      {expanded && <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2">{issue.description}</div>}
    </li>
  );
}

// ─── ATSScoreCard ─────────────────────────────────────────────────────────────

interface ATSScoreCardProps {
  result: ATSResult;
  loading?: boolean;
}

export default function ATSScoreCard({ result, loading = false }: ATSScoreCardProps) {
  const showLoader = loading;

  if (showLoader) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <AILoader type="ats" />
      </div>
    );
  }

  const { score, issues = [] } = result;
  const showIssues = score < 60 && issues.length > 0;
  const label = score >= 80 ? "Great ATS compatibility" : score >= 60 ? "Moderate ATS compatibility" : "Poor ATS compatibility";

  return (
    <section aria-label="ATS Score" className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">ATS Score</h2>
      <div className="flex flex-col items-center gap-2 mb-6">
        <CircularGauge score={score} />
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">out of 100</p>
      </div>
      {showIssues && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Issues to fix</p>
          <ul className="space-y-2" aria-label="ATS issues">
            {issues.map((issue, idx) => <IssueRow key={`${issue.type}-${idx}`} issue={issue} />)}
          </ul>
        </div>
      )}
      {!showIssues && score >= 60 && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Your resume passes basic ATS checks.{issues.length > 0 && " Minor improvements may still help."}
        </p>
      )}
    </section>
  );
}
