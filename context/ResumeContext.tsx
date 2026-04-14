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
  ModelId,
} from "@/types";

export interface ResumeState {
  raw: string;
  parsed: ParsedResume | null;
  atsResult: ATSResult | null;
  relevanceResult: RelevanceResult | null;
  suggestions: Suggestion[];
  enhancements: Suggestion[];
  tailoredResume: TailoredResume | null;
  selectedTheme: ThemeId;
  selectedModel: ModelId;
  jd: string;
  lastOperationCost: number | null;
  creditBalance: number | null;
}

interface ResumeContextValue {
  state: ResumeState;
  setState: React.Dispatch<React.SetStateAction<ResumeState>>;
  pushUndo: () => void;
  undo: () => void;
  canUndo: boolean;
  reset: () => void;
  refreshCredits: () => void;
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
  selectedModel: "openrouter-mistral-small",
  jd: "",
  lastOperationCost: null,
  creditBalance: null,
};

const MAX_UNDO = 20;

function storageKey(userId: string | undefined) {
  return userId ? `rawcv_resume_state_${userId}` : null;
}

// Fields we want to persist (skip transient UI/credit fields)
const PERSIST_KEYS: (keyof ResumeState)[] = [
  "raw", "parsed", "atsResult", "relevanceResult",
  "suggestions", "enhancements", "tailoredResume", "selectedTheme", "selectedModel", "jd",
];

function loadPersistedState(userId: string | undefined): Partial<ResumeState> {
  try {
    const key = storageKey(userId);
    if (!key) return {};
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<ResumeState>;
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
  const hydrated = useRef<string | null>(null); // tracks which userId we've hydrated for

  // Rehydrate from localStorage when userId is known (or changes)
  useEffect(() => {
    if (status === "loading") return; // wait until session is resolved
    const key = userId ?? "__guest__";
    if (hydrated.current === key) return;
    hydrated.current = key;

    // Clear state first so previous user's data doesn't flash
    setStateRaw(defaultState);

    if (userId) {
      const saved = loadPersistedState(userId);
      if (Object.keys(saved).length > 0) {
        setStateRaw((prev) => ({ ...prev, ...saved }));
      }
    }
  }, [userId, status]);

  // Persist to localStorage whenever relevant state changes (only for logged-in users)
  useEffect(() => {
    if (!hydrated.current || !userId) return;
    persistState(state, userId);
  }, [state, userId]);

  // Wrap setState so persistence fires through the same path
  const setState: React.Dispatch<React.SetStateAction<ResumeState>> = useCallback((action) => {
    setStateRaw((prev) => {
      const next = typeof action === "function" ? action(prev) : action;
      return next;
    });
  }, []);
  // Stack of previous parsed resumes for undo
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
    // Keep model/theme preferences, wipe resume data
    setStateRaw((prev) => ({
      ...defaultState,
      selectedModel: prev.selectedModel,
      selectedTheme: prev.selectedTheme,
      creditBalance: prev.creditBalance,
    }));
    // Clear persisted storage for this user
    if (userId) {
      try {
        const key = storageKey(userId);
        if (key) localStorage.removeItem(key);
      } catch { /* ignore */ }
    }
  }, [userId]);

  const refreshCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setState((prev) => ({ ...prev, creditBalance: data.balance }));
      }
    } catch {
      // silently ignore — credits will show on next successful fetch
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  return (
    <ResumeContext.Provider value={{ state, setState, pushUndo, undo, canUndo, reset, refreshCredits }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
