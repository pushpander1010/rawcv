"use client";

import { useResume } from "@/context/ResumeContext";
import { DEFAULT_TYPOGRAPHY, TYPO_LIMITS, normalizeTypography } from "@/types";
import type { ResumeFont } from "@/types";

const FONTS: Array<{ id: ResumeFont; label: string }> = [
  { id: "default", label: "Theme default" },
  { id: "arial", label: "Arial" },
  { id: "calibri", label: "Calibri" },
  { id: "georgia", label: "Georgia" },
  { id: "times", label: "Times New Roman" },
];

export default function TypographyControls({ collapsible = false }: { collapsible?: boolean }) {
  const { state, setState } = useResume();
  const typo = normalizeTypography(state.typography);
  const isDefault =
    typo.font === DEFAULT_TYPOGRAPHY.font &&
    typo.fontSizePt === DEFAULT_TYPOGRAPHY.fontSizePt &&
    typo.lineHeight === DEFAULT_TYPOGRAPHY.lineHeight;

  const set = (patch: Partial<typeof typo>) =>
    setState((prev) => ({ ...prev, typography: { ...normalizeTypography(prev.typography), ...patch } }));

  const body = (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Font style
        </span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Font style">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => set({ font: f.id })}
              aria-pressed={typo.font === f.id}
              className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors focus:outline-none ${
                typo.font === f.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Font size
          </span>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white tabular-nums">
            {typo.fontSizePt.toFixed(1)} pt
          </span>
        </div>
        <input
          type="range"
          min={TYPO_LIMITS.fontSizeMin}
          max={TYPO_LIMITS.fontSizeMax}
          step={TYPO_LIMITS.fontSizeStep}
          value={typo.fontSizePt}
          onChange={(e) => set({ fontSizePt: Number(e.target.value) })}
          aria-label="Font size in points"
          className="w-full h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-slate-900 dark:accent-white cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
          <span>{TYPO_LIMITS.fontSizeMin} pt</span>
          <span>{TYPO_LIMITS.fontSizeMax} pt</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Line spacing
          </span>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white tabular-nums">
            {typo.lineHeight.toFixed(2)}×
          </span>
        </div>
        <input
          type="range"
          min={TYPO_LIMITS.lineHeightMin}
          max={TYPO_LIMITS.lineHeightMax}
          step={TYPO_LIMITS.lineHeightStep}
          value={typo.lineHeight}
          onChange={(e) => set({ lineHeight: Number(e.target.value) })}
          aria-label="Line spacing multiplier"
          className="w-full h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-slate-900 dark:accent-white cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
          <span>{TYPO_LIMITS.lineHeightMin.toFixed(1)}× tight</span>
          <span>{TYPO_LIMITS.lineHeightMax.toFixed(1)}× airy</span>
        </div>
      </div>

      {!isDefault && (
        <button
          type="button"
          onClick={() => setState((prev) => ({ ...prev, typography: { ...DEFAULT_TYPOGRAPHY } }))}
          className="text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-2"
        >
          Reset to defaults
        </button>
      )}
    </div>
  );

  if (!collapsible) return body;

  return (
    <details className="group">
      <summary className="cursor-pointer text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300 list-none">
        Text style: {FONTS.find((f) => f.id === typo.font)?.label}, {typo.fontSizePt.toFixed(1)} pt,{" "}
        {typo.lineHeight.toFixed(2)}×{!isDefault && " (custom)"}
      </summary>
      <div className="pt-3">{body}</div>
    </details>
  );
}
