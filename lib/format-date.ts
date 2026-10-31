const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Turn a stored date into something a human (and an ATS) expects.
 * `2021-04` → `Apr 2021`, `2021-04-18` → `Apr 2021`, `Present` stays.
 */
export function formatResumeDate(value?: string | number | null): string {
  if (value === undefined || value === null) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  if (/^(present|current|now|ongoing)$/i.test(raw)) return "Present";

  const iso = raw.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
  if (iso) {
    const month = Number(iso[2]);
    if (month >= 1 && month <= 12) return `${MONTHS[month - 1]} ${iso[1]}`;
    return iso[1];
  }

  const slash = raw.match(/^(\d{1,2})[\/.](\d{4})$/);
  if (slash) {
    const month = Number(slash[1]);
    if (month >= 1 && month <= 12) return `${MONTHS[month - 1]} ${slash[2]}`;
  }

  return raw;
}

/** `Apr 2021 — Present`, or whichever half exists. */
export function formatDateRange(start?: string, end?: string): string {
  const a = formatResumeDate(start);
  const b = formatResumeDate(end);
  if (a && b) return `${a} — ${b}`;
  return a || b;
}
