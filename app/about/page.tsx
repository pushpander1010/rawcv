import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "About rawcv — AI Resume Builder & ATS Optimizer",
  description:
    "Learn about rawcv — the free AI-powered resume platform that helps job seekers build, analyze, and optimize resumes with ATS scoring, JD matching, and AI suggestions.",
  alternates: { canonical: "https://www.rawcv.com/about" },
  openGraph: {
    title: "About rawcv — AI Resume Builder & ATS Optimizer",
    description:
      "rawcv helps job seekers build better resumes with AI. ATS scoring, job description matching, AI suggestions, and polished PDF downloads — free to start.",
    url: "https://www.rawcv.com/about",
    type: "website",
  },
};

const FEATURES = [
  {
    icon: "📊",
    title: "ATS Score Analysis",
    desc: "Applicant Tracking Systems filter out up to 75% of resumes before a human ever reads them. rawcv runs the same checks — missing sections, keyword density, date formatting, contact info — and gives you a score out of 100 with specific fixes.",
  },
  {
    icon: "🎯",
    title: "Job Description Matching",
    desc: "Paste any job posting and instantly see your relevance score, the keywords you're missing, and which skills to highlight. Stop guessing what each employer wants and tailor your resume with confidence.",
  },
  {
    icon: "✨",
    title: "AI Suggestions",
    desc: "Get 3–15 targeted improvements covering weak action verbs, missing quantified achievements, and incomplete sections — all specific to your resume content, not generic advice.",
  },
  {
    icon: "🔧",
    title: "Resume Enhancement",
    desc: "Transform vague responsibilities into strong, results-driven statements. Our AI rewrites weak bullet points while keeping your voice and facts intact — no JD required.",
  },
  {
    icon: "💬",
    title: "Chat-based Resume Building",
    desc: "No resume yet? Describe your experience conversationally and our AI builds a formatted, professional resume for you. Edit any section by just telling the AI what to change.",
  },
  {
    icon: "🎨",
    title: "Visual Themes & PDF Download",
    desc: "Choose from Classic, Modern, Minimal, Executive, or Creative themes. Preview your resume live and download a clean, ATS-safe PDF ready to submit to any employer.",
  },
];

const VALUES = [
  {
    title: "Privacy first",
    desc: "Your resume content is processed in-memory and never permanently stored on our servers. We don't sell your data or use it to train AI models.",
  },
  {
    title: "Honest AI",
    desc: "AI suggestions are clearly labelled as AI-generated. We always remind you to review and verify any content before submitting it to employers.",
  },
  {
    title: "No dark patterns",
    desc: "No sign-up walls, no hidden fees, no tricks. Just upload your resume and get instant AI-powered analysis.",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://www.rawcv.com/about",
    "url": "https://www.rawcv.com/about",
    "name": "About rawcv",
    "description": "rawcv is a free AI-powered resume platform that helps job seekers build, analyze, and optimize resumes.",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.rawcv.com/#website",
    },
    "about": {
      "@type": "SoftwareApplication",
      "@id": "https://www.rawcv.com/#app",
      "name": "rawcv",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://www.rawcv.com",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-6 pt-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 dark:from-slate-900 to-white dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-16">
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-center md:text-left">
            <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-brand-100 text-brand-700 dark:text-brand-300 uppercase">
              Our Vision
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">About rawcv</h1>
            <p className="text-slate-500 dark:text-slate-300 max-w-xl mx-auto md:mx-0 text-lg leading-relaxed">
              A free AI-powered resume platform built to help every job seeker compete on equal footing — regardless of budget or background.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/analyze"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Get started free
              </Link>
              <Link
                href="/how-to"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Read the guide
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-brand-100 dark:border-brand-800 bg-white dark:bg-slate-900 p-1.5 transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src="/ats_illustration.jpg" 
                alt="rawcv ATS Optimization Illustration" 
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-20">

        {/* Mission */}
        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-2xl font-bold mb-4">Our mission</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Most resume advice is generic. Most resume tools are expensive. And most job seekers have no idea why their applications aren&apos;t getting responses.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            rawcv was built to change that. We give every job seeker access to the same AI-powered analysis that was previously only available through expensive career coaches or enterprise HR software. Upload your resume, get a real ATS score, see exactly what&apos;s missing, and fix it — in minutes, not days.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We believe a well-crafted resume shouldn&apos;t require a subscription or a career coach. It should be accessible to anyone with an internet connection and 20 minutes to spare.
          </p>
        </section>

        {/* What rawcv does */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-bold mb-8">What rawcv does</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-5"
              >
                <div className="text-2xl mb-3" aria-hidden="true">{f.icon}</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-bold mb-6">How it works</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            rawcv is a web application — no download or installation required. It runs entirely in your browser and connects to AI models via a secure server-side proxy. Your resume content is never stored permanently; it lives in your browser session only.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Under the hood, rawcv uses large language models (LLMs) accessed via OpenRouter to power its analysis, suggestion, and enhancement features. The ATS scoring combines rule-based checks with AI analysis to give you a comprehensive, actionable score.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            PDF generation happens server-side using mupdf, producing clean, ATS-safe documents that render correctly in every applicant tracking system.
          </p>
        </section>

        {/* Values */}
        <section aria-labelledby="values-heading">
          <h2 id="values-heading" className="text-2xl font-bold mb-8">Our values</h2>
          <dl className="grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-5">
                <dt className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">{v.title}</dt>
                <dd className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">{v.desc}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Contact */}
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl font-bold mb-4">Contact</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
            Have a question, found a bug, or want to give feedback? We&apos;d love to hear from you.
          </p>
          <ul className="text-sm space-y-1">
            <li>
              General:{" "}
              <a href="mailto:support@rawcv.com" className="text-brand-600 hover:underline">
                support@rawcv.com
              </a>
            </li>
            <li>
              Privacy:{" "}
              <a href="mailto:privacy@rawcv.com" className="text-brand-600 hover:underline">
                privacy@rawcv.com
              </a>
            </li>
          </ul>
        </section>

        {/* Footer links */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 flex flex-wrap gap-4">
          <Link href="/" className="text-brand-600 hover:underline">Home</Link>
          <Link href="/how-to" className="text-brand-600 hover:underline">How-to guide</Link>
          <Link href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-brand-600 hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}