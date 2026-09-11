"use client";

import { useState } from "react";
import { useResume } from "@/context/ResumeContext";

/**
 * Quick edit panel that sits under the resume preview.
 * Edit or delete individual bullets, skills, entries — without scrolling
 * through the full builder form. Every change is undoable.
 */
export default function PreviewQuickEdit() {
  const { state, setState, pushUndo } = useResume();
  const resume = state.parsed;

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [draftInstitution, setDraftInstitution] = useState("");
  const [draftDegree, setDraftDegree] = useState("");
  const [draftField, setDraftField] = useState("");
  const [draftYear, setDraftYear] = useState("");
  const [newBullet, setNewBullet] = useState<Record<number, string>>({});

  if (!resume) return null;

  const hasContent =
    (resume.summary?.trim() ? 1 : 0) +
      resume.experience.length +
      resume.education.length +
      resume.skills.length +
      (resume.certifications?.length ?? 0) +
      (resume.projects?.length ?? 0) >
    0;

  function startEdit(key: string, current: string) {
    setEditingKey(key);
    setDraft(current);
  }

  function cancelEdit() {
    setEditingKey(null);
    setDraft("");
  }

  function update(fn: (prev: NonNullable<typeof resume>) => NonNullable<typeof resume>) {
    pushUndo();
    setState((prev) => {
      if (!prev.parsed) return prev;
      return { ...prev, parsed: fn({ ...prev.parsed }) };
    });
    cancelEdit();
  }

  function remove(fn: (prev: NonNullable<typeof resume>) => NonNullable<typeof resume>) {
    pushUndo();
    setState((prev) => {
      if (!prev.parsed) return prev;
      return { ...prev, parsed: fn({ ...prev.parsed }) };
    });
  }

  if (!hasContent) {
    return (
      <p className="text-[13px] text-slate-500 dark:text-slate-400">
        Nothing to edit yet — add details in the form and they will appear here for quick edits.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      {resume.summary?.trim() ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
            Summary
          </p>
          {editingKey === "summary" ? (
            <EditBox
              value={draft}
              onChange={setDraft}
              onSave={() => update((p) => ({ ...p, summary: draft.trim() }))}
              onCancel={cancelEdit}
            />
          ) : (
            <div className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2">
              <p className="text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed flex-1 line-clamp-3">
                {resume.summary}
              </p>
              <RowButtons
                onEdit={() => startEdit("summary", resume.summary ?? "")}
                onDelete={() => remove((p) => ({ ...p, summary: "" }))}
              />
            </div>
          )}
        </div>
      ) : null}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
            Experience
          </p>
          <div className="space-y-2.5">
            {resume.experience.map((job, i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-snug">
                    {job.title || "Untitled role"}
                    {job.company ? (
                      <span className="font-normal text-slate-500 dark:text-slate-400"> @ {job.company}</span>
                    ) : null}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete "${job.title || "this role"}"${job.company ? ` at ${job.company}` : ""}?`)) {
                        remove((p) => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }));
                      }
                    }}
                    className="shrink-0 text-xs font-semibold text-red-600 dark:text-red-300 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    Delete job
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {job.bullets.map((b, j) => {
                    const key = `exp-${i}-bullet-${j}`;
                    return (
                      <li key={j}>
                        {editingKey === key ? (
                          <EditBox
                            value={draft}
                            onChange={setDraft}
                            onSave={() =>
                              update((p) => ({
                                ...p,
                                experience: p.experience.map((e, ej) =>
                                  ej === i
                                    ? { ...e, bullets: e.bullets.map((bb, bj) => (bj === j ? draft.trim() : bb)) }
                                    : e
                                ),
                              }))
                            }
                            onCancel={cancelEdit}
                          />
                        ) : (
                          <div className="flex items-start justify-between gap-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5">
                            <p className="text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed flex-1">
                              {b}
                            </p>
                            <RowButtons
                              onEdit={() => startEdit(key, b)}
                              onDelete={() =>
                                remove((p) => ({
                                  ...p,
                                  experience: p.experience.map((e, ej) =>
                                    ej === i ? { ...e, bullets: e.bullets.filter((_, bj) => bj !== j) } : e
                                  ),
                                }))
                              }
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newBullet[i] ?? ""}
                    onChange={(e) => setNewBullet((prev) => ({ ...prev, [i]: e.target.value }))}
                    placeholder="Add a bullet point…"
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  />
                  <button
                    type="button"
                    disabled={!(newBullet[i] ?? "").trim()}
                    onClick={() => {
                      const text = (newBullet[i] ?? "").trim();
                      if (!text) return;
                      pushUndo();
                      setState((prev) => {
                        if (!prev.parsed) return prev;
                        return {
                          ...prev,
                          parsed: {
                            ...prev.parsed,
                            experience: prev.parsed.experience.map((e, ej) =>
                              ej === i ? { ...e, bullets: [...e.bullets, text] } : e
                            ),
                          },
                        };
                      });
                      setNewBullet((prev) => ({ ...prev, [i]: "" }));
                    }}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s, i) => {
              const key = `skill-${i}`;
              return editingKey === key ? (
                <div key={i} className="flex gap-1.5 items-center w-full">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-brand-500 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <MiniSaveCancel
                    onSave={() =>
                      update((p) => ({ ...p, skills: p.skills.map((ss, si) => (si === i ? draft.trim() || ss : ss)) }))
                    }
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 text-xs font-semibold"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => startEdit(key, s)}
                    title="Edit skill"
                    aria-label={`Edit skill ${s}`}
                    className="px-1.5 py-0.5 rounded-full hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove((p) => ({ ...p, skills: p.skills.filter((_, si) => si !== i) }))}
                    title="Delete skill"
                    aria-label={`Delete skill ${s}`}
                    className="w-5 h-5 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 transition-colors font-bold"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
            Education
          </p>
          <div className="space-y-1.5">
            {resume.education.map((edu, i) => {
              const key = `edu-${i}`;
              return (
                <div
                  key={i}
                  className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  {editingKey === key ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={draftInstitution}
                        onChange={(e) => setDraftInstitution(e.target.value)}
                        placeholder="Institution"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={draftDegree}
                          onChange={(e) => setDraftDegree(e.target.value)}
                          placeholder="Degree"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                        />
                        <input
                          type="text"
                          value={draftField}
                          onChange={(e) => setDraftField(e.target.value)}
                          placeholder="Field"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <input
                          type="text"
                          value={draftYear}
                          onChange={(e) => setDraftYear(e.target.value)}
                          placeholder="Year"
                          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                        />
                        <MiniSaveCancel
                          onSave={() =>
                            update((p) => ({
                              ...p,
                              education: p.education.map((ee, ei) =>
                                ei === i
                                  ? { ...ee, institution: draftInstitution.trim(), degree: draftDegree.trim(), field: draftField.trim(), graduationYear: draftYear.trim() }
                                  : ee
                              ),
                            }))
                          }
                          onCancel={cancelEdit}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] text-slate-700 dark:text-slate-200 flex-1">
                        {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}
                        {edu.institution ? ` — ${edu.institution}` : ""}
                        {edu.graduationYear ? ` (${edu.graduationYear})` : ""}
                      </p>
                      <RowButtons
                        onEdit={() => {
                          startEdit(key, "");
                          setDraftInstitution(edu.institution || "");
                          setDraftDegree(edu.degree || "");
                          setDraftField(edu.field || "");
                          setDraftYear(edu.graduationYear || "");
                        }}
                        onDelete={() => remove((p) => ({ ...p, education: p.education.filter((_, ei) => ei !== i) }))}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects */}
      {(resume.projects?.length ?? 0) > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
            Projects
          </p>
          <div className="space-y-1.5">
            {(resume.projects ?? []).map((proj, i) => {
              const key = `proj-${i}`;
              return (
                <div
                  key={i}
                  className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white flex-1">
                      {proj.name || "Untitled project"}
                    </p>
                    <RowButtons
                      onEdit={() => startEdit(key, proj.description || "")}
                      onDelete={() =>
                        remove((p) => ({ ...p, projects: (p.projects ?? []).filter((_, pi) => pi !== i) }))
                      }
                    />
                  </div>
                  {editingKey === key ? (
                    <div className="mt-1.5">
                      <EditBox
                        value={draft}
                        onChange={setDraft}
                        onSave={() =>
                          update((p) => ({
                            ...p,
                            projects: (p.projects ?? []).map((pp, pi) =>
                              pi === i ? { ...pp, description: draft.trim() } : pp
                            ),
                          }))
                        }
                        onCancel={cancelEdit}
                      />
                    </div>
                  ) : proj.description ? (
                    <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                      {proj.description}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certifications */}
      {(resume.certifications?.length ?? 0) > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
            Certifications
          </p>
          <div className="space-y-1.5">
            {(resume.certifications ?? []).map((c, i) => {
              const key = `cert-${i}`;
              return editingKey === key ? (
                <div key={i} className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-brand-500 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <MiniSaveCancel
                    onSave={() =>
                      update((p) => ({
                        ...p,
                        certifications: (p.certifications ?? []).map((cc, ci) =>
                          ci === i ? draft.trim() || cc : cc
                        ),
                      }))
                    }
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  <p className="text-[13px] text-slate-700 dark:text-slate-200 flex-1">{c}</p>
                  <RowButtons
                    onEdit={() => startEdit(key, c)}
                    onDelete={() =>
                      remove((p) => ({ ...p, certifications: (p.certifications ?? []).filter((_, ci) => ci !== i) }))
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function RowButtons({
  onEdit,
  onDelete,
  editLabel = "Edit",
}: {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
}) {
  return (
    <span className="shrink-0 inline-flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        className="text-xs font-semibold text-brand-600 dark:text-brand-300 hover:text-brand-700 px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
      >
        {editLabel}
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete"
        className="text-xs font-semibold text-red-600 dark:text-red-300 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
      >
        Delete
      </button>
    </span>
  );
}

function EditBox({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        autoFocus
        className="w-full px-2.5 py-1.5 rounded-lg border border-brand-500 bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <div className="flex gap-1.5 mt-1.5">
        <button
          type="button"
          onClick={onSave}
          disabled={!value.trim()}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function MiniSaveCancel({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <span className="shrink-0 inline-flex items-center gap-1">
      <button
        type="button"
        onClick={onSave}
        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
      >
        Cancel
      </button>
    </span>
  );
}
