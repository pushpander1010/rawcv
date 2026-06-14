"use client";

import type { ParsedResume, ThemeId } from "@/types";
import {
  ClassicTheme,
  ModernTheme,
  MinimalTheme,
  ExecutiveTheme,
  CreativeTheme,
  SharpTheme,
  NavyTheme,
  TerraTheme,
  EnhancTheme,
} from "./themes";

interface Props {
  resume: ParsedResume;
  theme: ThemeId;
  bare?: boolean; // skip card wrapper (used for PDF capture)
}

const THEME_MAP: Record<ThemeId, React.ComponentType<{ resume: ParsedResume }>> = {
  classic: ClassicTheme,
  modern: ModernTheme,
  minimal: MinimalTheme,
  executive: ExecutiveTheme,
  creative: CreativeTheme,
  sharp: SharpTheme,
  navy: NavyTheme,
  terra: TerraTheme,
  enhancv: EnhancTheme,
};

export default function ResumePreview({ resume, theme, bare = false }: Props) {
  const ThemeComponent = THEME_MAP[theme] ?? ClassicTheme;

  const safe: ParsedResume = {
    ...resume,
    experience: resume.experience ?? [],
    education: resume.education ?? [],
    skills: resume.skills ?? [],
  };

  if (bare) return <ThemeComponent resume={safe} />;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 min-w-0">
      <div className="min-w-[640px] md:min-w-0">
        <ThemeComponent resume={safe} />
      </div>
    </div>
  );
}
