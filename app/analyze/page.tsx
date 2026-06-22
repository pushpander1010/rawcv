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
import CreditWarningBanner from "@/components/CreditWarningBanner";

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
  const { state, setState, refreshCredits } = useResume();
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
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
        <div className="relative max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 text-center overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-2xl" />
          
          <div className="relative w-40 h-40 mx-auto mb-6 rounded-2xl overflow-hidden border border-violet-100 dark:border-violet-900/30 p-1 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-gray-900 shadow-inner">
            <img
              src="/upload_illustration.png"
              alt="Upload Resume Illustration"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            No Resume Loaded
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
            Upload your CV to unlock detailed ATS checking, keyword relevance analysis, and automated bullet tailoring.
          </p>
          
          <div className="max-w-sm mx-auto">
            <ResumeUploader />
          </div>

          <div className="mt-6">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              💬 Build from Scratch
            </Link>
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
      refreshCredits();
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
      refreshCredits();
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
      refreshCredits();
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
      refreshCredits();
    } catch (e) { setEnhancementError(e instanceof Error ? (e.name === "AbortError" ? "Request timed out. Please try again." : e.message) : "Could not enhance resume. Please try again."); }
    finally { clearTimeout(timer); setEnhancementLoading(false); }
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">
              {state.parsed.contact.name ? `${state.parsed.contact.name}'s Resume` : "Resume Analysis"}
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <UndoButton />
            <ResetButton />
            <DownloadButton />
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex gap-2 px-6 py-2.5 overflow-x-auto scrollbar-hide border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50" aria-label="Analysis tools" role="tablist">
          {TABS.map((tab) => (
            <button key={tab.id} role="tab" aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20 dark:shadow-none"
                  : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}>
              <span aria-hidden="true" className="text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Body — resizable panels */}
      <CreditWarningBanner balance={state.creditBalance} />
      <ResizablePanels
        defaultLeftWidth={460}
        leftLabel="Analysis"
        rightLabel="Resume Preview"
        left={
                  <div className={activeTab === "chat" ? "flex flex-col h-full overflow-hidden" : "p-6 overflow-y-auto flex-1"}>
          {/* ATS */}
          {activeTab === "ats" && (
            <div>
              <h2 className="text-base font-semibold mb-1">ATS Compatibility Score</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Check how well your resume passes ATS filters.</p>
              {!state.atsResult && !atsLoading && (
                <button type="button" onClick={runATS} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500">Run ATS Analysis</button>
              )}
              {atsError && (
                <div role="alert" className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{atsError}</span>
                  <button onClick={runATS} className="shrink-0 text-xs underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.atsResult || atsLoading) && <ATSScoreCard result={state.atsResult ?? { score: 0, issues: [] }} loading={atsLoading} />}
              {state.atsResult && (
                <button type="button" onClick={runATS} className="mt-4 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">Re-run analysis</button>
              )}
            </div>
          )}

          {/* JD Relevance */}
          {activeTab === "relevance" && (
            <div>
              <h2 className="text-base font-semibold mb-1">Job Description Relevance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Paste a job description to see how well your resume matches.</p>
              <textarea value={jdInput} onChange={(e) => setJdInput(e.target.value)}
                placeholder="Paste the job description here…" rows={7}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 resize-none mb-4"
                aria-label="Job description input" />
              {!state.relevanceResult && !relevanceLoading && (
                <button type="button" onClick={runRelevance} disabled={!jdInput.trim()}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500">Analyze Relevance</button>
              )}
              {relevanceError && (
                <div role="alert" className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{relevanceError}</span>
                  <button onClick={runRelevance} className="shrink-0 text-xs underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.relevanceResult || relevanceLoading) && (
                <RelevanceScoreCard result={state.relevanceResult ?? { score: 0, missingKeywords: [], missingSkills: [], recommendations: [] }} loading={relevanceLoading} />
              )}
              {state.relevanceResult && (
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={runRelevance} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">Re-run</button>
                  <Link href="/tailor" className="flex-1 text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500">Tailor resume →</Link>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {activeTab === "suggestions" && (
            <div>
              <h2 className="text-base font-semibold mb-1">AI Improvement Suggestions</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Targeted suggestions covering clarity, action verbs, and completeness.</p>
              {!state.suggestions.length && !suggestionsLoading && (
                <button type="button" onClick={runSuggestions} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500">Get AI Suggestions</button>
              )}
              {suggestionsError && (
                <div role="alert" className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{suggestionsError}</span>
                  <button onClick={runSuggestions} className="shrink-0 text-xs underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.suggestions.length > 0 || suggestionsLoading) && <SuggestionsList suggestions={state.suggestions} loading={suggestionsLoading} />}
              {state.suggestions.length > 0 && (
                <button type="button" onClick={runSuggestions} className="mt-4 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">Re-run suggestions</button>
              )}
            </div>
          )}

          {/* Enhance */}
          {activeTab === "enhance" && (
            <div>
              <h2 className="text-base font-semibold mb-1">Resume Enhancement</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Strengthen bullet points and summary with stronger language.</p>
              {!state.enhancements.length && !enhancementLoading && (
                <button type="button" onClick={runEnhancement} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500">Enhance Resume</button>
              )}
              {enhancementError && (
                <div role="alert" className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{enhancementError}</span>
                  <button onClick={runEnhancement} className="shrink-0 text-xs underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.enhancements.length > 0 || enhancementLoading) && <EnhancementList enhancements={state.enhancements} loading={enhancementLoading} />}
              {state.enhancements.length > 0 && (
                <button type="button" onClick={runEnhancement} className="mt-4 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">Re-run enhancement</button>
              )}
            </div>
          )}

          {/* Theme */}
          {activeTab === "theme" && (
            <div>
              <h2 className="text-base font-semibold mb-1">Theme</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Pick a visual style for your resume.</p>
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
