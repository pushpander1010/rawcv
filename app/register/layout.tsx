import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account - Start Building Better Resumes | rawcv",
  description: "Sign up for rawcv and get 20 free credits instantly. Build, analyze, and optimize your resume with AI. No credit card required.",
  alternates: { canonical: "https://www.rawcv.com/register" },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
