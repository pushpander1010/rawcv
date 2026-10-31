import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Icon, { type IconName } from "@/components/Icon";
import HowToSchema from "@/components/HowToSchema";
import ThemeShowcase from "@/components/ThemeShowcase";

export const metadata: Metadata = {
  title: "rawcv — Free AI Resume Builder & ATS Score Checker",
  description:
    "Build, analyze, and optimize your resume with AI — 100% free. Get instant ATS scores, match resumes to job descriptions, and download polished PDFs. No signup required.",
  alternates: { canonical: "https://www.rawcv.com" },
};

const features: { icon: IconName; title: string; desc: string }[] = [
  { icon: "score", title: "ATS score", desc: "100+ rule-based checks, a score out of 100, and the exact fixes that matter." },
  { icon: "target", title: "Job match", desc: "Paste a job description and see which keywords and skills are missing." },
  { icon: "sparkles", title: "AI suggestions", desc: "Stronger action verbs, quantified results, and tighter section structure." },
  { icon: "trend", title: "Bullet rewrite", desc: "Turn weak duties into results-focused achievements in one click." },
  { icon: "layers", title: "18 themes", desc: "MAANG, Onyx, editorial, Swiss, classic, sidebars, and regional formats." },
  { icon: "globe", title: "International", desc: "EU, Canada, US, and India formats with the right sections and conventions." },
];

