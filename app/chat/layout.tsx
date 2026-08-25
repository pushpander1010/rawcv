import type { Metadata } from "next";
import Link from "next/link";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "AI Resume Chat Builder - Build & Customize Your CV | rawcv",
  description: "Build your resume from scratch or customize existing sections using conversational AI. Get real-time preview updates as you chat with our intelligent assistant.",
  alternates: { canonical: "https://www.rawcv.com/chat" },
};

const cards = [
  {
    title: "Conversational Resume Creation",
    icon: "chat",
    body: "Start with a simple prompt like \"I'm a marketing manager with 5 years in B2B SaaS\" and the AI generates a formatted section. It asks clarifying questions — tools used, results delivered, metrics that matter — so content is specific, not generic filler, tuned to your industry and seniority.",
  },
  {
    title: "Real-Time Preview & Section Editing",
    icon: "layers",
    body: "Every change via chat appears instantly in the preview. If a bullet doesn't land, ask the AI to rephrase — no separate editor needed. Full conversation context is kept, so you can jump back to refine earlier sections without starting over.",
  },
  {
    title: "Tailored Coaching, Not Just Writing",
    icon: "sparkles",
    body: "The AI coaches as you build: optimal section order for your industry, how many bullets per role, summary vs objective, portfolio link for designers or GitHub for developers — following recruiter and ATS conventions.",
  },
];

const faqs = [
  { q: "I have no resume — can chat build one from scratch?", a: "Yes. Describe your background in plain language and the AI generates contact, summary, experience, education, and skills sections one-by-one, asking follow-ups to fill gaps." },
  { q: "Can I edit specific bullets without rebuilding everything?", a: "Absolutely. Say “rephrase my second bullet at Acme to quantify impact” and only that bullet updates — the rest stays intact with live preview." },
  { q: "Does chat remember my previous corrections?", a: "Yes, full context is kept. If you corrected a date or metric earlier, the AI won’t reintroduce the old value." },
  { q: "Is the chat resume ATS-friendly?", a: "Yes. The chat uses the same ATS-safe templates as the builder — no tables, no images, clean section headers — so your download passes Workday, Greenhouse, Lever, etc." },
];

function BadgeIcon({ name }: { name: string }) {
  const m: Record<string, React.ReactNode> = {
    chat: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    layers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg>,
    sparkles: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>,
  };
  return <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">{m[name]}</div>;
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Resume Chat Builder
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
            Build or customize your resume conversationally — tell the AI about your background and
            watch it take shape in real time.
          </p>
        </div>
      </section>
<HowToSchema name="How to build a resume with AI chat" description="Build your resume conversationally in four steps." steps={[{ name: "Start a conversation", text: "Open the AI chat builder and tell it about your background." }, { name: "Describe your experience", text: "Answer the AI's clarifying questions about tools, results, and metrics." }, { name: "Review the live preview", text: "Watch your resume update in real time in the preview panel." }, { name: "Download", text: "Download your completed resume as a polished PDF." }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {children}
      <section className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> How chat helps
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Writing from a blank page is the hardest part — chat removes the friction
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Instead of wrestling with templates and formatting menus, you have a conversation. Tell the AI about your background and it builds your resume section by section, in real time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-12">
            {cards.map((c, i) => (
              <div key={c.title} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <BadgeIcon name={c.icon} />
                  <span className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-2">0{i + 1}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white leading-snug mb-2.5">{c.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl">
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-5">Chat builder FAQs</h3>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                  <dt className="font-semibold text-[14.5px] text-slate-900 dark:text-white mb-1.5">{f.q}</dt>
                  <dd className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{f.a}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
