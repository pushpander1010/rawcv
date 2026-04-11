"use client";

import { useResume } from "@/context/ResumeContext";

export default function UndoButton() {
  const { undo, canUndo } = useResume();

  if (!canUndo) return null;

  return (
    <button
      type="button"
      onClick={undo}
      title="Undo last change"
      aria-label="Undo last resume change"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
      Undo
    </button>
  );
}
