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

function ScrollToChatButton({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const [dir, setDir] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, vh);
      const visibleH = Math.max(0, visibleBottom - visibleTop);
      const ratio = rect.height > 0 ? visibleH / rect.height : 0;
      if (ratio > 0.5) setDir(null);
      else if (rect.bottom < vh / 2) setDir("up");
      else setDir("down");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetRef]);

  if (!dir) return null;

  return (
    <button
      type="button"
      onClick={() => targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
      aria-label={dir === "up" ? "Jump to chat" : "Jump to chat"}
      className="fixed right-4 bottom-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-colors"
    >
      {dir === "up" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      )}
    </button>
  );
}

export default function ChatPage() {
  const { state, isHydrated } = useResume();
  const router = useRouter();
  const chatWindowRef = useRef<HTMLElement>(null);

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

  // Land at the chat window on load/refresh instead of restoring old scroll position
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    const id = requestAnimationFrame(() => {
      const el = chatWindowRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      window.scrollTo(0, Math.max(0, window.scrollY + rect.top - 64));
    });
    return () => cancelAnimationFrame(id);
  }, []);

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
    <main ref={chatWindowRef} className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 scroll-mt-16" style={{ height: "100dvh" }}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
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
              {mode === "build" ? "Build Resume" : "Customize Resume"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <UndoButton />
          <ResetButton />
          {state.parsed && (
            <button
              type="button"
              onClick={() => router.push("/analyze")}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
        highlightRight={previewUpdated}
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
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors focus:outline-none">
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
      <ScrollToChatButton targetRef={chatWindowRef} />
    </main>
  );
}
