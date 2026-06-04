import type { Metadata } from "next";
import DashboardSeoBanner from "@/components/DashboardSeoBanner";

export const metadata: Metadata = {
  title: "Dashboard - Manage Your Resume & Credits | rawcv",
  description: "Access your resume tools, view credit balance, purchase credit bundles, and track your transaction history. Your central hub for resume optimization.",
  alternates: { canonical: "https://www.rawcv.com/dashboard" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardSeoBanner />
      {children}
    </>
  );
}