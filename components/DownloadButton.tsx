"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { renderThemeHtml } from "@/lib/theme-renderer";

export default function DownloadButton() {
  const { state } = useResume();
  const [error, setError] = useState<string | null>(null);

  function handleDownload() {
    if (!state.parsed) return;
    setError(null);

    try {
      const safeName = (state.parsed.contact.name || "resume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Render full HTML using the same theme renderer as the server export
      const html = renderThemeHtml(state.parsed, state.selectedTheme);

      // Inject print-specific styles: hide everything except the resume, auto-print, then close
      const printHtml = html.replace(
        "</head>",
        `<style>
          @page { margin: 0; size: A4; }
          body { margin: 0; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
        <script>
          window.onload = function() {
            document.title = "${safeName}-resume";
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
        </head>`
      );

      const win = window.open("", "_blank");
      if (!win) {
        setError("Pop-up blocked. Please allow pop-ups for this site and try again.");
        return;
      }
      win.document.write(printHtml);
      win.document.close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={!state.parsed}
        aria-label="Download resume as PDF"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
        Download PDF
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
      )}
    </div>
  );
}
