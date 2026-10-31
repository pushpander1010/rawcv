"use client";

import { useMemo } from "react";
import type { ParsedResume } from "@/types";

interface ATSIssue {
  type: string;
  description: string;
  impact: "high" | "medium" | "low";
  suggestion?: string;
}

interface Props {
  resume: ParsedResume | null;
}

function analyze(resume: ParsedResume | null): { score: number; issues: ATSIssue[] } {
  if (!resume) return { score: 0, issues: [] };
  const issues: ATSIssue[] = [];
  let score = 100;

  if (!resume.contact.name?.trim()) {
    issues.push({ type: "name", description: "No name in the contact block", impact: "high", suggestion: "Add your full name at the top." });
    score -= 15;
  }
  if (!resume.contact.email?.trim()) {
    issues.push({ type: "email", description: "No email address", impact: "high", suggestion: "Add a professional email address." });
    score -= 15;
  }
  if (!resume.experience?.length) {
    issues.push({ type: "experience", description: "No work experience section", impact: "high", suggestion: "Add at least one role with 2–4 achievement bullets." });
    score -= 20;
  } else {
    const bullets = resume.experience.flatMap((e) => e.bullets || []);
    const weak = bullets.filter((b) => b.split(/\s+/).length < 5);
    if (bullets.length && weak.length / bullets.length > 0.5) {
      issues.push({ type: "bullets", description: "Most bullets are shorter than 5 words", impact: "medium", suggestion: "Expand each bullet with an action and a result." });
      score -= 10;
    }
  }
  if (!resume.education?.length) {
    issues.push({ type: "education", description: "No education section", impact: "medium", suggestion: "Add your degree, school, and graduation year." });
    score -= 10;
  }
  if (!resume.skills?.length) {
    issues.push({ type: "skills", description: "No skills section", impact: "high", suggestion: "List 8–12 relevant tools and strengths." });
    score -= 15;
  } else if (resume.skills.length < 5) {
    issues.push({ type: "skills", description: "Only a few skills listed", impact: "medium", suggestion: "Aim for 8–12 skills that match the job." });
    score -= 5;
  }
  if (!resume.summary || resume.summary.trim().length < 20) {
    issues.push({ type: "summary", description: "No summary, or it is very short", impact: "low", suggestion: "Add 2–3 lines: role, years, and one measurable result." });
    score -= 5;
  }
  if (!resume.certifications?.length) {
    issues.push({ type: "certifications", description: "No certifications listed", impact: "low", suggestion: "Add relevant credentials if you have them." });
    score -= 3;
  }

  return { score: Math.max(0, score), issues };
}

const impactStyle: Record<ATSIssue["impact"], string> = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-slate-400 dark:text-slate-500",
};

export default function FreeATSChecker({ resume }: Props) {
  const { score, issues } = useMemo(() => analyze(resume), [resume]);
  const tone = score >= 80 ? "emerald" : score >= 60 ? "amber" : "red";

  if (!resume) return <p className="text-[12.5px] text-slate-400">Add some content to run the ATS check.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className={`text-[30px] font-bold leading-none tabular-nums ${
          tone === "emerald" ? "text-emerald-600 dark:text-emerald-400" : tone === "amber" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
        }`}>
          {score}
        </span>
        <div className="flex-1 min-w-0">
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${tone === "emerald" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
            {score >= 80 ? "Strong ATS foundation — fix the details below to finish." : score >= 60 ? "Parseable, but a few sections need work." : "Several sections are missing or too thin."}
          </p>
        </div>
      </div>

      {issues.length > 0 ? (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {issues.map((issue) => (
            <li key={issue.type} className="flex items-start gap-3 py-2.5">
              <span className={`mt-0.5 text-[9.5px] font-bold uppercase tracking-wider w-11 shrink-0 ${impactStyle[issue.impact]}`}>
                {issue.impact}
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-slate-800 dark:text-slate-200">{issue.description}</p>
                {issue.suggestion && <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">{issue.suggestion}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12.5px] text-emerald-700 dark:text-emerald-400">No structural ATS issues found.</p>
      )}
    </div>
  );
}
