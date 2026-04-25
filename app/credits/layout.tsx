import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Credits - Affordable AI Resume Analysis Packages | rawcv",
  description: "Purchase credit bundles for AI-powered resume analysis. Starter (50cr/₹99), Pro (250cr/₹499), Power (500cr/₹999). Pay only for what you use.",
  alternates: { canonical: "https://www.rawcv.com/credits" },
};

export default function CreditsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
