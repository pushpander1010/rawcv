import type {
  ParsedResume,
  ThemeId,
  TailorChange,
  LanguageProficiency,
  ResumeTypography,
  WorkExperience,
  Education as EducationEntry,
  Project,
} from "@/types";
import {
  DEFAULT_TYPOGRAPHY,
  RESUME_FONT_STACKS,
  normalizeTypography,
} from "@/types";
import { sanitizeResume as sanitizeResumeUtil } from "@/lib/sanitize-resume";
import { normalizeSectionOrder, type ResumeSectionKey } from "@/lib/section-order";
import { RESUME_CSS } from "@/lib/resume-styles";
import { formatDateRange, formatResumeDate } from "@/lib/format-date";

/** Merge accepted TailorChanges into a ParsedResume copy. */
export function applyChanges(
  resume: ParsedResume,
  changes: TailorChange[] = []
): ParsedResume {
  const accepted = changes.filter((c) => c.accepted);
  if (accepted.length === 0) return resume;

  const result: ParsedResume = JSON.parse(JSON.stringify(resume));

  for (const change of accepted) {
    const f = change.field;

    if (change.section === "summary" && f === "summary") {
      result.summary = change.tailored;
      continue;
    }

    if (change.section === "experience") {
      const bulletMatch = f.match(/^experience\[(\d+)\]\.bullets\[(\d+)\]$/);
      if (bulletMatch) {
        const ei = parseInt(bulletMatch[1], 10);
        const bi = parseInt(bulletMatch[2], 10);
        if (result.experience[ei]?.bullets[bi] !== undefined) {
          result.experience[ei].bullets[bi] = change.tailored;
        }
      }
      continue;
    }

    if (change.section === "skills" && f === "skills") {
      try {
        const skills = JSON.parse(change.tailored);
        if (Array.isArray(skills)) result.skills = skills.map(String);
      } catch { /* skip malformed */ }
      continue;
    }

    if (change.section === "projects") {
      const nameMatch = f.match(/^projects\[(\d+)\]\.name$/);
      const descMatch = f.match(/^projects\[(\d+)\]\.description$/);
      const techMatch = f.match(/^projects\[(\d+)\]\.technologies$/);
      if (nameMatch) {
        const pi = parseInt(nameMatch[1], 10);
        if (result.projects?.[pi]) result.projects[pi].name = change.tailored;
      } else if (descMatch) {
        const pi = parseInt(descMatch[1], 10);
        if (result.projects?.[pi]) result.projects[pi].description = change.tailored;
      } else if (techMatch) {
        const pi = parseInt(techMatch[1], 10);
        try {
          const tech = JSON.parse(change.tailored);
          if (Array.isArray(tech) && result.projects?.[pi]) {
            result.projects[pi].technologies = tech.map(String);
          }
        } catch { /* skip */ }
      }
      continue;
    }

    if (change.section === "certifications" && f === "certifications") {
      try {
        const certs = JSON.parse(change.tailored);
        if (Array.isArray(certs)) result.certifications = certs.map(String);
      } catch { /* skip */ }
      continue;
    }

    if (change.section === "awards" && f === "awards") {
      try {
        const awards = JSON.parse(change.tailored);
        if (Array.isArray(awards)) result.awards = awards.map(String);
      } catch { /* skip */ }
    }
  }

  return result;
}

// ─── Text helpers ─────────────────────────────────────────────────────────────

