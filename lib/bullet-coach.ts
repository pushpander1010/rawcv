/**
 * Deterministic bullet review / safe polish.
 *
 * This deliberately does not invent metrics or rewrite meaning. It catches the
 * same failures a recruiter sees in the first scan — weak opener, no metric,
 * too long/short, first person, filler — and can apply safe wording fixes.
 */

export interface BulletIssue {
  code: "weak_opener" | "no_metric" | "too_long" | "too_short" | "first_person" | "filler" | "passive";
  label: string;
  severity: "high" | "medium" | "low";
}

export interface BulletReview {
  score: number;
  wordCount: number;
  hasMetric: boolean;
  strongVerb: boolean;
  issues: BulletIssue[];
  polish: string;
}

const STRONG_VERBS = new Set([
  "led", "built", "designed", "shipped", "launched", "reduced", "increased", "improved",
  "cut", "grew", "drove", "delivered", "implemented", "developed", "created", "architected",
  "optimized", "automated", "migrated", "scaled", "mentored", "owned", "spearheaded",
  "refactored", "debugged", "analyzed", "established", "negotiated", "saved", "accelerated",
  "eliminated", "generated", "partnered", "rewrote", "standardized", "introduced", "closed",
  "migrated", "rebuilt", "instrumented", "diagnosed", "streamlined", "secured", "trained",
]);

const WEAK_OPENERS: Array<[RegExp, string]> = [
  [/^responsible for\s+/i, ""],
  [/^was responsible for\s+/i, ""],
  [/^worked on\s+/i, "Contributed to "],
  [/^helped (with|to)\s+/i, "Supported "],
  [/^assisted (with|in)\s+/i, "Supported "],
  [/^participated in\s+/i, "Contributed to "],
  [/^involved in\s+/i, "Contributed to "],
  [/^tasked with\s+/i, "Delivered "],
  [/^handled\s+/i, "Managed "],
];

const FILLER_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\ba lot of\b/gi, ""],
  [/\bvarious\b/gi, ""],
  [/\bnumerous\b/gi, ""],
  [/\bsuccessfully\b/gi, ""],
  [/\bvery\b/gi, ""],
  [/\bextremely\b/gi, ""],
  [/\bhighly\b/gi, ""],
  [/\bbasically\b/gi, ""],
  [/\bactually\b/gi, ""],
  [/\butilized\b/gi, "used"],
  [/\butilize\b/gi, "use"],
  [/\bleveraged\b/gi, "used"],
  [/\bleverage\b/gi, "use"],
];

const METRIC_RE =
  /(\d+(?:[.,]\d+)?\s*%|\$\s?\d|₹\s?\d|£\s?\d|\b\d+(?:[.,]\d+)?\s*(?:k|m|b|ms|s|x|hours?|days?|weeks?|months?|users?|customers?|orders?|requests?|merchants?|records?|events?|teams?|people|engineers?|stars?|downloads?|installs?|queries|qps|rps)\b|\b\d{2,}\b)/i;

function clean(text: string): string {
  return text.replace(/^[\s•●▪◦*\-–—]+/, "").trim();
}

