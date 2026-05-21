"use client";

import { useState } from "react";
import type { ParsedResume } from "@/types";
import { dispatchCreditUpdate } from "@/lib/credit-utils";

interface FormatIssue {
  category: string;
  issue: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

interface Props {
  resume: ParsedResume | null;
}

export default function FreeFormattingChecker({ resume }: Props) {
  const [issues, setIssues] = useState<FormatIssue[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const checkFormatting = () => {
    if (!resume) return;

    setLoading(true);
    const foundIssues: FormatIssue[] = [];
    let points = 100;

    // Check contact info formatting
    if (resume.contact.email && !resume.contact.email.includes("@")) {
      foundIssues.push({
        category: "Contact Info",
        issue: "Invalid email format",
        severity: "high",
        suggestion: "Use a valid email address (e.g., name@example.com)",
      });
      points -= 10;
    }

    if (resume.contact.phone && resume.contact.phone.length < 10) {
      foundIssues.push({
        category: "Contact Info",
        issue: "Phone number seems incomplete",
        severity: "medium",
        suggestion: "Include full phone number with area code",
      });
      points -= 5;
    }

    // Check experience formatting
    if (resume.experience && resume.experience.length > 0) {
      resume.experience.forEach((exp, idx) => {
        if (!exp.company || !exp.title) {
          foundIssues.push({
            category: "Experience",
            issue: `Entry ${idx + 1}: Missing company or job title`,
            severity: "high",
            suggestion: "Fill in both company name and job title",
          });
          points -= 8;
        }

        if (!exp.startDate) {
          foundIssues.push({
            category: "Experience",
            issue: `Entry ${idx + 1}: Missing start date`,
            severity: "medium",
            suggestion: "Add the month and year you started this position",
          });
          points -= 5;
        }

        if (!exp.bullets || exp.bullets.length === 0) {
          foundIssues.push({
            category: "Experience",
            issue: `Entry ${idx + 1}: No bullet points`,
            severity: "high",
            suggestion: "Add 3-5 bullet points describing your achievements",
          });
          points -= 10;
        } else if (exp.bullets.length < 3) {
          foundIssues.push({
            category: "Experience",
            issue: `Entry ${idx + 1}: Only ${exp.bullets.length} bullet point(s)`,
            severity: "medium",
            suggestion: "Add more bullet points (aim for 3-5 per position)",
          });
          points -= 5;
        }

        // Check bullet point quality
        exp.bullets.forEach((bullet, bidx) => {
          if (bullet.length < 10) {
            foundIssues.push({
              category: "Experience",
              issue: `Entry ${idx + 1}, Bullet ${bidx + 1}: Very short bullet point`,
              severity: "low",
              suggestion: "Expand with more detail and action verbs",
            });
            points -= 2;
          }

          if (!bullet.match(/^[A-Z]/)) {
            foundIssues.push({
              category: "Experience",
              issue: `Entry ${idx + 1}, Bullet ${bidx + 1}: Doesn't start with capital letter`,
              severity: "low",
              suggestion: "Start each bullet point with a capital letter",
            });
            points -= 1;
          }
        });
      });
    }

    // Check education formatting
    if (resume.education && resume.education.length > 0) {
      resume.education.forEach((edu, idx) => {
        if (!edu.institution || !edu.degree) {
          foundIssues.push({
            category: "Education",
            issue: `Entry ${idx + 1}: Missing institution or degree`,
            severity: "high",
            suggestion: "Fill in school name and degree type",
          });
          points -= 8;
        }

        if (!edu.graduationYear) {
          foundIssues.push({
            category: "Education",
            issue: `Entry ${idx + 1}: Missing graduation year`,
            severity: "medium",
            suggestion: "Add the year you graduated or expect to graduate",
          });
          points -= 5;
        }
      });
    }

    // Check skills formatting
    if (resume.skills && resume.skills.length > 0) {
      const skillsWithCommas = resume.skills.filter((s) => s.includes(","));
      if (skillsWithCommas.length > 0) {
        foundIssues.push({
          category: "Skills",
          issue: "Some skills contain commas",
          severity: "low",
          suggestion: "Use individual skills without commas (they're already separated)",
        });
        points -= 2;
      }
    }

    // Check for consistency
    const allText = JSON.stringify(resume).toLowerCase();
    const hasInconsistentDates =
      allText.match(/\d{4}/g)?.some((year) => {
        const y = parseInt(year);
        return y < 1950 || y > new Date().getFullYear() + 5;
      }) || false;

    if (hasInconsistentDates) {
      foundIssues.push({
        category: "Dates",
        issue: "Some dates appear to be invalid",
        severity: "medium",
        suggestion: "Review all dates to ensure they're realistic",
      });
      points -= 5;
    }

    // Check for length
    const totalLength = JSON.stringify(resume).length;
    if (totalLength < 500) {
      foundIssues.push({
        category: "Content",
        issue: "Resume seems quite short",
        severity: "low",
        suggestion: "Add more details to your experience and skills",
      });
      points -= 3;
    }

    setIssues(foundIssues);
    setScore(Math.max(0, points));
    setLoading(false);
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (s >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
    if (s >= 60) return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
    return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
    if (severity === "medium") return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={checkFormatting}
        disabled={loading || !resume}
        className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
      >
        {loading ? "Checking..." : "✓ Check Formatting (Free)"}
      </button>

      {score !== null && (
        <div className={`p-4 rounded-lg border ${getScoreBg(score)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Formatting Score</h3>
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
          </div>

          {score >= 80 && (
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              ✅ Your resume formatting looks great!
            </p>
          )}
          {score >= 60 && score < 80 && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ⚠️ Some formatting improvements recommended.
            </p>
          )}
          {score < 60 && (
            <p className="text-sm text-red-700 dark:text-red-300">
              ❌ Several formatting issues found. See details below.
            </p>
          )}
        </div>
      )}

      {issues.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Issues Found</h3>
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {issue.issue}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{issue.category}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getSeverityColor(issue.severity)}`}>
                  {issue.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 {issue.suggestion}
              </p>
            </div>
          ))}
        </div>
      )}

      {score !== null && issues.length === 0 && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            ✅ No formatting issues found! Your resume is well-formatted.
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
            This analysis is free and doesn&apos;t use any credits
          </p>
        </div>
      )}
    </div>
  );
}
