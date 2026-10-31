"use client";

import { useEffect, useRef, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { validateResume, safeName, downloadViaApi, openPrintWindow, downloadBlob, browserPrint } from "@/lib/download-helpers";
import { resumeToPlainText, downloadTextFile } from "@/lib/resume-text";
import { buildDocxBlob, downloadDocxFile } from "@/lib/resume-docx";

export default function DownloadButton() {
  const { state } = useResume();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const doValidate = (): boolean => {
    const msg = validateResume(state.parsed as any);
    if (msg) {
      setError(msg);
      return false;
    }
    return true;
  };

  async function handleApiDownload() {
    if (!state.parsed || !doValidate()) return;
    setLoading(true);
    setError(null);
    setDone(null);
    try {
      const sName = safeName(state.parsed.contact.name);
      const result = await downloadViaApi(state.parsed as any, state.selectedTheme, "/api/export", state.typography);
      if (result.fallbackHtml) {
        openPrintWindow(result.fallbackHtml, sName);
        setDone("Print dialog opened — choose “Save as PDF”.");
        setOpen(false);
        return;
      }
      if (result.error) throw new Error(result.error);
      if (result.blob) {
        downloadBlob(result.blob, sName);
        setDone("PDF downloaded.");
        setOpen(false);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not generate PDF. Please try again.";
      if (msg.includes("timeout") || msg.includes("AbortError")) setError("PDF generation timed out. Please try again.");
      else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) setError("Network error. Please check your connection and try again.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleBrowserPrint() {
    setError(null);
    if (!state.parsed || !doValidate()) return;
    try {
      const html = browserPrint(state.parsed as any, state.selectedTheme, state.typography);
      const win = openPrintWindow(html, safeName(state.parsed.contact.name));
      if (!win) {
        setError("Pop-up blocked. Please allow pop-ups and try again.");
        return;
      }
      setDone("Print dialog opened.");
      setOpen(false);
    } catch {
      setError("Could not open the print dialog.");
    }
  }

  function handleDocx() {
    setError(null);
    if (!state.parsed || !doValidate()) return;
    setDocLoading(true);
    buildDocxBlob(state.parsed as any, state.typography)
      .then((blob) => {
        downloadDocxFile(`${safeName(state.parsed!.contact.name)}-resume.docx`, blob);
        setDone("Word document downloaded.");
        setOpen(false);
      })
      .catch(() => setError("Could not generate the Word file. Please try again."))
      .finally(() => setDocLoading(false));
  }

  function handleTxt() {
    setError(null);
    if (!state.parsed || !doValidate()) return;
    try {
      downloadTextFile(`${safeName(state.parsed.contact.name)}-resume.txt`, resumeToPlainText(state.parsed as any));
      setDone("Plain text downloaded.");
      setOpen(false);
    } catch {
      setError("Could not generate the text file.");
    }
  }

  const disabled = loading || docLoading || !state.parsed;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled && !loading}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12.5px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Preparing…
          </>
        ) : (
          <>
            Download
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden py-1">
          <button type="button" onClick={handleApiDownload} disabled={loading} className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
            <span>PDF</span><span className="text-[10px] text-slate-400">recommended</span>
          </button>
          <button type="button" onClick={handleDocx} disabled={docLoading} className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
            <span>Word</span><span className="text-[10px] text-slate-400">.docx</span>
          </button>
          <button type="button" onClick={handleTxt} className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            <span>Plain text</span><span className="text-[10px] text-slate-400">.txt</span>
          </button>
          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
          <button type="button" onClick={handleBrowserPrint} className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
            <span>Print / browser PDF</span>
          </button>
        </div>
      )}

      {(error || done) && (
        <div
          role={error ? "alert" : "status"}
          className={`fixed bottom-4 right-4 z-[60] max-w-xs rounded-lg px-4 py-3 text-[12.5px] font-medium shadow-lg ${
            error
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="flex-1">{error || done}</span>
            <button type="button" onClick={() => { setError(null); setDone(null); }} className="text-white/70 hover:text-white" aria-label="Dismiss">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
