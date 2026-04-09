"use client";

import { useState, useRef } from "react";
import { useResume } from "@/context/ResumeContext";
import ResumePreview from "@/components/ResumePreview";

export default function DownloadButton() {
  const { state } = useResume();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    if (!state.parsed || !printRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const el = printRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * pageW) / canvas.width;

      // If content is taller than one page, split across pages
      let yOffset = 0;
      while (yOffset < imgH) {
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -yOffset, imgW, imgH);
        yOffset += pageH;
      }

      const safeName = (state.parsed.contact.name || "resume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      pdf.save(`${safeName}-resume.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hidden render target — off-screen but in DOM so html2canvas can capture it */}
      <div
        style={{ position: "absolute", left: "-9999px", top: 0, width: "800px", background: "#fff" }}
        aria-hidden="true"
      >
        <div ref={printRef}>
          {state.parsed && (
            <ResumePreview resume={state.parsed} theme={state.selectedTheme} bare />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={loading || !state.parsed}
        aria-label="Download resume as PDF"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating PDF…
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
      )}
    </div>
  );
}
