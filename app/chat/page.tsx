"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import ChatBot from "@/components/ChatBot";
import ResumePreview from "@/components/ResumePreview";
import ModelSelector from "@/components/ModelSelector";
import ThemePicker from "@/components/ThemePicker";
import ResizablePanels from "@/components/ResizablePanels";

export default function ChatPage() {
  const { state } = useResume();
  const router = useRouter();
  const [mode] = useState<"build" | "customize">(
    state.parsed ? "customize" : "build"
  );
  const [showThemePicker, setShowThemePicker] = useState(false);

  function handleComplete() {
    // Resume is already synced to context via ChatBot — just navigate
    router.push("/analyze");
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden" style={{ height: "100dvh" }}>
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between gap-4 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {mode === "build" ? "Build Resume with AI" : "Customize Resume with AI"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-52">
            <ModelSelector />
          </div>
          {state.parsed && (
            <button
              type="button"
              onClick={() => router.push("/analyze")}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        rightLabel="Resume Preview"
        left={
          <div className="flex flex-col h-full">
            <ChatBot mode={mode} onComplete={handleComplete} onEnd={() => router.back()} hideModelSelector />
          </div>
        }
        right={
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Live Preview</h2>
              <button type="button" onClick={() => setShowThemePicker((v) => !v)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus:outline-none">
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
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-600 gap-3">
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
