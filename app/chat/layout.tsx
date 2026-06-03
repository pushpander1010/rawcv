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
  return (
    <>
      <section className="bg-white dark:bg-gray-950 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            AI Resume Chat Builder
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            Writing a resume from a blank page is one of the hardest parts of any job search. Where do
            you start? What format works best? How do you phrase your experience to stand out? Rawcv&apos;s
            AI Resume Chat Builder removes the friction entirely — instead of wrestling with templates
            and formatting menus, you simply have a conversation. Tell the AI about your background,
            and it builds your resume section by section, in real time.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-gray-900 dark:text-white">
            Conversational Resume Creation
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Start with a simple prompt like &quot;I&apos;m a marketing manager with five years of experience
            in B2B SaaS&quot; and watch the AI generate a professionally formatted resume section. The
            chat interface asks clarifying questions — what tools you used, what results you delivered,
            which metrics matter most — so the generated content is specific and impactful, not generic
            filler. Each response adapts to your career level, industry norms, and the type of role
            you&apos;re targeting, whether that&apos;s an entry-level internship or a C-suite executive
            position.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-white">
            Real-Time Preview &amp; Section Editing
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Every change you make through the chat is reflected instantly in a live preview panel. You
            can see how your summary, work experience, education, and skills sections come together as
            you talk through them. If a bullet point doesn&apos;t land right, just ask the AI to rephrase
            it — no need to open a separate editor or reformat anything. The chat keeps full context of
            your conversation, so you can jump back to refine earlier sections without starting over.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-gray-900 dark:text-white">
            Tailored Advice &amp; Best Practices
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            The AI doesn&apos;t just write — it coaches. As you build your resume, the chat surfaces
            real-time tips about resume best practices: optimal section ordering for your industry,
            how many bullet points to include per role, whether to include a summary or objective
            statement, and industry-specific advice like including a portfolio link for designers or
            a GitHub profile for developers. The result is a resume that not only looks good but also
            follows the conventions recruiters and ATS systems expect.
          </p>
        </div>
      </section>
      {children}
    </>
  );
}