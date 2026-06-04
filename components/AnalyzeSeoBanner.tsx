"use client";

import { useSession } from "next-auth/react";

export default function AnalyzeSeoBanner() {
  const { status } = useSession();

  // Show SEO content only for unauthenticated (or loading) users
  if (status === "authenticated") return null;

  return (
    <section className="bg-white dark:bg-gray-950 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          AI Resume Analyzer &amp; ATS Checker
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Your resume gets fewer than seven seconds of a recruiter&apos;s attention before it&apos;s
          tossed into the yes or no pile. Most of those decisions are now made by Applicant Tracking
          Systems (ATS) — the software that parses, scores, and ranks your resume before a human ever
          lays eyes on it. Rawcv&apos;s AI Resume Analyzer gives you the same advantage that
          professional resume writers use: an instant, data-driven breakdown of exactly where your
          resume stands and what needs to change.
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
          ATS Score &amp; Compatibility Analysis
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Upload your resume and paste the job description you&apos;re targeting. Our AI engine
          simulates how top-tier ATS platforms — the same ones used by Fortune 500 companies — will
          parse your document. You&apos;ll receive an ATS score out of 100, a detailed section-by-section
          breakdown, and a clear pass/fail indication. The analysis covers resume length, section
          headers, keyword density, formatting quirks, and file type compatibility to ensure your
          document survives the first automated screening.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-white">
          Job Description Match &amp; Keyword Optimization
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Job descriptions are treasure maps — every skill, qualification, and buzzword is a clue
          about what the hiring algorithm is looking for. Rawcv compares your resume against the job
          description and returns a match percentage, highlighting which required keywords are present
          and which are missing. You&apos;ll see exactly where to insert critical terms like project
          management methodologies, specific software proficiencies, or industry certifications to
          close the gap between your profile and the ideal candidate.
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-white">
          AI-Powered Improvement Suggestions
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Beyond just flagging problems, the tool generates actionable rewrite suggestions for each
          section of your resume. The AI recommends stronger action verbs, quantifiable achievement
          phrasing, and section restructuring to improve readability and impact. Whether you need to
          rephrase a bullet point, add missing metrics, or reorder your experience section, the
          suggestions are tailored to your specific industry and career level. Use the analysis as a
          roadmap — apply the changes, re-upload, and watch your ATS score climb in real time.
        </p>
      </div>
    </section>
  );
}