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
import Icon, { type IconName } from "@/components/Icon";

type Tab = "ats" | "relevance" | "suggestions" | "enhance" | "theme" | "chat";

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "ats",         label: "ATS Score",    icon: "score" },
  { id: "relevance",   label: "JD Match",     icon: "target" },
  { id: "suggestions", label: "Suggestions",  icon: "sparkles" },
  { id: "enhance",     label: "Enhance",      icon: "trend" },
  { id: "chat",        label: "User Input",   icon: "chat" },
  { id: "theme",       label: "Theme",        icon: "layers" },
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
      <main className="bg-slate-50 px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-[560px] mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5 text-blue-600">
              <Icon name="upload" size={22} />
            </div>
            <h2 className="text-[18px] font-bold text-slate-900">Upload your resume to get started</h2>
            <p className="text-[13.5px] text-slate-500 mt-1.5 mb-6">PDF, DOCX, or TXT · max 5 MB</p>
            <ResumeUploader />
            <div className="mt-6 flex items-center gap-3 justify-center">
              <span className="h-px w-10 bg-slate-200" />
              <Link href="/chat" className="text-[13.5px] text-blue-600 font-medium hover:underline">
                Or build from scratch with AI →
              </Link>
              <span className="h-px w-10 bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  async function runATS() {
    setAtsLoading(true); setAtsError(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60000);
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
    const timer = setTimeout(() => ctrl.abort(), 60000);
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
    const timer = setTimeout(() => ctrl.abort(), 60000);
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
    const timer = setTimeout(() => ctrl.abort(), 90000);
    try {
      const res = await fetch("/api/enhance", { method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parsed: state.parsed }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Enhancement failed");
      setState((prev) => ({ ...prev, enhancements: data }));
    } catch (e) { setEnhancementError(e instanceof Error ? (e.name === "AbortError" ? "Request timed out. Please try again." : e.message) : "Could not enhance resume. Please try again."); }
    finally { clearTimeout(timer); setEnhancementLoading(false); }
  }

  return (
    <main className="flex flex-col overflow-hidden bg-slate-50" style={{ height: "calc(100dvh - 64px)" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-[14px] font-semibold truncate text-slate-900">
                {state.parsed.contact.name || "Resume Analysis"}
              </h2>
              <p className="text-[12px] text-slate-500 truncate hidden sm:block">ATS &amp; job match tools</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <UndoButton />
            <ResetButton />
            <DownloadButton />
          </div>
        </div>

        {/* Tab bar */}
        <nav className="flex gap-1.5 px-3 sm:px-4 py-2.5 overflow-x-auto scrollbar-hide border-t border-slate-100 bg-slate-50" aria-label="Analysis tools" role="tablist">
          {TABS.map((tab) => (
            <button key={tab.id} role="tab" aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium whitespace-nowrap rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200"
              }`}>
              <Icon name={tab.icon} size={14} />
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
                  <div className={activeTab === "chat" ? "flex flex-col h-full overflow-hidden bg-white" : "p-4 sm:p-6 overflow-y-auto flex-1 bg-white"}>
          {/* ATS */}
          {activeTab === "ats" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600"><Icon name="score" size={16} /></div>
                  <h2 className="text-[15px] font-semibold text-slate-900">ATS Score</h2>
                </div>
                {!state.atsResult && !atsLoading && (
                  <button type="button" onClick={runATS} className="w-full px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Run ATS Analysis
                  </button>
                )}
              </div>
              {atsError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{atsError}</span>
                  <button onClick={runATS} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.atsResult || atsLoading) && <ATSScoreCard result={state.atsResult ?? { score: 0, issues: [] }} loading={atsLoading} />}
              {state.atsResult && (
                <button type="button" onClick={runATS} className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-[13.5px] text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Re-run analysis
                </button>
              )}
            </div>
          )}

          {/* JD Relevance */}
          {activeTab === "relevance" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600"><Icon name="target" size={16} /></div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Job Match</h2>
                </div>
                <textarea value={jdInput} onChange={(e) => setJdInput(e.target.value)}
                  placeholder="Paste the job description here…" rows={6}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none mb-3"
                  aria-label="Job description input" />
                {!state.relevanceResult && !relevanceLoading && (
                  <button type="button" onClick={runRelevance} disabled={!jdInput.trim()}
                    className="w-full px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Analyze Relevance
                  </button>
                )}
              </div>
              {relevanceError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{relevanceError}</span>
                  <button onClick={runRelevance} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.relevanceResult || relevanceLoading) && (
                <RelevanceScoreCard result={state.relevanceResult ?? { score: 0, missingKeywords: [], missingSkills: [], recommendations: [] }} loading={relevanceLoading} />
              )}
              {state.relevanceResult && (
                <div className="flex gap-2">
                  <button type="button" onClick={runRelevance} className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-[13.5px] text-slate-700 font-medium hover:bg-slate-50 transition-colors">Re-run</button>
                  <Link href="/tailor" className="flex-1 text-center px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[13.5px] font-semibold transition-colors">Tailor resume →</Link>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {activeTab === "suggestions" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600"><Icon name="sparkles" size={16} /></div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Suggestions</h2>
                </div>
                {!state.suggestions.length && !suggestionsLoading && (
                  <button type="button" onClick={runSuggestions} className="w-full px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900">
                    Get AI Suggestions
                  </button>
                )}
              </div>
              {suggestionsError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{suggestionsError}</span>
                  <button onClick={runSuggestions} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.suggestions.length > 0 || suggestionsLoading) && <SuggestionsList suggestions={state.suggestions} loading={suggestionsLoading} />}
              {state.suggestions.length > 0 && (
                <button type="button" onClick={runSuggestions} className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-[13.5px] text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Re-run suggestions
                </button>
              )}
            </div>
          )}

          {/* Enhance */}
          {activeTab === "enhance" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Icon name="trend" size={16} /></div>
                  <h2 className="text-[15px] font-semibold text-slate-900">Enhance</h2>
                </div>
                {!state.enhancements.length && !enhancementLoading && (
                  <button type="button" onClick={runEnhancement} className="w-full px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[14px] transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    Enhance Resume
                  </button>
                )}
              </div>
              {enhancementError && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[13.5px] text-red-700">
                  <span className="shrink-0">⚠</span>
                  <span className="flex-1">{enhancementError}</span>
                  <button onClick={runEnhancement} className="shrink-0 text-xs font-medium underline hover:no-underline">Retry</button>
                </div>
              )}
              {(state.enhancements.length > 0 || enhancementLoading) && <EnhancementList enhancements={state.enhancements} loading={enhancementLoading} />}
              {state.enhancements.length > 0 && (
                <button type="button" onClick={runEnhancement} className="w-full px-4 py-2.5 rounded-full border border-slate-200 bg-white text-[13.5px] text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Re-run enhancement
                </button>
              )}
            </div>
          )}

          {/* Theme */}
          {activeTab === "theme" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"><Icon name="layers" size={16} /></div>
                <h2 className="text-[15px] font-semibold text-slate-900">Theme</h2>
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
          <div className="p-4 sm:p-6 bg-slate-50">
            <ResumePreview resume={state.parsed} theme={state.selectedTheme} />
          </div>
        }
      />
    </main>
  );
}
