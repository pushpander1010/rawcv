"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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
  refreshCredits: () => void;
}

const defaultState: ResumeState = {
  raw: "",
  parsed: null,
  atsResult: null,
  relevanceResult: null,
  suggestions: [],
  tailoredResume: null,
  selectedTheme: "classic",
  selectedModel: "groq-llama-3.1-8b",
  jd: "",
  lastOperationCost: null,
  creditBalance: null,
};

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResumeState>(defaultState);

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
    <ResumeContext.Provider value={{ state, setState, refreshCredits }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
