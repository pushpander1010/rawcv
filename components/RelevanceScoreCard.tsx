"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import type { RelevanceResult } from "@/types";
import AILoader from "@/components/AILoader";

// ─── Circular gauge (reused pattern from ATSScoreCard) ────────────────────────

function CircularGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#22c55e" :
    score >= 70 ? "#84cc16" :
    score >= 50 ? "#f59e0b" :
    "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center" aria-hidden="true">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle
          cx="64" cy="64" r={radius}
          fill="none" stroke="currentColor" strokeWidth="10"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="64" cy="64" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-2xl font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, variant }: { label: string; variant: "keyword" | "skill" }) {
  const styles =
    variant === "keyword"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
      : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${styles}`}>
      {label}
    </span>
  );
}

// ─── RelevanceScoreCard ───────────────────────────────────────────────────────

interface RelevanceScoreCardProps {
  result: RelevanceResult;
  loading?: boolean;
}

export default function RelevanceScoreCard({ result, loading = false }: RelevanceScoreCardProps) {
  const { score, missingKeywords = [], missingSkills = [], recommendations = [] } = result;
  const showRecommendations = score < 70 && recommendations.length > 0;

  const label =
    score >= 80 ? "Strong match" :
    score >= 70 ? "Good match" :
    score >= 50 ? "Moderate match" :
    "Weak match";

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <AILoader type="relevance" />
      </div>
    );
  }

  return (
    <section
      aria-label="JD Relevance Score"
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6"
    >
      <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
        JD Relevance Score
      </h2>

      {/* Gauge */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <CircularGauge score={score} />
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">out of 100</p>
      </div>

      {/* Missing keywords */}
      {missingKeywords.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Missing Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw) => (
              <Chip key={kw} label={kw} variant="keyword" />
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {missingSkills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((sk) => (
              <Chip key={sk} label={sk} variant="skill" />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations — only shown when score < 70 */}
      {showRecommendations && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Recommendations
          </p>
          <ol className="space-y-2" aria-label="Improvement recommendations">
            {recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="flex gap-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200"
              >
                <span className="shrink-0 font-semibold text-blue-500">{idx + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* All-clear when score >= 70 */}
      {!showRecommendations && score >= 70 && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Your resume is a solid match for this role.
        </p>
      )}
    </section>
  );
}
