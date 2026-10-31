"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ParsedResume, ThemeId } from "@/types";
import { useResume } from "@/context/ResumeContext";
import { RESUME_THEME_IDS } from "@/lib/theme-renderer";
import { polishResumeBullets } from "@/lib/bullet-coach";
import { scoreResume } from "@/lib/resume-score";
import FreeResumeForm from "@/components/FreeResumeForm";
import ResumePreview from "@/components/ResumePreview";
import UndoButton from "@/components/UndoButton";
import ThemePicker, { themeName } from "@/components/ThemePicker";
import TypographyControls from "@/components/TypographyControls";
import FreeDownloadButton from "@/components/FreeDownloadButton";
import FreeATSChecker from "@/components/FreeATSChecker";
import JobMatchPanel from "@/components/JobMatchPanel";
import FreeKeywordAnalyzer from "@/components/FreeKeywordAnalyzer";

type Panel = "theme" | "text" | "download" | null;
type Tab = "preview" | "review";

function completeness(resume: ParsedResume | null): number {
  if (!resume) return 0;
  let score = 0;
  if (resume.contact.name?.trim()) score += 15;
  if (resume.contact.email?.trim()) score += 15;
  if ((resume.summary?.trim().length ?? 0) > 40) score += 15;
  if (resume.experience.some((e) => e.title?.trim())) score += 20;
  if (resume.experience.some((e) => e.bullets.filter(Boolean).length >= 2)) score += 10;
  if (resume.education.some((e) => e.institution?.trim())) score += 10;
  if (resume.skills.filter(Boolean).length >= 5) score += 10;
  if ((resume.projects ?? []).some((p) => p.name?.trim())) score += 5;
  return Math.min(100, score);
}

