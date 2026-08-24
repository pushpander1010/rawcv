"use client";
// Shared download logic for resume PDFs

import { fetchWithRetry, safeJsonParse } from "@/lib/fetch-retry";
import { renderThemeHtml } from "@/lib/theme-renderer";
import type { ParsedResume, ThemeId } from "@/types";

export function validateResume(resume: ParsedResume | null | undefined): string | null {
  if (!resume) return "Resume data is missing";
  if (!resume.contact?.name?.trim()) return "Please enter your name";
  if (!resume.contact?.email?.trim()) return "Please enter your email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.contact.email)) return "Please enter a valid email";
  const hasExp = resume.experience && resume.experience.length > 0;
  const hasEdu = resume.education && resume.education.length > 0;
  const hasSkills = resume.skills && resume.skills.length > 0;
  if (!hasExp && !hasEdu && !hasSkills) return "Add at least one section: experience, education, or skills";
  return null;
}

export function safeName(name: string | undefined): string {
  return (name || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume";
}

export async function downloadViaApi(resume: ParsedResume, theme: string, endpoint: string): Promise<{ blob?: Blob; fallbackHtml?: string; error?: string }> {
  const sName = safeName(resume.contact?.name);
  const res = await fetchWithRetry(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parsed: resume, theme }),
  }, 1, 90000);

  if (!res.ok) {
    let json: { fallbackHtml?: string; message?: string } = {};
    try { json = await safeJsonParse<{ fallbackHtml?: string; message?: string }>(res); } catch {}
    if (json.fallbackHtml) return { fallbackHtml: json.fallbackHtml };
    return { error: json.message || "PDF generation failed. Please try again." };
  }
  const blob = await res.blob();
  return { blob };
}

export function openPrintWindow(html: string, sName: string): Window | null {
  const printHtml = html.replace(
    "</head>",
    `<style>@page{margin:0;size:A4}body{margin:0}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
      <script>window.onload=function(){document.title="${sName}-resume";window.print();window.onafterprint=function(){window.close()}};<\/script></head>`
  );
  const win = window.open("", "_blank");
  if (!win) return null;
  win.document.write(printHtml);
  win.document.close();
  return win;
}

export function downloadBlob(blob: Blob, sName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sName}-resume.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export function browserPrint(resume: ParsedResume, theme: string): string {
  return renderThemeHtml(resume, theme as ThemeId);
}
