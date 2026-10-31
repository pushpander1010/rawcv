import type { ParsedResume } from "@/types";

/**
 * Honest, deterministic review of a resume against the patterns behind
 * big-tech screens. No AI, no flattery: missing GPA/GitHub, duty-style
 * bullets, and zero metrics all cost points.
 *
 * The public score is normalised 0–100 across the categories that apply to
 * this candidate. Weights are intentionally seniority-aware: projects and GPA
 * matter much more for students than for someone with four roles.
 */

export type ScoreImpact = "high" | "medium" | "low";

export interface ScoreIssue {
  id: string;
  title: string;
  detail: string;
  impact: ScoreImpact;
  fix: string;
  section: "contact" | "summary" | "experience" | "education" | "skills" | "projects" | "awards" | "format";
}

export interface ScoreCategory {
  key: string;
  label: string;
  score: number;
  max: number;
  detail: string;
}

export interface ResumeScore {
  score: number;
  band: "Strong" | "Competitive" | "Needs work";
  categories: ScoreCategory[];
  issues: ScoreIssue[];
  wordCount: number;
  metricsRatio: number;
}

const STRONG_VERBS = [
  "led", "built", "designed", "shipped", "launched", "reduced", "increased", "improved",
  "cut", "grew", "drove", "delivered", "implemented", "developed", "created", "architected",
  "optimized", "automated", "migrated", "scaled", "mentored", "owned", "spearheaded",
  "refactored", "debugged", "analyzed", "established", "negotiated", "saved", "accelerated",
  "eliminated", "generated", "partnered", "rewrote", "standardized", "unblocked", "introduced",
];

const WEAK_STARTS = [
  "responsible for", "was responsible", "helped", "worked on", "assisted", "involved in",
  "participated", "handled", "tasked", "used ", "utilized", "supported", "contributed to",
];

const GENERIC_SUMMARY = [
  "hardworking", "passionate", "team player", "detail-oriented", "results-driven",
  "self-motivated", "go-getter", "think outside the box", "seeking a challenging",
  "looking for an opportunity", "dynamic professional",
];

const SOFT_SKILLS = new Set([
  "communication", "teamwork", "leadership", "problem solving", "problem-solving",
  "time management", "adaptability", "critical thinking", "collaboration", "creativity",
  "hardworking", "organized", "detail oriented", "detail-oriented",
]);

const METRIC_RE = /(\d+(?:[.,]\d+)?\s*%|\$\s?\d|₹\s?\d|£\s?\d|\b\d+(?:[.,]\d+)?\s*(?:k|m|b|ms|s|x|hours?|days?|weeks?|users?|customers?|orders?|requests?|merchants?|records?|events?|teams?|people|engineers?|stars?|downloads?|installs?|queries|qps|rps)\b|\b\d{2,}\b)/i;

const PREFERRED_VERB_SET = new Set(STRONG_VERBS);

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function pct(part: number, total: number): number {
  return total > 0 ? part / total : 0;
}

function yearFrom(value?: string): number | null {
  if (!value) return null;
  const m = String(value).match(/(19|20)\d{2}/);
  return m ? Number(m[0]) : null;
}

function addIssue(
  issues: ScoreIssue[],
  issue: Omit<ScoreIssue, "id">
) {
  issues.push({ id: `${issue.section}-${issues.length}`, ...issue });
}

