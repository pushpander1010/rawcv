import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { HeroCTA, FooterCTA, PricingCTA, FooterNav } from "@/components/LandingCTA";

export const metadata: Metadata = {
  title: "rawcv — AI Resume Builder, ATS Score & Job Match Optimizer",
  description:
    "Free AI-powered resume platform. Upload your CV, get an ATS compatibility score, match it to any job description, enhance bullet points with AI, and download a polished PDF resume.",
  alternates: { canonical: "https://www.rawcv.com" },
};

const features = [
  { icon: "📊", title: "ATS Score Analysis", description: "Instantly see how your resume scores against Applicant Tracking Systems with actionable fixes." },
  { icon: "🎯", title: "JD Relevance Match", description: "Paste any job description and get a relevance score with missing keywords and skills highlighted." },
  { icon: "✨", title: "AI Suggestions", description: "Get 3–15 targeted improvements covering action verbs, quantified achievements, and section completeness." },
  { icon: "🔧", title: "Resume Enhancement", description: "Strengthen weak bullet points and your summary with stronger language — no JD required." },
  { icon: "🎨", title: "Visual Themes", description: "Switch between Classic, Modern, Minimal, Executive, and Creative themes with a live preview." },
  { icon: "💬", title: "Chat to Build or Customize", description: "Build a resume from scratch or tweak any section conversationally with an AI chat interface." },
];

const pricingPlans = [
  {
    name: "Starter", price: "₹99", credits: "50 credits", priceUsd: "$1",
    description: "Perfect for a quick resume check.", highlight: false,
    features: ["50 AI credits", "All analysis features", "Theme downloads", "Chat-based building"],
  },
  {
    name: "Pro", price: "₹499", credits: "250 credits", priceUsd: "$5",
    description: "Best value for active job seekers.", highlight: true,
    features: ["250 AI credits", "All analysis features", "Unlimited downloads", "Priority AI models", "Chat-based building"],
  },
  {
    name: "Power", price: "₹999", credits: "500 credits", priceUsd: "$10",
    description: "For power users and career coaches.", highlight: false,
    features: ["500 AI credits", "All analysis features", "Unlimited downloads", "All premium AI models", "Chat-based building"],
  },
];

