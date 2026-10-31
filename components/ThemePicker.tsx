"use client";

import type { ThemeId } from "@/types";
import { useResume } from "@/context/ResumeContext";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  note: string;
  accent: string;
  paper: string;
  ink: string;
}

export const THEMES: ThemeMeta[] = [
  { id: "maang", name: "MAANG", note: "Dense · ATS", accent: "#000000", paper: "#ffffff", ink: "#000000" },
  { id: "classic", name: "Classic", note: "Serif · timeless", accent: "#22201d", paper: "#ffffff", ink: "#22201d" },
  { id: "minimal", name: "Minimal", note: "Airy · editorial", accent: "#334155", paper: "#ffffff", ink: "#111827" },
  { id: "modern", name: "Modern", note: "Dark sidebar", accent: "#8fb6d9", paper: "#1d2733", ink: "#ffffff" },
  { id: "executive", name: "Executive", note: "Bold · senior", accent: "#c8a96a", paper: "#12161c", ink: "#ffffff" },
  { id: "atlas", name: "Atlas", note: "Swiss · precise", accent: "#1e4ed8", paper: "#ffffff", ink: "#101828" },
  { id: "editorial", name: "Editorial", note: "Magazine · warm", accent: "#8f3a22", paper: "#fffefb", ink: "#1a1714" },
  { id: "navy", name: "Navy", note: "Navy · gold", accent: "#e5b96f", paper: "#0e2138", ink: "#ffffff" },
  { id: "creative", name: "Creative", note: "Violet · timeline", accent: "#5b3df5", paper: "#ffffff", ink: "#16151c" },
  { id: "enhancv", name: "Enhancv", note: "Blue · two column", accent: "#0b72e7", paper: "#ffffff", ink: "#0f172a" },
  { id: "terra", name: "Terra", note: "Warm · serif", accent: "#9a4a24", paper: "#fffdf8", ink: "#2f241c" },
  { id: "sharp", name: "Sharp", note: "Mono · stark", accent: "#0a0a0a", paper: "#ffffff", ink: "#0a0a0a" },
  { id: "resumeio", name: "Resume.io", note: "Soft · friendly", accent: "#2563eb", paper: "#ffffff", ink: "#0f172a" },
  { id: "zety", name: "Zety", note: "Slate sidebar", accent: "#93b4d1", paper: "#22303f", ink: "#ffffff" },
  { id: "fotoram", name: "Fotoram", note: "Photo · gradient", accent: "#3a6ea5", paper: "#22303f", ink: "#ffffff" },
  { id: "europass", name: "Europass", note: "EU · languages", accent: "#1c3f66", paper: "#ffffff", ink: "#0f172a" },
  { id: "canadian", name: "Canadian", note: "Clean · no photo", accent: "#b3202c", paper: "#ffffff", ink: "#111827" },
];

export function themeName(id: ThemeId): string {
  return THEMES.find((t) => t.id === id)?.name ?? "Classic";
}

interface Props {
  onSelect?: (themeId: ThemeId) => void;
}

export default function ThemePicker({ onSelect }: Props) {
  const { state, setState } = useResume();

  function handleSelect(id: ThemeId) {
    setState((prev) => ({ ...prev, selectedTheme: id }));
    onSelect?.(id);
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
      role="listbox"
      aria-label="Resume themes"
    >
      {THEMES.map((theme) => {
        const isSelected = state.selectedTheme === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => handleSelect(theme.id)}
            className={`group relative rounded-lg border p-2 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-white ${
              isSelected
                ? "border-slate-900 dark:border-white ring-1 ring-slate-900 dark:ring-white bg-white dark:bg-slate-900"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-500"
            }`}
          >
            {/* Miniature paper */}
            <div
              className="relative h-[52px] rounded overflow-hidden border border-black/5"
              style={{ background: theme.paper }}
            >
              <div className="px-2 pt-2">
                <div className="h-1.5 w-3/4 rounded-sm" style={{ background: theme.ink, opacity: 0.85 }} />
                <div className="mt-1 h-1 w-1/2 rounded-sm" style={{ background: theme.accent }} />
                <div className="mt-1.5 h-1 w-full rounded-sm" style={{ background: theme.ink, opacity: 0.16 }} />
                <div className="mt-1 h-1 w-5/6 rounded-sm" style={{ background: theme.ink, opacity: 0.16 }} />
                <div className="mt-1 h-1 w-2/3 rounded-sm" style={{ background: theme.ink, opacity: 0.16 }} />
              </div>
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white dark:text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-1">
              <span className="text-[12px] font-semibold text-slate-900 dark:text-white truncate">{theme.name}</span>
            </div>
            <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">{theme.note}</span>
          </button>
        );
      })}
    </div>
  );
}
