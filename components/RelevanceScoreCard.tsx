"use client";

import React, { useEffect, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import type { RelevanceResult } from "@/types";
import AILoader from "@/components/AILoader";

// ─── Circular gauge ────────────────────────

function CircularGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#16a34a" :
    score >= 70 ? "#65a30d" :
    score >= 50 ? "#d97706" :
    "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center" aria-hidden="true">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle
          cx="64" cy="64" r={radius}
          fill="none" stroke="#e2e8f0" strokeWidth="10"
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

// ─── Chip ─────────────────────────────────────────────────

function Chip({ label, variant }: { label: string; variant: "keyword" | "skill" }) {
  const styles =
    variant === "keyword"
      ? "bg-orange-50 text-orange-700 border border-orange-200"
      : "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${styles}`}>
      {label}
    </span>
  );
}

// ─── RelevanceScoreCard ───────────────────────────────────────

interface RelevanceScoreCardProps {
  result: RelevanceResult;
  loading?: boolean;
}

export default function RelevanceScoreCard({ result, loading = false }: RelevanceScoreCardProps) {
  const showLoader = loading;

  if (showLoader) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <AILoader type="relevance" />
      </div>
    );
  }

  const { score, missingKeywords = [], missingSkills = [], recommendations = [] } = result;
  const showRecommendations = score < 70 && recommendations.length > 0;

  const label =
    score >= 80 ? "Strong match" :
    score >= 70 ? "Good match" :
    score >= 50 ? "Moderate match" :
    "Weak match";

  return (
    <section
      aria-label="JD Relevance Score"
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
    >
      <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">
        JD Relevance Score
      </h2>

      {/* Gauge */}
      <div className="flex flex-col items-center gap-1.5 mb-6">
        <CircularGauge score={score} />
        <p className="text-[13.5px] font-medium text-slate-600 dark:text-slate-300">{label}</p>
        <p className="text-xs text-slate-400">out of 100</p>
      </div>

      {/* Missing keywords */}
      {missingKeywords.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2">
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
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2">
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((sk) => (
              <Chip key={sk} label={sk} variant="skill" />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && (
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-2">
            Recommendations
          </p>
          <ol className="space-y-2" aria-label="Improvement recommendations">
            {recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="flex gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 px-4 py-3 text-[13.5px] text-slate-700 dark:text-slate-200 leading-relaxed"
              >
                <span className="shrink-0 font-semibold text-blue-600">{idx + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {!showRecommendations && score >= 70 && (
        <p className="text-[13.5px] text-center text-slate-500 dark:text-slate-300">
          Your resume is a solid match for this role.
        </p>
      )}
    </section>
  );
}