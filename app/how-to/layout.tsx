import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use rawcv — Step-by-Step Guide",
  description:
    "Complete guide to using rawcv: how to upload or build a resume, run ATS analysis, get AI suggestions, match to a job description, tailor your CV, and download a polished PDF.",
  alternates: { canonical: "https://www.rawcv.com/how-to" },
  openGraph: {
    title: "How to Use rawcv — Step-by-Step Guide",
    description:
      "Complete guide to using rawcv: upload a resume, get ATS scores, AI suggestions, JD matching, and download polished PDFs.",
    url: "https://www.rawcv.com/how-to",
  },
};

export default function HowToLayout({ children }: { children: React.ReactNode }) {
  return children;
}
