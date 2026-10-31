"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ParsedResume, WorkExperience, Education, Project } from "@/types";
import FieldAIButton from "@/components/FieldAIButton";
import {
  normalizeSectionOrder,
  DEFAULT_SECTION_ORDER,
  SECTION_LABELS,
} from "@/lib/section-order";

interface Props {
  onResumeChange: (resume: ParsedResume) => void;
  initialResume?: ParsedResume;
}

const field =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-[16px] sm:text-[13.5px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 transition-colors";

const label = "block text-[12px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5";

const emptyResume = (): ParsedResume => ({
  contact: { name: "", email: "", phone: "", location: "", linkedin: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
});

function Section({
  title,
  hint,
  count,
  defaultOpen,
  action,
  children,
}: {
  title: string;
  hint?: string;
  count?: number;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 select-none [&::-webkit-details-marker]:hidden">
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2">
            <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white">{title}</span>
            {typeof count === "number" && count > 0 && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                {count}
              </span>
            )}
          </span>
          {hint && <span className="mt-0.5 block text-[11.5px] text-slate-400 dark:text-slate-500">{hint}</span>}
        </span>
        {action && <span onClick={(e) => e.preventDefault()}>{action}</span>}
        <svg
          className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-3.5">{children}</div>
    </details>
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

export default function FreeResumeForm({ onResumeChange, initialResume }: Props) {
  const [resume, setResume] = useState<ParsedResume>(initialResume || emptyResume());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      setResume(initialResume);
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
    setResume((prev) => ({ ...prev, sectionOrder: next }));
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

  return (
    <form className="space-y-2.5" onSubmit={(e) => e.preventDefault()}>
      {/* Contact — always open */}
      <Section title="Your details" hint="Name, email, and how employers reach you" defaultOpen>
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
        defaultOpen
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
          placeholder="Senior product designer with 7 years shipping consumer apps. Led design systems used by 40+ engineers and raised activation by 24%."
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
        hint="Roles, dates, and results — newest first"
        defaultOpen={resume.experience.length > 0}
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
            <div className="grid grid-cols-2 gap-3">
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
        hint="Degree, school, and graduation year"
        defaultOpen={resume.education.length > 0}
        action={<AddButton onClick={() => setResume((prev) => ({
          ...prev,
          education: [...prev.education, { institution: "", degree: "", field: "", graduationYear: "" }],
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
            <div className="flex items-end gap-3">
              <div className="w-32">
                <label className={label}>Year</label>
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
              <div className="ml-auto pb-2">
                <RemoveButton onClick={() => setResume((prev) => ({
                  ...prev,
                  education: prev.education.filter((_, i) => i !== idx),
                }))} />
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section
        title="Skills"
        count={resume.skills.length}
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
        hint="Optional — side projects that show your craft"
        defaultOpen={(resume.projects || []).length > 0}
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

      {/* Certifications */}
      <Section
        title="Certifications"
        count={(resume.certifications || []).length}
        hint="Licenses, credentials, and courses"
        defaultOpen={(resume.certifications || []).length > 0}
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

      {/* Section order */}
      <details className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 select-none [&::-webkit-details-marker]:hidden">
          <span className="flex-1">
            <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Section order</span>
            <span className="mt-0.5 block text-[11.5px] text-slate-400 dark:text-slate-500">
              Move sections up or down on the page.
            </span>
          </span>
          <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </summary>
        <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-1">
          {sectionOrder.map((key, idx) => (
            <div key={key} className="flex items-center justify-between gap-2 px-1.5 py-1">
              <span className="text-[12.5px] font-medium text-slate-700 dark:text-slate-200">{SECTION_LABELS[key]}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveSection(idx, "up")}
                  disabled={idx === 0}
                  aria-label={`Move ${SECTION_LABELS[key]} up`}
                  className="h-7 w-7 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-[12px]"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(idx, "down")}
                  disabled={idx === sectionOrder.length - 1}
                  aria-label={`Move ${SECTION_LABELS[key]} down`}
                  className="h-7 w-7 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-[12px]"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </details>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleClear}
          className="text-[11.5px] font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          Clear all data
        </button>
      </div>
    </form>
  );
}
