"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ParsedResume, ThemeId } from "@/types";
import { renderThemeBody } from "@/lib/theme-renderer";
import { RESUME_CSS } from "@/lib/resume-styles";

const SAMPLE: ParsedResume = {
  contact: {
    name: "Aarav Mehta",
    email: "aarav.mehta@gmail.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/aaravmehta",
    github: "github.com/aaravmehta",
    website: "aaravmehta.dev",
  },
  summary:
    "Senior frontend engineer with 8 years building high-traffic consumer products. Led platform migrations for 4M+ users, cut load times 62%, and mentored teams of six.",
  experience: [
    {
      company: "Razorpay",
      title: "Senior Frontend Engineer",
      startDate: "2021-04",
      endDate: "Present",
      location: "Bengaluru, IN",
      bullets: [
        "Led a six-person team rebuilding the merchant dashboard in Next.js, cutting p95 load time from 4.8s to 1.8s.",
        "Designed a shared component library adopted by nine product squads, reducing UI build time 40%.",
        "Introduced performance budgets and CI checks, preventing 30+ regressions per quarter.",
      ],
    },
    {
      company: "Swiggy",
      title: "Frontend Engineer",
      startDate: "2018-06",
      endDate: "2021-03",
      location: "Bengaluru, IN",
      bullets: [
        "Rewrote checkout and lifted conversion 12% across 2M weekly orders.",
        "Built A/B testing tooling used in 140 experiments, tripling experiment velocity.",
      ],
    },
  ],
  education: [
    {
      institution: "BITS Pilani",
      degree: "B.E.",
      field: "Computer Science",
      graduationYear: "2018",
      gpa: "8.7/10",
      coursework: ["Data Structures", "Operating Systems", "DBMS", "Computer Networks"],
    },
  ],
  skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "PostgreSQL", "AWS", "Design systems", "Performance"],
  certifications: ["AWS Certified Solutions Architect – Associate"],
  awards: ["Top 5% in BITS ACM coding contest (2,000+ entrants)"],
  projects: [
    {
      name: "Atlas — open-source design system",
      description: "An accessible 40-component React library.",
      technologies: ["React", "TypeScript", "Storybook"],
      link: "github.com/aaravmehta/atlas",
      bullets: ["Reached 2.1k GitHub stars and 12k monthly installs", "Cut consumer bundle size 38% by removing the runtime CSS layer"],
    },
  ],
  sectionOrder: ["summary", "experience", "projects", "education", "skills", "awards", "certifications"],
};

const SHOWCASE: Array<{ id: ThemeId; name: string; note: string; best: string }> = [
  { id: "maang", name: "MAANG", note: "Jake's-style · ATS", best: "Google, Meta, Amazon, Apple, Netflix" },
  { id: "onyx", name: "Onyx", note: "Premium serif", best: "Senior ICs, managers, consulting" },
  { id: "atlas", name: "Atlas", note: "Swiss precision", best: "Tech, product, startups" },
  { id: "editorial", name: "Editorial", note: "Warm magazine", best: "Design, writing, creative leads" },
];

export default function ThemeShowcase() {
  const [theme, setTheme] = useState<ThemeId>("maang");
  const active = SHOWCASE.find((t) => t.id === theme) ?? SHOWCASE[0];
  const html = useMemo(() => {
    const sample = theme === "maang"
      ? { ...SAMPLE, summary: "", sectionOrder: ["education", "experience", "projects", "skills", "awards", "certifications"] as ParsedResume["sectionOrder"] }
      : SAMPLE;
    return renderThemeBody(sample, theme);
  }, [theme]);

  return (
    <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
      <style dangerouslySetInnerHTML={{ __html: RESUME_CSS }} />
      <style>{`
        .theme-showcase-paper { transform: scale(.42); transform-origin: top center; }
        @media (min-width: 640px) { .theme-showcase-paper { transform: scale(.55); } }
      `}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-10 lg:gap-14 items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Live render · real A4 page
              </p>
            </div>
            <h2 className="mt-3 text-[28px] sm:text-[38px] font-bold tracking-[-0.03em] leading-[1.05] text-slate-900 dark:text-white">
              Pick the room
              <br />
              <span className="font-serif italic font-normal text-blue-600">before you walk in.</span>
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
              Eighteen design systems, one content model. Switch without retyping a word —
              the typography, hierarchy, and page fit update together.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {SHOWCASE.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  aria-pressed={theme === t.id}
                  className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    theme === t.id
                      ? "border-slate-900 dark:border-white bg-white dark:bg-slate-900 ring-1 ring-slate-900 dark:ring-white"
                      : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600"
                  }`}
                >
                  <span className="block text-[12.5px] font-semibold text-slate-900 dark:text-white">{t.name}</span>
                  <span className="mt-0.5 block text-[10.5px] text-slate-400 dark:text-slate-500">{t.note}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] text-slate-500 dark:text-slate-400">
              <span>{active.best}</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link href={`/build?theme=${theme}`} className="font-semibold text-slate-900 dark:text-white underline underline-offset-4 decoration-slate-300 dark:decoration-slate-600">
                Use {active.name} →
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -inset-3 rounded-2xl bg-slate-900/[0.04] dark:bg-white/[0.04]" />
            <div className="relative overflow-hidden rounded-lg bg-white ring-1 ring-black/10 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)]">
              <div className="flex h-[490px] justify-center overflow-hidden sm:h-[620px]">
                <div
                  className="theme-showcase-paper shrink-0"
                  style={{ width: 794, height: 1123 }}
                  aria-label={`${active.name} resume preview`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 shadow-sm whitespace-nowrap">
              {active.name} · A4 · ATS-safe
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