export function reviewBullet(raw: string): BulletReview {
  const text = clean(raw);
  const wordCount = text ? text.split(/\s+/).length : 0;
  const first = text.toLowerCase().split(/\s+/)[0]?.replace(/[^a-z]/g, "") ?? "";
  const strongVerb = STRONG_VERBS.has(first);
  const hasMetric = METRIC_RE.test(text);
  const firstPerson = /\b(i|my|me|we|our)\b/i.test(text);
  const hasFiller = FILLER_REPLACEMENTS.some(([re]) => re.test(text));
  const weakOpener = WEAK_OPENERS.some(([re]) => re.test(text)) || (!strongVerb && first.length > 0);
  const passive = /^(was|were|is|are|been|being)\b/i.test(text) || /\bwas (?:built|created|designed|led|managed)\b/i.test(text);

  const issues: BulletIssue[] = [];
  if (!hasMetric) issues.push({ code: "no_metric", label: "No metric", severity: "high" });
  if (weakOpener) issues.push({ code: "weak_opener", label: "Weak opener", severity: "high" });
  if (firstPerson) issues.push({ code: "first_person", label: "First person", severity: "medium" });
  if (passive) issues.push({ code: "passive", label: "Passive voice", severity: "medium" });
  if (wordCount > 30) issues.push({ code: "too_long", label: "Too long", severity: "medium" });
  if (wordCount > 0 && wordCount < 8) issues.push({ code: "too_short", label: "Too vague", severity: "medium" });
  if (hasFiller) issues.push({ code: "filler", label: "Filler words", severity: "low" });

  let score = 0;
  if (strongVerb) score += 30;
  else if (!weakOpener) score += 15;
  if (hasMetric) score += 35;
  if (wordCount >= 12 && wordCount <= 28) score += 20;
  else if (wordCount >= 8 && wordCount <= 32) score += 10;
  if (!firstPerson && !passive) score += 15;
  score = Math.max(0, Math.min(100, score));

  return { score, wordCount, hasMetric, strongVerb, issues, polish: polishBullet(text) };
}

/** Safe polish: remove pronouns/filler and neutralise weak framing. No new facts. */
export function polishBullet(raw: string): string {
  let text = clean(raw);
  if (!text) return "";

  // Strip first-person pronouns without changing the action.
  text = text.replace(/\b(?:I|we)\s+/gi, "").replace(/\bmy\b/gi, "").replace(/\bour\b/gi, "");

  // "Responsible for improving X" → "Improved X" for common action gerunds.
  const duty = text.match(/^(?:was\s+)?responsible\s+for\s+([a-z]+ing)\b(.*)$/i);
  if (duty) {
    const gerund = duty[1].toLowerCase();
    const map: Record<string, string> = {
      leading: "Led", managing: "Managed", building: "Built", designing: "Designed",
      developing: "Developed", creating: "Created", implementing: "Implemented",
      improving: "Improved", reducing: "Reduced", increasing: "Increased",
      maintaining: "Maintained", shipping: "Shipped", launching: "Launched",
      delivering: "Delivered", driving: "Drove", owning: "Owned",
      supporting: "Supported", testing: "Tested", migrating: "Migrated",
      automating: "Automated", optimizing: "Optimized", mentoring: "Mentored",
    };
    if (map[gerund]) {
      text = `${map[gerund]}${duty[2] || ""}`.trim();
    }
  }

  for (const [pattern, replacement] of WEAK_OPENERS) {
    if (pattern.test(text)) {
      text = text.replace(pattern, replacement);
      break;
    }
  }

  for (const [pattern, replacement] of FILLER_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }

  text = text.replace(/\s{2,}/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
  if (text) text = text.charAt(0).toUpperCase() + text.slice(1);
  if (text && !/[.!?]$/.test(text)) text += ".";
  return text;
}

function sameMeaning(a: string, b: string): boolean {
  return a.toLowerCase().replace(/[.!?]+$/, "").trim() === b.toLowerCase().replace(/[.!?]+$/, "").trim();
}

export function polishResumeBullets(bullets: string[]): { bullets: string[]; changed: number } {
  let changed = 0;
  const next = bullets.map((b) => {
    const polished = polishBullet(b);
    if (polished && !sameMeaning(polished, b)) changed += 1;
    return polished || b;
  });
  return { bullets: next, changed };
}

export function bulletSummary(bullets: string[]): {
  average: number;
  weak: number;
  missingMetrics: number;
  total: number;
} {
  const reviews = bullets.filter((b) => b.trim()).map(reviewBullet);
  if (!reviews.length) return { average: 0, weak: 0, missingMetrics: 0, total: 0 };
  return {
    average: Math.round(reviews.reduce((s, r) => s + r.score, 0) / reviews.length),
    weak: reviews.filter((r) => r.score < 60).length,
    missingMetrics: reviews.filter((r) => !r.hasMetric).length,
    total: reviews.length,
  };
}

export function isMetricBullet(text: string): boolean {
  return METRIC_RE.test(text);
}
