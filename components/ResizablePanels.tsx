"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeft?: number;
  minRight?: number;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  onRightTabClick?: () => void;
  highlightRight?: boolean;
}

export default function ResizablePanels({
  left,
  right,
  defaultLeftWidth = 480,
  minLeft = 320,
  minRight = 280,
  leftLabel = "Tools",
  rightLabel = "Preview",
  onRightTabClick,
  highlightRight = false,
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
      {/* Mobile tab switcher — always visible, never scrolls */}
      <div className="flex md:hidden flex-shrink-0 border-b border-gray-200 bg-white z-10">
        <button
          type="button"
          onClick={() => setMobileTab("left")}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            mobileTab === "left"
              ? "border-b-2 border-brand-600 text-brand-600"
              : "text-gray-500"
          }`}
        >
          {leftLabel}
        </button>
        <button
          type="button"
          onClick={() => { setMobileTab("right"); onRightTabClick?.(); }}
          className={`flex-1 py-3 text-sm font-medium transition-colors rounded ${
            mobileTab === "right"
              ? "border-b-2 border-brand-600 text-brand-600"
              : "text-gray-500"
          } ${highlightRight ? "animate-tab-blink" : ""}`}
        >
          {rightLabel}
        </button>
      </div>

      {/* Mobile: single panel — scrolls independently below the fixed tab bar */}
      <div className="flex md:hidden flex-1 min-h-0 overflow-hidden">
        <div className={`flex-1 overflow-hidden bg-white ${mobileTab === "left" ? "flex flex-col" : "hidden"}`}>
          {left}
        </div>
        <div className={`flex-1 overflow-y-auto overflow-x-auto bg-gray-100 ${mobileTab === "right" ? "block" : "hidden"}`}>
          {right}
        </div>
      </div>

      {/* Desktop: resizable side-by-side */}
      <div ref={containerRef} className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        <div style={{ width: leftWidth, flexShrink: 0 }} className="flex flex-col h-full overflow-hidden border-r border-gray-200 bg-white">
          {left}
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          className="w-1 flex-shrink-0 cursor-col-resize bg-gray-200 hover:bg-brand-400 transition-colors active:bg-brand-500 group relative"
          title="Drag to resize"
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-1 h-1 rounded-full bg-white" />
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-y-auto bg-gray-100">
          {right}
        </div>
      </div>
    </div>
  );
}
