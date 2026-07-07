import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Formats by Country — Global CV Guide | rawcv",
  description:
    "Compare resume formats for every major hiring market: US, EU/Europass, Canada, India, UK, Australia, Germany, Japan, and more. Section order, photo rules, length, and cultural conventions explained.",
  alternates: { canonical: "https://www.rawcv.com/resume-formats" },
  openGraph: {
    title: "Resume Formats by Country — Global CV Guide | rawcv",
    description: "The complete guide to resume formats worldwide. Compare section order, photo requirements, length limits, and cultural conventions for 10+ countries.",
    url: "https://www.rawcv.com/resume-formats",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Resume Formats by Country — Global CV Guide",
  description: "Compare resume formats for every major hiring market: US, EU/Europass, Canada, India, UK, Australia, Germany, Japan, and more.",
  author: { "@type": "Organization", name: "rawcv" },
  publisher: { "@type": "Organization", name: "rawcv", url: "https://www.rawcv.com" },
  url: "https://www.rawcv.com/resume-formats",
  datePublished: "2026-07-07",
  dateModified: "2026-07-07",
  mainEntityOfPage: "https://www.rawcv.com/resume-formats",
};

const FORMATS = [
  {
    country: "United States",
    flag: "🇺🇸",
    pages: "1 page",
    photo: "Never",
    personalDetails: "No",
    style: "Achievement-first, ultra-concise",
    sectionOrder: ["Contact", "Summary", "Experience", "Education", "Skills"],
    keyTip: "Every bullet must start with an action verb and include quantified results.",
    link: "/international/us",
    supported: true,
  },
  {
    country: "EU / Europass",
    flag: "🇪🇺",
    pages: "Up to 3 pages",
    photo: "Required",
    personalDetails: "Yes (DOB, nationality)",
    style: "Detailed, descriptive, comprehensive",
    sectionOrder: ["Personal Info", "Photo", "Summary", "Experience", "Education", "Languages", "Skills"],
    keyTip: "Include a Languages section with CEFR levels (A1-C2). This is mandatory.",
    link: "/international/eu",
    supported: true,
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    pages: "1-2 pages",
    photo: "Never",
    personalDetails: "No",
    style: "Clean, achievement-focused, ATS-optimized",
    sectionOrder: ["Contact", "Summary", "Experience", "Education", "Skills"],
    keyTip: "Anti-discrimination laws apply. Never include photo, age, or nationality.",
    link: "/international/canada",
    supported: true,
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    pages: "2 pages",
    photo: "Rarely (unless acting/modeling)",
    personalDetails: "Minimal",
    style: "Professional, achievement-focused, British English",
    sectionOrder: ["Contact", "Profile", "Experience", "Education", "Skills", "Interests"],
    keyTip: "Use British English spelling (organise, analyse). Include a 'Profile' section instead of 'Summary'.",
    link: "/international",
    supported: false,
  },
  {
    country: "India",
    flag: "🇮🇳",
    pages: "2-3 pages",
    photo: "Common",
    personalDetails: "Often included (DOB, father's name)",
    style: "Detailed, technical, comprehensive",
    sectionOrder: ["Personal Details", "Objective", "Education", "Experience", "Skills", "Projects", "Certifications"],
    keyTip: "Include a dedicated 'Technical Skills' section and 'Projects' section. Photo and personal details are still standard.",
    link: "/international",
    supported: false,
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    pages: "2-3 pages",
    photo: "Rarely",
    personalDetails: "Minimal",
    style: "Achievement-focused, conversational tone acceptable",
    sectionOrder: ["Contact", "Career Summary", "Employment History", "Education", "Skills", "Referees"],
    keyTip: "Including referees (with contact details) is still common in Australia. Use Australian English spelling.",
    link: "/international",
    supported: false,
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    pages: "Up to 3 pages",
    photo: "Expected",
    personalDetails: "Yes (DOB, nationality, marital status)",
    style: "Very detailed, formal, chronological",
    sectionOrder: ["Personal Info", "Photo", "Summary", "Experience", "Education", "Languages", "Skills"],
    keyTip: "German CVs (Lebenslauf) must include a photo and personal details. A handwritten signature is often expected.",
    link: "/international/eu",
    supported: false,
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    pages: "1-2 pages (Rirekisho)",
    photo: "Required",
    personalDetails: "Extensive (DOB, gender, family)",
    style: "Highly structured, formal, photo mandatory",
    sectionOrder: ["Personal Info", "Photo", "Education", "Experience", "Skills", "Motivation"],
    keyTip: "Japan uses a specific 'Rirekisho' (履歴書) form. Follow the template exactly — deviation is considered unprofessional.",
    link: "/international",
    supported: false,
  },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Resume Formats by Country",
  description: "Compare resume formats for every major hiring market: US, EU/Europass, Canada, India, UK, Australia, Germany, Japan, and more.",
  url: "https://www.rawcv.com/resume-formats",
  itemListElement: FORMATS.map((format, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${format.country} Resume Format`,
    url: `https://www.rawcv.com${format.link}`,
    description: format.keyTip,
  })),
};

