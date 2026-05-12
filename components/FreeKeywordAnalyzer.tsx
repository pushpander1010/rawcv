"use client";

import { useState } from "react";
import type { ParsedResume } from "@/types";
import { dispatchCreditUpdate } from "@/lib/credit-utils";

interface KeywordStats {
  total: number;
  unique: number;
  topKeywords: Array<{ word: string; count: number }>;
  missingCommon: string[];
}

interface Props {
  resume: ParsedResume | null;
}

const COMMON_KEYWORDS = [
  "leadership",
  "communication",
  "problem-solving",
  "teamwork",
  "project management",
  "data analysis",
  "strategic planning",
  "customer service",
  "technical skills",
  "innovation",
  "agile",
  "scrum",
  "python",
  "javascript",
  "sql",
  "aws",
  "cloud",
  "api",
  "database",
  "frontend",
  "backend",
  "full-stack",
  "react",
  "node.js",
  "devops",
  "ci/cd",
  "docker",
  "kubernetes",
  "microservices",
  "rest",
  "graphql",
];

export default function FreeKeywordAnalyzer({ resume }: Props) {
  const [stats, setStats] = useState<KeywordStats | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeKeywords = () => {
    if (!resume) return;

    setLoading(true);

    // Extract all text from resume
    const textParts: string[] = [];

    if (resume.contact.name) textParts.push(resume.contact.name);
    if (resume.summary) textParts.push(resume.summary);

    resume.experience?.forEach((exp) => {
      if (exp.company) textParts.push(exp.company);
      if (exp.title) textParts.push(exp.title);
      exp.bullets?.forEach((b) => textParts.push(b));
    });

    resume.education?.forEach((edu) => {
      if (edu.institution) textParts.push(edu.institution);
      if (edu.degree) textParts.push(edu.degree);
      if (edu.field) textParts.push(edu.field);
    });

    resume.skills?.forEach((s) => textParts.push(s));
    resume.certifications?.forEach((c) => textParts.push(c));
    resume.projects?.forEach((p) => {
      if (p.name) textParts.push(p.name);
      if (p.description) textParts.push(p.description);
      p.technologies?.forEach((t) => textParts.push(t));
    });

    const fullText = textParts.join(" ").toLowerCase();

    // Count keywords
    const keywordCounts: Record<string, number> = {};
    const words = fullText.match(/\b[\w\-\.]+\b/g) || [];

    words.forEach((word) => {
      if (word.length > 3) {
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
      }
    });

    // Get top keywords
    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({ word, count }));

    // Find missing common keywords
    const resumeKeywordsLower = Object.keys(keywordCounts).map((k) => k.toLowerCase());
    const missingCommon = COMMON_KEYWORDS.filter(
      (k) => !resumeKeywordsLower.some((rk) => rk.includes(k) || k.includes(rk))
    ).slice(0, 10);

    setStats({
      total: words.length,
      unique: Object.keys(keywordCounts).length,
      topKeywords,
      missingCommon,
    });

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={analyzeKeywords}
        disabled={loading || !resume}
        className="w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
      >
        {loading ? "Analyzing..." : "🔍 Analyze Keywords (Free)"}
      </button>

      {stats && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Words</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Unique Keywords</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.unique}</p>
            </div>
          </div>

          {/* Top Keywords */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">
              Top Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.topKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium"
                >
                  {kw.word} <span className="opacity-70">({kw.count})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          {stats.missingCommon.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-2">
                💡 Consider adding these common keywords:
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.missingCommon.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
            <p className="text-xs text-violet-700 dark:text-violet-300 mb-2">
              <strong>✅ This analysis is free and doesn't use any credits</strong>
            </p>
            <p className="text-xs text-violet-700 dark:text-violet-300 mb-2">
              <strong>Get AI-powered keyword suggestions</strong>
            </p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mb-3">
              Sign up to get personalized keyword recommendations based on your target job descriptions.
            </p>
            <a
              href="/login?redirect=/analyze"
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
            >
              Explore Premium Features →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
