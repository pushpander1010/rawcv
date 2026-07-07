import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU / Europass Resume Format — Complete Guide & Template | rawcv",
  description:
    "Learn the exact EU and Europass resume format: section order, photo rules, CEFR language levels, personal details requirements, and up to 3 pages. Free AI conversion tool included.",
  alternates: { canonical: "https://www.rawcv.com/international/eu" },
  openGraph: {
    title: "EU / Europass Resume Format — Complete Guide | rawcv",
    description:
      "Everything you need to write a European CV: photo, languages, personal info, section order, and Europass conventions. Convert your resume for free.",
    url: "https://www.rawcv.com/international/eu",
    type: "article",
    images: [{ url: "https://www.rawcv.com/og-image.png", width: 1200, height: 630, alt: "EU / Europass Resume Format Guide" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "EU / Europass Resume Format — Complete Guide",
  description:
    "Learn the exact EU and Europass resume format: section order, photo rules, CEFR language levels, personal details requirements, and up to 3 pages.",
  author: { "@type": "Organization", name: "rawcv" },
  publisher: { "@type": "Organization", name: "rawcv", url: "https://www.rawcv.com" },
  url: "https://www.rawcv.com/international/eu",
  datePublished: "2026-07-01",
  dateModified: "2026-07-07",
  mainEntityOfPage: "https://www.rawcv.com/international/eu",
};

const SECTION_ORDER = [
  { num: 1, title: "Personal Information", desc: "Full name, address, phone, email, date of birth, nationality, and optionally marital status. This section is standard in EU resumes — unlike US/Canada where personal details are excluded." },
  { num: 2, title: "Professional Photo", desc: "A professional headshot with a neutral background. EU recruiters expect a photo — it signals professionalism. Use a passport-style photo, not a selfie or casual snapshot." },
  { num: 3, title: "Professional Summary", desc: "A 3-5 line overview of your career, key skills, and what you bring to the role. Tailor it to the specific job posting." },
  { num: 4, title: "Work Experience", desc: "Reverse chronological order. Include company name, job title, dates, and 3-5 descriptive bullet points per role. EU style values detailed context over ultra-concise bullets." },
  { num: 5, title: "Education", desc: "Degree, institution, graduation year, and relevant coursework or thesis topics if applicable." },
  { num: 6, title: "Languages", desc: "List each language with a CEFR level (A1, A2, B1, B2, C1, C2) or descriptors like Native, Fluent, Advanced. This section is mandatory for EU resumes." },
  { num: 7, title: "Skills", desc: "Technical skills, tools, certifications, and competencies relevant to the role." },
  { num: 8, title: "Interests & Volunteer Work", desc: "Optional but valued in European CVs. Include relevant hobbies or volunteer experience that demonstrate soft skills or cultural fit." },
];

const FAQ_ITEMS = [
  { q: "Do I need a photo on my EU resume?", a: "Yes — a professional photo is strongly recommended for EU resumes. It is a standard convention across most European countries. Use a clean headshot with a neutral background." },
  { q: "What CEFR level should I list for my languages?", a: "Be honest about your proficiency. A1-A2 = basic, B1-B2 = intermediate, C1-C2 = advanced/native. If you're unsure, test yourself on the CEFR self-assessment grid or take an official language test." },
  { q: "How long should an EU resume be?", a: "Up to 3 pages is acceptable in Europe, especially for experienced professionals. This is longer than the typical US 1-page format." },
  { q: "What is the Europass format?", a: "Europass is a standardized CV format created by the European Commission. It's widely accepted across EU member states and includes personal information, photo, languages, and a structured reverse-chronological layout." },
  { q: "Can I use rawcv to convert my resume to EU format?", a: "Yes — rawcv offers AI-powered format conversion. Upload your resume, select the EU format, and our AI will restructure your content to match European conventions while preserving all your factual information." },
];

export default function EUFormatPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Script id="eu-format-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="eu-format-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent dark:from-blue-900/15 dark:via-indigo-900/10 dark:to-transparent px-6 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "International", href: "/international" }, { label: "EU Format", href: "/international/eu" }]} />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🇪🇺</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              EU / Europass Resume Format
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            The European CV format follows Europass conventions with personal details, a professional photo, language proficiency levels, and a detailed reverse-chronological structure. Up to 3 pages is standard.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/international" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
              Convert Your Resume →
            </Link>
            <Link href="/how-to" className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              How to Use rawcv
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20 -mt-4 space-y-12">
        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Max Pages", value: "3", icon: "📄" },
            { label: "Photo", value: "Required", icon: "📸" },
            { label: "Languages", value: "CEFR Levels", icon: "🗣️" },
            { label: "Personal Info", value: "Included", icon: "👤" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
              <span className="text-2xl block mb-1">{stat.icon}</span>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section Order */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Section Order</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Follow this exact order for maximum compatibility with EU recruiters and ATS systems.</p>
          <div className="space-y-4">
            {SECTION_ORDER.map((section) => (
              <div key={section.num} className="flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  {section.num}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{section.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{section.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CEFR Levels */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">🗣️ CEFR Language Levels Explained</h2>
          <div className="space-y-3">
            {[
              { level: "A1-A2", label: "Basic", desc: "Can understand and use everyday expressions. Can introduce yourself and handle simple interactions." },
              { level: "B1-B2", label: "Intermediate", desc: "Can deal with most travel situations. Can produce connected text and explain opinions. B2 is the minimum for professional work." },
              { level: "C1-C2", label: "Advanced", desc: "Can use language flexibly for social, academic, and professional purposes. C2 is near-native proficiency." },
            ].map((item) => (
              <div key={item.level} className="flex gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 p-4">
                <span className="shrink-0 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold self-start">
                  {item.level}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">💡 EU Resume Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">✅ Do</p>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Include a professional photo with neutral background</li>
                <li>• List languages with CEFR levels</li>
                <li>• Include nationality and date of birth</li>
                <li>• Be detailed — 3 pages is fine for experienced roles</li>
                <li>• Include volunteer work and interests</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">❌ Don&apos;t</p>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Don&apos;t use US-style ultra-concise bullets</li>
                <li>• Don&apos;t skip the languages section</li>
                <li>• Don&apos;t use unprofessional selfies as your photo</li>
                <li>• Don&apos;t exceed 3 pages (unless applying for senior roles)</li>
                <li>• Don&apos;t forget to tailor your summary to each application</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden group">
                <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to build your EU resume?</h2>
          <p className="text-sm text-violet-100 mb-6 max-w-lg mx-auto">Upload your resume and convert it to EU format with AI. Your content stays intact — only structure and conventions change.</p>
          <Link href="/international" className="inline-block px-6 py-3 rounded-xl bg-white text-violet-700 text-sm font-bold hover:bg-violet-50 transition-colors shadow-lg">
            Convert to EU Format →
          </Link>
        </section>
      </div>
    </main>
  );
}
