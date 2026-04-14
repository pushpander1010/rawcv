"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import ModelSelector from "@/components/ModelSelector";
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
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <p className="text-5xl mb-4" aria-hidden="true">📄</p>
          <h1 className="text-xl font-semibold mb-2">No resume loaded</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            Upload a resume to start analyzing, or build one from scratch with the chat interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
              ↑ Upload a resume
            </Link>
            <Link href="/chat" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              💬 Build from scratch
            </Link>
          </div>
        </div>
      </main>
    );
  }

  async function runATS() {
    setAtsLoading(true); setAtsError(null);
    try {
      const res = await fetch("/api/ats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, raw: state.raw, model: state.selectedModel }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "ATS analysis failed");
      setState((prev) => ({ ...prev, atsResult: data }));
      refreshCredits();
    } catch (e) { setAtsError(e instanceof Error ? e.message : "ATS analysis failed. Please try again."); }
    finally { setAtsLoading(false); }
  }

  async function runRelevance() {
    if (!jdInput.trim()) return;
    setRelevanceLoading(true); setRelevanceError(null);
    setState((prev) => ({ ...prev, jd: jdInput }));
    try {
      const res = await fetch("/api/relevance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, jd: jdInput, model: state.selectedModel }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Relevance analysis failed");
      setState((prev) => ({ ...prev, relevanceResult: data }));
      refreshCredits();
    } catch (e) { setRelevanceError(e instanceof Error ? e.message : "Relevance analysis failed. Please try again."); }
    finally { setRelevanceLoading(false); }
  }

  async function runSuggestions() {
    setSuggestionsLoading(true); setSuggestionsError(null);
    try {
      const res = await fetch("/api/suggestions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, model: state.selectedModel }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Suggestions failed");
      setState((prev) => ({ ...prev, suggestions: data }));
      refreshCredits();
    } catch (e) { setSuggestionsError(e instanceof Error ? e.message : "Could not generate suggestions. Please try again."); }
    finally { setSuggestionsLoading(false); }
  }

  async function runEnhancement() {
    setEnhancementLoading(true); setEnhancementError(null);
    try {
      const res = await fetch("/api/enhance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, model: state.selectedModel }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Enhancement failed");
      setState((prev) => ({ ...prev, enhancements: data }));
      refreshCredits();
    } catch (e) { setEnhancementError(e instanceof Error ? e.message : "Could not enhance resume. Please try again."); }
    finally { setEnhancementLoading(false); }
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
            <div className="w-44"><ModelSelector label="Model" /></div>
            <UndoButton />
            <ResetButton />
            <DownloadButton />
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex gap-1 px-6 overflow-x-auto scrollbar-hide" aria-label="Analysis tools" role="tablist">          {TABS.map((tab) => (
            <button key={tab.id} role="tab" aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500 ${
                activeTab === tab.id
                  ? "border-violet-600 text-violet-600 dark:text-violet-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300"
              }`}>
              <span aria-hidden="true">{tab.icon}</span>{tab.label}
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
          <div className={activeTab === "chat" ? "flex flex-col h-full" : "p-6"}>
          {/* ATS */}
          {activeTab === "ats" && (
            <div>
              <h2 className="text-base font-semibold mb-1">ATS Compatibility Score</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Check how well your resume passes ATS filters.</p>
              {!state.atsResult && !atsLoading && (
                <button type="button" onClick={runATS} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">Run ATS Analysis</button>
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
                <button type="button" onClick={runATS} className="mt-4 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Re-run analysis</button>
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
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
                aria-label="Job description input" />
              {!state.relevanceResult && !relevanceLoading && (
                <button type="button" onClick={runRelevance} disabled={!jdInput.trim()}
                  className="w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium text-sm transition-colors">Analyze Relevance</button>
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
                  <button type="button" onClick={runRelevance} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Re-run</button>
                  <Link href="/tailor" className="flex-1 text-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">Tailor resume →</Link>
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
                <button type="button" onClick={runSuggestions} className="w-full px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors">Get AI Suggestions</button>
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
                <button type="button" onClick={runSuggestions} className="mt-4 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Re-run suggestions</button>
              )}
            </div>
          )}

          {/* Enhance */}
          {activeTab === "enhance" && (
            <div>
              <h2 className="text-base font-semibold mb-1">Resume Enhancement</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Strengthen bullet points and summary with stronger language.</p>
              {!state.enhancements.length && !enhancementLoading && (
                <button type="button" onClick={runEnhancement} className="w-full px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-colors">Enhance Resume</button>
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
                <button type="button" onClick={runEnhancement} className="mt-4 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Re-run enhancement</button>
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
              hideModelSelector
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
