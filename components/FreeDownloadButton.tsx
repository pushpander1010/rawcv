"use client";

import { useState } from "react";
import type { ParsedResume, ResumeTypography } from "@/types";
import { normalizeTypography } from "@/types";
import { validateResume, safeName, downloadViaApi, openPrintWindow, downloadBlob, browserPrint } from "@/lib/download-helpers";
import { resumeToPlainText, downloadTextFile } from "@/lib/resume-text";
import { buildDocxBlob, downloadDocxFile } from "@/lib/resume-docx";

interface Props {
  resume: ParsedResume | null;
  theme: string;
  typography?: ResumeTypography;
  onValidationError?: (error: string) => void;
}

export default function FreeDownloadButton({ resume, theme, typography, onValidationError }: Props) {
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const typo = normalizeTypography(typography);

  const doValidate = (): boolean => {
    const msg = validateResume(resume);
    if (msg) {
      setError(msg);
      onValidationError?.(msg);
      return false;
    }
    setDone(null);
    return true;
  };

  const handleDownload = async () => {
    setError(null);
    if (!doValidate() || !resume) return;
    setLoading(true);
    try {
      const sName = safeName(resume.contact.name);
      const result = await downloadViaApi(resume, theme, "/api/export-free", typo);
      if (result.fallbackHtml) {
        openPrintWindow(result.fallbackHtml, sName);
        setDone("Opened the print dialog — choose “Save as PDF”.");
        return;
      }
      if (result.error) throw new Error(result.error);
      if (result.blob) {
        downloadBlob(result.blob, sName);
        setDone("PDF downloaded.");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not generate PDF. Please try again.";
      if (msg.includes("timeout") || msg.includes("AbortError")) setError("PDF generation timed out. Please try again.");
      else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) setError("Network error. Check your connection and try again.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowserPrint = () => {
    setError(null);
    if (!doValidate() || !resume) return;
    try {
      const html = browserPrint(resume, theme, typo);
      const win = openPrintWindow(html, safeName(resume.contact.name));
      if (!win) {
        setError("Pop-up blocked. Please allow pop-ups and try again.");
        return;
      }
      setDone("Print dialog opened.");
    } catch {
      setError("Could not open the print dialog.");
    }
  };

  const handleDocx = async () => {
    setError(null);
    if (!doValidate() || !resume) return;
    setDocLoading(true);
    try {
      const blob = await buildDocxBlob(resume, typo);
      downloadDocxFile(`${safeName(resume.contact.name)}-resume.docx`, blob);
      setDone("Word document downloaded.");
    } catch {
      setError("Could not generate the Word file. Please try again.");
    } finally {
      setDocLoading(false);
    }
  };

  const handleTxt = () => {
    setError(null);
    if (!doValidate() || !resume) return;
    try {
      downloadTextFile(`${safeName(resume.contact.name)}-resume.txt`, resumeToPlainText(resume));
      setDone("Plain text downloaded.");
    } catch {
      setError("Could not generate the text file.");
    }
  };

  const isDisabled = loading || docLoading || !resume;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDisabled}
        aria-label="Download resume as PDF"
        className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-slate-900 dark:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-900 font-semibold text-[14px] hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Preparing PDF…
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            Download PDF
          </>
        )}
      </button>

      <div className="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={handleDocx}
          disabled={isDisabled}
          className="h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {docLoading ? "Word…" : "Word"}
        </button>
        <button
          type="button"
          onClick={handleTxt}
          disabled={isDisabled}
          className="h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          Plain text
        </button>
        <button
          type="button"
          onClick={handleBrowserPrint}
          disabled={isDisabled}
          className="h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          Print
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-3 py-2 text-[12.5px] text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      {done && !error && (
        <p className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 px-3 py-2 text-[12.5px] text-emerald-700 dark:text-emerald-300">
          {done}
        </p>
      )}

      <p className="text-[11.5px] text-slate-500 dark:text-slate-400">
        Free forever · no watermark · ATS-safe text PDF
      </p>
    </div>
  );
}
