import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Support & Queries | rawcv",
  description:
    "Get in touch with the rawcv support team. We're here to help you with your resume building, optimization, and account queries.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