/** Escape HTML special characters */
function esc(str: string | undefined | null | number | boolean): string {
  if (str === undefined || str === null || str === "") return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Contact helpers ──────────────────────────────────────────────────────────

function contactHref(type: string, value: string): string | null {
  const v = value.trim();
  switch (type) {
    case "email": return v.startsWith("mailto:") ? v : `mailto:${v}`;
    case "phone": return `tel:${v.replace(/[^+\d]/g, "")}`;
    case "linkedin":
      if (v.startsWith("http")) return v;
      if (v.includes("linkedin.com")) return `https://${v.replace(/^(https?:\/\/)?(www\.)?/, "")}`;
      return `https://linkedin.com/in/${v.replace(/^@/, "")}`;
    case "github":
      if (v.startsWith("http")) return v;
      if (v.includes("github.com")) return `https://${v.replace(/^(https?:\/\/)?(www\.)?/, "")}`;
      return `https://github.com/${v.replace(/^@/, "")}`;
    case "website":
      if (v.startsWith("http")) return v;
      return `https://${v.replace(/^(www\.)?/, "")}`;
    default: return null;
  }
}

function contactValue(type: string, value: string): string {
  if (type === "linkedin") return "LinkedIn";
  if (type === "github") {
    return "GitHub";
  }
  if (type === "website") {
    try {
      return new URL(value.startsWith("http") ? value : `https://${value}`)
        .hostname.replace(/^www\./, "");
    } catch {
      return value;
    }
  }
  return value;
}

function contactLink(type: string, value?: string): string {
  if (!value?.trim()) return "";
  const v = value.trim();
  const label = esc(contactValue(type, v));
  const href = contactHref(type, v);
  if (!href) return `<span class="rcv-ci">${label}</span>`;
  return `<span class="rcv-ci"><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}</a></span>`;
}

function contactLine(contact: ParsedResume["contact"], separator = "·"): string {
  const parts = [
    contactLink("email", contact.email),
    contactLink("phone", contact.phone),
    contactLink("location", contact.location),
    contactLink("linkedin", contact.linkedin),
    contactLink("github", contact.github),
    contactLink("website", contact.website),
  ].filter(Boolean);
  return parts.join(`<span class="rcv-sep">${separator}</span>`);
}

function initials(name: string): string {
  if (!name.trim()) return "CV";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatar(r: ParsedResume, cls = "rcv-avatar"): string {
  if (r.photo) {
    return `<img class="${cls} rcv-photo" src="${esc(r.photo)}" alt="${esc(r.contact.name)}" />`;
  }
  return `<div class="${cls}">${esc(initials(r.contact.name))}</div>`;
}

// ─── Entry builders ───────────────────────────────────────────────────────────

function bulletsHtml(items: string[], variant = ""): string {
  const list = items.filter((b) => b && b.trim());
  if (!list.length) return "";
  return `<ul class="rcv-bullets ${variant}">${list
    .map((b) => `<li>${esc(b)}</li>`)
    .join("")}</ul>`;
}

function jobHtml(
  job: WorkExperience,
  opts: { rail?: boolean; bullets?: string } = {}
): string {
  const title = job.title?.trim();
  const company = job.company?.trim();
  const location = job.location?.trim();
  const heading = title || company;
  if (!heading && !job.bullets.length) return "";

  // Compact one-line header: "Title (Company) · Location". The organisation and
  // location sit inline with the job title instead of on a separate line, so
  // each role uses one less line and the page packs in more content.
  const inlineMeta: string[] = [];
  if (company && title) {
    inlineMeta.push(`<span class="rcv-org">(${esc(company)})</span>`);
  }
  if (location) {
    inlineMeta.push(`<span class="rcv-loc">${esc(location)}</span>`);
  }
  const meta = inlineMeta.length
    ? ` <span class="rcv-inline-meta">${inlineMeta.join('<span class="rcv-dot">·</span>')}</span>`
    : "";

  const dates = esc(formatDateRange(job.startDate, job.endDate));
  const bullets = bulletsHtml(job.bullets, opts.bullets);
  const titleHtml = `<div class="rcv-job-title">${esc(heading)}${meta}</div>`;
  const rowHtml = `
    <div class="rcv-row">
      ${titleHtml}
      <div class="rcv-date">${dates}</div>
    </div>`;

  if (opts.rail) {
    // The left rail already owns the date — don't render it a second time.
    return `<div class="rcv-item rcv-with-date">
      <div class="rcv-date">${dates}</div>
      <div>${titleHtml}${bullets}</div>
    </div>`;
  }
  return `<div class="rcv-item rcv-job">${rowHtml}${bullets}</div>`;
}

function educationHtml(edu: EducationEntry, opts: { rail?: boolean } = {}): string {
  const degree = edu.degree?.trim();
  const field = edu.field?.trim();
  const degreeLine = degree && field
    ? / in /i.test(degree) ? degree : `${degree} in ${field}`
    : degree || field;
  if (!degreeLine && !edu.institution) return "";

  // Compact: degree + institution on one line; GPA/coursework fold into a single
  // note line instead of stacking one line each.
  const head = [
    degreeLine ? `<span class="rcv-degree">${esc(degreeLine)}</span>` : "",
    edu.institution ? `<span class="rcv-school">${esc(edu.institution)}</span>` : "",
  ]
    .filter(Boolean)
    .join('<span class="rcv-dot">·</span>');
  const notes = [
    edu.gpa ? `GPA: ${esc(edu.gpa)}` : "",
    edu.coursework?.length ? `Coursework: ${edu.coursework.map(esc).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const noteLine = notes ? `<div class="rcv-note">${notes}</div>` : "";
  const dates = esc(formatResumeDate(edu.graduationYear));

  const body = `
    <div class="rcv-row">
      <div><div class="rcv-edu-head">${head}</div>${noteLine}</div>
      <div class="rcv-date">${dates}</div>
    </div>`;

  if (opts.rail) {
    return `<div class="rcv-item rcv-with-date">
      <div class="rcv-date">${dates}</div>
      <div><div class="rcv-edu-head">${head}</div>${noteLine}</div>
    </div>`;
  }
  return `<div class="rcv-item rcv-edu">${body}</div>`;
}

function projectHtml(project: Project): string {
  if (!project.name && !project.description) return "";
  const tech = project.technologies?.filter((t) => t.trim()) ?? [];
  const link = project.link
    ? (() => {
        const href = project.link!.startsWith("http") ? project.link! : `https://${project.link}`;
        let label = "Link";
        try {
          const url = new URL(href);
          label = `${url.hostname.replace(/^www\./, "")}${url.pathname.replace(/\/$/, "")}`;
        } catch { label = project.link!; }
        return `<a class="rcv-proj-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
      })()
    : "";
  // Compact: tech stack sits inline with the project name (no separate line).
  const techInline = tech.length
    ? ` <span class="rcv-dot">|</span> <span class="rcv-tech">${tech
        .map(esc)
        .join('<span class="rcv-dot">·</span>')}</span>`
    : "";
  const bullets = bulletsHtml(project.bullets ?? []);
  return `<div class="rcv-item rcv-proj">
    <div class="rcv-proj-name">${esc(project.name)}${link ? ` <span class="rcv-dot">|</span> ${link}` : ""}${techInline}</div>
    ${project.description ? `<p class="rcv-desc">${esc(project.description)}</p>` : ""}
    ${bullets}
  </div>`;
}

function certificationsHtml(items?: string[]): string {
  const list = (items ?? []).filter((c) => c && c.trim());
  if (!list.length) return "";
  return `<ul class="rcv-cert-list">${list
    .map((c) => `<li class="rcv-cert">${esc(c)}</li>`)
    .join("")}</ul>`;
}


const SKILL_GROUPS: Array<{ label: string; keys: string[] }> = [
  { label: "Languages", keys: ["python", "java", "javascript", "typescript", "c++", "c#", "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "scala", "sql", "bash", "r"] },
  { label: "Frameworks", keys: ["react", "next.js", "nextjs", "vue", "angular", "svelte", "node", "express", "django", "flask", "fastapi", "spring", "rails", "laravel", ".net", "graphql", "redux", "tailwind"] },
  { label: "Cloud & DevOps", keys: ["aws", "gcp", "azure", "docker", "kubernetes", "terraform", "jenkins", "ci/cd", "github actions", "linux", "cloud", "lambda", "ec2", "s3"] },
  { label: "Data", keys: ["postgres", "postgresql", "mysql", "mongodb", "redis", "dynamodb", "snowflake", "bigquery", "kafka", "spark", "hadoop", "elasticsearch", "database", "sql"] },
  { label: "Tools", keys: ["git", "github", "figma", "jira", "storybook", "webpack", "vite", "jest", "cypress", "postman", "datadog", "grafana"] },
];

/** Group flat skills into the category lines used by engineering resumes. */
function groupedSkillsHtml(skills: string[]): string {
  const groups = new Map<string, string[]>();
  const used = new Set<string>();
  for (const group of SKILL_GROUPS) {
    for (const skill of skills) {
      if (used.has(skill)) continue;
      const lower = skill.toLowerCase();
      if (group.keys.some((k) => lower === k || (k.length > 3 && lower.includes(k)))) {
        if (!groups.has(group.label)) groups.set(group.label, []);
        groups.get(group.label)!.push(skill);
        used.add(skill);
      }
    }
  }
  const rest = skills.filter((s) => !used.has(s));
  if (rest.length) groups.set("Additional", rest);
  return `<div class="rcv-skill-groups">${Array.from(groups.entries())
    .map(([label, items]) => `<p><b>${esc(label)}:</b> ${items.map(esc).join(", ")}</p>`)
    .join("")}</div>`;
}

function skillsHtml(skills: string[], style: "tags" | "line" | "plain" | "comma" | "grouped" = "tags"): string {
  const list = skills.filter((s) => s.trim());
  if (!list.length) return "";
  if (style === "grouped") {
    return groupedSkillsHtml(list);
  }
  if (style === "comma") {
    return `<p class="rcv-skill-line">${list.map(esc).join(", ")}</p>`;
  }
  if (style === "line") {
    return `<p class="rcv-skill-line">${list
      .map(esc)
      .join('<span class="rcv-sep">·</span>')}</p>`;
  }
  const cls = style === "plain" ? "rcv-tags rcv-tags--plain" : "rcv-tags";
  return `<div class="${cls}">${list
    .map((s) => `<span class="rcv-tag">${esc(s)}</span>`)
    .join("")}</div>`;
}

const LEVEL_LABEL: Record<LanguageProficiency["level"], string> = {
  basic: "A1 · Basic",
  elementary: "A2 · Elementary",
  intermediate: "B1 · Intermediate",
  "upper-intermediate": "B2 · Upper intermediate",
  advanced: "C1 · Advanced",
  fluent: "C2 · Proficient",
  native: "Native",
  bilingual: "Bilingual",
};

function languagesHtml(languages?: LanguageProficiency[]): string {
  const list = (languages ?? []).filter((l) => l.language?.trim());
  if (!list.length) return "";
  return list
    .map(
      (l) => `<div class="rcv-lang"><b>${esc(l.language)}</b><span>${esc(
        LEVEL_LABEL[l.level] ?? l.level
      )}</span></div>`
    )
    .join("");
}

function interestsHtml(interests?: string[]): string {
  const list = (interests ?? []).filter((i) => i?.trim());
  if (!list.length) return "";
  return `<p class="rcv-inline-list">${list.map(esc).join('<span class="rcv-sep">·</span>')}</p>`;
}

// ─── Section composition ──────────────────────────────────────────────────────

type Labels = Partial<Record<ResumeSectionKey, string>>;
interface SectionOptions {
  skills?: "tags" | "line" | "plain" | "comma" | "grouped";
  bullets?: string;
  rail?: boolean;
  summaryClass?: string;
}

const DEFAULT_LABELS: Record<ResumeSectionKey, string> = {
  summary: "Profile",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Selected Projects",
  awards: "Awards & Leadership",
  certifications: "Certifications",
};

function sectionWrapper(title: string, body: string, extra = ""): string {
  if (!body) return "";
  return `<section class="rcv-section ${extra}"><h2 class="rcv-h">${esc(title)}</h2>${body}</section>`;
}

function sectionForKey(
  key: ResumeSectionKey,
  r: ParsedResume,
  labels: Labels = {},
  opts: SectionOptions = {}
): string {
  const title = labels[key] ?? DEFAULT_LABELS[key];
  switch (key) {
    case "summary":
      return r.summary?.trim()
        ? sectionWrapper(
            title,
            `<p class="rcv-desc rcv-summary ${opts.summaryClass ?? ""}">${esc(r.summary)}</p>`
          )
        : "";
    case "experience": {
      const body = r.experience.map((j) => jobHtml(j, opts)).join("");
      return body ? sectionWrapper(title, body) : "";
    }
    case "education": {
      const body = r.education.map((e) => educationHtml(e, { rail: opts.rail })).join("");
      return body ? sectionWrapper(title, body) : "";
    }
    case "skills":
      return sectionWrapper(title, skillsHtml(r.skills, opts.skills));
    case "projects": {
      const body = (r.projects ?? []).map(projectHtml).join("");
      return body ? sectionWrapper(title, body) : "";
    }
    case "awards":
      return sectionWrapper(title, certificationsHtml(r.awards));
    case "certifications":
      return sectionWrapper(title, certificationsHtml(r.certifications));
    default:
      return "";
  }
}

function renderOrdered(
  r: ParsedResume,
  keys: ResumeSectionKey[],
  labels: Labels,
  opts: SectionOptions = {}
): string {
  return keys.map((k) => sectionForKey(k, r, labels, opts)).join("");
}

function languagesSection(r: ParsedResume, title = "Languages"): string {
  const body = languagesHtml(r.languages);
  return body ? sectionWrapper(title, body) : "";
}

function interestsSection(r: ParsedResume, title = "Interests"): string {
  const body = interestsHtml(r.interests);
  return body ? sectionWrapper(title, body) : "";
}

function pick(order: ResumeSectionKey[], keys: ResumeSectionKey[]): ResumeSectionKey[] {
  return order.filter((k) => keys.includes(k));
}

function roleLine(r: ParsedResume): string {
  const role = r.experience[0]?.title?.trim();
  return role ? `<div class="rcv-role">${esc(role)}</div>` : "";
}

// ═════════════════════════════════════════════════════════════════════════════
// Themes
// ═════════════════════════════════════════════════════════════════════════════

function renderClassic(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--classic">
    <header class="rcv-head rcv-head--center">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, order, {}, { skills: "line" })}
    ${languagesSection(r)}
  </div>`;
}

function renderMinimal(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--minimal">
    <header class="rcv-head">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, order, { summary: "Profile", projects: "Projects" }, {
      skills: "plain",
      rail: true,
    })}
    ${languagesSection(r)}
  </div>`;
}

function renderModern(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const side = pick(order, ["skills", "education", "certifications"]);
  const main = pick(order, ["summary", "experience", "projects"]);
  return `<div class="rcv rcv--modern">
    <aside class="rcv-side">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
      ${renderOrdered(r, side, {}, { skills: "tags" })}
      ${languagesSection(r)}
    </aside>
    <main class="rcv-main">
      ${renderOrdered(r, main, {}, {})}
    </main>
  </div>`;
}

function renderExecutive(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const top = pick(order, ["summary", "experience"]);
  const rest = pick(order, ["projects", "education", "skills", "certifications"]);
  const left = rest.filter((k) => k === "education" || k === "certifications" || k === "projects");
  const right = rest.filter((k) => k === "skills");
  return `<div class="rcv rcv--executive">
    <header class="rcv-head rcv-head--band">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, top, { summary: "Executive Summary", experience: "Professional Experience" })}
    <div class="rcv-cols">
      <div>${renderOrdered(r, left, { projects: "Key Projects" })}</div>
      <div>${renderOrdered(r, right, { skills: "Core Competencies" })}${languagesSection(r)}</div>
    </div>
  </div>`;
}

function renderCreative(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const top = pick(order, ["summary"]);
  const experience = pick(order, ["experience"]);
  const rest = pick(order, ["projects", "education", "skills", "certifications"]);
  const experienceHtml = sectionForKey("experience", r, { experience: "Experience" });
  return `<div class="rcv rcv--creative">
    <header class="rcv-head">
      <div class="rcv-mono">${esc(initials(r.contact.name))}</div>
      <div class="rcv-head-copy">
        <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
        ${roleLine(r)}
        <div class="rcv-contact">${contactLine(r.contact)}</div>
      </div>
    </header>
    ${renderOrdered(r, top, { summary: "About" })}
    ${experienceHtml ? `<section class="rcv-section"><h2 class="rcv-h">Experience</h2><div class="rcv-timeline">${r.experience.map((j) => jobHtml(j, {})).join("")}</div></section>` : ""}
    ${renderOrdered(r, rest, { projects: "Projects" })}
    ${languagesSection(r)}
  </div>`;
}

function renderSharp(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--sharp">
    <header class="rcv-head">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, order, { summary: "Summary", projects: "Projects" }, { skills: "tags" })}
    ${languagesSection(r)}
  </div>`;
}

