import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Templates — 9 Professional Themes for Your CV | rawcv",
  description:
    "Explore 9 professionally designed resume templates: Classic, Modern, Minimal, Executive, Creative, Professional, Simple, Bold, and Elegant. Find the perfect ATS-friendly theme for your job search. Free to use.",
  alternates: { canonical: "https://www.rawcv.com/resume-templates" },
  openGraph: {
    title: "Resume Templates — 9 Professional Themes for Your CV | rawcv",
    description:
      "Explore 9 professionally designed resume templates: Classic, Modern, Minimal, Executive, Creative, Professional, Simple, Bold, and Elegant. ATS-friendly, AI-optimized, and free to use.",
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
    title: "Resume Templates — 9 Professional Themes | rawcv",
    description:
      "Browse 9 beautifully designed resume templates. ATS-friendly, AI-powered, and completely free to start.",
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
  return <>{children}</>;
}