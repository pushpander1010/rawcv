"use client";

import { useMemo } from "react";
import type { ParsedResume } from "@/types";

interface FormatIssue {
  category: string;
  issue: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

interface Props {
  resume: ParsedResume | null;
}

function analyze(resume: ParsedResume | null): { score: number; issues: FormatIssue[] } {
  if (!resume) return { score: 0, issues: [] };
  const issues: FormatIssue[] = [];
  let points = 100;

  if (resume.contact.email && !resume.contact.email.includes("@")) {
    issues.push({ category: "Contact", issue: "Email format looks invalid", severity: "high", suggestion: "Use a valid address like name@example.com." });
    points -= 10;
  }
  if (resume.contact.phone && resume.contact.phone.replace(/\D/g, "").length < 10) {
    issues.push({ category: "Contact", issue: "Phone number looks incomplete", severity: "medium", suggestion: "Include the full number with country or area code." });
    points -= 5;
  }

  resume.experience?.forEach((exp, idx) => {
    if (!exp.company || !exp.title) {
      issues.push({ category: "Experience", issue: `Role ${idx + 1} is missing a title or company`, severity: "high", suggestion: "Fill in both the job title and the company." });
      points -= 8;
    }
    if (!exp.startDate) {
      issues.push({ category: "Experience", issue: `Role ${idx + 1} has no start date`, severity: "medium", suggestion: "Add the month and year you started." });
      points -= 5;
    }
    if (!exp.bullets?.length) {
      issues.push({ category: "Experience", issue: `Role ${idx + 1} has no achievements`, severity: "high", suggestion: "Add 2–4 bullets with results and metrics." });
      points -= 10;
    } else if (exp.bullets.length < 2) {
      issues.push({ category: "Experience", issue: `Role ${idx + 1} has only one bullet`, severity: "medium", suggestion: "Add another achievement or responsibility." });
      points -= 5;
    }
    exp.bullets?.forEach((bullet, bidx) => {
      if (bullet.length < 10) {
        issues.push({ category: "Experience", issue: `Role ${idx + 1}, bullet ${bidx + 1} is very short`, severity: "low", suggestion: "Expand it with an action verb and a result." });
        points -= 2;
      }
      if (!/^[A-Z]/.test(bullet)) {
        issues.push({ category: "Experience", issue: `Role ${idx + 1}, bullet ${bidx + 1} does not start with a capital`, severity: "low", suggestion: "Start each bullet with a capital letter." });
        points -= 1;
      }
    });
  });

  resume.education?.forEach((edu, idx) => {
    if (!edu.institution || !edu.degree) {
      issues.push({ category: "Education", issue: `Education ${idx + 1} is missing a school or degree`, severity: "high", suggestion: "Add both the institution and the degree." });
      points -= 8;
    }
    if (!edu.graduationYear) {
      issues.push({ category: "Education", issue: `Education ${idx + 1} has no graduation year`, severity: "medium", suggestion: "Add the year you graduated or expect to graduate." });
      points -= 5;
    }
  });

  if (resume.skills?.some((s) => s.includes(","))) {
    issues.push({ category: "Skills", issue: "Some skills contain commas", severity: "low", suggestion: "Separate skills with commas in the field; each skill should stand alone." });
    points -= 2;
  }

  const allText = JSON.stringify(resume);
  if (allText.length < 500) {
    issues.push({ category: "Content", issue: "The resume is quite short", severity: "low", suggestion: "Add more detail to experience and skills." });
    points -= 3;
  }

  return { score: Math.max(0, points), issues };
}

const sevStyle: Record<FormatIssue["severity"], string> = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-slate-400 dark:text-slate-500",
};

export default function FreeFormattingChecker({ resume }: Props) {
  const { score, issues } = useMemo(() => analyze(resume), [resume]);
  const tone = score >= 80 ? "emerald" : score >= 60 ? "amber" : "red";

  if (!resume) return <p className="text-[12.5px] text-slate-400">Add some content to check formatting.</p>;

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
            {issues.length === 0 ? "Dates, sections, and details are complete." : `${issues.length} thing${issues.length === 1 ? "" : "s"} to tidy up.`}
          </p>
        </div>
      </div>

      {issues.length > 0 && (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {issues.map((issue, idx) => (
            <li key={`${issue.category}-${idx}`} className="flex items-start gap-3 py-2.5">
              <span className={`mt-0.5 text-[9.5px] font-bold uppercase tracking-wider w-11 shrink-0 ${sevStyle[issue.severity]}`}>
                {issue.severity}
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-slate-800 dark:text-slate-200">{issue.issue}</p>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">{issue.category} · {issue.suggestion}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
