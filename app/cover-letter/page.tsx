"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import type { CoverLetter, ResumeFormat } from "@/types";

/* ─── Format template prompts ───────────────────────────────────────────── */

const FORMAT_TEMPLATES: Record<ResumeFormat, {
  label: string;
  icon: string;
  description: string;
  openingHint: string;
  closingHint: string;
}> = {
  general: {
    label: "General",
    icon: "🌍",
    description: "Standard cover letter suitable for most countries and industries.",
    openingHint: "Dear [Recipient Name]",
    closingHint: "Sincerely",
  },
  eu: {
    label: "EU / Europass",
    icon: "🇪🇺",
    description: "European-style cover letter — includes personal details, photo reference, and a formal structure.",
    openingHint: "Dear Mr./Ms. [Surname]",
    closingHint: "Yours faithfully",
  },
  canada: {
    label: "Canada",
    icon: "🇨🇦",
    description: "Canadian cover letter — concise, no personal details, focused on skills and achievements.",
    openingHint: "Dear Hiring Manager",
    closingHint: "Best regards",
  },
  us: {
    label: "US",
    icon: "🇺🇸",
    description: "American cover letter — one page, punchy, achievement-oriented, with a strong call to action.",
    openingHint: "Dear [Recipient Name]",
    closingHint: "Best regards",
  },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function generateId(): string {
  return `cl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ─── Default letter shapes per format ──────────────────────────────────── */

function defaultLetter(format: ResumeFormat): Pick<CoverLetter, "opening" | "body" | "closing" | "signature"> {
  const base: Record<ResumeFormat, Pick<CoverLetter, "opening" | "body" | "closing" | "signature">> = {
    general: {
      opening: "",
      body: [""],
      closing: "Sincerely",
      signature: "",
    },
    eu: {
      opening: "",
      body: [""],
      closing: "Yours faithfully",
      signature: "",
    },
    canada: {
      opening: "",
      body: [""],
      closing: "Best regards",
      signature: "",
    },
    us: {
      opening: "",
      body: [""],
      closing: "Best regards",
      signature: "",
    },
  };
  return base[format];
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CoverLetterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state, setState } = useResume();

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [format, setFormat] = useState<ResumeFormat>("general");
  const [recipientName, setRecipientName] = useState("");
  const [recipientCompany, setRecipientCompany] = useState("");
  const [recipientTitle, setRecipientTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // ── AI generation ─────────────────────────────────────────────────────────
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // ── Editor state ──────────────────────────────────────────────────────────
  const [opening, setOpening] = useState("");
  const [bodyParagraphs, setBodyParagraphs] = useState<string[]>([""]);
  const [closing, setClosing] = useState("Sincerely");
  const [signature, setSignature] = useState("");

  // ── Saved letters ─────────────────────────────────────────────────────────
  const [savedLetters, setSavedLetters] = useState<CoverLetter[]>([]);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);

  // Derived: current draft id (if editing an existing letter)
  const currentLetterId = editingLetterId ?? generateId();

  // Sync from state.coverLetters
  useEffect(() => {
    setSavedLetters(state.coverLetters ?? []);
  }, [state.coverLetters]);

  // Reset form when format changes (unless we loaded a saved letter)
  useEffect(() => {
    if (!editingLetterId) {
      const d = defaultLetter(format);
      setOpening(d.opening);
      setBodyParagraphs([""]);
      setClosing(d.closing);
      setSignature(state.parsed?.contact?.name ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format]);

  // Pre-fill signature from resume name
  useEffect(() => {
    if (state.parsed?.contact?.name && !signature) {
      setSignature(state.parsed.contact.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.parsed?.contact?.name]);

  // ── Resume name for header ────────────────────────────────────────────────
  const userName = state.parsed?.contact?.name ?? "";
  const userEmail = state.parsed?.contact?.email ?? "";
  const userPhone = state.parsed?.contact?.phone ?? "";
  const userLocation = state.parsed?.contact?.location ?? "";

  // ── Generate cover letter ─────────────────────────────────────────────────
  async function handleGenerate() {
    if (!jobDescription.trim()) {
      setGenError("Please paste a job description first.");
      return;
    }
    setGenerating(true);
    setGenError(null);

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 45000);

      const res = await fetch("/api/chat/cover-letter", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: state.parsed,
          jobDescription: jobDescription.trim(),
          format,
          recipientName: recipientName.trim() || undefined,
          recipientCompany: recipientCompany.trim() || undefined,
          recipientTitle: recipientTitle.trim() || undefined,
        }),
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message ?? `Generation failed (${res.status})`);
      }

      const data: {
        opening: string;
        body: string[];
        closing: string;
        signature: string;
      } = await res.json();

      setOpening(data.opening ?? "");
      setBodyParagraphs(data.body?.length ? data.body : [""]);
      setClosing(data.closing ?? "Sincerely");
      setSignature(data.signature ?? userName);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setGenError("Request timed out. Please try again.");
      } else {
        setGenError(
          e instanceof Error ? e.message : "Failed to generate cover letter."
        );
      }
    } finally {
      setGenerating(false);
    }
  }

  // ── Save / update cover letter to context ─────────────────────────────────
  function handleSave() {
    const letter: CoverLetter = {
      id: currentLetterId,
      format,
      recipientName: recipientName.trim() || undefined,
      recipientCompany: recipientCompany.trim() || undefined,
      recipientTitle: recipientTitle.trim() || undefined,
      opening: opening,
      body: bodyParagraphs.filter((p) => p.trim()),
      closing,
      signature: signature,
      createdAt: editingLetterId
        ? (savedLetters.find((l) => l.id === editingLetterId)?.createdAt ??
          new Date().toISOString())
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = savedLetters.findIndex((l) => l.id === letter.id);
    let updated: CoverLetter[];
    if (existingIndex >= 0) {
      updated = [...savedLetters];
      updated[existingIndex] = letter;
    } else {
      updated = [...savedLetters, letter];
    }

    setSavedLetters(updated);
    setState((prev) => ({ ...prev, coverLetters: updated }));
    setEditingLetterId(letter.id);
  }

  // ── Load a saved letter into the editor ───────────────────────────────────
  function loadLetter(letter: CoverLetter) {
    setFormat(letter.format);
    setRecipientName(letter.recipientName ?? "");
    setRecipientCompany(letter.recipientCompany ?? "");
    setRecipientTitle(letter.recipientTitle ?? "");
    setOpening(letter.opening);
    setBodyParagraphs(letter.body.length ? letter.body : [""]);
    setClosing(letter.closing);
    setSignature(letter.signature);
    setEditingLetterId(letter.id);
  }

  // ── Delete a saved letter ─────────────────────────────────────────────────
  function deleteLetter(id: string) {
    const updated = savedLetters.filter((l) => l.id !== id);
    setSavedLetters(updated);
    setState((prev) => ({ ...prev, coverLetters: updated }));
    if (editingLetterId === id) {
      resetEditor();
    }
  }

  // ── Reset editor to blank ─────────────────────────────────────────────────
  function resetEditor() {
    const d = defaultLetter(format);
    setRecipientName("");
    setRecipientCompany("");
    setRecipientTitle("");
    setJobDescription("");
    setOpening(d.opening);
    setBodyParagraphs([""]);
    setClosing(d.closing);
    setSignature(userName);
    setEditingLetterId(null);
    setGenError(null);
  }

  // ── Download as PDF (browser print) ───────────────────────────────────────
  function handleDownload() {
    const safeName = (userName || "cover-letter")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const letterHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${safeName}-cover-letter</title>
<style>
  @page { margin: 0.75in; size: letter; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', 'Segoe UI', -apple-system, Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1a1a2e;
    max-width: 6.5in;
    margin: 0 auto;
    padding: 0;
    background: #fff;
  }
  .letter-header { margin-bottom: 1.2em; }
  .letter-header .name {
    font-size: 18pt;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.3px;
    margin-bottom: 0.15em;
  }
  .letter-header .contact-line {
    font-size: 9.5pt;
    color: #555;
  }
  .letter-header .contact-line span:not(:last-child)::after {
    content: "  •  ";
    color: #999;
  }
  .letter-date {
    margin-bottom: 1.2em;
    font-size: 10pt;
    color: #444;
  }
  .recipient-block {
    margin-bottom: 1.5em;
    font-size: 10.5pt;
  }
  .recipient-block div { line-height: 1.4; }
  .salutation {
    font-size: 11pt;
    margin-bottom: 1.2em;
  }
  .letter-body p {
    margin-bottom: 0.9em;
    text-align: justify;
  }
  .letter-closing {
    margin-top: 1.5em;
  }
  .letter-closing .closing-line {
    margin-bottom: 0.4em;
    font-size: 11pt;
  }
  .letter-closing .signature {
    font-weight: 600;
    font-size: 12pt;
    color: #1a1a2e;
  }
  hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 1.5em 0;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <div class="letter-header">
    <div class="name">${escapeHtml(userName)}</div>
    <div class="contact-line">
      ${[userEmail, userPhone, userLocation].filter(Boolean).map(escapeHtml).join('  •  ')}
    </div>
  </div>

  <div class="letter-date">${formattedDate}</div>

  <div class="recipient-block">
    ${recipientName ? `<div>${escapeHtml(recipientName)}</div>` : ""}
    ${recipientTitle ? `<div>${escapeHtml(recipientTitle)}</div>` : ""}
    ${recipientCompany ? `<div>${escapeHtml(recipientCompany)}</div>` : ""}
  </div>

  <div class="salutation">${escapeHtml(opening || `Dear ${recipientName || "Hiring Manager"},`)}</div>

  <div class="letter-body">
    ${bodyParagraphs.filter(p => p.trim()).map(p => `<p>${escapeHtml(p)}</p>`).join("\n    ")}
  </div>

  <div class="letter-closing">
    <div class="closing-line">${escapeHtml(closing)},</div>
    <div class="signature">${escapeHtml(signature || userName)}</div>
  </div>
</body>
</html>`;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setGenError("Pop-up blocked. Please allow pop-ups and try again.");
      return;
    }
    printWindow.document.write(letterHtml);
    printWindow.document.close();
    printWindow.focus();
    // Trigger print after a brief delay so styles render
    setTimeout(() => {
      printWindow.print();
    }, 300);
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ── Body paragraph edits ──────────────────────────────────────────────────
  function updateBody(index: number, value: string) {
    const updated = [...bodyParagraphs];
    updated[index] = value;
    setBodyParagraphs(updated);
  }

  function addParagraph() {
    setBodyParagraphs([...bodyParagraphs, ""]);
  }

  function removeParagraph(index: number) {
    if (bodyParagraphs.length <= 1) return;
    setBodyParagraphs(bodyParagraphs.filter((_, i) => i !== index));
  }

  // ── Loading / auth states ─────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null; // will redirect via useEffect
  }

  const formatInfo = FORMAT_TEMPLATES[format];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Cover Letter Builder
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                {editingLetterId ? "Update" : "Save"}
              </span>
            </button>
            {editingLetterId && (
              <button
                type="button"
                onClick={resetEditor}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                New
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* ── Left: Form + Saved ────────────────────────────── */}
          <div className="xl:col-span-5 space-y-8 order-2 xl:order-1">
            {/* Format Selector */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Format
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(FORMAT_TEMPLATES) as ResumeFormat[]).map((key) => {
                  const f = FORMAT_TEMPLATES[key];
                  const selected = format === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormat(key)}
                      className={`relative flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-medium transition-all duration-200 ${
                        selected
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 shadow-sm"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <span className="text-lg">{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
                {formatInfo.description}
              </p>
            </section>

            {/* Form Fields */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Recipient Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="recipient-name" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Recipient Name
                  </label>
                  <input
                    id="recipient-name"
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Jane Smith"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label htmlFor="recipient-company" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Company
                  </label>
                  <input
                    id="recipient-company"
                    type="text"
                    value={recipientCompany}
                    onChange={(e) => setRecipientCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="recipient-title" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Recipient Title
                  </label>
                  <input
                    id="recipient-title"
                    type="text"
                    value={recipientTitle}
                    onChange={(e) => setRecipientTitle(e.target.value)}
                    placeholder="e.g. HR Manager, Engineering Director"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label htmlFor="job-description" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="job-description"
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here. Our AI will use your resume data + this JD to craft a tailored cover letter..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
                />
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!jobDescription.trim() || generating}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating Cover Letter...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Cover Letter
                  </>
                )}
              </button>

              {genError && (
                <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  <span className="flex-1">{genError}</span>
                </div>
              )}
            </section>

            {/* Saved Cover Letters */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Saved Cover Letters ({savedLetters.length})
              </h2>

              {savedLetters.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center py-6">
                  No cover letters saved yet. Generate one and hit &quot;Save&quot;.
                </p>
              ) : (
                <div className="space-y-2">
                  {savedLetters.map((letter) => {
                    const isActive = letter.id === editingLetterId;
                    return (
                      <div
                        key={letter.id}
                        className={`rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/20"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        onClick={() => loadLetter(letter)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                {FORMAT_TEMPLATES[letter.format]?.label ?? letter.format}
                              </span>
                              {letter.recipientCompany && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {letter.recipientCompany}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {formatDate(letter.createdAt)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {letter.opening || "No salutation set"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLetter(letter.id);
                            }}
                            className="shrink-0 p-1 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label={`Delete cover letter for ${letter.recipientCompany || "unknown"}`}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* ── Right: Editable Output Preview ──────────────────── */}
          <div className="xl:col-span-7 order-1 xl:order-2">
            <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Letter Preview
                </h2>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!bodyParagraphs.some((p) => p.trim())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download PDF
                </button>
              </div>

              {/* Editable letter preview */}
              <div className="p-6 sm:p-10 max-w-3xl mx-auto">
                {/* Header Block */}
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {userName || "Your Name"}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                        {[userEmail, userPhone, userLocation].filter(Boolean).map((item, i, arr) => (
                          <span key={i}>
                            {item}
                            {i < arr.length - 1 && <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>}
                          </span>
                        ))}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Recipient Block */}
                {(recipientName || recipientCompany || recipientTitle) && (
                  <div className="mb-5 text-sm text-gray-700 dark:text-gray-300">
                    {recipientName && <div className="font-medium">{recipientName}</div>}
                    {recipientTitle && <div className="text-gray-500 dark:text-gray-400 text-xs">{recipientTitle}</div>}
                    {recipientCompany && <div className="text-gray-500 dark:text-gray-400 text-xs">{recipientCompany}</div>}
                  </div>
                )}

                {/* Editable Opening / Salutation */}
                <div className="mb-4">
                  <label className="sr-only" htmlFor="editor-opening">Salutation</label>
                  <input
                    id="editor-opening"
                    type="text"
                    value={opening}
                    onChange={(e) => setOpening(e.target.value)}
                    placeholder={formatInfo.openingHint}
                    className="w-full text-sm font-medium text-gray-800 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder-gray-500"
                  />
                </div>

                {/* Editable Body Paragraphs */}
                <div className="space-y-3 mb-4">
                  {bodyParagraphs.map((paragraph, idx) => (
                    <div key={idx} className="group relative">
                      <textarea
                        value={paragraph}
                        onChange={(e) => updateBody(idx, e.target.value)}
                        rows={3}
                        placeholder={`Paragraph ${idx + 1} — Write your cover letter content here...`}
                        className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-transparent focus:border-violet-300 dark:focus:border-violet-600 rounded-lg p-2 resize-y leading-relaxed focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-colors placeholder-gray-500"
                      />
                      {bodyParagraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParagraph(idx)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-red-500 text-white shadow transition-opacity"
                          aria-label="Remove paragraph"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addParagraph}
                    className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Paragraph
                  </button>
                </div>

                {/* Editable Closing */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="mb-3">
                    <label className="sr-only" htmlFor="editor-closing">Closing</label>
                    <input
                      id="editor-closing"
                      type="text"
                      value={closing}
                      onChange={(e) => setClosing(e.target.value)}
                      placeholder={formatInfo.closingHint}
                      className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="editor-signature">Signature</label>
                    <input
                      id="editor-signature"
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder={userName || "Your Name"}
                      className="w-full text-base font-bold text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