export default function ResumeFormatsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is the best resume format for international job applications?", acceptedAnswer: { "@type": "Answer", text: "The best format depends on your target country. US uses 1-page achievement-focused, EU uses 3-page detailed with photo, Canada mirrors US but longer. Always research the specific conventions of your target market." } },
      { "@type": "Question", name: "Do I need a photo on my resume?", acceptedAnswer: { "@type": "Answer", text: "It depends on the country. EU/Germany/Japan require a photo. US/Canada/Australia never include one. UK and India rarely include one. When in doubt, research the specific country's convention." } },
      { "@type": "Question", name: "Can rawcv convert my resume to any format?", acceptedAnswer: { "@type": "Answer", text: "rawcv currently supports AI-powered conversion for US, EU/Europass, Canada, and General formats. Each conversion adapts section order, content style, and format rules while preserving all factual information." } },
      { "@type": "Question", name: "How long should a resume be?", acceptedAnswer: { "@type": "Answer", text: "US: 1 page. Canada: 1-2 pages. UK: 2 pages. EU: up to 3 pages. India: 2-3 pages. Australia: 2-3 pages. The length depends on your experience level and the country's conventions." } },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Script id="resume-formats-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="resume-formats-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Script id="resume-formats-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section className="bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent dark:from-violet-900/15 dark:via-indigo-900/10 dark:to-transparent px-6 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Resume Formats", href: "/resume-formats" }]} />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            Resume Formats by Country
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Every country has different expectations for resume format, length, photo requirements, and content. Compare formats below and convert your resume with AI.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20 -mt-4 space-y-10">
        {/* Comparison Table */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Country</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pages</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Photo</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">Personal Details</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Style</th>
                </tr>
              </thead>
              <tbody>
                {FORMATS.map((format) => (
                  <tr key={format.country} className="border-b border-gray-100 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{format.flag}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{format.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{format.pages}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{format.photo}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 hidden sm:table-cell">{format.personalDetails}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 hidden md:table-cell">{format.style}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Detailed Format Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FORMATS.map((format) => (
              <div key={format.country} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md hover:border-violet-300 dark:hover:border-violet-800/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{format.flag}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{format.country}</h3>
                  </div>
                  {format.supported && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase">
                      AI Conversion
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-500">Pages</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{format.pages}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3">
                    <p className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-500">Photo</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{format.photo}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-500 mb-1">Section Order</p>
                  <div className="flex flex-wrap gap-1">
                    {format.sectionOrder.map((section, i) => (
                      <span key={i} className="text-[10px] text-gray-600 dark:text-gray-400">
                        {i > 0 && <span className="text-gray-300 dark:text-gray-600 mr-1">→</span>}
                        {section}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-4">💡 {format.keyTip}</p>

                {format.supported ? (
                  <Link href={format.link} className="inline-block px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors">
                    Convert to {format.country} Format →
                  </Link>
                ) : (
                  <Link href="/international" className="inline-block px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    General Conversion →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is the best resume format for international job applications?", a: "The best format depends on your target country. US uses 1-page achievement-focused, EU uses 3-page detailed with photo, Canada mirrors US but longer. Always research the specific conventions of your target market." },
              { q: "Do I need a photo on my resume?", a: "It depends on the country. EU/Germany/Japan require a photo. US/Canada/Australia never include one. UK and India rarely include one. When in doubt, research the specific country's convention." },
              { q: "Can rawcv convert my resume to any format?", a: "rawcv currently supports AI-powered conversion for US, EU/Europass, Canada, and General formats. Each conversion adapts section order, content style, and format rules while preserving all factual information." },
              { q: "How long should a resume be?", a: "US: 1 page. Canada: 1-2 pages. UK: 2 pages. EU: up to 3 pages. India: 2-3 pages. Australia: 2-3 pages. The length depends on your experience level and the country's conventions." },
            ].map((item, i) => (
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
          <h2 className="text-2xl font-bold mb-2">Ready to convert your resume?</h2>
          <p className="text-sm text-violet-100 mb-6 max-w-lg mx-auto">Upload your resume and let AI adapt it to your target country&apos;s format. Your content stays the same — only structure changes.</p>
          <Link href="/international" className="inline-block px-6 py-3 rounded-xl bg-white text-violet-700 text-sm font-bold hover:bg-violet-50 transition-colors shadow-lg">
            Start Converting →
          </Link>
        </section>
      </div>
    </main>
  );
}
