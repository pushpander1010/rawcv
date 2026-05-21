import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ParsedResume } from "@/types";
import { fetchWithRetry, safeJsonParse } from "@/lib/fetch-retry";
import { renderThemeHtml } from "@/lib/theme-renderer";

interface Props {
  resume: ParsedResume | null;
  theme: string;
  onValidationError?: (error: string) => void;
}

export default function FreeDownloadButton({ resume, theme, onValidationError }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateResume = (): boolean => {
    if (!resume) {
      const msg = "Resume data is missing";
      setError(msg);
      onValidationError?.(msg);
      return false;
    }

    if (!resume.contact.name.trim()) {
      const msg = "Please enter your name";
      setError(msg);
      onValidationError?.(msg);
      return false;
    }

    if (!resume.contact.email.trim()) {
      const msg = "Please enter your email";
      setError(msg);
      onValidationError?.(msg);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.contact.email)) {
      const msg = "Please enter a valid email";
      setError(msg);
      onValidationError?.(msg);
      return false;
    }

    const hasExperience = resume.experience && resume.experience.length > 0;
    const hasEducation = resume.education && resume.education.length > 0;
    const hasSkills = resume.skills && resume.skills.length > 0;

    if (!hasExperience && !hasEducation && !hasSkills) {
      const msg = "Add at least one section: experience, education, or skills";
      setError(msg);
      onValidationError?.(msg);
      return false;
    }

    return true;
  };

  const handleDownload = async () => {
    setError(null);

    // Validate resume
    if (!validateResume()) return;

    // Proceed with download directly (no login check here anymore)
    setLoading(true);
    try {
      const safeName = (resume?.contact.name || "resume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Use /api/export-free for unauthenticated users, /api/export for authenticated
      const endpoint = session?.user ? "/api/export" : "/api/export-free";

      const res = await fetchWithRetry(
        endpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parsed: resume, theme }),
        },
        1,
        90000
      );

      if (!res.ok) {
        let json: { fallbackHtml?: string; message?: string } = {};
        try {
          json = await safeJsonParse<{ fallbackHtml?: string; message?: string }>(res);
        } catch (parseErr) {
          console.error("[FreeDownloadButton] Failed to parse error response:", parseErr);
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

      // Show success popup and clear errors
      setError(null);
      setShowSuccessModal(true);
    } catch (e) {
      console.error("Download failed:", e);
      const errorMessage =
        e instanceof Error ? e.message : "Could not generate PDF. Please try again.";

      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("AbortError")
      ) {
        setError(
          "PDF generation timed out. The server is taking too long. Please try again."
        );
      } else if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError")
      ) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBrowserPrint = () => {
    setError(null);
    if (!resume || !validateResume()) return;

    try {
      const safeName = (resume.contact.name || "resume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const html = renderThemeHtml(resume, theme as any);
      openPrintWindow(html, safeName);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Browser print failed:", err);
      setError("Failed to initialize browser print dialog.");
    }
  };

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

  const isDisabled = loading || !resume;

  return (
    <div className="space-y-3">
      {/* AI Server PDF Generation Button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDisabled}
        aria-label="Download resume as PDF"
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

      {!session?.user && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          100% Free & No Account Required to print/download!
        </p>
      )}

      {/* Success Conversion Popup Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 transform animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Resume Generated!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your ATS-safe PDF is ready. Want to optimize your bullet points and match your resume to specific job descriptions with AI?
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 text-left">
                <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  Free AI Credits Included
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Create a free account to scan your CV for keywords, optimize work experience bullets, and get 20 AI credits instantly.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/login?redirect=/dashboard")}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                >
                  Claim 20 Free Credits & Scan Resume
                </button>
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
