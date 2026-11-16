"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import type { ParsedResume, ThemeId, ResumeTypography } from "@/types";
import { DEFAULT_TYPOGRAPHY, RESUME_FONT_STACKS, TYPO_LIMITS, normalizeTypography } from "@/types";
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
  /** Hide the page-fit meter (used where space is tight) */
  hideFitMeter?: boolean;
}

// A4 at 96 CSS dpi — exact, so the page slices land on the same boundaries
// Chrome uses when it prints (210mm = 793.7008px, 297mm = 1122.5197px).
const A4_WIDTH_PX = (210 / 25.4) * 96;
const A4_HEIGHT_PX = (297 / 25.4) * 96;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ResumePreview({
  resume,
  theme,
  bare = false,
  maxHeight,
  typography: typoProp,
  a4 = false,
  hideFitMeter = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [fitScale, setFitScale] = useState(0.8);
  const [fitting, setFitting] = useState(false);
  const [fitFailed, setFitFailed] = useState(false);

  const { state: ctxState, setState: ctxSetState } = useResume();
  const ctxTypo = ctxState.typography;
  const typo = normalizeTypography(typoProp ?? ctxTypo ?? DEFAULT_TYPOGRAPHY);
  // Fit controls are only meaningful on the live, editable preview
  const canFit = !bare && !typoProp;

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
      setPageCount(Math.max(1, Math.ceil((h - 1) / A4_HEIGHT_PX)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [resume, theme, typo.font, typo.fontSizePt, typo.lineHeight, typo.density, a4, bare]);

  // How full the last page is — drives the "page fit" meter.
  const lastPageFill = useMemo(() => {
    const el = measureRef.current;
    const h = el?.scrollHeight ?? 0;
    if (h <= 0) return null;
    const usedOnLastPage = h - (pageCount - 1) * A4_HEIGHT_PX;
    return Math.max(0, Math.min(100, Math.round((usedOnLastPage / A4_HEIGHT_PX) * 100)));
  }, [pageCount, typo.fontSizePt, typo.lineHeight, typo.density, resume, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  function patchTypo(patch: Partial<ResumeTypography>) {
    ctxSetState((prev) => ({
      ...prev,
      typography: { ...normalizeTypography(prev.typography), ...patch },
    }));
  }

  /**
   * Compress the page one step at a time (density → font size → line spacing)
   * and stop the moment the content fits a single A4 sheet.
   */
  async function fitToOnePage() {
    if (fitting) return;
    setFitting(true);
    setFitFailed(false);

    let font = Math.min(typo.fontSizePt, 10.5);
    let lh = Math.min(typo.lineHeight, 1.35);
    patchTypo({ density: "compact", fontSizePt: font, lineHeight: lh });
    await wait(120);

    for (let step = 0; step < 16; step++) {
      const h = measureRef.current?.scrollHeight ?? 0;
      if (Math.ceil((h - 1) / A4_HEIGHT_PX) <= 1) {
        setFitting(false);
        return;
      }
      if (font > TYPO_LIMITS.fontSizeMin) {
        font = Math.max(TYPO_LIMITS.fontSizeMin, font - 0.5);
        patchTypo({ fontSizePt: font });
      } else if (lh > 1.15) {
        lh = Math.max(1.15, lh - 0.05);
        patchTypo({ lineHeight: lh });
      } else {
        setFitFailed(true);
        setFitting(false);
        return;
      }
      await wait(90);
    }
    setFitFailed(true);
    setFitting(false);
  }

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

  const densityClass = `rcv-density-${typo.density}`;

  if (bare) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
        <div className={densityClass} style={typoStyle} dangerouslySetInnerHTML={{ __html: html }} />
      </>
    );
  }

  const fitsOnePage = pageCount === 1;
  const nearlyFull = fitsOnePage && (lastPageFill ?? 0) >= 92;

  return (
    <div className="min-w-0">
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />

      {a4 && !hideFitMeter && (
        <div className="mb-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-semibold ${
                  fitsOnePage
                    ? nearlyFull
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                }`}
              >
                {pageCount} page{pageCount > 1 ? "s" : ""}
              </span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400 truncate">
                {fitsOnePage
                  ? nearlyFull
                    ? "One page, almost full — trim a bullet to stay safe"
                    : "Fits on one page"
                  : `Page ${pageCount} is ${lastPageFill ?? 0}% full — recruiters prefer one page`}
              </span>
            </div>
            {canFit && !fitsOnePage && (
              <button
                type="button"
                onClick={fitToOnePage}
                disabled={fitting}
                className="shrink-0 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2.5 py-1.5 text-[11.5px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                {fitting ? "Fitting…" : "Fit to 1 page"}
              </button>
            )}
          </div>
          {a4 && (
            <div className="mt-1.5 flex gap-1" aria-hidden="true">
              {Array.from({ length: pageCount }, (_, i) => {
                const fill =
                  i < pageCount - 1 ? 100 : (lastPageFill ?? 0);
                return (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full ${fitsOnePage ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {fitFailed && (
            <p className="mt-1.5 text-[11.5px] text-amber-700 dark:text-amber-300">
              Still over one page at minimum size — cut a bullet or remove an older role.
            </p>
          )}
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
                <div className={densityClass} style={typoStyle} dangerouslySetInnerHTML={{ __html: html }} />
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
                    <div style={{ width: A4_WIDTH_PX, ...typoStyle }} className={densityClass}>
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
          <div className={`rcv-fluid ${densityClass}`} style={typoStyle}>
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
