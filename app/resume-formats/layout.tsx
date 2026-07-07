import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Resume Formats by Country — Global CV Guide | rawcv",
    description: "Compare resume formats for every major hiring market with section order, photo rules, and cultural conventions.",
    url: "https://www.rawcv.com/resume-formats",
    type: "article",
    images: [{ url: "https://www.rawcv.com/og-image.png", width: 1200, height: 630, alt: "Resume Formats by Country Guide" }],
  },
  title: "Resume Formats by Country — Global CV Guide | rawcv",
  description:
    "Compare resume formats for every major hiring market: US, EU/Europass, Canada, India, UK, Australia, Germany, Japan, and more.",
  alternates: { canonical: "https://www.rawcv.com/resume-formats" },
  openGraph: {
    title: "Resume Formats by Country — Global CV Guide | rawcv",
    description: "Compare resume formats for every major hiring market with section order, photo rules, and cultural conventions.",
    url: "https://www.rawcv.com/resume-formats",
  },
};

export default function ResumeFormatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
