import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Resume Chat Builder - Build & Customize Your CV | rawcv",
  description: "Build your resume from scratch or customize existing sections using conversational AI. Get real-time preview updates as you chat with our intelligent assistant.",
  alternates: { canonical: "https://www.rawcv.com/chat" },
};

const howItWorks = [
  {
    title: "Conversational creation",
    body: "Start with a prompt like \"I'm a marketing manager with five years in B2B SaaS\" and the AI builds your resume section by section, asking clarifying questions so the output is specific — not generic filler.",
  },
  {
    title: "Real-time preview",
    body: "Every change shows instantly in a live preview panel. Rephrase any bullet, refine a section, and jump back to earlier parts without losing context or reopening a separate editor.",
  },
  {
    title: "Tailored advice",
    body: "The AI coaches as it writes — section ordering, bullet counts, whether to include a summary, and role-specific tips like a portfolio link for designers or a GitHub profile for developers.",
  },
];

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      {/* ── Learn more (SEO) ── */}
      <section className="bg-gray-50 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              How the AI Resume Chat Builder works
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Writing a resume from a blank page is the hardest part of any job search. Rawcv&apos;s
              chat builder removes the friction — just have a conversation and your resume takes shape
              in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {howItWorks.map((f, i) => (
              <div key={f.title} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-card">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-bold mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
