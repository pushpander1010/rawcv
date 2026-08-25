import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Icon, { type IconName } from "@/components/Icon";
import HowToSchema from "@/components/HowToSchema";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
<HowToSchema name="How to use rawcv" description="Build, analyze, and optimize your resume in four steps." steps={[{ name: "Upload your resume", text: "Upload your resume as a PDF, DOCX, or TXT file — no signup required." }, { name: "Get your ATS score", text: "Get an instant ATS score out of 100 with specific fixes to pass applicant tracking systems." }, { name: "Match a job description", text: "Paste any job description to see exactly which keywords and skills are missing." }, { name: "Download a polished PDF", text: "Apply AI suggestions, choose a theme, and download a polished ATS-safe PDF." }]} />
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">100% Free — No Signup Required</span>
          </div>

          <h1 className="text-[32px] sm:text-[48px] lg:text-[52px] font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white mb-4">
            Build a resume that
            <br />
            <span className="text-blue-600">actually gets interviews</span>
          </h1>

          <p className="text-[16px] sm:text-[18px] text-slate-500 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Upload your CV, get an instant ATS score, match it to any job description,
            enhance it with AI, and download a polished PDF — all in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-semibold transition-colors"
            >
              Upload & Analyze Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
                <div className="text-[22px] sm:text-[26px] font-bold text-slate-900 dark:text-white leading-none">{stat.value}</div>
                <div className="text-[12.5px] text-slate-500 dark:text-slate-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HERO IMAGE ═══════════════ */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <img
            src="/hero_illustration.jpg"
            alt="AI resume builder and ATS analyzer illustration"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800"
            width={1400}
            height={763}
          />
        </div>
      </section>

      {/* ═══════════════ APP MOCKUP ═══════════════ */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center px-4">
                <span className="text-xs text-slate-500 dark:text-slate-300">rawcv.com/analyze</span>
              </div>
            </div>
            <div className="flex h-64 sm:h-80 overflow-hidden">
              <div className="w-56 sm:w-72 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3 bg-white dark:bg-slate-900">
                <div className="h-7 w-28 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100" />
                <div className="h-3.5 w-full rounded bg-slate-100" />
                <div className="h-3.5 w-5/6 rounded bg-slate-100" />
                <div className="h-3.5 w-4/6 rounded bg-slate-100" />
                <div className="mt-2 h-10 w-full rounded-full bg-blue-600 opacity-90" />
                <div className="mt-auto p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">ATS Score: 92/100</div>
                </div>
              </div>
              <div className="flex-1 p-5 bg-slate-50 dark:bg-slate-950">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-full">
                  <div className="border-b-2 border-slate-900 pb-3 mb-3">
                    <div className="h-4 w-36 rounded bg-slate-900 mb-2" />
                    <div className="flex gap-3">
                      <div className="h-3 w-24 rounded bg-slate-300" />
                      <div className="h-3 w-20 rounded bg-slate-300" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="h-3 w-20 rounded bg-slate-400 mb-2" />
                    <div className="h-3 w-full rounded bg-slate-200 mb-1.5" />
                    <div className="h-3 w-5/6 rounded bg-slate-200" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["React", "TypeScript", "Node.js", "Python"].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-950/30 border border-blue-100 text-blue-700 dark:text-blue-300 font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white">Everything you need to get hired</h2>
            <p className="text-[14.5px] text-slate-500 dark:text-slate-300 max-w-xl mx-auto mt-2">
              Professional-grade resume tools powered by AI — completely free.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <Icon name={f.icon} size={18} />
                </div>
                <h3 className="font-semibold text-[14px] mb-1 text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-center text-slate-900 dark:text-white">Three steps to a better resume</h2>
          <p className="text-center text-[14.5px] text-slate-500 dark:text-slate-300 mt-2 mb-10">From upload to download in under 5 minutes.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Upload", desc: "Drag and drop your PDF, DOCX, or TXT file. We parse it in seconds." },
              { step: "02", title: "Analyze", desc: "Run ATS scoring, paste a job description, and get AI-powered suggestions." },
              { step: "03", title: "Download", desc: "Pick a theme, apply changes, and download a polished ATS-safe PDF." },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[15px] mb-1.5 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-[13.5px] text-slate-500 dark:text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <img
              src="/success_illustration.jpg"
              alt="Job offer and hiring success illustration"
              className="w-full max-w-3xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-700"
              width={1280}
              height={698}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900">
            <h2 className="text-[24px] sm:text-[30px] font-bold text-white leading-tight">Ready to land more interviews?</h2>
            <p className="text-[14.5px] text-slate-300 mt-2 mb-7 max-w-md mx-auto">Upload your resume and get instant AI-powered analysis — completely free, no account needed.</p>
            <Link href="/analyze" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-[14px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800" id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-center mb-8 text-slate-900 dark:text-white">Frequently asked questions</h2>
          <dl className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <dt className="font-semibold text-[14.5px] text-slate-900 dark:text-white mb-1.5" itemProp="name">{faq.q}</dt>
                <dd className="text-[13.5px] text-slate-500 dark:text-slate-300 leading-relaxed" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
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