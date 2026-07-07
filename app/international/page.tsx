"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useResume } from "@/context/ResumeContext";
import PhotoUpload from "@/components/PhotoUpload";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import { RESUME_FORMAT_INFO } from "@/types";
import type { ResumeFormat, LanguageProficiency } from "@/types";

// ─── Proficiency options ──────────────────────────────────────────────────

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
  tips: string[];
  sectionOrder: string[];
  dos: string[];
  donts: string[];
}> = {
  general: {
    icon: "🌍",
    color: "from-violet-500 to-indigo-500",
    highlights: ["✅ Standard for most countries", "✅ Photo optional", "✅ Up to 2 pages", "✅ Personal details included"],
    tips: [
      "Use reverse-chronological order (most recent first)",
      "Keep it to 2 pages maximum",
      "Include a professional summary at the top",
      "Tailor skills section to the job description",
    ],
    sectionOrder: ["Contact Info", "Professional Summary", "Work Experience", "Education", "Skills", "Certifications"],
    dos: ["Quantify achievements with numbers", "Use strong action verbs", "Include relevant keywords from the job post"],
    donts: ["Don't include personal info like age or marital status", "Don't use unprofessional email addresses"],
  },
  eu: {
    icon: "🇪🇺",
    color: "from-blue-600 to-indigo-700",
    highlights: ["✅ Photo required (recommended)", "✅ Languages section included", "✅ Up to 3 pages", "✅ Personal details included"],
    tips: [
      "Include a professional photo (headshot, neutral background)",
      "Add a Languages section with CEFR levels (A1-C2)",
      "Personal details (nationality, DOB) are standard",
      "Up to 3 pages is acceptable — be thorough",
    ],
    sectionOrder: ["Personal Info + Photo", "Professional Summary", "Work Experience", "Education", "Languages", "Skills", "Interests"],
    dos: ["Mention language proficiency with CEFR levels", "Include volunteer work and interests", "Be descriptive in bullet points"],
    donts: ["Don't skip the Languages section", "Don't keep it too short — detail is valued"],
  },
  canada: {
    icon: "🇨🇦",
    color: "from-red-500 to-orange-500",
    highlights: ["✅ No photo needed", "✅ No personal details beyond contact", "✅ Up to 2 pages", "✅ Focus on skills & achievements"],
    tips: [
      "Never include a photo — anti-discrimination laws apply",
      "No personal details (age, marital status, nationality)",
      "Lead with quantified achievements",
      "Bilingual (English/French) is a plus — mention if applicable",
    ],
    sectionOrder: ["Contact Info", "Professional Summary", "Work Experience", "Education", "Skills", "Certifications"],
    dos: ["Quantify everything — numbers stand out", "Mention language skills", "Keep formatting clean and ATS-friendly"],
    donts: ["No photo, no DOB, no nationality", "Don't use tables or graphics"],
  },
  us: {
    icon: "🇺🇸",
    color: "from-blue-500 to-cyan-500",
    highlights: ["✅ No photo needed", "✅ 1-page preferred (concise)", "✅ No personal details", "✅ Achievement-oriented content"],
    tips: [
      "Keep it to 1 page (unless 10+ years experience)",
      "No photo, no personal details beyond contact",
      "Every bullet must show impact with metrics",
      "Action verb + task + result is the formula",
    ],
    sectionOrder: ["Contact Info", "Professional Summary", "Work Experience", "Education", "Skills"],
    dos: ["Use numbers in every bullet point", "Start each bullet with a strong action verb", "Mirror keywords from the job description"],
    donts: ["Don't exceed 1 page for early-mid career", "Don't include references or 'References available upon request'"],
  },
};

// ─── Conversion changes display ───────────────────────────────────────────

