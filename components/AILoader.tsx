"use client";

import { useEffect, useRef, useState } from "react";

const STEPS: Record<string, string[]> = {
  ats: [
    "Reading your resume…",
    "Parsing sections and structure…",
    "Checking for missing sections…",
    "Scanning keyword density…",
    "Validating date formats…",
    "Analysing formatting compatibility…",
    "Running ATS filter simulation…",
    "Scoring against 50+ ATS rules…",
    "Compiling issues and fixes…",
    "Almost there…",
  ],
  relevance: [
    "Reading your resume…",
    "Parsing job description…",
    "Extracting required skills…",
    "Extracting required keywords…",
    "Matching against your experience…",
    "Identifying skill gaps…",
    "Calculating relevance score…",
    "Generating recommendations…",
    "Almost there…",
  ],
  suggestions: [
    "Reading your resume…",
    "Analysing bullet points…",
    "Identifying weak action verbs…",
    "Looking for quantifiable achievements…",
    "Checking section completeness…",
    "Generating targeted improvements…",
    "Ranking suggestions by impact…",
    "Finalising recommendations…",
    "Almost there…",
  ],
  enhancements: [
    "Reading your resume…",
    "Scanning bullet points for weak language…",
    "Identifying passive voice…",
    "Strengthening action verbs…",
    "Adding measurable impact…",
    "Polishing your summary…",
    "Reviewing skills section…",
    "Finalising enhancements…",
    "Almost there…",
  ],
  tailor: [
    "Reading your resume…",
    "Parsing job description…",
    "Identifying role requirements…",
    "Mapping your experience to the role…",
    "Rewriting bullet points for fit…",
    "Injecting missing keywords…",
    "Adjusting summary for the role…",
    "Reviewing tailored output…",
    "Almost there…",
  ],
  chat: [
    "Thinking…",
    "Reading your resume…",
    "Processing your request…",
    "Generating response…",
  ],
  default: [
    "Processing…",
    "Analysing your resume…",
    "Running AI model…",
    "Almost there…",
  ],
};

interface AILoaderProps {
  type?: keyof typeof STEPS;
  /** ms between step advances during loading — default 1800 */
  interval?: number;
  /** When true, dismiss immediately and call onDone */
  done?: boolean;
  onDone?: () => void;
}

export default function AILoader({
  type = "default",
  interval = 1800,
  done = false,
  onDone,
}: AILoaderProps) {
  const steps = STEPS[type] ?? STEPS.default;
  const [stepIdx, setStepIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const calledDone = useRef(false);

  // Reset on type change
  useEffect(() => {
    // Use setTimeout to avoid cascading renders
    setTimeout(() => {
      setStepIdx(0);
      setVisible(true);
      calledDone.current = false;
    }, 0);
  }, [type]);

  // When done fires — call onDone immediately, no animation
  useEffect(() => {
    if (!done || calledDone.current) return;
    calledDone.current = true;
    onDone?.();
  }, [done, onDone]);

  // Normal step cadence while loading
  useEffect(() => {
    if (done) return;
    if (stepIdx >= steps.length - 1) return;
    const t = setTimeout(() => {
      setVisible(false);
      const t2 = setTimeout(() => {
        setStepIdx((i) => Math.min(i + 1, steps.length - 1));
        setVisible(true);
      }, 180);
      return () => clearTimeout(t2);
    }, interval);
    return () => clearTimeout(t);
  }, [stepIdx, steps.length, interval, done]);

  const progress = Math.round(((stepIdx + 1) / steps.length) * 100);

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10 px-4 select-none">
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <span className="absolute inset-0 rounded-full bg-violet-400/20 animate-ping" />
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: "1.2s" }}
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="26" stroke="url(#lg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="100 64" />
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-violet-600 animate-pulse" />
        </span>
      </div>

      {/* Step text */}
      <p
        className="text-sm font-medium text-gray-600 dark:text-gray-300 text-center transition-opacity duration-150"
        style={{ opacity: visible ? 1 : 0 }}
        aria-live="polite"
        aria-atomic="true"
      >
        {steps[stepIdx]}
      </p>

      {/* Progress bar */}
      <div className="w-48 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
        {stepIdx + 1} / {steps.length}
      </p>
    </div>
  );
}
