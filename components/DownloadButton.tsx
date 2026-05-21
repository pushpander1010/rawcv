"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { fetchWithRetry, safeJsonParse } from "@/lib/fetch-retry";
import { renderThemeHtml } from "@/lib/theme-renderer";

export default function DownloadButton() {
  const { state } = useResume();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateResume = (): boolean => {
    if (!state.parsed) {
      setError("Resume data is missing");
      return false;
    }

    if (!state.parsed.contact.name.trim()) {
      setError("Please enter your name");
      return false;
    }

    if (!state.parsed.contact.email.trim()) {
      setError("Please enter your email");
      return false;
    }

    const hasExperience = state.parsed.experience && state.parsed.experience.length > 0;
    const hasEducation = state.parsed.education && state.parsed.education.length > 0;
    const hasSkills = state.parsed.skills && state.parsed.skills.length > 0;

    if (!hasExperience && !hasEducation && !hasSkills) {
      setError("Add at least one section: experience, education, or skills");
      return false;
    }

    return true;
  };

  async function handleApiDownload() {
    if (!state.parsed || !validateResume()) return;
    setLoading(true);
    setError(null);
    try {
      const safeName = (state.parsed.contact.name || "resume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      
      const res = await fetchWithRetry("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsed: state.parsed, theme: state.selectedTheme }),
      }, 1, 90000); // 1 retry, 90s timeout for PDF generation

      if (!res.ok) {
        let json: { fallbackHtml?: string; message?: string } = {};
        try {
          json = await safeJsonParse<{ fallbackHtml?: string; message?: string }>(res);
        } catch (parseErr) {
          console.error('[DownloadButton] Failed to parse error response:', parseErr);
        }
        
        // Puppeteer unavailable — fall back to print dialog
        if (json.fallbackHtml) {
          openPrintWindow(json.fallbackHtml, safeName);
          setShowSuccessModal(true);
          return;
        }
        throw new Error(json.message || "PDF generation failed. Please try again.");
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeName}-resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setShowSuccessModal(true);
    } catch (e) {
      console.error("Download failed:", e);
      const errorMessage = e instanceof Error ? e.message : "Could not generate PDF. Please try again.";
      
      if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
        setError("PDF generation timed out. The server is taking too long. Please try again.");
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleBrowserPrint() {
    setError(null);
    if (!state.parsed || !validateResume()) return;

    try {
      const safeName = (state.parsed.contact.name || "resume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const html = renderThemeHtml(state.parsed, state.selectedTheme as any);
      openPrintWindow(html, safeName);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Browser print failed:", err);
      setError("Failed to initialize browser print dialog.");
    }
  }

  function openPrintWindow(html: string, safeName: string) {
    const printHtml = html.replace(
      "</head>",
      `<style>@page{margin:0;size:A4}body{margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
      <script>window.onload=function(){document.title="${safeName}-resume";window.print();window.onafterprint=function(){window.close()}};<\/script></head>`
    );
    const win = window.open("", "_blank");
    if (!win) {
      setError("Pop-up blocked. Please allow pop-ups and try again.");
      return;
    }
    win.document.write(printHtml);
    win.document.close();
  }

  const isDisabled = loading || !state.parsed;

  return (
    <div className="space-y-3">      {/* AI Server PDF Generation Button */}
      <button
        type="button"
        onClick={handleApiDownload}
        disabled={isDisabled}
        aria-label="Download resume as PDF via AI Server"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Generating PDF…
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Download PDF (AI Server)
          </>
        )}
      </button>

      {/* Browser Instant PDF Button */}
      <button
        type="button"
        onClick={handleBrowserPrint}
        disabled={isDisabled}
        aria-label="Print or save resume via browser"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-600/30 bg-white dark:bg-gray-900 text-emerald-700 hover:border-emerald-600/60 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:border-emerald-500/40 font-semibold text-base hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Save PDF (Instant Browser)
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Simple Success Toast / Popup */}
      {showSuccessModal && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300">
          <span>✓</span>
          <span className="text-sm font-semibold">Resume downloaded successfully!</span>
          <button 
            type="button" 
            onClick={() => setShowSuccessModal(false)}
            className="ml-3 text-white/80 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
