"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useCallback } from "react";
import type { ParsedResume, ThemeId } from "@/types";
import { useResume } from "@/context/ResumeContext";
import FreeResumeForm from "@/components/FreeResumeForm";
import ResumePreview from "@/components/ResumePreview";
import ThemePicker from "@/components/ThemePicker";
import FreeDownloadButton from "@/components/FreeDownloadButton";
import FreeATSChecker from "@/components/FreeATSChecker";
import FreeKeywordAnalyzer from "@/components/FreeKeywordAnalyzer";
import FreeFormattingChecker from "@/components/FreeFormattingChecker";

export default function FreeBuildClient() {
  const { state, setState, isHydrated } = useResume();
  const resume = state.parsed;
  const selectedTheme = state.selectedTheme;
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "ats" | "keywords" | "formatting">("preview");

  const handleResumeChange = useCallback((newResume: ParsedResume) => {
    setState((prev) => ({ ...prev, parsed: newResume }));
    setValidationError(null);
  }, [setState]);

  const handleThemeSelect = useCallback((themeId: ThemeId) => {
    setState((prev) => ({ ...prev, selectedTheme: themeId }));
    setShowThemePicker(false);
  }, [setState]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Column */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="sticky top-24 space-y-6">
          <FreeResumeForm onResumeChange={handleResumeChange} initialResume={resume || undefined} />
        </div>
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="sticky top-24 space-y-5">
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {[
                { id: "preview", label: "Preview" },
                { id: "ats", label: "ATS Check" },
                { id: "keywords", label: "Keywords" },
                { id: "formatting", label: "Format" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-full font-medium text-[13.5px] whitespace-nowrap transition-colors ${
                    activeTab === t.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Tab */}
          {activeTab === "preview" && (
            <>
              {/* Theme Selector */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Theme
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowThemePicker(!showThemePicker)}
                    className="text-[13px] px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-medium transition-colors"
                  >
                    {showThemePicker ? "Hide" : "Change"}
                  </button>
                </div>

                {showThemePicker && (
                  <div className="mb-5 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <ThemePicker onSelect={handleThemeSelect} />
                  </div>
                )}

                <div className="text-[13.5px] text-slate-600 dark:text-slate-300">
                  Current: <span className="font-semibold text-slate-900 dark:text-white capitalize">{selectedTheme}</span>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
                  Preview
                </h2>

                {resume ? (
                  <div className="overflow-auto max-h-96 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <ResumePreview resume={resume} theme={selectedTheme} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-56 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <p className="text-[13.5px] text-slate-500 dark:text-slate-300">
                        Start filling out the form to see your resume preview
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
                  Download
                </h2>

                <FreeDownloadButton
                  resume={resume}
                  theme={selectedTheme}
                  onValidationError={setValidationError}
                />

                {validationError && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <p className="text-[13.5px] text-amber-700 dark:text-amber-300">{validationError}</p>
                  </div>
                )}

                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[13px] text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Completely free</strong> — no watermark, no hidden charges
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ATS Check Tab */}
          {activeTab === "ats" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
                ATS Compatibility Check
              </h2>
              <FreeATSChecker resume={resume} />
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === "keywords" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
                Keyword Analysis
              </h2>
              <FreeKeywordAnalyzer resume={resume} />
            </div>
          )}

          {/* Formatting Tab */}
          {activeTab === "formatting" && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-3">
                Formatting Check
              </h2>
              <FreeFormattingChecker resume={resume} />
            </div>
          )}

          {/* AI Features CTA */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5">
            <h3 className="text-[14.5px] font-semibold text-slate-900 dark:text-white mb-1.5">
              Upgrade with AI
            </h3>
            <p className="text-[13.5px] text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
              Get an ATS score, job-description match, and AI bullet enhancements — without leaving the builder.
            </p>
            <a
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[13.5px] font-semibold transition-colors w-full"
            >
              Explore AI features
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
