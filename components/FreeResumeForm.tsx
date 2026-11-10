"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ParsedResume, WorkExperience, Education, Project } from "@/types";
import FieldAIButton from "@/components/FieldAIButton";
import BulletCoach from "@/components/BulletCoach";
import {
  normalizeSectionOrder,
  SECTION_LABELS,
} from "@/lib/section-order";
import { recommendedSectionOrder, inferCareerStage, stageLabel } from "@/lib/section-recommendation";

interface Props {
  onResumeChange: (resume: ParsedResume) => void;
  initialResume?: ParsedResume;
}

const field =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-[16px] sm:text-[13.5px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 transition-colors";

const label = "block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5";

const emptyResume = (): ParsedResume => ({
  contact: { name: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  awards: [],
  sectionOrder: recommendedSectionOrder({ experience: [], education: [] }),
  sectionOrderCustomized: false,
});

function Section({
  title,
  hint,
  count,
  action,
  children,
  active,
}: {
  title: string;
  hint?: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}) {
  if (!active) return null;
  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-start gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[13.5px] font-semibold text-slate-900 dark:text-white">{title}</h2>
            {typeof count === "number" && count > 0 && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                {count}
              </span>
            )}
          </div>
          {hint && <p className="mt-0.5 text-[11.5px] text-slate-400 dark:text-slate-500">{hint}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="p-4 space-y-3.5">{children}</div>
    </section>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
      </svg>
      {children}
    </button>
  );
}

function RemoveButton({ onClick, label: text = "Remove" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11.5px] font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
    >
      {text}
    </button>
  );
}

type EditorTab = "details" | "summary" | "experience" | "education" | "skills" | "projects" | "awards" | "certifications";

const EDITOR_TABS: Array<{ key: EditorTab; label: string }> = [
  { key: "details", label: "Details" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "awards", label: "Awards" },
  { key: "certifications", label: "Certificates" },
];

