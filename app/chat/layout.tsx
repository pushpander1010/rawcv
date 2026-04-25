import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Chat Builder - Build & Customize Your CV | rawcv",
  description: "Build your resume from scratch or customize existing sections using conversational AI. Get real-time preview updates as you chat with our intelligent assistant.",
  alternates: { canonical: "https://www.rawcv.com/chat" },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
