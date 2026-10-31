"use client";

import { useMemo, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { matchJob } from "@/lib/jd-match";

export default function JobMatchPanel() {
  const { state, setState, pushUndo } = useResume();
  const [jd, setJd] = useState(state.jd ?? "");
  const [showMatched, setShowMatched] = useState(false);

  const result = useMemo(() => {
    if (!state.parsed || jd.trim().length < 40) return null;
    return matchJob(state.parsed, jd);
  }, [state.parsed, jd]);

  const addSkill = (skill: string) => {
    if (!state.parsed) return;
    const exists = state.parsed.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (exists) return;
    pushUndo();
    setState((prev) => {
      if (!prev.parsed) return prev;
      return { ...prev, parsed: { ...prev.parsed, skills: [...prev.parsed.skills, skill] } };
    });
  };

  const tone =
    !result ? "text-slate-500" :
    result.score >= 75 ? "text-emerald-600 dark:text-emerald-400" :
    result.score >= 50 ? "text-amber-600 dark:text-amber-400" :
    "text-red-600 dark:text-red-400";

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Target job
          </p>
          <p className="mt-0.5 text-[11.5px] text-slate-400 dark:text-slate-500">
            Paste the posting. rawcv checks it against your actual resume, locally.
          </p>
        </div>
        {result && (
          <span className={`shrink-0 text-[22px] font-bold tabular-nums ${tone}`}>
            {result.score}%
          </span>
        )}
      </div>

      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        onBlur={() => setState((prev) => ({ ...prev, jd }))}
        placeholder="Paste the job description here…"
        rows={4}
        className="mt-3 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-[12.5px] leading-relaxed text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10"
        aria-label="Job description"
      />

      {!result && (
        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          Add at least a few requirements to see the match.
        </p>
      )}

      {result && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400 mb-1">
              <span>{result.matched.length} of {result.total} keywords evidenced</span>
              <span>{result.missing.length} gaps</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${result.score >= 75 ? "bg-emerald-500" : result.score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {result.missing.length > 0 && (
            <div>
              <p className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                Missing from the resume · click only if it is genuinely true
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {result.missing.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => addSkill(term)}
                    className="rounded-md border border-amber-200 dark:border-amber-900/70 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-300 hover:border-amber-400"
                    title="Add to skills"
                  >
                    + {term}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                Adding a keyword is not the same as having the skill. Never add what you cannot defend in interview.
              </p>
            </div>
          )}

          {result.matched.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowMatched((v) => !v)}
                className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {showMatched ? "Hide" : "Show"} matched keywords ({result.matched.length})
              </button>
              {showMatched && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {result.matched.map((term) => (
                    <span key={term} className="rounded-md border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                      {term}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
