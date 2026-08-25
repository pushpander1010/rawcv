"use client";

import React, { useEffect, useState } from "react";
import type { ATSResult, ATSIssue } from "@/types";
import AILoader from "@/components/AILoader";

// ─── Circular gauge ───────────────────────────────────────────────────────────

function CircularGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";
  return (
    <div className="relative inline-flex items-center justify-center" aria-hidden="true">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={progress} transform="rotate(-90 64 64)" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <span className="absolute text-2xl font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── Impact badge ─────────────────────────────────────────────────────────────

const IMPACT_STYLES: Record<ATSIssue["impact"], string> = {
  high:   "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800",
  medium: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
  low:    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
};

function ImpactBadge({ impact }: { impact: ATSIssue["impact"] }) {
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${IMPACT_STYLES[impact]}`}>{impact}</span>;
}

// ─── Issue row ────────────────────────────────────────────────────────────────

function IssueRow({ issue }: { issue: ATSIssue }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-expanded={expanded}>
        <span className="text-[13.5px] font-medium text-slate-800 dark:text-slate-100 truncate">{issue.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
        <span className="flex items-center gap-2 shrink-0">
          <ImpactBadge impact={issue.impact} />
          <svg className={`h-4 w-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      {expanded && <div className="px-4 pb-3 text-[13.5px] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-2.5 leading-relaxed">{issue.description}</div>}
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
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <AILoader type="ats" />
      </div>
    );
  }

  const { score, issues = [] } = result;
  const showIssues = issues.length > 0;
  const label = score >= 80 ? "Great ATS compatibility" : score >= 60 ? "Moderate ATS compatibility" : "Poor ATS compatibility";
  const color = score >= 80 ? "text-emerald-600 dark:text-emerald-300" : score >= 60 ? "text-amber-600 dark:text-amber-300" : "text-red-600 dark:text-red-300";

  return (
    <section aria-label="ATS Score" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
      <div className="flex flex-col items-center gap-1.5 mb-6">
        <CircularGauge score={score} />
        <p className={`text-[13.5px] font-semibold ${color}`}>{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Score: {score}/100</p>
      </div>
      {showIssues && (
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-3">
            Issues to fix ({issues.length})
          </p>
          <ul className="space-y-2" aria-label="ATS issues">
            {issues.map((issue, idx) => <IssueRow key={`${issue.type}-${idx}`} issue={issue} />)}
          </ul>
        </div>
      )}
      {!showIssues && (
        <p className="text-[14px] text-center text-emerald-600 font-medium">
          No issues found — your resume is ATS-ready!
        </p>
      )}
    </section>
  );
}