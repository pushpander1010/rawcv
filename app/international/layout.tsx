import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Resume — Choose Your Region & Format | rawcv",
  description:
    "Select the perfect resume format for your target region: General, EU / Europass, Canada, or US. Upload your photo, add languages, and manage cover letters — all in one place.",
  alternates: { canonical: "https://www.rawcv.com/international" },
  openGraph: {
    title: "International Resume — Choose Your Region & Format | rawcv",
    description:
      "Select the perfect resume format for your target region: General, EU, Canada, or US.",
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
