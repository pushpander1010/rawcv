"use client";

import { useState, useMemo } from "react";
import type { ThemeId } from "@/types";
import { useResume } from "@/context/ResumeContext";

interface ThemeMeta {
  id: ThemeId;
  name: string;
  category: "Classic" | "Modern" | "Minimal" | "Executive" | "Creative";
  description: string;
  accent: string;
  preview: string;
}

const THEMES: ThemeMeta[] = [
  {
    id: "classic",
    name: "Classic",
    category: "Classic",
    description: "Traditional serif layout with clean section dividers",
    accent: "bg-gray-800",
    preview: "Serif · Single column",
  },
  {
    id: "modern",
    name: "Modern",
    category: "Modern",
    description: "Two-column layout with a dark sidebar and accent color",
    accent: "bg-slate-700",
    preview: "Sans-serif · Two column",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "Minimal",
    description: "Generous whitespace, light typography, no visual noise",
    accent: "bg-gray-200",
    preview: "Light · Airy",
  },
  {
    id: "executive",
    name: "Executive",
    category: "Executive",
    description: "Bold headers and formal layout for senior roles",
    accent: "bg-gray-900",
    preview: "Bold · Formal",
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Gradient accents and timeline layout for creative roles",
    accent: "bg-violet-600",
    preview: "Gradient · Timeline",
  },
  {
    id: "sharp",
    name: "Sharp",
    category: "Modern",
    description: "High-contrast black & white with geometric accents",
    accent: "bg-black",
    preview: "B&W · Geometric",
  },
  {
    id: "navy",
    name: "Navy",
    category: "Executive",
    description: "Deep navy sidebar with gold accents, polished and professional",
    accent: "bg-[#0f2044]",
    preview: "Navy · Gold accents",
  },
  {
    id: "terra",
    name: "Terra",
    category: "Classic",
    description: "Warm earthy tones with elegant serif typography",
    accent: "bg-[#8b4513]",
    preview: "Serif · Warm tones",
  },
  {
    id: "enhancv",
    name: "Enhancv",
    category: "Modern",
    description: "Two-column layout with blue accents, avatar initials, and tag-style skills",
    accent: "bg-[#008cff]",
    preview: "Blue · Two column",
  },
];

const CATEGORIES = ["All", "Classic", "Modern", "Minimal", "Executive", "Creative"] as const;

interface Props {
  /** Called when user picks a theme — also updates ResumeContext internally */
  onSelect?: (themeId: ThemeId) => void;
}

export default function ThemePicker({ onSelect }: Props) {
  const { state, setState } = useResume();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return THEMES.filter((t) => {
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      const matchesSearch =
        !search.trim() ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  function handleSelect(id: ThemeId) {
    setState((prev) => ({ ...prev, selectedTheme: id }));
    onSelect?.(id);
  }

  return (
    <div className="w-full">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search themes…"
          aria-label="Search themes"
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                activeCategory === cat
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Theme grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No themes match your search.</p>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          role="listbox"
          aria-label="Resume themes"
        >
          {filtered.map((theme) => {
            const isSelected = state.selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(theme.id)}
                className={`group rounded-xl border-2 overflow-hidden text-left transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  isSelected
                    ? "border-violet-500 shadow-md shadow-violet-100 dark:shadow-violet-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700"
                }`}
              >
                {/* Thumbnail */}
                <div className={`h-24 ${theme.accent} relative flex items-end p-3`}>
                  {/* Simulated resume lines */}
                  <div className="w-full space-y-1 opacity-30">
                    <div className="h-2 bg-white rounded w-3/4" />
                    <div className="h-1.5 bg-white rounded w-1/2" />
                    <div className="h-1 bg-white rounded w-2/3" />
                  </div>
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 bg-white dark:bg-gray-900">
                  <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-0.5">
                    {theme.name}
                  </div>
                  <div className="text-xs text-gray-400">{theme.preview}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
