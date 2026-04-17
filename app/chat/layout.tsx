import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Resume with AI Chat — rawcv",
  description:
    "Build or customize your resume through a conversational AI chat interface. Start from scratch or refine your existing CV section by section.",
  alternates: { canonical: "https://www.rawcv.com/chat" },
  openGraph: {
    title: "Build Resume with AI Chat — rawcv",
    description: "Build or customize your resume through a conversational AI chat interface.",
    url: "https://www.rawcv.com/chat",
  },
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
