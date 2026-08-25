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
    <main id="main" className="min-h-screen bg-slate-50 dark:bg-slate-950">
<HowToSchema name="How to build a resume" description="Create a professional resume in four steps." steps={[{ name: "Choose a theme", text: "Pick from 9 professional ATS-friendly visual themes." }, { name: "Enter your details", text: "Fill in your contact info, experience, skills, and education." }, { name: "Preview live", text: "See your resume update in real time as you type." }, { name: "Download", text: "Download your resume as a polished PDF, free and without a watermark." }]} />
      {/* Header — editorial, no gradient */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400 mb-3">100% Free · No watermarks · No signup</p>
            <h1 className="text-[30px] sm:text-[40px] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-3">
              Build a resume that<br />
              <span className="text-slate-900 dark:text-white underline decoration-blue-500/30 underline-offset-4 decoration-4">actually gets read</span>
            </h1>
            <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
              Choose from 9 ATS-safe themes, edit with live preview, and export a clean, text-based PDF. No account, no paywall at download.
            </p>
          </div>
          <div className="md:col-span-5 hidden md:block">
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2">
              <img src="/builder_illustration.jpg" alt="rawcv Resume Builder" className="w-full h-auto rounded-lg object-cover opacity-95" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50/40 dark:bg-slate-900/20">
        <Suspense fallback={<div className="text-center py-12 text-slate-500">Loading...</div>}>
          <FreeBuildClient />
        </Suspense>
      </div>

      {/* Mid CTA — minimal */}
      <div className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-[16px] font-semibold text-slate-900 dark:text-white">Make it AI-ready after you build</h2>
              <p className="text-[13.5px] text-slate-600 dark:text-slate-300 mt-1">Score it, match a JD, and enhance bullets — without leaving the builder.</p>
            </div>
            <a href="/analyze" className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[13.5px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
              Explore AI features →
            </a>
          </div>
        </div>
      </div>

      {/* SEO — editorial, not cards */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400 mb-3">Why build here</p>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Free, ATS-safe, and finished in minutes
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              Most free builders hide the download or inject watermarks. Rawcv keeps the PDF clean and the themes engineered for parsers.
            </p>
          </div>

          {/* 3 features as editorial rows — not childish cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {[
              { k: "Theme", t: "9 ATS-safe themes", d: "Single-column, zero images. Switch in one click — content reflows without retyping." },
              { k: "Preview", t: "Live, what-you-see-is-what-ATS-sees", d: "Margins, headers, and line breaks update instantly. No export surprises." },
              { k: "Export", t: "PDF, no watermark", d: "300 dpi, selectable text, under 200 KB. Free forever." },
            ].map((f) => (
              <div key={f.k} className="px-6 py-7">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">{f.k}</p>
                <h3 className="text-[14.5px] font-semibold text-slate-900 dark:text-white leading-snug mb-1.5">{f.t}</h3>
                <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{f.d}</p>
              </div>
            ))}
          </div>

          {/* Expanded editorial */}
          <div className="max-w-3xl mt-10 space-y-4 text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              Searching for a <strong className="text-slate-900 dark:text-white font-semibold">free resume builder online</strong> or a <strong className="text-slate-900 dark:text-white font-semibold">resume maker without signup</strong> usually means tradeoffs. Rawcv removes them: no account, no watermark, and every theme is validated against Workday, Greenhouse, Lever, and Taleo parsers.
            </p>
            <p>
              Pick <em>Classic</em> or <em>Minimal</em> for maximum ATS safety, or <em>Executive</em>/<em>Modern</em> for subtle hierarchy that still parses cleanly. The builder flags missing dates, empty sections, and vague bullets as you type — so you fix issues before you export.
            </p>
          </div>

          <div className="max-w-3xl mt-10">
            <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500 dark:text-slate-400 mb-4">Builder FAQs</h3>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {[
                { q: "Is it really free with no watermark?", a: "Yes. All themes, preview, and PDF export are free and watermark-free. No login, no card." },
                { q: "Will my resume pass ATS?", a: "Themes avoid tables, text boxes, and images. PDFs are text-based and tested against major ATS." },
                { q: "Can I import my PDF or DOCX?", a: "Upload at /analyze — we parse to editable sections, then you can switch themes in the builder." },
                { q: "Do you store my resume?", a: "No. Drafts live in your browser (localStorage). We don’t store resume content server-side." },
              ].map((f) => (
                <div key={f.q} className="px-6 py-5">
                  <dt className="font-semibold text-[14px] text-slate-900 dark:text-white">{f.q}</dt>
                  <dd className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{f.a}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Script id="build-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Is it really free with no watermark?", acceptedAnswer: { "@type": "Answer", text: "Yes. All themes, preview, and PDF export are free and watermark-free. No login, no card." } },
        { "@type": "Question", name: "Will my resume pass ATS?", acceptedAnswer: { "@type": "Answer", text: "Themes avoid tables, text boxes, and images. PDFs are text-based and tested against major ATS." } },
        { "@type": "Question", name: "Can I import my PDF or DOCX?", acceptedAnswer: { "@type": "Answer", text: "Upload at /analyze — we parse to editable sections, then you can switch themes in the builder." } },
      ] }) }} />
      <Script id="breadcrumb-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rawcv.com" },
        { "@type": "ListItem", position: 2, name: "Free Resume Builder", item: "https://www.rawcv.com/build" },
      ] }) }} />
    </main>
  );
}
