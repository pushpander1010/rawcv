"use client";

import { useResume } from "@/context/ResumeContext";

export default function UndoButton() {
  const { undo, canUndo } = useResume();

  return (
    <button
      type="button"
      onClick={undo}
      disabled={!canUndo}
      title="Undo last change"
      aria-label="Undo last resume change"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
      Undo
    </button>
  );
}
