import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailor Resume to Job Description — rawcv",
  description:
    "Automatically tailor your resume to any job description with AI. Highlight the right keywords, skills, and experience to beat ATS and impress recruiters.",
  alternates: { canonical: "https://www.rawcv.com/tailor" },
  openGraph: {
    title: "Tailor Resume to Job Description — rawcv",
    description: "Automatically tailor your resume to any job description with AI.",
    url: "https://www.rawcv.com/tailor",
  },
};

export default function TailorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
