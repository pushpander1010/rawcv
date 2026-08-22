"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import ResumeUploader from "@/components/ResumeUploader";
import ATSScoreCard from "@/components/ATSScoreCard";
import RelevanceScoreCard from "@/components/RelevanceScoreCard";
import SuggestionsList from "@/components/SuggestionsList";
import EnhancementList from "@/components/EnhancementList";
import ThemePicker from "@/components/ThemePicker";
import ResumePreview from "@/components/ResumePreview";
import DownloadButton from "@/components/DownloadButton";
import ChatBot from "@/components/ChatBot";import type { ATSResult, RelevanceResult, Suggestion } from "@/types";
import ResizablePanels from "@/components/ResizablePanels";
import UndoButton from "@/components/UndoButton";
import ResetButton from "@/components/ResetButton";
import AdBanner from "@/components/AdBanner";

type Tab = "ats" | "relevance" | "suggestions" | "enhance" | "theme" | "chat";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "ats",         label: "ATS Score",    icon: "📊" },
  { id: "relevance",   label: "JD Match",     icon: "🎯" },
  { id: "suggestions", label: "Suggestions",  icon: "✨" },
  { id: "enhance",     label: "Enhance",      icon: "🔧" },
  { id: "chat",        label: "User Input",   icon: "💬" },
  { id: "theme",       label: "Theme",        icon: "🎨" },
];

