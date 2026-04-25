import type { Metadata } from "next";

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
  return <>{children}</>;
}
