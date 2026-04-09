"use client";

import React, { createContext, useContext, useState } from "react";
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
  lastOperationCost: number | null; // actual credits consumed by the last AI operation
}

interface ResumeContextValue {
  state: ResumeState;
  setState: React.Dispatch<React.SetStateAction<ResumeState>>;
}

const defaultState: ResumeState = {
  raw: "",
  parsed: null,
  atsResult: null,
  relevanceResult: null,
  suggestions: [],
  tailoredResume: null,
  selectedTheme: "classic",
  selectedModel: "gemini-2.5-flash",
  jd: "",
  lastOperationCost: null,
};

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResumeState>(defaultState);

  return (
    <ResumeContext.Provider value={{ state, setState }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within a ResumeProvider");
  return ctx;
}
