"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import type { TailorChange } from "@/types";

// ─── Section badge ────────────────────────────────────────────────────────────

const SECTION_COLORS: Record<string, string> = {
  experience: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  summary: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

function SectionBadge({ section }: { section: string }) {
  const style =
    SECTION_COLORS[section.toLowerCase()] ??
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${style}`}>
      {section}
    </span>
  );
}

// ─── Single change card ───────────────────────────────────────────────────────

interface ChangeCardProps {
  change: TailorChange;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (id: string, value: string) => void;
}

function ChangeCard({ change, onAccept, onReject, onEdit }: ChangeCardProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(change.tailored);

  function handleSaveEdit() {
    onEdit(change.id, editValue);
    setEditing(false);
  }

  const isDecided = change.accepted !== false || change.accepted === false;

  return (
    <li className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <SectionBadge section={change.section} />
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate max-w-[200px]">
            {change.field}
          </span>
        </div>

        {/* Status / action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {change.accepted ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Accepted
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onAccept(change.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => onReject(change.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Reject
              </button>
              {!editing && (
                <button
                  type="button"
                  onClick={() => { setEditValue(change.tailored); setEditing(true); }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Diff body */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Original
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg px-3 py-2 leading-relaxed">
            {change.original}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Tailored
          </p>
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                aria-label="Edit tailored text"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-200 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg px-3 py-2 leading-relaxed">
              {change.tailored}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

// ─── TailorDiff ───────────────────────────────────────────────────────────────

interface TailorDiffProps {
  changes: TailorChange[];
  loading?: boolean;
}

export default function TailorDiff({ changes, loading = false }: TailorDiffProps) {
  const { setState, pushUndo } = useResume();

  function updateChange(id: string, patch: Partial<TailorChange>) {
    setState((prev) => {
      if (!prev.tailoredResume) return prev;
      const updatedChanges = prev.tailoredResume.changes.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      );
      return {
        ...prev,
        tailoredResume: { ...prev.tailoredResume, changes: updatedChanges },
      };
    });
  }

  function handleAccept(id: string) {
    const change = changes.find((c) => c.id === id);
    if (!change) return;

    pushUndo();
    // Apply the change to parsed resume in context
    setState((prev) => {
      if (!prev.parsed || !prev.tailoredResume) return prev;
      const parsed = JSON.parse(JSON.stringify(prev.parsed));

      if (change.section === "summary" && change.field === "summary") {
        parsed.summary = change.tailored;
      } else if (change.section === "experience") {
        const expMatch = change.field.match(/experience\[(\d+)\]\.bullets\[(\d+)\]/);
        if (expMatch) {
          const ei = parseInt(expMatch[1], 10);
          const bi = parseInt(expMatch[2], 10);
          if (parsed.experience[ei]?.bullets[bi] !== undefined) {
            parsed.experience[ei].bullets[bi] = change.tailored;
          }
        }
      }

      const updatedChanges = prev.tailoredResume.changes.map((c) =>
        c.id === id ? { ...c, accepted: true } : c
      );

      return {
        ...prev,
        parsed,
        tailoredResume: { ...prev.tailoredResume, changes: updatedChanges },
      };
    });
  }

  function handleReject(id: string) {
    updateChange(id, { accepted: false });
  }

  function handleEdit(id: string, value: string) {
    updateChange(id, { tailored: value });
  }

  if (loading) {
    return (
      <section aria-label="Tailored changes" className="space-y-3">
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </section>
    );
  }

  if (changes.length === 0) {
    return (
      <section aria-label="Tailored changes">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
          No tailored changes available. Run tailoring to generate suggestions.
        </p>
      </section>
    );
  }

  const acceptedCount = changes.filter((c) => c.accepted).length;

  return (
    <section aria-label="JD-Tailored Changes">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Tailored Changes
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({changes.length})
          </span>
        </h2>
        {acceptedCount > 0 && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {acceptedCount} accepted
          </span>
        )}
      </div>

      <ul className="space-y-3" aria-label="Tailored changes list">
        {changes.map((change) => (
          <ChangeCard
            key={change.id}
            change={change}
            onAccept={handleAccept}
            onReject={handleReject}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </section>
  );
}
