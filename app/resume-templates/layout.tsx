import type { Metadata } from "next";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Resume Templates — 18 Professional, ATS-Safe Designs | rawcv",
  description:
    "Explore 18 professionally designed resume templates — MAANG, Onyx, Atlas, Editorial, Classic, Minimal, Modern, Executive, Europass, Canadian, and more. ATS-safe, free, and typeset for one clean A4 page.",
  alternates: { canonical: "https://www.rawcv.com/resume-templates" },
  openGraph: {
    title: "Resume Templates — 18 Professional, ATS-Safe Designs | rawcv",
    description:
      "Explore 18 professionally designed resume templates — MAANG, Onyx, Atlas, Editorial, Classic, Minimal, Modern, Executive, Europass, Canadian, and more. ATS-safe, free, and typeset for one clean A4 page.",
    url: "https://www.rawcv.com/resume-templates",
    type: "website",
    siteName: "rawcv",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "rawcv Resume Templates Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Templates — 18 ATS-Safe Designs | rawcv",
    description:
      "Browse 18 typeset, ATS-safe resume templates. Free PDF export, no account required.",
    images: ["/og-image.png"],
  },
  keywords: [
    "resume templates",
    "CV templates",
    "resume themes",
    "professional resume templates",
    "modern resume templates",
    "minimal resume template",
    "executive resume template",
    "creative resume template",
    "ATS friendly resume templates",
    "free resume templates",
    "resume builder templates",
    "best resume themes",
    "simple resume template",
    "bold resume template",
    "elegant resume template",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function ResumeTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HowToSchema name="How to choose a resume template" description="Pick and customize a template in four steps." steps={[{ name: "Browse templates", text: "Browse the collection of professionally designed templates." }, { name: "Pick your style", text: "Choose the template that fits your industry and seniority." }, { name: "Customize", text: "Customize it with your own content." }, { name: "Download", text: "Download your resume as a PDF." }]} />
      {children}
    </>
  );
}