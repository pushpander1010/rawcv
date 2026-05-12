"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ParsedResume } from "@/types";
import { fetchWithRetry, safeJsonParse } from "@/lib/fetch-retry";

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

    // If not logged in, redirect to login with callback
    if (!session?.user) {
      router.push("/login?redirect=/build?action=download");
      return;
    }

    // User is logged in, proceed with download
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

      // Show success message
      setError(null);
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
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDisabled}
        aria-label="Download resume as PDF"
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            Download Resume (Free, No Watermark)
          </>
        )}
      </button>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {!session?.user && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          You'll be asked to sign in before downloading
        </p>
      )}
    </div>
  );
}