function renderNavy(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const side = pick(order, ["skills", "education", "certifications"]);
  const main = pick(order, ["summary", "experience", "projects"]);
  return `<div class="rcv rcv--navy">
    <aside class="rcv-side">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
      ${renderOrdered(r, side, {}, { skills: "tags" })}
      ${languagesSection(r)}
    </aside>
    <main class="rcv-main">
      ${renderOrdered(r, main, { summary: "Profile" }, {})}
    </main>
  </div>`;
}

function renderTerra(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--terra">
    <header class="rcv-head">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, order, { summary: "About" }, { skills: "tags" })}
    ${languagesSection(r)}
  </div>`;
}

function renderEnhancv(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const main = pick(order, ["summary", "experience", "education"]);
  const side = pick(order, ["skills", "projects", "certifications"]);
  return `<div class="rcv rcv--enhancv">
    <header class="rcv-head">
      ${avatar(r)}
      <div>
        <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
        ${roleLine(r)}
        <div class="rcv-contact">${contactLine(r.contact)}</div>
      </div>
    </header>
    <div class="rcv-cols--wide-left">
      <div>${renderOrdered(r, main, { summary: "Summary" })}</div>
      <div>${renderOrdered(r, side, { projects: "Projects" })}${languagesSection(r)}</div>
    </div>
  </div>`;
}

function renderEuropass(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const main = pick(order, ["summary", "experience", "education", "projects"]);
  const side = pick(order, ["skills", "certifications"]);
  return `<div class="rcv rcv--europass">
    <header class="rcv-head">
      ${avatar(r)}
      <div>
        <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
        ${roleLine(r)}
        <div class="rcv-contact">${contactLine(r.contact)}</div>
      </div>
    </header>
    <div class="rcv-cols--wide-left">
      <div>${renderOrdered(r, main, { summary: "Professional Summary", projects: "Projects" })}</div>
      <div class="rcv-side">${renderOrdered(r, side, {}, { skills: "tags" })}${languagesSection(r)}</div>
    </div>
  </div>`;
}

function renderCanadian(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--canadian">
    <header class="rcv-head">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, order, { summary: "Professional Summary", experience: "Work Experience" }, { skills: "tags" })}
    ${languagesSection(r)}
  </div>`;
}

