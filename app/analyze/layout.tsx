import type { Metadata } from "next";
import AnalyzeSeoBanner from "@/components/AnalyzeSeoBanner";

export const metadata: Metadata = {
  title: "Analyze Resume - ATS Score, AI Suggestions & JD Match | rawcv",
  description: "Get instant ATS compatibility scores, AI-powered improvement suggestions, and job description relevance analysis. Optimize your resume for applicant tracking systems.",
  alternates: { canonical: "https://www.rawcv.com/analyze" },
};


export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnalyzeSeoBanner />
      {children}
    </>
  );
}