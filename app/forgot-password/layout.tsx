import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - Recover Your Account | rawcv",
  description: "Forgot your password? Enter your email to receive a password reset link. Regain access to your rawcv account.",
  alternates: { canonical: "https://www.rawcv.com/forgot-password" },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