function renderFotoram(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--fotoram">
    <header class="rcv-head">
      ${avatar(r)}
      <div>
        <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
        ${roleLine(r)}
        <div class="rcv-contact">${contactLine(r.contact)}</div>
      </div>
    </header>
    ${renderOrdered(r, order, { summary: "About" }, { skills: "tags" })}
    ${languagesSection(r)}
  </div>`;
}

function renderZety(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const main = pick(order, ["summary", "experience", "education", "projects"]);
  return `<div class="rcv rcv--zety">
    <aside class="rcv-side">
      ${avatar(r)}
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
      ${sectionForKey("skills", r, { skills: "Skills" }, { skills: "tags" })}
      ${languagesSection(r)}
    </aside>
    <main class="rcv-main">
      ${renderOrdered(r, main, { summary: "Profile" }, {})}
    </main>
  </div>`;
}

function renderResumeio(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--resumeio">
    <header class="rcv-head">
      ${avatar(r)}
      <div>
        <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
        ${roleLine(r)}
        <div class="rcv-contact">${contactLine(r.contact)}</div>
      </div>
    </header>
    ${renderOrdered(r, order, { summary: "Summary", projects: "Projects" }, { skills: "tags" })}
    ${languagesSection(r)}
  </div>`;
}

function renderEditorial(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--editorial">
    <header class="rcv-head">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      ${roleLine(r)}
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, order, { summary: "Profile" }, { skills: "plain" })}
    ${languagesSection(r)}
  </div>`;
}

function renderMaang(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--maang">
    <header class="rcv-head">
      <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
      <div class="rcv-contact">${contactLine(r.contact, "|")}</div>
    </header>
    ${renderOrdered(r, order, {
      summary: "Summary",
      experience: "Experience",
      education: "Education",
      skills: "Technical Skills",
      projects: "Projects",
      awards: "Awards & Leadership",
      certifications: "Certifications",
    }, { skills: "grouped" })}
    ${languagesSection(r)}
  </div>`;
}

