"use client";

import Link from "next/link";
import ResumeUploader from "@/components/ResumeUploader";

const features = [
  {
    icon: "📊",
    title: "ATS Score Analysis",
    description:
      "Instantly see how your resume scores against Applicant Tracking Systems with actionable fixes.",
  },
  {
    icon: "🎯",
    title: "JD Relevance Match",
    description:
      "Paste any job description and get a relevance score with missing keywords and skills highlighted.",
  },
  {
    icon: "✨",
    title: "AI Suggestions",
    description:
      "Get 3–15 targeted improvements covering action verbs, quantified achievements, and section completeness.",
  },
  {
    icon: "🔧",
    title: "Resume Enhancement",
    description:
      "Strengthen weak bullet points and your summary with stronger language — no JD required.",
  },
  {
    icon: "🎨",
    title: "100+ Visual Themes",
    description:
      "Switch between Classic, Modern, Minimal, Executive, and Creative themes with a live preview.",
  },
  {
    icon: "💬",
    title: "Chat to Build or Customize",
    description:
      "Build a resume from scratch or tweak any section conversationally with an AI chat interface.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$5",
    credits: "100 credits",
    description: "Perfect for a single job application sprint.",
    highlight: false,
    features: [
      "100 AI credits",
      "All analysis features",
      "5 theme downloads",
      "Chat-based building",
    ],
  },
  {
    name: "Pro",
    price: "$15",
    credits: "400 credits",
    description: "Best value for active job seekers.",
    highlight: true,
    features: [
      "400 AI credits",
      "All analysis features",
      "Unlimited downloads",
      "Priority AI models",
      "Chat-based building",
    ],
  },
  {
    name: "Power",
    price: "$35",
    credits: "1,000 credits",
    description: "For recruiters and career coaches.",
    highlight: false,
    features: [
      "1,000 AI credits",
      "All analysis features",
      "Unlimited downloads",
      "All premium AI models",
      "Chat-based building",
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        {/* Background gradient blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/60 via-blue-100/40 to-transparent dark:from-violet-900/30 dark:via-blue-900/20 blur-3xl"
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 uppercase">
            AI-Powered Resume Platform
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Land more interviews
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              with a smarter resume
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10">
            Upload your CV, get an ATS score, match it to any job description, enhance it with AI,
            and download a polished PDF — all in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              💬 Build from scratch
            </Link>
          </div>

          {/* Upload CTA */}
          <div className="max-w-lg mx-auto">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
              Already have a resume? Drop it here to get started instantly.
            </p>
            <ResumeUploader />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <h2
            id="features-heading"
            className="text-3xl font-bold text-center mb-3"
          >
            Everything you need to get hired
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            rawcv combines rule-based ATS checks with the best AI models so you always know exactly
            what to fix.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-4 block" aria-hidden="true">
                  {f.icon}
                </span>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" aria-labelledby="how-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="how-heading" className="text-3xl font-bold mb-12">
            Three steps to a better resume
          </h2>
          <ol className="flex flex-col sm:flex-row gap-8 text-left">
            {[
              {
                step: "1",
                title: "Upload your resume",
                body: "Drag and drop a PDF, DOCX, or TXT file. We parse it into structured data in seconds.",
              },
              {
                step: "2",
                title: "Analyze & improve",
                body: "Run ATS scoring, paste a job description for relevance analysis, and apply AI suggestions.",
              },
              {
                step: "3",
                title: "Download your PDF",
                body: "Pick a theme, accept the changes you like, and download a polished, ATS-safe PDF.",
              },
            ].map((item) => (
              <li key={item.step} className="flex-1 flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center"
                >
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section
        className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50"
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2 id="pricing-heading" className="text-3xl font-bold text-center mb-3">
            Pay only for what you use
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Credits are consumed per AI operation. Choose a bundle that fits your job search.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border flex flex-col ${
                  plan.highlight
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white">
                    Most popular
                  </span>
                )}
                <div className="mb-4">
                  <p className="font-semibold text-base">{plan.name}</p>
                  <p className="text-3xl font-extrabold mt-1">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      / {plan.credits}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <svg
                        className="w-4 h-4 text-violet-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/credits"
                  className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    plan.highlight
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to upgrade your resume?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Upload your resume now — no account required to get started.
        </p>
        <div className="max-w-lg mx-auto">
          <ResumeUploader />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-bold text-gray-700 dark:text-gray-300">rawcv</span>
          <nav className="flex gap-6" aria-label="Footer navigation">
            <Link href="/credits" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Pricing
            </Link>
            <Link href="/chat" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Build Resume
            </Link>
            <Link href="/login" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              Sign in
            </Link>
          </nav>
          <p>© {new Date().getFullYear()} rawcv. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
