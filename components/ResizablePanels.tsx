"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeft?: number;
  minRight?: number;
  leftLabel?: string;
  rightLabel?: string;
}

export default function ResizablePanels({
  left,
  right,
  defaultLeftWidth = 480,
  minLeft = 320,
  minRight = 280,
  leftLabel = "Tools",
  rightLabel = "Preview",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const dragging = useRef(false);
  // Mobile: which panel is active
  const [mobileTab, setMobileTab] = useState<"left" | "right">("left");

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newLeft = e.clientX - rect.left;
      const maxLeft = rect.width - minRight - 4;
      setLeftWidth(Math.max(minLeft, Math.min(newLeft, maxLeft)));
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [minLeft, minRight]);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Mobile tab switcher */}
      <div className="flex md:hidden border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("left")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "left"
              ? "border-b-2 border-violet-600 text-violet-600"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {leftLabel}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("right")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "right"
              ? "border-b-2 border-violet-600 text-violet-600"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {rightLabel}
        </button>
      </div>

      {/* Mobile: single panel view */}
      <div className="flex md:hidden flex-1 min-h-0 overflow-hidden">
        <div className={`flex-1 overflow-y-auto bg-white dark:bg-gray-900 ${mobileTab === "left" ? "block" : "hidden"}`}>
          {left}
        </div>
        <div className={`flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 ${mobileTab === "right" ? "block" : "hidden"}`}>
          {right}
        </div>
      </div>

      {/* Desktop: resizable side-by-side */}
      <div ref={containerRef} className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        <div style={{ width: leftWidth, flexShrink: 0 }} className="overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {left}
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          className="w-1 flex-shrink-0 cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-violet-400 dark:hover:bg-violet-600 transition-colors active:bg-violet-500 group relative"
          title="Drag to resize"
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-1 h-1 rounded-full bg-white" />
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-y-auto bg-gray-100 dark:bg-gray-950">
          {right}
        </div>
      </div>
    </div>
  );
}
