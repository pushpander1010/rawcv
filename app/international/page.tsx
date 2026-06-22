"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import PhotoUpload from "@/components/PhotoUpload";
import { RESUME_FORMAT_INFO } from "@/types";
import type { ResumeFormat, LanguageProficiency } from "@/types";

// ─── Proficiency options (mirrored from dashboard) ────────────────────────

const PROFICIENCY_OPTIONS: { value: LanguageProficiency["level"]; label: string }[] = [
  { value: "basic",              label: "Basic" },
  { value: "elementary",         label: "Elementary" },
  { value: "intermediate",       label: "Intermediate" },
  { value: "upper-intermediate", label: "Upper-Intermediate" },
  { value: "advanced",           label: "Advanced" },
  { value: "fluent",             label: "Fluent" },
  { value: "native",             label: "Native" },
  { value: "bilingual",          label: "Bilingual" },
] as const;

// ─── Per-format icons & extended description ──────────────────────────────

const FORMAT_META: Record<ResumeFormat, {
  icon: string;
  color: string;
  highlights: string[];
}> = {
  general: {
    icon: "🌍",
    color: "from-violet-500 to-indigo-500",
    highlights: ["✅ Standard for most countries", "✅ Photo optional", "✅ Up to 2 pages", "✅ Personal details included"],
  },
  eu: {
    icon: "🇪🇺",
    color: "from-blue-600 to-indigo-700",
    highlights: ["✅ Photo required (recommended)", "✅ Languages section included", "✅ Up to 3 pages", "✅ Personal details included"],
  },
  canada: {
    icon: "🇨🇦",
    color: "from-red-500 to-orange-500",
    highlights: ["✅ No photo needed", "✅ No personal details beyond contact", "✅ Up to 2 pages", "✅ Focus on skills & achievements"],
  },
  us: {
    icon: "🇺🇸",
    color: "from-blue-500 to-cyan-500",
    highlights: ["✅ No photo needed", "✅ 1-page preferred (concise)", "✅ No personal details", "✅ Achievement-oriented content"],
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function InternationalPage() {
  const { state, setState } = useResume();
  const [showFormatGuidance, setShowFormatGuidance] = useState<ResumeFormat | null>(null);

  const info = RESUME_FORMAT_INFO[state.selectedFormat];
  const meta = FORMAT_META[state.selectedFormat];

  function setFormat(f: ResumeFormat) {
    setState((prev) => ({ ...prev, selectedFormat: f }));
  }

  // ── Language helpers ──────────────────────────────────────────────────

  function addLanguage() {
    setState((prev) => ({
      ...prev,
      parsed: prev.parsed
        ? {
            ...prev.parsed,
            languages: [...(prev.parsed.languages ?? []), { language: "", level: "intermediate" as const }],
          }
        : prev.parsed,
    }));
  }

  function removeLanguage(i: number) {
    setState((prev) => ({
      ...prev,
      parsed: prev.parsed
        ? { ...prev.parsed, languages: prev.parsed.languages?.filter((_, idx) => idx !== i) ?? [] }
        : prev.parsed,
    }));
  }

  function updateLanguage(i: number, field: "language" | "level", value: string) {
    setState((prev) => {
      if (!prev.parsed) return prev;
      const langs = [...(prev.parsed.languages ?? [])];
      langs[i] = { ...langs[i], [field]: value } as LanguageProficiency;
      return { ...prev, parsed: { ...prev.parsed, languages: langs } };
    });
  }

  const lang = state.parsed?.languages ?? [];

  // ── Cover letters ─────────────────────────────────────────────────────

  const coverLettersByFormat = state.coverLetters.filter(
    (cl) => cl.format === state.selectedFormat,
  );

  function deleteCoverLetter(id: string) {
    setState((prev) => ({
      ...prev,
      coverLetters: prev.coverLetters.filter((cl) => cl.id !== id),
    }));
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent dark:from-violet-900/15 dark:via-indigo-900/10 dark:to-transparent px-6 py-14 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🌐</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              International Resume
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Choose the format that matches your target region. Each format adjusts
            page length, photo requirements, personal details, and language sections
            to meet local expectations.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20 -mt-4 relative z-10 space-y-8">
        {/* ── Format cards grid ───────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.entries(RESUME_FORMAT_INFO) as [ResumeFormat, typeof info][]).map(([key, fmt]) => {
              const m = FORMAT_META[key];
              const isSelected = state.selectedFormat === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormat(key)}
                  onMouseEnter={() => setShowFormatGuidance(key)}
                  onMouseLeave={() => setShowFormatGuidance(null)}
                  className={`
                    group relative rounded-3xl border-2 text-left overflow-hidden
                    transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                    focus:outline-none focus:ring-4 focus:ring-violet-500/20
                    ${isSelected
                      ? "border-violet-500 dark:border-violet-400 shadow-xl shadow-violet-500/10 dark:shadow-violet-900/20"
                      : "border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-900 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg"
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  {/* Color bar */}
                  <div className={`h-2 bg-gradient-to-r ${m.color}`} />

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{m.icon}</span>
                      {isSelected && (
                        <span className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-base text-gray-900 dark:text-gray-100">{fmt.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{fmt.description}</p>
                    </div>

                    <div className="pt-1 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">📄 Max {fmt.maxPages} page{fmt.maxPages > 1 ? "s" : ""}</span>
                      </div>
                      {fmt.photoRequired && (
                        <div className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-semibold">
                          <span>📸 Photo required</span>
                        </div>
                      )}
                      {!fmt.includePersonalDetails && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                          <span>🔒 No personal details</span>
                        </div>
                      )}
                    </div>

                    {/* Hover guidance */}
                    {showFormatGuidance === key && !isSelected && (
                      <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl p-5 flex flex-col justify-center animate-fade-in">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">This format:</p>
                        <ul className="space-y-1">
                          {m.highlights.map((h, i) => (
                            <li key={i} className="text-xs text-gray-600 dark:text-gray-400">{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Two-column details ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column — settings */}
          <div className="lg:col-span-2 space-y-8">

            {/* Profile Photo */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md hover:border-violet-300 dark:hover:border-violet-800/80 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">
                    Profile Photo
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {state.selectedFormat === "eu"
                      ? "Photos are strongly recommended for EU resumes."
                      : state.selectedFormat === "general"
                        ? "Photos are optional for general resumes."
                        : "Photos are not used in this format."}
                  </p>
                </div>
                <span className="text-2xl">
                  {state.selectedFormat === "eu" ? "📸" : state.selectedFormat === "general" ? "🖼️" : "🚫"}
                </span>
              </div>
              <PhotoUpload />
            </div>

            {/* Languages — only for EU / formats that include them */}
            {info.includeLanguages && (
              <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md hover:border-violet-300 dark:hover:border-violet-800/80 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">
                      Languages
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Add your language proficiencies. Displayed prominently in EU/Europass format resumes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/10 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    + Add Language
                  </button>
                </div>

                {lang.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      No languages added yet. Click &quot;Add Language&quot; to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lang.map((l, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3"
                      >
                        <input
                          type="text"
                          value={l.language}
                          onChange={(e) => updateLanguage(i, "language", e.target.value)}
                          placeholder="e.g. English, French, Spanish"
                          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                        <select
                          value={l.level}
                          onChange={(e) => updateLanguage(i, "level", e.target.value)}
                          className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                          {PROFICIENCY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeLanguage(i)}
                          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          aria-label="Remove language"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Format-specific guidance card */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{meta.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">
                    {info.label} Format Details
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    What this format includes
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Max pages", value: `${info.maxPages} page${info.maxPages > 1 ? "s" : ""}` },
                  { label: "Photo", value: info.photoRequired ? "Required" : "Not required" },
                  { label: "Languages", value: info.includeLanguages ? "Included" : "Not included" },
                  { label: "Personal details", value: info.includePersonalDetails ? "Included" : "Not included" },
                  { label: "Cover letter", value: info.coverLetterRequired ? "Recommended" : "Optional" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3">
                    <p className="text-xxs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-500">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-6">

            {/* Quick actions */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
              <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/cover-letter"
                  className="flex items-center gap-3 w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:border-violet-200 dark:hover:border-violet-800 transition-all group"
                >
                  <span className="text-2xl">✉️</span>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Cover Letter
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                      Create a {info.label.toLowerCase()} cover letter
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-violet-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/analyze"
                  className="flex items-center gap-3 w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:border-violet-200 dark:hover:border-violet-800 transition-all group"
                >
                  <span className="text-2xl">📊</span>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Analyze Resume
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                      Check ATS score & get suggestions
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-violet-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 w-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-4 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:border-violet-200 dark:hover:border-violet-800 transition-all group"
                >
                  <span className="text-2xl">⚙️</span>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Dashboard
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                      Edit resume, credits, and more
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-violet-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Cover letters for this format */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">
                  Cover Letters
                </h3>
                <Link
                  href="/cover-letter"
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline"
                >
                  + New
                </Link>
              </div>

              {coverLettersByFormat.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-5 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    No cover letters yet for this format.
                  </p>
                  <Link
                    href="/cover-letter"
                    className="inline-block mt-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Create one now →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {coverLettersByFormat.map((cl) => (
                    <div
                      key={cl.id}
                      className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 p-3 flex items-start justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors group"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                          {cl.recipientCompany
                            ? cl.recipientName
                              ? `${cl.recipientCompany} — ${cl.recipientName}`
                              : cl.recipientCompany
                            : "Untitled cover letter"}
                        </p>
                        <p className="text-xxs text-gray-500 dark:text-gray-500 mt-0.5">
                          {new Date(cl.createdAt).toLocaleDateString(undefined, {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteCoverLetter(cl.id)}
                        className="shrink-0 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Delete cover letter"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
