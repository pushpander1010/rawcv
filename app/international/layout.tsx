import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Resume — AI-Powered Format Conversion | rawcv",
  description:
    "Convert your resume to the perfect format for your target region. AI-powered conversion for General, EU / Europass, Canada, and US formats. Region-specific tips, section ordering, and conventions.",
  alternates: { canonical: "https://www.rawcv.com/international" },
  openGraph: {
    title: "International Resume — AI-Powered Format Conversion | rawcv",
    description:
      "Convert your resume to EU, Canada, US, or General format with AI. Region-specific rules, tips, and instant conversion.",
    url: "https://www.rawcv.com/international",
  },
};

export default function InternationalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