const faqs = [
  { q: "Is rawcv free to use?", a: "Yes — every new account gets 20 free credits. Free-tier AI models cost 0.5–1 credit per operation, so you can run many analyses before needing to top up." },
  { q: "What file formats are supported?", a: "rawcv accepts PDF, DOCX, and TXT files up to 5 MB." },
  { q: "How does ATS scoring work?", a: "We run rule-based checks (missing sections, keyword density, date formatting) combined with AI analysis to give you a score out of 100 with specific issues to fix." },
  { q: "Will my resume data be stored?", a: "Resume data is held in your browser session only. We do not permanently store your resume content on our servers." },
  { q: "Can I use rawcv on mobile?", a: "Yes — rawcv is fully responsive. The chat and analysis tools work on any device." },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.rawcv.com/#website",
        "url": "https://www.rawcv.com",
        "name": "rawcv",
        "description": "AI-powered resume builder, ATS scorer, and job match optimizer",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.rawcv.com/analyze",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.rawcv.com/#app",
        "name": "rawcv",
        "url": "https://www.rawcv.com",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": [
          { "@type": "Offer", "name": "Starter", "price": "99", "priceCurrency": "INR" },
          { "@type": "Offer", "name": "Pro", "price": "499", "priceCurrency": "INR" },
          { "@type": "Offer", "name": "Power", "price": "999", "priceCurrency": "INR" }
        ],
        "description": "Free AI-powered resume platform. Upload your CV, get an ATS compatibility score, match it to any job description, enhance bullet points with AI, and download a polished PDF resume.",
        "screenshot": "https://www.rawcv.com/og-image.png",
        "featureList": [
          "ATS Score Analysis",
          "Job Description Relevance Match",
          "AI Resume Suggestions",
          "Resume Enhancement",
          "Visual Themes",
          "Chat-based Resume Building"
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.rawcv.com/#org",
        "name": "rawcv",
        "url": "https://www.rawcv.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.rawcv.com/logo.png",
          "width": 512,
          "height": 512
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-violet-200/60 via-blue-100/40 to-transparent dark:from-violet-900/30 dark:via-blue-900/20 blur-3xl" />
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
          <HeroCTA />
        </div>
      </section>

      {/* Hero resume mockup */}
      <section className="pb-16 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-6 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center px-3">
                <span className="text-xs text-gray-400">rawcv.com/analyze</span>
              </div>
            </div>
            {/* App UI mockup */}
            <div className="flex h-72 overflow-hidden">
              {/* Left panel — tools */}
              <div className="w-64 border-r border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
                <div className="h-6 w-24 rounded-lg bg-violet-100 dark:bg-violet-900/40" />
                <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-4/6 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="mt-2 h-10 w-full rounded-xl bg-violet-600 opacity-80" />
                <div className="mt-auto flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-emerald-600 text-lg">📊</span>
                  <div>
                    <div className="h-3 w-16 rounded bg-emerald-200 dark:bg-emerald-800 mb-1" />
                    <div className="text-xs font-bold text-emerald-600">ATS Score: 92</div>
                  </div>
                </div>
              </div>
              {/* Right panel — resume preview */}
              <div className="flex-1 p-5 bg-gray-50 dark:bg-gray-950 overflow-hidden">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 h-full">
                  {/* Resume header */}
                  <div className="border-b-2 border-gray-800 dark:border-gray-200 pb-3 mb-3">
                    <div className="h-5 w-40 rounded bg-gray-800 dark:bg-gray-200 mb-2" />
                    <div className="flex gap-3">
                      <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600" />
                      <div className="h-3 w-20 rounded bg-gray-300 dark:bg-gray-600" />
                      <div className="h-3 w-28 rounded bg-gray-300 dark:bg-gray-600" />
                    </div>
                  </div>
                  {/* Experience section */}
                  <div className="mb-3">
                    <div className="h-3 w-20 rounded bg-gray-400 dark:bg-gray-500 mb-2" />
                    <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700 mb-1" />
                    <div className="h-3 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  {/* Skills */}
                  <div className="flex gap-2 flex-wrap">
                    {["React", "TypeScript", "Node.js", "Python", "AWS"].map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Live preview updates as you chat or apply suggestions</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="features-heading" className="text-3xl font-bold text-center mb-3">
            Everything you need to get hired
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            rawcv combines rule-based ATS checks with the best AI models so you always know exactly what to fix.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                <span className="text-3xl mb-4 block" aria-hidden="true">{f.icon}</span>
                <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" aria-labelledby="how-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="how-heading" className="text-3xl font-bold mb-12">Three steps to a better resume</h2>
          <ol className="flex flex-col sm:flex-row gap-8 text-left" itemScope itemType="https://schema.org/HowTo">
            {[
              { step: "1", title: "Upload your resume", body: "Drag and drop a PDF, DOCX, or TXT file. We parse it into structured data in seconds." },
              { step: "2", title: "Analyze & improve", body: "Run ATS scoring, paste a job description for relevance analysis, and apply AI suggestions." },
              { step: "3", title: "Download your PDF", body: "Pick a theme, accept the changes you like, and download a polished, ATS-safe PDF." },
            ].map((item) => (
              <li key={item.step} className="flex-1 flex gap-4" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                <span aria-hidden="true" className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold mb-1" itemProp="name">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" itemProp="text">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* YouTube Video — helps with engagement signals and rich results */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="video-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="video-heading" className="text-3xl font-bold mb-3">See rawcv in action</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Watch how to upload your resume, get an ATS score, match it to a job description, and download a polished PDF in under 3 minutes.
          </p>
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOdP_8GztsuKi9nrraNbKKp4"
              title="rawcv — AI Resume Builder Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            More tutorials on our{" "}
            <a
              href="https://www.youtube.com/@rawcv"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-violet-600 transition-colors"
            >
              YouTube channel
            </a>
          </p>
        </div>
      </section>

      {/* Why rawcv — keyword-rich content for SEO */}
      <section className="py-20 px-6" aria-labelledby="why-heading">
        <div className="max-w-3xl mx-auto">
          <h2 id="why-heading" className="text-3xl font-bold text-center mb-10">Why use an AI resume builder?</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Over <strong>75% of resumes are rejected by Applicant Tracking Systems (ATS)</strong> before a human ever reads them.
              ATS software scans for keywords, formatting, and section completeness — and most resumes fail silently.
              rawcv&apos;s free ATS resume checker gives you a score out of 100 with specific, actionable fixes so you know exactly what to change.
            </p>
            <p>
              A <strong>job description resume matcher</strong> is equally critical. Recruiters spend an average of 7 seconds on a resume.
              If your skills and experience don&apos;t mirror the language in the job posting, you&apos;re invisible.
              rawcv&apos;s JD relevance tool highlights missing keywords and suggests where to add them naturally.
            </p>
            <p>
              Our <strong>AI resume enhancer</strong> rewrites weak bullet points using strong action verbs and quantified achievements —
              the two things that most consistently improve callback rates. You stay in control: accept, reject, or tweak every suggestion.
            </p>
            <p>
              Whether you&apos;re a <strong>fresher building your first CV</strong>, a mid-career professional switching industries,
              or a career coach helping clients, rawcv gives you professional-grade tools for free.
              Start with 20 free credits — no credit card required.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {[
              "free resume checker", "ATS resume scanner", "AI CV builder", "resume keyword optimizer",
              "job description matcher", "resume score checker", "resume enhancer AI", "CV maker online",
              "ATS friendly resume builder", "resume improvement tool"
            ].map((kw) => (
              <span key={kw} className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50" aria-labelledby="pricing-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="pricing-heading" className="text-3xl font-bold text-center mb-3">Pay only for what you use</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Credits are consumed per AI operation. Every new account starts with 20 free credits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-6 border flex flex-col ${plan.highlight ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-lg" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white">Most popular</span>
                )}
                <div className="mb-4">
                  <p className="font-semibold text-base">{plan.name}</p>
                  <p className="text-3xl font-extrabold mt-1">{plan.price}<span className="text-sm font-normal text-gray-400 ml-1">/ {plan.credits}</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">{plan.priceUsd} USD</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-4 h-4 text-violet-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <PricingCTA highlight={plan.highlight} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — structured data for Google */}
      <section className="py-20 px-6" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto">
          <h2 id="faq-heading" className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <dl className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div key={faq.q} itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
                <dt className="font-semibold text-gray-900 dark:text-gray-100 mb-1" itemProp="name">{faq.q}</dt>
                <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <span itemProp="text">{faq.a}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FooterCTA />

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-bold text-gray-700 dark:text-gray-300">rawcv</span>
          <FooterNav />
          <p>© {new Date().getFullYear()} rawcv. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