interface ConversionChange {
  what: string;
  why: string;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function InternationalPage() {
  const { state, setState, pushUndo } = useResume();
  const [showFormatGuidance, setShowFormatGuidance] = useState<ResumeFormat | null>(null);
  const [converting, setConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<{
    changes: ConversionChange[];
    summaryRewrite: string | null;
  } | null>(null);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const info = RESUME_FORMAT_INFO[state.selectedFormat];
  const meta = FORMAT_META[state.selectedFormat];

  function setFormat(f: ResumeFormat) {
    setState((prev) => ({ ...prev, selectedFormat: f }));
    setConversionResult(null); // clear previous result when format changes
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

  // ── Format conversion ─────────────────────────────────────────────────

  const handleConvert = useCallback(async () => {
    if (!state.parsed) {
      setConversionError("Upload a resume first before converting formats.");
      return;
    }

    setConverting(true);
    setConversionError(null);
    setConversionResult(null);

    try {
      const res = await fetch("/api/convert-format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parsed: state.parsed,
          targetFormat: state.selectedFormat,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setConversionError(data.message || "Conversion failed. Please try again.");
        return;
      }

      // Apply the conversion
      pushUndo();
      setState((prev) => ({
        ...prev,
        parsed: { ...data.converted, format: state.selectedFormat },
      }));

      setConversionResult({
        changes: data.changes ?? [],
        summaryRewrite: data.summaryRewrite ?? null,
      });
    } catch {
      setConversionError("Network error. Please try again.");
    } finally {
      setConverting(false);
    }
  }, [state.parsed, state.selectedFormat, setState, pushUndo]);

  const hasResume = !!state.parsed;
  const alreadyInFormat = state.parsed?.format === state.selectedFormat;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* FAQ Schema */}
      <Script id="international-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is the best international resume format?", acceptedAnswer: { "@type": "Answer", text: "The best format depends on your target country. US uses 1-page achievement-focused, EU uses 3-page detailed with photo, Canada mirrors US but longer. rawcv supports AI-powered conversion for all these formats." } },
          { "@type": "Question", name: "Can I convert my resume to a different country's format?", acceptedAnswer: { "@type": "Answer", text: "Yes — rawcv offers AI-powered format conversion. Upload your resume, select your target format, and our AI will restructure your content to match the conventions of that country while preserving all factual information." } },
          { "@type": "Question", name: "Do I need a photo on my resume?", acceptedAnswer: { "@type": "Answer", text: "It depends on the country. EU resumes require a photo. US, Canada, and Australia never include one. General format makes it optional. rawcv will guide you based on your selected format." } },
          { "@type": "Question", name: "How does the AI format conversion work?", acceptedAnswer: { "@type": "Answer", text: "The AI reads your resume, applies the target format's rules (section order, content style, photo/personal info rules), and returns a converted version. Your facts, dates, and experience remain unchanged — only structure and conventions change." } },
        ],
      }) }} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent dark:from-violet-900/15 dark:via-indigo-900/10 dark:to-transparent px-6 py-14 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-center gap-3 mb-4">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "International", href: "/international" }]} />
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

        {/* ── Learn more about each format ──────────────────────────── */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
          <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest mb-3">
            Detailed Format Guides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/international/eu" className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-800 transition-all group">
              <span className="text-2xl">🇪🇺</span>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">EU / Europass Guide</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Photo, CEFR levels, section order</p>
              </div>
            </Link>
            <Link href="/international/canada" className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-red-300 dark:hover:border-red-800 transition-all group">
              <span className="text-2xl">🇨🇦</span>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-600 dark:group-hover:text-red-400">Canada Guide</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Anti-discrimination, bilingual tips</p>
              </div>
            </Link>
            <Link href="/international/us" className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-800 transition-all group">
              <span className="text-2xl">🇺🇸</span>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">US Guide</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">1-page format, action verbs, ATS</p>
              </div>
            </Link>
          </div>
          <div className="mt-3 text-center">
            <Link href="/resume-formats" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
              Compare all formats worldwide →
            </Link>
          </div>
        </section>

        {/* ── Convert Resume CTA ─────────────────────────────────────── */}
        {hasResume && (
          <section className="rounded-3xl border border-violet-200 dark:border-violet-800/60 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 p-6 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🔄</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                    Convert Your Resume
                  </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {alreadyInFormat
                    ? `Your resume is already in the ${info.label} format.`
                    : `AI-powered conversion will adapt your resume to ${info.label} conventions — section order, content style, and format rules. No facts will be changed.`}
                </p>
              </div>
              {!alreadyInFormat && (
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={converting}
                  className={`
                    shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all
                    ${converting
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 active:translate-y-0"
                    }
                  `}
                >
                  {converting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Converting...
                    </span>
                  ) : (
                    `Convert to ${info.label}`
                  )}
                </button>
              )}
            </div>

            {/* Conversion error */}
            {conversionError && (
              <div className="mt-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-300">
                {conversionError}
              </div>
            )}

            {/* Conversion success */}
            {conversionResult && (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                    ✅ Conversion applied successfully!
                  </p>
                  {conversionResult.summaryRewrite && (
                    <div className="mt-2 rounded-lg bg-white/60 dark:bg-gray-900/60 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
                        Summary rewritten for {info.label} format:
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 italic">
                        &ldquo;{conversionResult.summaryRewrite}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {conversionResult.changes.length > 0 && (
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wide">
                      Changes made:
                    </p>
                    <div className="space-y-2">
                      {conversionResult.changes.map((c, i) => (
                        <div key={i} className="flex gap-2 text-xs">
                          <span className="text-violet-500 shrink-0">•</span>
                          <div>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">{c.what}</span>
                            {c.why && (
                              <span className="text-gray-500 dark:text-gray-500 ml-1">— {c.why}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

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

            {/* Region-specific tips */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-950 dark:text-gray-150 uppercase tracking-widest">
                    {info.label} Resume Tips
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    Follow these conventions for the best results
                  </p>
                </div>
              </div>

              {/* Section order */}
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                  Recommended Section Order
                </p>
                <div className="flex flex-wrap gap-2">
                  {meta.sectionOrder.map((section, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-xs text-gray-700 dark:text-gray-300">{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Do's */}
              <div className="mb-4">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">
                  ✅ Do
                </p>
                <ul className="space-y-1.5">
                  {meta.dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div>
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
                  ❌ Don&apos;t
                </p>
                <ul className="space-y-1.5">
                  {meta.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-red-400 mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
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

            {/* No resume? Upload CTA */}
            {!hasResume && (
              <div className="rounded-3xl border border-dashed border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20 p-6 text-center">
                <span className="text-3xl mb-2 block">📄</span>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                  No resume uploaded yet
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  Upload your resume on the dashboard to convert it to {info.label} format.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors"
                >
                  Go to Dashboard →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
