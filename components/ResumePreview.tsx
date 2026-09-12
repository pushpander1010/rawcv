"use client";

import { useRef, useEffect, useState } from "react";
import type { ParsedResume, ThemeId, ResumeTypography } from "@/types";
import { DEFAULT_TYPOGRAPHY, normalizeTypography, resumeZoom } from "@/types";
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
  /** Render A4 sheet(s) at true width so users see the real page shape + page breaks */
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

// A4 at 96 CSS dpi: 210mm ≈ 794px wide, 297mm ≈ 1123px tall.
// Measured on a fixed-width inner div so page breaks are exact regardless of panel width.
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export default function ResumePreview({ resume, theme, bare = false, maxHeight, typography: typoProp, a4 = false }: Props) {
  const ThemeComponent = THEME_MAP[theme] ?? ClassicTheme;
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const ctxTypo = useResume().state.typography;
  const typo = normalizeTypography(typoProp ?? ctxTypo ?? DEFAULT_TYPOGRAPHY);
  const zoom = resumeZoom(typo.fontSizePt);
  const typoClass = [typo.font !== "default" ? `resume-font-${typo.font}` : "", "resume-typo-lh"]
    .filter(Boolean)
    .join(" ");

  const safe: ParsedResume = {
    ...resume,
    experience: resume.experience ?? [],
    education: resume.education ?? [],
    skills: resume.skills ?? [],
  };

  // Detect whether horizontal scroll is needed (non-A4 mode only)
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

  // Measure rendered resume height at true A4 width → page count
  useEffect(() => {
    if (!a4 || bare) return;
    const el = measureRef.current;
    if (!el) return;
    const update = () => {
      const h = el.scrollHeight || el.offsetHeight || 0;
      setPageCount(Math.max(1, Math.ceil(h / A4_HEIGHT_PX)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, theme, typo.font, typo.fontSizePt, typo.lineHeight, a4, bare]);

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

  const typoStyle: React.CSSProperties = {
    ["zoom" as string]: zoom,
    ["--resume-lh" as string]: String(typo.lineHeight),
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-800 min-w-0">
      {a4 && pageCount > 1 && (
        <div className="px-4 pt-3 text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
          {pageCount} A4 pages — scroll to see page {pageCount > 1 ? "2+" : "1"}
        </div>
      )}
      {/* Scrollable area */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={`overflow-y-auto overflow-x-auto md:overflow-x-hidden ${a4 ? "bg-slate-100 dark:bg-slate-950 p-4" : ""}`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {a4 ? (
          <div className="mx-auto" style={{ width: A4_WIDTH_PX, maxWidth: "100%" }}>
            {/* Invisible measurer at true A4 width — drives the page count */}
            <div aria-hidden="true" style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: A4_WIDTH_PX }}>
              <div ref={measureRef} className={`bg-white text-slate-900 ${typoClass}`} style={{ width: A4_WIDTH_PX, ...typoStyle }}>
                <ThemeComponent resume={safe} />
              </div>
            </div>
            <div className="mt-3 space-y-4" aria-label={`A4 preview, ${pageCount} page${pageCount > 1 ? "s" : ""}`}>
              {Array.from({ length: pageCount }, (_, i) => (
                <div key={i} className="relative">
                  <div
                    className="bg-white shadow-md overflow-hidden"
                    style={{ width: A4_WIDTH_PX, maxWidth: "100%", height: A4_HEIGHT_PX }}
                  >
                    <div className={`text-slate-900 ${typoClass}`} style={{ width: A4_WIDTH_PX, ...typoStyle }}>
                      <div style={{ transform: `translateY(${-i * A4_HEIGHT_PX}px)` }}>
                        <ThemeComponent resume={safe} />
                      </div>
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-2 text-[11px] font-medium text-slate-400 tabular-nums">
                    {i + 1} / {pageCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`min-w-[640px] md:min-w-0 ${typoClass}`} style={typoStyle}>
            <ThemeComponent resume={safe} />
          </div>
        )}
      </div>

      {/* Horizontal slider — mobile only, shown when content overflows */}
      {needsScroll && !a4 && (
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
