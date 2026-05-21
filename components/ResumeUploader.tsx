"use client";

import React, { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { useToast } from "@/components/Toast";
import type { ParsedResume } from "@/types";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const PARSE_COST = 2;

interface ResumeUploaderProps {}

export default function ResumeUploader(_props: ResumeUploaderProps) {
  const router = useRouter();
  const { state, setState, pushUndo } = useResume();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const hasResume = !!state.parsed;
  const balance = state.creditBalance;
  const lowCredits = balance !== null && balance < PARSE_COST;

  function validateFile(file: File): string | null {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const validType = ALLOWED_MIME.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
    if (!validType) {
      return "Unsupported file format. Please upload a PDF, DOCX, or TXT file.";
    }
    if (file.size > MAX_SIZE) {
      return "File exceeds the 5 MB size limit. Please upload a smaller file.";
    }
    return null;
  }

  const handleFile = useCallback(
    async (file: File) => {
      if (lowCredits) return; // blocked — UI already shows the message

      const error = validateFile(file);
      if (error) {
        showToast(error, "error");
        return;
      }

      // If a resume is already loaded, ask for confirmation first
      if (hasResume) {
        setPendingFile(file);
        return;
      }

      await parseAndLoad(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasResume]
  );

  const parseAndLoad = useCallback(
    async (file: File) => {
      setLoading(true);
      setPendingFile(null);
      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/parse", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok || data.error) {
          showToast(data.message ?? "Failed to parse resume. Please try again.", "error");
          return;
        }

        // Push current resume onto undo stack before overwriting
        pushUndo();

        setState((prev) => ({
          ...prev,
          raw: data.raw,
          parsed: data.parsed as ParsedResume,
          // Clear analysis results — they belong to the old resume
          atsResult: null,
          relevanceResult: null,
          suggestions: [],
          enhancements: [],
          tailoredResume: null,
        }));

        router.push("/analyze");
      } catch {
        showToast("Something went wrong. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [setState, pushUndo, router, showToast]
  );

  // Drag-and-drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <>
      <div
      role="button"
      tabIndex={0}
      aria-label="Upload resume — drag and drop or click to browse"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !loading && !lowCredits && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && !loading && !lowCredits && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-4
        border-2 border-dashed rounded-3xl p-12 cursor-pointer
        transition-all duration-200 select-none
        ${lowCredits ? "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/10 cursor-not-allowed" : dragging ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20 shadow-inner" : "border-gray-300 dark:border-gray-700 hover:border-violet-500 hover:bg-violet-50/30 dark:hover:bg-violet-950/10"}
        ${loading ? "pointer-events-none opacity-60" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
        disabled={lowCredits}
      />

      {loading ? (
        <>
          <svg
            className="animate-spin h-10 w-10 text-violet-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">Parsing your resume…</p>
        </>
      ) : lowCredits ? (
        <>
          <svg className="h-10 w-10 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Low credits — upload requires {PARSE_COST} credits
            </p>
            <p className="text-xs text-red-400 dark:text-red-500 mt-1">
              You have {balance ?? 0} credit{balance !== 1 ? "s" : ""} remaining
            </p>
          </div>
          <a
            href="/credits"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Recharge
          </a>
        </>
      ) : (
        <>
          <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-2xl text-violet-600 dark:text-violet-400 shadow-sm border border-violet-100/50 dark:border-violet-900/20">
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-8m0 0-3 3m3-3 3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Drag &amp; drop your resume here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
              or <span className="text-violet-600 dark:text-violet-400 font-medium hover:underline">browse files</span>
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            PDF, DOCX, or TXT · max 5 MB
          </p>
        </>
      )}
    </div>

    {/* Confirmation dialog — shown when a resume is already loaded */}
    {pendingFile && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Replace current resume?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            You have a resume loaded with edits. Uploading <span className="font-medium text-gray-700 dark:text-gray-200">{pendingFile.name}</span> will replace it. Your current version will be saved to undo history.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => parseAndLoad(pendingFile)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              Yes, replace
            </button>
            <button
              type="button"
              onClick={() => setPendingFile(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
