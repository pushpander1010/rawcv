import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "rawcv — Free AI Resume Builder & ATS Score Checker",
  description:
    "Build, analyze, and optimize your resume with AI — 100% free. Get instant ATS scores, match resumes to job descriptions, and download polished PDFs. No signup required.",
  alternates: { canonical: "https://www.rawcv.com" },
};

const features = [
  { icon: "📊", title: "ATS Score Analysis", desc: "Get a score out of 100 with specific fixes to pass Applicant Tracking Systems." },
  { icon: "🎯", title: "Job Match", desc: "Paste any job description and see exactly which keywords and skills are missing." },
  { icon: "✨", title: "AI Suggestions", desc: "Get targeted improvements for action verbs, quantified achievements, and completeness." },
  { icon: "🔧", title: "Bullet Enhancement", desc: "Strengthen weak bullet points with powerful, results-focused language." },
  { icon: "💬", title: "AI Chat Builder", desc: "Build or customize your resume conversationally — just tell the AI what you want." },
  { icon: "📝", title: "Cover Letters", desc: "Generate professional cover letters tailored to your resume and job description." },
  { icon: "🎨", title: "14 Themes", desc: "Choose from professionally designed themes with live preview and instant PDF download." },
  { icon: "🌍", title: "International Formats", desc: "EU, Canada, US, and India-specific resume formats with region-appropriate sections." },
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
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background orbs */}
        <div aria-hidden="true" className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div aria-hidden="true" className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">100% Free — No Signup Required</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Build a resume that
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              actually gets interviews
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your CV, get an instant ATS score, match it to any job description,
            enhance it with AI, and download a polished PDF — all in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-base font-bold shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              Upload & Analyze Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/build"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              Build from Scratch
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 text-center">
            {[
              { value: "100+", label: "ATS Checks" },
              { value: "14", label: "Themes" },
              { value: "0$", label: "Forever Free" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ APP MOCKUP ═══════════════ */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center px-4">
                <span className="text-xs text-gray-500">rawcv.com/analyze</span>
              </div>
            </div>
            <div className="flex h-64 sm:h-80 overflow-hidden">
              <div className="w-56 sm:w-72 border-r border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
                <div className="h-7 w-28 rounded-lg bg-violet-100 dark:bg-violet-900/40" />
                <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-4/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-80" />
                <div className="mt-auto p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs font-bold text-emerald-600">ATS Score: 92/100</div>
                </div>
              </div>
              <div className="flex-1 p-5 bg-gray-50 dark:bg-gray-950">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
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
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium">{s}</span>
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
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Everything you need to get hired</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Professional-grade resume tools powered by AI — completely free.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="group p-5 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
                <span className="text-2xl block mb-3">{f.icon}</span>
                <h3 className="font-bold text-sm mb-1.5 text-gray-900 dark:text-gray-100">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">Three steps to a better resume</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload", desc: "Drag and drop your PDF, DOCX, or TXT file. We parse it in seconds.", color: "from-violet-500 to-purple-500" },
              { step: "02", title: "Analyze", desc: "Run ATS scoring, paste a job description, and get AI-powered suggestions.", color: "from-purple-500 to-indigo-500" },
              { step: "03", title: "Download", desc: "Pick a theme, apply changes, and download a polished ATS-safe PDF.", color: "from-indigo-500 to-blue-500" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-black text-lg shadow-lg mb-4`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to land more interviews?</h2>
              <p className="text-violet-100 mb-8 max-w-md mx-auto">Upload your resume and get instant AI-powered analysis — completely free, no account needed.</p>
              <Link href="/analyze" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-violet-700 font-bold shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200">
                Get Started Free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/30" id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-center mb-12">Frequently asked questions</h2>
          <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60">
                <dt className="font-bold text-gray-900 dark:text-gray-100 mb-2" itemProp="name">{faq.q}</dt>
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
