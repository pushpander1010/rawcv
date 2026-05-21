"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import type { ParsedResume, ThemeId } from "@/types";
import FreeResumeForm from "@/components/FreeResumeForm";
import ResumePreview from "@/components/ResumePreview";
import ThemePicker from "@/components/ThemePicker";
import FreeDownloadButton from "@/components/FreeDownloadButton";
import FreeATSChecker from "@/components/FreeATSChecker";
import FreeKeywordAnalyzer from "@/components/FreeKeywordAnalyzer";
import FreeFormattingChecker from "@/components/FreeFormattingChecker";

const STORAGE_KEY = "free_resume_draft";
const THEME_STORAGE_KEY = "free_resume_theme";

export default function FreeBuildClient() {
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("classic");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "ats" | "keywords" | "formatting">("preview");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedResume = localStorage.getItem(STORAGE_KEY);
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

      if (savedResume) {
        setResume(JSON.parse(savedResume));
      }

      if (savedTheme) {
        setSelectedTheme(savedTheme as ThemeId);
      }
    } catch (err) {
      console.error("Failed to load from localStorage:", err);
    }

    setIsHydrated(true);
  }, []);

  // Save resume to localStorage
  useEffect(() => {
    if (resume && isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    }
  }, [resume, isHydrated]);

  // Save theme to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
    }
  }, [selectedTheme, isHydrated]);

  const handleResumeChange = (newResume: ParsedResume) => {
    setResume(newResume);
    setValidationError(null);
  };

  const handleThemeSelect = (themeId: ThemeId) => {
    setSelectedTheme(themeId);
    setShowThemePicker(false);
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your resume...</p>
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
        <div className="sticky top-24 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  activeTab === "preview"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800"
                }`}
              >
                👁️ Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ats")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  activeTab === "ats"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800"
                }`}
              >
                📊 ATS Check
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("keywords")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  activeTab === "keywords"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800"
                }`}
              >
                🔍 Keywords
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("formatting")}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  activeTab === "formatting"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-800"
                }`}
              >
                ✓ Format
              </button>
            </div>
          </div>

          {/* Preview Tab */}
          {activeTab === "preview" && (
            <>
              {/* Theme Selector */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Theme
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowThemePicker(!showThemePicker)}
                    className="text-sm px-3.5 py-1.5 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 hover:scale-[1.02] active:scale-[0.98] font-semibold transition-all duration-200 shadow-sm"
                  >
                    {showThemePicker ? "Hide" : "Change"}
                  </button>
                </div>

                {showThemePicker && (
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <ThemePicker onSelect={handleThemeSelect} />
                  </div>
                )}

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current: <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{selectedTheme}</span>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Preview
                </h2>

                {resume ? (
                  <div className="overflow-auto max-h-96 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <ResumePreview resume={resume} theme={selectedTheme} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Start filling out the form to see your resume preview
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Section */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Download
                </h2>

                <FreeDownloadButton
                  resume={resume}
                  theme={selectedTheme}
                  onValidationError={setValidationError}
                />

                {validationError && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">{validationError}</p>
                  </div>
                )}

                <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    ✅ <strong>Completely free</strong> — no watermark, no hidden charges
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ATS Check Tab */}
          {activeTab === "ats" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                ATS Compatibility Check
              </h2>
              <FreeATSChecker resume={resume} />
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === "keywords" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Keyword Analysis
              </h2>
              <FreeKeywordAnalyzer resume={resume} />
            </div>
          )}

          {/* Formatting Tab */}
          {activeTab === "formatting" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Formatting Check
              </h2>
              <FreeFormattingChecker resume={resume} />
            </div>
          )}

          {/* AI Features CTA */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🚀 Upgrade Your Resume with AI
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get AI-powered suggestions, JD matching, ATS optimization, and more advanced analysis.
            </p>
            <a
              href="/login?redirect=/analyze"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 w-full"
            >
              Explore Premium Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
