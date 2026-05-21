"use client";

import { useState, useCallback, useEffect } from "react";
import type { ParsedResume, WorkExperience, Education, Project } from "@/types";

interface Props {
  onResumeChange: (resume: ParsedResume) => void;
  initialResume?: ParsedResume;
}

const STORAGE_KEY = "free_resume_draft";

export default function FreeResumeForm({ onResumeChange, initialResume }: Props) {
  const [resume, setResume] = useState<ParsedResume>(
    initialResume || {
      contact: { name: "", email: "", phone: "", location: "", linkedin: "", website: "" },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      projects: [],
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    }, 500);
    return () => clearTimeout(timer);
  }, [resume]);

  // Notify parent of changes
  useEffect(() => {
    onResumeChange(resume);
  }, [resume, onResumeChange]);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!resume.contact.name.trim()) newErrors.name = "Name is required";
    if (!resume.contact.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.contact.email))
      newErrors.email = "Invalid email format";

    const hasExperience = resume.experience.length > 0;
    const hasEducation = resume.education.length > 0;
    const hasSkills = resume.skills.length > 0;

    if (!hasExperience && !hasEducation && !hasSkills) {
      newErrors.sections = "Add at least one section: experience, education, or skills";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [resume]);

  const handleContactChange = (field: keyof typeof resume.contact, value: string) => {
    setResume((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSummaryChange = (value: string) => {
    setResume((prev) => ({ ...prev, summary: value }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setResume((prev) => ({ ...prev, skills }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", title: "", startDate: "", endDate: "", bullets: [] },
      ],
    }));
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    setResume((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: "", degree: "", field: "", graduationYear: "" },
      ],
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setResume((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), { name: "", description: "", technologies: [] }],
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    setResume((prev) => {
      const updated = [...(prev.projects || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index: number) => {
    setResume((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [...(prev.certifications || []), ""],
    }));
  };

  const updateCertification = (index: number, value: string) => {
    setResume((prev) => {
      const updated = [...(prev.certifications || [])];
      updated[index] = value;
      return { ...prev, certifications: updated };
    });
  };

  const removeCertification = (index: number) => {
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index),
    }));
  };

  const handleClear = () => {
    if (confirm("Clear all data? This cannot be undone.")) {
      setResume({
        contact: { name: "", email: "", phone: "", location: "", linkedin: "", website: "" },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
      });
      localStorage.removeItem(STORAGE_KEY);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form className="space-y-10">
      {/* Contact Info */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">
          Contact Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              value={resume.contact.name}
              onChange={(e) => handleContactChange("name", e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
            />
            {touched.name && errors.name && (
              <p className="mt-1.5 text-xs text-red-600 font-medium dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              value={resume.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
            />
            {touched.email && errors.email && (
              <p className="mt-1.5 text-xs text-red-600 font-medium dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={resume.contact.phone || ""}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={resume.contact.location || ""}
              onChange={(e) => handleContactChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={resume.contact.linkedin || ""}
              onChange={(e) => handleContactChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Personal Website
            </label>
            <input
              type="url"
              value={resume.contact.website || ""}
              onChange={(e) => handleContactChange("website", e.target.value)}
              placeholder="johndoe.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">
          Professional Summary
        </h2>
        <textarea
          value={resume.summary || ""}
          onChange={(e) => handleSummaryChange(e.target.value)}
          placeholder="Write a brief overview of your professional background, core strengths, and career goals..."
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
        />
      </section>

      {/* Work Experience */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Work Experience
          </h2>
          <button
            type="button"
            onClick={addExperience}
            className="text-sm px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/75 border border-violet-200/50 dark:border-violet-800/30 font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(idx, "company", e.target.value)}
                  placeholder="Company name"
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
                />
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(idx, "title", e.target.value)}
                  placeholder="Job title"
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Start Month & Year</label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">End Month & Year</label>
                  <input
                    type="month"
                    value={exp.endDate === "Present" ? "" : exp.endDate}
                    onChange={(e) => updateExperience(idx, "endDate", e.target.value || "Present")}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              <textarea
                value={exp.bullets.join("\n")}
                onChange={(e) =>
                  updateExperience(
                    idx,
                    "bullets",
                    e.target.value.split("\n").filter((b) => b.trim())
                  )
                }
                placeholder="Bullet points (one per line)&#10;• Achieved X by doing Y&#10;• Led Z initiative"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => removeExperience(idx)}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl text-red-600 hover:text-red-750 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Education
          </h2>
          <button
            type="button"
            onClick={addEducation}
            className="text-sm px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/75 border border-violet-200/50 dark:border-violet-800/30 font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {resume.education.map((edu, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                placeholder="University name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                  placeholder="Degree (e.g., Bachelor of Science)"
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
                />
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(idx, "field", e.target.value)}
                  placeholder="Field of study"
                  className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
                />
              </div>

              <input
                type="number"
                value={edu.graduationYear}
                onChange={(e) => updateEducation(idx, "graduationYear", e.target.value)}
                placeholder="Graduation year (e.g., 2024)"
                min="1950"
                max="2100"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl text-red-600 hover:text-red-750 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">
          Skills
        </h2>
        <textarea
          value={resume.skills.join(", ")}
          onChange={(e) => handleSkillsChange(e.target.value)}
          placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, Python, AWS)"
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
        />
        {resume.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900/30 text-xs font-semibold shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Certifications */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Certifications
          </h2>
          <button
            type="button"
            onClick={addCertification}
            className="text-sm px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/75 border border-violet-200/50 dark:border-violet-800/30 font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Certification
          </button>
        </div>

        <div className="space-y-3">
          {(resume.certifications || []).map((cert, idx) => (
            <div key={idx} className="flex gap-3">
              <input
                type="text"
                value={cert}
                onChange={(e) => updateCertification(idx, e.target.value)}
                placeholder="Certification name (e.g., AWS Certified Solutions Architect)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeCertification(idx)}
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-2.5 rounded-xl text-red-600 hover:text-red-750 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Projects
          </h2>
          <button
            type="button"
            onClick={addProject}
            className="text-sm px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/75 border border-violet-200/50 dark:border-violet-800/30 font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </div>

        <div className="space-y-4">
          {(resume.projects || []).map((proj, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
              <input
                type="text"
                value={proj.name}
                onChange={(e) => updateProject(idx, "name", e.target.value)}
                placeholder="Project name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
              />

              <textarea
                value={proj.description}
                onChange={(e) => updateProject(idx, "description", e.target.value)}
                placeholder="Brief project description and key accomplishments..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
              />

              <input
                type="text"
                value={proj.technologies.join(", ")}
                onChange={(e) =>
                  updateProject(
                    idx,
                    "technologies",
                    e.target.value.split(",").map((t) => t.trim())
                  )
                }
                placeholder="Technologies used (comma-separated, e.g., React, TypeScript, TailwindCSS)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 shadow-sm"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl text-red-600 hover:text-red-750 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Validation Error */}
      {errors.sections && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.sections}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={handleClear}
          className="px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-semibold flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All Data
        </button>
      </div>
    </form>
  );
}
