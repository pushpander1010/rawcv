import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canada Resume Format — Complete Guide & Template | rawcv",
  description:
    "Learn the Canadian resume format: no photo, no personal details, 1-2 pages, quantified achievements, and bilingual skills. Free AI conversion tool included.",
  alternates: { canonical: "https://www.rawcv.com/international/canada" },
  openGraph: {
    title: "Canada Resume Format — Complete Guide | rawcv",
    description:
      "Everything you need to write a Canadian resume: anti-discrimination rules, achievement focus, bilingual skills, and ATS-friendly formatting.",
    url: "https://www.rawcv.com/international/canada",
    type: "article",
    images: [{ url: "https://www.rawcv.com/og-image.png", width: 1200, height: 630, alt: "Canada Resume Format Guide" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Canada Resume Format — Complete Guide",
  description: "Learn the Canadian resume format: no photo, no personal details, 1-2 pages, quantified achievements, and bilingual skills.",
  author: { "@type": "Organization", name: "rawcv" },
  publisher: { "@type": "Organization", name: "rawcv", url: "https://www.rawcv.com" },
  url: "https://www.rawcv.com/international/canada",
  datePublished: "2026-07-01",
  dateModified: "2026-07-07",
  mainEntityOfPage: "https://www.rawcv.com/international/canada",
};

const SECTION_ORDER = [
  { num: 1, title: "Contact Information", desc: "Name, email, phone number, and city. Do NOT include: photo, date of birth, marital status, nationality, or full address. Canadian anti-discrimination laws discourage personal details." },
  { num: 2, title: "Professional Summary", desc: "A 3-4 line achievement-focused overview. Lead with years of experience and your strongest quantified result." },
  { num: 3, title: "Work Experience", desc: "Reverse chronological. Each bullet must start with an action verb and include a measurable result (numbers, percentages, dollar amounts)." },
  { num: 4, title: "Education", desc: "Degree, institution, graduation year. Include relevant coursework or academic honors if they strengthen your candidacy." },
  { num: 5, title: "Skills", desc: "Technical skills, tools, certifications. Mention bilingual proficiency (English/French) prominently — it's a major advantage in Canadian hiring." },
];

const FAQ_ITEMS = [
  { q: "Do I need a photo on my Canadian resume?", a: "No — never include a photo on a Canadian resume. It can actually hurt your application as it may be seen as a violation of anti-discrimination norms." },
  { q: "Can I include my age or date of birth?", a: "No — Canadian employers cannot ask for or use this information in hiring decisions. Omit it from your resume entirely." },
  { q: "How important is bilingual English/French?", a: "Very important, especially for federal government positions and roles in Quebec or Ottawa. Even basic French proficiency can set you apart." },
  { q: "How long should a Canadian resume be?", a: "1-2 pages maximum. One page for early career, two pages for experienced professionals with 10+ years." },
  { q: "What is a Canadian cover letter?", a: "A Canadian cover letter is a separate document (not part of the resume) that introduces you, explains why you want the role, and highlights 2-3 key achievements. It should be addressed to the hiring manager by name." },
];

export default function CanadaFormatPage() {
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
      <Script id="canada-format-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="canada-format-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent dark:from-red-900/15 dark:via-orange-900/10 dark:to-transparent px-6 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "International", href: "/international" }, { label: "Canada Format", href: "/international/canada" }]} />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🇨🇦</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Canada Resume Format
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            The Canadian resume emphasizes quantified achievements, clean formatting, and anti-discrimination compliance. No photo, no personal details, no exceptions.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/international" className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20">
              Convert Your Resume →
            </Link>
            <Link href="/cover-letter" className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Build Cover Letter →
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-20 -mt-4 space-y-12">
        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Max Pages", value: "1-2", icon: "📄" },
            { label: "Photo", value: "Never", icon: "🚫" },
            { label: "Achievements", value: "Quantified", icon: "📈" },
            { label: "Bilingual", value: "Bonus", icon: "🗣️" },
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Canadian resumes follow a strict, clean structure optimized for both ATS systems and human recruiters.</p>
          <div className="space-y-4">
            {SECTION_ORDER.map((section) => (
              <div key={section.num} className="flex gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-bold flex items-center justify-center">
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

        {/* Anti-Discrimination */}
        <section className="rounded-3xl border border-red-200 dark:border-red-800/60 bg-red-50/50 dark:bg-red-950/20 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">⚖️ Canadian Anti-Discrimination Rules</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            Canada has strict employment equity laws. Your resume must not include information that could lead to discrimination based on protected grounds.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {["Photo", "Date of Birth", "Marital Status", "Nationality", "Religion", "Disability Status", "Full Address", "Gender"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl bg-white dark:bg-gray-900 p-3 text-xs">
                <span className="text-red-500">✗</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Do not include: {item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">💡 Canadian Resume Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">✅ Do</p>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Quantify every bullet point with numbers</li>
                <li>• Mention bilingual (English/French) skills</li>
                <li>• Use action verbs: spearheaded, delivered, optimized</li>
                <li>• Keep formatting clean and ATS-friendly</li>
                <li>• Include a Canadian-style cover letter</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">❌ Don&apos;t</p>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Never include a photo</li>
                <li>• Don&apos;t include age, DOB, or nationality</li>
                <li>• Don&apos;t use tables or complex layouts</li>
                <li>• Don&apos;t exceed 2 pages</li>
                <li>• Don&apos;t use &quot;References available upon request&quot;</li>
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
        <section className="rounded-3xl bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Build your Canadian resume</h2>
          <p className="text-sm text-red-100 mb-6 max-w-lg mx-auto">Convert your resume to Canadian format with AI. We remove photos, strip personal details, and restructure for maximum impact.</p>
          <Link href="/international" className="inline-block px-6 py-3 rounded-xl bg-white text-red-600 text-sm font-bold hover:bg-red-50 transition-colors shadow-lg">
            Convert to Canadian Format →
          </Link>
        </section>
      </div>
    </main>
  );
}
