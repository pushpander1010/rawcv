"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import ChatBot from "@/components/ChatBot";
import ResumePreview from "@/components/ResumePreview";
import ThemePicker from "@/components/ThemePicker";
import ResizablePanels from "@/components/ResizablePanels";
import UndoButton from "@/components/UndoButton";
import ResetButton from "@/components/ResetButton";

export default function ChatPage() {
  const { state, isHydrated } = useResume();
  const router = useRouter();

  // Lock mode after hydration is complete so we read the persisted resume state,
  // not the default null. Without waiting for isHydrated, mode always locks to
  // "build" because state.parsed is null before localStorage is loaded.
  // Also re-evaluate mode when the user resets (chatResetSignal changes) so
  // "build from scratch" after a reset correctly switches back to build mode.
  const [mode, setMode] = useState<"build" | "customize">("build");
  const modeLocked = useRef(false);
  const lastResetSignal = useRef(state.chatResetSignal);
  useEffect(() => {
    if (!isHydrated) return;          // wait until localStorage is loaded

    const resetFired = state.chatResetSignal !== lastResetSignal.current;
    if (resetFired) {
      // Reset always means build from scratch
      lastResetSignal.current = state.chatResetSignal;
      modeLocked.current = false;
    }

    if (modeLocked.current) return;
    modeLocked.current = true;
    setMode(state.parsed ? "customize" : "build");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, state.parsed, state.chatResetSignal]);

  const [showThemePicker, setShowThemePicker] = useState(false);

  // Track preview updates so mobile tab can show a "updated" badge
  const [previewUpdated, setPreviewUpdated] = useState(false);
  const prevParsedRef = useRef(state.parsed);
  useEffect(() => {
    if (state.parsed !== prevParsedRef.current) {
      prevParsedRef.current = state.parsed;
      setPreviewUpdated(true);
    }
  }, [state.parsed]);

  function handleComplete() {
    router.push("/analyze");
  }

  const rightLabel = (
    <span className="flex items-center gap-1.5">
      Resume Preview
      {previewUpdated && (
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-label="Preview updated" />
      )}
    </span>
  );

  return (
    <main className="h-screen flex flex-col overflow-hidden" style={{ height: "100dvh" }}>
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-400/8 rounded-full blur-[100px] orb-1" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400/8 rounded-full blur-[80px] orb-2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-400/6 rounded-full blur-[90px] orb-3" />
        <div className="absolute inset-0 bg-dots opacity-40" />
      </div>

      {/* Header */}
      <header className="border-b border-gray-200/40 dark:border-gray-800/40 px-6 py-3 flex items-center justify-between gap-4 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {mode === "build" ? "Build Resume with AI" : "Customize Resume"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mode === "build" ? "Tell the AI about your experience" : "Ask AI to modify any section"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <UndoButton />
          <ResetButton />
          {state.parsed && (
            <button
              type="button"
              onClick={() => router.push("/analyze")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              View Analysis
            </button>
          )}
        </div>
      </header>

      {/* Body — resizable chat + preview */}
      <ResizablePanels
        defaultLeftWidth={420}
        leftLabel="Chat"
        rightLabel={rightLabel as unknown as string}
        onRightTabClick={() => setPreviewUpdated(false)}
        left={
          <div className="flex flex-col h-full">
            <ChatBot mode={mode} onComplete={handleComplete} onEnd={() => router.back()} />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Live Preview</h2>
              <button type="button" onClick={() => setShowThemePicker((v) => !v)}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors focus:outline-none">
                {showThemePicker ? "Hide themes" : "Change theme"}
              </button>
            </div>
            {showThemePicker && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex-shrink-0">
                <ThemePicker />
              </div>
            )}
            <div className="flex-1 overflow-auto p-4">
              {state.parsed ? (
                <ResumePreview resume={state.parsed} theme={state.selectedTheme} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 gap-3">
                  <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Your resume preview will appear here as you chat.</p>
                </div>
              )}
            </div>
          </div>
        }
      />
    </main>
  );
}
