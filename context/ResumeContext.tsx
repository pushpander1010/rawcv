"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import type {
  ParsedResume,
  ATSResult,
  RelevanceResult,
  Suggestion,
  TailoredResume,
  ThemeId,
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
  jd: string;
  lastOperationCost: number | null;
  creditBalance: number | null;
  chatResetSignal: number; // increments on reset so ChatBot can react
  chatClearSignal: number; // increments on clear-chat so ChatBot clears messages only
  chatMessages: Array<{ role: "user" | "assistant"; content: string }>; // persisted chat history
}

interface ResumeContextValue {
  state: ResumeState;
  setState: React.Dispatch<React.SetStateAction<ResumeState>>;
  pushUndo: () => void;
  undo: () => void;
  canUndo: boolean;
  reset: () => void;
  clearChat: () => void;
  refreshCredits: () => void;
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
  jd: "",
  lastOperationCost: null,
  creditBalance: null,
  chatResetSignal: 0,
  chatClearSignal: 0,
  chatMessages: [],
};

const MAX_UNDO = 20;

function storageKey(userId: string | undefined) {
  return userId ? `rawcv_resume_state_${userId}` : null;
}

// Fields we want to persist (skip transient UI/credit fields)
const PERSIST_KEYS: (keyof ResumeState)[] = [
  "raw", "parsed", "atsResult", "relevanceResult",
  "suggestions", "enhancements", "tailoredResume", "selectedTheme", "jd",
  "chatMessages",
];

function loadPersistedState(userId: string | undefined): Partial<ResumeState> {
  try {
    const key = storageKey(userId);
    if (!key) return {};
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<ResumeState>;
    
    // Sanitize the parsed resume to ensure all fields are correct types
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

function persistState(state: ResumeState, userId: string | undefined) {
  try {
    const key = storageKey(userId);
    if (!key) return;
    const toSave: Partial<ResumeState> = {};
    for (const k of PERSIST_KEYS) {
      (toSave as Record<string, unknown>)[k] = state[k];
    }
    localStorage.setItem(key, JSON.stringify(toSave));
  } catch {
    // storage quota or SSR — ignore
  }
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [state, setStateRaw] = useState<ResumeState>(defaultState);
  const hydrated = useRef<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate from localStorage when userId is known (or changes)
  useEffect(() => {
    if (status === "loading") return;
    const key = userId ?? "__guest__";
    if (hydrated.current === key) return;
    hydrated.current = key;

    setStateRaw(defaultState);

    if (userId) {
      const saved = loadPersistedState(userId);
      if (Object.keys(saved).length > 0) {
        setStateRaw((prev) => ({ ...prev, ...saved }));
      }
    }
    setIsHydrated(true);
  }, [userId, status]);

  // Persist to localStorage whenever relevant state changes
  useEffect(() => {
    if (!hydrated.current || !userId) return;
    persistState(state, userId);
  }, [state, userId]);

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
      creditBalance: prev.creditBalance,
      chatResetSignal: prev.chatResetSignal + 1,
    }));
    if (userId) {
      try {
        const key = storageKey(userId);
        if (key) localStorage.removeItem(key);
      } catch { /* ignore */ }
    }
    // Clear server-side step/history stores
    fetch("/api/chat", { method: "DELETE" }).catch(() => {});
  }, [userId]);

  /** Clear chat messages only — keeps resume data, localStorage, and undo stack intact */
  const clearChat = useCallback(() => {
    setStateRaw((prev) => ({
      ...prev,
      chatMessages: [],
      chatClearSignal: prev.chatClearSignal + 1,
    }));
  }, []);

  // ── Credits ───────────────────────────────────────────────────────────────

  const refreshCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setState((prev) => ({ ...prev, creditBalance: data.balance }));
      }
    } catch {
      // silently ignore
    }
  }, [setState]);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  return (
    <ResumeContext.Provider value={{
      state, setState, pushUndo, undo, canUndo, reset, clearChat, refreshCredits, isHydrated,
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
