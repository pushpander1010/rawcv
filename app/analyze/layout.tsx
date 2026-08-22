import type { Metadata } from "next";
import AnalyzeSeoBanner from "@/components/AnalyzeSeoBanner";

export const metadata: Metadata = {
  title: "Analyze Resume - ATS Score, AI Suggestions & JD Match | rawcv",
  description: "Get instant ATS compatibility scores, AI-powered improvement suggestions, and job description relevance analysis. Optimize your resume for applicant tracking systems.",
  alternates: { canonical: "https://www.rawcv.com/analyze" },
};

const learnMore = [
  {
    title: "ATS score & compatibility",
    body: "Our engine simulates how top ATS platforms parse your resume, returning a score out of 100 with a section-by-section breakdown of length, headers, keywords, formatting, and file compatibility.",
  },
  {
    title: "Job description match",
    body: "Paste the job you're targeting and see a match percentage with the exact keywords and skills present or missing — so you know precisely where to close the gap.",
  },
  {
    title: "AI suggestions",
    body: "Beyond flagging problems, you get actionable rewrites — stronger action verbs, quantified achievements, and section restructuring tailored to your industry and level.",
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
      {children}

      {/* ── Learn more (SEO) ── */}
      <section className="bg-gray-50 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              How the resume analyzer helps you get hired
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Recruiters spend less than seven seconds on a resume — and most are pre-screened by an
              ATS before a human ever reads them. Rawcv gives you the same data-driven breakdown
              professional resume writers use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learnMore.map((f, i) => (
              <div key={f.title} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-card">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-bold mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
