"use client";

import React, { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { useToast } from "@/components/Toast";
import type { ModelId, ParsedResume } from "@/types";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

interface ResumeUploaderProps {
  modelId?: ModelId;
}

export default function ResumeUploader({ modelId }: ResumeUploaderProps) {
  const router = useRouter();
  const { state, setState } = useResume();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeModel = modelId ?? state.selectedModel;

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
      const error = validateFile(file);
      if (error) {
        showToast(error, "error");
        return;
      }

      setLoading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("model", activeModel);

        const res = await fetch("/api/parse", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok || data.error) {
          showToast(data.message ?? "Failed to parse resume. Please try again.", "error");
          return;
        }

        setState((prev) => ({
          ...prev,
          raw: data.raw,
          parsed: data.parsed as ParsedResume,
        }));

        router.push("/analyze");
      } catch {
        showToast("Something went wrong. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    },
    [activeModel, setState, router, showToast]
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
    // reset so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload resume — drag and drop or click to browse"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !loading && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && !loading && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-4
        border-2 border-dashed rounded-2xl p-12 cursor-pointer
        transition-colors duration-200 select-none
        ${dragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"}
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
      />

      {loading ? (
        <>
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
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
      ) : (
        <>
          <svg
            className="h-12 w-12 text-gray-400"
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
          <div className="text-center">
            <p className="text-base font-medium text-gray-700 dark:text-gray-200">
              Drag &amp; drop your resume here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or <span className="text-blue-500 underline">browse files</span>
            </p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            PDF, DOCX, or TXT · max 5 MB
          </p>
        </>
      )}
    </div>
  );
}
