"use client";

import { useMemo } from "react";
import type { ParsedResume } from "@/types";
import { scoreResume } from "@/lib/resume-score";

interface Props {
  resume: ParsedResume | null;
}

const impactStyles = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-slate-400 dark:text-slate-500",
} as const;

export default function FreeATSChecker({ resume }: Props) {
  const result = useMemo(() => scoreResume(resume), [resume]);

  if (!resume) {
    return <p className="text-[12.5px] text-slate-400">Add some content to run the review.</p>;
  }

  const tone =
    result.score >= 85
      ? "text-emerald-600 dark:text-emerald-400"
      : result.score >= 65
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  const barTone =
    result.score >= 85
      ? "bg-emerald-500"
      : result.score >= 65
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div>
          <span className={`text-[34px] font-bold leading-none tabular-nums ${tone}`}>{result.score}</span>
          <span className="text-[12px] text-slate-400 dark:text-slate-500"> /100</span>
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{result.band} for big-tech screens</p>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
              {result.wordCount} words · {Math.round(result.metricsRatio * 100)}% metrics
            </span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className={`h-full rounded-full ${barTone}`} style={{ width: `${result.score}%` }} />
          </div>
          <p className="mt-1.5 text-[11.5px] text-slate-500 dark:text-slate-400">
            {result.score >= 85
              ? "This matches the pattern of resumes that pass Google/Meta screens. Keep every claim truthful."
              : result.score >= 65
              ? "Competitive, but the issues below are the difference between a screen and a rejection."
              : "This is likely to be filtered. Fix the high-impact issues first."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5">
        {result.categories.map((cat) => (
          <div key={cat.key}>
            <div className="flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
              <span className="font-medium">{cat.label}</span>
              <span className="tabular-nums">{Math.round(cat.score)}/{cat.max}</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-700 dark:bg-slate-300"
                style={{ width: `${(cat.score / Math.max(1, cat.max)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {result.issues.length > 0 ? (
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-1">
            What is costing you interviews
          </p>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {result.issues.slice(0, 8).map((issue) => (
              <li key={issue.id} className="flex items-start gap-3 py-2.5">
                <span className={`mt-0.5 w-11 shrink-0 text-[9.5px] font-bold uppercase tracking-wider ${impactStyles[issue.impact]}`}>
                  {issue.impact}
                </span>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-slate-800 dark:text-slate-200">{issue.title}</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400">{issue.detail}</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Fix:</span> {issue.fix}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[12.5px] text-emerald-700 dark:text-emerald-400">
          No structural issues found. Tailor the content to each job description before applying.
        </p>
      )}
    </div>
  );
}
