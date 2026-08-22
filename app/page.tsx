import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Icon, { type IconName } from "@/components/Icon";

export const metadata: Metadata = {
  title: "rawcv — Free AI Resume Builder & ATS Score Checker",
  description:
    "Build, analyze, and optimize your resume with AI — 100% free. Get instant ATS scores, match resumes to job descriptions, and download polished PDFs. No signup required.",
  alternates: { canonical: "https://www.rawcv.com" },
};

const features: { icon: IconName; title: string; desc: string }[] = [
  { icon: "score", title: "ATS Score Analysis", desc: "Get a score out of 100 with specific fixes to pass Applicant Tracking Systems." },
  { icon: "target", title: "Job Match", desc: "Paste any job description and see exactly which keywords and skills are missing." },
  { icon: "sparkles", title: "AI Suggestions", desc: "Get targeted improvements for action verbs, quantified achievements, and completeness." },
  { icon: "trend", title: "Bullet Enhancement", desc: "Strengthen weak bullet points with powerful, results-focused language." },
  { icon: "chat", title: "AI Chat Builder", desc: "Build or customize your resume conversationally — just tell the AI what you want." },
  { icon: "document", title: "Cover Letters", desc: "Generate professional cover letters tailored to your resume and job description." },
  { icon: "layers", title: "14 Themes", desc: "Choose from professionally designed themes with live preview and instant PDF download." },
  { icon: "globe", title: "International Formats", desc: "EU, Canada, US, and India-specific resume formats with region-appropriate sections." },
];

const faqs = [
  { q: "Is rawcv really free?", a: "Yes — 100% free. All features including ATS scoring, JD matching, AI suggestions, cover letter builder, and PDF download are available without any account or payment." },
  { q: "What file formats are supported?", a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB." },
  { q: "How does ATS scoring work?", a: "We run 100+ rule-based checks (missing sections, keyword density, date formatting) combined with AI analysis to give you a score out of 100 with specific issues to fix." },
  { q: "Will my resume data be stored?", a: "No. Resume data is held in your browser session only. We do not permanently store your resume content on our servers." },
  { q: "Can I use rawcv on mobile?", a: "Yes — rawcv is fully responsive. The chat, analysis, and download tools all work on mobile browsers." },
  { q: "Do I need to create an account?", a: "No — just upload your resume and start analyzing. No sign-up, no credit card, no strings attached." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
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

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="pt-20 sm:pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">100% Free — No Signup Required</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-gray-900 dark:text-white mb-6">
            Build a resume that
            <br />
            <span className="text-brand-600 dark:text-brand-400">actually gets interviews</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your CV, get an instant ATS score, match it to any job description,
            enhance it with AI, and download a polished PDF — all in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-base font-semibold shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Upload & Analyze Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Build from Scratch
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-14 text-center">
            {[
              { value: "100+", label: "ATS Checks" },
              { value: "14", label: "Themes" },
              { value: "0$", label: "Forever Free" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ APP MOCKUP ═══════════════ */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-card border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center px-4">
                <span className="text-xs text-gray-500">rawcv.com/analyze</span>
              </div>
            </div>
            <div className="flex h-64 sm:h-80 overflow-hidden">
              <div className="w-56 sm:w-72 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
                <div className="h-7 w-28 rounded-lg bg-brand-100 dark:bg-brand-900/40" />
                <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-4/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="mt-2 h-11 w-full rounded-xl bg-brand-600 opacity-90" />
                <div className="mt-auto p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs font-bold text-emerald-600">ATS Score: 92/100</div>
                </div>
              </div>
              <div className="flex-1 p-5 bg-gray-50 dark:bg-gray-950">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 h-full">
                  <div className="border-b-2 border-gray-800 dark:border-gray-200 pb-3 mb-3">
                    <div className="h-5 w-40 rounded bg-gray-800 dark:bg-gray-200 mb-2" />
                    <div className="flex gap-3">
                      <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600" />
                      <div className="h-3 w-20 rounded bg-gray-300 dark:bg-gray-600" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="h-3 w-20 rounded bg-gray-400 dark:bg-gray-500 mb-2" />
                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["React", "TypeScript", "Node.js", "Python"].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">Everything you need to get hired</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Professional-grade resume tools powered by AI — completely free.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                  <Icon name={f.icon} size={20} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5 text-gray-900 dark:text-gray-100">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-16 text-gray-900 dark:text-white">Three steps to a better resume</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload", desc: "Drag and drop your PDF, DOCX, or TXT file. We parse it in seconds." },
              { step: "02", title: "Analyze", desc: "Run ATS scoring, paste a job description, and get AI-powered suggestions." },
              { step: "03", title: "Download", desc: "Pick a theme, apply changes, and download a polished ATS-safe PDF." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-lg shadow-brand mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-brand-600">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to land more interviews?</h2>
            <p className="text-brand-100 mb-8 max-w-md mx-auto">Upload your resume and get instant AI-powered analysis — completely free, no account needed.</p>
            <Link href="/analyze" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800" id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12 text-gray-900 dark:text-white">Frequently asked questions</h2>
          <dl className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-card">
                <dt className="font-semibold text-gray-900 dark:text-gray-100 mb-2" itemProp="name">{faq.q}</dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
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
