"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import type { ParsedResume, ThemeId, ResumeTypography } from "@/types";
import { DEFAULT_TYPOGRAPHY, RESUME_FONT_STACKS, normalizeTypography } from "@/types";
import { useResume } from "@/context/ResumeContext";
import { renderThemeBody } from "@/lib/theme-renderer";
import { RESUME_CSS } from "@/lib/resume-styles";

interface Props {
  resume: ParsedResume;
  theme: ThemeId;
  bare?: boolean; // skip the paper wrapper (used for PDF capture)
  maxHeight?: string; // cap the scroll area so the resume stays in view
  /** Override typography for print/PDF rendering. Screen preview reads from ResumeContext when omitted. */
  typography?: ResumeTypography;
  /** Render A4 sheet(s) at true width so users see the real page shape + page breaks */
  a4?: boolean;
}

// A4 at 96 CSS dpi: 210mm ≈ 794px wide, 297mm ≈ 1123px tall.
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

export default function ResumePreview({
  resume,
  theme,
  bare = false,
  maxHeight,
  typography: typoProp,
  a4 = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [fitScale, setFitScale] = useState(0.8);
  const ctxTypo = useResume().state.typography;
  const typo = normalizeTypography(typoProp ?? ctxTypo ?? DEFAULT_TYPOGRAPHY);

  const safe: ParsedResume = useMemo(
    () => ({
      ...resume,
      experience: resume.experience ?? [],
      education: resume.education ?? [],
      skills: resume.skills ?? [],
    }),
    [resume]
  );

  // The preview and the exported PDF share one renderer — no drift.
  const html = useMemo(() => renderThemeBody(safe, theme), [safe, theme]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setNeedsScroll(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, theme]);

  // Fit the true A4 sheet inside the panel instead of letting it overflow.
  useEffect(() => {
    if (!a4) return;
    const el = scrollRef.current;
    if (!el) return;
    const fit = () => {
      const cs = getComputedStyle(el);
      const available =
        el.clientWidth - parseFloat(cs.paddingLeft || "0") - parseFloat(cs.paddingRight || "0");
      if (available > 0) setFitScale(Math.min(1, available / A4_WIDTH_PX));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [a4]);

  useEffect(() => {
    if (!a4 || bare) return;
    const el = measureRef.current;
    if (!el) return;
    const update = () => {
      const h = el.scrollHeight || el.offsetHeight || 0;
      setPageCount(Math.max(1, Math.ceil((h - 6) / A4_HEIGHT_PX)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, theme, typo.font, typo.fontSizePt, typo.lineHeight, a4, bare]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const pct =
      el.scrollWidth <= el.clientWidth
        ? 0
        : (el.scrollLeft / (el.scrollWidth - el.clientWidth)) * 100;
    setScrollPct(pct);
  };

  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    const pct = Number(e.target.value);
    setScrollPct(pct);
    el.scrollLeft = (pct / 100) * (el.scrollWidth - el.clientWidth);
  };

  const typoStyle: React.CSSProperties = {
    ["--rcv-size" as string]: `${typo.fontSizePt}pt`,
    ["--rcv-lh" as string]: String(typo.lineHeight),
    ...(typo.font !== "default"
      ? { ["--rcv-font" as string]: RESUME_FONT_STACKS[typo.font] }
      : {}),
  };

  if (bare) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
        <div style={typoStyle} dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  }

  return (
    <div className="min-w-0">
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />

      {a4 && pageCount > 1 && (
        <div className="px-1 pb-2 text-[12px] font-medium text-slate-500 dark:text-slate-400">
          {pageCount} A4 pages — keep it to one page if you can.
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={`overflow-auto ${a4 ? "bg-slate-200/70 dark:bg-slate-950 p-3 sm:p-5" : ""}`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {a4 ? (
          <div className="mx-auto" style={{ width: A4_WIDTH_PX * fitScale }}>
            {/* Invisible measurer at true A4 width — drives the page count */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: A4_WIDTH_PX }}
            >
              <div ref={measureRef} style={{ width: A4_WIDTH_PX }}>
                <div style={typoStyle} dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
            <div className="space-y-5" aria-label={`A4 preview, ${pageCount} page${pageCount > 1 ? "s" : ""}`}>
              {Array.from({ length: pageCount }, (_, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{ width: A4_WIDTH_PX * fitScale, height: A4_HEIGHT_PX * fitScale }}
                >
                  <div
                    className="bg-white shadow-[0_2px_16px_rgba(15,23,42,0.14)] ring-1 ring-black/5 overflow-hidden"
                    style={{
                      width: A4_WIDTH_PX,
                      height: A4_HEIGHT_PX,
                      transform: `scale(${fitScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <div style={{ width: A4_WIDTH_PX, ...typoStyle }}>
                      <div style={{ transform: `translateY(${-i * A4_HEIGHT_PX}px)` }}>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                      </div>
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-2.5 text-[10px] font-medium text-slate-400 tabular-nums">
                    {i + 1} / {pageCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rcv-fluid" style={typoStyle}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>

      {needsScroll && !a4 && (
        <div className="md:hidden flex items-center gap-2 px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <span className="text-[11px] text-slate-400 shrink-0">Drag</span>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(scrollPct)}
            onChange={onSliderChange}
            className="flex-1 h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-slate-900 cursor-pointer"
            aria-label="Scroll resume preview horizontally"
          />
        </div>
      )}
    </div>
  );
}
