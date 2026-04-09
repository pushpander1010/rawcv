"use client";

import { useState } from "react";
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
import ChatBot from "@/components/ChatBot";
import type { ATSResult, RelevanceResult, Suggestion } from "@/types";
import ResizablePanels from "@/components/ResizablePanels";

type Tab = "ats" | "relevance" | "suggestions" | "enhance" | "theme";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "ats",         label: "ATS Score",    icon: "📊" },
  { id: "relevance",   label: "JD Match",     icon: "🎯" },
  { id: "suggestions", label: "Suggestions",  icon: "✨" },
  { id: "enhance",     label: "Enhance",      icon: "🔧" },
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
  const [enhancements, setEnhancements] = useState<Suggestion[]>([]);
  const [enhancementLoading, setEnhancementLoading] = useState(false);
  const [enhancementError, setEnhancementError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

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
      if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? "ATS analysis failed"); }
      const result = await res.json();
      setState((prev) => ({ ...prev, atsResult: result }));
    } catch (e) { setAtsError(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setAtsLoading(false); }
  }

  async function runRelevance() {
    if (!jdInput.trim()) return;
    setRelevanceLoading(true); setRelevanceError(null);
    setState((prev) => ({ ...prev, jd: jdInput }));
    try {
      const res = await fetch("/api/relevance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, jd: jdInput, model: state.selectedModel }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? "Relevance analysis failed"); }
      const result = await res.json();
      setState((prev) => ({ ...prev, relevanceResult: result }));
    } catch (e) { setRelevanceError(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setRelevanceLoading(false); }
  }

  async function runSuggestions() {
    setSuggestionsLoading(true); setSuggestionsError(null);
    try {
      const res = await fetch("/api/suggestions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, model: state.selectedModel }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? "Suggestions failed"); }
      const result = await res.json();
      setState((prev) => ({ ...prev, suggestions: result }));
    } catch (e) { setSuggestionsError(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setSuggestionsLoading(false); }
  }

  async function runEnhancement() {
    setEnhancementLoading(true); setEnhancementError(null);
    try {
      const res = await fetch("/api/enhance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed, model: state.selectedModel }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? "Enhancement failed"); }
      const result = await res.json();
      setEnhancements(result);
    } catch (e) { setEnhancementError(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setEnhancementLoading(false); }
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
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
            <DownloadButton />
            <button type="button" onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500">
              <span aria-hidden="true">💬</span>
              <span className="hidden sm:inline">Chat</span>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex gap-1 px-6 overflow-x-auto scrollbar-hide" aria-label="Analysis tools" role="tablist">
          {TABS.map((tab) => (
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
      <ResizablePanels
        defaultLeftWidth={460}
        leftLabel="Analysis"
        rightLabel="Resume Preview"
        left={
          <div className="p-6">
          {/* ATS */}
          {activeTab === "ats" && (
            <div>
              <h2 className="text-base font-semibold mb-1">ATS Compatibility Score</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Check how well your resume passes ATS filters.</p>
              {!state.atsResult && !atsLoading && (
                <button type="button" onClick={runATS} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">Run ATS Analysis</button>
              )}
              {atsError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{atsError}</p>}
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
              {relevanceError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{relevanceError}</p>}
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
              {suggestionsError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{suggestionsError}</p>}
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
              {!enhancements.length && !enhancementLoading && (
                <button type="button" onClick={runEnhancement} className="w-full px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-colors">Enhance Resume</button>
              )}
              {enhancementError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{enhancementError}</p>}
              {(enhancements.length > 0 || enhancementLoading) && <EnhancementList enhancements={enhancements} loading={enhancementLoading} />}
              {enhancements.length > 0 && (
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
          </div>
        }
        right={
          <div className="p-6">
            <ResumePreview resume={state.parsed} theme={state.selectedTheme} />
          </div>
        }
      />

      {/* Chat slide-in */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setChatOpen(false)} aria-hidden="true" />
          <div className="relative flex flex-col w-full max-w-md h-full bg-white dark:bg-gray-950 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base font-semibold">💬 Chat to customize</h2>
              <button type="button" onClick={() => setChatOpen(false)} aria-label="Close chat"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-h-0"><ChatBot mode="customize" onComplete={() => setChatOpen(false)} /></div>
          </div>
        </div>
      )}
    </main>
  );
}