export default function AnalyzePage() {
  const { state, setState } = useResume();
  const [activeTab, setActiveTab] = useState<Tab>("ats");
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState<string | null>(null);
  const [jdInput, setJdInput] = useState(state.jd ?? "");
  const [relevanceLoading, setRelevanceLoading] = useState(false);
  const [relevanceError, setRelevanceError] = useState<string | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
  const [enhancementLoading, setEnhancementLoading] = useState(false);
  const [enhancementError, setEnhancementError] = useState<string | null>(null);

  // Sync jdInput when persisted jd rehydrates after mount
  useEffect(() => {
    if (state.jd && !jdInput) setJdInput(state.jd);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.jd]);

  if (!state.parsed) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200/60 dark:border-gray-800/60 p-12 text-center overflow-hidden">
          
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-100 dark:from-brand-900/30 dark:to-brand-900/30 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-brand-600 dark:text-brand-400">
                <path d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Upload your resume to get started
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              PDF, DOCX, or TXT · max 5 MB
            </p>
            
            <ResumeUploader />

            <div className="mt-6 flex items-center gap-4 justify-center">
              <span className="h-px w-12 bg-gray-200 dark:bg-gray-700" />
              <Link href="/chat" className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
                Or build from scratch with AI →
              </Link>
              <span className="h-px w-12 bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  async function runATS() {
    setAtsLoading(true); setAtsError(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch("/api/ats", { method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, raw: state.raw }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "ATS analysis failed");
      setState((prev) => ({ ...prev, atsResult: data }));
    } catch (e) { setAtsError(e instanceof Error ? (e.name === "AbortError" ? "Request timed out. Please try again." : e.message) : "ATS analysis failed. Please try again."); }
    finally { clearTimeout(timer); setAtsLoading(false); }
  }

  async function runRelevance() {
    if (!jdInput.trim()) return;
    setRelevanceLoading(true); setRelevanceError(null);
    setState((prev) => ({ ...prev, jd: jdInput }));
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch("/api/relevance", { method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, jd: jdInput }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Relevance analysis failed");
      setState((prev) => ({ ...prev, relevanceResult: data }));
    } catch (e) { setRelevanceError(e instanceof Error ? (e.name === "AbortError" ? "Request timed out. Please try again." : e.message) : "Relevance analysis failed. Please try again."); }
    finally { clearTimeout(timer); setRelevanceLoading(false); }
  }

  async function runSuggestions() {
    setSuggestionsLoading(true); setSuggestionsError(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch("/api/suggestions", { method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Suggestions failed");
      setState((prev) => ({ ...prev, suggestions: data }));
    } catch (e) { setSuggestionsError(e instanceof Error ? (e.name === "AbortError" ? "Request timed out. Please try again." : e.message) : "Could not generate suggestions. Please try again."); }
    finally { clearTimeout(timer); setSuggestionsLoading(false); }
  }

  async function runEnhancement() {
    setEnhancementLoading(true); setEnhancementError(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch("/api/enhance", { method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Enhancement failed");
      setState((prev) => ({ ...prev, enhancements: data }));
    } catch (e) { setEnhancementError(e instanceof Error ? (e.name === "AbortError" ? "Request timed out. Please try again." : e.message) : "Could not enhance resume. Please try again."); }
    finally { clearTimeout(timer); setEnhancementLoading(false); }
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold truncate text-gray-900 dark:text-gray-100">
                {state.parsed.contact.name || "Resume Analysis"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <UndoButton />
            <ResetButton />
            <DownloadButton />
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900" aria-label="Analysis tools" role="tablist">
          {TABS.map((tab) => (
            <button key={tab.id} role="tab" aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}>
              <span aria-hidden="true" className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Body — resizable panels */}
      <ResizablePanels
        defaultLeftWidth={560}
        leftLabel="Analysis"
        rightLabel="Resume Preview"
        left={
                  <div className={activeTab === "chat" ? "flex flex-col h-full overflow-hidden" : "p-6 overflow-y-auto flex-1"}>
          {/* ATS */}
          {activeTab === "ats" && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-lg">📊</div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">ATS Score</h2>
                </div>
                {!state.atsResult && !atsLoading && (
                  <button type="button" onClick={runATS} className="w-full px-5 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    Run ATS Analysis
                  </button>
                )}
              </div>
              {atsError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0 text-lg">⚠</span>
                  <span className="flex-1">{atsError}</span>
                  <button onClick={runATS} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.atsResult || atsLoading) && <ATSScoreCard result={state.atsResult ?? { score: 0, issues: [] }} loading={atsLoading} />}
              {state.atsResult && (
                <button type="button" onClick={runATS} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                  Re-run analysis
                </button>
              )}
            </div>
          )}

          {/* JD Relevance */}
          {activeTab === "relevance" && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-lg">🎯</div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Job Match</h2>
                </div>
                <textarea value={jdInput} onChange={(e) => setJdInput(e.target.value)}
                  placeholder="Paste the job description here…" rows={6}
                  className="w-full rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none mb-4"
                  aria-label="Job description input" />
                {!state.relevanceResult && !relevanceLoading && (
                  <button type="button" onClick={runRelevance} disabled={!jdInput.trim()}
                    className="w-full px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Analyze Relevance
                  </button>
                )}
              </div>
              {relevanceError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0 text-lg">⚠</span>
                  <span className="flex-1">{relevanceError}</span>
                  <button onClick={runRelevance} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.relevanceResult || relevanceLoading) && (
                <RelevanceScoreCard result={state.relevanceResult ?? { score: 0, missingKeywords: [], missingSkills: [], recommendations: [] }} loading={relevanceLoading} />
              )}
              {state.relevanceResult && (
                <div className="flex gap-3">
                  <button type="button" onClick={runRelevance} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">Re-run</button>
                  <Link href="/tailor" className="flex-1 text-center px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500">Tailor resume →</Link>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {activeTab === "suggestions" && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-lg">✨</div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Suggestions</h2>
                </div>
                {!state.suggestions.length && !suggestionsLoading && (
                  <button type="button" onClick={runSuggestions} className="w-full px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    Get AI Suggestions
                  </button>
                )}
              </div>
              {suggestionsError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0 text-lg">⚠</span>
                  <span className="flex-1">{suggestionsError}</span>
                  <button onClick={runSuggestions} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.suggestions.length > 0 || suggestionsLoading) && <SuggestionsList suggestions={state.suggestions} loading={suggestionsLoading} />}
              {state.suggestions.length > 0 && (
                <button type="button" onClick={runSuggestions} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                  Re-run suggestions
                </button>
              )}
            </div>
          )}

          {/* Enhance */}
          {activeTab === "enhance" && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-lg">🔧</div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Enhance</h2>
                </div>
                {!state.enhancements.length && !enhancementLoading && (
                  <button type="button" onClick={runEnhancement} className="w-full px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    Enhance Resume
                  </button>
                )}
              </div>
              {enhancementError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-4 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0 text-lg">⚠</span>
                  <span className="flex-1">{enhancementError}</span>
                  <button onClick={runEnhancement} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.enhancements.length > 0 || enhancementLoading) && <EnhancementList enhancements={state.enhancements} loading={enhancementLoading} />}
              {state.enhancements.length > 0 && (
                <button type="button" onClick={runEnhancement} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
                  Re-run enhancement
                </button>
              )}
            </div>
          )}

          {/* Theme */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-lg">🎨</div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Theme</h2>
                </div>
              </div>
              <ThemePicker />
            </div>
          )}

          {/* User Input chat */}
          {activeTab === "chat" && (
            <ChatBot
              mode="customize"
              onEnd={() => setActiveTab("ats")}
            />
          )}
          </div>
        }
        right={
          <div className="p-6">
            <ResumePreview resume={state.parsed} theme={state.selectedTheme} />
          </div>
        }
      />

    </main>
  );
}
