import type { Metadata } from "next";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Tailor Resume to Job Description - Auto-Optimize for Any Role | rawcv",
  description: "Automatically rewrite your resume to match specific job descriptions. AI-powered keyword optimization and content tailoring for maximum relevance.",
  alternates: { canonical: "https://www.rawcv.com/tailor" },
};

export default function TailorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HowToSchema name="How to tailor your resume to a job" description="Optimize your resume for a specific role in four steps." steps={[{ name: "Upload your resume", text: "Upload your existing resume." }, { name: "Paste the job description", text: "Paste the exact job description you're targeting." }, { name: "Generate a tailored version", text: "Generate a version optimized for that specific role." }, { name: "Download", text: "Download your tailored resume as a PDF." }]} />
      {children}
    </>
  );
}
