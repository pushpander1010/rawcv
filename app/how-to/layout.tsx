import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Guide - How to Use rawcv AI Resume Builder | rawcv",
  description: "Step-by-step tutorial on building, analyzing, and optimizing your resume with rawcv. Learn ATS scoring, AI suggestions, job description matching, and more.",
  alternates: { canonical: "https://www.rawcv.com/how-to" },
  openGraph: {
    title: "Complete Guide - How to Use rawcv AI Resume Builder | rawcv",
    description:
      "Step-by-step tutorial on building, analyzing, and optimizing your resume with rawcv. Learn ATS scoring, AI suggestions, job description matching, and more.",
    url: "https://www.rawcv.com/how-to",
  },
};

export default function HowToLayout({ children }: { children: React.ReactNode }) {
  return children;
}
