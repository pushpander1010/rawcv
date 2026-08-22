"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type {
  ParsedResume,
  ATSResult,
  RelevanceResult,
  Suggestion,
  TailoredResume,
  ThemeId,
  CoverLetter,
  ResumeFormat,
} from "@/types";
import { sanitizeResume } from "@/lib/sanitize-resume";

export interface ResumeState {
  raw: string;
  parsed: ParsedResume | null;
  atsResult: ATSResult | null;
  relevanceResult: RelevanceResult | null;
  suggestions: Suggestion[];
  enhancements: Suggestion[];
  tailoredResume: TailoredResume | null;
  selectedTheme: ThemeId;
  selectedFormat: ResumeFormat;
  jd: string;
  lastOperationCost: number | null;
  chatResetSignal: number;
  chatClearSignal: number;
  chatMessages: Array<{ role: "user" | "assistant"; content: string }>;
  coverLetters: CoverLetter[];
  userPhoto: string | null;
}

interface ResumeContextValue {
  state: ResumeState;
  setState: React.Dispatch<React.SetStateAction<ResumeState>>;
  pushUndo: () => void;
  undo: () => void;
  canUndo: boolean;
  reset: () => void;
  clearChat: () => void;
  isHydrated: boolean;
}

const defaultState: ResumeState = {
  raw: "",
  parsed: null,
  atsResult: null,
  relevanceResult: null,
  suggestions: [],
  enhancements: [],
  tailoredResume: null,
  selectedTheme: "classic",
  selectedFormat: "general",
  jd: "",
  lastOperationCost: null,
  chatResetSignal: 0,
  chatClearSignal: 0,
  chatMessages: [],
  coverLetters: [],
  userPhoto: null,
};

const MAX_UNDO = 20;
const STORAGE_KEY = "rawcv_resume_state";

const PERSIST_KEYS: (keyof ResumeState)[] = [
  "raw", "parsed", "atsResult", "relevanceResult",
  "suggestions", "enhancements", "tailoredResume", "selectedTheme", "selectedFormat", "jd",
  "chatMessages", "coverLetters", "userPhoto",
];

function loadPersistedState(): Partial<ResumeState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<ResumeState>;
    if (parsed.parsed) {
      parsed.parsed = sanitizeResume(parsed.parsed);
    }
    if (parsed.tailoredResume?.finalResume) {
      parsed.tailoredResume.finalResume = sanitizeResume(parsed.tailoredResume.finalResume);
    }
    return parsed;
  } catch {
    return {};
  }
}

function persistState(state: ResumeState) {
  try {
    const toSave: Partial<ResumeState> = {};
    for (const k of PERSIST_KEYS) {
      (toSave as Record<string, unknown>)[k] = state[k];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // storage quota or SSR — ignore
  }
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<ResumeState>(defaultState);
  const hydrated = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const saved = loadPersistedState();
    if (Object.keys(saved).length > 0) {
      setStateRaw((prev) => ({ ...prev, ...saved }));
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage whenever relevant state changes
  useEffect(() => {
    if (!hydrated.current) return;
    persistState(state);
  }, [state]);

  const setState: React.Dispatch<React.SetStateAction<ResumeState>> = useCallback((action) => {
    setStateRaw((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      return next;
    });
  }, []);

  // Undo stack
  const undoStack = useRef<ParsedResume[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const pushUndo = useCallback(() => {
    setStateRaw((prev) => {
      if (prev.parsed) {
        undoStack.current = [
          ...undoStack.current.slice(-MAX_UNDO + 1),
          JSON.parse(JSON.stringify(prev.parsed)),
        ];
        setCanUndo(true);
      }
      return prev;
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const previous = undoStack.current[undoStack.current.length - 1];
    undoStack.current = undoStack.current.slice(0, -1);
    setCanUndo(undoStack.current.length > 0);
    setStateRaw((prev) => ({ ...prev, parsed: previous }));
  }, []);

  const reset = useCallback(() => {
    undoStack.current = [];
    setCanUndo(false);
    setStateRaw((prev) => ({
      ...defaultState,
      selectedTheme: prev.selectedTheme,
      chatResetSignal: prev.chatResetSignal + 1,
    }));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
    fetch("/api/chat", { method: "DELETE" }).catch(() => {});
  }, []);

  const clearChat = useCallback(() => {
    setStateRaw((prev) => ({
      ...prev,
      chatMessages: [],
      chatClearSignal: prev.chatClearSignal + 1,
    }));
  }, []);

  return (
    <ResumeContext.Provider value={{
      state, setState, pushUndo, undo, canUndo, reset, clearChat, isHydrated,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
