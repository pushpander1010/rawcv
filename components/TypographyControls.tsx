"use client";

import { useResume } from "@/context/ResumeContext";
import { DEFAULT_TYPOGRAPHY } from "@/types";
import type { ResumeFont, ResumeFontSize, ResumeSpacing } from "@/types";

const FONTS: Array<{ id: ResumeFont; label: string }> = [
  { id: "default", label: "Theme default" },
  { id: "arial", label: "Arial" },
  { id: "calibri", label: "Calibri" },
  { id: "georgia", label: "Georgia" },
  { id: "times", label: "Times New Roman" },
];

const SIZES: Array<{ id: ResumeFontSize; label: string }> = [
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

const SPACING: Array<{ id: ResumeSpacing; label: string }> = [
  { id: "compact", label: "Compact" },
  { id: "comfortable", label: "Comfortable" },
  { id: "spacious", label: "Spacious" },
];

function Row<T extends string>({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: Array<{ id: T; label: string }>;
  value: T;
  onPick: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onPick(o.id)}
            aria-pressed={value === o.id}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors focus:outline-none ${
              value === o.id
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TypographyControls({ collapsible = false }: { collapsible?: boolean }) {
  const { state, setState } = useResume();
  const typo = state.typography ?? DEFAULT_TYPOGRAPHY;
  const isDefault =
    typo.font === DEFAULT_TYPOGRAPHY.font &&
    typo.size === DEFAULT_TYPOGRAPHY.size &&
    typo.spacing === DEFAULT_TYPOGRAPHY.spacing;

  const body = (
    <div className="space-y-3">
      <Row
        label="Font style"
        options={FONTS}
        value={typo.font}
        onPick={(font) => setState((prev) => ({ ...prev, typography: { ...prev.typography, font } }))}
      />
      <Row
        label="Font size"
        options={SIZES}
        value={typo.size}
        onPick={(size) => setState((prev) => ({ ...prev, typography: { ...prev.typography, size } }))}
      />
      <Row
        label="Line spacing"
        options={SPACING}
        value={typo.spacing}
        onPick={(spacing) => setState((prev) => ({ ...prev, typography: { ...prev.typography, spacing } }))}
      />
      {!isDefault && (
        <button
          type="button"
          onClick={() => setState((prev) => ({ ...prev, typography: DEFAULT_TYPOGRAPHY }))}
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
        Text style: {FONTS.find((f) => f.id === typo.font)?.label}, {typo.size}, {typo.spacing}
        {!isDefault && " (custom)"}
      </summary>
      <div className="pt-3">{body}</div>
    </details>
  );
}
