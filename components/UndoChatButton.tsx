"use client";

import { useResume } from "@/context/ResumeContext";

interface Props {
  onUndoChat: () => void;
  disabled?: boolean;
}

export default function UndoChatButton({ onUndoChat, disabled }: Props) {
  const { canUndo } = useResume();

  return (
    <button
      type="button"
      onClick={onUndoChat}
      disabled={disabled || !canUndo}
      aria-label="Undo last chat message and resume change"
      title="Undo last chat message and resume change"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
      Undo
    </button>
  );
}