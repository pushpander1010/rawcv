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
    <form className="space-y-8">
      {/* Contact Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={resume.contact.name}
              onChange={(e) => handleContactChange("name", e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={resume.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              placeholder="john@example.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={resume.contact.phone || ""}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={resume.contact.location || ""}
              onChange={(e) => handleContactChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              value={resume.contact.linkedin || ""}
              onChange={(e) => handleContactChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website
            </label>
            <input
              type="url"
              value={resume.contact.website || ""}
              onChange={(e) => handleContactChange("website", e.target.value)}
              placeholder="johndoe.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Professional Summary</h2>
        <textarea
          value={resume.summary || ""}
          onChange={(e) => handleSummaryChange(e.target.value)}
          placeholder="Brief overview of your professional background and goals..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </section>

      {/* Work Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Work Experience</h2>
          <button
            type="button"
            onClick={addExperience}
            className="text-sm px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
          >
            + Add
          </button>
        </div>

        {resume.experience.map((exp, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(idx, "company", e.target.value)}
                placeholder="Company name"
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(idx, "title", e.target.value)}
                placeholder="Job title"
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="month"
                value={exp.endDate === "Present" ? "" : exp.endDate}
                onChange={(e) => updateExperience(idx, "endDate", e.target.value || "Present")}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <button
              type="button"
              onClick={() => removeExperience(idx)}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education</h2>
          <button
            type="button"
            onClick={addEducation}
            className="text-sm px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
          >
            + Add
          </button>
        </div>

        {resume.education.map((edu, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3">
            <input
              type="text"
              value={edu.institution}
              onChange={(e) => updateEducation(idx, "institution", e.target.value)}
              placeholder="University name"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                placeholder="Degree (e.g., Bachelor of Science)"
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(idx, "field", e.target.value)}
                placeholder="Field of study"
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <input
              type="number"
              value={edu.graduationYear}
              onChange={(e) => updateEducation(idx, "graduationYear", e.target.value)}
              placeholder="Graduation year"
              min="1950"
              max="2100"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <button
              type="button"
              onClick={() => removeEducation(idx)}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Skills</h2>
        <textarea
          value={resume.skills.join(", ")}
          onChange={(e) => handleSkillsChange(e.target.value)}
          placeholder="Enter skills separated by commas&#10;e.g., JavaScript, React, Node.js, Python, AWS"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {resume.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Certifications */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Certifications</h2>
          <button
            type="button"
            onClick={addCertification}
            className="text-sm px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
          >
            + Add
          </button>
        </div>

        {(resume.certifications || []).map((cert, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={cert}
              onChange={(e) => updateCertification(idx, e.target.value)}
              placeholder="Certification name"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              onClick={() => removeCertification(idx)}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-2"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
          <button
            type="button"
            onClick={addProject}
            className="text-sm px-3 py-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
          >
            + Add
          </button>
        </div>

        {(resume.projects || []).map((proj, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3">
            <input
              type="text"
              value={proj.name}
              onChange={(e) => updateProject(idx, "name", e.target.value)}
              placeholder="Project name"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <textarea
              value={proj.description}
              onChange={(e) => updateProject(idx, "description", e.target.value)}
              placeholder="Project description"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
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
              placeholder="Technologies (comma-separated)"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <button
              type="button"
              onClick={() => removeProject(idx)}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      {/* Validation Error */}
      {errors.sections && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{errors.sections}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Clear All
        </button>
      </div>
    </form>
  );
}
