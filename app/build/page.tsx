import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import FreeBuildClient from "./FreeBuildClient";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Free Resume Builder - Create & Download | rawcv",
  description:
    "Build a professional resume for free. No login required. Choose from 9 themes, preview live, and download instantly. No watermark.",
  keywords: [
    "free resume builder",
    "resume maker",
    "create resume",
    "resume templates",
    "professional resume",
    "resume download",
  ],
  openGraph: {
    title: "Free Resume Builder - Create & Download | rawcv",
    description:
      "Build a professional resume for free. No login required. Choose from 9 themes, preview live, and download instantly.",
    type: "website",
    url: "https://www.rawcv.com/build",
  },
};

export default function BuildPage() {
  return (
    <main id="main" className="min-h-screen bg-white dark:bg-slate-950">
<HowToSchema name="How to build a resume" description="Create a professional resume in four steps." steps={[{ name: "Choose a theme", text: "Pick from 9 professional ATS-friendly visual themes." }, { name: "Enter your details", text: "Fill in your contact info, experience, skills, and education." }, { name: "Preview live", text: "See your resume update in real time as you type." }, { name: "Download", text: "Download your resume as a polished PDF, free and without a watermark." }]} />
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-left">
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              100% Free · No Watermarks
            </span>
            <h1 className="text-[32px] sm:text-[42px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
              Build your <span className="text-blue-600 dark:text-blue-400">professional resume</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
              Create and download a polished, ATS-friendly resume in minutes. Choose from 9 clean themes, preview in real time, and export a print-ready PDF — no signup required.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2">
              <img 
                src="/builder_illustration.jpg" 
                alt="rawcv Resume Builder Illustration" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="text-center py-12 text-slate-500">Loading...</div>}>
          <FreeBuildClient />
        </Suspense>
      </div>

      {/* Mid CTA */}
      <div className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white mb-2">
              Make your resume AI-ready
            </h2>
            <p className="text-[14.5px] text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              Get an ATS score, match any job description, and enhance bullets with AI — without leaving the builder.
            </p>
            <a
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-[14px] font-semibold transition-colors"
            >
              Explore AI features
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* SEO — builder-specific */}
      <section className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Why build here
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              A resume builder that stays ATS-safe — and free forever
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Most free builders hide the download behind a paywall or inject watermarks. Rawcv is different: every theme is engineered for applicant tracking systems, every export is a clean, text-based PDF, and you never need an account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-12">
            {[
              { n: "01", t: "9 ATS-safe themes", d: "Single-column, zero images, standard section headers. Switch themes with one click — your content reflows without retyping." },
              { n: "02", t: "Live preview, zero guesswork", d: "What you see is what recruiters and ATS parsers see. Margins, line breaks, and header hierarchy update instantly as you type." },
              { n: "03", t: "Export PDF, no watermark", d: "300 dpi, embedded fonts, selectable text. Download instantly — no email capture, no credit card." },
            ].map((c) => (
              <div key={c.n} className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 text-sm font-bold">{c.n}</div>
                  <span className="text-[10px] font-bold tracking-widest text-slate-400">{c.n}</span>
                </div>
                <h3 className="text-[14.5px] font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">{c.t}</h3>
                <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{c.d}</p>
              </div>
            ))}
          </div>

          {/* Expanded editorial for SEO */}
          <div className="max-w-3xl mb-12 space-y-5 text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              Whether you&apos;re searching for a <strong className="text-slate-900 dark:text-white font-semibold">free resume builder online</strong>, a <strong className="text-slate-900 dark:text-white font-semibold">resume maker without signup</strong>, or an <strong className="text-slate-900 dark:text-white font-semibold">ATS friendly resume template</strong>, the requirements are the same: clean formatting, keyword-ready sections, and a PDF that parses correctly. Rawcv meets all three without charging you.
            </p>
            <p>
              Start by picking a theme. <em>Classic</em> and <em>Minimal</em> are safest for ATS; <em>Executive</em> and <em>Modern</em> add subtle hierarchy for human readers. Add your contact info, summary, experience (with quantified bullets), education, and skills. The builder validates as you go — missing dates, empty sections, or vague bullets are flagged before you export.
            </p>
            <p>
              Worried about applicant tracking systems? Every theme avoids tables, text boxes, and embedded images that break parsers like Workday, Greenhouse, Lever, and Taleo. Fonts are standard, headings are semantic, and the PDF is generated with mupdf — selectable, searchable, and under 200KB.
            </p>
          </div>

          <div className="max-w-3xl">
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-5">Builder FAQs</h3>
            <div className="space-y-3">
              {[
                { q: "Is the builder really free with no watermark?", a: "Yes. All themes, live preview, and PDF export are free and watermark-free. No login, no credit card, no trial." },
                { q: "Will my resume pass ATS?", a: "Yes — themes avoid tables, columns, images, and non-standard fonts. PDFs are text-based and tested against Workday, Greenhouse, Lever, and Taleo." },
                { q: "Can I import my existing PDF or DOCX?", a: "Upload your file at /analyze. We parse it into editable sections, then you can switch themes and continue editing in the builder." },
                { q: "Do you store my resume?", a: "No. Resume data lives in your browser (localStorage) for drafts. We do not permanently store resume content on our servers." },
                { q: "What makes this different from Canva or Novoresume?", a: "Canva prioritizes design; Novoresume paywalls the download. Rawcv prioritizes parseability and leaves the PDF free — design serves readability, not decoration." },
              ].map((f) => (
                <div key={f.q} className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                  <dt className="font-semibold text-[14.5px] text-slate-900 dark:text-white mb-1.5">{f.q}</dt>
                  <dd className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{f.a}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Script
        id="build-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "Is the builder really free with no watermark?", acceptedAnswer: { "@type": "Answer", text: "Yes. All themes, live preview, and PDF export are free and watermark-free. No login, no credit card." } },
              { "@type": "Question", name: "Will my resume pass ATS?", acceptedAnswer: { "@type": "Answer", text: "Themes avoid tables, columns, images, and non-standard fonts. PDFs are text-based and tested against Workday, Greenhouse, Lever, and Taleo." } },
              { "@type": "Question", name: "Can I import my existing PDF or DOCX?", acceptedAnswer: { "@type": "Answer", text: "Upload your file at /analyze. We parse it into editable sections, then you can switch themes and continue editing in the builder." } },
              { "@type": "Question", name: "Do you store my resume?", acceptedAnswer: { "@type": "Answer", text: "Resume data lives in your browser for drafts. We do not permanently store resume content on our servers." } },
            ],
          }),
        }}
      />
      <Script
        id="breadcrumb-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rawcv.com" },
              { "@type": "ListItem", position: 2, name: "Free Resume Builder", item: "https://www.rawcv.com/build" },
            ],
          }),
        }}
      />
    </main>
  );
}
