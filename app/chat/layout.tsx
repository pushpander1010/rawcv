import type { Metadata } from "next";
import Link from "next/link";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "AI Resume Chat Builder - Build & Customize Your CV | rawcv",
  description: "Build your resume from scratch or customize existing sections using conversational AI. Get real-time preview updates as you chat with our intelligent assistant.",
  alternates: { canonical: "https://www.rawcv.com/chat" },
};

const sections = [
  {
    title: "Conversational Resume Creation",
    body: "Start with a simple prompt like \"I'm a marketing manager with five years of experience in B2B SaaS\" and watch the AI generate a professionally formatted resume section. The chat interface asks clarifying questions — what tools you used, what results you delivered, which metrics matter most — so the generated content is specific and impactful, not generic filler. Each response adapts to your career level, industry norms, and the type of role you're targeting, whether that's an entry-level internship or a C-suite executive position.",
  },
  {
    title: "Real-Time Preview & Section Editing",
    body: "Every change you make through the chat is reflected instantly in a live preview panel. You can see how your summary, work experience, education, and skills sections come together as you talk through them. If a bullet point doesn't land right, just ask the AI to rephrase it — no need to open a separate editor or reformat anything. The chat keeps full context of your conversation, so you can jump back to refine earlier sections without starting over.",
  },
  {
    title: "Tailored Advice & Best Practices",
    body: "The AI doesn't just write — it coaches. As you build your resume, the chat surfaces real-time tips about resume best practices: optimal section ordering for your industry, how many bullet points to include per role, whether to include a summary or objective statement, and industry-specific advice like including a portfolio link for designers or a GitHub profile for developers. The result is a resume that not only looks good but also follows the conventions recruiters and ATS systems expect.",
  },
];

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ── Compact hero ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            AI Resume Chat Builder
          </h1>
          <p className="mt-2 text-gray-500 max-w-2xl text-sm sm:text-base">
            Build or customize your resume conversationally — tell the AI about your background and
            watch it take shape in real time.
          </p>
        </div>
      </section>

<HowToSchema name="How to build a resume with AI chat" description="Build your resume conversationally in four steps." steps={[{ name: "Start a conversation", text: "Open the AI chat builder and tell it about your background." }, { name: "Describe your experience", text: "Answer the AI's clarifying questions about tools, results, and metrics." }, { name: "Review the live preview", text: "Watch your resume update in real time in the preview panel." }, { name: "Download", text: "Download your completed resume as a polished PDF." }]} />
      {children}

      {/* ── Learn more (SEO) ── */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              How the AI Resume Chat Builder works
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Writing a resume from a blank page is one of the hardest parts of any job search. Where
              do you start? What format works best? How do you phrase your experience to stand out?
              Rawcv&apos;s AI Resume Chat Builder removes the friction entirely — instead of wrestling
              with templates and formatting menus, you simply have a conversation. Tell the AI about
              your background, and it builds your resume section by section, in real time.
            </p>

            <div className="mt-12 space-y-10">
              {sections.map((s) => (
                <div key={s.title}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{s.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
