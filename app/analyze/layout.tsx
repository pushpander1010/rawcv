import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ATS Resume Checker & AI Analyzer — rawcv",
  description:
    "Free ATS resume checker. Get an ATS compatibility score, match your resume to any job description, and get AI-powered improvement suggestions. Upload PDF or DOCX.",
  alternates: { canonical: "https://www.rawcv.com/analyze" },
  openGraph: {
    title: "ATS Resume Checker & AI Analyzer — rawcv",
    description: "Free ATS resume checker. Get an ATS score, JD match, and AI suggestions in minutes.",
    url: "https://www.rawcv.com/analyze",
  },
};

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