export function scoreResume(resume: ParsedResume | null): ResumeScore {
  const issues: ScoreIssue[] = [];
  if (!resume) {
    return {
      score: 0,
      band: "Needs work",
      categories: [],
      issues: [{
        id: "empty",
        title: "No resume data",
        detail: "Add your details to run the review.",
        impact: "high",
        fix: "Fill in the editor on the left, then review again.",
        section: "format",
      }],
      wordCount: 0,
      metricsRatio: 0,
    };
  }

  const r = resume;
  const allBullets = r.experience.flatMap((e) => e.bullets || []).filter((b) => b?.trim());
  const allText = [
    r.summary || "",
    ...r.experience.flatMap((e) => [e.title, e.company, ...(e.bullets || [])]),
    ...r.education.flatMap((e) => [e.institution, e.degree, e.field, e.gpa || "", ...(e.coursework || [])]),
    ...r.skills,
    ...(r.projects || []).flatMap((p) => [p.name, p.description, ...(p.bullets || []), ...(p.technologies || [])]),
    ...(r.certifications || []),
    ...(r.awards || []),
  ].join(" ");
  const wordCount = words(allText).length;
  const metricBullets = allBullets.filter((b) => METRIC_RE.test(b));
  const metricsRatio = allBullets.length ? metricBullets.length / allBullets.length : 0;

  const currentYear = new Date().getFullYear();
  const earliestYear = r.experience
    .map((e) => yearFrom(e.startDate))
    .filter((y): y is number => y !== null)
    .sort((a, b) => a - b)[0];
  const yearsExperience = earliestYear ? Math.max(0, currentYear - earliestYear) : r.experience.length;
  const earlyCareer = yearsExperience < 3 || r.experience.length <= 1;
  const newestGradYear = r.education
    .map((e) => yearFrom(e.graduationYear))
    .filter((y): y is number => y !== null)
    .sort((a, b) => b - a)[0];
  const student = earlyCareer || (newestGradYear !== null && newestGradYear >= currentYear - 1);

  const categories: ScoreCategory[] = [];

  // ── Contact ────────────────────────────────────────────────────────────────
  {
    const contact = r.contact;
    const checks: Array<[boolean, number]> = [
      [!!contact.name?.trim(), 2],
      [!!contact.email?.trim(), 3],
      [!!contact.phone?.trim(), 1],
      [!!contact.location?.trim(), 1],
      [!!contact.linkedin?.trim(), 2],
      [!!contact.github?.trim(), 2],
      [!!contact.website?.trim(), 1],
    ];
    const score = checks.reduce((sum, [ok, pts]) => sum + (ok ? pts : 0), 0);
    categories.push({ key: "contact", label: "Contact", score, max: 12, detail: "Name, email, phone, location, LinkedIn, GitHub, portfolio" });
    if (!contact.github?.trim() && !contact.website?.trim()) {
      addIssue(issues, {
        title: "No GitHub or portfolio link",
        detail: "Big-tech engineering screens look for a GitHub or live portfolio near the top.",
        impact: "high",
        fix: "Add github.com/username (or your portfolio) in Your details.",
        section: "contact",
      });
    } else if (!contact.github?.trim()) {
      addIssue(issues, {
        title: "GitHub not listed separately",
        detail: "Google's engineering guidance calls out GitHub explicitly. A portfolio alone is weaker.",
        impact: "medium",
        fix: "Add your GitHub URL in Your details.",
        section: "contact",
      });
    }
    if (!contact.phone?.trim()) {
      addIssue(issues, {
        title: "Missing phone number",
        detail: "Recruiters expect a direct phone number in the contact line.",
        impact: "medium",
        fix: "Add a phone number with country code.",
        section: "contact",
      });
    }
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  {
    let score = 0;
    const max = 30;
    if (r.experience.length) score += 4;
    if (r.experience.length >= 2) score += 2;

    const bulletsPerRole = r.experience.map((e) => (e.bullets || []).filter(Boolean).length);
    const goodDensity = bulletsPerRole.filter((n) => n >= 2 && n <= 5).length;
    score += pct(goodDensity, Math.max(1, r.experience.length)) * 5;

    score += Math.min(1, metricsRatio / 0.5) * 8;

    const strongStart = allBullets.filter((b) => {
      const first = b.trim().toLowerCase().split(/\s+/)[0]?.replace(/[^a-z]/g, "");
      return first ? PREFERRED_VERB_SET.has(first) : false;
    }).length;
    score += pct(strongStart, Math.max(1, allBullets.length)) * 5;

    const firstPerson = allBullets.filter((b) => /\b(i|my|me)\b/i.test(b)).length;
    if (firstPerson === 0) score += 2;

    const completeDates = r.experience.filter((e) => e.startDate && e.endDate).length;
    score += pct(completeDates, Math.max(1, r.experience.length)) * 4;

    score = clamp(score, 0, max);
    categories.push({ key: "experience", label: "Experience", score, max, detail: "Role depth, bullet density, metrics, action verbs, dates" });

    if (!r.experience.length) {
      addIssue(issues, {
        title: "No work experience",
        detail: "Internships, research, freelance, and open source all count. A projects-only resume is much weaker.",
        impact: "high",
        fix: "Add at least one role or a substantial project under Experience.",
        section: "experience",
      });
    } else {
      if (metricsRatio < 0.35) {
        addIssue(issues, {
          title: "Most bullets have no measurable result",
          detail: `Only ${Math.round(metricsRatio * 100)}% of bullets contain a number. In Google-reviewed resumes, roughly 42% do — top ones go further.`,
          impact: "high",
          fix: "Add a real metric to each strong bullet: users, %, latency, $, time saved, scale.",
          section: "experience",
        });
      }
      if (allBullets.length && pct(strongStart, allBullets.length) < 0.6) {
        addIssue(issues, {
          title: "Weak bullet openings",
          detail: "Too many bullets start with duties or soft verbs instead of led / built / reduced / shipped.",
          impact: "high",
          fix: "Start every bullet with a strong action verb, then the result, then the method.",
          section: "experience",
        });
      }
      if (firstPerson > 0) {
        addIssue(issues, {
          title: "First-person pronouns",
          detail: "Resume bullets should omit I / my / me.",
          impact: "medium",
          fix: "Remove pronouns: “I built…” → “Built…”.",
          section: "experience",
        });
      }
      if (bulletsPerRole.some((n) => n < 2)) {
        addIssue(issues, {
          title: "A role has fewer than two bullets",
          detail: "Each role needs at least two achievement bullets, ideally 2–4.",
          impact: "medium",
          fix: "Add another outcome-focused bullet to the thin role.",
          section: "experience",
        });
      }
      if (bulletsPerRole.some((n) => n > 5)) {
        addIssue(issues, {
          title: "A role has too many bullets",
          detail: "Five+ bullets usually means duty-listing or wasted space. Keep the highest-impact 2–4.",
          impact: "low",
          fix: "Cut duties and keep only measurable achievements.",
          section: "experience",
        });
      }
    }
  }

  // ── Education ──────────────────────────────────────────────────────────────
  {
    let score = 0;
    const max = 16;
    const edu = r.education[0];
    if (edu) {
      if (edu.institution?.trim()) score += 3;
      if (edu.degree?.trim()) score += 3;
      if (edu.graduationYear?.trim()) score += 2;
      if (edu.gpa?.trim()) score += 3;
      if (edu.coursework?.length) score += 2;
      if (edu.field?.trim()) score += 1;
      if (r.education.length && r.education.every((e) => e.institution && e.degree)) score += 2;
    }
    categories.push({ key: "education", label: "Education", score: clamp(score, 0, max), max, detail: "School, degree, graduation year, GPA, relevant coursework" });

    if (!edu) {
      addIssue(issues, {
        title: "No education section",
        detail: "Almost every ATS and big-tech screen expects education.",
        impact: "high",
        fix: "Add your degree, school, graduation year, and GPA.",
        section: "education",
      });
    } else {
      if (!edu.gpa?.trim() && (student || earlyCareer)) {
        addIssue(issues, {
          title: "No GPA listed",
          detail: "About a quarter of Google-passing resumes include GPA, averaging 3.7/4.0. It matters most for students and early-career candidates.",
          impact: "medium",
          fix: "Add GPA if it is 3.5+ (or equivalent); otherwise leave it off.",
          section: "education",
        });
      }
      if (!edu.coursework?.length && student) {
        addIssue(issues, {
          title: "No relevant coursework",
          detail: "Coursework gives students without strong internships another keyword surface.",
          impact: "low",
          fix: "Add 4–6 courses relevant to the target role.",
          section: "education",
        });
      }
    }
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  {
    const max = 14;
    let score = 0;
    const skills = r.skills.filter(Boolean);
    if (skills.length >= 6) score += 3;
    if (skills.length >= 10 && skills.length <= 20) score += 2;
    const hardSkills = skills.filter((s) => !SOFT_SKILLS.has(s.toLowerCase()));
    score += Math.min(4, pct(hardSkills.length, Math.max(1, skills.length)) * 4);
    const bulletText = allBullets.join(" ").toLowerCase();
    const usedInBullets = skills.filter((s) => bulletText.includes(s.toLowerCase())).length;
    score += Math.min(4, pct(usedInBullets, Math.max(1, skills.length)) * 4);
    if (skills.length && new Set(skills.map((s) => s.toLowerCase())).size === skills.length) score += 1;
    categories.push({ key: "skills", label: "Skills", score: clamp(score, 0, max), max, detail: "Relevant hard skills, depth, and evidence in bullets" });

    if (skills.length < 6) {
      addIssue(issues, {
        title: "Too few skills",
        detail: "ATS keyword matching needs a real inventory. Big-tech engineering resumes usually list 8–15 hard skills.",
        impact: "high",
        fix: "Add languages, frameworks, cloud, data, and tools you can defend in interview.",
        section: "skills",
      });
    }
    if (pct(usedInBullets, Math.max(1, skills.length)) < 0.35) {
      addIssue(issues, {
        title: "Skills are listed but not demonstrated",
        detail: "Fewer than a third of your listed skills appear in a bullet. Recruiters discount unproven skill lists.",
        impact: "medium",
        fix: "Weave the important skills into achievement bullets instead of only the skills line.",
        section: "skills",
      });
    }
  }

  // ── Projects ───────────────────────────────────────────────────────────────
  {
    const projects = r.projects || [];
    const applicable = student || projects.length > 0;
    const max = applicable ? 10 : 0;
    let score = 0;
    if (projects.length) {
      score += 3;
      if (projects.some((p) => p.link?.trim())) score += 2;
      if (projects.some((p) => (p.bullets || []).length >= 1 || p.description?.trim())) score += 3;
      if (projects.some((p) => (p.technologies || []).length >= 2)) score += 2;
    }
    if (applicable) {
      categories.push({ key: "projects", label: "Projects", score: clamp(score, 0, max), max, detail: "At least one project with stack, link, and outcome" });
    }
    if (student && projects.length === 0) {
      addIssue(issues, {
        title: "No projects for an early-career profile",
        detail: "Most Google-passing student resumes include a projects section — 83% in a 249-resume sample.",
        impact: "high",
        fix: "Add 1–2 projects with stack, a link, and a measurable result.",
        section: "projects",
      });
    } else if (projects.length && !projects.some((p) => p.link?.trim())) {
      addIssue(issues, {
        title: "Project has no link",
        detail: "Portfolio and GitHub links let a reviewer verify the work in seconds.",
        impact: "medium",
        fix: "Add a GitHub or live demo link to your strongest project.",
        section: "projects",
      });
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  {
    const max = 8;
    let score = 0;
    const summary = r.summary?.trim() ?? "";
    const sw = words(summary).length;
    if (sw >= 20) score += 2;
    if (sw >= 30 && sw <= 90) score += 2;
    if (/\b(years?|engineer|developer|designer|manager|analyst|scientist)\b/i.test(summary)) score += 2;
    if (METRIC_RE.test(summary)) score += 1;
    if (!GENERIC_SUMMARY.some((g) => summary.toLowerCase().includes(g))) score += 1;
    categories.push({ key: "summary", label: "Summary", score: clamp(score, 0, max), max, detail: "Role, years, strongest result, no generic adjectives" });
    if (sw > 0 && sw < 20) {
      addIssue(issues, {
        title: "Summary is too thin",
        detail: "A 20–60 word summary should state role, years, domain, and one real result.",
        impact: "medium",
        fix: "Rewrite with role + years + strongest measurable result.",
        section: "summary",
      });
    }
    if (GENERIC_SUMMARY.some((g) => summary.toLowerCase().includes(g))) {
      addIssue(issues, {
        title: "Generic summary language",
        detail: "Phrases like “passionate”, “hardworking”, or “team player” add no signal.",
        impact: "low",
        fix: "Replace adjectives with evidence: scope, stack, and outcomes.",
        section: "summary",
      });
    }
  }

  // ── Awards ─────────────────────────────────────────────────────────────────
  {
    const awards = r.awards || [];
    const max = 4;
    const score = awards.length ? (student ? 4 : 2) : 0;
    categories.push({ key: "awards", label: "Awards", score, max, detail: "Honors, scholarships, hackathons, leadership" });
    if (!awards.length && student) {
      addIssue(issues, {
        title: "No awards or leadership",
        detail: "Google explicitly asks for honors, scholarships, hackathons, publications, and leadership.",
        impact: "low",
        fix: "Add 1–3 real awards and leadership items.",
        section: "awards",
      });
    }
  }

  // ── Presentation ───────────────────────────────────────────────────────────
  {
    const max = 6;
    let score = 0;
    if (wordCount >= 250 && wordCount <= 700) score += 3;
    else if (wordCount > 700) score += 1;
    if (r.sectionOrder?.length) score += 1;
    if (!allBullets.some((b) => /\bresponsible for\b/i.test(b))) score += 1;
    if (allBullets.every((b) => b.trim().length >= 20)) score += 1;
    categories.push({ key: "presentation", label: "Presentation", score: clamp(score, 0, max), max, detail: "One-page density and clean, direct bullets" });

    if (wordCount > 800) {
      addIssue(issues, {
        title: "Likely longer than one page",
        detail: `About ${wordCount} words. One page is the default for under ten years of experience.`,
        impact: "medium",
        fix: "Cut older roles to 1–2 bullets and remove duties.",
        section: "format",
      });
    } else if (wordCount < 220) {
      addIssue(issues, {
        title: "Resume is thin",
        detail: `About ${wordCount} words. A full one-page engineering resume usually carries 350–650 words.`,
        impact: "medium",
        fix: "Add measurable outcomes, projects, or relevant coursework.",
        section: "format",
      });
    }
  }

  const earned = categories.reduce((sum, c) => sum + c.score, 0);
  const total = categories.reduce((sum, c) => sum + c.max, 0);
  const score = Math.round((earned / Math.max(1, total)) * 100);
  const band = score >= 85 ? "Strong" : score >= 65 ? "Competitive" : "Needs work";

  const rank: Record<ScoreImpact, number> = { high: 0, medium: 1, low: 2 };
  issues.sort((a, b) => rank[a.impact] - rank[b.impact]);

  return { score, band, categories, issues, wordCount, metricsRatio };
}
