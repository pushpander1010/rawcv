"use client";

import { useState } from "react";
import type { ParsedResume } from "@/types";
import { dispatchCreditUpdate } from "@/lib/credit-utils";

interface ATSIssue {
  type: string;
  description: string;
  impact: "high" | "medium" | "low";
  suggestion?: string;
}

interface Props {
  resume: ParsedResume | null;
}

export default function FreeATSChecker({ resume }: Props) {
  const [issues, setIssues] = useState<ATSIssue[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const runATSCheck = () => {
    if (!resume) return;

    setLoading(true);
    const foundIssues: ATSIssue[] = [];
    let points = 100;

    // Check for required sections
    if (!resume.contact.name?.trim()) {
      foundIssues.push({
        type: "missing_name",
        description: "No name found in contact info",
        impact: "high",
        suggestion: "Add your full name in the Contact section",
      });
      points -= 15;
    }

    if (!resume.contact.email?.trim()) {
      foundIssues.push({
        type: "missing_email",
        description: "No email address found",
        impact: "high",
        suggestion: "Add your email address in the Contact section",
      });
      points -= 15;
    }

    if (!resume.experience || resume.experience.length === 0) {
      foundIssues.push({
        type: "missing_experience",
        description: "No work experience section detected",
        impact: "high",
        suggestion: "Add at least one work experience entry",
      });
      points -= 20;
    } else {
      // Check for weak bullet points
      const allBullets = resume.experience.flatMap((e) => e.bullets || []);
      const weakBullets = allBullets.filter((b) => b.split(" ").length < 5);
      if (allBullets.length > 0 && weakBullets.length / allBullets.length > 0.5) {
        foundIssues.push({
          type: "weak_bullets",
          description: "Many bullet points are very short (fewer than 5 words)",
          impact: "medium",
          suggestion: "Expand bullet points with more detail and action verbs",
        });
        points -= 10;
      }
    }

    if (!resume.education || resume.education.length === 0) {
      foundIssues.push({
        type: "missing_education",
        description: "No education section detected",
        impact: "medium",
        suggestion: "Add your educational background",
      });
      points -= 10;
    }

    if (!resume.skills || resume.skills.length === 0) {
      foundIssues.push({
        type: "missing_skills",
        description: "No skills section detected",
        impact: "high",
        suggestion: "Add a skills section with relevant technical and soft skills",
      });
      points -= 15;
    } else if (resume.skills.length < 5) {
      foundIssues.push({
        type: "few_skills",
        description: "Only a few skills listed",
        impact: "medium",
        suggestion: "Add more skills (aim for 10-15 relevant skills)",
      });
      points -= 5;
    }

    // Check for formatting issues
    if (resume.contact.phone && !resume.contact.phone.match(/^\+?[\d\s\-\(\)]{10,}$/)) {
      foundIssues.push({
        type: "invalid_phone",
        description: "Phone number format may not be ATS-friendly",
        impact: "low",
        suggestion: "Use standard format like +1 (555) 123-4567",
      });
      points -= 2;
    }

    // Check for summary
    if (!resume.summary || resume.summary.trim().length < 20) {
      foundIssues.push({
        type: "missing_summary",
        description: "No professional summary or very short summary",
        impact: "low",
        suggestion: "Add a 2-3 sentence professional summary",
      });
      points -= 5;
    }

    // Check for certifications
    if (!resume.certifications || resume.certifications.length === 0) {
      foundIssues.push({
        type: "no_certifications",
        description: "No certifications listed (optional but helpful)",
        impact: "low",
        suggestion: "Add relevant certifications if you have any",
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

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
    if (impact === "medium") return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={runATSCheck}
        disabled={loading || !resume}
        className="w-full px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
      >
        {loading ? "Checking..." : "📊 Check ATS Compatibility (Free)"}
      </button>

      {score !== null && (
        <div className={`p-4 rounded-lg border ${getScoreBg(score)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">ATS Score</h3>
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
          </div>

          {score >= 80 && (
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              ✅ Your resume is well-optimized for ATS systems!
            </p>
          )}
          {score >= 60 && score < 80 && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ⚠️ Your resume has some ATS issues. See suggestions below.
            </p>
          )}
          {score < 60 && (
            <p className="text-sm text-red-700 dark:text-red-300">
              ❌ Your resume needs improvements for ATS compatibility.
            </p>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            ✅ This analysis is free and doesn't use any credits
          </p>
        </div>
      )}

      {issues.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Issues Found</h3>
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {issue.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getImpactColor(issue.impact)}`}>
                  {issue.impact.toUpperCase()}
                </span>
              </div>
              {issue.suggestion && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 {issue.suggestion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {score !== null && issues.length === 0 && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            ✅ No ATS issues found! Your resume looks great.
          </p>
        </div>
      )}

      {score !== null && (
        <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
          <p className="text-xs text-violet-700 dark:text-violet-300 mb-2">
            <strong>Want more detailed analysis?</strong>
          </p>
          <p className="text-xs text-violet-600 dark:text-violet-400 mb-3">
            Sign up to get AI-powered suggestions, JD matching, and more advanced ATS analysis.
          </p>
          <a
            href="/login?redirect=/analyze"
            className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
          >
            Explore Premium Features →
          </a>
        </div>
      )}
    </div>
  );
}