function renderOnyx(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  const top = pick(order, ["summary", "experience", "projects"]);
  const rest = pick(order, ["education", "skills", "awards", "certifications"]);
  const left = rest.filter((k) => k === "education" || k === "awards" || k === "certifications");
  const right = rest.filter((k) => k === "skills");
  return `<div class="rcv rcv--onyx">
    <header class="rcv-head">
      <div>
        <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
        ${roleLine(r)}
      </div>
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, top, { summary: "Profile", projects: "Selected Work" })}
    <div class="rcv-cols--wide-left">
      <div>${renderOrdered(r, left, { awards: "Awards & Leadership" })}</div>
      <div>${renderOrdered(r, right, { skills: "Expertise" })}${languagesSection(r)}</div>
    </div>
  </div>`;
}

function renderAtlas(r: ParsedResume): string {
  const order = normalizeSectionOrder(r.sectionOrder);
  return `<div class="rcv rcv--atlas">
    <header class="rcv-head">
      <div>
        <h1 class="rcv-name">${esc(r.contact.name || "Your Name")}</h1>
        ${roleLine(r)}
      </div>
      <div class="rcv-contact">${contactLine(r.contact)}</div>
    </header>
    ${renderOrdered(r, order, { summary: "Profile", projects: "Projects" }, { skills: "tags" })}
    ${languagesSection(r)}
  </div>`;
}

