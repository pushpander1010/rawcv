import type { ParsedResume, ThemeId, TailorChange } from "@/types";
import { sanitizeResume as sanitizeResumeUtil } from "@/lib/sanitize-resume";

/** Merge accepted TailorChanges into a ParsedResume copy */
export function applyChanges(
  resume: ParsedResume,
  changes: TailorChange[] = []
): ParsedResume {
  const accepted = changes.filter((c) => c.accepted);
  if (accepted.length === 0) return resume;

  // Deep clone
  const result: ParsedResume = JSON.parse(JSON.stringify(resume));

  for (const change of accepted) {
    if (change.section === "summary") {
      result.summary = change.tailored;
    } else if (change.section === "experience") {
      // field format: "experience[i].bullets[j]"
      const expMatch = change.field.match(/experience\[(\d+)\]\.bullets\[(\d+)\]/);
      if (expMatch) {
        const ei = parseInt(expMatch[1]);
        const bi = parseInt(expMatch[2]);
        if (result.experience[ei]?.bullets[bi] !== undefined) {
          result.experience[ei].bullets[bi] = change.tailored;
        }
      }
    }
  }

  return result;
}

/** Escape HTML special characters */
function esc(str: string | undefined | null | number | boolean | any): string {
  if (str === undefined || str === null || str === "") return "";
  // Convert to string first to handle numbers, booleans, objects, arrays
  const strValue = typeof str === "string" ? str : String(str);
  return strValue
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Render a list of items as <li> elements */
function li(items: string[]): string {
  return items.map((i) => `<li>${esc(i)}</li>`).join("");
}

/** Build a clickable <a> tag for a contact field, or plain text for location */
function contactHref(type: string, value: string): string | null {
  const v = value.trim();
  switch (type) {
    case "email": return v.startsWith("mailto:") ? v : `mailto:${v}`;
    case "phone": return `tel:${v.replace(/[^+\d]/g, "")}`;
    case "linkedin":
      if (v.startsWith("http")) return v;
      return `https://linkedin.com/in/${v.replace(/^@/, "").replace(/^linkedin\.com\/in\//i, "")}`;
    case "website":
      if (v.startsWith("http")) return v;
      return `https://${v}`;
    default: return null;
  }
}

/** Render a contact field as a clickable link (or plain text for location) */
function contactHtml(type: string, value: string, display?: string): string {
  if (!value?.trim()) return "";
  const href = contactHref(type, value);
  // Build a clean display label
  let label: string;
  if (display) {
    label = esc(display);
  } else if (type === "linkedin") {
    label = value.startsWith("http") ? "LinkedIn" : esc(value.replace(/^@/, ""));
  } else if (type === "website") {
    try { label = esc(new URL(value.startsWith("http") ? value : `https://${value}`).hostname.replace(/^www\./, "")); } catch { label = esc(value); }
  } else {
    label = esc(value);
  }
  if (!href) return `<span>${label}</span>`;
  return `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;text-underline-offset:2px;">${label}</a>`;
}

// ─── Theme HTML generators ────────────────────────────────────────────────────

function renderClassic(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Lora',Georgia,serif;color:#111;background:#fff;padding:40px;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;">
      <div style="text-align:center;border-bottom:2px solid #222;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="font-size:24px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">${esc(contact.name)}</h1>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;font-size:11px;color:#555;">
          ${[contactHtml("email", contact.email), contactHtml("phone", contact.phone), contactHtml("location", contact.location), contactHtml("linkedin", contact.linkedin), contactHtml("website", contact.website)].join("")}
        </div>
      </div>
      ${summary ? `<section style="margin-bottom:20px;"><h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #aaa;padding-bottom:4px;margin-bottom:8px;">Professional Summary</h2><p style="color:#444;">${esc(summary)}</p></section>` : ""}
      ${experience.length ? `<section style="margin-bottom:20px;"><h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #aaa;padding-bottom:4px;margin-bottom:8px;">Experience</h2>${experience.map((j) => `<div style="margin-bottom:16px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:700;">${esc(j.title)}</span><span style="font-size:11px;color:#777;">${esc(j.startDate)} – ${esc(j.endDate as string)}</span></div><div style="color:#555;font-style:italic;margin-bottom:4px;">${esc(j.company)}</div><ul style="margin:0;padding-left:20px;">${li(j.bullets)}</ul></div>`).join("")}</section>` : ""}
      ${education.length ? `<section style="margin-bottom:20px;"><h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #aaa;padding-bottom:4px;margin-bottom:8px;">Education</h2>${education.map((e) => `<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:700;">${esc(e.degree)} in ${esc(e.field)}</span><span style="font-size:11px;color:#777;">${esc(e.graduationYear)}</span></div><div style="color:#555;font-style:italic;">${esc(e.institution)}</div></div>`).join("")}</section>` : ""}
      ${skills.length ? `<section style="margin-bottom:20px;"><h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #aaa;padding-bottom:4px;margin-bottom:8px;">Skills</h2><p style="color:#444;">${skills.map(esc).join(" · ")}</p></section>` : ""}
      ${projects?.length ? `<section style="margin-bottom:20px;"><h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #aaa;padding-bottom:4px;margin-bottom:8px;">Projects</h2>${projects.map((p) => `<div style="margin-bottom:12px;"><div style="font-weight:700;">${esc(p.name)}</div><p style="color:#444;margin:2px 0;">${esc(p.description)}</p><p style="font-size:11px;color:#777;">${p.technologies.map(esc).join(", ")}</p></div>`).join("")}</section>` : ""}
      ${certifications?.length ? `<section><h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #aaa;padding-bottom:4px;margin-bottom:8px;">Certifications</h2><ul style="margin:0;padding-left:20px;">${li(certifications)}</ul></section>` : ""}
    </div>`;
}

function renderModern(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Inter',sans-serif;color:#111;background:#fff;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;display:flex;">
      <div style="width:220px;background:#1e293b;color:#fff;padding:24px;flex-shrink:0;">
        <h1 style="font-size:16px;font-weight:700;margin:0 0 4px;">${esc(contact.name)}</h1>
        <div style="font-size:11px;color:#94a3b8;margin-bottom:20px;">
          ${[contactHtml("email", contact.email), contactHtml("phone", contact.phone), contactHtml("location", contact.location), contactHtml("linkedin", contact.linkedin), contactHtml("website", contact.website)].join("")}
        </div>
        ${skills.length ? `<div style="margin-bottom:20px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Skills</div><div style="display:flex;flex-wrap:wrap;gap:4px;">${skills.map((s) => `<span style="background:#334155;color:#cbd5e1;font-size:10px;padding:2px 6px;border-radius:3px;">${esc(s)}</span>`).join("")}</div></div>` : ""}
        ${education.length ? `<div style="margin-bottom:20px;"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Education</div>${education.map((e) => `<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:600;">${esc(e.degree)}</div><div style="font-size:11px;color:#94a3b8;">${esc(e.field)}</div><div style="font-size:11px;color:#64748b;">${esc(e.institution)}</div><div style="font-size:10px;color:#475569;">${esc(e.graduationYear)}</div></div>`).join("")}</div>` : ""}
        ${certifications?.length ? `<div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px;">Certifications</div><ul style="margin:0;padding-left:14px;font-size:11px;color:#94a3b8;">${li(certifications)}</ul></div>` : ""}
      </div>
      <div style="flex:1;padding:32px;">
        ${summary ? `<section style="margin-bottom:24px;"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:6px;">About</h2><div style="width:32px;height:2px;background:#3b82f6;margin-bottom:10px;"></div><p style="color:#555;">${esc(summary)}</p></section>` : ""}
        ${experience.length ? `<section style="margin-bottom:24px;"><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:6px;">Experience</h2><div style="width:32px;height:2px;background:#3b82f6;margin-bottom:10px;"></div>${experience.map((j) => `<div style="margin-bottom:18px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:700;">${esc(j.title)}</span><span style="font-size:11px;color:#94a3b8;">${esc(j.startDate)} – ${esc(j.endDate as string)}</span></div><div style="color:#3b82f6;font-size:11px;font-weight:600;margin-bottom:6px;">${esc(j.company)}</div><ul style="margin:0;padding:0;list-style:none;">${j.bullets.map((b) => `<li style="display:flex;gap:6px;color:#555;margin-bottom:3px;"><span style="color:#93c5fd;flex-shrink:0;">▸</span><span>${esc(b)}</span></li>`).join("")}</ul></div>`).join("")}</section>` : ""}
        ${projects?.length ? `<section><h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:6px;">Projects</h2><div style="width:32px;height:2px;background:#3b82f6;margin-bottom:10px;"></div>${projects.map((p) => `<div style="margin-bottom:14px;"><div style="font-weight:700;">${esc(p.name)}</div><p style="color:#555;margin:3px 0;">${esc(p.description)}</p><div style="display:flex;flex-wrap:wrap;gap:4px;">${p.technologies.map((t) => `<span style="background:#eff6ff;color:#1d4ed8;font-size:10px;padding:2px 6px;border-radius:3px;">${esc(t)}</span>`).join("")}</div></div>`).join("")}</section>` : ""}
      </div>
    </div>`;
}

function renderMinimal(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Inter',sans-serif;color:#333;background:#fff;padding:48px;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;">
      <div style="margin-bottom:32px;">
        <h1 style="font-size:28px;font-weight:300;letter-spacing:-1px;color:#111;margin:0 0 8px;">${esc(contact.name)}</h1>
        <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:11px;color:#aaa;">
          ${[contactHtml("email", contact.email), contactHtml("phone", contact.phone), contactHtml("location", contact.location), contactHtml("linkedin", contact.linkedin), contactHtml("website", contact.website)].join("")}
        </div>
      </div>
      ${summary ? `<section style="margin-bottom:28px;"><p style="color:#666;line-height:1.7;">${esc(summary)}</p></section>` : ""}
      ${experience.length ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin-bottom:16px;">Experience</h2>${experience.map((j) => `<div style="margin-bottom:20px;display:flex;gap:24px;"><div style="width:100px;flex-shrink:0;text-align:right;font-size:11px;color:#aaa;line-height:1.4;">${esc(j.startDate)}<br>–<br>${esc(j.endDate as string)}</div><div style="flex:1;"><div style="font-weight:500;color:#111;">${esc(j.title)}</div><div style="font-size:11px;color:#aaa;margin-bottom:6px;">${esc(j.company)}</div><ul style="margin:0;padding:0;list-style:none;">${j.bullets.map((b) => `<li style="color:#555;padding-left:12px;border-left:2px solid #e5e7eb;margin-bottom:3px;">${esc(b)}</li>`).join("")}</ul></div></div>`).join("")}</section>` : ""}
      ${education.length ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin-bottom:16px;">Education</h2>${education.map((e) => `<div style="margin-bottom:12px;display:flex;gap:24px;"><div style="width:100px;flex-shrink:0;text-align:right;font-size:11px;color:#aaa;">${esc(e.graduationYear)}</div><div style="flex:1;"><div style="font-weight:500;color:#111;">${esc(e.degree)} in ${esc(e.field)}</div><div style="font-size:11px;color:#aaa;">${esc(e.institution)}</div></div></div>`).join("")}</section>` : ""}
      ${skills.length ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin-bottom:16px;">Skills</h2><div style="display:flex;flex-wrap:wrap;gap:8px;">${skills.map((s) => `<span style="font-size:11px;color:#666;border:1px solid #e5e7eb;padding:3px 10px;border-radius:20px;">${esc(s)}</span>`).join("")}</div></section>` : ""}
      ${projects?.length ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin-bottom:16px;">Projects</h2>${projects.map((p) => `<div style="margin-bottom:14px;display:flex;gap:24px;"><div style="width:100px;flex-shrink:0;"></div><div style="flex:1;"><div style="font-weight:500;color:#111;">${esc(p.name)}</div><p style="color:#666;margin:2px 0;">${esc(p.description)}</p><p style="font-size:11px;color:#aaa;">${p.technologies.map(esc).join(", ")}</p></div></div>`).join("")}</section>` : ""}
      ${certifications?.length ? `<section><h2 style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:#aaa;margin-bottom:16px;">Certifications</h2><ul style="margin:0;padding:0;list-style:none;">${certifications.map((c) => `<li style="color:#666;padding-left:12px;border-left:2px solid #e5e7eb;margin-bottom:3px;">${esc(c)}</li>`).join("")}</ul></section>` : ""}
    </div>`;
}

function renderExecutive(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Inter',sans-serif;color:#111;background:#fff;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;">
      <div style="background:#111;color:#fff;padding:32px 40px;">
        <h1 style="font-size:24px;font-weight:700;letter-spacing:1px;margin:0 0 8px;">${esc(contact.name)}</h1>
        <div style="display:flex;flex-wrap:wrap;gap:20px;font-size:11px;color:#9ca3af;">
          ${[contactHtml("email", contact.email), contactHtml("phone", contact.phone), contactHtml("location", contact.location), contactHtml("linkedin", contact.linkedin), contactHtml("website", contact.website)].join("")}
        </div>
      </div>
      <div style="padding:32px 40px;">
        ${summary ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Executive Summary</h2><div style="height:2px;background:#111;margin-bottom:12px;"></div><p style="color:#555;line-height:1.7;">${esc(summary)}</p></section>` : ""}
        ${experience.length ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Professional Experience</h2><div style="height:2px;background:#111;margin-bottom:16px;"></div>${experience.map((j) => `<div style="margin-bottom:22px;"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;"><div><span style="font-weight:700;font-size:14px;">${esc(j.title)}</span><span style="color:#9ca3af;margin:0 8px;">·</span><span style="font-weight:600;color:#374151;">${esc(j.company)}</span></div><span style="font-size:11px;color:#9ca3af;">${esc(j.startDate)} – ${esc(j.endDate as string)}</span></div><ul style="margin:6px 0 0;padding:0;list-style:none;">${j.bullets.map((b) => `<li style="display:flex;gap:8px;color:#555;margin-bottom:3px;"><span style="font-weight:700;flex-shrink:0;">—</span><span>${esc(b)}</span></li>`).join("")}</ul></div>`).join("")}</section>` : ""}
        <div style="display:flex;gap:32px;">
          <div style="flex:1;">
            ${education.length ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Education</h2><div style="height:2px;background:#111;margin-bottom:12px;"></div>${education.map((e) => `<div style="margin-bottom:10px;"><div style="font-weight:600;">${esc(e.degree)} in ${esc(e.field)}</div><div style="color:#555;">${esc(e.institution)}</div><div style="font-size:11px;color:#9ca3af;">${esc(e.graduationYear)}</div></div>`).join("")}</section>` : ""}
            ${certifications?.length ? `<section><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Certifications</h2><div style="height:2px;background:#111;margin-bottom:12px;"></div><ul style="margin:0;padding-left:16px;">${li(certifications)}</ul></section>` : ""}
          </div>
          <div style="width:200px;flex-shrink:0;">
            ${skills.length ? `<section style="margin-bottom:28px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Core Competencies</h2><div style="height:2px;background:#111;margin-bottom:12px;"></div><ul style="margin:0;padding:0;list-style:none;">${skills.map((s) => `<li style="display:flex;gap:6px;color:#555;margin-bottom:3px;"><span style="color:#9ca3af;">›</span><span>${esc(s)}</span></li>`).join("")}</ul></section>` : ""}
            ${projects?.length ? `<section><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Key Projects</h2><div style="height:2px;background:#111;margin-bottom:12px;"></div>${projects.map((p) => `<div style="margin-bottom:10px;"><div style="font-weight:600;">${esc(p.name)}</div><p style="font-size:11px;color:#555;">${esc(p.description)}</p></div>`).join("")}</section>` : ""}
          </div>
        </div>
      </div>
    </div>`;
}

function renderCreative(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Inter',sans-serif;color:#333;background:#fff;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;">
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;padding:32px 40px;">
        <h1 style="font-size:24px;font-weight:700;margin:0 0 8px;">${esc(contact.name)}</h1>
        <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:11px;color:#ddd6fe;">
          ${[contactHtml("email", contact.email), contactHtml("phone", contact.phone), contactHtml("location", contact.location), contactHtml("linkedin", contact.linkedin), contactHtml("website", contact.website)].join("")}
        </div>
      </div>
      <div style="padding:32px 40px;">
        ${summary ? `<section style="margin-bottom:28px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="width:10px;height:10px;border-radius:50%;background:#7c3aed;flex-shrink:0;"></span><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin:0;">About Me</h2></div><p style="color:#555;padding-left:20px;">${esc(summary)}</p></section>` : ""}
        ${experience.length ? `<section style="margin-bottom:28px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;"><span style="width:10px;height:10px;border-radius:50%;background:#4f46e5;flex-shrink:0;"></span><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4f46e5;margin:0;">Experience</h2></div><div style="padding-left:20px;border-left:2px solid #ede9fe;">${experience.map((j) => `<div style="margin-bottom:20px;position:relative;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:700;">${esc(j.title)}</span><span style="font-size:11px;color:#9ca3af;">${esc(j.startDate)} – ${esc(j.endDate as string)}</span></div><div style="color:#7c3aed;font-size:11px;font-weight:600;margin-bottom:6px;">${esc(j.company)}</div><ul style="margin:0;padding:0;list-style:none;">${j.bullets.map((b) => `<li style="display:flex;gap:6px;color:#555;margin-bottom:3px;"><span style="color:#c4b5fd;flex-shrink:0;">◆</span><span>${esc(b)}</span></li>`).join("")}</ul></div>`).join("")}</div></section>` : ""}
        <div style="display:flex;gap:32px;">
          <div style="flex:1;">
            ${education.length ? `<section style="margin-bottom:28px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="width:10px;height:10px;border-radius:50%;background:#7c3aed;flex-shrink:0;"></span><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin:0;">Education</h2></div>${education.map((e) => `<div style="margin-bottom:10px;padding-left:20px;"><div style="font-weight:600;">${esc(e.degree)} in ${esc(e.field)}</div><div style="color:#4f46e5;font-size:11px;">${esc(e.institution)}</div><div style="font-size:11px;color:#9ca3af;">${esc(e.graduationYear)}</div></div>`).join("")}</section>` : ""}
            ${projects?.length ? `<section><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="width:10px;height:10px;border-radius:50%;background:#4f46e5;flex-shrink:0;"></span><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4f46e5;margin:0;">Projects</h2></div>${projects.map((p) => `<div style="margin-bottom:14px;padding-left:20px;"><div style="font-weight:600;">${esc(p.name)}</div><p style="color:#555;margin:2px 0;">${esc(p.description)}</p><div style="display:flex;flex-wrap:wrap;gap:4px;">${p.technologies.map((t) => `<span style="background:#f5f3ff;color:#5b21b6;font-size:10px;padding:2px 8px;border-radius:20px;">${esc(t)}</span>`).join("")}</div></div>`).join("")}</section>` : ""}
          </div>
          <div style="width:200px;flex-shrink:0;">
            ${skills.length ? `<section style="margin-bottom:28px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="width:10px;height:10px;border-radius:50%;background:#7c3aed;flex-shrink:0;"></span><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;margin:0;">Skills</h2></div><div style="display:flex;flex-wrap:wrap;gap:6px;padding-left:20px;">${skills.map((s) => `<span style="background:linear-gradient(135deg,#ede9fe,#e0e7ff);color:#3730a3;font-size:10px;padding:3px 10px;border-radius:20px;">${esc(s)}</span>`).join("")}</div></section>` : ""}
            ${certifications?.length ? `<section><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><span style="width:10px;height:10px;border-radius:50%;background:#4f46e5;flex-shrink:0;"></span><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4f46e5;margin:0;">Certifications</h2></div><ul style="margin:0;padding-left:20px;list-style:none;">${certifications.map((c) => `<li style="font-size:11px;color:#555;margin-bottom:3px;">${esc(c)}</li>`).join("")}</ul></section>` : ""}
          </div>
        </div>
      </div>
    </div>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

function renderSharp(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Inter',sans-serif;color:#111;background:#fff;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;">
      <div style="background:#000;color:#fff;padding:28px 40px;">
        <h1 style="font-size:26px;font-weight:900;letter-spacing:-1px;text-transform:uppercase;margin:0 0 6px;">${esc(contact.name)}</h1>
        <div style="display:flex;flex-wrap:wrap;gap:14px;font-size:11px;color:#aaa;font-family:monospace;">
          ${[contactHtml("email", contact.email),contactHtml("phone", contact.phone),contactHtml("location", contact.location),contactHtml("linkedin", contact.linkedin),contactHtml("website", contact.website)].join("")}
        </div>
      </div>
      <div style="padding:32px 40px;">
        ${summary?`<section style="margin-bottom:24px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><div style="width:14px;height:14px;background:#000;flex-shrink:0;"></div><h2 style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0;">Summary</h2></div><p style="color:#555;padding-left:24px;">${esc(summary)}</p></section>`:""}
        ${experience.length?`<section style="margin-bottom:24px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;"><div style="width:14px;height:14px;background:#000;flex-shrink:0;"></div><h2 style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0;">Experience</h2></div><div style="padding-left:24px;">${experience.map(j=>`<div style="margin-bottom:18px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:900;font-size:14px;">${esc(j.title)}</span><span style="font-size:11px;color:#aaa;font-family:monospace;">${esc(j.startDate)} – ${esc(j.endDate as string)}</span></div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#777;margin-bottom:6px;">${esc(j.company)}</div><ul style="margin:0;padding:0;list-style:none;">${j.bullets.map(b=>`<li style="display:flex;gap:6px;color:#555;margin-bottom:3px;"><span style="font-weight:900;color:#000;flex-shrink:0;">+</span><span>${esc(b)}</span></li>`).join("")}</ul></div>`).join("")}</div></section>`:""}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
          <div>
            ${education.length?`<section style="margin-bottom:20px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><div style="width:14px;height:14px;background:#000;flex-shrink:0;"></div><h2 style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0;">Education</h2></div><div style="padding-left:24px;">${education.map(e=>`<div style="margin-bottom:10px;"><div style="font-weight:700;">${esc(e.degree)} in ${esc(e.field)}</div><div style="font-size:11px;color:#777;">${esc(e.institution)}</div><div style="font-size:10px;color:#aaa;font-family:monospace;">${esc(e.graduationYear)}</div></div>`).join("")}</div></section>`:""}
            ${certifications?.length?`<section><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><div style="width:14px;height:14px;background:#000;flex-shrink:0;"></div><h2 style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0;">Certifications</h2></div><ul style="padding-left:24px;margin:0;">${li(certifications)}</ul></section>`:""}
          </div>
          <div>
            ${skills.length?`<section style="margin-bottom:20px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><div style="width:14px;height:14px;background:#000;flex-shrink:0;"></div><h2 style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0;">Skills</h2></div><div style="padding-left:24px;display:flex;flex-wrap:wrap;gap:6px;">${skills.map(s=>`<span style="border:2px solid #000;font-size:10px;font-weight:700;padding:2px 8px;">${esc(s)}</span>`).join("")}</div></section>`:""}
            ${projects?.length?`<section><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><div style="width:14px;height:14px;background:#000;flex-shrink:0;"></div><h2 style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0;">Projects</h2></div><div style="padding-left:24px;">${projects.map(p=>`<div style="margin-bottom:10px;"><div style="font-weight:700;">${esc(p.name)}</div><p style="font-size:11px;color:#555;">${esc(p.description)}</p></div>`).join("")}</div></section>`:""}
          </div>
        </div>
      </div>
    </div>`;
}

function renderNavy(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Inter',sans-serif;color:#111;background:#fff;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;display:flex;min-height:1000px;">
      <div style="width:220px;background:#0f2044;color:#fff;flex-shrink:0;padding:0;">
        <div style="padding:28px 20px;border-bottom:1px solid rgba(255,255,255,0.1);">
          <h1 style="font-size:15px;font-weight:700;margin:0 0 10px;">${esc(contact.name)}</h1>
          <div style="font-size:11px;color:#93c5fd;">
            ${[contactHtml("email", contact.email),contactHtml("phone", contact.phone),contactHtml("location", contact.location),contactHtml("linkedin", contact.linkedin),contactHtml("website", contact.website)].join("")}
          </div>
        </div>
        ${skills.length?`<div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.1);"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fbbf24;margin-bottom:10px;">Skills</div>${skills.map(s=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;"><div style="width:5px;height:5px;border-radius:50%;background:#fbbf24;flex-shrink:0;"></div><span style="font-size:11px;color:#bfdbfe;">${esc(s)}</span></div>`).join("")}</div>`:""}
        ${education.length?`<div style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.1);"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fbbf24;margin-bottom:10px;">Education</div>${education.map(e=>`<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:600;color:#fff;">${esc(e.degree)}</div><div style="font-size:11px;color:#93c5fd;">${esc(e.field)}</div><div style="font-size:11px;color:#60a5fa;">${esc(e.institution)}</div><div style="font-size:10px;color:#3b82f6;">${esc(e.graduationYear)}</div></div>`).join("")}</div>`:""}
        ${certifications?.length?`<div style="padding:18px 20px;"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fbbf24;margin-bottom:10px;">Certifications</div><ul style="margin:0;padding-left:14px;font-size:11px;color:#93c5fd;">${li(certifications)}</ul></div>`:""}
      </div>
      <div style="flex:1;padding:28px 32px;">
        ${summary?`<section style="margin-bottom:22px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0f2044;margin-bottom:4px;">Profile</h2><div style="width:36px;height:2px;background:#fbbf24;margin-bottom:10px;"></div><p style="color:#555;">${esc(summary)}</p></section>`:""}
        ${experience.length?`<section style="margin-bottom:22px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0f2044;margin-bottom:4px;">Experience</h2><div style="width:36px;height:2px;background:#fbbf24;margin-bottom:12px;"></div>${experience.map(j=>`<div style="margin-bottom:18px;padding-left:10px;border-left:2px solid #fbbf24;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:700;">${esc(j.title)}</span><span style="font-size:11px;color:#9ca3af;">${esc(j.startDate)} – ${esc(j.endDate as string)}</span></div><div style="font-size:11px;font-weight:600;color:#0f2044;margin-bottom:5px;">${esc(j.company)}</div><ul style="margin:0;padding:0;list-style:none;">${j.bullets.map(b=>`<li style="display:flex;gap:6px;color:#555;margin-bottom:3px;font-size:12px;"><span style="color:#f59e0b;flex-shrink:0;">▸</span><span>${esc(b)}</span></li>`).join("")}</ul></div>`).join("")}</section>`:""}
        ${projects?.length?`<section><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0f2044;margin-bottom:4px;">Projects</h2><div style="width:36px;height:2px;background:#fbbf24;margin-bottom:12px;"></div>${projects.map(p=>`<div style="margin-bottom:12px;"><div style="font-weight:700;">${esc(p.name)}</div><p style="color:#555;font-size:12px;margin:2px 0;">${esc(p.description)}</p><div style="display:flex;flex-wrap:wrap;gap:4px;">${p.technologies.map(t=>`<span style="background:#eff6ff;color:#1e3a8a;font-size:10px;padding:2px 6px;border-radius:3px;">${esc(t)}</span>`).join("")}</div></div>`).join("")}</section>`:""}
      </div>
    </div>`;
}

function renderTerra(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  return `
    <div style="font-family:'Lora',Georgia,serif;color:#3d2b1f;background:#fdf8f3;max-width:800px;margin:0 auto;font-size:13px;line-height:1.6;">
      <div style="background:#8b4513;color:#fff;padding:28px 40px;">
        <h1 style="font-size:26px;font-weight:700;margin:0 0 8px;">${esc(contact.name)}</h1>
        <div style="display:flex;flex-wrap:wrap;gap:16px;font-size:11px;color:#fcd9b0;">
          ${[contactHtml("email", contact.email),contactHtml("phone", contact.phone),contactHtml("location", contact.location),contactHtml("linkedin", contact.linkedin),contactHtml("website", contact.website)].join("")}
        </div>
      </div>
      <div style="padding:32px 40px;">
        ${summary?`<section style="margin-bottom:24px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8b4513;margin-bottom:4px;">About</h2><div style="height:1px;background:#d4956a;margin-bottom:10px;"></div><p style="color:#555;font-style:italic;">${esc(summary)}</p></section>`:""}
        ${experience.length?`<section style="margin-bottom:24px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8b4513;margin-bottom:4px;">Experience</h2><div style="height:1px;background:#d4956a;margin-bottom:14px;"></div>${experience.map(j=>`<div style="margin-bottom:18px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:700;">${esc(j.title)}</span><span style="font-size:11px;color:#9ca3af;font-family:Arial,sans-serif;">${esc(j.startDate)} – ${esc(j.endDate as string)}</span></div><div style="color:#8b4513;font-weight:600;margin-bottom:5px;">${esc(j.company)}</div><ul style="margin:0;padding:0;list-style:none;">${j.bullets.map(b=>`<li style="display:flex;gap:6px;color:#555;margin-bottom:3px;"><span style="color:#d4956a;font-weight:700;flex-shrink:0;">›</span><span>${esc(b)}</span></li>`).join("")}</ul></div>`).join("")}</section>`:""}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
          <div>
            ${education.length?`<section style="margin-bottom:20px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8b4513;margin-bottom:4px;">Education</h2><div style="height:1px;background:#d4956a;margin-bottom:10px;"></div>${education.map(e=>`<div style="margin-bottom:10px;"><div style="font-weight:700;">${esc(e.degree)} in ${esc(e.field)}</div><div style="color:#777;">${esc(e.institution)}</div><div style="font-size:11px;color:#aaa;font-family:Arial,sans-serif;">${esc(e.graduationYear)}</div></div>`).join("")}</section>`:""}
            ${certifications?.length?`<section><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8b4513;margin-bottom:4px;">Certifications</h2><div style="height:1px;background:#d4956a;margin-bottom:10px;"></div><ul style="margin:0;padding-left:16px;">${li(certifications)}</ul></section>`:""}
          </div>
          <div>
            ${skills.length?`<section style="margin-bottom:20px;"><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8b4513;margin-bottom:4px;">Skills</h2><div style="height:1px;background:#d4956a;margin-bottom:10px;"></div><div style="display:flex;flex-wrap:wrap;gap:6px;">${skills.map(s=>`<span style="background:#f5e6d3;color:#8b4513;font-size:11px;padding:3px 10px;border-radius:20px;font-family:Arial,sans-serif;">${esc(s)}</span>`).join("")}</div></section>`:""}
            ${projects?.length?`<section><h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8b4513;margin-bottom:4px;">Projects</h2><div style="height:1px;background:#d4956a;margin-bottom:10px;"></div>${projects.map(p=>`<div style="margin-bottom:10px;"><div style="font-weight:700;">${esc(p.name)}</div><p style="font-size:11px;color:#555;">${esc(p.description)}</p></div>`).join("")}</section>`:""}
          </div>
        </div>
      </div>
    </div>`;
}

function renderEnhancv(r: ParsedResume): string {
  const { contact, summary, experience, education, skills, certifications, projects } = r;
  const initials = contact.name ? contact.name.split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase() : "?";
  const accent = "#008cff";
  const sectionHead = (title: string) => `<div style="font-family:sans-serif;font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#000;border-bottom:2.5px solid #000;padding-bottom:3px;margin-bottom:10px;">${esc(title)}</div>`;
  return `<div style="font-family:'Inter',sans-serif;color:#111;background:#fff;max-width:800px;margin:0 auto;font-size:13px;line-height:1.5;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 32px 16px;border-bottom:1px solid #e5e7eb;">
      <div>
        <div style="font-family:sans-serif;font-weight:600;font-size:28px;text-transform:uppercase;letter-spacing:1px;line-height:1;color:#000;margin-bottom:4px;">${esc(contact.name)}</div>
        ${experience[0]?.title?`<div style="color:${accent};font-size:14px;margin-bottom:8px;">${esc(experience[0].title)}</div>`:""}
        <div style="display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:#444;">
          ${contact.phone?`<span>☎ ${contactHtml("phone", contact.phone)}</span>`:""}
          ${contact.email?`<span>✉ ${contactHtml("email", contact.email)}</span>`:""}
          ${contact.location?`<span>⌖ ${contactHtml("location", contact.location)}</span>`:""}
          ${contact.linkedin?`<span>in ${contactHtml("linkedin", contact.linkedin)}</span>`:""}
          ${contact.website?`<span>🔗 ${contactHtml("website", contact.website)}</span>`:""}
        </div>
      </div>
      <div style="width:72px;height:72px;border-radius:50%;background:${accent};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;flex-shrink:0;">${initials}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 38%;gap:0;">
      <div style="padding:20px 20px 24px 32px;border-right:1px solid #e5e7eb;">
        ${summary?`<section style="margin-bottom:18px;">${sectionHead("Summary")}<p style="color:#444;line-height:1.6;">${esc(summary)}</p></section>`:""}
        ${experience.length?`<section style="margin-bottom:18px;">${sectionHead("Experience")}${experience.map(j=>`<div style="margin-bottom:14px;"><div style="font-weight:600;font-size:14px;">${esc(j.title)}</div><div style="color:${accent};font-size:12px;margin-bottom:2px;">${esc(j.company)}</div><div style="font-size:11px;color:#888;margin-bottom:5px;">${esc(j.startDate)} – ${esc(j.endDate)}</div><ul style="margin:0;padding:0;list-style:none;">${j.bullets.map(b=>`<li style="display:flex;gap:6px;margin-bottom:2px;color:#444;"><span style="color:${accent};flex-shrink:0;">•</span><span>${esc(b)}</span></li>`).join("")}</ul></div>`).join("")}</section>`:""}
        ${education.length?`<section>${sectionHead("Education")}${education.map(e=>`<div style="margin-bottom:10px;"><div style="font-weight:600;font-size:14px;">${esc(e.degree)}${e.field?` — ${esc(e.field)}`:""}</div><div style="color:${accent};font-size:12px;">${esc(e.institution)}</div><div style="font-size:11px;color:#888;">${esc(e.graduationYear)}</div></div>`).join("")}</section>`:""}
      </div>
      <div style="padding:20px 24px 24px 16px;">
        ${skills.length?`<section style="margin-bottom:18px;">${sectionHead("Skills")}<div style="display:flex;flex-wrap:wrap;gap:6px;">${skills.map(s=>`<span style="background:#f0f7ff;color:#1a6abf;font-size:11px;padding:3px 10px;border-radius:4px;border:1px solid #cce0ff;">${esc(s)}</span>`).join("")}</div></section>`:""}
        ${projects?.length?`<section style="margin-bottom:18px;">${sectionHead("Projects")}${projects.map(p=>`<div style="margin-bottom:10px;"><div style="font-weight:600;font-size:13px;">${esc(p.name)}</div><p style="font-size:11px;color:#555;margin:2px 0 4px;">${esc(p.description)}</p><div style="display:flex;flex-wrap:wrap;gap:4px;">${p.technologies.map(t=>`<span style="font-size:10px;color:${accent};background:#f0f7ff;padding:1px 6px;border-radius:3px;">${esc(t)}</span>`).join("")}</div></div>`).join("")}</section>`:""}
        ${certifications?.length?`<section>${sectionHead("Certifications")}<ul style="margin:0;padding:0;list-style:none;">${certifications.map(c=>`<li style="font-size:12px;color:#444;margin-bottom:4px;display:flex;gap:6px;"><span style="color:${accent};">•</span>${esc(c)}</li>`).join("")}</ul></section>`:""}
      </div>
    </div>
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
};

/** Sanitise a resume so theme renderers never receive undefined arrays */
function sanitiseResume(resume: ParsedResume): ParsedResume {
  // Use the shared sanitization utility
  return sanitizeResumeUtil(resume);
}

/** Render a ParsedResume to a full self-contained HTML document */
export function renderThemeHtml(resume: ParsedResume, theme: ThemeId): string {
  try {
    const safe = sanitiseResume(resume);
    const renderer = RENDERERS[theme];
    
    if (!renderer) {
      console.error("[theme-renderer] Unknown theme:", theme, "Available themes:", Object.keys(RENDERERS));
      throw new Error(`Unknown theme: ${theme}`);
    }
    
    const body = renderer(safe);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(safe.contact.name)} — Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
    ul { padding-left: 18px; }
    li { margin-bottom: 2px; }
    p { margin: 0; }
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>${body}</body>
</html>`;
  } catch (err) {
    console.error("[theme-renderer] Error rendering theme HTML:", err);
    console.error("[theme-renderer] Resume data:", JSON.stringify(resume, null, 2));
    throw err; // Re-throw so the API route can handle it
  }
}
