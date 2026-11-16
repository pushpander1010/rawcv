import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Icon, { type IconName } from "@/components/Icon";
import HowToSchema from "@/components/HowToSchema";
import ThemeShowcase from "@/components/ThemeShowcase";

export const metadata: Metadata = {
  title: "rawcv — Free AI Resume Builder & ATS Score Checker",
  description:
    "Build your resume by chatting with AI — 100% free. See exactly how many pages it takes, keep it to one page, check your ATS score, and download a polished PDF. No signup required.",
  alternates: { canonical: "https://www.rawcv.com" },
};

const features: { icon: IconName; title: string; desc: string }[] = [
  { icon: "chat", title: "Chat builder", desc: "Answer in plain language. No forms, no formatting decisions." },
  { icon: "score", title: "ATS score", desc: "100+ rule-based checks, a score out of 100, and the exact fixes that matter." },
  { icon: "document", title: "Page-fit preview", desc: "A true A4 view shows how full your last page is — and fits it to one page on request." },
  { icon: "target", title: "Job match", desc: "Paste a job description and see which keywords and skills are missing." },
  { icon: "sparkles", title: "Bullet rewrite", desc: "Turn weak duties into results-focused achievements, without invented numbers." },
  { icon: "layers", title: "18 themes", desc: "Every theme is tuned to pack a full career onto a single compact page." },
];

const faqs = [
  { q: "Is rawcv really free?", a: "Yes — 100% free. ATS scoring, JD matching, AI suggestions, cover letters, and PDF downloads are all available without an account or payment." },
  { q: "What file formats are supported?", a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB." },
  { q: "How does ATS scoring work?", a: "We run 100+ rule-based checks (missing sections, keyword density, date formatting) combined with AI analysis to give you a score out of 100 with specific issues to fix." },
  { q: "Will my resume data be stored?", a: "No. Resume data stays in your browser session. We do not permanently store resume content on our servers." },
  { q: "Can I use rawcv on mobile?", a: "Yes — the builder, chat, analysis, and downloads all work on mobile browsers." },
  { q: "Do I need to create an account?", a: "No. Open the builder or upload a resume and start — no sign-up, no credit card." },
];

const chatDemo: Array<{ from: "user" | "bot"; text: string }> = [
  { from: "user", text: "I'm a backend engineer, 5 years at fintechs. Make me a one-page resume." },
  { from: "bot", text: "Done — one page, 12 bullets. I kept the Kubernetes migration and dropped your 2016 internship." },
  { from: "user", text: "Tighten the summary and add my AWS certification." },
  { from: "bot", text: "Updated. Still one page, 94% full — you have room for one more bullet." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://www.rawcv.com/#website",
                url: "https://www.rawcv.com",
                name: "rawcv",
                description: "Free AI-powered resume builder with ATS scoring, job matching, and PDF downloads.",
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://www.rawcv.com/#app",
                name: "rawcv",
                url: "https://www.rawcv.com",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ],
          }),
        }}
      />
      <HowToSchema
        name="How to use rawcv"
        description="Build, analyze, and optimize your resume in four steps."
        steps={[
          { name: "Upload your resume", text: "Upload your resume as a PDF, DOCX, or TXT file — no signup required." },
          { name: "Get your ATS score", text: "Get an instant ATS score out of 100 with specific fixes to pass applicant tracking systems." },
          { name: "Match a job description", text: "Paste any job description to see exactly which keywords and skills are missing." },
          { name: "Download a polished PDF", text: "Apply AI suggestions, choose a theme, and download a polished ATS-safe PDF." },
        ]}
      />

      {/* ═══════════ HERO — chat is the product ═══════════ */}
      <section className="px-4 sm:px-6 pt-10 sm:pt-14 pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-9 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 px-3 py-1 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
                Free forever · no account · no watermark
              </span>
            </div>

            <h1 className="text-[34px] sm:text-[46px] lg:text-[52px] font-bold tracking-[-0.035em] leading-[1.03] text-slate-900 dark:text-white">
              The free AI resume builder
              <br />
              <span className="font-serif italic font-normal text-blue-600">you can just talk to.</span>
            </h1>

            <p className="mt-4 text-[15px] sm:text-[16.5px] text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Say what you have done. rawcv writes the bullets, keeps the layout ATS-safe, shows
              exactly how many pages you are using, and hands you a PDF.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[14px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Start chatting — free
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[14px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Upload &amp; score my resume
              </Link>
            </div>

            <p className="mt-4 text-[12px] text-slate-400 dark:text-slate-500">
              Already have a resume? Paste the text into the chat and it rebuilds the whole thing.
            </p>
          </div>

          {/* Chat demo card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold flex items-center justify-center">
                  R
                </span>
                <span className="text-[12.5px] font-semibold text-slate-700 dark:text-slate-200">
                  rawcv assistant
                </span>
              </div>
              <span className="text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
                live preview
              </span>
            </div>

            <div className="p-4 space-y-2.5">
              {chatDemo.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <p
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${
                      m.from === "user"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-4 mb-4 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  1 page
                </span>
                <span className="text-[11.5px] text-slate-500 dark:text-slate-400">94% full</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full w-[94%] rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW THE CHAT WORKS ═══════════ */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl">
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white">
              One conversation. One page. Done.
            </h2>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
              No section-by-section forms. Tell it your history once, then edit by talking.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Talk or paste",
                desc: "Answer a few questions, or paste your old resume and let it structure everything.",
              },
              {
                step: "02",
                title: "Watch the page fill",
                desc: "A real A4 preview shows the page count and how full the last page is after every message.",
              },
              {
                step: "03",
                title: "Download",
                desc: "Export a text-selectable PDF, an editable Word file, or plain text for job portals.",
              },
            ].map((item) => (
              <div key={item.step} className="border-t-2 border-slate-900 dark:border-white pt-4">
                <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 dark:text-slate-500">
                  {item.step}
                </span>
                <h3 className="mt-2 text-[14.5px] font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Open the chat builder <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <ThemeShowcase />

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-xl mb-8">
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white">
              Everything else comes included.
            </h2>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
              Professional-grade checks, no paywall in the middle of the flow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3.5">
                <div className="w-9 h-9 shrink-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <Icon name={f.icon} size={16} />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900 dark:bg-slate-900 overflow-hidden">
          <div className="px-6 sm:px-12 py-10 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-white leading-tight tracking-tight">
                Ready to land more interviews?
              </h2>
              <p className="mt-2 text-[13.5px] text-slate-400 max-w-md">
                Talk through your experience once and download a one-page resume. Free, no account.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link href="/chat" className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md bg-white text-slate-900 text-[13px] font-semibold hover:bg-slate-100 transition-colors">
                Chat to build <span aria-hidden="true">→</span>
              </Link>
              <Link href="/analyze" className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-white/20 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors">
                Analyze a resume
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-4 sm:px-6 py-14 sm:py-16" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Frequently asked questions
          </h2>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="py-4">
                <dt className="font-semibold text-[13.5px] text-slate-900 dark:text-white" itemProp="name">{faq.q}</dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <span itemProp="text">{faq.a}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
