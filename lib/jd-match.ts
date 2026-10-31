/**
 * Deterministic resume ↔ job-description matcher.
 * No API, no hallucinations: extracts known skills/terms from the JD and checks
 * whether the resume actually contains them.
 */

const SKILLS = [
  // languages
  "python", "java", "javascript", "typescript", "c++", "c#", "go", "golang", "rust", "ruby",
  "php", "swift", "kotlin", "scala", "sql", "bash", "r", "matlab", "perl", "dart",
  // frontend
  "react", "next.js", "nextjs", "vue", "angular", "svelte", "redux", "tailwind", "css",
  "html", "accessibility", "design systems", "web performance", "responsive design",
  // backend
  "node.js", "nodejs", "express", "django", "flask", "fastapi", "spring", "rails",
  "laravel", ".net", "graphql", "rest", "grpc", "microservices", "distributed systems",
  "system design", "api design", "websockets", "event-driven",
  // cloud / devops
  "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "jenkins", "ci/cd",
  "github actions", "linux", "serverless", "lambda", "ec2", "s3", "cloudformation",
  "observability", "datadog", "grafana", "prometheus", "incident response", "on-call",
  // data
  "postgresql", "postgres", "mysql", "mongodb", "redis", "dynamodb", "snowflake",
  "bigquery", "kafka", "spark", "hadoop", "elasticsearch", "airflow", "dbt", "etl",
  "data pipelines", "data modeling", "analytics", "a/b testing", "experimentation",
  "machine learning", "pytorch", "tensorflow", "scikit-learn", "nlp", "llm", "rag",
  // mobile
  "ios", "android", "react native", "flutter", "swiftui", "jetpack compose",
  // product / business
  "product strategy", "roadmap", "roadmapping", "user research", "product analytics",
  "pricing", "go-to-market", "gtm", "stakeholder management", "okrs", "agile", "scrum",
  "kanban", "jira", "figma", "sql analytics", "forecasting", "business intelligence",
  "tableau", "looker", "power bi", "excel", "financial modeling", "market research",
  // general engineering
  "testing", "unit testing", "integration testing", "code review", "mentorship",
  "performance optimization", "scalability", "reliability", "security", "oauth",
  "monitoring", "debugging", "architecture", "technical leadership",
];

const STOP = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "have", "has", "that",
  "this", "from", "they", "their", "who", "what", "when", "where", "which", "while", "about",
  "into", "over", "under", "across", "through", "using", "use", "used", "work", "working",
  "team", "teams", "role", "job", "company", "ability", "experience", "years", "year",
  "strong", "good", "great", "excellent", "required", "requirements", "preferred", "plus",
  "including", "include", "etc", "such", "as", "or", "of", "to", "in", "on", "at", "by",
  "is", "be", "can", "may", "not", "all", "any", "more", "most", "other", "new", "well",
  "candidate", "candidates", "build", "building", "develop", "developing", "design",
  "designing", "help", "helping", "ensure", "ensuring", "drive", "driving",
]);

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesTerm(text: string, term: string): boolean {
  const escaped = escapeRe(term);
  return new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, "i").test(text);
}

export function resumeText(resume: {
  summary?: string;
  experience?: Array<{ company?: string; title?: string; bullets?: string[] }>;
  education?: Array<{ institution?: string; degree?: string; field?: string; coursework?: string[] }>;
  skills?: string[];
  certifications?: string[];
  awards?: string[];
  projects?: Array<{ name?: string; description?: string; technologies?: string[]; bullets?: string[] }>;
}): string {
  return [
    resume.summary || "",
    ...(resume.experience || []).flatMap((e) => [e.company || "", e.title || "", ...(e.bullets || [])]),
    ...(resume.education || []).flatMap((e) => [e.institution || "", e.degree || "", e.field || "", ...(e.coursework || [])]),
    ...(resume.skills || []),
    ...(resume.certifications || []),
    ...(resume.awards || []),
    ...(resume.projects || []).flatMap((p) => [p.name || "", p.description || "", ...(p.technologies || []), ...(p.bullets || [])]),
  ].join("\n").toLowerCase();
}

export interface JobMatchResult {
  score: number;
  matched: string[];
  missing: string[];
  total: number;
  jdKeywords: string[];
}

export function matchJob(resume: Parameters<typeof resumeText>[0], jd: string): JobMatchResult {
  const text = resumeText(resume);
  const lowerJd = jd.toLowerCase();

  const found: Array<{ term: string; weight: number }> = [];
  for (const skill of SKILLS) {
    if (!includesTerm(lowerJd, skill)) continue;
    const count = (lowerJd.match(new RegExp(escapeRe(skill), "g")) || []).length;
    found.push({ term: skill, weight: 2 + Math.min(3, count) });
  }

  // Add frequent meaningful JD tokens for terms outside the skill dictionary.
  const tokens = lowerJd.match(/[a-z][a-z0-9+#.\-]{2,}/g) || [];
  const counts = new Map<string, number>();
  for (const token of tokens) {
    if (STOP.has(token) || token.length < 4 || /^\d+$/.test(token)) continue;
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  for (const [term, count] of Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 30)) {
    if (found.some((f) => f.term === term)) continue;
    if (found.some((f) => f.term.includes(term) || term.includes(f.term))) continue;
    found.push({ term, weight: Math.min(2, count) });
  }

  found.sort((a, b) => b.weight - a.weight);
  const keywords = found.slice(0, 40);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const { term } of keywords) {
    if (includesTerm(text, term)) matched.push(term);
    else missing.push(term);
  }

  const earned = keywords.filter((k) => matched.includes(k.term)).reduce((s, k) => s + k.weight, 0);
  const totalWeight = keywords.reduce((s, k) => s + k.weight, 0);
  const score = totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0;

  return {
    score: Math.max(0, Math.min(100, score)),
    matched,
    missing: missing.filter((term) => SKILLS.includes(term)).slice(0, 12),
    total: keywords.length,
    jdKeywords: keywords.map((k) => k.term),
  };
}