const faqs = [
  { q: "Is rawcv really free?", a: "Yes — 100% free. ATS scoring, JD matching, AI suggestions, cover letters, and PDF downloads are all available without an account or payment." },
  { q: "What file formats are supported?", a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB." },
  { q: "How does ATS scoring work?", a: "We run 100+ rule-based checks (missing sections, keyword density, date formatting) combined with AI analysis to give you a score out of 100 with specific issues to fix." },
  { q: "Will my resume data be stored?", a: "No. Resume data stays in your browser session. We do not permanently store resume content on our servers." },
  { q: "Can I use rawcv on mobile?", a: "Yes — the builder, chat, analysis, and downloads all work on mobile browsers." },
  { q: "Do I need to create an account?", a: "No. Open the builder or upload a resume and start — no sign-up, no credit card." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
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
      <HowToSchema
        name="How to use rawcv"
        description="Build, analyze, and optimize your resume in four steps."
        steps={[
          { name: "Upload your resume", text: "Upload your resume as a PDF, DOCX, or TXT file — no signup required." },
          { name: "Get your ATS score", text: "Get an instant ATS score out of 100 with specific fixes to pass applicant tracking systems." },
          { name: "Match a job description", text: "Paste any job description to see exactly which keywords and skills are missing." },
          { name: "Download a polished PDF", text: "Apply AI suggestions, choose a theme, and download a polished ATS-safe PDF." },
        ]}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(37,99,235,0.08),transparent_70%)] dark:bg-[radial-gradient(60%_100%_at_50%_0%,rgba(59,130,246,0.12),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-3 py-1 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-300">
              Free forever · no account · no watermark
            </span>
          </div>

          <h1 className="text-[36px] sm:text-[54px] lg:text-[62px] font-bold tracking-[-0.035em] leading-[0.98] text-slate-900 dark:text-white">
            A resume that
            <br />
            <span className="font-serif italic font-normal text-blue-600">earns the interview.</span>
          </h1>

          <p className="mt-5 text-[15px] sm:text-[17px] text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Build a typeset, ATS-safe resume in minutes — then score it, match it to a job,
            and rewrite weak bullets with AI. All free.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/build"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[14px] font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Build my resume
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[14px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              Check my ATS score
            </Link>
          </div>

          <div className="mt-7 flex items-center justify-center gap-6 sm:gap-10 text-[11.5px] text-slate-400 dark:text-slate-500">
            <span><strong className="text-slate-700 dark:text-slate-200 font-semibold">100+</strong> ATS checks</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <span><strong className="text-slate-700 dark:text-slate-200 font-semibold">18</strong> themes</span>
            <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
            <span><strong className="text-slate-700 dark:text-slate-200 font-semibold">$0</strong> forever</span>
          </div>
        </div>
      </section>

      <ThemeShowcase />

      {/* ═══════════ BULLET LAB ═══════════ */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-slate-400">
                The 7-second test
              </p>
              <h2 className="mt-3 text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] leading-[1.05]">
                Your resume is not average.
                <br />
                <span className="font-serif italic font-normal text-blue-400">Your bullets are.</span>
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-slate-400 max-w-md">
                Recruiters skim for one thing: evidence. rawcv scores every bullet for a strong
                opener, a real metric, and clean length — then fixes the wording without inventing
                a number you cannot defend.
              </p>
              <div className="mt-6 flex flex-wrap gap-5 text-[11.5px] text-slate-400">
                <span><strong className="text-white font-semibold">1</strong> Weak opener</span>
                <span><strong className="text-white font-semibold">2</strong> No metric</span>
                <span><strong className="text-white font-semibold">3</strong> Filler</span>
                <span><strong className="text-white font-semibold">4</strong> Too long</span>
              </div>
              <Link
                href="/build"
                className="mt-7 inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-[12.5px] font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Open the bullet coach <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                <span>Before</span><span className="text-red-400">18/100</span>
              </div>
              <p className="mt-2 rounded-lg bg-red-950/30 border border-red-900/50 px-3 py-2.5 text-[13px] leading-relaxed text-red-100">
                Responsible for improving website performance and working on various frontend projects.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Weak opener", "No metric", "Filler", "Vague"].map((t) => (
                  <span key={t} className="rounded border border-red-900/50 bg-red-950/30 px-1.5 py-0.5 text-[9.5px] font-semibold text-red-300">{t}</span>
                ))}
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-300">
                  rawcv rewrite
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                <span>After</span><span className="text-emerald-400">94/100</span>
              </div>
              <p className="mt-2 rounded-lg bg-emerald-950/30 border border-emerald-900/50 px-3 py-2.5 text-[13px] leading-relaxed text-emerald-50">
                Cut p95 page load from 4.8s to 1.8s by rebuilding the dashboard in Next.js,
                lifting activation 12% across 2M monthly users.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Strong opener", "Real metric", "Scope", "Outcome"].map((t) => (
                  <span key={t} className="rounded border border-emerald-900/50 bg-emerald-950/30 px-1.5 py-0.5 text-[9.5px] font-semibold text-emerald-300">{t}</span>
                ))}
              </div>

              <p className="mt-3 text-[10.5px] text-slate-500">
                Example only. rawcv never fabricates metrics — you bring the real numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <div className="max-w-xl mb-9">
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white">
              Everything you need to get hired.
            </h2>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
              Professional-grade tools, no paywall in the middle of the flow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3.5">
                <div className="w-9 h-9 shrink-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <Icon name={f.icon} size={16} />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Three steps, one clean page.
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
                No onboarding wizard, no bloated dashboard. Write, preview, export.
              </p>
              <Link href="/build" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Open the builder <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { step: "01", title: "Write or import", desc: "Start from a blank page or upload a PDF/DOCX at /analyze and edit the parsed sections." },
                { step: "02", title: "Tune the page", desc: "Switch themes, adjust type size and spacing, and watch a true A4 page update live." },
                { step: "03", title: "Export anywhere", desc: "Download a selectable-text PDF, an editable Word file, or plain text for job portals." },
              ].map((item) => (
                <div key={item.step} className="border-t-2 border-slate-900 dark:border-white pt-4">
                  <span className="text-[11px] font-bold tracking-[0.16em] text-slate-400 dark:text-slate-500">{item.step}</span>
                  <h3 className="mt-2 text-[14.5px] font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900 dark:bg-slate-900 overflow-hidden">
          <div className="px-6 sm:px-12 py-10 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-[24px] sm:text-[30px] font-bold text-white leading-tight tracking-tight">
                Ready to land more interviews?
              </h2>
              <p className="mt-2 text-[13.5px] text-slate-400 max-w-md">
                Upload a resume for instant AI analysis, or build a new one from scratch. Free, no account.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link href="/build" className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-md bg-white text-slate-900 text-[13px] font-semibold hover:bg-slate-100 transition-colors">
                Build resume <span aria-hidden="true">→</span>
              </Link>
              <Link href="/analyze" className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-white/20 text-white text-[13px] font-semibold hover:bg-white/10 transition-colors">
                Analyze a resume
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 px-4 sm:px-6 py-14 sm:py-16" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Frequently asked questions
          </h2>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="py-4">
                <dt className="font-semibold text-[13.5px] text-slate-900 dark:text-white" itemProp="name">{faq.q}</dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
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
