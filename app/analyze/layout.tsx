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
    body: "Upload your resume and paste the job description you're targeting. Our AI engine simulates how top-tier ATS platforms — the same ones used by Fortune 500 companies — will parse your document. You'll receive an ATS score out of 100, a detailed section-by-section breakdown, and a clear pass/fail indication. The analysis covers resume length, section headers, keyword density, formatting quirks, and file type compatibility to ensure your document survives the first automated screening.",
  },
  {
    title: "Job Description Match & Keyword Optimization",
    body: "Job descriptions are treasure maps — every skill, qualification, and buzzword is a clue about what the hiring algorithm is looking for. Rawcv compares your resume against the job description and returns a match percentage, highlighting which required keywords are present and which are missing. You'll see exactly where to insert critical terms like project management methodologies, specific software proficiencies, or industry certifications to close the gap between your profile and the ideal candidate.",
  },
  {
    title: "AI-Powered Improvement Suggestions",
    body: "Beyond just flagging problems, the tool generates actionable rewrite suggestions for each section of your resume. The AI recommends stronger action verbs, quantifiable achievement phrasing, and section restructuring to improve readability and impact. Whether you need to rephrase a bullet point, add missing metrics, or reorder your experience section, the suggestions are tailored to your specific industry and career level. Use the analysis as a roadmap — apply the changes, re-upload, and watch your ATS score climb in real time.",
  },
];

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
      {/* ── Learn more (SEO) ── */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="max-w-3xl">
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-slate-900 leading-tight">
              How the resume analyzer helps you get hired
            </h2>
            <p className="mt-4 text-[15px] text-slate-600 leading-relaxed">
              Your resume gets fewer than seven seconds of a recruiter&apos;s attention before it&apos;s
              tossed into the yes or no pile. Most of those decisions are now made by Applicant
              Tracking Systems (ATS) — the software that parses, scores, and ranks your resume before
              a human ever lays eyes on it. Rawcv&apos;s AI Resume Analyzer gives you the same
              advantage that professional resume writers use: an instant, data-driven breakdown of
              exactly where your resume stands and what needs to change.
            </p>

            <div className="mt-10 space-y-8">
              {sections.map((s) => (
                <div key={s.title}>
                  <h3 className="text-[16px] font-semibold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-[14.5px] text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
