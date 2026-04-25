import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Access Your AI Resume Tools | rawcv",
  description: "Sign in to rawcv to access ATS scoring, AI suggestions, job description matching, and resume tailoring tools. Continue with Google or email.",
  alternates: { canonical: "https://www.rawcv.com/login" },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
