"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import type { ModelId } from "@/types";

// ─── Model metadata ───────────────────────────────────────────────────────────

interface ModelMeta {
  id: ModelId;
  name: string;
  provider: string;
  tier: "free" | "low-cost" | "paid";
  estimatedCredits: number; // approximate credits per typical analysis
}

const MODELS: ModelMeta[] = [
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google",    tier: "free",     estimatedCredits: 1  },
  { id: "gpt-4o-mini",      name: "GPT-4o Mini",      provider: "OpenAI",    tier: "low-cost", estimatedCredits: 2  },
  { id: "claude-haiku",     name: "Claude Haiku",     provider: "Anthropic", tier: "low-cost", estimatedCredits: 2  },
  { id: "gemini-1.5-pro",   name: "Gemini 1.5 Pro",   provider: "Google",    tier: "paid",     estimatedCredits: 8  },
  { id: "claude-sonnet",    name: "Claude Sonnet",    provider: "Anthropic", tier: "paid",     estimatedCredits: 10 },
  { id: "gpt-4o",           name: "GPT-4o",           provider: "OpenAI",    tier: "paid",     estimatedCredits: 15 },
];

const TIER_STYLES: Record<ModelMeta["tier"], string> = {
  "free":     "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "low-cost": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "paid":     "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

const PROVIDER_ICONS: Record<string, string> = {
  OpenAI:    "🟢",
  Google:    "🔵",
  Anthropic: "🟠",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ModelSelectorProps {
  /** Optional label shown above the selector */
  label?: string;
  /** Called when the user picks a model */
  onChange?: (modelId: ModelId) => void;
}

export default function ModelSelector({ label, onChange }: ModelSelectorProps) {
  const { state, setState } = useResume();
  const [open, setOpen] = useState(false);

  const selected = MODELS.find((m) => m.id === state.selectedModel) ?? MODELS[0];

  function select(model: ModelMeta) {
    setState((prev) => ({ ...prev, selectedModel: model.id }));
    onChange?.(model.id);
    setOpen(false);
  }

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Selected AI model: ${selected.name}`}
        onClick={() => setOpen((v) => !v)}
        className="
          w-full flex items-center justify-between gap-3
          px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          hover:border-blue-400 dark:hover:border-blue-500
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors text-left
        "
      >
        <span className="flex items-center gap-2 min-w-0">
          <span aria-hidden="true">{PROVIDER_ICONS[selected.provider]}</span>
          <span className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">
            {selected.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${TIER_STYLES[selected.tier]}`}>
            {selected.tier}
          </span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ~{selected.estimatedCredits} cr
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-10"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            aria-label="AI model options"
            className="
              absolute z-20 mt-2 w-full
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
              rounded-xl shadow-lg overflow-hidden
            "
          >
            {MODELS.map((model) => {
              const isSelected = model.id === state.selectedModel;
              return (
                <li
                  key={model.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(model)}
                  className={`
                    flex items-center justify-between gap-3 px-4 py-3 cursor-pointer
                    transition-colors text-sm
                    ${isSelected
                      ? "bg-blue-50 dark:bg-blue-950/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }
                  `}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span aria-hidden="true">{PROVIDER_ICONS[model.provider]}</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
                      {model.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                      {model.provider}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_STYLES[model.tier]}`}>
                      {model.tier}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
                      ~{model.estimatedCredits} cr
                    </span>
                    {isSelected && (
                      <svg className="h-4 w-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Last operation cost badge */}
      {state.lastOperationCost !== null && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          Last operation used{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {state.lastOperationCost} credit{state.lastOperationCost !== 1 ? "s" : ""}
          </span>
        </p>
      )}
    </div>
  );
}
