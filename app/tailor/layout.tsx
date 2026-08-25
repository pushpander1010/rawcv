import type { Metadata } from "next";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Tailor Resume to Job Description - Auto-Optimize for Any Role | rawcv",
  description: "Automatically rewrite your resume to match specific job descriptions. AI-powered keyword optimization and content tailoring for maximum relevance.",
  alternates: { canonical: "https://www.rawcv.com/tailor" },
};

const cards = [
  {
    title: "Keyword Injection Without Lying",
    icon: "target",
    body: "Paste the exact job description and our AI scans for must-have keywords — skills, tools, certifications — that your resume is missing. It then rewrites existing bullets to naturally include those terms using your real experience. No fake skills invented, only your achievements reframed in the employer's language so you pass both ATS filters and human review.",
  },
  {
    title: "Section-by-Section Diff View",
    icon: "layers",
    body: "Every change is tracked in a side-by-side diff. See what was added, removed, or rephrased in your summary, experience, and skills sections. Keep what you like, discard what you don't. You stay in control — the AI suggests, you decide. No black-box rewrites.",
  },
  {
    title: "One Resume, Infinite Versions",
    icon: "sparkles",
    body: "Stop maintaining 10 resume files. Upload once and generate a tailored version for each application in seconds. Applying to a product role and a marketing role? Same source resume, two keyword-optimized outputs. Save hours and apply to more jobs with higher match rates.",
  },
];

const faqs = [
  { q: "Do I need to tailor my resume for every job?", a: "Not from scratch. Upload once to rawcv and paste each job description — the AI creates a tailored copy in seconds while keeping your original. Hiring managers and ATS both reward keyword alignment, so tailored resumes get 3× more callbacks." },
  { q: "Will tailoring add skills I don't have?", a: "No. The AI only uses your existing experience and reframes it with job-relevant language. It will not invent certifications, tools, or roles you haven't held — that would fail a background check." },
  { q: "Is tailoring different from keyword stuffing?", a: "Yes. Keyword stuffing lists terms out of context and is flagged by modern ATS. Tailoring integrates keywords into achievement bullets with metrics and context, which both ATS and recruiters prefer." },
  { q: "Can I revert changes?", a: "Yes — the diff view shows every edit with accept/discard controls, and your original parsed resume is always preserved. You can also undo at any time." },
];

function BadgeIcon({ name }: { name: string }) {
  const m: Record<string, React.ReactNode> = {
    target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>,
    layers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg>,
    sparkles: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>,
  };
  return <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">{m[name]}</div>;
}

export default function TailorLayout({
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
      <HowToSchema name="How to tailor your resume to a job" description="Optimize your resume for a specific role in four steps." steps={[{ name: "Upload your resume", text: "Upload your existing resume." }, { name: "Paste the job description", text: "Paste the exact job description you're targeting." }, { name: "Generate a tailored version", text: "Generate a version optimized for that specific role." }, { name: "Download", text: "Download your tailored resume as a PDF." }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {children}
      <section className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Tailoring intelligence
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Stop sending the same resume everywhere
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Recruiters spend 6 seconds on a resume. If your keywords don&apos;t match their job description, you&apos;re out — even if you&apos;re qualified. Rawcv&apos;s Tailor reads the job posting like a hiring algorithm does and rewrites your bullets to hit the terms that actually matter.
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

          {/* FAQs */}
          <div className="max-w-3xl">
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-5">Tailoring FAQs</h3>
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
