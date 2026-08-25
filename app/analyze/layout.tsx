import type { Metadata } from "next";
import AnalyzeSeoBanner from "@/components/AnalyzeSeoBanner";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Analyze Resume - ATS Score, AI Suggestions & JD Match | rawcv",
  description: "Get instant ATS compatibility scores, AI-powered improvement suggestions, and job description relevance analysis. Optimize your resume for applicant tracking systems.",
  alternates: { canonical: "https://www.rawcv.com/analyze" },
};

const sections = [
  {
    title: "ATS Score & Compatibility Analysis",
    icon: "score",
    body: "Upload your resume and paste the job description you're targeting. Our AI engine simulates how top-tier ATS platforms — the same ones used by Fortune 500 companies — will parse your document. You'll receive an ATS score out of 100, a detailed section-by-section breakdown, and a clear pass/fail indication. The analysis covers resume length, section headers, keyword density, formatting quirks, and file type compatibility to ensure your document survives the first automated screening.",
  },
  {
    title: "Job Description Match & Keyword Optimization",
    icon: "target",
    body: "Job descriptions are treasure maps — every skill, qualification, and buzzword is a clue about what the hiring algorithm is looking for. Rawcv compares your resume against the job description and returns a match percentage, highlighting which required keywords are present and which are missing. You'll see exactly where to insert critical terms like project management methodologies, specific software proficiencies, or industry certifications to close the gap between your profile and the ideal candidate.",
  },
  {
    title: "AI-Powered Improvement Suggestions",
    icon: "sparkles",
    body: "Beyond just flagging problems, the tool generates actionable rewrite suggestions for each section of your resume. The AI recommends stronger action verbs, quantifiable achievement phrasing, and section restructuring to improve readability and impact. Whether you need to rephrase a bullet point, add missing metrics, or reorder your experience section, the suggestions are tailored to your specific industry and career level. Use the analysis as a roadmap — apply the changes, re-upload, and watch your ATS score climb in real time.",
  },
];

function IconBadge({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    score: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect x="7" y="11" width="3" height="6" rx="0.5"/><rect x="12" y="7" width="3" height="10" rx="0.5"/><rect x="17" y="13" width="3" height="4" rx="0.5"/></svg>
    ),
    target: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>
    ),
    sparkles: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>
    ),
  };
  return (
    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
      {icons[name]}
    </div>
  );
}

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnalyzeSeoBanner />
      <HowToSchema name="How to analyze your resume" description="Check your ATS score and job match in four steps." steps={[{ name: "Upload your resume", text: "Upload your resume as a PDF, DOCX, or TXT file." }, { name: "Run ATS analysis", text: "Run the ATS checker for a score out of 100 with a section-by-section breakdown." }, { name: "Match a job description", text: "Paste the job description to get a match percentage and missing keywords." }, { name: "Apply AI suggestions", text: "Apply AI-powered suggestions, then re-run to watch your score climb." }]} />
      {children}
      {/* ── Learn more (SEO) — professional card layout ── */}
      <section className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Why it works
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              How the resume analyzer helps you get hired
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Your resume gets fewer than seven seconds of a recruiter&apos;s attention before it&apos;s
              tossed into the yes or no pile. Most of those decisions are now made by Applicant
              Tracking Systems (ATS) — the software that parses, scores, and ranks your resume before
              a human ever lays eyes on it. Rawcv&apos;s AI Resume Analyzer gives you the same
              advantage that professional resume writers use: an instant, data-driven breakdown of
              exactly where your resume stands and what needs to change.
            </p>
          </div>

          {/* 3 cards — same SEO text, professional presentation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {sections.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <IconBadge name={s.icon} />
                  <span className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-2">0{i + 1}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white leading-snug mb-2.5">{s.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}