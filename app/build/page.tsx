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
    <main id="main" className="min-h-screen bg-white dark:bg-slate-900">
<HowToSchema name="How to build a resume" description="Create a professional resume in four steps." steps={[{ name: "Choose a theme", text: "Pick from 9 professional ATS-friendly visual themes." }, { name: "Enter your details", text: "Fill in your contact info, experience, skills, and education." }, { name: "Preview live", text: "See your resume update in real time as you type." }, { name: "Download", text: "Download your resume as a polished PDF, free and without a watermark." }]} />
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-brand-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-left">
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-brand-100 text-brand-700 uppercase">
              100% Free · No Watermarks
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
              Build Your{" "}
              <span className="text-brand-600">
                Professional Resume
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl">
              Create and download a polished resume in minutes. Choose from 9 ATS-friendly visual themes, preview in real time, and download completely free without any signup.
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-brand-100 bg-white dark:bg-slate-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
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
        <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <FreeBuildClient />
        </Suspense>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Make Your Resume AI-Ready
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Unlock premium AI features to optimize your resume for ATS systems, match job descriptions, and get personalized suggestions.
            </p>
            <a
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:-translate-y-0.5 transition-all"
            >
              Explore AI Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* SEO — builder-specific */}
      <section className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Why build here
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Free resume builder that stays ATS-safe
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              No signup, no watermark, no paywall at download. Create a resume that looks premium to humans and parses cleanly for Workday, Greenhouse, Lever, and Taleo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-12">
            {[
              { n: "01", t: "9 ATS-safe themes, one click", d: "Switch themes without re-entering data. All themes are single-column, text-based, zero images — maximum parseability." },
              { n: "02", t: "Live preview as you type", d: "See every bullet, header, and margin update instantly. Know exactly how recruiters and ATS will see it before you download." },
              { n: "03", t: "Export PDF, no watermark", d: "Download a print-ready PDF at 300dpi that matches your theme typography. Free forever, no account required." },
            ].map((c) => (
              <div key={c.n} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">✓</div>
                  <span className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500">{c.n}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-2">{c.t}</h3>
                <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl">
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-white mb-5">Builder FAQs</h3>
            <div className="space-y-3">
              {[
                { q: "Is the builder really free with no watermark?", a: "Yes. All 14 themes, live preview, and PDF export are free and watermark-free. No login, no credit card." },
                { q: "Will my resume pass ATS?", a: "Yes — themes avoid tables, columns, images, and non-standard fonts. PDFs are text-based and tested against major ATS parsers." },
                { q: "Can I import my existing PDF or DOCX?", a: "Yes. Go to /analyze and upload it — we parse it, then you can switch themes and edit in the builder." },
                { q: "Do you store my resume?", a: "No. Data stays in your browser session. We don’t permanently store resume content on our servers." },
              ].map((f) => (
                <div key={f.q} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
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
              { "@type": "Question", name: "Is the builder really free with no watermark?", acceptedAnswer: { "@type": "Answer", text: "Yes. All 14 themes, live preview, and PDF export are free and watermark-free. No login, no credit card." } },
              { "@type": "Question", name: "Will my resume pass ATS?", acceptedAnswer: { "@type": "Answer", text: "Themes avoid tables, columns, images, and non-standard fonts. PDFs are text-based and tested against major ATS parsers." } },
              { "@type": "Question", name: "Can I import my existing PDF or DOCX?", acceptedAnswer: { "@type": "Answer", text: "Go to /analyze and upload it — we parse it, then you can switch themes and edit in the builder." } },
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