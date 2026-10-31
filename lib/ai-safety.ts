/**
 * Guardrails for generated resume text.
 *
 * The most damaging failure mode in AI resume tools is a confident invented
 * metric. This module checks generated text against the source and lets routes
 * drop unsafe suggestions instead of putting a fabricated number in a PDF.
 */

const NUMBER_RE = /\b\d+(?:[.,]\d+)?\b/g;

export function numbersIn(text: string): string[] {
  if (!text) return [];
  return (text.match(NUMBER_RE) || []).map((n) => n.replace(/,/g, "")).sort();
}

/**
 * True when generated text introduces a number that does not appear anywhere
 * in the source. Number formatting differences (1,000 vs 1000) are ignored.
 */
export function addsNewNumbers(source: string, generated: string): boolean {
  const sourceNumbers = new Set(numbersIn(source));
  for (const n of numbersIn(generated)) {
    if (!sourceNumbers.has(n)) return true;
  }
  return false;
}

export function hasFirstPerson(text: string): boolean {
  return /\b(i|my|me|we|our)\b/i.test(text);
}

export interface SafeSuggestion {
  section: string;
  original: string;
  improved: string;
  reason: string;
}

/** Drop suggestions that invent numbers, use first person, or add nothing. */
export function filterUnsafeSuggestions<T extends SafeSuggestion>(suggestions: T[]): T[] {
  return suggestions.filter((s) => {
    if (!s.improved?.trim() || !s.original?.trim()) return false;
    if (s.improved.trim() === s.original.trim()) return false;
    if (addsNewNumbers(s.original, s.improved)) return false;
    if (hasFirstPerson(s.improved)) return false;
    return true;
  });
}