export default function FreeResumeForm({ onResumeChange, initialResume }: Props) {
  const [resume, setResume] = useState<ParsedResume>(() => {
    if (!initialResume) return emptyResume();
    return initialResume.sectionOrderCustomized
      ? initialResume
      : { ...initialResume, sectionOrder: recommendedSectionOrder(initialResume) };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<EditorTab>("details");
  const [showOrder, setShowOrder] = useState(false);

  // Skip the initial mount notification so we don't clobber a resume already
  // loaded in the global context (AI chat, upload, undo) with an empty draft.
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    onResumeChange(resume);
  }, [resume, onResumeChange]);

  // Sync external changes (AI chat, undo, upload) without resetting the cursor.
  const lastExternalSig = useRef<string>("");
  useEffect(() => {
    if (!didMount.current) return;
    if (!initialResume) return;
    const sig = JSON.stringify(initialResume);
    if (sig !== lastExternalSig.current && sig !== JSON.stringify(resume)) {
      lastExternalSig.current = sig;
      setResume(
        initialResume.sectionOrderCustomized
          ? initialResume
          : { ...initialResume, sectionOrder: recommendedSectionOrder(initialResume) }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialResume]);

  const validateEmail = useCallback((value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
    return "";
  }, []);

  const handleContactChange = (f: keyof typeof resume.contact, value: string) => {
    setResume((prev) => ({ ...prev, contact: { ...prev.contact, [f]: value } }));
    setTouched((prev) => ({ ...prev, [f]: true }));
    if (f === "name") setErrors((prev) => ({ ...prev, name: value.trim() ? "" : "Name is required" }));
    if (f === "email") setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(",").map((s) => s.trim()).filter(Boolean);
    setResume((prev) => ({ ...prev, skills }));
  };

  const updateExperience = (index: number, patch: Partial<WorkExperience>) => {
    setResume((prev) => {
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], ...patch };
      return { ...prev, experience };
    });
  };

  const updateEducation = (index: number, patch: Partial<Education>) => {
    setResume((prev) => {
      const education = [...prev.education];
      education[index] = { ...education[index], ...patch };
      return { ...prev, education };
    });
  };

  const updateProject = (index: number, patch: Partial<Project>) => {
    setResume((prev) => {
      const projects = [...(prev.projects || [])];
      projects[index] = { ...projects[index], ...patch };
      return { ...prev, projects };
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const current = normalizeSectionOrder(resume.sectionOrder);
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= current.length) return;
    const next = [...current];
    const [removed] = next.splice(index, 1);
    next.splice(target, 0, removed);
    setResume((prev) => ({ ...prev, sectionOrder: next, sectionOrderCustomized: true }));
  };

  const handleClear = () => {
    if (confirm("Clear all resume data? This cannot be undone.")) {
      setResume(emptyResume());
      setErrors({});
      setTouched({});
    }
  };

  const sectionOrder = normalizeSectionOrder(resume.sectionOrder);
  const skillsValue = resume.skills.join(", ");
  const recommended = recommendedSectionOrder(resume);
  const stage = inferCareerStage(resume);
  const usingRecommended =
    !resume.sectionOrderCustomized &&
    JSON.stringify(sectionOrder) === JSON.stringify(recommended);
  const activeIndex = EDITOR_TABS.findIndex((t) => t.key === activeSection);
  const prevTab = EDITOR_TABS[activeIndex - 1];
  const nextTab = EDITOR_TABS[activeIndex + 1];

  const countFor = (key: EditorTab): number => {
    if (key === "details") {
      return [resume.contact.name, resume.contact.email, resume.contact.phone, resume.contact.location, resume.contact.linkedin, resume.contact.github, resume.contact.website].filter((v) => v?.trim()).length;
    }
    if (key === "summary") return resume.summary?.trim() ? 1 : 0;
    if (key === "experience") return resume.experience.length;
    if (key === "education") return resume.education.length;
    if (key === "skills") return resume.skills.length;
    if (key === "projects") return (resume.projects || []).length;
    if (key === "awards") return (resume.awards || []).length;
    return (resume.certifications || []).length;
  };

  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      {/* Section navigation — one section at a time */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {EDITOR_TABS.map((tab) => {
                const count = countFor(tab.key);
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => { setActiveSection(tab.key); setShowOrder(false); }}
                    aria-current={activeSection === tab.key ? "step" : undefined}
                    className={`shrink-0 rounded-full px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                      activeSection === tab.key
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && tab.key !== "details" && (
                      <span className={`ml-1 tabular-nums ${activeSection === tab.key ? "text-white/60 dark:text-slate-900/50" : "text-slate-400"}`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          <button
            type="button"
            onClick={() => setShowOrder((v) => !v)}
            aria-expanded={showOrder}
            className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
              showOrder
                ? "border-slate-900 dark:border-white text-slate-900 dark:text-white"
                : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Reorder
          </button>
        </div>

        {showOrder && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 space-y-1">
            <div className="flex items-center justify-between gap-2 px-1 pb-1.5">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                {usingRecommended ? `Auto · ${stageLabel(stage)}` : "Custom order"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setResume((prev) => ({
                    ...prev,
                    sectionOrder: recommendedSectionOrder(prev),
                    sectionOrderCustomized: false,
                  }))}
                  className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 underline underline-offset-2"
                >
                  Recommended
                </button>
                <button type="button" onClick={() => setShowOrder(false)} className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                  Done
                </button>
              </div>
            </div>
            {sectionOrder.map((key, idx) => (
              <div key={key} className="flex items-center justify-between gap-2 px-1 py-0.5">
                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200">{SECTION_LABELS[key]}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveSection(idx, "up")} disabled={idx === 0} aria-label={`Move ${SECTION_LABELS[key]} up`} className="h-6 w-6 rounded border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => moveSection(idx, "down")} disabled={idx === sectionOrder.length - 1} aria-label={`Move ${SECTION_LABELS[key]} down`} className="h-6 w-6 rounded border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 disabled:opacity-30">↓</button>
                </div>
              </div>
            ))}
            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
              <button type="button" onClick={handleClear} className="text-[11px] font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                Clear all data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact — active section only */}
      <Section title="Your details" hint="Name, email, and how employers reach you" active={activeSection === "details"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={label}>Full name *</label>
            <input
              type="text"
              value={resume.contact.name}
              onChange={(e) => handleContactChange("name", e.target.value)}
              placeholder="Aarav Mehta"
              className={field}
            />
            {touched.name && errors.name && <p className="mt-1 text-[11.5px] text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label className={label}>Email *</label>
            <input
              type="email"
              value={resume.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              placeholder="you@example.com"
              className={field}
            />
            {touched.email && errors.email && <p className="mt-1 text-[11.5px] text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label className={label}>Phone</label>
            <input
              type="tel"
              value={resume.contact.phone || ""}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={field}
            />
          </div>
          <div>
            <label className={label}>Location</label>
            <input
              type="text"
              value={resume.contact.location || ""}
              onChange={(e) => handleContactChange("location", e.target.value)}
              placeholder="Bengaluru, India"
              className={field}
            />
          </div>
          <div>
            <label className={label}>LinkedIn</label>
            <input
              type="url"
              value={resume.contact.linkedin || ""}
              onChange={(e) => handleContactChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/you"
              className={field}
            />
          </div>
          <div>
            <label className={label}>GitHub</label>
            <input
              type="url"
              value={resume.contact.github || ""}
              onChange={(e) => handleContactChange("github", e.target.value)}
              placeholder="github.com/you"
              className={field}
            />
          </div>
          <div>
            <label className={label}>Website / portfolio</label>
            <input
              type="url"
              value={resume.contact.website || ""}
              onChange={(e) => handleContactChange("website", e.target.value)}
              placeholder="yoursite.com"
              className={field}
            />
          </div>
        </div>
      </Section>

      {/* Summary */}
      <Section
        title="About you"
        hint="Two or three lines on what you do best"
        active={activeSection === "summary"}
        action={
          <FieldAIButton
            section="summary"
            value={resume.summary || ""}
            context={`Role: ${resume.experience[0]?.title ?? ""} at ${resume.experience[0]?.company ?? ""}. Skills: ${resume.skills.slice(0, 8).join(", ")}`}
            onApply={(summary) => setResume((prev) => ({ ...prev, summary }))}
            label="Improve"
          />
        }
      >
        <textarea
          value={resume.summary || ""}
          onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
          placeholder="Senior software engineer with 8 years shipping consumer products. Led a 6-person team, cut p95 latency 62%, and mentored 4 engineers."
          rows={4}
          className={field}
        />
        <p className="text-[11.5px] text-slate-400 dark:text-slate-500">
          Tip: lead with your role, years of experience, and one measurable result.
        </p>
      </Section>

      {/* Experience */}
      <Section
        title="Work history"
        count={resume.experience.length}
        active={activeSection === "experience"}
        hint="Roles, dates, and results — newest first"
        action={<AddButton onClick={() => setResume((prev) => ({
          ...prev,
          experience: [...prev.experience, { company: "", title: "", startDate: "", endDate: "Present", bullets: [] }],
        }))}>Add role</AddButton>}
      >
        {resume.experience.length === 0 && (
          <p className="text-[12.5px] text-slate-400 dark:text-slate-500">No roles yet. Add your most recent position to start.</p>
        )}
        {resume.experience.map((exp, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Job title</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(idx, { title: e.target.value })}
                  placeholder="Senior Frontend Engineer"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(idx, { company: e.target.value })}
                  placeholder="Razorpay"
                  className={field}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className={label}>Start</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(idx, { startDate: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>End</label>
                <input
                  type="month"
                  value={exp.endDate === "Present" ? "" : exp.endDate}
                  onChange={(e) => updateExperience(idx, { endDate: e.target.value || "Present" })}
                  className={field}
                />
                <p className="mt-1 text-[10.5px] text-slate-400 dark:text-slate-500">Leave empty for “Present”.</p>
              </div>
              <div>
                <label className={label}>Location</label>
                <input
                  type="text"
                  value={exp.location || ""}
                  onChange={(e) => updateExperience(idx, { location: e.target.value })}
                  placeholder="Bengaluru, IN"
                  className={field}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-[12px] font-semibold text-slate-600 dark:text-slate-300">Achievements · one per line</label>
                <FieldAIButton
                  section="bullets"
                  value={exp.bullets.join("\n")}
                  context={`${exp.title} at ${exp.company}`}
                  label="Improve"
                  onApply={(improved) =>
                    updateExperience(idx, {
                      bullets: improved.split("\n").map((b) => b.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <textarea
                value={exp.bullets.join("\n")}
                onChange={(e) =>
                  updateExperience(idx, {
                    bullets: e.target.value.split("\n").filter((b) => b.trim()),
                  })
                }
                placeholder={"Cut checkout latency 62% by rebuilding the flow in Next.js\nLed 6 engineers across two product squads"}
                rows={3}
                className={field}
              />
              <BulletCoach
                bullets={exp.bullets}
                onChange={(bullets) => updateExperience(idx, { bullets })}
              />
            </div>
            <div className="flex justify-end">
              <RemoveButton onClick={() => setResume((prev) => ({
                ...prev,
                experience: prev.experience.filter((_, i) => i !== idx),
              }))} />
            </div>
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section
        title="Education"
        count={resume.education.length}
        active={activeSection === "education"}
        hint="Degree, school, and start/end year"
        action={<AddButton onClick={() => setResume((prev) => ({
          ...prev,
          education: [...prev.education, { institution: "", degree: "", field: "", startYear: "", graduationYear: "" }],
        }))}>Add school</AddButton>}
      >
        {resume.education.length === 0 && (
          <p className="text-[12.5px] text-slate-400 dark:text-slate-500">No education yet.</p>
        )}
        {resume.education.map((edu, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 space-y-3">
            <div>
              <label className={label}>School</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(idx, { institution: e.target.value })}
                placeholder="BITS Pilani"
                className={field}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                  placeholder="B.E."
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Field</label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(idx, { field: e.target.value })}
                  placeholder="Computer Science"
                  className={field}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={label}>Start year</label>
                <input
                  type="number"
                  value={edu.startYear || ""}
                  onChange={(e) => updateEducation(idx, { startYear: e.target.value })}
                  placeholder="2014"
                  min="1950"
                  max="2100"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>End year</label>
                <input
                  type="number"
                  value={edu.graduationYear}
                  onChange={(e) => updateEducation(idx, { graduationYear: e.target.value })}
                  placeholder="2018"
                  min="1950"
                  max="2100"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>GPA</label>
                <input
                  type="text"
                  value={edu.gpa || ""}
                  onChange={(e) => updateEducation(idx, { gpa: e.target.value })}
                  placeholder="3.8/4.0"
                  className={field}
                />
              </div>
            </div>
            <div>
              <label className={label}>Relevant coursework</label>
              <input
                type="text"
                value={(edu.coursework || []).join(", ")}
                onChange={(e) => updateEducation(idx, {
                  coursework: e.target.value.split(",").map((c) => c.trim()).filter(Boolean),
                })}
                placeholder="Data Structures, Operating Systems, Databases"
                className={field}
              />
            </div>
            <div className="flex justify-end">
              <RemoveButton onClick={() => setResume((prev) => ({
                ...prev,
                education: prev.education.filter((_, i) => i !== idx),
              }))} />
            </div>
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section
        title="Skills"
        count={resume.skills.length}
        active={activeSection === "skills"}
        hint="Tools, languages, and strengths — comma separated"
        action={
          <FieldAIButton
            section="skills"
            value={skillsValue}
            context={`Roles: ${resume.experience.map((e) => `${e.title} at ${e.company}`).join("; ")}`}
            onApply={handleSkillsChange}
            label="Improve"
          />
        }
      >
        <textarea
          value={skillsValue}
          onChange={(e) => handleSkillsChange(e.target.value)}
          placeholder="React, TypeScript, Next.js, Node.js, PostgreSQL, AWS, Design systems"
          rows={3}
          className={field}
        />
        {resume.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((skill, idx) => (
              <span
                key={`${skill}-${idx}`}
                className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[11.5px] font-medium text-slate-600 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Projects */}
      <Section
        title="Projects"
        count={(resume.projects || []).length}
        active={activeSection === "projects"}
        hint="Optional — side projects that show your craft"
        action={<AddButton onClick={() => setResume((prev) => ({
          ...prev,
          projects: [...(prev.projects || []), { name: "", description: "", technologies: [] }],
        }))}>Add project</AddButton>}
      >
        {(resume.projects || []).length === 0 && (
          <p className="text-[12.5px] text-slate-400 dark:text-slate-500">No projects yet. Optional, but useful early in your career.</p>
        )}
        {(resume.projects || []).map((proj, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3.5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={label}>Project name</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(idx, { name: e.target.value })}
                  placeholder="Atlas — design system"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Tech</label>
                <input
                  type="text"
                  value={proj.technologies.join(", ")}
                  onChange={(e) =>
                    updateProject(idx, { technologies: e.target.value.split(",").map((t) => t.trim()) })
                  }
                  placeholder="React, TypeScript"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>GitHub / live link</label>
                <input
                  type="url"
                  value={proj.link || ""}
                  onChange={(e) => updateProject(idx, { link: e.target.value })}
                  placeholder="github.com/you/atlas"
                  className={field}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="text-[12px] font-semibold text-slate-600 dark:text-slate-300">One-line description</label>
                <FieldAIButton
                  section="project"
                  value={proj.description}
                  context={`${proj.name}. Tech: ${proj.technologies.join(", ")}`}
                  label="Improve"
                  onApply={(description) => updateProject(idx, { description })}
                />
              </div>
              <textarea
                value={proj.description}
                onChange={(e) => updateProject(idx, { description: e.target.value })}
                placeholder="An accessible 40-component React library used by 2,000+ developers."
                rows={2}
                className={field}
              />
              <div>
                <label className={label}>Project highlights · one per line</label>
                <textarea
                  value={(proj.bullets || []).join("\n")}
                  onChange={(e) => updateProject(idx, {
                    bullets: e.target.value.split("\n").filter((b) => b.trim()),
                  })}
                  placeholder={"Cut bundle size 38% by replacing the runtime CSS-in-JS layer\nReached 2.1k GitHub stars and 12k monthly installs"}
                  rows={2}
                  className={field}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <RemoveButton onClick={() => setResume((prev) => ({
                ...prev,
                projects: (prev.projects || []).filter((_, i) => i !== idx),
              }))} />
            </div>
          </div>
        ))}
      </Section>


      {/* Awards & leadership */}
      <Section
        title="Awards & leadership"
        count={(resume.awards || []).length}
        active={activeSection === "awards"}
        hint="Honors, scholarships, hackathons, leadership"
        action={<AddButton onClick={() => setResume((prev) => ({
          ...prev,
          awards: [...(prev.awards || []), ""],
        }))}>Add</AddButton>}
      >
        {(resume.awards || []).length === 0 && (
          <p className="text-[12.5px] text-slate-400 dark:text-slate-500">
            Optional, but useful for students and early-career candidates.
          </p>
        )}
        {(resume.awards || []).map((award, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={award}
              onChange={(e) => setResume((prev) => {
                const awards = [...(prev.awards || [])];
                awards[idx] = e.target.value;
                return { ...prev, awards };
              })}
              placeholder="Won 2nd place out of 50 teams at HackMIT"
              className={field}
            />
            <RemoveButton onClick={() => setResume((prev) => ({
              ...prev,
              awards: (prev.awards || []).filter((_, i) => i !== idx),
            }))} label="✕" />
          </div>
        ))}
      </Section>

      {/* Certifications */}
      <Section
        title="Certifications"
        count={(resume.certifications || []).length}
        active={activeSection === "certifications"}
        hint="Licenses, credentials, and courses"
        action={<AddButton onClick={() => setResume((prev) => ({
          ...prev,
          certifications: [...(prev.certifications || []), ""],
        }))}>Add</AddButton>}
      >
        {(resume.certifications || []).length === 0 && (
          <p className="text-[12.5px] text-slate-400 dark:text-slate-500">No certifications yet.</p>
        )}
        {(resume.certifications || []).map((cert, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={cert}
              onChange={(e) => setResume((prev) => {
                const certifications = [...(prev.certifications || [])];
                certifications[idx] = e.target.value;
                return { ...prev, certifications };
              })}
              placeholder="AWS Certified Solutions Architect"
              className={field}
            />
            <RemoveButton onClick={() => setResume((prev) => ({
              ...prev,
              certifications: (prev.certifications || []).filter((_, i) => i !== idx),
            }))} label="✕" />
          </div>
        ))}
      </Section>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          disabled={!prevTab}
          onClick={() => prevTab && setActiveSection(prevTab.key)}
          className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-[11.5px] font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-30"
        >
          ← {prevTab?.label ?? "Back"}
        </button>
        <span className="text-[10.5px] tabular-nums text-slate-400 dark:text-slate-500">
          {activeIndex + 1} / {EDITOR_TABS.length}
        </span>
        <button
          type="button"
          disabled={!nextTab}
          onClick={() => nextTab && setActiveSection(nextTab.key)}
          className="rounded-md bg-slate-900 dark:bg-white px-3 py-1.5 text-[11.5px] font-semibold text-white dark:text-slate-900 disabled:opacity-30"
        >
          {nextTab ? `${nextTab.label} →` : "Done"}
        </button>
      </div>
    </form>
  );
}
