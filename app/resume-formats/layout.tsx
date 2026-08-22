import type { Metadata } from "next";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Resume Formats by Country — Global CV Guide | rawcv",
  description:
    "Compare resume formats for every major hiring market: US, EU/Europass, Canada, India, UK, Australia, Germany, Japan, and more.",
  alternates: { canonical: "https://www.rawcv.com/resume-formats" },
  openGraph: {
    title: "Resume Formats by Country — Global CV Guide | rawcv",
    description: "Compare resume formats for every major hiring market with section order, photo rules, and cultural conventions.",
    url: "https://www.rawcv.com/resume-formats",
    type: "article",
    images: [{ url: "https://www.rawcv.com/og-image.png", width: 1200, height: 630, alt: "Resume Formats by Country Guide" }],
  },
};

export default function ResumeFormatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HowToSchema name="How to choose a resume format" description="Pick the right regional format in four steps." steps={[{ name: "Choose your region", text: "Select the format for your target country." }, { name: "Review the rules", text: "Review region-specific formatting and section rules." }, { name: "Build", text: "Build your resume following the format." }, { name: "Download", text: "Download your resume as a PDF." }]} />
      {children}
    </>
  );
}
