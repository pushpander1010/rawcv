"use client";

import { useMemo } from "react";
import { useResume } from "@/context/ResumeContext";
import { reviewBullet, polishResumeBullets, bulletSummary } from "@/lib/bullet-coach";

interface Props {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

const issueTone: Record<string, string> = {
  high: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-100 dark:border-red-900/60",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-100 dark:border-amber-900/60",
  low: "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 55) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function BulletCoach({ bullets, onChange }: Props) {
  const { pushUndo } = useResume();
  const summary = useMemo(() => bulletSummary(bullets), [bullets]);
  const reviews = useMemo(() => bullets.map(reviewBullet), [bullets]);
  const polishable = reviews.filter(
    (r, i) => r.polish && r.polish.toLowerCase().replace(/[.!?]+$/, "").trim() !== bullets[i].toLowerCase().replace(/[.!?]+$/, "").trim()
  );

  if (!bullets.length) return null;

  const applyAll = () => {
    const { bullets: next, changed } = polishResumeBullets(bullets);
    if (!changed) return;
    pushUndo();
    onChange(next);
  };

  const applyOne = (index: number) => {
    const next = [...bullets];
    next[index] = reviews[index].polish;
    if (!next[index] || next[index] === bullets[index]) return;
    pushUndo();
    onChange(next);
  };

  return (
    <details className="group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 select-none [&::-webkit-details-marker]:hidden">
        <span className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-200">Bullet coach</span>
        <span className={`text-[11.5px] font-bold tabular-nums ${scoreTone(summary.average)}`}>{summary.average}/100</span>
        {summary.missingMetrics > 0 && (
          <span className="rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
            {summary.missingMetrics} need metric{summary.missingMetrics === 1 ? "" : "s"}
          </span>
        )}
        <svg className="ml-auto w-3.5 h-3.5 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </summary>

      <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-2.5">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-md border border-slate-100 dark:border-slate-800 px-2.5 py-2">
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 shrink-0 text-[11px] font-bold tabular-nums ${scoreTone(review.score)}`}>{review.score}</span>
              <p className="flex-1 min-w-0 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                {bullets[i]}
              </p>
              {review.polish && review.polish.toLowerCase().replace(/[.!?]+$/, "").trim() !== bullets[i].toLowerCase().replace(/[.!?]+$/, "").trim() && (
                <button
                  type="button"
                  onClick={() => applyOne(i)}
                  className="shrink-0 rounded border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Polish
                </button>
              )}
            </div>
            {review.issues.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1 pl-6">
                {review.issues.map((issue) => (
                  <span key={issue.code} className={`rounded border px-1.5 py-0.5 text-[9.5px] font-semibold ${issueTone[issue.severity]}`}>
                    {issue.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <p className="text-[10.5px] text-slate-400 dark:text-slate-500">
            Polish only fixes wording — it never invents a number. Add real metrics yourself.
          </p>
          {polishable.length > 0 && (
            <button
              type="button"
              onClick={applyAll}
              className="rounded-md bg-slate-900 dark:bg-white px-2.5 py-1 text-[10.5px] font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
            >
              Polish {polishable.length} bullet{polishable.length === 1 ? "" : "s"}
            </button>
          )}
        </div>
      </div>
    </details>
  );
}
