"use client";

import type { ParsedResume, ThemeId } from "@/types";
import {
  ClassicTheme,
  ModernTheme,
  MinimalTheme,
  ExecutiveTheme,
  CreativeTheme,
} from "./themes";

interface Props {
  resume: ParsedResume;
  theme: ThemeId;
}

const THEME_MAP: Record<ThemeId, React.ComponentType<{ resume: ParsedResume }>> = {
  classic: ClassicTheme,
  modern: ModernTheme,
  minimal: MinimalTheme,
  executive: ExecutiveTheme,
  creative: CreativeTheme,
};

export default function ResumePreview({ resume, theme }: Props) {
  const ThemeComponent = THEME_MAP[theme] ?? ClassicTheme;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <ThemeComponent resume={resume} />
    </div>
  );
}