export default function FreeBuildClient() {
  const { state, setState, pushUndo, isHydrated } = useResume();
  const resume = state.parsed;
  const selectedTheme = state.selectedTheme;
  const [panel, setPanel] = useState<Panel>(null);
  const [tab, setTab] = useState<Tab>("preview");
  const [a4Preview, setA4Preview] = useState(true);
  const [polishNote, setPolishNote] = useState<string | null>(null);

  const strength = useMemo(() => completeness(resume), [resume]);
  const review = useMemo(() => scoreResume(resume), [resume]);
  const reviewScore = review.score;

  // Honour /build?theme=atlas links from the template gallery.
  const searchParams = useSearchParams();
  const appliedQueryTheme = useRef(false);
  useEffect(() => {
    if (!isHydrated || appliedQueryTheme.current) return;
    const requested = searchParams.get("theme") as ThemeId | null;
    if (requested && RESUME_THEME_IDS.includes(requested)) {
      appliedQueryTheme.current = true;
      setState((prev) => (prev.selectedTheme === requested ? prev : { ...prev, selectedTheme: requested }));
    }
  }, [isHydrated, searchParams, setState]);

  const handleResumeChange = useCallback(
    (newResume: ParsedResume) => {
      setState((prev) => ({ ...prev, parsed: newResume }));
    },
    [setState]
  );

  const togglePanel = (next: Exclude<Panel, null>) =>
    setPanel((prev) => (prev === next ? null : next));

  const handlePolish = () => {
    if (!resume?.experience?.length) return;
    let changed = 0;
    const experience = resume.experience.map((role) => {
      const polished = polishResumeBullets(role.bullets);
      changed += polished.changed;
      return { ...role, bullets: polished.bullets };
    });
    if (!changed) {
      setPolishNote("No safe wording fixes found");
      return;
    }
    pushUndo();
    setState((prev) => (prev.parsed ? { ...prev, parsed: { ...prev.parsed, experience } } : prev));
    setPolishNote(`Polished ${changed} bullet${changed === 1 ? "" : "s"}`);
    window.setTimeout(() => setPolishNote(null), 2500);
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white mb-3" />
          <p className="text-[13px] text-slate-500 dark:text-slate-400">Opening your draft…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)] gap-7 xl:gap-10 items-start">
      {/* ── Editor ─────────────────────────────────────────────────────────── */}
      <div id="edit-resume" className="order-2 lg:order-1 min-w-0 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Edit your resume</h2>
          <span className="text-[11.5px] text-slate-400 dark:text-slate-500">Saved in this browser</span>
        </div>
        <FreeResumeForm onResumeChange={handleResumeChange} initialResume={resume || undefined} />
      </div>

      {/* ── Preview ────────────────────────────────────────────────────────── */}
      <div className="order-1 lg:order-2 min-w-0 lg:sticky lg:top-[80px]">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5" role="tablist" aria-label="Preview mode">
              {([
                { id: "preview", label: "Preview" },
                { id: "review", label: `Review · ${reviewScore}` },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-md text-[12.5px] font-semibold transition-colors ${
                    tab === t.id
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => togglePanel("theme")}
                aria-expanded={panel === "theme"}
                className={`h-8 px-2.5 rounded-md border text-[12.5px] font-medium transition-colors ${
                  panel === "theme"
                    ? "border-slate-900 dark:border-white text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {themeName(selectedTheme)}
              </button>
              <button
                type="button"
                onClick={handlePolish}
                title="Remove weak framing, pronouns, and filler from every bullet"
                className="h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Polish
              </button>
              <button
                type="button"
                onClick={() => togglePanel("text")}
                aria-expanded={panel === "text"}
                className={`h-8 px-2.5 rounded-md border text-[12.5px] font-medium transition-colors ${
                  panel === "text"
                    ? "border-slate-900 dark:border-white text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                Text
              </button>
              <a
                href="#edit-resume"
                className="lg:hidden h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors inline-flex items-center"
              >
                Edit
              </a>
              <button
                type="button"
                onClick={() => togglePanel("download")}
                aria-expanded={panel === "download"}
                className="h-8 px-3 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12.5px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Export
              </button>
            </div>
          </div>

          {/* Flyout panel */}
          {panel && (
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 p-3.5">
              {panel === "theme" && (
                <ThemePicker
                  onSelect={(themeId: ThemeId) => {
                    setState((prev) => ({ ...prev, selectedTheme: themeId }));
                  }}
                />
              )}
              {panel === "text" && <TypographyControls />}
              {panel === "download" && (
                <div className="max-w-sm">
                  <FreeDownloadButton
                    resume={resume}
                    theme={selectedTheme}
                    typography={state.typography}
                  />
                </div>
              )}
            </div>
          )}

          {tab === "preview" ? (
            <>
              <div className="bg-slate-200/70 dark:bg-slate-950 p-3 sm:p-5">
                <div className="rounded-lg overflow-hidden ring-1 ring-black/5">
                  <ResumePreview
                    resume={resume ?? {
                      contact: { name: "", email: "" },
                      summary: "",
                      experience: [],
                      education: [],
                      skills: [],
                    }}
                    theme={selectedTheme}
                    a4={a4Preview}
                    maxHeight="calc(100vh - 230px)"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3.5 py-2.5 text-[11.5px] text-slate-500 dark:text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={a4Preview}
                    onChange={(e) => setA4Preview(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-slate-900 dark:accent-white"
                  />
                  A4 pages
                </label>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>{polishNote ?? "ATS-safe text · no watermark"}</span>
                <span className="ml-auto flex items-center gap-2">
                  {resume && <UndoButton />}
                  <span className="inline-flex items-center gap-2">
                    <span className="hidden sm:inline">Resume strength</span>
                    <span className="relative h-1.5 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-slate-900 dark:bg-white transition-all"
                        style={{ width: `${strength}%` }}
                      />
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">{strength}%</span>
                  </span>
                </span>
              </div>
            </>
          ) : (
            <div className="p-4 sm:p-5 space-y-7 max-h-[calc(100vh-180px)] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Resume review</h2>
                  <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    A deterministic review against the patterns behind big-tech screens. Nothing is uploaded.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  {review.band} · {reviewScore}%
                </span>
              </div>

              <JobMatchPanel />

              <section className="pt-5 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-3">
                  Big-tech resume score
                </h3>
                <FreeATSChecker resume={resume} />
              </section>
              <section className="pt-5 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-3">
                  Keywords
                </h3>
                <FreeKeywordAnalyzer resume={resume} />
              </section>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white">Want AI-level feedback?</p>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-1 mb-3">
                  Score your resume, match it to a real job description, and rewrite weak bullets.
                </p>
                <a
                  href="/analyze"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-900 dark:text-white underline underline-offset-4 decoration-slate-300 dark:decoration-slate-600"
                >
                  Open the analyzer
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
