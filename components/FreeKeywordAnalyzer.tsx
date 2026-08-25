"use client";

import { useState } from "react";
import type { ParsedResume } from "@/types";

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
        className="w-full px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:-translate-y-0.5"
      >
        {loading ? "Analyzing..." : "🔍 Analyze Keywords (Free)"}
      </button>

      {stats && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-xs text-brand-600 mb-1">Total Words</p>
              <p className="text-2xl font-bold text-brand-700">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-50 border border-brand-200">
              <p className="text-xs text-brand-600 mb-1">Unique Keywords</p>
              <p className="text-2xl font-bold text-brand-700">{stats.unique}</p>
            </div>
          </div>

          {/* Top Keywords */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
              Top Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {stats.topKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium border border-brand-200/30"
                >
                  {kw.word} <span className="opacity-70">({kw.count})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          {stats.missingCommon.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs font-medium text-amber-700 mb-2">
                💡 Consider adding these common keywords:
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.missingCommon.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded text-xs bg-amber-100 text-amber-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Upgrade CTA */}
          <div className="p-4 rounded-lg bg-brand-50 border border-brand-200">
            <p className="text-xs text-brand-700 mb-2">
              <strong>✅ This analysis is free and doesn&apos;t use any credits</strong>
            </p>
            <p className="text-xs text-brand-700 mb-2">
              <strong>Get AI-powered keyword suggestions</strong>
            </p>
            <p className="text-xs text-brand-600 mb-3">
              Sign up to get personalized keyword recommendations based on your target job descriptions.
            </p>
            <a
              href="/analyze"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Explore Premium Features →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}