const RENDERERS: Record<ThemeId, (r: ParsedResume) => string> = {
  classic: renderClassic,
  modern: renderModern,
  minimal: renderMinimal,
  executive: renderExecutive,
  creative: renderCreative,
  sharp: renderSharp,
  navy: renderNavy,
  terra: renderTerra,
  enhancv: renderEnhancv,
  europass: renderEuropass,
  canadian: renderCanadian,
  fotoram: renderFotoram,
  zety: renderZety,
  resumeio: renderResumeio,
  editorial: renderEditorial,
  atlas: renderAtlas,
  maang: renderMaang,
  onyx: renderOnyx,
};

export const RESUME_THEME_IDS = Object.keys(RENDERERS) as ThemeId[];

/** Render just the paper markup (used by the live preview and the PDF wrapper). */
export function renderThemeBody(resume: ParsedResume, theme: ThemeId): string {
  const safe = sanitizeResumeUtil(resume);
  const renderer = RENDERERS[theme] ?? RENDERERS.classic;
  return renderer(safe);
}

/** Full, self-contained HTML document for Puppeteer/PDF. */
export function renderThemeHtml(
  resume: ParsedResume,
  theme: ThemeId,
  typography?: ResumeTypography
): string {
  const body = renderThemeBody(resume, theme);
  const typo = normalizeTypography(typography ?? DEFAULT_TYPOGRAPHY);
  const fontOverride =
    typo.font !== "default"
      ? `#resume-root .rcv { --rcv-font: ${RESUME_FONT_STACKS[typo.font]}; }`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(resume.contact.name)} — Resume</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #fff; }
    body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
    ${RESUME_CSS}
    #resume-root {
      width: 180mm;
      --rcv-size: ${typo.fontSizePt}pt;
      --rcv-lh: ${typo.lineHeight};
    }
    #resume-root .rcv {
      width: 100%;
      padding: 0;
    }
    ${fontOverride}
  </style>
</head>
<body><div id="resume-root">${body}</div></body>
</html>`;
}
