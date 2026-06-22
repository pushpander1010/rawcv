import type { Metadata } from "next";

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
  return <>{children}</>;
}
