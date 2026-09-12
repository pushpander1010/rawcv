"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { validateResume, safeName, downloadViaApi, openPrintWindow, downloadBlob, browserPrint } from "@/lib/download-helpers";
import { resumeToPlainText, downloadTextFile } from "@/lib/resume-text";
import { buildDocxBlob, downloadDocxFile } from "@/lib/resume-docx";

export default function DownloadButton() {
  const { state } = useResume();
  const [loading, setLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const doValidate = (): boolean => {
    const msg = validateResume(state.parsed as any);
    if (msg) { setError(msg); return false; }
    return true;
  };

  async function handleApiDownload() {
    if (!state.parsed || !doValidate()) return;
    setLoading(true);
    setError(null);
    try {
      const sName = safeName(state.parsed.contact.name);
      const result = await downloadViaApi(state.parsed as any, state.selectedTheme, "/api/export", state.typography);
      if (result.fallbackHtml) { openPrintWindow(result.fallbackHtml, sName); setShowSuccessModal(true); return; }
      if (result.error) throw new Error(result.error);
      if (result.blob) { downloadBlob(result.blob, sName); setShowSuccessModal(true); }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not generate PDF. Please try again.";
      if (msg.includes("timeout") || msg.includes("AbortError")) setError("PDF generation timed out. Please try again.");
      else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) setError("Network error. Please check your connection and try again.");
      else setError(msg);
    } finally { setLoading(false); }
  }

  function handleBrowserPrint() {
    setError(null);
    if (!state.parsed || !doValidate()) return;
    try {
      const sName = safeName(state.parsed.contact.name);
      const html = browserPrint(state.parsed as any, state.selectedTheme, state.typography);
      const win = openPrintWindow(html, sName);
      if (!win) { setError("Pop-up blocked. Please allow pop-ups and try again."); return; }
      setShowSuccessModal(true);
    } catch { setError("Failed to initialize browser print dialog."); }
  }

  function handleDocx() {
    setError(null);
    if (!state.parsed || !doValidate()) return;
    setDocLoading(true);
    buildDocxBlob(state.parsed as any, state.typography)
      .then((blob) => {
        downloadDocxFile(`${safeName(state.parsed!.contact.name)}-resume.docx`, blob);
        setShowSuccessModal(true);
      })
      .catch(() => setError("Could not generate Word file. Please try again."))
      .finally(() => setDocLoading(false));
  }

  function handleTxt() {
    setError(null);
    if (!state.parsed || !doValidate()) return;
    try {
      downloadTextFile(`${safeName(state.parsed.contact.name)}-resume.txt`, resumeToPlainText(state.parsed as any));
      setShowSuccessModal(true);
    } catch {
      setError("Could not generate TXT file. Please try again.");
    }
  }

  const isDisabled = loading || docLoading || !state.parsed;

  return (
    <div className="space-y-3">
      <button type="button" onClick={handleApiDownload} disabled={isDisabled} aria-label="Download resume as PDF via AI Server"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200">
        {loading ? (<><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Generating PDF…</>) : (<><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>Download PDF (AI Server)</>)}
      </button>
      <button type="button" onClick={handleBrowserPrint} disabled={isDisabled} aria-label="Print or save resume via browser"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-600/30 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:border-emerald-600/60 font-semibold text-base hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        Save PDF (Instant Browser)
      </button>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={handleDocx} disabled={isDisabled} aria-label="Download resume as Word document"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors focus:outline-none">
          {docLoading ? "Making Word…" : "Download Word"}
        </button>
        <button type="button" onClick={handleTxt} disabled={isDisabled} aria-label="Download resume as plain text"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm transition-colors focus:outline-none">
          Download TXT
        </button>
      </div>
      {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"><p className="text-sm text-red-700 dark:text-red-300">{error}</p></div>}
      {showSuccessModal && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
          <span>✓</span><span className="text-sm font-semibold">Resume downloaded successfully!</span>
          <button type="button" onClick={() => setShowSuccessModal(false)} className="ml-3 text-white/80 hover:text-white text-xs font-bold">Dismiss</button>
        </div>
      )}
    </div>
  );
}