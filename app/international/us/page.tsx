import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "US Resume Format — Complete Guide & Template | rawcv",
  description:
    "Learn the American resume format: 1-page preferred, no photo, achievement-first bullets, strong action verbs, and ATS-optimized structure. Free AI conversion tool included.",
  alternates: { canonical: "https://www.rawcv.com/international/us" },
  openGraph: {
    title: "US Resume Format — Complete Guide | rawcv",
    description:
      "Everything you need to write a US resume: 1-page format, achievement focus, action verbs, ATS optimization, and what NOT to include.",
    url: "https://www.rawcv.com/international/us",
    type: "article",
    images: [{ url: "https://www.rawcv.com/og-image.png", width: 1200, height: 630, alt: "US Resume Format Guide" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "US Resume Format — Complete Guide",
  description: "Learn the American resume format: 1-page preferred, no photo, achievement-first bullets, strong action verbs, and ATS-optimized structure.",
  author: { "@type": "Organization", name: "rawcv" },
  publisher: { "@type": "Organization", name: "rawcv", url: "https://www.rawcv.com" },
  url: "https://www.rawcv.com/international/us",
  datePublished: "2026-07-01",
  dateModified: "2026-07-07",
  mainEntityOfPage: "https://www.rawcv.com/international/us",
};

const SECTION_ORDER = [
  { num: 1, title: "Contact Information", desc: "Name, email, phone, city/state, LinkedIn URL, portfolio URL. No photo, no address, no DOB, no references." },
  { num: 2, title: "Professional Summary", desc: "2-3 lines max. Lead with years of experience + strongest quantified achievement + the value you bring. Tailor to each job." },
  { num: 3, title: "Work Experience", desc: "Reverse chronological. Each bullet: ACTION VERB + TASK + RESULT (with numbers). 3-5 bullets per role. Cut older roles to 1-2 bullets." },
  { num: 4, title: "Education", desc: "Degree, institution, graduation year. If you have 2+ years of work experience, keep this brief. GPA only if 3.5+ and recent grad." },
  { num: 5, title: "Skills", desc: "Technical skills, certifications, tools. Group by category. Mirror keywords from the job description." },
];

const ACTION_VERBS = [
  { category: "Leadership", verbs: ["Spearheaded", "Orchestrated", "Championed", "Directed", "Mobilized"] },
  { category: "Achievement", verbs: ["Delivered", "Exceeded", "Surpassed", "Outperformed", "Achieved"] },
  { category: "Creation", verbs: ["Engineered", "Architected", "Pioneered", "Designed", "Developed"] },
  { category: "Improvement", verbs: ["Optimized", "Streamlined", "Accelerated", "Revamped", "Transformed"] },
  { category: "Analysis", verbs: ["Analyzed", "Evaluated", "Assessed", "Diagnosed", "Identified"] },
];

const FAQ_ITEMS = [
  { q: "Should my US resume be 1 page?", a: "Yes — for early to mid-career professionals (0-10 years experience), keep it to 1 page. Senior professionals with 10+ years can use 2 pages, but never more than 2." },
  { q: "Do I need a photo on my US resume?", a: "No — never include a photo on a US resume. It can lead to unconscious bias and is considered unprofessional. ATS systems also cannot parse photos." },
  { q: "What is an ATS-friendly resume?", a: "An ATS (Applicant Tracking System) friendly resume uses clean formatting, standard section headings, text-based PDFs, and avoids tables, graphics, and columns that parsers can't read." },
  { q: "How do I quantify achievements if my job doesn't have numbers?", a: "Think about impact: time saved, processes improved, team size managed, budget controlled, customer satisfaction improved. Even 'reduced onboarding time by 30%' or 'managed a team of 5' counts." },
  { q: "Should I include references on my US resume?", a: "No — do not include references or 'References available upon request' on your resume. Provide references separately when asked during the interview process." },
];

export default function USFormatPage() {
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
      <Script id="us-format-article" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="us-format-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent dark:from-blue-900/15 dark:via-cyan-900/10 dark:to-transparent px-6 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "International", href: "/international" }, { label: "US Format", href: "/international/us" }]} />
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🇺🇸</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              US Resume Format
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            The American resume is achievement-first, ultra-concise, and ATS-optimized. One page preferred. No photo. Every bullet must show measurable impact.
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
            { label: "Pages", value: "1 preferred", icon: "📄" },
            { label: "Photo", value: "Never", icon: "🚫" },
            { label: "Bullets", value: "3-5 per role", icon: "📝" },
            { label: "Style", value: "Achievement-first", icon: "🎯" },
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">American resumes follow a strict, minimal structure. Every section must earn its place.</p>
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

        {/* Action Verbs */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">💪 Power Action Verbs</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Start every bullet with a strong action verb. Avoid: &quot;Responsible for&quot;, &quot;Helped with&quot;, &quot;Worked on&quot;.</p>
          <div className="space-y-3">
            {ACTION_VERBS.map((group) => (
              <div key={group.category} className="flex items-start gap-3">
                <span className="shrink-0 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase mt-0.5">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.verbs.map((verb) => (
                    <span key={verb} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300">
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bullet Formula */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">📐 The Perfect Bullet Formula</h2>
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/40 p-5 mb-4">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">ACTION VERB + TASK + RESULT (with numbers)</p>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-red-500 line-through">Responsible for managing the sales team</span>
                <br />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">→ Led a 12-person sales team that exceeded quarterly targets by 23%, generating $2.4M in new revenue</span>
              </div>
              <div>
                <span className="text-red-500 line-through">Helped improve website performance</span>
                <br />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">→ Engineered a performance optimization that reduced page load time from 4.2s to 1.1s, boosting conversion rate by 18%</span>
              </div>
              <div>
                <span className="text-red-500 line-through">Worked on customer support tickets</span>
                <br />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">→ Resolved 50+ customer tickets daily with a 97% satisfaction rating, reducing average response time by 40%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">💡 US Resume Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">✅ Do</p>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Keep it to 1 page (early-mid career)</li>
                <li>• Start every bullet with a strong action verb</li>
                <li>• Quantify achievements with specific numbers</li>
                <li>• Mirror keywords from the job description</li>
                <li>• Use a clean, single-column ATS-friendly layout</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">❌ Don&apos;t</p>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>• Never include a photo</li>
                <li>• Don&apos;t include DOB, age, or nationality</li>
                <li>• Don&apos;t exceed 1 page for &lt;10 years experience</li>
                <li>• Don&apos;t include &quot;References available upon request&quot;</li>
                <li>• Don&apos;t use fancy fonts, tables, or graphics</li>
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
        <section className="rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Build your US resume</h2>
          <p className="text-sm text-blue-100 mb-6 max-w-lg mx-auto">Convert your resume to US format with AI. We trim to 1 page, remove personal details, and rewrite bullets for maximum impact.</p>
          <Link href="/international" className="inline-block px-6 py-3 rounded-xl bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg">
            Convert to US Format →
          </Link>
        </section>
      </div>
    </main>
  );
}
