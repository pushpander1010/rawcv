import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import FreeBuildClient from "./FreeBuildClient";
import HowToSchema from "@/components/HowToSchema";

export const metadata: Metadata = {
  title: "Free Resume Builder - Create & Download | rawcv",
  description:
    "Build a polished, ATS-safe resume for free. No login required. 18 professional themes, live A4 preview, and instant PDF, Word, or text download. No watermark.",
  alternates: { canonical: "https://www.rawcv.com/build" },
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
      "Build a polished, ATS-safe resume for free. No login required. 18 professional themes and instant PDF download.",
    type: "website",
    url: "https://www.rawcv.com/build",
  },
};

export default function BuildPage() {
  return (
    <main id="main" className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <HowToSchema
        name="How to build a resume"
        description="Create a professional resume in four steps."
        steps={[
          { name: "Fill in your details", text: "Add your contact info, summary, experience, education, and skills." },
          { name: "Choose a theme", text: "Pick from 18 ATS-friendly resume designs." },
          { name: "Preview live", text: "See your resume update in real time on a true A4 page." },
          { name: "Download", text: "Download a polished PDF, Word file, or plain text version — free, without a watermark." },
        ]}
      />

      {/* Compact page header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 mb-2">
            Resume builder
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white leading-[1.1]">
                Build a resume that gets read.
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400 max-w-xl">
                Write on the left, watch the page on the right. Every design is single-pass ATS-safe
                and exports as clean, selectable text.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-slate-500 dark:text-slate-400 sm:pb-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Free forever
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> No signup
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> No watermark
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Builder */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense fallback={<div className="text-center py-16 text-[13px] text-slate-500 dark:text-slate-400">Loading builder…</div>}>
          <FreeBuildClient />
        </Suspense>
      </div>

      {/* SEO / editorial */}
      <section className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 mb-3">
              Why build here
            </p>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Free, ATS-safe, and finished in minutes
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-500 dark:text-slate-400">
              Most free builders hide the download or inject watermarks. Rawcv keeps the PDF clean and
              every theme engineered for parsers — no tables, no text boxes, no images in the text layer.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {[
              { k: "Themes", t: "18 ATS-safe designs", d: "MAANG-dense, Onyx premium, serif, Swiss, editorial, sidebars, EU formats. Switch in one click — content reflows without retyping." },
              { k: "Preview", t: "A true A4 page", d: "Type scale, spacing, and page breaks update live on real paper. No export surprises." },
              { k: "Export", t: "PDF, Word & text", d: "Selectable-text PDF plus editable Word and plain text for job portals. Free forever." },
            ].map((f) => (
              <div key={f.k} className="px-0 md:px-6 py-6 md:py-7 first:md:pl-0 last:md:pr-0">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2">{f.k}</p>
                <h3 className="text-[14px] font-semibold text-slate-900 dark:text-white leading-snug mb-1.5">{f.t}</h3>
                <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mt-9 space-y-3.5 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
            <p>
              Searching for a <strong className="text-slate-900 dark:text-white font-semibold">free resume builder online</strong> or a{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">resume maker without signup</strong> usually means tradeoffs.
              Rawcv removes them: no account, no watermark, and every theme is validated against Workday, Greenhouse, Lever, and Taleo parsers.
            </p>
            <p>
              Pick <em>Classic</em> or <em>Minimal</em> for maximum ATS safety, <em>Atlas</em> or <em>Editorial</em> for a modern edge,
              or <em>Europass</em>/<em>Canadian</em> when a region-specific format is expected. Dates are normalised as you export,
              empty sections collapse automatically, and the builder keeps your draft in this browser.
            </p>
          </div>

          <div className="max-w-3xl mt-9">
            <h3 className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 mb-4">Builder FAQs</h3>
            <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {[
                { q: "Is it really free with no watermark?", a: "Yes. All themes, preview, and PDF export are free and watermark-free. No login, no card." },
                { q: "Will my resume pass ATS?", a: "Themes avoid tables, text boxes, and images, and exports use selectable text with normalised dates — tested against major ATS." },
                { q: "Can I import my PDF or DOCX?", a: "Upload at /analyze — we parse it into editable sections, then you can switch themes in the builder." },
                { q: "Can I change the font and spacing?", a: "Yes. Open “Text” above the preview to change the typeface, body size, and line spacing. The A4 page and PDF update together." },
                { q: "Can I download in Word or TXT?", a: "Yes. Open “Export” for PDF, Word (.docx), plain text, and browser print." },
                { q: "Do you store my resume?", a: "No. Drafts live in your browser (localStorage). We don’t store resume content server-side." },
              ].map((f) => (
                <div key={f.q} className="px-1 py-4">
                  <dt className="font-semibold text-[13.5px] text-slate-900 dark:text-white">{f.q}</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.a}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Script id="build-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Is it really free with no watermark?", acceptedAnswer: { "@type": "Answer", text: "Yes. All themes, preview, and PDF export are free and watermark-free. No login, no card." } },
        { "@type": "Question", name: "Will my resume pass ATS?", acceptedAnswer: { "@type": "Answer", text: "Themes avoid tables, text boxes, and images, and exports use selectable text with normalised dates — tested against major ATS." } },
        { "@type": "Question", name: "Can I import my PDF or DOCX?", acceptedAnswer: { "@type": "Answer", text: "Upload at /analyze — we parse it into editable sections, then you can switch themes in the builder." } },
        { "@type": "Question", name: "Can I change the font and spacing?", acceptedAnswer: { "@type": "Answer", text: "Yes. Open Text above the preview to change the typeface, body size, and line spacing. The A4 page and PDF update together." } },
        { "@type": "Question", name: "Can I download in Word or TXT?", acceptedAnswer: { "@type": "Answer", text: "Yes. Open Export for PDF, Word (.docx), plain text, and browser print." } },
      ] }) }} />
      <Script id="breadcrumb-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.rawcv.com" },
        { "@type": "ListItem", position: 2, name: "Free Resume Builder", item: "https://www.rawcv.com/build" },
      ] }) }} />
    </main>
  );
}
