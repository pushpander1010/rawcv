"use client";

import { useMemo } from "react";
import type { ParsedResume } from "@/types";

interface Props {
  resume: ParsedResume | null;
}

const COMMON_KEYWORDS = [
  "leadership", "communication", "problem-solving", "teamwork", "project management",
  "data analysis", "strategic planning", "customer service", "innovation", "agile",
  "python", "javascript", "sql", "aws", "cloud", "api", "database", "frontend",
  "backend", "react", "node.js", "devops", "docker", "kubernetes", "graphql",
];

function analyze(resume: ParsedResume | null) {
  const empty = { total: 0, unique: 0, topKeywords: [] as Array<{ word: string; count: number }>, missingCommon: [] as string[], words: [] as string[] };
  if (!resume) return empty;

  const parts: string[] = [];
  if (resume.contact.name) parts.push(resume.contact.name);
  if (resume.summary) parts.push(resume.summary);
  resume.experience?.forEach((e) => {
    parts.push(e.company, e.title, ...(e.bullets || []));
  });
  resume.education?.forEach((e) => parts.push(e.institution, e.degree, e.field));
  resume.skills?.forEach((s) => parts.push(s));
  resume.certifications?.forEach((c) => parts.push(c));
  resume.projects?.forEach((p) => {
    parts.push(p.name, p.description, ...(p.technologies || []));
  });

  const words = (parts.join(" ").toLowerCase().match(/\b[\w.\-]+\b/g) || []).filter((w) => w.length > 3);
  const counts: Record<string, number> = {};
  for (const word of words) counts[word] = (counts[word] || 0) + 1;

  const keys = Object.keys(counts);
  const topKeywords = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word, count]) => ({ word, count }));

  const missingCommon = COMMON_KEYWORDS
    .filter((k) => !keys.some((rk) => rk.includes(k) || k.includes(rk)))
    .slice(0, 8);

  return { total: words.length, unique: keys.length, topKeywords, missingCommon, words };
}

export default function FreeKeywordAnalyzer({ resume }: Props) {
  const { total, unique, topKeywords, missingCommon } = useMemo(() => analyze(resume), [resume]);

  if (!resume) return <p className="text-[12.5px] text-slate-400">Add some content to analyse keywords.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 text-[12.5px]">
        <span className="text-slate-500 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-white font-semibold tabular-nums">{total}</strong> words
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-white font-semibold tabular-nums">{unique}</strong> unique
        </span>
        <span className="text-slate-400 dark:text-slate-500">
          {total >= 250 && total <= 600 ? "Good length for one page" : total < 250 ? "A little thin" : "Consider trimming"}
        </span>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-2">Most used words</p>
        <div className="flex flex-wrap gap-1.5">
          {topKeywords.map((kw) => (
            <span key={kw.word} className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-0.5 text-[11.5px] text-slate-600 dark:text-slate-300">
              {kw.word} <span className="text-slate-400 dark:text-slate-500">{kw.count}</span>
            </span>
          ))}
        </div>
      </div>

      {missingCommon.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-2">Worth adding, if true</p>
          <div className="flex flex-wrap gap-1.5">
            {missingCommon.map((kw) => (
              <span key={kw} className="rounded-md border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[11.5px] text-amber-800 dark:text-amber-300">
                {kw}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] text-slate-400 dark:text-slate-500">
            Generic keywords are a starting point. For real matching, paste a job description in the analyzer.
          </p>
        </div>
      )}
    </div>
  );
}
