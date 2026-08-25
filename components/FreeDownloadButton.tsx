"use client";

import { useState } from "react";
import type { ParsedResume } from "@/types";
import { validateResume, safeName, downloadViaApi, openPrintWindow, downloadBlob, browserPrint } from "@/lib/download-helpers";

interface Props {
  resume: ParsedResume | null;
  theme: string;
  onValidationError?: (error: string) => void;
}

export default function FreeDownloadButton({ resume, theme, onValidationError }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const doValidate = (): boolean => {
    const msg = validateResume(resume);
    if (msg) { setError(msg); onValidationError?.(msg); return false; }
    return true;
  };

  const handleDownload = async () => {
    setError(null);
    if (!doValidate() || !resume) return;
    setLoading(true);
    try {
      const sName = safeName(resume.contact.name);
      const result = await downloadViaApi(resume, theme, "/api/export-free");
      if (result.fallbackHtml) { openPrintWindow(result.fallbackHtml, sName); setShowSuccessModal(true); return; }
      if (result.error) throw new Error(result.error);
      if (result.blob) { downloadBlob(result.blob, sName); setShowSuccessModal(true); }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not generate PDF. Please try again.";
      if (msg.includes("timeout") || msg.includes("AbortError")) setError("PDF generation timed out. Please try again.");
      else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) setError("Network error. Please check your connection and try again.");
      else setError(msg);
    } finally { setLoading(false); }
  };

  const handleBrowserPrint = () => {
    setError(null);
    if (!doValidate() || !resume) return;
    try {
      const sName = safeName(resume.contact.name);
      const html = browserPrint(resume, theme);
      const win = openPrintWindow(html, sName);
      if (!win) { setError("Pop-up blocked. Please allow pop-ups and try again."); return; }
      setShowSuccessModal(true);
    } catch { setError("Failed to initialize browser print dialog."); }
  };

  const isDisabled = loading || !resume;

  return (
    <div className="space-y-3">
      <button type="button" onClick={handleDownload} disabled={isDisabled} aria-label="Download resume as PDF"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200">
        {loading ? (<><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Generating PDF…</>) : (<><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>Download PDF (AI Server)</>)}
      </button>
      <button type="button" onClick={handleBrowserPrint} disabled={isDisabled} aria-label="Print or save resume via browser"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-600/30 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:border-emerald-600/60 font-semibold text-base hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        Save PDF (Instant Browser)
      </button>
      {error && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"><p className="text-sm text-red-700 dark:text-red-300">{error}</p></div>}
      <p className="text-xs text-gray-500 dark:text-slate-300 text-center">100% Free — No account required!</p>
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-slate-800 transform animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold">✓</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resume Generated!</h3>
              <p className="text-sm text-gray-500 dark:text-slate-300">Your ATS-safe PDF is ready. Want to optimize your bullet points and match your resume to specific job descriptions with AI?</p>
              <div className="flex flex-col gap-2 pt-2">
                <a href="/analyze" className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md text-center">Analyze Your Resume with AI</a>
                <button type="button" onClick={() => setShowSuccessModal(false)} className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 font-semibold text-sm">Maybe Later</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}