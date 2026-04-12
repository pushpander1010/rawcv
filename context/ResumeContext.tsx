"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
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
  /** Push the current parsed resume onto the undo stack before making a change */
  pushUndo: () => void;
  /** Undo the last resume change */
  undo: () => void;
  /** Whether there is anything to undo */
  canUndo: boolean;
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
  selectedModel: "groq-llama-3.1-8b",
  jd: "",
  lastOperationCost: null,
  creditBalance: null,
};

const MAX_UNDO = 20;

const STORAGE_KEY = "rawcv_resume_state";

// Fields we want to persist (skip transient UI/credit fields)
const PERSIST_KEYS: (keyof ResumeState)[] = [
  "raw", "parsed", "atsResult", "relevanceResult",
  "suggestions", "enhancements", "tailoredResume", "selectedTheme", "selectedModel", "jd",
];

function loadPersistedState(): Partial<ResumeState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<ResumeState>;
  } catch {
    return {};
  }
}

function persistState(state: ResumeState) {
  try {
    const toSave: Partial<ResumeState> = {};
    for (const key of PERSIST_KEYS) {
      (toSave as Record<string, unknown>)[key] = state[key];
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

  // Rehydrate from localStorage once on mount (client only)
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const saved = loadPersistedState();
    if (Object.keys(saved).length > 0) {
      setStateRaw((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  // Persist to localStorage whenever relevant state changes
  useEffect(() => {
    if (!hydrated.current) return;
    persistState(state);
  }, [state]);

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
    <ResumeContext.Provider value={{ state, setState, pushUndo, undo, canUndo, refreshCredits }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
