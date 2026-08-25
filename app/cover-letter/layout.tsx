import type { Metadata } from "next";
import Link from "next/link";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Cover Letter Builder — AI-Powered Custom Letters | rawcv",
  description:
    "Create professional, AI-generated cover letters tailored to your resume and job descriptions. Choose from General, EU, Canada, and US formats. Edit, save, and export as PDF.",
  alternates: { canonical: "https://www.rawcv.com/cover-letter" },
  openGraph: {
    title: "Cover Letter Builder — AI-Powered Custom Letters | rawcv",
    description:
      "Create professional, AI-generated cover letters tailored to your resume and job descriptions. Choose from multiple formats, edit freely, and download as PDF.",
    url: "https://www.rawcv.com/cover-letter",
  },
};

const cards = [
  {
    title: "Mirrored to Your Resume + Job",
    icon: "document",
    body: "The AI reads your actual resume and the job description side-by-side, then writes a one-page letter that connects your achievements to the role's requirements. Same voice, same facts — just framed for this employer.",
  },
  {
    title: "Region-Aware Formatting",
    icon: "globe",
    body: "US letters are concise and achievement-focused; EU letters include motivation and expected start date conventions. Pick General, EU, Canada, or US and the structure, tone, and length adjust automatically.",
  },
  {
    title: "Edit, Save, Export as PDF",
    icon: "sparkles",
    body: "Refine any paragraph in the chat, keep versions, and export a print-ready PDF that matches your resume theme's typography. No separate design tool needed.",
  },
];

const faqs = [
  { q: "Do I need a cover letter if the job says optional?", a: "Yes — 45% of hiring managers say a cover letter influences their decision even when optional. It’s your only chance to explain why you want this role, not just that you’re qualified." },
  { q: "How long should my cover letter be?", a: "250–400 words, one page max. Rawcv generates to that length by default and warns if you go over. Recruiters skim — every sentence should add signal." },
  { q: "Will it sound like AI?", a: "No. It uses your resume's achievements and metrics, not templates. You can also ask the chat to rewrite in a more formal, warm, or concise tone until it sounds like you." },
  { q: "Can I reuse one letter for many jobs?", a: "Don’t. The builder generates a new version per job description — same resume, different letter that mirrors the posting’s keywords and pains." },
];

function BadgeIcon({ name }: { name: string }) {
  const m: Record<string, React.ReactNode> = {
    document: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8"/></svg>,
    globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>,
    sparkles: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>,
  };
  return <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">{m[name]}</div>;
}

export default function CoverLetterLayout({
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
      <HowToSchema name="How to write a cover letter" description="Generate a tailored cover letter in four steps." steps={[{ name: "Choose a format", text: "Pick General, EU, Canada, or US format." }, { name: "Enter your details", text: "Provide the job title, company, and your key achievements." }, { name: "Generate", text: "Generate a tailored cover letter with AI." }, { name: "Download", text: "Edit and download your letter as a PDF." }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {children}
      <section className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Cover letter that gets read
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Your resume gets you screened — your letter gets you remembered
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Most cover letters are ignored because they repeat the resume. Rawcv writes a letter that adds context: why this company, why you, and which 2–3 achievements prove you can deliver on this specific job.
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
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-5">Cover letter FAQs</h3>
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
