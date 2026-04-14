/**
 * Normalise text for fuzzy matching:
 * - trim whitespace
 * - collapse internal whitespace to single spaces
 * - lowercase
 */
export function normalise(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Find the index of `target` in `arr` using normalised equality.
 * Falls back to a "starts-with" check for cases where the AI truncated the text.
 */
export function findIndex(arr: string[], target: string): number {
  const norm = normalise(target);
  // 1. Exact normalised match
  let idx = arr.findIndex((s) => normalise(s) === norm);
  if (idx !== -1) return idx;
  // 2. One contains the other (handles AI truncation / extra punctuation)
  idx = arr.findIndex((s) => {
    const sn = normalise(s);
    return sn.includes(norm) || norm.includes(sn);
  });
  return idx;
}
