"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { validateResume, safeName, downloadViaApi, openPrintWindow, downloadBlob, browserPrint } from "@/lib/download-helpers";

export default function DownloadButton() {
  const { state } = useResume();
  const [loading, setLoading] = useState(false);
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
      const result = await downloadViaApi(state.parsed as any, state.selectedTheme, "/api/export");
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
      const html = browserPrint(state.parsed as any, state.selectedTheme);
      const win = openPrintWindow(html, sName);
      if (!win) { setError("Pop-up blocked. Please allow pop-ups and try again."); return; }
      setShowSuccessModal(true);
    } catch { setError("Failed to initialize browser print dialog."); }
  }

  const isDisabled = loading || !state.parsed;

  return (
    <div className="space-y-3">
      <button type="button" onClick={handleApiDownload} disabled={isDisabled} aria-label="Download resume as PDF via AI Server"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200">
        {loading ? (<><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Generating PDF…</>) : (<><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" /></svg>Download PDF (AI Server)</>)}
      </button>
      <button type="button" onClick={handleBrowserPrint} disabled={isDisabled} aria-label="Print or save resume via browser"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-600/30 bg-white text-emerald-700 hover:border-emerald-600/60 font-semibold text-base hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
        Save PDF (Instant Browser)
      </button>
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200"><p className="text-sm text-red-700">{error}</p></div>}
      {showSuccessModal && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
          <span>✓</span><span className="text-sm font-semibold">Resume downloaded successfully!</span>
          <button type="button" onClick={() => setShowSuccessModal(false)} className="ml-3 text-white/80 hover:text-white text-xs font-bold">Dismiss</button>
        </div>
      )}
    </div>
  );
}
