import type { Metadata } from "next";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Cover Letter Builder — AI-Powered Custom Letters | rawcv",
  description:
    "Create professional, AI-generated cover letters tailored to your resume and job descriptions. Choose from General, EU, Canada, and US formats. Edit, save, and export as PDF.",
  alternates: { canonical: "https://www.rawcv.com/cover-letter" },
  openGraph: {
    title: "Cover Letter Builder — AI-Powered Custom Letters | rawcv",
    description:
      "Create professional, AI-generated cover letters tailored to your resume and job descriptions. Choose from multiple formats, edit freely, and download as PDF.",
    url: "https://www.rawcv.com/cover-letter",
  },
};

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HowToSchema name="How to write a cover letter" description="Generate a tailored cover letter in four steps." steps={[{ name: "Choose a format", text: "Pick General, EU, Canada, or US format." }, { name: "Enter your details", text: "Provide the job title, company, and your key achievements." }, { name: "Generate", text: "Generate a tailored cover letter with AI." }, { name: "Download", text: "Edit and download your letter as a PDF." }]} />
      {children}
    </>
  );
}
