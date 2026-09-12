"use client";

import { useRef, useEffect, useState } from "react";
import type { ParsedResume, ThemeId, ResumeTypography } from "@/types";
import { DEFAULT_TYPOGRAPHY, RESUME_SIZE_ZOOM } from "@/types";
import { useResume } from "@/context/ResumeContext";
import {
  ClassicTheme,
  ModernTheme,
  MinimalTheme,
  ExecutiveTheme,
  CreativeTheme,
  SharpTheme,
  NavyTheme,
  TerraTheme,
  EnhancTheme,
  EuropassTheme,
  CanadianTheme,
  FotoramTheme,
  ZetyTheme,
  ResumeioTheme,
} from "./themes";

interface Props {
  resume: ParsedResume;
  theme: ThemeId;
  bare?: boolean; // skip card wrapper (used for PDF capture)
  maxHeight?: string; // cap the scroll area so the resume stays in view (sticky previews)
  /** Override typography for print/PDF rendering. Screen preview reads from ResumeContext when omitted. */
  typography?: ResumeTypography;
  /** Render an A4 sheet (210mm wide, paged shadow) so users see the real page shape */
  a4?: boolean;
}

const THEME_MAP: Record<ThemeId, React.ComponentType<{ resume: ParsedResume }>> = {
  classic: ClassicTheme,
  modern: ModernTheme,
  minimal: MinimalTheme,
  executive: ExecutiveTheme,
  creative: CreativeTheme,
  sharp: SharpTheme,
  navy: NavyTheme,
  terra: TerraTheme,
  enhancv: EnhancTheme,
  europass: EuropassTheme,
  canadian: CanadianTheme,
  fotoram: FotoramTheme,
  zety: ZetyTheme,
  resumeio: ResumeioTheme,
};

export default function ResumePreview({ resume, theme, bare = false, maxHeight, typography: typoProp, a4 = false }: Props) {
  const ThemeComponent = THEME_MAP[theme] ?? ClassicTheme;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [needsScroll, setNeedsScroll] = useState(false);
  const ctxTypo = useResume().state.typography;
  const typo = typoProp ?? ctxTypo ?? DEFAULT_TYPOGRAPHY;
  const zoom = RESUME_SIZE_ZOOM[typo.size] ?? 1;
  const typoClass = [
    typo.font !== "default" ? `resume-font-${typo.font}` : "",
    `resume-spacing-${typo.spacing}`,
  ].filter(Boolean).join(" ");

  const safe: ParsedResume = {
    ...resume,
    experience: resume.experience ?? [],
    education: resume.education ?? [],
    skills: resume.skills ?? [],
  };

  // Detect whether horizontal scroll is needed
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setNeedsScroll(el.scrollWidth > el.clientWidth + 4);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, theme]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const pct = el.scrollWidth <= el.clientWidth ? 0 : (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;
    setScrollPct(pct);
  };

  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const pct = Number(e.target.value);
    setScrollPct(pct);
    el.scrollLeft = (pct / 100) * (el.scrollWidth - el.clientWidth);
  };

  if (bare) return <ThemeComponent resume={safe} />;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 min-w-0">
      {/* Scrollable area */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={`overflow-y-auto overflow-x-auto md:overflow-x-hidden ${a4 ? "bg-slate-100 dark:bg-slate-950 p-4" : ""}`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <div
          className={`${a4 ? "mx-auto bg-white shadow-md" : "min-w-[640px] md:min-w-0"} ${typoClass}`}
          style={a4 ? { width: "210mm", maxWidth: "100%", zoom } : { zoom }}
        >
          <ThemeComponent resume={safe} />
        </div>
      </div>

      {/* Horizontal slider — mobile only, shown when content overflows */}
      {needsScroll && (
        <div className="md:hidden flex items-center gap-2 px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(scrollPct)}
            onChange={onSliderChange}
            className="flex-1 h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-brand-600 cursor-pointer"
            aria-label="Scroll resume preview horizontally"
          />
          <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
}